/**
 * QA report panel for pdf-ocr-live (modal-friendly).
 *
 *   import { createQaPanel } from "./qa-panel.js";
 *   const qa = createQaPanel({ root, getRun, getQaBases, onGoPage, onReportChange });
 */
const REPORT_DEFS = [
  { id: "overview", title: "Overview", group: "Volume", files: ["qa_summary.json", "QA.md"] },
  { id: "labels", title: "Labels / OCR", group: "Labels", files: ["labels_suspect.json", "labels_summary.json", "labels_QA.md"] },
  { id: "pap_bbox", title: "PAP bbox / skew", group: "Geometry", files: ["pap_bbox_QA.json", "pap_bbox_QA.md"] },
  { id: "byou_skew", title: "By-OU skew", group: "Geometry", files: ["byou_skew_QA.json", "byou_skew_QA.md"] },
  { id: "project_desc", title: "Chainage / GPS", group: "Enrichment", files: ["project_desc_summary.json", "project_desc_QA.md", "chainage_QA.md", "gps_QA.md"] },
  { id: "raw_md", title: "All Markdown", group: "Raw", files: ["QA.md", "labels_QA.md", "pap_bbox_QA.md", "byou_skew_QA.md", "project_desc_QA.md", "chainage_QA.md", "gps_QA.md"] },
];

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function card(label, value, cls = "") {
  return `<div class="qa-card ${cls}"><div class="n">${esc(value)}</div><div class="l">${esc(label)}</div></div>`;
}

function kvTable(obj, limit = 40) {
  if (!obj || typeof obj !== "object") return "<p class='qa-muted'>—</p>";
  return `<table class="qa-data"><thead><tr><th>Key</th><th>Value</th></tr></thead><tbody>${
    Object.entries(obj).slice(0, limit).map(([k, v]) => {
      const val = typeof v === "object" ? esc(JSON.stringify(v)) : esc(v);
      return `<tr><td class="mono">${esc(k)}</td><td>${val}</td></tr>`;
    }).join("")
  }</tbody></table>`;
}

