#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TARGET_DIRS = [
  path.join(ROOT, 'src', 'pages'),
  path.join(ROOT, 'src', 'components'),
];
const EXCLUDED_BASENAMES = new Set(['LandingPreviewNew.tsx']);

const violations = [];

function toRelative(filePath) {
  return path.relative(ROOT, filePath).replaceAll(path.sep, '/');
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'v2' || entry.name === 'v3' || entry.name.startsWith('__')) continue;
      walk(full, out);
      continue;
    }
    if (!entry.name.endsWith('.tsx')) continue;
    if (EXCLUDED_BASENAMES.has(entry.name)) continue;
    out.push(full);
  }
  return out;
}

function getLine(source, index) {
  return source.slice(0, index).split('\n').length;
}

function hasStructureMarker(tag) {
  return (
    tag.includes('overflow-hidden') ||
    tag.includes('!p-0') ||
    /(?:^|[\s"'])p-0(?:[\s"']|$)/.test(tag)
  );
}

for (const dir of TARGET_DIRS) {
  for (const filePath of walk(dir)) {
    const source = fs.readFileSync(filePath, 'utf8');
    const rel = toRelative(filePath);
    const surfaceTagPattern = /<Surface\b[\s\S]*?>/g;
    let match;
    while ((match = surfaceTagPattern.exec(source)) !== null) {
      const tag = match[0];
      const line = getLine(source, match.index);
      const hasPaddingNone = /padding\s*=\s*"none"/.test(tag);
      const hasStructureRole = /data-surface-role\s*=\s*"structure"/.test(tag);

      if (!hasPaddingNone && hasStructureRole) {
        violations.push(
          `${rel}:${line} uses data-surface-role=\"structure\" without padding=\"none\".`,
        );
        continue;
      }

      if (!hasPaddingNone) continue;

      if (!hasStructureRole) {
        violations.push(
          `${rel}:${line} uses padding=\"none\" without data-surface-role=\"structure\". Use padding=\"md\" for content cards.`,
        );
        continue;
      }

      if (!hasStructureMarker(tag)) {
        violations.push(
          `${rel}:${line} marks structure role but lacks structural marker (overflow-hidden / p-0).`,
        );
      }
    }
  }
}

if (violations.length > 0) {
  console.error('Surface padding contract violations found:');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log('Surface padding contract checks passed.');
