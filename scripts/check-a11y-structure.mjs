#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

function read(file) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    failures.push(`${file}: required file is missing.`);
    return null;
  }
  return fs.readFileSync(fullPath, 'utf8');
}

function assertMainLandmark(file) {
  const source = read(file);
  if (!source) return;

  const hasMainId = source.includes('id="main-content"');
  const hasMainRole = source.includes('role="main"') || /<(?:motion\.)?main[\s>]/.test(source);

  if (!hasMainId || !hasMainRole) {
    failures.push(`${file}: must include main landmark with id="main-content".`);
  }
}

function assertPattern(file, pattern, message) {
  const source = read(file);
  if (!source) return;
  if (!pattern.test(source)) failures.push(`${file}: ${message}`);
}

[
  'src/pages/Landing.tsx',
  'src/components/layout/AuthShell.tsx',
  'src/components/layout/AppNavShell.tsx',
  'src/pages/NotFound.tsx',
].forEach(assertMainLandmark);

assertPattern(
  'src/components/landing/PublicTopBar.tsx',
  /aria-label="Main navigation"/,
  'main nav aria label is required.',
);
assertPattern(
  'src/components/navigation/Sidebar.tsx',
  /aria-label="Main navigation"/,
  'main nav aria label is required.',
);
assertPattern(
  'src/components/navigation/TopBar.tsx',
  /aria-label="Breadcrumb"/,
  'breadcrumb aria label is required.',
);
assertPattern(
  'src/components/layout/AppNavShell.tsx',
  /aria-label="Breadcrumb"/,
  'mobile breadcrumb aria label is required.',
);

if (failures.length > 0) {
  console.error('A11y structure checks failed:');
  failures.forEach((line) => console.error(`- ${line}`));
  process.exit(1);
}

console.log('A11y structure checks passed.');
