#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

const appNav = read('src/components/layout/AppNavShell.tsx');

// Verify engine group nav items do not expose primary CTA buttons.
// AppNavShell uses group: 'engine' | 'system' pattern.
if (!appNav.includes("group: 'engine' | 'system'")) {
  failures.push('AppNavShell must define engine/system nav groups.');
}

// Engine nav items must not include primary CTA variant buttons.
if (appNav.includes("entry-btn--primary") || appNav.includes("variant: 'primary'")) {
  failures.push('Engine/system AppNavShell must not expose primary CTA actions in nav items.');
}

const heroFiles = [
  'src/components/PageShell/variants/HeroCommand.tsx',
  'src/components/PageShell/variants/HeroFocused.tsx',
  'src/components/PageShell/variants/HeroAnalytical.tsx',
  'src/components/PageShell/variants/HeroEditorial.tsx',
  'src/components/PageShell/variants/HeroMinimal.tsx',
];

for (const file of heroFiles) {
  const source = read(file);
  const primaryCount = (source.match(/entry-btn entry-btn--primary/g) ?? []).length;
  if (primaryCount > 1) {
    failures.push(`${file}: hero must expose at most one primary CTA.`);
  }
}

if (failures.length > 0) {
  console.error('CTA hierarchy checks failed:');
  failures.forEach((line) => console.error(`- ${line}`));
  process.exit(1);
}

console.log('CTA hierarchy checks passed.');
