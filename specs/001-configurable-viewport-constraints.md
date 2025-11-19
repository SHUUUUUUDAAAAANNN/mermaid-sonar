---
number: 001
title: Configurable Viewport Constraints for Different Rendering Contexts
category: compatibility
priority: high
status: draft
dependencies: []
created: 2025-11-19
---

# Specification 001: Configurable Viewport Constraints for Different Rendering Contexts

**Category**: compatibility
**Priority**: high
**Status**: draft
**Dependencies**: None

## Context

Mermaid-Sonar currently uses hardcoded viewport width and height constraints in the `horizontal-width-readability` and `vertical-height-readability` rules. These default thresholds (1200px width, 800px height) are based on standard browser viewports but don't account for different rendering contexts.

Real-world use case: The ripgrep documentation project (`../ripgrep/docs`) uses MkDocs which renders markdown content in a constrained container that's narrower than the full browser viewport. The actual content area is approximately 800-900px wide, making diagrams that would be acceptable in a full-width viewport problematic in the MkDocs context.

Other rendering contexts with non-standard viewport constraints include:
- Documentation frameworks (MkDocs, Docusaurus, GitBook, etc.) with sidebar layouts
- GitHub README files with dynamic viewport adaptation
- IDE preview panes (VS Code, JetBrains)
- Mobile documentation apps
- Embedded documentation in tools/CLIs
- PDF generation from markdown
- Presentation tools using markdown

Currently, users must either:
1. Accept false positives (diagrams flagged as problematic that render fine)
2. Accept false negatives (diagrams not flagged that are actually unreadable in their context)
3. Disable the rules entirely, losing valuable readability checks

## Objective

Enable users to easily configure viewport width and height constraints to match their specific rendering context, ensuring accurate diagram readability validation for their actual deployment environment.

## Requirements

### Functional Requirements

1. **Per-Project Configuration**: Allow projects to specify viewport constraints in their `.sonarrc.json` configuration file
2. **Per-Context Profiles**: Support defining multiple viewport profiles for different rendering contexts (e.g., "docs-site", "github", "pdf")
3. **Rule-Level Configuration**: Maintain backward compatibility by supporting configuration at the rule level
4. **Intelligent Defaults**: Provide sensible defaults for common documentation frameworks
5. **CLI Override**: Allow viewport constraints to be overridden via command-line flags for one-off analysis
6. **Documentation Framework Detection**: Optionally auto-detect rendering context from project structure

### Non-Functional Requirements

1. **Backward Compatibility**: Existing configurations must continue to work without modification
2. **Clear Error Messages**: Configuration errors should provide helpful guidance
3. **Performance**: Configuration loading should not significantly impact analysis speed
4. **Documentation**: Clear examples for common frameworks and use cases
5. **Validation**: Configuration values should be validated with helpful error messages

## Acceptance Criteria

- [ ] Users can configure viewport width in `.sonarrc.json` with `targetWidth` and threshold values
- [ ] Users can configure viewport height in `.sonarrc.json` with `targetHeight` and threshold values
- [ ] Configuration supports defining named viewport profiles (e.g., "mkdocs", "github", "default")
- [ ] CLI accepts `--viewport-profile <name>` flag to select a predefined profile
- [ ] CLI accepts `--target-width <pixels>` and `--target-height <pixels>` flags for ad-hoc overrides
- [ ] Existing configurations without viewport settings continue using current defaults
- [ ] Configuration validation detects invalid values and provides clear error messages
- [ ] Documentation includes examples for MkDocs, Docusaurus, GitBook, GitHub, and other common frameworks
- [ ] Rule documentation (docs/rules.md) explains viewport configuration options
- [ ] Configuration guide (docs/configuration.md) has dedicated section on viewport constraints
- [ ] Unit tests verify configuration loading and merging behavior
- [ ] Integration tests verify viewport constraints are applied correctly during analysis

## Technical Details

### Implementation Approach

**1. Configuration Schema Enhancement**

Extend the configuration schema to support viewport profiles:

