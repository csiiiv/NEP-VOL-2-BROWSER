# Full-volume QA — `v2b-full`

Pages: **722**
Page-level kinds: `{'U': 2, 'P': 39, 'F': 2, 'G': 1, 'D': 1, 'A': 96, 'H': 5, 'B': 576}`
Zone kinds (all zones): `{'U': 2, 'P': 42, 'F': 4, 'G': 1, 'C': 1, 'D': 1, 'A': 97, 'H': 5, 'E': 1, 'B': 576}`

- Row-sum failure pages: **0**
- Multi-zone pages: **5**
- Empty pages: **3**
- Kind transitions: **11**

## Span checks
- **front_F_G**: 0 unexpected
- **byou_A**: 0 unexpected
- **bridge_108_114**: 0 unexpected
- **pap_B**: 0 unexpected
- **provisions_P**: 0 unexpected

## Kind transitions (page-level)
- p.3: U → P
- p.6: P → F
- p.7: F → G
- p.8: G → D
- p.9: D → P
- p.13: P → A
- p.108: A → F
- p.109: F → H
- p.114: H → A
- p.115: A → B
- p.691: B → P

## Multi-zone
- p.8: ['F', 'P', 'C', 'D']
- p.108: ['A', 'F']
- p.109: ['F', 'P', 'H']
- p.111: ['P', 'H']
- p.114: ['E', 'A']
