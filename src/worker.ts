import { SESSION_COOKIE, createSession, passwordMatches, readCookie, sha256Hex, verifySession } from "./auth";
import { validateEntry } from "./domain";

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  SIGNATURE: string;
  ADMIN_PASSWORD: string;
  SESSION_SECRET: string;
}

const RATE_WINDOW_SECONDS = 10 * 60;
// Mobile carriers share public IPs (CGNAT), so the submit limit stays generous.
const RATE_LIMITS = { submit: 40, login: 8 } as const;
const MAX_BODY_BYTES = 2_000;

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "same-origin",
  "Cache-Control": "no-store",
};

function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...SECURITY_HEADERS, ...headers },
  });
}

async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  const length = Number(request.headers.get("Content-Length") ?? "0");
  if (length > MAX_BODY_BYTES) return null;
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return null;
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function isOpen(env: Env): Promise<boolean> {
  const row = await env.DB.prepare("SELECT value FROM settings WHERE key = 'open'").first<{ value: string }>();
  return row?.value !== "0";
}

async function entryCount(env: Env): Promise<number> {
  const row = await env.DB.prepare("SELECT COUNT(*) AS n FROM entries").first<{ n: number }>();
  return row?.n ?? 0;
}

/** Returns true when the caller is over the limit. Counts every attempt. */
async function overRateLimit(request: Request, env: Env, bucket: keyof typeof RATE_LIMITS): Promise<boolean> {
  const ip = request.headers.get("CF-Connecting-IP") ?? "local";
  const ipHash = await sha256Hex(`${env.SESSION_SECRET}:${bucket}:${ip}`);
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % RATE_WINDOW_SECONDS);
  const row = await env.DB.prepare(
    `INSERT INTO rate_limits (ip_hash, window_start, count) VALUES (?1, ?2, 1)
     ON CONFLICT (ip_hash, window_start) DO UPDATE SET count = count + 1
     RETURNING count`,
  )
    .bind(ipHash, windowStart)
    .first<{ count: number }>();
  // Opportunistic cleanup of old windows.
  if (Math.random() < 0.05) {
    await env.DB.prepare("DELETE FROM rate_limits WHERE window_start < ?1").bind(windowStart - RATE_WINDOW_SECONDS).run();
  }
  return (row?.count ?? 0) > RATE_LIMITS[bucket];
}

async function handleStats(env: Env): Promise<Response> {
  const [open, count] = await Promise.all([isOpen(env), entryCount(env)]);
  return json({ open, count, signature: env.SIGNATURE ?? "" }, 200, { "Cache-Control": "public, max-age=15" });
}

async function handleSubmit(request: Request, env: Env): Promise<Response> {
  const body = await readJson(request);
  if (!body) return json({ error: "invalid_request", message: "No pudimos leer los datos. Probá de nuevo." }, 400);

  // Honeypot: real people never fill the hidden "website" field. Pretend success.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return json({ ok: true, duplicate: false, count: await entryCount(env) });
  }

  if (!(await isOpen(env))) {
    return json({ error: "closed", message: "La lista ya está cerrada. ¡Gracias por acompañar!" }, 409);
  }

  if (await overRateLimit(request, env, "submit")) {
    return json({ error: "rate_limited", message: "Recibimos muchos envíos desde tu conexión. Esperá unos minutos." }, 429);
  }

  const result = validateEntry(body, new Date().getUTCFullYear());
  if (!result.ok) return json({ error: "validation", errors: result.errors }, 422);

  const { name, nameKey, birthDate } = result.value;
  const insert = await env.DB.prepare(
    "INSERT INTO entries (name, name_key, birth_date) VALUES (?1, ?2, ?3) ON CONFLICT (name_key, birth_date) DO NOTHING",
  )
    .bind(name, nameKey, birthDate)
    .run();

  const duplicate = (insert.meta.changes ?? 0) === 0;
  return json({ ok: true, duplicate, name, count: await entryCount(env) }, duplicate ? 200 : 201);
}

