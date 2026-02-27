/**
 * Debug-ID coverage checker — ensures V2 slides have data-debug-id or debugId
 * attributes on major layout elements.
 *
 * Checks for minimum coverage: header, body sections, and cards should be tagged.
 *
 * Usage:  node scripts/check-debug-ids.mjs [--verbose]
 */

import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

// ─── Config ────────────────────────────────────────────────
const V2_DIR = 'src/v2';

// Expected debug-id patterns per slide (minimum coverage)
const REQUIRED_PATTERNS = [
  /header|title/i,     // Every slide should tag its header (or title for title slides)
];

// Slides exempt from required checks (wrappers that delegate to sub-slides)
const EXEMPT_FILES = new Set([
  'Slide02ProblemV2.tsx',   // Thin wrapper → delegates to OptionA/B/C
]);

// Desirable but not required
const RECOMMENDED_PATTERNS = [
  /body/i,
  /pillar|card|phase/i,
];

// ─── Detection ─────────────────────────────────────────────
const DEBUG_ID_RE = /(?:data-debug-id|debugId)\s*[=:]\s*["']([^"']+)["']/g;

const verbose = process.argv.includes('--verbose');

// ─── Main ──────────────────────────────────────────────────
const dir = resolve(process.cwd(), V2_DIR);
const files = readdirSync(dir)
  .filter(f => f.endsWith('.tsx') && f.startsWith('Slide'))
  .sort();

console.log(`\n🔍 Debug-ID coverage checker`);
console.log(`   Scanning ${files.length} V2 slide files\n`);

const results = [];

for (const file of files) {
  const filePath = resolve(dir, file);
  const source = readFileSync(filePath, 'utf8');
  const ids = [];

  let match;
  DEBUG_ID_RE.lastIndex = 0;
  while ((match = DEBUG_ID_RE.exec(source)) !== null) {
    ids.push(match[1]);
  }

  // Check required patterns (skip exempt files)
  const missingRequired = [];
  if (!EXEMPT_FILES.has(file)) {
    for (const pattern of REQUIRED_PATTERNS) {
      if (!ids.some(id => pattern.test(id))) {
        missingRequired.push(pattern.source);
      }
    }
  }

  // Check recommended patterns
  const missingRecommended = [];
  for (const pattern of RECOMMENDED_PATTERNS) {
    if (!ids.some(id => pattern.test(id))) {
      missingRecommended.push(pattern.source);
    }
  }

  results.push({
    file,
    ids,
    missingRequired,
    missingRecommended,
  });
}

// ─── Report ────────────────────────────────────────────────
let hasErrors = false;

for (const r of results) {
  const label = r.file.replace('.tsx', '');
  const status = r.missingRequired.length > 0 ? '✗' : '✓';

  if (status === '✗') hasErrors = true;

  console.log(`   ${status} ${label}: ${r.ids.length} debug-id(s)`);

  if (verbose && r.ids.length > 0) {
    for (const id of r.ids) {
      console.log(`     · ${id}`);
    }
  }

  if (r.missingRequired.length > 0) {
    console.error(`     ⚠ Missing required: ${r.missingRequired.join(', ')}`);
  }

  if (verbose && r.missingRecommended.length > 0) {
    console.log(`     ℹ Could add: ${r.missingRecommended.join(', ')}`);
  }
}

// Summary
const totalIds = results.reduce((sum, r) => sum + r.ids.length, 0);
const coverageAvg = (totalIds / results.length).toFixed(1);
console.log(`\n   Total: ${totalIds} debug-ids across ${results.length} files (avg ${coverageAvg}/file)`);

if (hasErrors) {
  console.error(`\n✗  Some slides missing required debug-ids.`);
  console.error(`   Fix: Add debugId="slideXX.header" to SlideHeader and data-debug-id to major sections.`);
  process.exit(1);
}

console.log(`\n✅ Debug-ID coverage OK — all slides have required debug-ids.\n`);
