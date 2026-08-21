/**
 * Hierarchical tree panel for collated By-OU / PAP JSON.
 *
 *   import { renderTreeInto } from "./tree-panel.js";
 */
function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmtAmounts(amounts) {
  if (!amounts || typeof amounts !== "object") return "";
  const parts = Object.entries(amounts)
    .filter(([, v]) => v != null && v !== "")
    .map(([k, v]) => `${k}: ${v}`);
  return parts.length ? parts.join(" · ") : "";
}

function nodeMatches(node, q) {
  if (!q) return true;
  const hay = [
    node.label,
    node.prexc,
    node.role,
    node.label_title,
    ...(node.chainages || []).map((c) => JSON.stringify(c)),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

function filterTree(nodes, q) {
  if (!q) return nodes;
  const out = [];
  for (const n of nodes) {
    const kids = filterTree(n.children || [], q);
    if (nodeMatches(n, q) || kids.length) {
      out.push({ ...n, children: kids });
    }
  }
  return out;
}

function renderNode(node, { depth = 0, openDepth = 1 } = {}) {
  const kids = node.children || [];
  const hasKids = kids.length > 0;
  const page = node.sources?.[0]?.page;
  const row = node.sources?.[0]?.row;
  const amt = fmtAmounts(node.amounts);
  const metaBits = [
    node.role ? `<span class="tr-role">${esc(node.role)}</span>` : "",
    node.prexc ? `<span class="tr-prexc">${esc(node.prexc)}</span>` : "",
    page != null
      ? `<button type="button" class="tr-page" data-page="${esc(page)}" data-row="${row ?? ""}">p.${esc(page)}</button>`
      : "",
  ].filter(Boolean);

  const label = esc(node.label_title || node.label || "");
  const open = depth < openDepth ? " open" : "";

  if (!hasKids) {
    return `<div class="tr-leaf" data-depth="${depth}">
      <span class="tr-label">${label}</span>
      <span class="tr-meta">${metaBits.join(" ")}</span>
      ${amt ? `<span class="tr-amt">${esc(amt)}</span>` : ""}
    </div>`;
  }

  const body = kids
    .map((c) => renderNode(c, { depth: depth + 1, openDepth }))
    .join("");
  return `<details class="tr-node" data-depth="${depth}"${open}>
    <summary>
      <span class="tr-label">${label}</span>
      <span class="tr-count">${kids.length}</span>
      <span class="tr-meta">${metaBits.join(" ")}</span>
      ${amt ? `<span class="tr-amt">${esc(amt)}</span>` : ""}
    </summary>
    <div class="tr-children">${body}</div>
  </details>`;
}

/**
 * @param {HTMLElement} host
 * @param {object} tree collated JSON ({ roots, kind_name, span, n_rows, … })
 * @param {{ query?: string, openDepth?: number, onGoPage?: Function }} opts
 */
export function renderTreeInto(host, tree, opts = {}) {
  const q = (opts.query || "").trim().toLowerCase();
  const openDepth = opts.openDepth ?? 1;
  const roots = filterTree(tree.roots || [], q);
  const span = tree.span || {};
  const head = `<div class="tr-head">
    <div class="tr-title">${esc(tree.kind_name || tree.kind || "Tree")}
      <span class="tr-muted">p.${esc(span.from)}–${esc(span.to)} · ${esc(tree.n_rows)} rows · ${esc(roots.length)} roots shown</span>
    </div>
  </div>`;
  if (!roots.length) {
    host.innerHTML = `${head}<p class="tr-empty">No matching nodes</p>`;
    return;
  }
  host.innerHTML =
    head +
    `<div class="tr-body">${roots.map((r) => renderNode(r, { depth: 0, openDepth })).join("")}</div>`;

  host.querySelectorAll(".tr-page").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const page1 = parseInt(btn.dataset.page, 10) || 1;
      const row = btn.dataset.row ? parseInt(btn.dataset.row, 10) : null;
      opts.onGoPage?.(page1, { row: Number.isFinite(row) ? row : null });
    });
  });
}

export async function fetchTreeJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  if (url.endsWith(".gz")) {
    if (!res.body || typeof DecompressionStream === "undefined") {
      throw new Error("DecompressionStream required for .json.gz trees");
    }
    const ds = new DecompressionStream("gzip");
    const text = await new Response(res.body.pipeThrough(ds)).text();
    return JSON.parse(text);
  }
  return res.json();
}
