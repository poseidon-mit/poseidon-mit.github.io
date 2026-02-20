#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const ROUTES_FILE = path.join(ROOT, 'src', 'router', 'lazyRoutes.ts');
const COMPONENTS_ROOT = path.join(ROOT, 'src', 'components');
const EXCLUDED_PAGE_BASENAMES = new Set(['LandingPreviewNew.tsx']);

const violations = [];

function toRelative(filePath) {
  return path.relative(ROOT, filePath).replaceAll(path.sep, '/');
}

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function lineOf(source, index) {
  return source.slice(0, index).split('\n').length;
}

function collectRoutePageFiles() {
  const source = read(ROUTES_FILE);
  const importPattern = /['"]([^'"]+)['"]:\s*\(\)\s*=>\s*import\('\.\.\/pages\/([^')]+)'\)/g;
  const pages = new Map();

  let match;
  while ((match = importPattern.exec(source)) !== null) {
    const route = match[1];
    const pageImport = match[2];
    const pageFile = path.join(ROOT, 'src', 'pages', `${pageImport}.tsx`);
    const basename = path.basename(pageFile);

    if (EXCLUDED_PAGE_BASENAMES.has(basename)) continue;
    if (!fs.existsSync(pageFile)) continue;
    pages.set(route, pageFile);
  }

  return pages;
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith('__')) continue;
      walk(full, out);
      continue;
    }
    if (entry.name.endsWith('.tsx')) out.push(full);
  }
  return out;
}

function checkRoutePage(filePath, route) {
  const source = read(filePath);
  const rel = toRelative(filePath);
  const rootPairs =
    source.match(
      /<motion\.[^>]*(?=[^>]*\binitial=["']hidden["'])(?=[^>]*\banimate=["']visible["'])[^>]*>/gms,
    ) || [];

  if (rootPairs.length > 1) {
    violations.push(
      `${rel}: route ${route} has ${rootPairs.length} initial/animate roots. Keep route-root motion to 1.`,
    );
  }

  const localConstantPattern = /\bconst\s+(spring|fadeUp|staggerContainer)\s*=/g;
  let constantMatch;
  while ((constantMatch = localConstantPattern.exec(source)) !== null) {
    const line = lineOf(source, constantMatch.index);
    violations.push(
      `${rel}:${line} local motion constant "${constantMatch[1]}" is forbidden. Use src/lib/motion-presets.ts.`,
    );
  }

  const forbiddenSequencingPattern = /\b(staggerChildren|delayChildren)\s*:/g;
  let sequencingMatch;
  while ((sequencingMatch = forbiddenSequencingPattern.exec(source)) !== null) {
    const line = lineOf(source, sequencingMatch.index);
    violations.push(
      `${rel}:${line} uses "${sequencingMatch[1]}". Route pages must use simultaneous entry (no stagger/delay).`,
    );
  }

  const beforeChildrenPattern = /\bwhen\s*:\s*["']beforeChildren["']/g;
  let beforeChildrenMatch;
  while ((beforeChildrenMatch = beforeChildrenPattern.exec(source)) !== null) {
    const line = lineOf(source, beforeChildrenMatch.index);
    violations.push(
      `${rel}:${line} uses when:"beforeChildren". Route pages must start children at the same time as the parent.`,
    );
  }
}

function checkComponentFile(filePath) {
  const source = read(filePath);
  const rel = toRelative(filePath);

  const forbiddenPattern = /\b(initial|animate)\s*=\s*["'](hidden|visible)["']/g;
  let match;
  while ((match = forbiddenPattern.exec(source)) !== null) {
    const line = lineOf(source, match.index);
    violations.push(
      `${rel}:${line} component-level ${match[1]}="${match[2]}" is forbidden. Route root controls page entry motion.`,
    );
  }
}

const routePages = collectRoutePageFiles();
for (const [route, filePath] of routePages.entries()) {
  checkRoutePage(filePath, route);
}

const componentFiles = walk(COMPONENTS_ROOT);
for (const componentFile of componentFiles) {
  checkComponentFile(componentFile);
}

if (violations.length > 0) {
  console.error('Motion contract violations found:');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log(
  `Motion contract checks passed. (route pages checked: ${routePages.size}, components checked: ${componentFiles.length})`,
);
