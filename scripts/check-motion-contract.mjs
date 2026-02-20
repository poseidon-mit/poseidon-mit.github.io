#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PAGES_ROOT = path.join(ROOT, 'src/pages');

const EXCLUDED = new Set([
  'LandingPreviewNew.tsx',
]);

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'v2' || entry.name === 'v3' || entry.name.startsWith('__')) continue;
      walk(full, out);
      continue;
    }
    if (entry.name.endsWith('.tsx') && !EXCLUDED.has(entry.name)) out.push(full);
  }
  return out;
}

const files = walk(PAGES_ROOT);
const violations = [];

for (const file of files) {
  const rel = path.relative(ROOT, file).replaceAll(path.sep, '/');
  const source = fs.readFileSync(file, 'utf8');

  const matches = source.match(/<motion\.[^>]*(?=[^>]*\binitial=\"hidden\")(?=[^>]*\banimate=\"visible\")[^>]*>/gms) || [];

  if (matches.length > 1) {
    violations.push(`${rel}: found ${matches.length} motion roots with initial=\"hidden\" animate=\"visible\". Keep exactly 1 route root.`);
  }
}

if (violations.length > 0) {
  console.error('Motion contract violations found:');
  for (const v of violations) console.error(`- ${v}`);
  process.exit(1);
}

console.log('Motion contract checks passed.');
