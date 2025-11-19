# Ripgrep Count List Example

This fixture represents a real-world example similar to ripgrep's count-list.md diagram.
It has an LR layout with 17 nodes and a longest chain of 6 nodes, which should:
- Pass with default profile (2500px max width)
- Fail/warn with mkdocs profile (800px max width)

```mermaid
graph LR
  M1[Match 1: pattern found] --> C1[Context line 1]
  C1 --> SEP1[Separator: --]
  SEP1 --> C2[Context line 2]
  C2 --> M2[Match 2: another match]
  M2 --> C3[Context line 3]
  C3 --> M1A[Match 1 appears again]
  M1A --> C1A[Context again]
  C1A --> OVERLAP[Overlapping region]
  OVERLAP --> M2A[Match 2 again]
  M2A --> C3A[Final context]

  M3[Match 3: independent] --> C4[Context 4]
  C4 --> SEP2[Separator: --]
  SEP2 --> C5[Context 5]
  C5 --> M4[Match 4: final]
  M4 --> END[End of output]
```

This diagram demonstrates:
- **Layout**: LR (left-to-right)
- **Node count**: 17 nodes
- **Longest chain**: M1 -> C1 -> SEP1 -> C2 -> M2 -> C3 (6 nodes)
- **Estimated width**: ~2400px with default labels (passes default, fails mkdocs)
