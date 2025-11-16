/**
 * Max Edges Rule
 *
 * Detects when diagrams exceed connection complexity threshold.
 * Mermaid rendering is O(n²) in edges, causing performance issues beyond 100 connections.
 *
 * Research: https://docs.mermaidchart.com/blog/posts/flow-charts-are-on2-complex-so-dont-go-over-100-connections
 */

import type { Rule, Issue, RuleConfig } from './types';
import type { Diagram } from '../extractors/types';
import type { Metrics } from '../analyzers/types';

/**
 * Max Edges Rule Implementation
 */
export const maxEdgesRule: Rule = {
  name: 'max-edges',
  defaultSeverity: 'error',
  defaultThreshold: 100,

  check(diagram: Diagram, metrics: Metrics, config: RuleConfig): Issue | null {
    const threshold = config.threshold ?? this.defaultThreshold ?? 100;
    const severity = config.severity ?? this.defaultSeverity;

    if (metrics.edgeCount > threshold) {
      return {
        rule: this.name,
        severity,
        message: `Too many connections (${metrics.edgeCount} > ${threshold})`,
        filePath: diagram.filePath,
        line: diagram.startLine,
        suggestion:
          'Split into multiple diagrams or use subgraphs to reduce complexity. ' +
          'Consider breaking down into logical components with separate diagrams.',
        citation:
          'Mermaid Official Docs: https://docs.mermaidchart.com/blog/posts/flow-charts-are-on2-complex-so-dont-go-over-100-connections',
      };
    }

    return null;
  },
};
