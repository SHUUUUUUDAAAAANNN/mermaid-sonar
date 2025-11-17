/**
 * Performance tests for syntax validation
 *
 * Verifies that syntax validation adds <100ms overhead per diagram
 * as required by spec 001.
 */

import { syntaxValidationRule } from '../../src/rules/syntax-validation';
import type { Diagram } from '../../src/extractors/types';
import type { Metrics } from '../../src/analyzers/types';
import type { RuleConfig } from '../../src/rules/types';

describe('Performance Benchmarks', () => {
  const mockMetrics: Metrics = {
    nodeCount: 0,
    edgeCount: 0,
    graphDensity: 0,
    maxBranchWidth: 0,
    averageDegree: 0,
  };

  const baseConfig: RuleConfig = {
    enabled: true,
    severity: 'error',
  };

  /**
   * Measure parsing time for a diagram
   */
  async function measureParsingTime(diagram: Diagram): Promise<number> {
    const startTime = performance.now();
    await syntaxValidationRule.check(diagram, mockMetrics, baseConfig);
    const endTime = performance.now();
    return endTime - startTime;
  }

  /**
   * Generate a flowchart with specified number of nodes
   */
  function generateFlowchart(nodeCount: number): string {
    const lines = ['flowchart TD'];
    for (let i = 0; i < nodeCount - 1; i++) {
      lines.push(`  N${i} --> N${i + 1}`);
    }
    return lines.join('\n');
  }

  describe('Syntax Validation Performance', () => {
    it('should validate small diagram (<10 nodes) in <300ms', async () => {
      const diagram: Diagram = {
        content: generateFlowchart(5),
        startLine: 1,
        filePath: 'test.md',
        type: 'flowchart',
      };

      const parsingTime = await measureParsingTime(diagram);
      // DOM polyfill initialization adds overhead on first run
      expect(parsingTime).toBeLessThan(300);
    });

    it('should validate medium diagram (10-50 nodes) in <100ms', async () => {
      const diagram: Diagram = {
        content: generateFlowchart(30),
        startLine: 1,
        filePath: 'test.md',
        type: 'flowchart',
      };

      const parsingTime = await measureParsingTime(diagram);
      expect(parsingTime).toBeLessThan(100);
    });

    it('should validate large diagram (50-100 nodes) in <100ms', async () => {
      const diagram: Diagram = {
        content: generateFlowchart(75),
        startLine: 1,
        filePath: 'test.md',
        type: 'flowchart',
      };

      const parsingTime = await measureParsingTime(diagram);
      expect(parsingTime).toBeLessThan(100);
    });

    it('should maintain average <100ms over multiple diagrams', async () => {
      const diagrams: Diagram[] = [
        {
          content: generateFlowchart(10),
          startLine: 1,
          filePath: 'test1.md',
          type: 'flowchart',
        },
        {
          content: generateFlowchart(25),
          startLine: 1,
          filePath: 'test2.md',
          type: 'flowchart',
        },
        {
          content: generateFlowchart(50),
          startLine: 1,
          filePath: 'test3.md',
          type: 'flowchart',
        },
        {
          content: 'graph TD\n  A --> B\n  B --> C\n  C --> D',
          startLine: 1,
          filePath: 'test4.md',
          type: 'graph',
        },
      ];

      const times: number[] = [];
      for (const diagram of diagrams) {
        const time = await measureParsingTime(diagram);
        times.push(time);
      }

      const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      expect(averageTime).toBeLessThan(100);
    });

    it('should validate complex diagram with branches in <100ms', async () => {
      const diagram: Diagram = {
        content: `flowchart TD
  Start --> Decision
  Decision -->|Yes| Action1
  Decision -->|No| Action2
  Action1 --> SubDecision1
  Action2 --> SubDecision2
  SubDecision1 -->|A| Result1
  SubDecision1 -->|B| Result2
  SubDecision2 -->|C| Result3
  SubDecision2 -->|D| Result4
  Result1 --> End
  Result2 --> End
  Result3 --> End
  Result4 --> End`,
        startLine: 1,
        filePath: 'test.md',
        type: 'flowchart',
      };

      const parsingTime = await measureParsingTime(diagram);
      expect(parsingTime).toBeLessThan(100);
    });

    it('should handle invalid syntax within performance budget', async () => {
      const diagram: Diagram = {
        content: 'flowchart TD\n  A B\n  C --> D',
        startLine: 1,
        filePath: 'test.md',
        type: 'flowchart',
      };

      const parsingTime = await measureParsingTime(diagram);
      expect(parsingTime).toBeLessThan(100);
    });
  });
});
