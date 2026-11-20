// Stateless admin session: cookie = "<expiresAtMs>.<hmac>" signed with SESSION_SECRET.

export const SESSION_COOKIE = "b27_admin";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const encoder = new TextEncoder();

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string): Uint8Array | null {
  if (!/^[0-9a-f]+$/.test(hex) || hex.length % 2 !== 0) return null;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

/** Constant-time password check: compares HMACs of both values. */
export async function passwordMatches(candidate: string, expected: string, secret: string): Promise<boolean> {
  const key = await hmacKey(secret);
  const [a, b] = await Promise.all([
    crypto.subtle.sign("HMAC", key, encoder.encode(candidate)),
    crypto.subtle.sign("HMAC", key, encoder.encode(expected)),
  ]);
  const x = new Uint8Array(a);
  const y = new Uint8Array(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

export async function createSession(secret: string, now = Date.now()): Promise<{ value: string; maxAge: number }> {
  const expires = String(now + SESSION_TTL_MS);
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(secret), encoder.encode(expires));
  return { value: `${expires}.${toHex(signature)}`, maxAge: SESSION_TTL_MS / 1000 };
}

export async function verifySession(value: string | undefined, secret: string, now = Date.now()): Promise<boolean> {
  if (!value) return false;
  const [expires, hex] = value.split(".");
  if (!expires || !hex || !/^\d+$/.test(expires) || Number(expires) < now) return false;
  const signature = fromHex(hex);
  if (!signature) return false;
  return crypto.subtle.verify("HMAC", await hmacKey(secret), signature, encoder.encode(expires));
}

export function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get("Cookie") ?? "";
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return undefined;
}

export async function sha256Hex(text: string): Promise<string> {
  return toHex(await crypto.subtle.digest("SHA-256", encoder.encode(text)));
}
