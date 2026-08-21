#!/usr/bin/env python3
"""Refresh NEP-VOL-2-BROWSER from monorepo packs — live viewer as site index.

Copies the full-featured ``pdf-ocr-live.html`` (cell/col selection, highlights,
Alt+click row detail) as ``index.html``, with pack-mode paths for GitHub Pages.

Requires data shards (``pack_pdf_ocr_pages.py … --data``).

From NEP_PDF_DATA::

  python raw-viewer/scripts/pack_pdf_ocr_pages.py pdf_ocr/output/v2b-full --data
  python NEP-VOL-2-BROWSER/scripts/sync_from_repo.py
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BROWSER = Path(__file__).resolve().parents[1]
PACK_SRC = ROOT / "raw-viewer" / "data" / "pdf_ocr"
LIVE_SRC = ROOT / "raw-viewer" / "static" / "pdf-ocr-live.html"
QA_REDIRECT = ROOT / "raw-viewer" / "static" / "qa.html"
QA_PANEL_JS = ROOT / "raw-viewer" / "static" / "qa-panel.js"
PDF_GZ = ROOT / "pdfs" / "NEP-2027-VOLUME-2B_OCR.pdf.gz"

SITE_CONFIG = """
<script>
window.__NEP_VIEWER__ = {
  outputBase: null,
  packBase: "data",
  pdfBase: "pdfs",
  defaultPack: "v2b-full",
  defaultRun: "v2b-full",
  defaultPage: 1,
};
</script>
"""

QA_FILES = (
    "labels_suspect.json",
    "labels_summary.json",
    "qa_summary.json",
    "QA.md",
    "labels_QA.md",
    "pap_bbox_QA.json",
    "pap_bbox_QA.md",
    "byou_skew_QA.json",
    "byou_skew_QA.md",
    "project_desc_summary.json",
    "project_desc_QA.md",
    "chainage_QA.md",
    "gps_QA.md",
)


def inject_site_config(html: str) -> str:
    """Insert __NEP_VIEWER__ before the module script; drop monorepo packed link."""
    html = re.sub(
        r'<a class="link" href="\./index\.html\?source=pdf_ocr[^"]*"[^>]*>packed</a>\s*',
        "",
        html,
        count=1,
    )
    if "window.__NEP_VIEWER__ =" in html:
        return html
    needle = '<script type="module">'
    if needle not in html:
        raise SystemExit("Could not find module script in pdf-ocr-live.html")
    return html.replace(needle, SITE_CONFIG.strip() + "\n" + needle, 1)


def sync_viewer() -> None:
    if not LIVE_SRC.is_file():
        raise SystemExit(f"Missing {LIVE_SRC}")
    html = LIVE_SRC.read_text(encoding="utf-8")
    html = inject_site_config(html)
    # Title for Pages
    html = html.replace(
        "<title>NEP pdf_ocr · Raw Viewer</title>",
        "<title>NEP 2027 Volume II-B</title>",
        1,
    )
    (BROWSER / "index.html").write_text(html, encoding="utf-8")
    if QA_PANEL_JS.is_file():
        shutil.copy2(QA_PANEL_JS, BROWSER / "qa-panel.js")
    if QA_REDIRECT.is_file():
        # Point redirect at index.html (pack-mode site root)
        redir = QA_REDIRECT.read_text(encoding="utf-8")
        redir = redir.replace("./pdf-ocr-live.html", "./index.html")
        (BROWSER / "qa.html").write_text(redir, encoding="utf-8")


def sync_pack(name: str) -> dict:
    src = PACK_SRC / name
    if not src.is_dir():
        raise SystemExit(
            f"Missing pack {src}. Run:\n"
            f"  python raw-viewer/scripts/pack_pdf_ocr_pages.py pdf_ocr/output/{name} --data"
        )
    dest = BROWSER / "data" / name
    dest.mkdir(parents=True, exist_ok=True)

    for old in list(dest.glob("pages-*.json.gz")) + list(dest.glob("data-*.json.gz")):
        old.unlink()

    manifest = json.loads((src / "manifest.json").read_text(encoding="utf-8"))
    # Viewer needs data_shards for cell/row bboxes (live logic)
    if not manifest.get("data_shards"):
        raise SystemExit(
            f"{src} has no data_shards. Re-pack with --data:\n"
            f"  python raw-viewer/scripts/pack_pdf_ocr_pages.py pdf_ocr/output/{name} --data"
        )

    for shard in list(manifest.get("shards") or []) + list(
        manifest.get("data_shards") or []
    ):
        f = shard["file"]
        shutil.copy2(src / f, dest / f)
        shard["bytes"] = (dest / f).stat().st_size

    manifest["pdf_url_gz"] = "pdfs/NEP-2027-VOLUME-2B_OCR.pdf.gz"
    manifest["pdf_url"] = "pdfs/NEP-2027-VOLUME-2B_OCR.pdf"
    manifest["source_dir"] = f"pdf_ocr/output/{name}"
    (dest / "manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )

    # Slim QA for marks + qa.html
    qa_src = ROOT / "pdf_ocr" / "output" / name / "qa"
    qa_dest = dest / "qa"
    if qa_src.is_dir():
        qa_dest.mkdir(parents=True, exist_ok=True)
        for fname in QA_FILES:
            src_f = qa_src / fname
            if src_f.is_file():
                shutil.copy2(src_f, qa_dest / fname)

    return manifest


def write_catalog(packs: list[dict]) -> None:
    catalog = {
        "packs": [
            {
                "name": m["name"],
                "volume": m.get("volume"),
                "page_count": m.get("page_count"),
                "n_shards": len(m.get("shards") or []),
                "n_data_shards": len(m.get("data_shards") or []),
                "taxonomy": m.get("taxonomy"),
                "manifest": f"{m['name']}/manifest.json",
            }
            for m in packs
        ]
    }
    out = BROWSER / "data" / "catalog.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(catalog, indent=2) + "\n", encoding="utf-8")


def sync_pdf() -> None:
    if not PDF_GZ.exists():
        raise SystemExit(
            f"Missing {PDF_GZ}. Run:\n"
            "  python raw-viewer/scripts/compress_ocr_pdf.py VOLUME-2B"
        )
    dest_dir = BROWSER / "pdfs"
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / PDF_GZ.name
    shutil.copy2(PDF_GZ, dest)
    mb = dest.stat().st_size / (1024 * 1024)
    if mb > 50:
        print(
            f"WARNING: {dest.name} is {mb:.1f} MB "
            "(GitHub soft-warns >50 MB; hard limit 100 MB)."
        )


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--packs", nargs="+", default=["v2b-full"])
    ap.add_argument("--skip-pdf", action="store_true")
    args = ap.parse_args()

    sync_viewer()
    manifests = [sync_pack(n) for n in args.packs]
    write_catalog(manifests)
    if not args.skip_pdf:
        sync_pdf()

    (BROWSER / ".nojekyll").touch()

    files = [p for p in BROWSER.rglob("*") if p.is_file()]
    total = sum(p.stat().st_size for p in files)
    print(f"Synced live viewer + {len(manifests)} pack(s) → {BROWSER}")
    print(f"Published files: {len(files)}  total: {total / 1e6:.1f} MB")
    print("Open: index.html?pack=v2b-full&page=1  (cell/col selection enabled)")


if __name__ == "__main__":
    main()
