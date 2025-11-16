# Mermaid-Sonar Implementation Plan

> **Mermaid-Sonar**: A research-backed complexity analyzer and readability linter for Mermaid diagrams

## Project Overview

**Purpose**: Detect hidden complexity in Mermaid diagrams using graph theory metrics, cognitive load research, and best practices to ensure diagrams remain readable and maintainable.

**Package Name**: `mermaid-sonar`

**Tagline**: "Detecting hidden complexity in your diagrams"

**Why "Sonar"?**: Like sonar detects underwater obstacles, this tool detects hidden complexity issues in diagram code before they cause readability problems.

---

## Stage 1: Foundation & Core Analysis

**Goal**: Set up project structure and implement basic complexity metrics

**Success Criteria**:
- ✅ Project builds and runs
- ✅ Can extract Mermaid diagrams from markdown
- ✅ Can count nodes and edges accurately
- ✅ Can calculate graph density
- ✅ Basic CLI works with simple output

### Tasks:

1. **Project Setup**
   - Initialize npm project with TypeScript
   - Set up build tooling (tsup or esbuild)
   - Configure ESLint + Prettier
   - Set up Jest for testing
   - Create basic directory structure

2. **Port Existing Functionality**
   - Adapt `validate-mermaid.js` as foundation
   - Convert to TypeScript with proper types
   - Extract diagram parsing logic
   - Implement basic structure analysis

3. **Core Metrics Implementation**
   - Node counting with proper deduplication
   - Edge/connection counting
   - Graph density calculation: `edges / (nodes × (nodes-1))`
   - Max branch width (already exists in original)
   - Average degree calculation

4. **Testing**
   - Unit tests for diagram extraction
   - Test cases for various Mermaid diagram types
   - Fixture diagrams (simple, complex, edge cases)
   - Test metric calculations with known inputs

**Status**: Not Started

---

## Stage 2: Research-Backed Heuristics

**Goal**: Implement cognitive load and complexity thresholds based on research

**Success Criteria**:
- ✅ 100-connection limit check (O(n²) complexity)
- ✅ 50/100 node thresholds (cognitive load research)
- ✅ Cyclomatic complexity for decision-heavy diagrams
- ✅ All thresholds configurable via config file

### Tasks:

1. **Cognitive Load Metrics**
   - High-density diagram check (>50 nodes + density >0.3)
   - Low-density diagram check (>100 nodes)
   - Warning messages with research citations

2. **Connection Complexity**
   - Total edge count validation
   - O(n²) complexity warning at 100 connections
   - Mermaid-specific rendering performance guidance

3. **Cyclomatic Complexity**
   - Detect decision nodes (diamond shapes: `A{label}`)
   - Calculate cyclomatic complexity: `decisions + 1`
   - Warn when exceeds 10-15 decision points

4. **Configuration System**
   - JSON/YAML config file support
   - Override default thresholds
   - Enable/disable specific rules
   - Severity levels (error, warning, info)

**Status**: Not Started

---

## Stage 3: Layout & Pattern Intelligence

**Goal**: Provide smart recommendations for diagram layout and structure

**Success Criteria**:
- ✅ Detects sequential vs hierarchical patterns
- ✅ Recommends appropriate layout (LR vs TD)
- ✅ Identifies subgraph opportunities
- ✅ Detects disconnected components

### Tasks:

1. **Pattern Detection**
   - Sequential/linear progression detection
   - Hierarchical tree structure detection
   - Wide parallel branching detection
   - Reconvergence pattern detection

2. **Layout Recommendations**
   - LR for: sequential processes, timelines, long chains
   - TD for: hierarchical structures, decision trees
   - Subgraph suggestions for complex diagrams
   - Specific guidance based on detected patterns

3. **Structure Analysis**
   - Spine length calculation (longest low-branching path)
   - Detect multiple disconnected components
   - Identify "god diagrams" (trying to show everything)
   - Suggest diagram splitting strategies

4. **Advanced Heuristics**
   - Label length checks
   - Reserved word detection ("end", words starting with o/x)
   - Subgraph usage patterns
   - "One idea per diagram" validation

**Status**: Not Started

---

## Stage 4: Output Formats & Integration

**Goal**: Support multiple output formats for different use cases

**Success Criteria**:
- ✅ Human-readable terminal output with colors
- ✅ JSON output for CI/CD integration
- ✅ Markdown report generation
- ✅ GitHub Actions annotation format
- ✅ JUnit XML for test reporters

