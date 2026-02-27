#!/usr/bin/env node
/**
 * DEPRECATED: V2 PPTX generator wrapper kept for compatibility.
 * Prefer: scripts/gen-v3-pptx.js
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const { spawnSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const scriptPath = path.join(__dirname, 'gen-v2-pptx.py');
console.warn('⚠ DEPRECATED: gen-v2-pptx.js is kept for compatibility. Prefer gen-v3-pptx.js.');
const result = spawnSync('python3', [scriptPath, ...args], {
  stdio: 'inherit',
});

if (result.error) {
  console.error('Failed to run python3:', result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
