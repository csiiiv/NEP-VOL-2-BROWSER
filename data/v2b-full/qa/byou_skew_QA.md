# By-OU / lattice skew probe — `v2b-full`

Estimates page tilt from **label bottom ↔ Total bottom** pairs (matching By-OU attach preference for the last label line). Same apply gates as PAP `estimate_pap_skew` (|m| ∈ [0.0005, 0.05], ≥3 pairs).

- Lattice pages (kinds ['A', 'C', 'D', 'E']): **100**
- Would apply deskew: **96** (96.0%)
- Decision reasons: `{'median_bottom_slope': 96, 'negligible': 2, 'too_few_pairs': 2}`

## Magnitude

- |m| med / p90 / p99 / max: **0.00447** / 0.00731 / 0.01099 / 0.01214
- |Y shift| at page median dx (pt): **1.50** / 2.49 / 2.73 / 2.76

## Bottom vs top (wrapped labels)

- n wrapped pairs: **1612**
- |dy_bot| med: **1.62** pt
- |dy_top| med: **7.94** pt (top is inflated by wrap height — bottom is the right baseline)

## Largest predicted shifts

| page | kind | m | ∠° | dx | shift pt | raw\|dy\| → deskew | reason |
|------|------|---|-----|----|----------|------------------|--------|
| 83 | A | -0.00704 | -0.403 | 392.2 | -2.76 | 2.77 → 0.96 | median_bottom_slope |
| 86 | A | -0.010908 | -0.625 | 205.6 | -2.73 | 2.98 → 0.73 | median_bottom_slope |
| 82 | A | -0.006696 | -0.384 | 396.4 | -2.65 | 2.6 → 0.91 | median_bottom_slope |
| 91 | A | -0.006687 | -0.383 | 392.4 | -2.62 | 2.65 → 0.9 | median_bottom_slope |
| 79 | A | -0.006463 | -0.37 | 395.2 | -2.55 | 2.56 → 0.74 | median_bottom_slope |
| 90 | A | -0.006501 | -0.372 | 392.3 | -2.55 | 2.58 → 0.92 | median_bottom_slope |
| 89 | A | -0.006404 | -0.367 | 396.2 | -2.54 | 2.55 → 0.92 | median_bottom_slope |
| 75 | A | -0.006349 | -0.364 | 396.4 | -2.52 | 2.49 → 0.75 | median_bottom_slope |
| 93 | A | -0.006409 | -0.367 | 392.2 | -2.51 | 2.51 → 0.73 | median_bottom_slope |
| 88 | A | -0.012142 | -0.696 | 205.6 | -2.5 | 2.49 → 0.95 | median_bottom_slope |
| 94 | A | -0.010987 | -0.63 | 205.6 | -2.49 | 2.49 → 0.72 | median_bottom_slope |
| 73 | A | -0.006278 | -0.36 | 394.1 | -2.48 | 2.49 → 0.75 | median_bottom_slope |
| 74 | A | -0.006182 | -0.354 | 394.6 | -2.44 | 2.45 → 0.68 | median_bottom_slope |
| 77 | A | -0.006141 | -0.352 | 386.5 | -2.37 | 2.38 → 0.71 | median_bottom_slope |
| 64 | A | -0.005831 | -0.334 | 398.2 | -2.32 | 2.32 → 0.62 | median_bottom_slope |
| 80 | A | -0.009949 | -0.57 | 207.5 | -2.28 | 2.68 → 0.95 | median_bottom_slope |
| 97 | A | -0.005754 | -0.33 | 395.8 | -2.28 | 2.49 → 0.74 | median_bottom_slope |
| 85 | A | -0.005772 | -0.331 | 392.0 | -2.26 | 2.43 → 0.7 | median_bottom_slope |
| 95 | A | -0.005716 | -0.327 | 394.2 | -2.25 | 2.24 → 0.74 | median_bottom_slope |
| 68 | A | -0.005537 | -0.317 | 394.4 | -2.18 | 2.18 → 0.65 | median_bottom_slope |
| 69 | A | -0.00553 | -0.317 | 396.3 | -2.18 | 2.19 → 0.69 | median_bottom_slope |
| 76 | A | -0.009477 | -0.543 | 207.6 | -2.18 | 2.19 → 0.7 | median_bottom_slope |
| 58 | A | -0.008919 | -0.511 | 213.9 | -2.17 | 2.11 → 0.71 | median_bottom_slope |
| 70 | A | -0.010126 | -0.58 | 207.5 | -2.1 | 2.1 → 0.72 | median_bottom_slope |
| 87 | A | -0.005245 | -0.301 | 394.0 | -2.07 | 2.04 → 0.77 | median_bottom_slope |
| 84 | A | -0.005243 | -0.3 | 392.1 | -2.06 | 2.26 → 0.9 | median_bottom_slope |
| 92 | A | -0.009718 | -0.557 | 207.5 | -2.04 | 2.52 → 0.96 | median_bottom_slope |
| 65 | A | -0.005064 | -0.29 | 396.4 | -2.01 | 2.02 → 0.71 | median_bottom_slope |
| 56 | A | -0.004907 | -0.281 | 400.5 | -1.97 | 1.95 → 0.67 | median_bottom_slope |
| 50 | A | -0.004769 | -0.273 | 398.1 | -1.9 | 1.87 → 0.69 | median_bottom_slope |
