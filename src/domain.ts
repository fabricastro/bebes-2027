// Pure domain rules for wish entries. No I/O; safe to unit test under Node.

export const NAME_MAX = 60;
export const NAME_MIN = 2;
export const MIN_AGE = 12;
export const MAX_AGE = 70;

// Latin letters (accents, ñ, ü included), spaces, apostrophes, hyphens and dots.
// Restricted to Latin because the printed PDF embeds a Latin/Latin-ext font.
const NAME_PATTERN = /^\p{Script=Latin}[\p{Script=Latin}\p{M}' .\-’]*$/u;

export type ValidEntry = { name: string; nameKey: string; birthDate: string };
export type ValidationError = { field: "name" | "birthDate"; message: string };
export type ValidationResult =
  | { ok: true; value: ValidEntry }
  | { ok: false; errors: ValidationError[] };

export function cleanName(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.normalize("NFC").replace(/\s+/g, " ").trim();
}

/** Accent- and case-insensitive key used to detect duplicates. */
export function nameKey(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function toInt(raw: unknown): number | null {
  const text = typeof raw === "number" ? String(raw) : typeof raw === "string" ? raw.trim() : "";
  return /^\d{1,4}$/.test(text) ? Number(text) : null;
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** Builds an ISO date string from parts without ever going through local time. */
export function isoDate(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** 'YYYY-MM-DD' → 'DD/MM/YYYY' by string manipulation (no timezone shifts). */
export function formatBirthDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function validateEntry(
  input: { name?: unknown; day?: unknown; month?: unknown; year?: unknown },
  currentYear: number,
): ValidationResult {
  const errors: ValidationError[] = [];

  const name = cleanName(input.name);
  if (name.length < NAME_MIN) {
    errors.push({ field: "name", message: "Escribí tu nombre." });
  } else if (name.length > NAME_MAX) {
    errors.push({ field: "name", message: `El nombre puede tener hasta ${NAME_MAX} caracteres.` });
  } else if (!NAME_PATTERN.test(name)) {
    errors.push({ field: "name", message: "Usá solo letras, espacios y guiones." });
  }

  const day = toInt(input.day);
  const month = toInt(input.month);
  const year = toInt(input.year);
  let birthDate = "";
  if (day === null || month === null || year === null) {
    errors.push({ field: "birthDate", message: "Completá día, mes y año." });
  } else if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) {
    errors.push({ field: "birthDate", message: "Esa fecha no existe. Revisá día y mes." });
  } else if (year > currentYear - MIN_AGE || year < currentYear - MAX_AGE) {
    errors.push({ field: "birthDate", message: "Revisá el año de nacimiento." });
  } else {
    birthDate = isoDate(year, month, day);
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, value: { name, nameKey: nameKey(name), birthDate } };
}