```typescript
// src/config/types.ts
export interface ViewportProfile {
  name: string;
  description?: string;
  targetWidth: number;
  targetHeight: number;
  widthThresholds?: {
    info?: number;
    warning?: number;
    error?: number;
  };
  heightThresholds?: {
    info?: number;
    warning?: number;
    error?: number;
  };
}

export interface Config {
  // Existing rules config
  rules: { ... };

  // New viewport configuration
  viewport?: {
    // Active profile name
    profile?: string;

    // Named viewport profiles
    profiles?: Record<string, ViewportProfile>;

    // Direct overrides (takes precedence over profile)
    targetWidth?: number;
    targetHeight?: number;
  };
}
```

**2. Default Viewport Profiles**

Provide built-in profiles for common frameworks:

```typescript
// src/config/viewport-profiles.ts
export const builtInViewportProfiles: Record<string, ViewportProfile> = {
  'default': {
    name: 'default',
    description: 'Standard browser viewport',
    targetWidth: 1200,
    targetHeight: 800,
    widthThresholds: { info: 1500, warning: 2000, error: 2500 },
    heightThresholds: { info: 800, warning: 1200, error: 2000 }
  },
  'mkdocs': {
    name: 'mkdocs',
    description: 'MkDocs documentation framework with sidebar',
    targetWidth: 800,
    targetHeight: 800,
    widthThresholds: { info: 800, warning: 1000, error: 1200 },
    heightThresholds: { info: 800, warning: 1200, error: 2000 }
  },
  'docusaurus': {
    name: 'docusaurus',
    description: 'Docusaurus documentation framework',
    targetWidth: 900,
    targetHeight: 800,
    widthThresholds: { info: 900, warning: 1200, error: 1500 },
    heightThresholds: { info: 800, warning: 1200, error: 2000 }
  },
  'github': {
    name: 'github',
    description: 'GitHub README and markdown files',
    targetWidth: 1000,
    targetHeight: 800,
    widthThresholds: { info: 1000, warning: 1400, error: 1800 },
    heightThresholds: { info: 800, warning: 1200, error: 2000 }
  },
  'mobile': {
    name: 'mobile',
    description: 'Mobile device constraints',
    targetWidth: 400,
    targetHeight: 600,
    widthThresholds: { info: 400, warning: 500, error: 600 },
    heightThresholds: { info: 600, warning: 800, error: 1000 }
  }
};
```

**3. Configuration Resolution**

Priority order for resolving viewport constraints:

1. CLI flags (`--target-width`, `--target-height`) - highest priority
2. Config file direct overrides (`viewport.targetWidth`, `viewport.targetHeight`)
3. Selected profile (`viewport.profile` or `--viewport-profile`)
4. Rule-level configuration (backward compatibility)
5. Default profile - lowest priority

**4. CLI Flag Support**

Add new CLI flags:

```typescript
// src/cli/options.ts
export interface CliOptions {
  // Existing options...

  // New viewport options
  viewportProfile?: string;
  targetWidth?: number;
  targetHeight?: number;
}
```

**5. Rule Updates**

Update width and height rules to use resolved viewport configuration:

```typescript
// src/rules/horizontal-width-readability.ts
export const horizontalWidthReadabilityRule: Rule = {
  name: 'horizontal-width-readability',
  defaultSeverity: 'warning',

  check(diagram: Diagram, metrics: Metrics, config: RuleConfig): Issue | null {
    // Resolve viewport configuration with fallbacks
    const viewportConfig = resolveViewportConfig(config);

    const targetWidth = viewportConfig.targetWidth;
    const thresholds = viewportConfig.widthThresholds;

    // Rest of the rule logic...
  },
};
```

### Architecture Changes

1. **Configuration Loader**: Extend `src/config/loader.ts` to load and merge viewport profiles
2. **Viewport Resolver**: New module `src/config/viewport-resolver.ts` to handle configuration resolution
3. **CLI Parser**: Update `src/cli/parser.ts` to accept new viewport flags
4. **Rule Updates**: Modify width/height rules to use resolved viewport configuration

### Data Structures

