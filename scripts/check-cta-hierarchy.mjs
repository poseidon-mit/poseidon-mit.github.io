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

const appNav = read('src/components/layout/AppNavShell.tsx');
if (!appNav) {
  // Missing file already recorded.
}

// Verify engine group nav items do not expose primary CTA buttons.
// AppNavShell uses group: 'engine' | 'system' pattern.
if (appNav && !/group:\s*'engine'\s*\|\s*'system'/.test(appNav)) {
  failures.push('AppNavShell must define engine/system nav groups.');
}

// Engine nav items must not include primary CTA variant buttons.
if (appNav && (appNav.includes("entry-btn--primary") || appNav.includes("variant: 'primary'"))) {
  failures.push('Engine/system AppNavShell must not expose primary CTA actions in nav items.');
}

const routeFilesWithPrimary = [
  'src/pages/Dashboard.tsx',
  'src/pages/Protect.tsx',
  'src/pages/Grow.tsx',
  'src/pages/Execute.tsx',
  'src/pages/Govern.tsx',
];

for (const file of routeFilesWithPrimary) {
  const source = read(file);
  if (!source) continue;
  const primaryCount = (source.match(/entry-btn--primary/g) ?? []).length;
  if (primaryCount > 1) {
    failures.push(`${file}: page appears to expose too many primary CTAs (${primaryCount}).`);
  }
}

if (failures.length > 0) {
  console.error('CTA hierarchy checks failed:');
  failures.forEach((line) => console.error(`- ${line}`));
  process.exit(1);
}

console.log('CTA hierarchy checks passed.');