### Tasks:

1. **Terminal Output**
   - Colorized warnings/errors (chalk or similar)
   - Summary statistics
   - File location references
   - Actionable recommendations

2. **JSON Output**
   - Structured error/warning objects
   - Machine-readable metrics
   - Exit codes for CI/CD
   - Schema documentation

3. **Report Formats**
   - Markdown report with tables
   - HTML report (optional)
   - GitHub Actions annotations
   - JUnit XML for Jenkins/CI tools

4. **CLI Enhancements**
   - Multiple file/glob support
   - Recursive directory scanning
   - Config file discovery
   - Quiet/verbose modes
   - Fix mode (auto-suggestions)

**Status**: Not Started

---

## Stage 5: Polish & Release

**Goal**: Prepare for npm publication and community use

**Success Criteria**:
- ✅ Comprehensive documentation
- ✅ Published to npm
- ✅ CI/CD pipeline set up
- ✅ Example integrations documented
- ✅ Version 1.0.0 released

### Tasks:

1. **Documentation**
   - Comprehensive README with examples
   - API documentation
   - Configuration guide
   - Rule catalog with rationale
   - Contributing guide
   - Changelog

2. **Examples & Integrations**
   - Pre-commit hook example
   - GitHub Actions workflow
   - CLI usage examples
   - Programmatic API examples
   - VS Code extension (future consideration)

3. **Quality Assurance**
   - 80%+ test coverage
   - Integration tests
   - Performance benchmarks
   - Cross-platform testing (Linux, macOS, Windows)

4. **Publishing**
   - npm package publication
   - GitHub releases with binaries
   - Semantic versioning setup
   - Automated release pipeline

5. **Community**
   - Issue templates
   - PR templates
   - Code of conduct
   - Security policy
   - License (MIT recommended)

**Status**: Not Started

---

## Technical Architecture

### Directory Structure

```
mermaid-sonar/
├── src/
│   ├── analyzers/
│   │   ├── structure.ts         # Graph structure analysis
│   │   ├── complexity.ts        # Complexity metrics
│   │   ├── cognitive-load.ts    # Cognitive load checks
│   │   ├── layout.ts            # Layout recommendations
│   │   └── patterns.ts          # Pattern detection
│   ├── extractors/
│   │   ├── markdown.ts          # Extract diagrams from .md
│   │   └── mermaid.ts           # Parse .mmd files
│   ├── reporters/
│   │   ├── console.ts           # Terminal output
│   │   ├── json.ts              # JSON format
│   │   ├── markdown.ts          # Markdown reports
│   │   └── github.ts            # GitHub annotations
│   ├── rules/
│   │   ├── index.ts             # Rule registry
│   │   ├── max-nodes.ts         # Node count rules
│   │   ├── max-edges.ts         # Edge count rules
│   │   ├── graph-density.ts     # Density rules
│   │   ├── cyclomatic.ts        # Cyclomatic complexity
│   │   └── layout-hint.ts       # Layout recommendations
│   ├── config/
│   │   ├── defaults.ts          # Default configuration
│   │   ├── loader.ts            # Config file loader
│   │   └── schema.ts            # Config validation
│   ├── types/
│   │   ├── diagram.ts           # Diagram types
│   │   ├── metrics.ts           # Metric types
│   │   ├── config.ts            # Config types
│   │   └── results.ts           # Result types
│   ├── cli.ts                   # CLI entry point
│   ├── api.ts                   # Programmatic API
│   └── index.ts                 # Main exports
├── tests/
│   ├── fixtures/                # Test diagrams
│   ├── unit/                    # Unit tests
│   └── integration/             # Integration tests
├── examples/
│   ├── basic-usage/
│   ├── github-actions/
│   ├── pre-commit/
│   └── programmatic/
├── docs/
│   ├── rules.md                 # Rule documentation
│   ├── configuration.md         # Config guide
│   ├── api.md                   # API reference
│   └── research.md              # Research backing
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── release.yml
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── package.json
├── tsconfig.json
├── jest.config.js
├── .eslintrc.js
├── .prettierrc
├── LICENSE
├── README.md
├── CHANGELOG.md
└── IMPLEMENTATION_PLAN.md (this file)
```

### Key Design Decisions

