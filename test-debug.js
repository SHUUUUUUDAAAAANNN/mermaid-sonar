const { horizontalWidthReadabilityRule } = require('./dist/rules/horizontal-width-readability.js');

const diagram = {
  content: `flowchart LR
    Start([Start Search]) --> Filter{"File should
be searched?"}
    Filter -->|No - gitignore, hidden, binary| Skip[Skip File]
    Filter -->|Yes| Read["Read File
Line by Line"]
    Read --> Match{"Line matches
pattern?"}
    Match -->|Yes| Print[Print Line]
    Match -->|No| Next{More lines?}
    Print --> Next
    Next -->|Yes| Read
    Next -->|No| Done{More files?}
    Skip --> Done
    Done -->|Yes| Filter
    Done -->|No| End([Complete])`,
  filePath: 'test.md',
  startLine: 1,
  type: 'flowchart'
};

const metrics = {
  nodeCount: 9,
  edgeCount: 13,
  graphDensity: 0.18,
  maxBranchWidth: 2,
  averageDegree: 2.89
};

const config = {
  enabled: true,
  severity: 'warning',
  targetWidth: 1200,
  thresholds: {
    info: 1500,
    warning: 2000,
    error: 2500
  },
  charWidth: 8,
  nodeSpacing: 50
};

console.log('Testing horizontal-width-readability rule...');
console.log('Diagram:', diagram.content.substring(0, 50) + '...');
console.log('Metrics:', metrics);
console.log('Config:', config);

const result = horizontalWidthReadabilityRule.check(diagram, metrics, config);
console.log('\nResult:', result);
