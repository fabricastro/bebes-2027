const $ = (id) => document.getElementById(id);

const ribbon = $("ribbon");
const form = $("wish-form");
const nameInput = $("name");
const dayInput = $("day");
const monthInput = $("month");
const yearInput = $("year");
const submitButton = $("submit");
const stampName = $("stamp-name");
const stampDate = $("stamp-date");
const statusLine = $("form-status");
const done = $("done");
const closed = $("closed");
const counter = $("counter");
const count = $("count");
const countNoun = $("count-noun");

const numberFormat = new Intl.NumberFormat("es-AR");
const chain = $("chain");
const chainMore = $("chain-more");
const MAX_PIECES = 120;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let shownCount = 0;

function piece() {
  const li = document.createElement("li");
  li.className = "chain__piece";
  return li;
}

/** Draws one anonymous ribbon piece per wish, capped, with the overflow as text. */
function renderChain(n) {
  const target = Math.min(n, MAX_PIECES);
  while (chain.children.length < target) chain.append(piece());
  while (chain.children.length > target) chain.lastElementChild.remove();
  const extra = n - target;
  chainMore.hidden = extra <= 0;
  chainMore.textContent = extra > 0 ? `y ${numberFormat.format(extra)} más` : "";
}

function setCount(n) {
  if (typeof n !== "number" || n < 1) return;
  shownCount = n;
  count.textContent = numberFormat.format(n);
  countNoun.textContent = n === 1 ? "deseo" : "deseos";
  counter.hidden = false;
  renderChain(n);
}

/** The stamped name leaves the ribbon and ties itself onto the end of the chain. */
async function flyIntoChain(newCount) {
  const from = stampName.getBoundingClientRect();
  const atCap = chain.children.length >= MAX_PIECES;
  if (!atCap) chain.append(piece());
  const last = chain.lastElementChild;
  if (!last || reducedMotion || !("animate" in Element.prototype)) return setCount(newCount);

  last.style.visibility = "hidden";
  const to = last.getBoundingClientRect();
  const flight = document.createElement("p");
  flight.className = "flight";
  flight.textContent = stampName.textContent;
  Object.assign(flight.style, {
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
    fontSize: getComputedStyle(stampName).fontSize,
  });
  document.body.append(flight);
  const dx = to.left - from.left;
  const dy = to.top - from.top;
  const sx = to.width / from.width;
  const sy = to.height / from.height;
  await flight.animate(
    [
      { transform: "none", opacity: 1, color: "var(--gold-deep)" },
      { transform: `translate(${dx * 0.4}px, ${dy * 0.55}px) scale(${Math.max(sx, 0.5)}, ${Math.max(sy, 0.5)}) rotate(-6deg)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.6, color: "transparent" },
    ],
    { duration: 1100, easing: "cubic-bezier(0.16, 1, 0.3, 1)", delay: 350 },
  ).finished.catch(() => {});
  flight.remove();
  last.style.visibility = "";
  last.classList.add("is-new");
  setCount(newCount);
}

function showClosed() {
  form.hidden = true;
  done.hidden = true;
  closed.hidden = false;
  ribbon.querySelector(".ribbon__stamp").hidden = true;
  ribbon.dataset.state = "closed";
}

async function loadStats() {
  try {
    const res = await fetch("/api/stats", { headers: { Accept: "application/json" } });
    if (!res.ok) return;
    const stats = await res.json();
    setCount(stats.count);
    if (!stats.open) showClosed();
    if (stats.signature) {
      const signature = $("signature");
      const handle = stats.signature.match(/^@([A-Za-z0-9._]{1,30})$/)?.[1];
      if (handle) {
        const link = document.createElement("a");
        link.href = `https://www.instagram.com/${handle}/`;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = stats.signature;
        signature.replaceChildren(link);
      } else {
        signature.textContent = stats.signature;
      }
      signature.hidden = false;
    }
  } catch {
    // The form still works without stats.
  }
}

/* ---------- Live hot-stamp preview ---------- */

