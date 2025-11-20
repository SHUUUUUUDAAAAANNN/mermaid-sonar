# Diagram Type Examples

This directory contains before/after examples for different Mermaid diagram types, demonstrating common readability issues detected by Mermaid-Sonar and how to refactor them.

## Examples

### State Diagrams
- **[state-diagram-bad.md](./state-diagram-bad.md)** - Wide horizontal state machine that triggers width errors
- **[state-diagram-good.md](./state-diagram-good.md)** - Refactored to vertical layout with better readability

### Class Diagrams
- **[class-diagram-bad.md](./class-diagram-bad.md)** - Overcrowded class diagram with too many classes
- **[class-diagram-good.md](./class-diagram-good.md)** - Split into focused domain diagrams

### Sequence Diagrams
- **[sequence-diagram-bad.md](./sequence-diagram-bad.md)** - Overly complex sequence with too many participants and messages
- **[sequence-diagram-good.md](./sequence-diagram-good.md)** - Simplified and split into logical interaction flows

## Running Analysis

Analyze all bad examples to see errors:
```bash
mermaid-sonar examples/diagram-types/*-bad.md
```

Analyze good examples to verify they pass:
```bash
mermaid-sonar examples/diagram-types/*-good.md
```

Compare before and after:
```bash
# See the issues in bad examples
mermaid-sonar --format json examples/diagram-types/*-bad.md > bad-results.json

# Verify good examples pass
mermaid-sonar --format json examples/diagram-types/*-good.md > good-results.json
```
