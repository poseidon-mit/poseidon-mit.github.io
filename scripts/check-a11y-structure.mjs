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

const checks = [
  {
    file: 'src/pages/Dashboard.tsx',
    test: (s) => /<(?:motion\.)?main[^>]*id="main-content"/.test(s),
    message: 'Dashboard must expose <main id="main-content">.',
  },
  {
    file: 'src/pages/Dashboard.tsx',
    test: (s) => /Skip to/.test(s),
    message: 'Dashboard must include skip link.',
  },
  {
    file: 'src/components/layout/page-shell.tsx',
    test: (s) => /<header className="page-shell-hero/.test(s) && /<footer className="page-shell-footer/.test(s),
    message: 'PageShell layout must expose semantic hero and footer wrappers.',
  },
];

for (const check of checks) {
  const source = read(check.file);
  if (!source) continue;
  if (!check.test(source)) {
    failures.push(`${check.file}: ${check.message}`);
  }
}

const structureChecks = [
  {
    file: 'src/components/layout/page-shell.tsx',
    test: (s) => /<header className="page-shell-hero/.test(s),
    message: 'PageShell layout must expose a semantic hero header wrapper.',
  },
  {
    file: 'src/components/layout/AppNavShell.tsx',
    test: (s) => /aria-label="Main navigation"/.test(s),
    message: 'AppNavShell must expose an accessible main navigation label.',
  },
];

for (const check of structureChecks) {
  const source = read(check.file);
  if (!source) continue;
  if (!check.test(source)) {
    failures.push(`${check.file}: ${check.message}`);
  }
}

if (failures.length > 0) {
  console.error('A11y structure checks failed:');
  failures.forEach((line) => console.error(`- ${line}`));
  process.exit(1);
}

console.log('A11y structure checks passed.');
