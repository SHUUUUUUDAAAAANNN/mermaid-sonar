/**
 * CLI Integration tests - verifies the tool works end-to-end
 * Uses exec to run the actual CLI and verify output
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

describe('CLI Integration Tests', () => {
  const fixturesPath = path.join(__dirname, '../fixtures');
  const validDiagramPath = path.join(fixturesPath, 'valid-diagram.md');

  it('should successfully parse valid diagrams using real mermaid', async () => {
    const { stdout, stderr } = await execAsync(`node dist/cli.js ${validDiagramPath}`);

    // Should complete without DOMPurify errors
    expect(stderr).not.toContain('DOMPurify.addHook is not a function');
    expect(stderr).not.toContain('DOMPurify.sanitize is not a function');

    // Should find and analyze the diagram
    expect(stdout).toContain('1 file analyzed');
    expect(stdout).toContain('1 diagram found');
  }, 30000);

  it('should have DOM globals set up correctly', async () => {
    // This test verifies that the fix works by ensuring no DOMPurify errors occur
    const { stderr } = await execAsync(`node dist/cli.js ${validDiagramPath}`);

    expect(stderr).not.toContain('DOMPurify');
    expect(stderr).not.toContain('TypeError');
  }, 30000);
});