export function createQaPanel(opts) {
  const root = opts.root;
  const getRun = opts.getRun;
  const getQaBases = opts.getQaBases;
  const onGoPage = opts.onGoPage;
  const onReportChange = opts.onReportChange || (() => {});

  let reportId = "overview";
  let fileCache = new Map();
  let open = false;

  root.innerHTML = `
    <aside class="qa-nav"></aside>
    <div class="qa-body">
      <div class="qa-toolbar">
        <strong class="qa-title">QA reports</strong>
        <span class="qa-run muted"></span>
        <span class="qa-spacer"></span>
        <button type="button" class="qa-reload">Reload</button>
        <button type="button" class="qa-close" title="Close (Esc)">✕</button>
      </div>
      <div class="qa-main"><p class="qa-empty">Open a report…</p></div>
      <div class="qa-foot muted">Idle</div>
    </div>
  `;

  const navEl = root.querySelector(".qa-nav");
  const mainEl = root.querySelector(".qa-main");
  const footEl = root.querySelector(".qa-foot");
  const runEl = root.querySelector(".qa-run");

  function pageLink(page, { row } = {}) {
    const p = Number(page) || 1;
    const cite = row != null ? `p.${p} #${row}` : `p.${p}`;
    return `<button type="button" class="qa-pagelink" data-page="${p}" data-row="${row ?? ""}" title="Jump to this page">${esc(cite)}</button>`;
  }

  function bindPageLinks(host) {
    host.querySelectorAll(".qa-pagelink").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        const page1 = parseInt(btn.dataset.page, 10) || 1;
        const row = btn.dataset.row ? parseInt(btn.dataset.row, 10) : null;
        onGoPage(page1, { row: Number.isFinite(row) ? row : null });
      });
    });
  }

  async function fetchOne(url) {
    if (!fileCache.has(url)) {
      fileCache.set(
        url,
        (async () => {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`${res.status} ${url}`);
          if (url.endsWith(".json") || url.endsWith(".jsonl")) return res.json();
          return res.text();
        })()
      );
    }
    return fileCache.get(url);
  }

  async function loadFiles(files) {
    const bases = getQaBases() || [];
    const out = {};
    const errors = [];
    for (const name of files) {
      let ok = false;
      for (const base of bases) {
        try {
          out[name] = await fetchOne(`${base.replace(/\/$/, "")}/${name}`);
          ok = true;
          break;
        } catch (_) { /* next */ }
      }
      if (!ok) errors.push(`${name}: not found`);
    }
    return { out, errors };
  }

  function renderOverview({ out, errors }) {
    const s = out["qa_summary.json"];
    const md = out["QA.md"];
    let html = `<h1>Volume overview</h1><p class="qa-muted">${esc(getRun())}</p>`;
    if (errors.length) html += `<p class="qa-error">${esc(errors.join("; "))}</p>`;
    if (s) {
      const nFail = (s.row_sum_failures || []).length;
      const nEmpty = (s.empty_pages || []).length;
      const nMulti = (s.multi_zone || []).length;
      html += `<div class="qa-cards">
        ${card("Pages", s.n_pages ?? "—")}
        ${card("Multi-zone", nMulti, nMulti ? "warn" : "ok")}
        ${card("Empty", nEmpty, nEmpty ? "warn" : "ok")}
        ${card("Transitions", (s.kind_transitions || []).length)}
        ${card("Row-sum fails", nFail, nFail ? "bad" : "ok")}
      </div>`;
      html += `<h2>Kinds</h2>${kvTable(s.kind_counts)}`;
      if (s.kind_transitions?.length) {
        html += `<h2>Kind transitions</h2><table class="qa-data"><thead><tr><th>Page</th><th>From</th><th>To</th></tr></thead><tbody>`;
        for (const t of s.kind_transitions) {
          html += `<tr><td>${pageLink(t.page)}</td><td><span class="qa-chip">${esc(t.from)}</span></td><td><span class="qa-chip">${esc(t.to)}</span></td></tr>`;
        }
        html += `</tbody></table>`;
      }
      if (s.multi_zone?.length) {
        html += `<h2>Multi-zone</h2><table class="qa-data"><thead><tr><th>Page</th><th>Zones</th></tr></thead><tbody>`;
        for (const m of s.multi_zone) {
          html += `<tr><td>${pageLink(m.page)}</td><td>${(m.zones || []).map((z) => `<span class="qa-chip">${esc(z)}</span>`).join("")}</td></tr>`;
        }
        html += `</tbody></table>`;
      }
      if (s.empty_pages?.length) {
        html += `<h2>Empty pages</h2><p>${s.empty_pages.map((p) => pageLink(p)).join(" · ")}</p>`;
      }
    }
    if (md) html += `<h2>QA.md</h2><pre class="qa-md">${esc(md)}</pre>`;
    return html;
  }

  function renderLabels({ out, errors }) {
    const suspect = out["labels_suspect.json"];
    const summary = out["labels_summary.json"] || suspect?.summary;
    let html = `<h1>Labels / OCR</h1>`;
    if (errors.length) html += `<p class="qa-error">${esc(errors.join("; "))}</p>`;
    if (summary) {
      html += `<div class="qa-cards">
        ${card("Rows", summary.n_rows ?? "—")}
        ${card("Unique", summary.n_unique_labels ?? "—")}
        ${card("Unfixed", summary.n_suspect_unfixed ?? "—", "warn")}
        ${card("Fixed", summary.n_suspect_fixed ?? "—", "ok")}
        ${card("OCR rewrites", summary.label_ocr_rewrites ?? "—")}
      </div>`;
      html += `<h2>Unfixed reasons</h2>${kvTable(summary.suspect_reason_counts)}`;
    }
    const unfixed = suspect?.suspects_unfixed || [];
    const fixed = suspect?.suspects_fixed || [];
    html += `<div class="qa-filters">
      <select id="qa-lab-filter">
        <option value="unfixed">Unfixed (${unfixed.length})</option>
        <option value="fixed">Fixed (${fixed.length})</option>
      </select>
      <input type="search" id="qa-lab-q" placeholder="Filter label…">
    </div><div id="qa-lab-table"></div>`;

    const wrap = document.createElement("div");
    wrap.innerHTML = html;
    const paint = () => {
      const mode = wrap.querySelector("#qa-lab-filter")?.value || "unfixed";
      const q = (wrap.querySelector("#qa-lab-q")?.value || "").toLowerCase();
      const list = (mode === "fixed" ? fixed : unfixed).filter(
        (x) => !q || String(x.label || "").toLowerCase().includes(q)
      );
      let t = `<table class="qa-data"><thead><tr><th>#</th><th>Reasons</th><th>Label</th><th>Samples</th></tr></thead><tbody>`;
      for (const row of list.slice(0, 300)) {
        const samples = (row.samples || []).slice(0, 5)
          .map((s) => pageLink(s.page, { row: s.row }))
          .join(" ");
        const reasons = (row.reasons || []).map((r) => `<span class="qa-chip">${esc(r)}</span>`).join("");
        t += `<tr><td>${esc(row.count)}</td><td>${reasons}</td><td>${esc(row.label)}</td><td>${samples}</td></tr>`;
      }
      t += `</tbody></table>`;
      const slot = wrap.querySelector("#qa-lab-table");
      if (slot) {
        slot.innerHTML = t;
        bindPageLinks(slot);
      }
    };
    queueMicrotask(() => {
      mainEl.replaceChildren(wrap);
      wrap.querySelector("#qa-lab-filter")?.addEventListener("change", paint);
      wrap.querySelector("#qa-lab-q")?.addEventListener("input", paint);
      paint();
      bindPageLinks(wrap);
    });
    return null;
  }

  function renderPap({ out, errors }) {
    const j = out["pap_bbox_QA.json"];
    const md = out["pap_bbox_QA.md"];
    if (!j) {
      return errors.length
        ? `<p class="qa-error">${esc(errors.join("; "))}</p>`
        : (md ? `<pre class="qa-md">${esc(md)}</pre>` : `<p class="qa-empty">No data</p>`);
    }
    let html = `<h1>PAP bbox / skew</h1><div class="qa-cards">
      ${card("PAP pages", j.n_pap_pages ?? "—")}
      ${card("Skew pages", j.n_skew_pages ?? "—")}
      ${card("With overhang", j.n_with_overhang ?? "—")}
      ${card("Flagged", j.n_flagged_soft ?? "—", j.n_flagged_soft ? "warn" : "ok")}
    </div>
    <div class="qa-filters"><input type="search" data-filter placeholder="Filter…"></div>
    <div data-table></div>`;
    const wrap = document.createElement("div");
    wrap.innerHTML = html;
    queueMicrotask(() => {
      mainEl.replaceChildren(wrap);
      const q = wrap.querySelector("[data-filter]");
      const slot = wrap.querySelector("[data-table]");
      const paint = () => {
        const qq = (q?.value || "").toLowerCase();
        const list = (j.issues || []).filter((x) =>
          !qq || String(x.label || "").toLowerCase().includes(qq) || String(x.page).includes(qq)
        ).slice(0, 250);
        slot.innerHTML = `<table class="qa-data"><thead><tr><th>Page</th><th>Row</th><th>Frac</th><th>Label</th></tr></thead><tbody>${
          list.map((x) => `<tr><td>${pageLink(x.page, { row: x.row })}</td><td>${esc(x.row)}</td><td>${esc(x.overhang_frac)}</td><td>${esc(x.label)}</td></tr>`).join("")
        }</tbody></table>`;
        bindPageLinks(slot);
      };
      q?.addEventListener("input", paint);
      paint();
      if (md) {
        const d = document.createElement("div");
        d.innerHTML = `<h2>Markdown</h2><pre class="qa-md">${esc(md)}</pre>`;
        wrap.appendChild(d);
      }
    });
    return null;
  }

  function renderByou({ out, errors }) {
    const j = out["byou_skew_QA.json"];
    const md = out["byou_skew_QA.md"];
    let html = `<h1>By-OU skew</h1>`;
    if (errors.length && !j) html += `<p class="qa-error">${esc(errors.join("; "))}</p>`;
    if (j) {
      html += `<div class="qa-cards">
        ${card("Pages", j.n_pages ?? "—")}
        ${card("Would apply", j.n_would_apply ?? "—", "ok")}
        ${card("|m| med", j.abs_m?.med ?? "—")}
      </div>${kvTable(j.reasons)}
      <h2>Per-page</h2><table class="qa-data"><thead><tr><th>Page</th><th>Kind</th><th>Rows</th><th>m</th></tr></thead><tbody>`;
      for (const x of (j.pages || []).slice(0, 400)) {
        html += `<tr><td>${pageLink(x.page)}</td><td>${esc(x.kind)}</td><td>${esc(x.n_rows)}</td><td class="mono">${esc(x.m ?? "—")}</td></tr>`;
      }
      html += `</tbody></table>`;
    }
    if (md) html += `<pre class="qa-md">${esc(md)}</pre>`;
    return html;
  }

  function fmtChainage(c) {
    if (!c || typeof c !== "object") return "";
    const span = c.to != null && c.to !== "" ? `${c.from ?? "?"} → ${c.to}` : String(c.from ?? "");
    const kind = c.kind ? `[${c.kind}] ` : "";
    const note = c.incomplete ? " (incomplete)" : "";
    return `${kind}${span}${note}`.trim();
  }

  function fmtCoord(c) {
    if (!c || typeof c !== "object") return "";
    if (c.raw) return String(c.raw);
    if (c.lat != null && c.lon != null) return `(${c.lat}, ${c.lon})`;
    return JSON.stringify(c);
  }

  function sampleRowsTable(rows, { mode } = {}) {
    const list = Array.isArray(rows) ? rows : [];
    if (!list.length) return `<p class="qa-muted">No samples</p>`;
    const isGps = mode === "gps";
    let t = `<table class="qa-data"><thead><tr><th>Page</th><th>Label</th><th>${isGps ? "Coordinates" : "Chainages"}</th></tr></thead><tbody>`;
    for (const r of list.slice(0, 80)) {
      const vals = isGps
        ? (r.coordinates || []).map(fmtCoord).filter(Boolean)
        : (r.chainages || []).map(fmtChainage).filter(Boolean);
      const detail = vals.length
        ? `<div class="mono">${vals.map((v) => esc(v)).join("<br>")}</div>`
        : `<span class="qa-muted">—</span>`;
      const n = r.n != null ? ` <span class="qa-muted">×${esc(r.n)}</span>` : "";
      t += `<tr>
        <td>${pageLink(r.page, { row: r.row })}${n}</td>
        <td>${esc(r.label_title || r.label || "")}</td>
        <td>${detail}</td>
      </tr>`;
    }
    t += `</tbody></table>`;
    return t;
  }

  function renderProject({ out, errors }) {
    const s = out["project_desc_summary.json"];
    let html = `<h1>Chainage / GPS</h1>`;
    const hard = errors.filter((e) => e.startsWith("project_desc_summary"));
    if (hard.length) html += `<p class="qa-error">${esc(hard.join("; "))}</p>`;
    if (!s) {
      for (const name of ["project_desc_QA.md", "chainage_QA.md", "gps_QA.md"]) {
        if (out[name]) html += `<h2>${esc(name)}</h2><pre class="qa-md">${esc(out[name])}</pre>`;
      }
      if (!hard.length && errors.length) {
        html += `<p class="qa-muted">${esc(errors.join("; "))}</p>`;
      }
      return html || `<p class="qa-empty">No project-desc QA</p>`;
    }

    const ch = s.chainage || {};
    const co = s.coordinates || {};
    html += `<div class="qa-cards">
      ${card("Pages", s.pages ?? "—")}
      ${card("Chainage parsed", `${ch.parsed_rows ?? "—"} / ${ch.cue_rows ?? "—"}`, "ok")}
      ${card("GPS parsed", `${co.parsed_rows ?? "—"} / ${co.cue_rows ?? "—"}`, "ok")}
      ${card("Rows touched", s.rows_touched ?? "—")}
      ${card("Multi-segment", ch.multi_segment_rows ?? "—")}
      ${card("GPS incomplete", co.incomplete_spans ?? "—", co.incomplete_spans ? "warn" : "")}
      ${card("Lon→lat swaps", co.swapped_lon_lat ?? "—")}
    </div>`;

    html += `<h2>Chainage kinds</h2>${kvTable(ch.spans_by_kind)}`;
    html += `<h2>GPS kinds</h2>${kvTable(co.by_kind)}`;

    const chByKind = s.chainage_samples_by_kind || {};
    html += `<h2>Chainage samples</h2>`;
    html += `<h3>Hits</h3>${sampleRowsTable(s.chainage_hit_samples, { mode: "chainage" })}`;
    for (const key of ["incomplete", "multi_segment", "kind:K", "kind:Sta", "kind:Chainage", "kind:C", "kind:KM"]) {
      const rows = chByKind[key];
      if (!rows?.length) continue;
      html += `<h3>${esc(key)} (${rows.length})</h3>${sampleRowsTable(rows, { mode: "chainage" })}`;
    }
    if ((s.chainage_miss_samples || []).length) {
      html += `<h3>Misses</h3>${sampleRowsTable(s.chainage_miss_samples, { mode: "chainage" })}`;
    }

    const gpsByKind = s.gps_samples_by_kind || {};
    html += `<h2>GPS samples</h2>`;
    html += `<h3>Hits</h3>${sampleRowsTable(s.gps_hit_samples, { mode: "gps" })}`;
    for (const key of [
      "incomplete",
      "swapped_lon_lat",
      "multi_point",
      "ls_rs",
      "ocr_letter_digit",
      "kind:decimal",
      "kind:decimal_hem",
      "kind:dms",
    ]) {
      const rows = gpsByKind[key];
      if (!rows?.length) continue;
      html += `<h3>${esc(key)} (${rows.length})</h3>${sampleRowsTable(rows, { mode: "gps" })}`;
    }
    if ((s.gps_miss_samples || []).length) {
      html += `<h3>Misses</h3>${sampleRowsTable(s.gps_miss_samples, { mode: "gps" })}`;
    }

    for (const name of ["project_desc_QA.md", "chainage_QA.md", "gps_QA.md"]) {
      if (out[name]) html += `<h2>${esc(name)}</h2><pre class="qa-md">${esc(out[name])}</pre>`;
    }
    return html;
  }

  function renderRaw({ out, errors }) {
    let html = `<h1>Markdown</h1>`;
    if (errors.length) html += `<p class="qa-muted">${esc(errors.join("; "))}</p>`;
    for (const [name, text] of Object.entries(out)) {
      if (typeof text === "string") html += `<h2>${esc(name)}</h2><pre class="qa-md">${esc(text)}</pre>`;
    }
    return html;
  }

  const RENDER = {
    overview: renderOverview,
    labels: renderLabels,
    pap_bbox: renderPap,
    byou_skew: renderByou,
    project_desc: renderProject,
    raw_md: renderRaw,
  };

  function renderNav() {
    const groups = {};
    for (const r of REPORT_DEFS) (groups[r.group] ||= []).push(r);
    let html = "";
    for (const [g, items] of Object.entries(groups)) {
      html += `<div class="qa-nav-g">${esc(g)}</div>`;
      for (const r of items) {
        html += `<button type="button" data-report="${esc(r.id)}" class="${r.id === reportId ? "active" : ""}">${esc(r.title)}</button>`;
      }
    }
    navEl.innerHTML = html;
    navEl.querySelectorAll("button[data-report]").forEach((btn) => {
      btn.onclick = () => {
        reportId = btn.dataset.report;
        onReportChange(reportId);
        renderNav();
        showReport();
      };
    });
  }

  async function showReport() {
    const def = REPORT_DEFS.find((r) => r.id === reportId) || REPORT_DEFS[0];
    reportId = def.id;
    runEl.textContent = getRun();
    footEl.textContent = `Loading ${def.title}…`;
    mainEl.innerHTML = `<p class="qa-empty">Loading ${esc(def.title)}…</p>`;
    try {
      const payload = await loadFiles(def.files);
      const html = RENDER[def.id](payload);
      if (html != null) {
        mainEl.innerHTML = html;
        bindPageLinks(mainEl);
      }
      footEl.textContent = `${getRun()} · ${def.title}`;
    } catch (err) {
      mainEl.innerHTML = `<p class="qa-error">${esc(err.message || err)}</p>`;
      footEl.textContent = "Error";
    }
  }

  root.querySelector(".qa-reload").onclick = () => {
    fileCache.clear();
    showReport();
  };
  root.querySelector(".qa-close").onclick = () => api.close();

  const api = {
    isOpen: () => open,
    reportId: () => reportId,
    open(id) {
      open = true;
      if (id && REPORT_DEFS.some((r) => r.id === id)) reportId = id;
      root.classList.add("open");
      renderNav();
      showReport();
      onReportChange(reportId);
    },
    close() {
      if (!open) return;
      open = false;
      root.classList.remove("open");
      onReportChange(null);
    },
    setReport(id) {
      if (!REPORT_DEFS.some((r) => r.id === id)) return;
      reportId = id;
      if (open) {
        renderNav();
        showReport();
      }
      onReportChange(reportId);
    },
    refresh() {
      fileCache.clear();
      if (open) showReport();
    },
  };
  return api;
}

export const QA_REPORT_IDS = REPORT_DEFS.map((r) => r.id);
