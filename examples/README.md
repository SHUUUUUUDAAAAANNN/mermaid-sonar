# Mermaid-Sonar Examples

This directory contains examples demonstrating various use cases and integrations for Mermaid-Sonar.

## Examples

### 📚 Diagram Type Examples ([diagram-types/](./diagram-types/))
Before/after examples showing common readability issues for different Mermaid diagram types and how to refactor them:
- **State Diagrams** - Wide horizontal state machines → Vertical layouts or phased diagrams
- **Class Diagrams** - Overcrowded system diagrams → Domain-focused diagrams
- **Sequence Diagrams** - Complex multi-participant flows → Scenario-based diagrams

Each example includes:
- "Bad" version that triggers Mermaid-Sonar errors
- "Good" refactored version with improvements
- Detailed explanations of issues and fixes

Perfect for learning diagram refactoring best practices.

### 💻 Basic Usage ([basic-usage/](./basic-usage/))
Simple examples demonstrating the Mermaid-Sonar API:
- Analyzing files with glob patterns
- Analyzing single files
- Analyzing diagram content directly
- Using custom configuration
- Filtering results

### 🔧 CI/CD Integration Examples

#### GitHub Actions ([github-actions/](./github-actions/))
Example GitHub Actions workflow for linting Mermaid diagrams in pull requests.

#### GitLab CI ([gitlab-ci/](./gitlab-ci/))
Example GitLab CI pipeline with JUnit XML output for test integration.

#### Pre-commit Hook ([pre-commit/](./pre-commit/))
Example pre-commit configuration for validating diagrams before commits.

### 🎨 Editor Integration

#### VS Code ([vscode/](./vscode/))
Example VS Code tasks for:
- Linting Mermaid diagrams
- Generating diagram reports
- Integration with test explorer

### 🔬 Analysis Examples ([mermaid-sonar-complexity-analyzer/](./mermaid-sonar-complexity-analyzer/))
Advanced examples demonstrating complexity analysis patterns and custom rule configurations.

## Quick Start

### Run Diagram Type Examples

See errors in bad examples:
```bash
mermaid-sonar examples/diagram-types/*-bad.md
```

Verify good examples pass:
```bash
mermaid-sonar examples/diagram-types/*-good.md
```

### Run Basic API Examples

```bash
cd examples/basic-usage
node example.js
```

### Test CI/CD Integration

See each integration directory for specific setup instructions:
- [GitHub Actions](./github-actions/)
- [GitLab CI](./gitlab-ci/)
- [Pre-commit Hook](./pre-commit/)

## Learning Path

1. **Start with diagram-types/** - Learn refactoring patterns for common issues
2. **Try basic-usage/** - Understand the API and configuration options
3. **Explore CI/CD examples** - Integrate into your workflow
4. **Customize** - Adapt examples to your project's needs

## Contributing Examples

Have a useful example to share? Contributions welcome! Please ensure:
- Clear documentation of what the example demonstrates
- Working code that runs without external dependencies
- README explaining setup and usage