1. **TypeScript-first**: Type safety, better DX, easier to maintain
2. **Zero rendering dependencies**: Pure analysis, no Puppeteer/mmdc needed
3. **Pluggable rules**: Easy to add/remove/configure rules
4. **Multiple output formats**: Flexible integration options
5. **Configurable thresholds**: Teams can adjust to their needs
6. **Research-backed**: All thresholds have scientific rationale

### Core Types

```typescript
interface Diagram {
  content: string;
  startLine: number;
  filePath: string;
  type: DiagramType;
}

interface Metrics {
  nodeCount: number;
  edgeCount: number;
  graphDensity: number;
  maxBranchWidth: number;
  averageDegree: number;
  cyclomaticComplexity: number;
  spineLength: number;
  componentCount: number;
}

interface Issue {
  rule: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  filePath: string;
  line: number;
  suggestion?: string;
}

interface AnalysisResult {
  metrics: Metrics;
  issues: Issue[];
  passed: boolean;
}
```

---

## Research-Backed Thresholds

All thresholds are based on published research or official documentation:

| Metric | Threshold | Source |
|--------|-----------|--------|
| Total connections | 100 max | [Mermaid docs](https://docs.mermaidchart.com/blog/posts/flow-charts-are-on2-complex-so-dont-go-over-100-connections) |
| Nodes (high-density) | 50 max | [Cognitive load research](https://arxiv.org/abs/2008.07944) |
| Nodes (low-density) | 100 max | [Cognitive load research](https://arxiv.org/abs/2008.07944) |
| Graph density warning | 0.3 | Graph theory best practices |
| Cyclomatic complexity | 10-15 max | Software engineering standards |
| Max branch width | 8 max | Visual hierarchy research |

---

## Dependencies

### Production
- `commander` or `yargs` - CLI argument parsing
- `chalk` - Terminal colors
- `glob` - File pattern matching
- `cosmiconfig` - Config file loading

### Development
- `typescript` - Type system
- `tsup` or `esbuild` - Fast bundling
- `jest` - Testing framework
- `@types/*` - Type definitions
- `eslint` - Linting
- `prettier` - Formatting

### Optional
- `@mermaid-js/mermaid-cli` - For validation comparison (testing only)
- `fast-xml-parser` - For JUnit XML output

---

## Success Metrics

### For Users
- Diagrams stay under cognitive load limits
- Clear, actionable recommendations
- Easy CI/CD integration
- Fast analysis (<1s for typical projects)

### For Project
- 100+ GitHub stars in first 3 months
- Featured in Mermaid community resources
- Adopted by at least 5 major open-source projects
- Monthly downloads >1000

---

## Future Enhancements (Post v1.0)

1. **Auto-fix capabilities**
   - Suggest diagram splits
   - Convert TD ↔ LR automatically
   - Add subgraphs automatically

2. **More diagram types**
   - Sequence diagrams
   - State diagrams
   - Entity-relationship diagrams
   - Gantt charts

3. **VS Code Extension**
   - Real-time linting
   - Quick fixes
   - Inline metrics

4. **Web UI**
   - Paste diagram, get analysis
   - Visual complexity heatmap
   - Before/after comparisons

5. **AI-powered suggestions**
   - Use LLMs to suggest simplifications
   - Generate split diagram proposals

---

## Timeline Estimate

- **Stage 1**: 1-2 weeks (foundation)
- **Stage 2**: 1 week (heuristics)
- **Stage 3**: 1-2 weeks (patterns)
- **Stage 4**: 1 week (outputs)
- **Stage 5**: 1 week (polish)

**Total**: 5-7 weeks to v1.0.0

---

## Getting Started (Development)

```bash
# Clone and setup
cd /Users/glen/memento-mori/mermaid-sonar
npm init -y
npm install

# Development
npm run dev        # Watch mode
npm test          # Run tests
npm run build     # Build for production

# Try it out
npm link          # Link globally
mermaid-sonar docs/**/*.md
```

---

## Questions to Answer During Implementation

- [ ] Should we support .mmd files or just markdown?
- [ ] What config file format? (.sonarrc, .sonar.json, package.json field?)
- [ ] Should we validate syntax or assume valid diagrams?
- [ ] How to handle embedded HTML in diagrams?
- [ ] Support for Mermaid configuration blocks?
- [ ] Should we parse diagram content or use regex?
- [ ] Binary distribution or npm-only?

---

## License

MIT - Maximum adoption, minimum friction

---

**Last Updated**: 2025-11-16
**Status**: Planning → Implementation
**Next Review**: After Stage 1 completion
