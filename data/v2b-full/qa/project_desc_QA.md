# Project description enrich QA

Run: `/mnt/6E9A84429A8408B3/WORK/BetterGovPH/Budget-NEP/NEP_PDF_DATA/pdf_ocr/output/v2b-full`
Mode: `write` (Kind B only)

Order: **chainage → coordinates (GPS)** on the stripped title.

| Report | Contents |
|--------|----------|
| [`chainage_QA.md`](chainage_QA.md) | Chainage metrics + samples by kind / multi / incomplete / miss |
| [`gps_QA.md`](gps_QA.md) | GPS metrics + samples by kind / swap / LS·RS / OCR / miss |

## Chainage (summary)

| Metric | Value |
|--------|------:|
| Cue rows | 3551 |
| Parsed | 3551 |
| Miss | 0 |
| Parse rate | 1.0 |
| Multi-segment | 860 |
| Incomplete | 4 |

Kinds: **K** 3260, **Sta** 1988, **Chainage** 280, **C** 156, **KM** 1.

## Coordinates / GPS (summary)

| Metric | Value |
|--------|------:|
| Cue rows | 591 |
| Parsed | 591 |
| Miss | 0 |
| Parse rate | 1.0 |
| Multi-point | 19 |
| Incomplete | 28 |
| Swapped lon→lat | 245 |

Kinds: **decimal** 738, **decimal_hem** 13, **dms** 1.
