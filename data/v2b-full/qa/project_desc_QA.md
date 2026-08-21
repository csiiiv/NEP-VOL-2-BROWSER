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
| Cue rows | 3562 |
| Parsed | 3562 |
| Miss | 0 |
| Parse rate | 1.0 |
| Multi-segment | 866 |
| Incomplete | 4 |

Kinds: **K** 3261, **Sta** 2012, **Chainage** 281, **C** 158, **KM** 1.

## Coordinates / GPS (summary)

| Metric | Value |
|--------|------:|
| Cue rows | 595 |
| Parsed | 595 |
| Miss | 0 |
| Parse rate | 1.0 |
| Multi-point | 19 |
| Incomplete | 28 |
| Swapped lon→lat | 246 |

Kinds: **decimal** 742, **decimal_hem** 13, **dms** 1.
