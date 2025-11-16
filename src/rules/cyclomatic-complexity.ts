/**
 * Cyclomatic Complexity Rule
 *
 * Calculates cyclomatic complexity from decision nodes (diamond shapes) in diagrams.
 * Formula: complexity = decision_nodes + 1
 *
 * Based on McCabe's cyclomatic complexity metric from software engineering.
 * Threshold of 10 indicates maintainability boundary.
 */

import type { Rule, Issue, RuleConfig } from './types';
import type { Diagram } from '../extractors/types';
import type { Metrics } from '../analyzers/types';

/**
 * Counts decision nodes (diamond shapes) in diagram
 *
 * Detects patterns like: A{label}, B{Decision?}, etc.
 *
 * @param content - Diagram content
 * @returns Number of decision nodes
 */
function countDecisionNodes(content: string): number {
  // Match diamond shape nodes: A{label}
  const decisionPattern = /\b([A-Z][A-Z0-9]*)\s*\{[^}]*\}/g;
  const matches = content.match(decisionPattern);

  return matches ? matches.length : 0;
}

/**
 * Calculates cyclomatic complexity
 *
 * @param decisionNodeCount - Number of decision nodes
 * @returns Cyclomatic complexity
 */
function calculateCyclomaticComplexity(decisionNodeCount: number): number {
  return decisionNodeCount + 1;
}

/**
 * Cyclomatic Complexity Rule Implementation
 */
export const cyclomaticComplexityRule: Rule = {
  name: 'cyclomatic-complexity',
  defaultSeverity: 'warning',
  defaultThreshold: 10,

  check(diagram: Diagram, _metrics: Metrics, config: RuleConfig): Issue | null {
    const threshold = config.threshold ?? this.defaultThreshold ?? 10;
    const severity = config.severity ?? this.defaultSeverity;

    const decisionCount = countDecisionNodes(diagram.content);
    const complexity = calculateCyclomaticComplexity(decisionCount);

    if (complexity > threshold) {
      return {
        rule: this.name,
        severity,
        message: `High cyclomatic complexity (${complexity} > ${threshold}) with ${decisionCount} decision nodes`,
        filePath: diagram.filePath,
        line: diagram.startLine,
        suggestion:
          'High decision complexity makes diagrams hard to follow. ' +
          'Consider extracting decision logic into separate sub-diagrams or simplifying the flow.',
        citation: "McCabe's Cyclomatic Complexity - Software Engineering Standards (IEEE)",
      };
    }

    return null;
  },
};