let pressTimer;
function updateStamp() {
  const name = nameInput.value.replace(/\s+/g, " ").trim();
  stampName.textContent = name || "Tu nombre";
  stampName.dataset.empty = String(!name);

  const d = dayInput.value.trim();
  const m = monthInput.value.trim();
  const y = yearInput.value.trim();
  const hasDate = d || m || y;
  stampDate.textContent = hasDate
    ? `${d ? d.padStart(2, "0") : "dd"} · ${m ? m.padStart(2, "0") : "mm"} · ${y || "aaaa"}`
    : "dd · mm · aaaa";
  stampDate.dataset.empty = String(!hasDate);

  stampName.classList.remove("is-pressing");
  clearTimeout(pressTimer);
  pressTimer = setTimeout(() => {
    void stampName.offsetWidth;
    stampName.classList.add("is-pressing");
  }, 0);
}

for (const input of [nameInput, dayInput, monthInput, yearInput]) {
  input.addEventListener("input", () => {
    updateStamp();
    clearFieldError(input === nameInput ? "name" : "birthDate");
  });
}

// Keep date parts numeric and jump to the next part when complete.
for (const [input, next, size] of [
  [dayInput, monthInput, 2],
  [monthInput, yearInput, 2],
  [yearInput, null, 4],
]) {
  input.addEventListener("input", () => {
    const digits = input.value.replace(/\D/g, "").slice(0, size);
    if (digits !== input.value) input.value = digits;
    if (next && digits.length === size) next.focus();
  });
}

/* ---------- Errors ---------- */

const fieldMap = {
  name: { inputs: [nameInput], error: $("name-error") },
  birthDate: { inputs: [dayInput, monthInput, yearInput], error: $("date-error") },
};

function setFieldError(field, message) {
  const entry = fieldMap[field];
  if (!entry) return;
  entry.error.textContent = message;
  for (const input of entry.inputs) input.setAttribute("aria-invalid", "true");
}

function clearFieldError(field) {
  const entry = fieldMap[field];
  entry.error.textContent = "";
  for (const input of entry.inputs) input.removeAttribute("aria-invalid");
}

function localErrors() {
  const errors = [];
  if (nameInput.value.trim().length < 2) errors.push({ field: "name", message: "Escribí tu nombre." });
  if (!dayInput.value || !monthInput.value || yearInput.value.length !== 4) {
    errors.push({ field: "birthDate", message: "Completá día, mes y año." });
  }
  return errors;
}

function showErrors(errors) {
  for (const { field, message } of errors) setFieldError(field, message);
  const first = errors[0] && fieldMap[errors[0].field];
  first?.inputs.find((i) => i.getAttribute("aria-invalid") === "true")?.focus();
}

/* ---------- Submit ---------- */

function setBusy(busy) {
  submitButton.disabled = busy;
  submitButton.setAttribute("aria-busy", String(busy));
}

function showDone(result) {
  const firstName = result.name.split(" ")[0];
  $("done-title").textContent = result.duplicate
    ? `${firstName}, tu nombre ya estaba en la cinta.`
    : `${firstName}, tu deseo ya está en la cinta.`;
  form.hidden = true;
  done.hidden = false;
  ribbon.dataset.state = "done";
  done.focus();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusLine.textContent = "";
  clearFieldError("name");
  clearFieldError("birthDate");

  const errors = localErrors();
  if (errors.length) return showErrors(errors);

  setBusy(true);
  try {
    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: nameInput.value,
        day: dayInput.value,
        month: monthInput.value,
        year: yearInput.value,
        website: $("website").value,
      }),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      showDone(data);
      if (data.duplicate) setCount(data.count);
      else flyIntoChain(data.count);
    } else if (res.status === 422 && Array.isArray(data.errors)) {
      showErrors(data.errors);
    } else if (data.error === "closed") {
      showClosed();
    } else {
      statusLine.textContent = data.message || "No pudimos guardar tu deseo. Probá de nuevo.";
    }
  } catch {
    statusLine.textContent = "Parece que no hay conexión. Revisala y probá de nuevo.";
  } finally {
    setBusy(false);
  }
});

$("again").addEventListener("click", () => {
  form.reset();
  updateStamp();
  done.hidden = true;
  form.hidden = false;
  ribbon.dataset.state = "idle";
  nameInput.focus();
});

updateStamp();
loadStats();
