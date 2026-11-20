import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import * as PDFLib from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { buildWishListPdf, sortEntries } from "../public/pdf.js";

const fonts = {
  regular: readFileSync("public/fonts/figtree-regular.ttf"),
  semibold: readFileSync("public/fonts/figtree-semibold.ttf"),
};

const first = ["María", "Ñusta", "Zoë", "Agustina", "Lucía", "Ana-Sofía", "Florencia", "Belén", "Valentina", "Rocío"];
const last = ["Núñez", "Pérez", "D'Angelo", "González", "Agüero", "Fernández", "López", "Castro"];

function sampleEntries(n) {
  return Array.from({ length: n }, (_, i) => ({
    name: `${first[i % first.length]} ${last[(i * 7) % last.length]}`,
    birthDate: `19${70 + (i % 30)}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
  }));
}

test("sorts names alphabetically in Spanish, accent-insensitive", () => {
  const sorted = sortEntries([
    { name: "Zoë", birthDate: "1990-01-01" },
    { name: "Ángela", birthDate: "1990-01-01" },
    { name: "Ana", birthDate: "1990-01-01" },
  ]);
  assert.deepEqual(sorted.map((e) => e.name), ["Ana", "Ángela", "Zoë"]);
});

test("builds a multi-page PDF for 5,000 entries including long names", async () => {
  const entries = sampleEntries(5000);
  entries.push({ name: "María de los Ángeles Guadalupe Fernández de la Cruz Montenegro", birthDate: "1988-12-31" });
  entries.push({ name: "Maximilianaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", birthDate: "1990-06-15" });

  const started = Date.now();
  const bytes = await buildWishListPdf({ PDFLib, fontkit, entries, fonts, generatedOn: "19 de noviembre de 2026" });
  const elapsed = Date.now() - started;

  const doc = await PDFLib.PDFDocument.load(bytes);
  assert.ok(doc.getPageCount() > 10, `pages: ${doc.getPageCount()}`);
  mkdirSync(".wrangler/tmp", { recursive: true });
  writeFileSync(".wrangler/tmp/sample.pdf", bytes);
  console.log(`5002 entries → ${doc.getPageCount()} pages, ${(bytes.length / 1024).toFixed(0)} KB, ${elapsed} ms`);
});

test("builds an empty list without failing", async () => {
  const bytes = await buildWishListPdf({ PDFLib, fontkit, entries: [], fonts, generatedOn: "hoy" });
  const doc = await PDFLib.PDFDocument.load(bytes);
  assert.equal(doc.getPageCount(), 1);
});
