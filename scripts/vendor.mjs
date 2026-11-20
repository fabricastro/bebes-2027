// Copies browser builds of the PDF libraries into public/vendor (served to /admin only).
import { copyFileSync, mkdirSync } from "node:fs";

const files = [
  ["node_modules/pdf-lib/dist/pdf-lib.min.js", "public/vendor/pdf-lib.min.js"],
  ["node_modules/@pdf-lib/fontkit/dist/fontkit.umd.min.js", "public/vendor/fontkit.umd.min.js"],
];
mkdirSync("public/vendor", { recursive: true });
for (const [from, to] of files) copyFileSync(from, to);
console.log(`vendored ${files.length} files`);
