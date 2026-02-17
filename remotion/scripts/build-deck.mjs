/**
 * Unified deck build pipeline.
 * Usage: node scripts/build-deck.mjs [--skip-render] [--skip-verify] [--incremental]
 *
 * Steps:
 *   0. Sync docs/assets -> remotion/public/assets
 *   1. TypeScript check (tsc --noEmit)
 *   2. ESLint
 *   3. Readability gate
 *   4. Font-size gate
 *   5. Layout token gate
 *   6. Render all V3 slides via render-all-slides.mjs (unless --skip-render)
 *   7. Generate PPTX (PNG embedding, all-PNG, no JPEG)
 *   8. Verify PPTX pipeline output (unless --skip-verify)
 */

import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const args = process.argv.slice(2);
const skipRender = args.includes('--skip-render');
const skipVerify = args.includes('--skip-verify');
const incremental = args.includes('--incremental');

const steps = [
  { name: 'Sync icon assets', cmd: 'npm run copy-assets' },
  { name: 'TypeScript check', cmd: 'npx tsc --noEmit' },
  { name: 'ESLint', cmd: 'npx eslint src/' },
  { name: 'Readability gate', cmd: 'node scripts/check-readability-gate.mjs' },
  { name: 'Font-size gate', cmd: 'node scripts/check-font-sizes.mjs' },
  { name: 'Layout token gate', cmd: 'node scripts/check-layout-tokens.mjs' },
];

if (!skipRender) {
  const scaleIdx = args.indexOf('--scale');
  const scaleFlag = scaleIdx !== -1 ? `--scale ${args[scaleIdx + 1]}` : '';
  const renderFlags = [incremental ? '--incremental --no-cache-clear' : '', scaleFlag].filter(Boolean).join(' ');
  steps.push({
    name: 'Render V3 slides',
    cmd: `node scripts/render-all-slides.mjs ${renderFlags}`.trim(),
  });
  steps.push({
    name: 'ICC color profile',
    cmd: 'node scripts/tag-png-icc.mjs',
  });
  steps.push({
    name: 'Overflow gate',
    cmd: 'node scripts/check-overflow-gate.mjs',
  });
}

steps.push({
  name: 'Generate PPTX',
  cmd: 'node scripts/gen-v3-pptx.js',
});

if (!skipVerify) {
  steps.push({
    name: 'Verify PPTX pipeline',
    cmd: 'node scripts/verify-pptx-pipeline.mjs',
  });
}

console.log(`\n=== Poseidon.AI Deck Build ===\n`);
console.log(`Steps: ${steps.map((s) => s.name).join(' -> ')}\n`);

for (let i = 0; i < steps.length; i++) {
  const step = steps[i];
  const prefix = `[${i + 1}/${steps.length}]`;
  console.log(`${prefix} ${step.name}...`);
  try {
    execSync(step.cmd, { cwd: rootDir, stdio: 'inherit' });
    console.log(`${prefix} ${step.name} OK\n`);
  } catch (err) {
    console.error(`\n${prefix} ${step.name} FAILED`);
    process.exit(1);
  }
}

console.log('=== Build complete ===\n');
