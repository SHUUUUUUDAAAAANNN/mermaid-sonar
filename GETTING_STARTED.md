# Getting Started with Mermaid-Sonar Development

## Project Setup Complete ✅

Your mermaid-sonar project has been initialized with:

- ✅ Complete directory structure
- ✅ TypeScript configuration
- ✅ Build tooling (tsup)
- ✅ Testing framework (Jest)
- ✅ Linting (ESLint) and formatting (Prettier)
- ✅ Comprehensive implementation plan
- ✅ Initial validator code from ripgrep project

## Next Steps

### 1. Install Dependencies

```bash
cd /Users/glen/memento-mori/mermaid-sonar
npm install
```

### 2. Start Implementation - Stage 1

Follow the **IMPLEMENTATION_PLAN.md** starting with Stage 1:

**Priority tasks**:
1. Port `src/legacy-validator.js` to TypeScript
2. Extract diagram parsing into `src/extractors/markdown.ts`
3. Implement core metrics in `src/analyzers/structure.ts`
4. Create basic CLI in `src/cli.ts`

### 3. Development Workflow

```bash
# Watch mode (auto-rebuild on changes)
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run typecheck

# Lint code
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

### 4. File Structure Reference

```
mermaid-sonar/
├── src/
│   ├── analyzers/        # Graph analysis, complexity metrics
│   ├── extractors/       # Extract diagrams from markdown/mmd
│   ├── reporters/        # Output formatters (console, JSON, etc)
│   ├── rules/           # Individual linting rules
│   ├── config/          # Configuration system
│   ├── types/           # TypeScript type definitions
│   ├── legacy-validator.js  # Original code from ripgrep
│   ├── cli.ts           # CLI entry point
│   ├── api.ts           # Programmatic API
│   └── index.ts         # Main exports
├── tests/
│   ├── fixtures/        # Test diagrams
│   ├── unit/           # Unit tests
│   └── integration/    # Integration tests
└── docs/               # Documentation
```

## Key Design Principles

From your CLAUDE.md guidelines:

1. **Incremental progress** - Small changes that compile and pass tests
2. **Pure functions** - Separate I/O from logic
3. **Max 20 lines per function** - Keep functions small and focused
4. **Test-driven** - Write tests first when possible
5. **Research-backed** - All thresholds have scientific rationale

## Implementation Roadmap

See **IMPLEMENTATION_PLAN.md** for full details:

- **Stage 1** (1-2 weeks): Foundation & Core Analysis
  - Project setup ✅ DONE
  - Port existing functionality
  - Core metrics implementation
  - Basic CLI

- **Stage 2** (1 week): Research-Backed Heuristics
  - Cognitive load metrics
  - Connection complexity
  - Cyclomatic complexity
  - Configuration system

- **Stage 3** (1-2 weeks): Layout & Pattern Intelligence
  - Pattern detection
  - Layout recommendations
  - Structure analysis

- **Stage 4** (1 week): Output Formats & Integration
  - Multiple output formats
  - CLI enhancements

- **Stage 5** (1 week): Polish & Release
  - Documentation
  - Publishing
  - Community setup

**Total estimated time**: 5-7 weeks to v1.0.0

## Initial Code to Port

The `src/legacy-validator.js` file contains:
- Diagram extraction from markdown
- Basic structure analysis (adjacency maps, in-degree)
- Pattern detection (linear progression, wide tree)
- Readability checks
- Max branch width calculation

**Refactoring priorities**:
1. Convert to TypeScript with proper types
2. Break into smaller, pure functions (<20 lines)
3. Separate parsing from analysis
4. Add comprehensive tests

## Testing Strategy

Create test fixtures in `tests/fixtures/`:
- `simple.md` - Basic diagrams
- `complex.md` - Complex diagrams with known metrics
- `edge-cases.md` - Unusual patterns
- Individual `.mmd` files for unit tests

Example test structure:
```typescript
describe('Structure Analyzer', () => {
  it('counts nodes correctly', () => {
    const diagram = 'graph TD\n  A --> B\n  B --> C';
    const metrics = analyzeStructure(diagram);
    expect(metrics.nodeCount).toBe(3);
  });
});
```

## Research References

All in the implementation plan, but key papers:
- [Cognitive load research](https://arxiv.org/abs/2008.07944) - 50/100 node limits
- [Mermaid O(n²) complexity](https://docs.mermaidchart.com/blog/posts/flow-charts-are-on2-complex-so-dont-go-over-100-connections)
- McCabe's cyclomatic complexity

## Questions to Resolve

As you implement, answer these (documented in IMPLEMENTATION_PLAN.md):

- [ ] Should we support .mmd files or just markdown?
- [ ] What config file format preference?
- [ ] Should we validate syntax or assume valid diagrams?
- [ ] How to handle embedded HTML in diagrams?
- [ ] Should we parse diagram content or use regex?

## Getting Help

- Review the **IMPLEMENTATION_PLAN.md** for detailed guidance
- Check **README.md** for user-facing features
- Reference `src/legacy-validator.js` for existing logic
- Follow your CLAUDE.md guidelines for code quality

## Quick Commands Reference

```bash
# Setup
cd /Users/glen/memento-mori/mermaid-sonar
npm install

# Development
npm run dev              # Watch mode
npm test                # Run tests
npm run format          # Format code
npm run typecheck       # Check types

# Production
npm run build           # Build for release
npm run prepublishOnly  # Full pre-publish checks
```

---

**Ready to start?** Begin with Stage 1, Task 1: "Port Existing Functionality"

See **IMPLEMENTATION_PLAN.md** for detailed task breakdown! 🚀
