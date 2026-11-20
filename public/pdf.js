// Builds the printable wish list. Pure: receives the pdf-lib namespace, fontkit and font bytes,
// so it runs both in the admin browser page and under Node tests.

const A4 = [595.28, 841.89];
const MARGIN = 36;
const COLUMNS = 3;
const GUTTER = 16;
const NAME_SIZE = 9;
const DATE_SIZE = 8;
const LINE = 11.5;
const ENTRY_GAP = 3;
const HEADER_HEIGHT = 46;
const FOOTER_HEIGHT = 20;

const INK = [0.16, 0.04, 0.06];
const RED = [0.66, 0.06, 0.16];
const SOFT = [0.42, 0.29, 0.31];

/** 'YYYY-MM-DD' → 'DD/MM/YYYY' without Date (avoids timezone shifts). */
export function formatBirthDate(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function sortEntries(entries) {
  const collator = new Intl.Collator("es", { sensitivity: "base" });
  return [...entries].sort((a, b) => collator.compare(a.name, b.name) || a.birthDate.localeCompare(b.birthDate));
}

/** Word-wraps text to maxWidth; breaks single words that are too long on their own. */
function wrap(text, font, size, maxWidth) {
  const lines = [];
  let current = "";
  for (const word of text.split(" ")) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
      continue;
    }
    if (current) lines.push(current);
    current = word;
    while (font.widthOfTextAtSize(current, size) > maxWidth) {
      let cut = current.length - 1;
      while (cut > 1 && font.widthOfTextAtSize(current.slice(0, cut), size) > maxWidth) cut--;
      lines.push(current.slice(0, cut));
      current = current.slice(cut);
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * @param {{ PDFLib: any, fontkit: any, entries: {name: string, birthDate: string}[],
 *           fonts: { regular: ArrayBuffer|Uint8Array, semibold: ArrayBuffer|Uint8Array },
 *           title?: string, generatedOn: string }} input
 * @returns {Promise<Uint8Array>}
 */
export async function buildWishListPdf({ PDFLib, fontkit, entries, fonts, title = "Bebés 2027", generatedOn }) {
  const { PDFDocument, rgb } = PDFLib;
  const color = (c) => rgb(c[0], c[1], c[2]);

  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  doc.setTitle(`${title} — lista de deseos`);
  doc.setCreator(title);
  const regular = await doc.embedFont(fonts.regular, { subset: true });
  const semibold = await doc.embedFont(fonts.semibold, { subset: true });

  const [pageWidth, pageHeight] = A4;
  const columnWidth = (pageWidth - MARGIN * 2 - GUTTER * (COLUMNS - 1)) / COLUMNS;
  const sorted = sortEntries(entries);

  // Lay out every entry as a block of lines, then flow blocks into columns and pages.
  const blocks = sorted.map((entry) => {
    const date = formatBirthDate(entry.birthDate);
    const nameLines = wrap(entry.name, semibold, NAME_SIZE, columnWidth);
    const last = nameLines[nameLines.length - 1];
    const dateWidth = regular.widthOfTextAtSize(date, DATE_SIZE);
    const sameLine = semibold.widthOfTextAtSize(last, NAME_SIZE) + 6 + dateWidth <= columnWidth;
    const height = (nameLines.length + (sameLine ? 0 : 1)) * LINE + ENTRY_GAP;
    return { nameLines, date, dateWidth, sameLine, height };
  });

  const pages = [];
  let page;
  let column = 0;
  let y = 0;
  let top = 0;

  const newPage = () => {
    page = doc.addPage(A4);
    pages.push(page);
    column = 0;
    top = pageHeight - MARGIN - (pages.length === 1 ? HEADER_HEIGHT : 0);
    y = top;
  };

  newPage();
  page.drawText(title, { x: MARGIN, y: pageHeight - MARGIN - 18, size: 20, font: semibold, color: color(RED) });
  const summary = `${sorted.length} ${sorted.length === 1 ? "deseo" : "deseos"} · ${generatedOn}`;
  page.drawText(summary, {
    x: pageWidth - MARGIN - regular.widthOfTextAtSize(summary, 9),
    y: pageHeight - MARGIN - 16,
    size: 9,
    font: regular,
    color: color(SOFT),
  });
  page.drawLine({
    start: { x: MARGIN, y: pageHeight - MARGIN - 28 },
    end: { x: pageWidth - MARGIN, y: pageHeight - MARGIN - 28 },
    thickness: 0.6,
    color: color(RED),
  });

  const bottom = MARGIN + FOOTER_HEIGHT;
  for (const block of blocks) {
    if (y - block.height < bottom) {
      column += 1;
      if (column >= COLUMNS) newPage();
      y = top;
    }
    const x = MARGIN + column * (columnWidth + GUTTER);
    block.nameLines.forEach((line, i) => {
      y -= LINE;
      page.drawText(line, { x, y, size: NAME_SIZE, font: semibold, color: color(INK) });
      if (i === block.nameLines.length - 1 && block.sameLine) {
        page.drawText(block.date, { x: x + columnWidth - block.dateWidth, y, size: DATE_SIZE, font: regular, color: color(SOFT) });
      }
    });
    if (!block.sameLine) {
      y -= LINE;
      page.drawText(block.date, { x: x + columnWidth - block.dateWidth, y, size: DATE_SIZE, font: regular, color: color(SOFT) });
    }
    y -= ENTRY_GAP;
  }

  pages.forEach((p, i) => {
    const label = `${i + 1} / ${pages.length}`;
    p.drawText(label, {
      x: pageWidth / 2 - regular.widthOfTextAtSize(label, 8) / 2,
      y: MARGIN - 8,
      size: 8,
      font: regular,
      color: color(SOFT),
    });
  });

  return doc.save();
}
