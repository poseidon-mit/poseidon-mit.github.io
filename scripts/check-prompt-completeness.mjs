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

function parseTargetRoutes(contractSource) {
  const targetScopeMatch = contractSource.match(
    /export const TARGET_SCOPE_READY_ROUTES = \[([\s\S]*?)\] as const;/,
  );
  if (!targetScopeMatch) return [];
  return Array.from(targetScopeMatch[1].matchAll(/'([^']+)'/g), (m) => m[1]).filter(
    (route) => route !== '/404',
  );
}

function parseRouteCards(docSource) {
  const routeRegex = /^### Route `([^`]+)`$/gm;
  const matches = [...docSource.matchAll(routeRegex)];
  const cards = new Map();

  for (let i = 0; i < matches.length; i += 1) {
    const route = matches[i][1];
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : docSource.length;
    cards.set(route, docSource.slice(start, end));
  }

  return cards;
}

const contractSource = read('src/contracts/rebuild-contracts.ts');
const promptSource = read('docs/v0-screen-prompts.md');

if (contractSource && promptSource) {
  const requiredRoutes = parseTargetRoutes(contractSource);
  if (requiredRoutes.length === 0) {
    failures.push('src/contracts/rebuild-contracts.ts: could not parse TARGET_SCOPE_READY_ROUTES.');
  }

  const cards = parseRouteCards(promptSource);
  const requiredSections = [
    '#### Context',
    '#### Section Map',
    '#### Representative Data',
    '#### Signature Visual',
    '#### Must-build components',
    '#### Should-build components',
    '#### Decision Point',
    '#### CTA budget',
    '#### Collapse policy',
    '#### Technical constraints',
  ];

  for (const route of requiredRoutes) {
    const card = cards.get(route);
    if (!card) {
      failures.push(`docs/v0-screen-prompts.md: missing route card for ${route}.`);
      continue;
    }

    for (const heading of requiredSections) {
      if (!card.includes(heading)) {
        failures.push(`docs/v0-screen-prompts.md: ${route} missing section "${heading}".`);
      }
    }

    const sectionMapItems = [...card.matchAll(/- \[P[1-3]\] /g)];
    if (sectionMapItems.length === 0) {
      failures.push(`docs/v0-screen-prompts.md: ${route} section map must include at least one priority item.`);
    }
  }
}

if (failures.length > 0) {
  console.error('Prompt completeness checks failed:');
  failures.forEach((line) => console.error(`- ${line}`));
  process.exit(1);
}

console.log('Prompt completeness checks passed.');