```typescript
// Resolved viewport configuration passed to rules
interface ResolvedViewportConfig {
  targetWidth: number;
  targetHeight: number;
  widthThresholds: {
    info: number;
    warning: number;
    error: number;
  };
  heightThresholds: {
    info: number;
    warning: number;
    error: number;
  };
  source: 'cli' | 'config-direct' | 'profile' | 'rule' | 'default';
}
```

### Configuration Examples

**Example 1: MkDocs Project**

`.sonarrc.json`:
```json
{
  "mermaid-sonar": {
    "viewport": {
      "profile": "mkdocs"
    },
    "rules": {
      "horizontal-width-readability": {
        "enabled": true,
        "severity": "error"
      },
      "vertical-height-readability": {
        "enabled": true,
        "severity": "warning"
      }
    }
  }
}
```

**Example 2: Custom Viewport with Thresholds**

`.sonarrc.json`:
```json
{
  "mermaid-sonar": {
    "viewport": {
      "targetWidth": 750,
      "targetHeight": 900,
      "profiles": {
        "custom-docs": {
          "name": "custom-docs",
          "description": "Our custom documentation site",
          "targetWidth": 750,
          "targetHeight": 900,
          "widthThresholds": {
            "info": 750,
            "warning": 900,
            "error": 1100
          },
          "heightThresholds": {
            "info": 900,
            "warning": 1300,
            "error": 1800
          }
        }
      },
      "profile": "custom-docs"
    }
  }
}
```

**Example 3: CLI Override**

```bash
# Use built-in profile
mermaid-sonar --viewport-profile mkdocs docs/

# Ad-hoc override
mermaid-sonar --target-width 800 --target-height 1000 docs/

# Combine with other options
mermaid-sonar --viewport-profile github --strict docs/
```

## Dependencies

**Prerequisites**: None - this is a foundational configuration enhancement

**Affected Components**:
- `src/config/types.ts` - Configuration type definitions
- `src/config/defaults.ts` - Default configuration values
- `src/config/loader.ts` - Configuration loading logic
- `src/rules/horizontal-width-readability.ts` - Width validation rule
- `src/rules/vertical-height-readability.ts` - Height validation rule
- `src/cli/parser.ts` - CLI argument parsing
- `docs/configuration.md` - Configuration documentation
- `docs/rules.md` - Rule documentation

**External Dependencies**: None - uses existing configuration infrastructure

## Testing Strategy

### Unit Tests

1. **Configuration Loading**:
   - Test loading viewport profiles from config file
   - Test merging with built-in profiles
   - Test validation of invalid profile values
   - Test backward compatibility with existing configs

2. **Viewport Resolution**:
   - Test priority order (CLI > config > profile > rule > default)
   - Test profile selection and application
   - Test threshold calculation and merging
   - Test error handling for missing profiles

3. **CLI Parsing**:
   - Test `--viewport-profile` flag parsing
   - Test `--target-width` and `--target-height` flag parsing
   - Test flag validation and error messages

4. **Rule Integration**:
   - Test width rule uses resolved viewport config
   - Test height rule uses resolved viewport config
   - Test threshold application at different severity levels

### Integration Tests

1. **End-to-End Analysis**:
   - Test analyzing diagrams with different viewport profiles
   - Test MkDocs profile catches narrower viewport issues
   - Test mobile profile catches even tighter constraints
   - Test CLI overrides work correctly

2. **Configuration Files**:
   - Test various config file formats (JSON, YAML, JS)
   - Test nested configuration resolution
   - Test invalid configuration handling

### Test Fixtures

Create test diagrams specifically for viewport testing:
- `tests/fixtures/mkdocs-viewport-test.md` - Diagrams sized for MkDocs constraints
- `tests/fixtures/mobile-viewport-test.md` - Mobile-sized diagram validation
- `tests/fixtures/wide-but-acceptable.md` - Diagrams acceptable in standard viewport but not MkDocs

## Documentation Requirements

### Code Documentation

- JSDoc comments for new viewport configuration types
- Function documentation for viewport resolution logic
- Examples in code comments for profile definitions

### User Documentation

1. **Configuration Guide Update** (`docs/configuration.md`):
   - Add "Viewport Configuration" section after "Rule Configuration"
   - Explain viewport profiles concept and usage
   - Provide examples for all built-in profiles
   - Show how to create custom profiles
   - Document CLI flags

