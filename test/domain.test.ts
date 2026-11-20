import { test } from "node:test";
import assert from "node:assert/strict";
import { formatBirthDate, nameKey, validateEntry } from "../src/domain.ts";

const YEAR = 2026;

test("accepts a valid entry and builds an ISO date", () => {
  const result = validateEntry({ name: "  María   José Núñez ", day: "7", month: "3", year: "1992" }, YEAR);
  assert.deepEqual(result, {
    ok: true,
    value: { name: "María José Núñez", nameKey: "maria jose nunez", birthDate: "1992-03-07" },
  });
});

test("accepts accents, ñ, ü, apostrophes and hyphens", () => {
  for (const name of ["Agüero", "D'Angelo", "Ana-Sofía", "Peña", "Zoë"]) {
    assert.equal(validateEntry({ name, day: 1, month: 1, year: 1990 }, YEAR).ok, true, name);
  }
});

test("rejects emoji, digits and non-Latin scripts", () => {
  for (const name of ["Ana 🌸", "Ana2", "Мария", "<script>"]) {
    const result = validateEntry({ name, day: 1, month: 1, year: 1990 }, YEAR);
    assert.equal(result.ok, false, name);
  }
});

test("rejects impossible and out-of-range dates", () => {
  const cases = [
    { day: 31, month: 2, year: 1990 },
    { day: 29, month: 2, year: 1991 },
    { day: 1, month: 13, year: 1990 },
    { day: 1, month: 1, year: 2020 },
    { day: 1, month: 1, year: 1900 },
    { day: "", month: 1, year: 1990 },
  ];
  for (const c of cases) assert.equal(validateEntry({ name: "Ana", ...c }, YEAR).ok, false, JSON.stringify(c));
});

test("accepts Feb 29 on a leap year", () => {
  assert.equal(validateEntry({ name: "Ana", day: 29, month: 2, year: 1992 }, YEAR).ok, true);
});

test("dedupe key ignores case and accents", () => {
  assert.equal(nameKey("MARÍA  Pérez"), nameKey("maria perez"));
});

test("formats ISO dates without timezone shifts", () => {
  assert.equal(formatBirthDate("1992-03-07"), "07/03/1992");
});
