---
number: 001
title: LR Layout Readability Rule
category: optimization
priority: high
status: draft
dependencies: []
created: 2025-11-17
---

# Specification 001: LR Layout Readability Rule

**Category**: optimization
**Priority**: high
**Status**: draft
**Dependencies**: None

## Context

When analyzing Mermaid diagrams, individual rules (like `max-nodes`, `long-labels`, and `horizontal-chain-too-long`) successfully detect isolated complexity issues. However, there's a critical readability problem that occurs when **multiple factors combine** in LR (left-right) and RL (right-left) layouts:

1. **Many nodes** (even below the absolute max-nodes threshold)
2. **Long node labels** (verbose text)
3. **Horizontal layout** (LR/RL direction)

This combination creates a "perfect storm" where:
- Text becomes too small to read when the diagram is scaled to fit viewports
- Horizontal scrolling becomes excessive and unusable
- Node labels overlap or become cramped
- The diagram is technically valid by individual rule standards but practically unreadable

**Real-world example**: The "overlapping matches" diagram in the ripgrep documentation (http://127.0.0.1:8000/BurntSushi/ripgrep/context-lines/#using-heading-with-context) demonstrates this issue - the LR layout with many nodes and long labels makes the text illegibly small.

## Objective

Implement a composite readability rule (`lr-readability`) that detects when the **combination** of node count, label length, and horizontal layout creates unreadable diagrams, even when individual rules don't trigger.

## Requirements

### Functional Requirements

1. **Detect LR/RL layouts**
   - Parse diagram content to identify `graph LR`, `graph RL`, `flowchart LR`, `flowchart RL`
   - Only apply this rule to horizontal layouts (not TD/TB)

2. **Calculate label metrics**
   - Extract all node labels from diagram
   - Calculate average label length across all nodes
   - Calculate maximum label length
   - Calculate total "text width" estimate (node count × average label length)

3. **Apply composite scoring**
   - Combine node count, average label length, and estimated width
   - Calculate readability score based on research-backed thresholds
   - Use tiered severity (info → warning → error) based on severity

4. **Generate actionable suggestions**
   - Recommend converting to TD layout when appropriate
   - Suggest breaking into multiple diagrams
   - Suggest using shorter labels or abbreviations
   - Suggest subgraph organization

5. **Coordinate with existing rules**
   - Don't duplicate warnings from `max-nodes` or `long-labels`
   - Provide unique value by detecting the **combination** effect
   - Integrate with `layout-hint` rule (don't contradict recommendations)

### Non-Functional Requirements

1. **Performance**
   - Rule execution should complete in <50ms for typical diagrams
   - Label extraction should be efficient (single pass through content)
   - No dependency on external rendering engines

2. **Accuracy**
   - False positive rate <10% (shouldn't flag readable diagrams)
   - Should catch 90%+ of problematic LR diagrams
   - Thresholds should be validated against real-world examples

3. **Configurability**
   - All thresholds must be configurable via `.sonarrc.json`
   - Default values should work for 80% of use cases
   - Support for disabling rule entirely

## Acceptance Criteria

- [ ] Rule detects LR/RL layouts correctly (ignores TD/TB)
- [ ] Extracts and calculates label metrics (avg length, max length, total width)
- [ ] Implements composite readability scoring algorithm
- [ ] Triggers at appropriate thresholds (validated against test cases)
- [ ] Generates helpful, actionable suggestions for fixing
- [ ] Does NOT trigger on readable LR diagrams (validated against examples)
- [ ] Configurable via `.sonarrc.json` with all thresholds exposed
- [ ] Integrated into rule registry (`src/rules/index.ts`)
- [ ] Added to default config (`src/config/defaults.ts`)
- [ ] Documented in `docs/rules.md` with examples
- [ ] Unit tests cover all scoring logic and edge cases
- [ ] Integration tests include real-world examples (ripgrep diagram)
- [ ] Performance validated (<50ms execution time)

## Technical Details

### Implementation Approach

1. **Create new rule file**: `src/rules/lr-readability.ts`

2. **Label extraction logic**:
   ```typescript
   function extractLabels(content: string): Array<{ nodeId: string; label: string }> {
     // Match patterns: A[label], B{label}, C((label)), etc.
     // Return array of node labels
   }
   ```

3. **Readability scoring algorithm**:
   ```typescript
   interface ReadabilityScore {
     score: number;        // 0-100 (higher is more readable)
     severity: Severity;   // 'error' | 'warning' | 'info'
     trigger: 'composite' | 'node-count' | 'label-length' | 'width';
   }

   function calculateReadabilityScore(
     nodeCount: number,
     avgLabelLength: number,
     maxLabelLength: number
   ): ReadabilityScore {
     // Composite scoring algorithm
   }
   ```

4. **Composite scoring formula** (research-backed):
   ```
   widthEstimate = nodeCount × avgLabelLength
   densityFactor = nodeCount / 30  // 30 is "comfortable" node count for LR
   labelFactor = avgLabelLength / 20  // 20 is "comfortable" avg length

   readabilityScore = 100 - (densityFactor × 40 + labelFactor × 40 + widthEstimate/100 × 20)

   Severity mapping:
   - score >= 70: Pass (no issue)
   - score 50-69: Info (minor concern)
   - score 30-49: Warning (readability problem)
   - score < 30: Error (unreadable)
   ```

5. **Threshold configuration**:
   ```json
   {
     "lr-readability": {
       "enabled": true,
       "severity": "warning",
       "thresholds": {
         "maxNodesLR": 30,           // Stricter than general max-nodes
         "avgLabelLength": 20,        // Comfortable average
         "maxLabelLength": 50,        // Individual label max
         "estimatedWidthPx": 2000     // Estimated viewport width
       }
     }
   }
   ```

### Architecture Changes

- **New file**: `src/rules/lr-readability.ts` (implements `Rule` interface)
- **Modified**: `src/rules/index.ts` (register new rule)
- **Modified**: `src/config/defaults.ts` (add default config)
- **Modified**: `docs/rules.md` (document new rule)

### Data Structures

```typescript
interface LabelMetrics {
  labels: Array<{ nodeId: string; label: string }>;
  avgLength: number;
  maxLength: number;
  totalLength: number;
}

interface ReadabilityAnalysis {
  metrics: LabelMetrics;
  nodeCount: number;
  estimatedWidth: number;
  score: number;
  severity: Severity;
  triggerReason: string;
}
```

### APIs and Interfaces

The rule implements the standard `Rule` interface:

```typescript
export const lrReadabilityRule: Rule = {
  name: 'lr-readability',
  defaultSeverity: 'warning',

  check(diagram: Diagram, metrics: Metrics, config: RuleConfig): Issue | null {
    // Implementation
  }
}
```

## Dependencies

- **Prerequisites**: None (standalone rule)
- **Affected Components**:
  - `src/rules/index.ts` (rule registry)
  - `src/config/defaults.ts` (default config)
  - `docs/rules.md` (documentation)
- **External Dependencies**: None (uses existing parsing utilities)

## Testing Strategy

### Unit Tests

**File**: `tests/rules/lr-readability.test.ts`

Test cases:
1. **Layout detection**
   - Correctly identifies LR/RL layouts
   - Ignores TD/TB layouts
   - Handles missing layout declaration

2. **Label extraction**
   - Extracts labels from various node shapes `[]`, `{}`, `(())`, etc.
   - Handles labels with special characters
   - Handles nodes without explicit labels

3. **Scoring algorithm**
   - Readable LR diagram (low node count, short labels) → Pass
   - Moderate LR diagram (30 nodes, avg 20 chars) → Info/Warning
   - Unreadable LR diagram (50+ nodes, avg 30+ chars) → Error
   - Edge cases: 0 nodes, empty labels, very long labels

4. **Configuration**
   - Respects custom thresholds
   - Handles missing config (uses defaults)
   - Rule can be disabled

### Integration Tests

**File**: `tests/integration/lr-readability.test.ts`

1. **Real-world examples**
   - Ripgrep overlapping matches diagram (should trigger error/warning)
   - Readable LR pipeline diagram (should pass)
   - Complex LR state machine (validate threshold)

2. **Rule coordination**
   - Doesn't contradict `layout-hint` recommendations
   - Provides unique value beyond `max-nodes` and `long-labels`
   - Works with `horizontal-chain-too-long` without duplication

### Performance Tests

- Benchmark with diagrams of varying sizes (10, 50, 100, 200 nodes)
- Validate <50ms execution time for typical diagrams (<100 nodes)
- Memory usage should be O(n) where n = number of nodes

## Documentation Requirements

### Code Documentation

- JSDoc comments for all exported functions
- Inline comments explaining scoring algorithm
- Examples in function documentation

### User Documentation

**Update `docs/rules.md`**:

```markdown
### lr-readability

**Description**: Detects unreadable diagrams caused by combining horizontal
layouts (LR/RL) with many nodes and long labels.

**When it triggers**:
- LR or RL layout
- High combined score of node count × average label length
- Estimated diagram width exceeds viewport limits

**Why it matters**:
When horizontal layouts contain many nodes with verbose labels, the resulting
diagram becomes unreadable:
- Text scales down to illegible sizes
- Excessive horizontal scrolling required
- Labels overlap or become cramped
- Poor user experience on standard viewports (1280-1920px)

**Example that triggers**:
[Ripgrep overlapping matches diagram example]

**How to fix**:
1. Convert to TD layout for better vertical scrolling
2. Use shorter, more concise labels
3. Break into multiple focused diagrams
4. Use abbreviations with legend

**Configuration**:
[Config example from above]
```

### Architecture Updates

No changes to `ARCHITECTURE.md` required (follows existing rule pattern).

## Implementation Notes

### Key Considerations

1. **Label length calculation**
   - Use actual character count, not visual width
   - Consider monospace font assumption
   - Account for unicode characters (length may vary)

2. **Width estimation**
   - Approximate calculation (no actual rendering)
   - Based on average character width assumptions
   - Include padding/margins in estimate

3. **Coordination with existing rules**
   - Check if `max-nodes` already triggered (mention in suggestion)
   - Check if `long-labels` already triggered (coordinate message)
   - Don't contradict `layout-hint` if it suggests LR

4. **Edge cases**
   - Diagrams with no explicit labels (use node IDs)
   - Mixed label lengths (use both avg and max)
   - Very short labels but many nodes (prioritize node count)
   - Very long labels but few nodes (prioritize label length)

### Algorithm Validation

Validate scoring algorithm against these examples:

1. **Readable** (should pass):
   - 15 nodes, avg 12 chars → score ~85
   - 10 nodes, avg 25 chars → score ~75

2. **Warning zone**:
   - 30 nodes, avg 20 chars → score ~50-60
   - 25 nodes, avg 25 chars → score ~45-55

3. **Error zone**:
   - 50 nodes, avg 30 chars → score ~25
   - 40 nodes, avg 35 chars → score ~20
   - **Ripgrep example**: Validate actual values and expected severity

## Migration and Compatibility

### Breaking Changes

None - this is a new rule with no breaking changes.

### Configuration Migration

New configuration key `lr-readability` will be added to defaults. Existing
configurations will automatically inherit the new rule with default settings.

### Backward Compatibility

- Existing diagrams analyzed before this rule won't retroactively fail
- Rule can be disabled in config if not desired
- No changes to JSON output schema (uses existing `Issue` interface)

## Success Metrics

After implementation:

1. **Effectiveness**: Rule catches 90%+ of problematic LR diagrams in test suite
2. **False positives**: <10% of readable LR diagrams flagged incorrectly
3. **Performance**: <50ms execution time for typical diagrams
4. **User feedback**: Actionable suggestions help users fix issues
5. **Adoption**: Rule enabled by default without significant complaints

## Research References

1. **Viewport width standards**
   - Common desktop widths: 1280px, 1366px, 1920px
   - Recommended content width: 1200px max

2. **Text legibility**
   - Minimum readable font size: 11-12px
   - Comfortable reading size: 14-16px

3. **Cognitive load**
   - Wide horizontal scanning is more tiring than vertical scrolling
   - "F-pattern" reading suggests top-down preference

4. **Mermaid rendering**
   - Node width approximately: label_length × 8px (estimate)
   - Minimum spacing between nodes: ~50px

## Future Enhancements

Potential future improvements (not in scope for initial implementation):

1. **Visual width calculation**: Use actual font metrics for precise width
2. **Viewport size awareness**: Adjust thresholds based on target viewport
3. **Auto-fix suggestions**: Generate converted TD version of diagram
4. **Clustering detection**: Identify natural groupings for subgraph suggestions
5. **Label abbreviation suggestions**: Propose specific abbreviations
