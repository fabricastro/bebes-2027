import { buildWishListPdf, formatBirthDate } from "/pdf.js";

const $ = (id) => document.getElementById(id);
const numberFormat = new Intl.NumberFormat("es-AR");
const createdFormat = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Argentina/San_Juan",
});

let entries = [];
let isOpen = true;

async function api(path, options = {}) {
  const res = await fetch(path, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && path !== "/api/admin/login") {
    showLogin();
    throw new Error("unauthorized");
  }
  if (!res.ok) throw Object.assign(new Error(data.message || "Algo falló. Probá de nuevo."), { data });
  return data;
}

function notice(message) {
  $("notice").textContent = message;
}

function showLogin() {
  $("panel-view").hidden = true;
  $("logout").hidden = true;
  $("login-view").hidden = false;
  $("password").focus();
}

function showPanel() {
  $("login-view").hidden = true;
  $("panel-view").hidden = false;
  $("logout").hidden = false;
}

function renderStatus() {
  const label = $("status-label");
  label.textContent = isOpen ? "abierto" : "cerrado";
  label.dataset.open = String(isOpen);
  $("toggle").textContent = isOpen ? "Cerrar formulario" : "Reabrir formulario";
}

function renderRows() {
  const query = $("search")
    .value.normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
  const visible = query
    ? entries.filter((e) => e.name.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().includes(query))
    : entries;

  $("total").textContent = numberFormat.format(entries.length);
  $("total-noun").textContent = entries.length === 1 ? "deseo" : "deseos";
  $("empty").hidden = entries.length > 0;

  const rows = $("rows");
  rows.replaceChildren(
    ...[...visible].reverse().map((entry) => {
      const tr = document.createElement("tr");
      const name = document.createElement("td");
      name.textContent = entry.name;
      const birth = document.createElement("td");
      birth.textContent = formatBirthDate(entry.birthDate);
      const created = document.createElement("td");
      created.textContent = createdFormat.format(new Date(entry.createdAt));
      const actions = document.createElement("td");
      const del = document.createElement("button");
      del.type = "button";
      del.className = "row-delete";
      del.textContent = "Borrar";
      del.setAttribute("aria-label", `Borrar a ${entry.name}`);
      del.addEventListener("click", () => deleteEntry(entry, del));
      actions.append(del);
      tr.append(name, birth, created, actions);
      return tr;
    }),
  );
}

async function load() {
  const data = await api("/api/admin/entries");
  entries = data.entries;
  isOpen = data.open;
  showPanel();
  renderStatus();
  renderRows();
}

// Two-step delete without a blocking confirm() dialog.
async function deleteEntry(entry, button) {
  if (button.dataset.confirm !== "true") {
    button.dataset.confirm = "true";
    button.textContent = "¿Borrar? Sí";
    setTimeout(() => {
      if (button.isConnected) {
        button.dataset.confirm = "false";
        button.textContent = "Borrar";
      }
    }, 4000);
    return;
  }
  button.disabled = true;
  try {
    await api(`/api/admin/entries/${entry.id}`, { method: "DELETE" });
    entries = entries.filter((e) => e.id !== entry.id);
    renderRows();
    notice(`Borraste a ${entry.name}.`);
  } catch (error) {
    button.disabled = false;
    notice(error.message);
  }
}

$("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  $("login-error").textContent = "";
  try {
    await api("/api/admin/login", { method: "POST", body: JSON.stringify({ password: $("password").value }) });
    $("password").value = "";
    await load();
  } catch (error) {
    $("login-error").textContent = error.message;
  }
});

$("logout").addEventListener("click", async () => {
  await api("/api/admin/logout", { method: "POST" }).catch(() => {});
  entries = [];
  showLogin();
});

$("toggle").addEventListener("click", async () => {
  const button = $("toggle");
  button.disabled = true;
  try {
    const data = await api("/api/admin/status", { method: "POST", body: JSON.stringify({ open: !isOpen }) });
    isOpen = data.open;
    renderStatus();
    notice(isOpen ? "El formulario está abierto otra vez." : "Cerraste el formulario. Ya nadie puede sumar nombres.");
  } catch (error) {
    notice(error.message);
  } finally {
    button.disabled = false;
  }
});

$("search").addEventListener("input", renderRows);

$("download").addEventListener("click", async () => {
  const button = $("download");
  button.disabled = true;
  notice("Armando el PDF…");
  try {
    // Refresh first so the PDF includes the latest names.
    await load();
    const [regular, semibold] = await Promise.all(
      ["/fonts/figtree-regular.ttf", "/fonts/figtree-semibold.ttf"].map((url) => fetch(url).then((r) => r.arrayBuffer())),
    );
    const today = new Intl.DateTimeFormat("es-AR", { dateStyle: "long", timeZone: "America/Argentina/San_Juan" }).format(new Date());
    const bytes = await buildWishListPdf({
      PDFLib: window.PDFLib,
      fontkit: window.fontkit,
      entries,
      fonts: { regular, semibold },
      generatedOn: today,
    });
    const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    const link = Object.assign(document.createElement("a"), { href: url, download: "bebes-2027.pdf" });
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    notice(`Listo: PDF con ${numberFormat.format(entries.length)} nombres.`);
  } catch (error) {
    notice(`No se pudo armar el PDF: ${error.message}`);
  } finally {
    button.disabled = false;
  }
});

load().catch(() => {
  if ($("panel-view").hidden) showLogin();
});
