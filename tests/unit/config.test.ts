/**
 * Unit tests for configuration system
 */

import { loadConfig, loadConfigSync, defaultConfig } from '../../src/config';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';

describe('Configuration System', () => {
  const testConfigPath = join(process.cwd(), '.sonarrc.json');

  beforeEach(() => {
    // Clean up before each test
    if (existsSync(testConfigPath)) {
      unlinkSync(testConfigPath);
    }
  });

  afterEach(() => {
    // Clean up after each test
    if (existsSync(testConfigPath)) {
      unlinkSync(testConfigPath);
    }
  });

  describe('Default Configuration', () => {
    it('should load defaults when no config file exists', () => {
      const config = loadConfigSync('/tmp/nonexistent-path');
      expect(config).toEqual(defaultConfig);
    });

    it('should have all required rules configured', () => {
      expect(defaultConfig.rules['max-edges']).toBeDefined();
      expect(defaultConfig.rules['max-nodes-high-density']).toBeDefined();
      expect(defaultConfig.rules['max-nodes-low-density']).toBeDefined();
      expect(defaultConfig.rules['cyclomatic-complexity']).toBeDefined();
    });

    it('should have research-backed default thresholds', () => {
      expect(defaultConfig.rules['max-edges'].threshold).toBe(100);
      expect(defaultConfig.rules['max-nodes-high-density'].threshold).toBe(50);
      expect(defaultConfig.rules['max-nodes-low-density'].threshold).toBe(100);
      expect(defaultConfig.rules['cyclomatic-complexity'].threshold).toBe(10);
    });

    it('should enable all rules by default', () => {
      expect(defaultConfig.rules['max-edges'].enabled).toBe(true);
      expect(defaultConfig.rules['max-nodes-high-density'].enabled).toBe(true);
      expect(defaultConfig.rules['max-nodes-low-density'].enabled).toBe(true);
      expect(defaultConfig.rules['cyclomatic-complexity'].enabled).toBe(true);
    });
  });

  describe('Custom Configuration (Async)', () => {
    it('should load custom config from .sonarrc.json', async () => {
      const customConfig = {
        rules: {
          'max-edges': {
            enabled: false,
            severity: 'warning',
            threshold: 50,
          },
        },
      };

      writeFileSync(testConfigPath, JSON.stringify(customConfig, null, 2));

      const config = await loadConfig();

      expect(config.rules['max-edges'].enabled).toBe(false);
      expect(config.rules['max-edges'].severity).toBe('warning');
      expect(config.rules['max-edges'].threshold).toBe(50);
    });

    it('should merge custom config with defaults', async () => {
      const customConfig = {
        rules: {
          'max-edges': {
            enabled: false,
          },
        },
      };

      writeFileSync(testConfigPath, JSON.stringify(customConfig, null, 2));

      const config = await loadConfig();

      // Custom value
      expect(config.rules['max-edges'].enabled).toBe(false);

      // Default values should still be present
      expect(config.rules['max-edges'].threshold).toBe(100);
      expect(config.rules['max-edges'].severity).toBe('error');

      // Other rules should use defaults
      expect(config.rules['cyclomatic-complexity']).toEqual(
        defaultConfig.rules['cyclomatic-complexity']
      );
    });

    it('should handle partial rule configuration', async () => {
      const customConfig = {
        rules: {
          'max-nodes-high-density': {
            threshold: 75,
          },
        },
      };

      writeFileSync(testConfigPath, JSON.stringify(customConfig, null, 2));

      const config = await loadConfig();

      expect(config.rules['max-nodes-high-density'].threshold).toBe(75);
      expect(config.rules['max-nodes-high-density'].enabled).toBe(true);
      expect(config.rules['max-nodes-high-density'].severity).toBe('warning');
    });
  });

  describe('Sync Configuration', () => {
    it('should always return defaults for sync loading', () => {
      const config = loadConfigSync();
      expect(config).toEqual(defaultConfig);
    });
  });

  describe('Error Handling', () => {
    it('should use defaults on malformed config file', () => {
      writeFileSync(testConfigPath, 'invalid json{{{');

      const config = loadConfigSync();

      expect(config).toEqual(defaultConfig);
    });
  });
});