2. **Rule Documentation Update** (`docs/rules.md`):
   - Update `horizontal-width-readability` rule documentation
   - Update `vertical-height-readability` rule documentation
   - Add examples showing viewport configuration impact
   - Explain how viewport affects rule behavior

3. **New Quick Start Guide** (optional):
   - "Setting Up Mermaid-Sonar for MkDocs"
   - "Setting Up Mermaid-Sonar for Docusaurus"
   - "Setting Up Mermaid-Sonar for GitHub Documentation"

### README Update

Update README.md to mention viewport configuration:
- Add note in "Configurable" feature bullet
- Add example in "Configuration" section
- Reference viewport profiles in "Quick Start"

## Implementation Notes

### Backward Compatibility Strategy

1. **Default Behavior**: If no viewport configuration is specified, use current hardcoded defaults
2. **Rule-Level Config**: Existing rule-level `targetWidth` and `targetHeight` continue to work
3. **Gradual Migration**: Users can migrate to viewport profiles at their own pace
4. **Deprecation Plan**: No deprecation needed - both approaches can coexist

### Configuration Validation

Validate viewport configuration at load time:
- Ensure `targetWidth` and `targetHeight` are positive integers
- Ensure threshold values are in ascending order (info < warning < error)
- Ensure thresholds are greater than or equal to target values
- Warn if selected profile doesn't exist
- Provide helpful error messages with examples

### Auto-Detection Considerations

Future enhancement (not in this spec): Auto-detect documentation framework from project structure:
- Presence of `mkdocs.yml` → mkdocs profile
- Presence of `docusaurus.config.js` → docusaurus profile
- Running in GitHub Actions → github profile

This would be opt-in via `viewport.autoDetect: true` configuration option.

### Performance Considerations

- Configuration loading happens once at startup
- Viewport resolution happens per-file but is lightweight (simple property access)
- Profile definitions are pre-computed and immutable
- No measurable performance impact expected

## Migration and Compatibility

### Breaking Changes

None. This is a backward-compatible enhancement.

### Migration Path

Users can adopt viewport profiles incrementally:

**Phase 1** (Immediate): Continue using existing configuration
```json
{
  "rules": {
    "horizontal-width-readability": {
      "targetWidth": 1200
    }
  }
}
```

**Phase 2** (When ready): Migrate to built-in profile
```json
{
  "viewport": {
    "profile": "mkdocs"
  }
}
```

**Phase 3** (If needed): Create custom profile
```json
{
  "viewport": {
    "profiles": {
      "my-docs": { ... }
    },
    "profile": "my-docs"
  }
}
```

### Compatibility Matrix

| Configuration Type | Supported | Priority |
|-------------------|-----------|----------|
| No viewport config | ✅ Yes | Use defaults |
| Rule-level config only | ✅ Yes | Medium |
| Viewport profile only | ✅ Yes | High |
| Viewport + rule config | ✅ Yes | Viewport wins |
| CLI flags | ✅ Yes | Highest |

## Example Use Cases

### Use Case 1: ripgrep Documentation with MkDocs

**Problem**: ripgrep's MkDocs site has ~800px content width, but diagrams are validated against 1200px default.

**Solution**:
```json
{
  "mermaid-sonar": {
    "viewport": {
      "profile": "mkdocs"
    }
  }
}
```

**Result**: Diagrams are now validated against 800px width, catching readability issues before deployment.

### Use Case 2: Multi-Context Documentation

**Problem**: Documentation is used in both GitHub and deployed docs site with different constraints.

**Solution**:
```bash
# For GitHub preview
mermaid-sonar --viewport-profile github README.md

# For docs site
mermaid-sonar --viewport-profile mkdocs docs/
```

**Result**: Same diagrams validated against appropriate constraints for each context.

### Use Case 3: Mobile Documentation App

**Problem**: Documentation app targets mobile devices with small screens.

**Solution**:
```json
{
  "viewport": {
    "profile": "mobile"
  }
}
```

**Result**: Diagrams are validated for mobile viewport constraints, ensuring readable diagrams on small screens.
