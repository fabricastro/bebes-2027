// Builds pages/dist: static files from public/ plus the Worker bundled as Pages advanced-mode _worker.js.
import { build } from "esbuild";
import { cpSync, rmSync } from "node:fs";

const OUT = "pages/dist";
rmSync(OUT, { recursive: true, force: true });
cpSync("public", OUT, {
  recursive: true,
  filter: (src) => !/(\.webp\.json|\.assetsignore|\/__[^/]*)$/.test(src),
});
await build({
  entryPoints: ["src/worker.ts"],
  outfile: `${OUT}/_worker.js`,
  bundle: true,
  format: "esm",
  platform: "neutral",
  target: "es2022",
  minify: true,
});
console.log(`built ${OUT}`);
