#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
const { spawnSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const scriptPath = path.join(__dirname, 'gen-v3-pptx.py');
const result = spawnSync('python3', [scriptPath, ...args], {
  stdio: 'inherit',
});

if (result.error) {
  console.error('Failed to run python3:', result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