async function requireAdmin(request: Request, env: Env): Promise<boolean> {
  return verifySession(readCookie(request, SESSION_COOKIE), env.SESSION_SECRET);
}

function sessionCookie(value: string, maxAge: number, secure: boolean): string {
  return `${SESSION_COOKIE}=${value}; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;
}

async function handleLogin(request: Request, env: Env): Promise<Response> {
  if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) {
    return json({ error: "not_configured", message: "Falta configurar ADMIN_PASSWORD y SESSION_SECRET." }, 500);
  }
  if (await overRateLimit(request, env, "login")) {
    return json({ error: "rate_limited", message: "Demasiados intentos. Esperá unos minutos." }, 429);
  }
  const body = await readJson(request);
  const password = typeof body?.password === "string" ? body.password : "";
  if (!(await passwordMatches(password, env.ADMIN_PASSWORD, env.SESSION_SECRET))) {
    return json({ error: "unauthorized", message: "Contraseña incorrecta." }, 401);
  }
  const session = await createSession(env.SESSION_SECRET);
  const secure = new URL(request.url).protocol === "https:";
  return json({ ok: true }, 200, { "Set-Cookie": sessionCookie(session.value, session.maxAge, secure) });
}

async function handleAdmin(request: Request, env: Env, path: string): Promise<Response> {
  if (path === "/api/admin/login" && request.method === "POST") return handleLogin(request, env);

  if (!(await requireAdmin(request, env))) {
    return json({ error: "unauthorized", message: "Iniciá sesión." }, 401);
  }

  if (path === "/api/admin/logout" && request.method === "POST") {
    const secure = new URL(request.url).protocol === "https:";
    return json({ ok: true }, 200, { "Set-Cookie": sessionCookie("", 0, secure) });
  }

  if (path === "/api/admin/entries" && request.method === "GET") {
    const [{ results }, open] = await Promise.all([
      env.DB.prepare("SELECT id, name, birth_date AS birthDate, created_at AS createdAt FROM entries ORDER BY id").all(),
      isOpen(env),
    ]);
    return json({ open, entries: results });
  }

  const deleteMatch = path.match(/^\/api\/admin\/entries\/(\d+)$/);
  if (deleteMatch && request.method === "DELETE") {
    const result = await env.DB.prepare("DELETE FROM entries WHERE id = ?1").bind(Number(deleteMatch[1])).run();
    return json({ ok: true, deleted: result.meta.changes ?? 0 });
  }

  if (path === "/api/admin/status" && request.method === "POST") {
    const body = await readJson(request);
    if (typeof body?.open !== "boolean") return json({ error: "invalid_request" }, 400);
    await env.DB.prepare("UPDATE settings SET value = ?1 WHERE key = 'open'").bind(body.open ? "1" : "0").run();
    return json({ ok: true, open: body.open });
  }

  return json({ error: "not_found" }, 404);
}

/** Rejects cross-site state-changing requests (CSRF defense in depth on top of SameSite). */
function sameOrigin(request: Request): boolean {
  if (request.method === "GET" || request.method === "HEAD") return true;
  const origin = request.headers.get("Origin");
  return origin === null || origin === new URL(request.url).origin;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (!path.startsWith("/api/")) return env.ASSETS.fetch(request);
    if (!sameOrigin(request)) return json({ error: "forbidden" }, 403);

    try {
      if (path === "/api/stats" && request.method === "GET") return await handleStats(env);
      if (path === "/api/entries" && request.method === "POST") return await handleSubmit(request, env);
      if (path.startsWith("/api/admin/")) return await handleAdmin(request, env, path);
      return json({ error: "not_found" }, 404);
    } catch (error) {
      console.error("request failed", path, error);
      return json({ error: "server_error", message: "Algo falló de nuestro lado. Probá de nuevo en un rato." }, 500);
    }
  },
} satisfies ExportedHandler<Env>;
