# Chainage parse QA

See also `gps_QA.md` and `project_desc_QA.md` (apply order: chainage → GPS).

| Cue | Parsed | Miss | Multi-segment | Incomplete |
|----:|-------:|-----:|--------------:|-----------:|
| 3562 | 3562 | 0 | 866 | 4 |

## By kind (chainage spans)

- **K**: 3261
- **Sta**: 2012
- **Chainage**: 281
- **C**: 158
- **KM**: 1

### Kind `K`

- p.195#9 (3 spans): `Maharlika Highway (LZ)`
  - [kind=K, 0026+(-1036) → 0026+(-120)]; [kind=K, 0028+240 → 0028+590]; [kind=K, 0029+350 → 0030+000]
- p.195#11 (13 spans): `Manila North Rd`
  - [kind=K, 0212+007 → 0213+497]; [kind=K, 0215+(-927) → 0215+(-837)]; [kind=K, 0215+(-808) → 0215+(-077)]
- p.195#12 (10 spans): `Manila North Rd`
  - [kind=K, 0235+415 → 0236+005]; [kind=K, 0236+238 → 0236+755]; [kind=K, 0247+523 → 0247+588]
- p.195#13: `Pangasinan-La Union Inter-Provl Rd`
  - [kind=K, 0386+737 → 0389+142]
- p.195#14 (2 spans): `Pangasinan-La Union Inter-Provl Rd`
  - [kind=K, 0390+000 → 0391+137]; [kind=K, 0391+420 → 0392+000]
- p.195#16: `Cauayan-Cabatuan Rd`
  - [kind=K, 0378+137 → 0380+268]

### Kind `Sta`

- p.277#6: `Bauang-San Fernando-San Juan Bypass Road (Bauang Section}, La Union`
  - [kind=Sta, 0+000 → 3+003]
- p.277#8: `Bauang-San Fernando-San Juan ByPass Road, San Fernando, La Union`
  - [kind=Sta, 7+797.87 → 13+461.69]
- p.277#11 (3 spans): `Dagupan-Mangaldan Diversion Road, Dagupan City-Mangaldan, Sta.- Pangasinan`
  - [kind=Sta, 0+861 → 1+512]; [kind=Sta, 5+280]; [kind=Sta, 6+089.9]
- p.277#12: `Dagupan-Mangaldan-Calasiao Circumferential Road, Dagupan City-Mangaldan, Pangasinan`
  - [kind=Sta, 6+114.62 → 6+620.48]
- p.277#14: `Laoag-San Nicolas Bypass Road, San Nicolas, Ilocos Norte`
  - [kind=Sta, 4+237.62 → 5+318.72]
- p.277#17: `Malasiqui Diversion Road, Malasiqui, Pangasinan`
  - [kind=Sta, 7+680.5 → 8+198.74]

### Kind `Chainage`

- p.198#20: `Maharlika Highway (Pagadian City-Zamboanga City Rd) - (S01638MN)`
  - [kind=Chainage, 000 → 505]
- p.198#21 (2 spans): `Maharlika Highway (Pagadian City-Zamboanga City Rd) - (S01639MN)`
  - [kind=Chainage, 000 → 324]; [kind=Chainage, 1048 → 2603]
- p.199#2 (3 spans): `Maharlika Highway (Lanao-Pagadian-Zamboanga City Rd) - (S01632MN)`
  - [kind=Chainage, 000 → 110]; [kind=Chainage, 140 → 270]; [kind=Chainage, 300 → 436]
- p.199#3 (2 spans): `Maharlika Highway (Lanao-Pagadian-Zamboanga City Rd) - (S01634MN)`
  - [kind=Chainage, 000 → 116]; [kind=Chainage, 197 → 301]
- p.200#12 (2 spans): `Maharlika Highway (Marbel-Makar Rd) - (S00253MN)`
  - [kind=Chainage, 33078 → 33564]; [kind=Chainage, 34565 → 35161]
- p.201#37: `Naveleta-Naic-Tagaytay Rd - (S06092LZ)`
  - [kind=Chainage, 188 → 212]

### Kind `C`

- p.347#13: `Construction of Drainage along Yanga St. going to Maysilo Pumping Station, Malabon City`
  - [kind=C, C0+000 → C0+964]
- p.347#15: `Construction of Drainage System along Gen. Borromeo St., Malabon City`
  - [kind=C, C0+000 → C0+818]
- p.347#19: `Construction of Flood Control Structures, the Banks of Shelterville Creek, Barangay 171, Caloocan City`
  - [kind=C, C0+000 → C0+238]
- p.347#20: `Construction of Flood Control Wall Along Pasolo Creek, Barangay Pasolo, Valenzuela City`
  - [kind=C, C0+000 → C0+350]
- p.347#21: `Construction of Flood Control Wall along the Bankers, Barangay 171, Caloocan City`
  - [kind=C, C0+500 → C0+816]
- p.347#22: `Construction of Flood Control Wall along the Banks of Creeks along Dona Aurora Creek, Baranqay 177, Caloocan City`
  - [kind=C, C0+000 → C0+600]

### Kind `KM`

- p.371#7: `Construction of Drainage along Pangasinan Nueva-Ecija Road, Barangay Carmen East - Tomana East, Rosales, Pangasinan`
  - [kind=KM, 171+138 → 174+622]

### Multi-segment rows

- p.195#9 (3 spans): `Maharlika Highway (LZ)`
  - [kind=K, 0026+(-1036) → 0026+(-120)]; [kind=K, 0028+240 → 0028+590]; [kind=K, 0029+350 → 0030+000]
- p.195#11 (13 spans): `Manila North Rd`
  - [kind=K, 0212+007 → 0213+497]; [kind=K, 0215+(-927) → 0215+(-837)]; [kind=K, 0215+(-808) → 0215+(-077)]
- p.195#12 (10 spans): `Manila North Rd`
  - [kind=K, 0235+415 → 0236+005]; [kind=K, 0236+238 → 0236+755]; [kind=K, 0247+523 → 0247+588]
- p.195#14 (2 spans): `Pangasinan-La Union Inter-Provl Rd`
  - [kind=K, 0390+000 → 0391+137]; [kind=K, 0391+420 → 0392+000]
- p.196#2 (2 spans): `Calamba-Sta Cruz-Famy Jct Rd`
  - [kind=K, 0074+145 → 0075+427]; [kind=K, 0076+114 → 0076+558]
- p.196#3 (6 spans): `Juanita R. Remulla, Sr. Rd`
  - [kind=K, 0040+191 → 0040+435]; [kind=K, 0040+660 → 0042+000]; [kind=K, 0045+577 → 0045+983]

### Incomplete / truncated

- p.221#27 (2 spans): `Tigbauan-Cordova-Leon Jct Rd`
  - [kind=K, 0024+000 → 0024+, incomplete]
- p.243#27 (2 spans): `Jose Abad Santos Ave (Jasa)`
  - [kind=K, 0122+068 → 0122+, incomplete]
- p.264#36 (2 spans): `Jct Switch-Jct Monte Alegre Rd`
  - [kind=K, 1645+000 → 1645+, incomplete]
- p.276#13 (2 spans): `Jct Bolodbolod-Albor Rd`
  - [kind=K, 0060+(-069) → K0060, incomplete]

## Misses (cue but no parse)

_None_
