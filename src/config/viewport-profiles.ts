/**
 * Built-in viewport profiles for common rendering contexts
 *
 * Provides pre-configured viewport constraints for documentation frameworks,
 * GitHub, mobile devices, and other common use cases.
 */

import type { ViewportProfile } from './types';

/**
 * Built-in viewport profiles for common frameworks
 */
export const builtInViewportProfiles: Record<string, ViewportProfile> = {
  default: {
    name: 'default',
    description: 'Standard browser viewport',
    maxWidth: 2500, // ERROR if diagram needs > 2500px width
    maxHeight: 2000, // ERROR if diagram needs > 2000px height
    widthThresholds: { info: 1500, warning: 2000, error: 2500 },
    heightThresholds: { info: 800, warning: 1200, error: 2000 },
  },
  mkdocs: {
    name: 'mkdocs',
    description: 'MkDocs documentation framework with sidebar (~800-900px content width)',
    maxWidth: 800, // ERROR if diagram needs > 800px width
    maxHeight: 1500, // ERROR if diagram needs > 1500px height
    widthThresholds: { info: 600, warning: 700, error: 800 },
    heightThresholds: { info: 1000, warning: 1200, error: 1500 },
  },
  docusaurus: {
    name: 'docusaurus',
    description: 'Docusaurus documentation framework (~900-1000px content width)',
    maxWidth: 900, // ERROR if diagram needs > 900px width
    maxHeight: 1500, // ERROR if diagram needs > 1500px height
    widthThresholds: { info: 700, warning: 800, error: 900 },
    heightThresholds: { info: 1000, warning: 1200, error: 1500 },
  },
  github: {
    name: 'github',
    description: 'GitHub README and markdown files (~1000px content width)',
    maxWidth: 1000, // ERROR if diagram needs > 1000px width
    maxHeight: 1800, // ERROR if diagram needs > 1800px height
    widthThresholds: { info: 800, warning: 900, error: 1000 },
    heightThresholds: { info: 1200, warning: 1500, error: 1800 },
  },
  mobile: {
    name: 'mobile',
    description: 'Mobile device constraints (400px width)',
    maxWidth: 400, // ERROR if diagram needs > 400px width
    maxHeight: 800, // ERROR if diagram needs > 800px height
    widthThresholds: { info: 300, warning: 350, error: 400 },
    heightThresholds: { info: 600, warning: 700, error: 800 },
  },
};

/**
 * Get a built-in viewport profile by name
 */
export function getBuiltInProfile(name: string): ViewportProfile | undefined {
  return builtInViewportProfiles[name];
}

/**
 * Get the default viewport profile
 */
export function getDefaultProfile(): ViewportProfile {
  return builtInViewportProfiles.default;
}
