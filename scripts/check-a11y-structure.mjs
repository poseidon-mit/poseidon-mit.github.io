#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

const checks = [
  {
    file: 'src/pages/Dashboard.tsx',
    test: (s) => /<main[^>]*id="main-content"/.test(s),
    message: 'Dashboard must expose <main id="main-content">.',
  },
  {
    file: 'src/pages/Dashboard.tsx',
    test: (s) => /Skip to/.test(s),
    message: 'Dashboard must include skip link.',
  },
  {
    file: 'src/components/PageShell/PageShell.tsx',
    test: (s) => /data-slot="primary_feed"[\s\S]*aria-labelledby=\{heroHeadingId\}/.test(s),
    message: 'PageShell primary feed must be labelled by hero heading.',
  },
];

for (const check of checks) {
  const source = read(check.file);
  if (!check.test(source)) {
    failures.push(`${check.file}: ${check.message}`);
  }
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
  if (!/<h1 id=\{heroHeadingId\}>/.test(source)) {
    failures.push(`${file}: hero variant must render h1 with shared id.`);
  }
}

if (failures.length > 0) {
  console.error('A11y structure checks failed:');
  failures.forEach((line) => console.error(`- ${line}`));
  process.exit(1);
}

console.log('A11y structure checks passed.');
