# NEP Volume II-B Browser (GitHub Pages)

**Live:** [csiiiv.github.io/NEP-VOL-2-BROWSER](https://csiiiv.github.io/NEP-VOL-2-BROWSER/?pack=v2b-full&page=1)

Full-featured **pdf_ocr live** viewer as the site root:

- **Left:** PDF.js + **cell / column / row bbox** highlights  
- **Right:** HTML tables (virtualized) with click / Alt+click row detail  
- **Data:** gzip `data-*.json.gz` shards (same payload as per-page JSON, minus `blocks`) — few files, lazy shard load

The lighter HTML-only packed viewer is **not** the primary UX here.

## Layout

```text
NEP-VOL-2-BROWSER/          ← site root
  index.html                pdf-ocr-live (pack mode via __NEP_VIEWER__)
  qa.html                   QA report browser
  data/v2b-full/
    manifest.json
    pages-*.json.gz         optional HTML overlays
    data-*.json.gz          full page JSON (−blocks) for cell selection
    qa/                     slim QA for marks + qa.html
  pdfs/NEP-2027-VOLUME-2B_OCR.pdf.gz
```

## Rebuild

```bash
python raw-viewer/scripts/pack_pdf_ocr_pages.py pdf_ocr/output/v2b-full --data
python NEP-VOL-2-BROWSER/scripts/sync_from_repo.py
cd NEP-VOL-2-BROWSER && python -m http.server 8767
# http://127.0.0.1:8767/?pack=v2b-full&page=1
# http://127.0.0.1:8767/qa.html?run=v2b-full
```

`--data` is required so the live viewer can draw cell/row bboxes.

## Memory / files

| Asset | Role |
|-------|------|
| `data-000.json.gz` (~2–3 MB) | Decompressed once per shard (~20 MB); pages built on demand |
| PDF.gz (~56 MB) | Dominates RAM after decompress |
| File count | Tens, not 722×2 |

GitHub soft-warns single files **>50 MB** (PDF.gz); hard limit **100 MB**.
