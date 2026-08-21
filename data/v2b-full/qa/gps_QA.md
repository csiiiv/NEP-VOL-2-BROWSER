# Coordinates parse QA

See also `chainage_QA.md` and `project_desc_QA.md` (apply order: chainage → GPS).

| Cue | Parsed | Miss | Multi-point | Incomplete | Swapped lon→lat |
|----:|-------:|-----:|------------:|-------------:|----------------:|
| 595 | 595 | 0 | 19 | 28 | 246 |

## By kind (coordinate spans)

- **decimal**: 742
- **decimal_hem**: 13
- **dms**: 1

### Kind `decimal` (lat/lon or lon/lat pair)

- p.347#7: `Completion of Dampalit Pumping Station (Pumps No. 3 and No. 4), Barangay Dampalit, Malabon City`
  - `(14.701817, 120.928578)` [kind=decimal, → (14.701817, 120.928578)]
- p.347#8: `Construction of Bonifacio Pumping Station, Malabon City`
  - `(14.672467, 120.942268)` [kind=decimal, → (14.672467, 120.942268)]
- p.347#9: `Construction of Celest Pumping Station, Navotas City`
  - `(14.661703, 120.947822)` [kind=decimal, → (14.661703, 120.947822)]
- p.348#2: `Construction of Flood Gate, Barangay Dampalit, Malabon City`
  - `(14.685342, 120.937810)` [kind=decimal, → (14.685342, 120.93781)]
- p.348#7: `Construction of G. Araneta Avenue Pumping Station, Quezon City`
  - `14.619030, 121.016025` [kind=decimal, → (14.61903, 121.016025)]
- p.348#8: `Construction of Malabon City Hall Pumping Station including Drainage System, Malabon City`
  - `(14.657047, 120.950025)` [kind=decimal, → (14.657047, 120.950025)]

### Kind `decimal_hem` (N/S + E/W)

- p.354#14: `Construction of Flood Mitigation Structure along Halang Creek at Soliven Avenue to Greenheights Newtown Subdivision, Bar`
  - `(14.63001 °N, 121.12183°E)` [kind=decimal_hem, → (14.63001, 121.12183)]
- p.383#14: `Construction of Drainage Canal across Marikina Infanta Highway (near Ahon Coffee) K0033, Barangay San Jose, Antipolo Cit`
  - `(14.631951 °N, 121.232339°E)` [kind=decimal_hem, → (14.631951, 121.232339)]
- p.384#7: `Construction of Flood Mitigation Structure along Bulao River at Sitio Ondoy, Sitio San Verga, Sitio Dilain Palayan, Bara`
  - `(14.599294°N, 121.124592°E)` [kind=decimal_hem, → (14.599294, 121.124592)]
- p.384#10: `Rehabilitation of Drainage Canal at Halang Road (along Knights of Columbus), Barangay San Roque, Antipolo City`
  - `(14.S64132°N, 121.176475°E)` [kind=decimal_hem, → (14.564132, 121.176475)]
- p.384#11: `Rehabilitation of Flood Control Structure at Payagwan River, Barangay San Jose, Antipolo City`
  - `(14.660891°N, 121.253200 °E)` [kind=decimal_hem, → (14.660891, 121.2532)]
- p.399#9: `Construction of Daguitan Flood Control Structure and Drainage system, Daguitan River Basin Downstream, Poblacion Dist. V`
  - `(LS: 10.9730N, 124.9025E)` [kind=decimal_hem, role=LS, → (10.973, 124.9025)]; `(RS: 10.9734N, 124.9020E)` [kind=decimal_hem, role=RS, → (10.9734, 124.902)]

### Kind `dms`

- p.653#2: `Construction of Multipurpose Buliding, Himayangan Compound, Catbalogan City`
  - `(11 °46'32.00"N, 124°53'6.04"E)` [kind=dms, → (11.7755556, 124.8850111)]

### Lon-first → swapped to lat,lon

- p.369#10: `Rehabilitation of Valencia Pumping Station, Manila City`
  - `(121.00283581, 14.59742448)` [kind=decimal, swapped, → (14.5974245, 121.0028358)]
- p.375#13: `Construction of Box Culvert, Barangay Kaybanban, City of San Jose del Monte, Bulacan`
  - `(121.097106, 14.814449)` [kind=decimal, swapped, → (14.814449, 121.097106)]
- p.375#18: `Construction of Drainage Canal, Diamond Crest, Barangay San Manuel, City of San Jose Del Monte, Bulacan`
  - `(121.072098, 14.780461)` [kind=decimal, swapped, → (14.780461, 121.072098)]
- p.402#23: `Construction of Pumping Station, San Jose, Calumpit, Bulacan`
  - `(120.731042, 14.885722)` [kind=decimal, swapped, → (14.885722, 120.731042)]
- p.418#26: `Construction of Water Supply Systems, Brgy. Caniogan, Tubod, Lanao del Norte`
  - `(123.89399, 7.995810)` [kind=decimal, swapped, → (7.99581, 123.89399)]
- p.437#1: `Construction (Completion) of Laog Bridge, Barangay Laog, Angat, Bulacan`
  - `(121.031563, 14.924604)` [kind=decimal, swapped, → (14.924604, 121.031563)]

### LS / RS station pairs

