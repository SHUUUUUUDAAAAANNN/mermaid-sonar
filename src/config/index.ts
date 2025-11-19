/**
 * Configuration module exports
 */

export { loadConfig, loadConfigSync } from './loader';
export { defaultConfig } from './defaults';
export { builtInViewportProfiles, getBuiltInProfile, getDefaultProfile } from './viewport-profiles';
export { resolveViewportConfig, applyViewportToRuleConfig } from './viewport-resolver';
export type { Config, PartialConfig, ViewportConfig, ViewportProfile } from './types';
export type { ResolvedViewportConfig, CliViewportOptions } from './viewport-resolver';
