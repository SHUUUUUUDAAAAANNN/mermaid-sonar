/**
 * Cognitive Load Rules
 *
 * Detects when diagrams exceed cognitive load thresholds based on node count and density.
 *
 * Research shows that diagram comprehension degrades significantly when:
 * - High-density diagrams (>0.3 density) exceed 50 nodes
 * - Low-density diagrams (≤0.3 density) exceed 100 nodes
 *
 * Research: arXiv:2008.07944 (cognitive load in diagram comprehension)
 */

import type { Rule, Issue, RuleConfig } from './types';
import type { Diagram } from '../extractors/types';
import type { Metrics } from '../analyzers/types';

/**
 * High-Density Cognitive Load Rule
 *
 * Triggers when diagrams have high node density AND exceed node threshold
 */
export const maxNodesHighDensityRule: Rule = {
  name: 'max-nodes-high-density',
  defaultSeverity: 'warning',
  defaultThreshold: 50,

  check(diagram: Diagram, metrics: Metrics, config: RuleConfig): Issue | null {
    const threshold = config.threshold ?? this.defaultThreshold ?? 50;
    const densityThreshold = (config.densityThreshold as number) ?? 0.3;
    const severity = config.severity ?? this.defaultSeverity;

    if (metrics.nodeCount > threshold && metrics.graphDensity > densityThreshold) {
      return {
        rule: this.name,
        severity,
        message: `High cognitive load: ${metrics.nodeCount} nodes with ${(metrics.graphDensity * 100).toFixed(1)}% density`,
        filePath: diagram.filePath,
        line: diagram.startLine,
        suggestion:
          'High-density diagrams with many nodes are difficult to comprehend. ' +
          'Consider splitting into multiple smaller diagrams or reducing connections between nodes.',
        citation: 'Research: arXiv:2008.07944 - Cognitive Load in Diagram Comprehension',
      };
    }

    return null;
  },
};

/**
 * Low-Density Cognitive Load Rule
 *
 * Triggers when diagrams have low density but exceed higher node threshold
 */
export const maxNodesLowDensityRule: Rule = {
  name: 'max-nodes-low-density',
  defaultSeverity: 'warning',
  defaultThreshold: 100,

  check(diagram: Diagram, metrics: Metrics, config: RuleConfig): Issue | null {
    const threshold = config.threshold ?? this.defaultThreshold ?? 100;
    const densityThreshold = 0.3;
    const severity = config.severity ?? this.defaultSeverity;

    if (metrics.nodeCount > threshold && metrics.graphDensity <= densityThreshold) {
      return {
        rule: this.name,
        severity,
        message: `Too many nodes (${metrics.nodeCount} > ${threshold}) even with low density`,
        filePath: diagram.filePath,
        line: diagram.startLine,
        suggestion:
          'Even sparse diagrams become hard to navigate with too many nodes. ' +
          'Consider organizing into hierarchical diagrams or multiple views.',
        citation: 'Research: arXiv:2008.07944 - Cognitive Load in Diagram Comprehension',
      };
    }

    return null;
  },
};
