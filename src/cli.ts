#!/usr/bin/env node

/**
 * Mermaid-Sonar CLI
 *
 * Command-line interface for analyzing Mermaid diagram complexity
 */

import { program } from 'commander';
import { analyzeDiagramFileWithRules } from './index';
import { readFileSync } from 'fs';
import chalk from 'chalk';
import type { Issue } from './rules';

// Read package.json for version
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));

/**
 * Formats metrics for terminal output
 */
function formatMetrics(metrics: {
  nodeCount: number;
  edgeCount: number;
  graphDensity: number;
  maxBranchWidth: number;
  averageDegree: number;
}): string {
  return `
  Nodes:          ${metrics.nodeCount}
  Edges:          ${metrics.edgeCount}
  Density:        ${metrics.graphDensity.toFixed(3)}
  Max Branch:     ${metrics.maxBranchWidth}
  Avg Degree:     ${metrics.averageDegree.toFixed(2)}
`.trim();
}

/**
 * Formats an issue for terminal output
 */
function formatIssue(issue: Issue): string {
  const severityColors = {
    error: chalk.red,
    warning: chalk.yellow,
    info: chalk.blue,
  };

  const severityLabels = {
    error: 'ERROR',
    warning: 'WARNING',
    info: 'INFO',
  };

  const color = severityColors[issue.severity];
  const label = severityLabels[issue.severity];

  let output = `\n${color.bold(`${label}:`)} ${issue.message}`;
  output += `\n  ${chalk.dim(`File: ${issue.filePath}:${issue.line}`)}`;

  if (issue.suggestion) {
    output += `\n\n  ${chalk.cyan('Suggestion:')} ${issue.suggestion}`;
  }

  if (issue.citation) {
    output += `\n  ${chalk.dim(issue.citation)}`;
  }

  return output;
}

/**
 * Main CLI command
 */
program
  .name('mermaid-sonar')
  .description('Detect hidden complexity in Mermaid diagrams')
  .version(packageJson.version)
  .argument('<file>', 'Markdown file to analyze')
  .option('--no-rules', 'Disable rule validation (only show metrics)')
  .action((file: string, options: { rules: boolean }) => {
    try {
      const results = analyzeDiagramFileWithRules(file);

      if (results.length === 0) {
        console.log('No Mermaid diagrams found in file.');
        return;
      }

      console.log(`\nAnalyzed ${results.length} diagram(s) in ${file}\n`);

      let hasErrors = false;
      let hasWarnings = false;

      results.forEach((result, index) => {
        const { diagram, metrics, issues } = result;
        console.log(
          chalk.bold(`Diagram #${index + 1}`) + chalk.dim(` (line ${diagram.startLine}):`)
        );
        console.log(formatMetrics(metrics));

        // Display issues if rules are enabled
        if (options.rules && issues && issues.length > 0) {
          issues.forEach((issue) => {
            console.log(formatIssue(issue));

            if (issue.severity === 'error') {
              hasErrors = true;
            } else if (issue.severity === 'warning') {
              hasWarnings = true;
            }
          });
        }

        console.log('');
      });

      // Summary
      const totalIssues = results.reduce((sum, r) => sum + (r.issues?.length ?? 0), 0);
      if (totalIssues > 0) {
        console.log(chalk.dim(`Found ${totalIssues} issue(s)\n`));
      }

      // Exit with error code if errors found
      if (hasErrors) {
        process.exit(1);
      } else if (hasWarnings) {
        // Exit code 0 for warnings (non-blocking)
        process.exit(0);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red(`Error: ${error.message}`));
      } else {
        console.error(chalk.red('An unexpected error occurred'));
      }
      process.exit(1);
    }
  });

program.parse();