- p.399#9: `Construction of Daguitan Flood Control Structure and Drainage system, Daguitan River Basin Downstream, Poblacion Dist. V`
  - `(LS: 10.9730N, 124.9025E)` [kind=decimal_hem, role=LS, → (10.973, 124.9025)]; `(RS: 10.9734N, 124.9020E)` [kind=decimal_hem, role=RS, → (10.9734, 124.902)]
- p.399#13: `Construction of Marabong Flood Control Structure and Drainage system, Marabong River Basin Downstream, Barangay Moguing,`
  - `(LS:10.9615N, 124.9030E)` [kind=decimal_hem, role=LS, → (10.9615, 124.903)]

### Multi-point rows

- p.386#26: `Construction of Drainage Structure along Transition House, Barangay San Isidro, Jaro, Iloilo City, Iloilo`
  - `(10.73971, 122.54791)` [kind=decimal, → (10.73971, 122.54791)]; `(10.73585, 122.54781)` [kind=decimal, → (10.73585, 122.54781)]
- p.399#9: `Construction of Daguitan Flood Control Structure and Drainage system, Daguitan River Basin Downstream, Poblacion Dist. V`
  - `(LS: 10.9730N, 124.9025E)` [kind=decimal_hem, role=LS, → (10.973, 124.9025)]; `(RS: 10.9734N, 124.9020E)` [kind=decimal_hem, role=RS, → (10.9734, 124.902)]
- p.402#7: `Rehabilitation of Buli Creek, Barangay Sta. Lucia, Pasig City ( - )`
  - `14.5787955, 121.1068795` [kind=decimal, → (14.5787955, 121.1068795)]; `14.5508543, 121.0788276` [kind=decimal, → (14.5508543, 121.0788276)]
- p.403#13: `Rehabilitation of Aganan Flood Control Structure (Jaro-Aganan River), Barangay Jibao- an, Sta. Barbara, Iloilo`
  - `(10.779801, 122.505634)` [kind=decimal, → (10.779801, 122.505634)]; `(10.779923, 122.505644)` [kind=decimal, → (10.779923, 122.505644)]
- p.563#18: `Construction of Multi-Purpose Building (Covered Court), Angeles City, Pampanga (Cluster Barangays I) AGAPITO DEL ROSARI0`
  - `15.144299318628299, 120.58950109064817` [kind=decimal, → (15.1442993, 120.5895011)]; `15.155914843123659, 120.57122824086312` [kind=decimal, → (15.1559148, 120.5712282)]; `15.155685101922105, 120.55356457224914` [kind=decimal, → (15.1556851, 120.5535646)]
- p.563#19: `Construction of Multi-Purpose Building (Covered Court), Angeles City, Pampanga (Cluster Barangays II) CUTUD- LOURDES NOR`
  - `15.175510389013915, 120.62669571202673` [kind=decimal, → (15.1755104, 120.6266957)]; `15.144727873557219, 120.5846101806296` [kind=decimal, → (15.1447279, 120.5846102)]; `15.142032406195453, 120.59083143817257` [kind=decimal, → (15.1420324, 120.5908314)]

### Incomplete / truncated

- p.365#20: `Construction of South Pinagkabalian Pumping Station, Malabon City`
  - `(14.674353,` [kind=decimal, incomplete, → lat=14.674353 lon=None]
- p.365#21: `Construction of Tanza Housing 1 Pumping Station, Navotas City`
  - `(14.682914,` [kind=decimal, incomplete, → lat=14.682914 lon=None]
- p.395#9: `Construction of Pumping Station at Barangay Batis, San Juan City`
  - `(121.022756,` [kind=decimal, incomplete, → lat=None lon=121.022756]
- p.411#12: `Construction of Water Supply, Barangay Asinan Proper, Subic, Zambales`
  - `(14.89507,` [kind=decimal, incomplete, → lat=14.89507 lon=None]
- p.411#13: `Construction of Water Supply, Barangay Batiawan, Subic Zambales`
  - `(14.931408,` [kind=decimal, incomplete, → lat=14.931408 lon=None]
- p.411#14: `Construction of Water Supply, Barangay Cawag, Subic, Zambales`
  - `(14.844035,` [kind=decimal, incomplete, → lat=14.844035 lon=None]

### OCR letter→digit in raw span

- p.384#10: `Rehabilitation of Drainage Canal at Halang Road (along Knights of Columbus), Barangay San Roque, Antipolo City`
  - `(14.S64132°N, 121.176475°E)` [kind=decimal_hem, → (14.564132, 121.176475)]
- p.566#2: `Repair/Rehabilitation of Multi-Purpose Building (Barangay Hall), Mabalacat City, Pampanga Atlu-Bola - Bical - Bundagul -`
  - `1S.2231S4, 120.57779` [kind=decimal, → (15.223154, 120.57779)]
- p.630#12: `Construction (Completion) of Multi-Purpose Building, Tagbac, Ragay, camarines Sur`
  - `(13.7S0147N, 122.819633E)` [kind=decimal_hem, → (13.750147, 122.819633)]
- p.678#18: `Construction Four Story of Department of Human Settlement and Urban Development Regional Office II Building, Carig Sur, `
  - `17.6S365, 121.74721` [kind=decimal, → (17.65365, 121.74721)]
- p.683#2: `Rehabilitation of DPWH Batanes District Engineering Office (DEO) Building - Annex Building (Technical Building), Baranga`
  - `(20.448S12°, 121.966952°)` [kind=decimal, → (20.448512, 121.966952)]

## Misses (cue but no parse)

_None_
