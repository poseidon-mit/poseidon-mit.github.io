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

function extractObjectBlock(source, objectName) {
  const match = source.match(new RegExp(`export const ${objectName}[\\s\\S]*?= \\{([\\s\\S]*?)\\n\\};`));
  return match ? match[1] : null;
}

function extractEntryBlocks(block, keyPattern) {
  const entries = new Map();
  const startRegex = new RegExp(keyPattern, 'gm');
  const matches = [...block.matchAll(startRegex)];

  for (const match of matches) {
    const key = match[1];
    const braceStart = block.indexOf('{', match.index);
    if (braceStart === -1) continue;

    let depth = 0;
    let end = -1;
    for (let i = braceStart; i < block.length; i += 1) {
      const char = block[i];
      if (char === '{') depth += 1;
      if (char === '}') {
        depth -= 1;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }
    if (end !== -1) {
      entries.set(key, block.slice(braceStart, end + 1));
    }
  }

  return entries;
}

function parseCrossThreadData(contractSource) {
  const block = extractObjectBlock(contractSource, 'CROSS_SCREEN_DATA_THREAD');
  if (!block) return null;

  const result = new Map();
  const entryBlocks = extractEntryBlocks(block, '^  ([a-z0-9_]+):\\s*\\{');
  for (const [key, entryBlock] of entryBlocks.entries()) {
    const ownerRoutesMatch = entryBlock.match(/ownerRoutes:\s*\[([^\]]*)\]/);
    const ownerRoutes = ownerRoutesMatch
      ? Array.from(ownerRoutesMatch[1].matchAll(/'([^']+)'/g), (m) => m[1])
      : [];
    result.set(key, { ownerRoutes });
  }

  return result;
}

function parsePromptBlueprints(contractSource) {
  const block = extractObjectBlock(contractSource, 'ROUTE_PROMPT_BLUEPRINTS');
  if (!block) return null;

  const result = new Map();
  const routeBlocks = extractEntryBlocks(block, "^  '([^']+)':\\s*\\{");
  for (const [route, routeBlock] of routeBlocks.entries()) {
    const keysMatch = routeBlock.match(/crossThreadKeys:\s*\[([^\]]*)\]/);
    const crossThreadKeys = keysMatch
      ? Array.from(keysMatch[1].matchAll(/'([^']+)'/g), (m) => m[1])
      : [];
    result.set(route, { crossThreadKeys });
  }

  return result;
}

const contractSource = read('src/contracts/rebuild-contracts.ts');
const promptSource = read('docs/v0-screen-prompts.md');

if (contractSource) {
  const crossThreadData = parseCrossThreadData(contractSource);
  const routeBlueprints = parsePromptBlueprints(contractSource);

  if (!crossThreadData) {
    failures.push('src/contracts/rebuild-contracts.ts: CROSS_SCREEN_DATA_THREAD missing or unparsable.');
  }
  if (!routeBlueprints) {
    failures.push('src/contracts/rebuild-contracts.ts: ROUTE_PROMPT_BLUEPRINTS missing or unparsable.');
  }

  if (crossThreadData && routeBlueprints) {
    for (const [route, blueprint] of routeBlueprints.entries()) {
      for (const key of blueprint.crossThreadKeys) {
        const datum = crossThreadData.get(key);
        if (!datum) {
          failures.push(`ROUTE_PROMPT_BLUEPRINTS: ${route} references unknown cross-thread key "${key}".`);
          continue;
        }
        if (!datum.ownerRoutes.includes(route)) {
          failures.push(`CROSS_SCREEN_DATA_THREAD: key "${key}" must include owner route ${route}.`);
        }
      }
    }

    for (const [key, datum] of crossThreadData.entries()) {
      if (datum.ownerRoutes.length === 0) {
        failures.push(`CROSS_SCREEN_DATA_THREAD: key "${key}" has no ownerRoutes.`);
        continue;
      }
      for (const ownerRoute of datum.ownerRoutes) {
        const ownerBlueprint = routeBlueprints.get(ownerRoute);
        if (!ownerBlueprint) {
          failures.push(`CROSS_SCREEN_DATA_THREAD: owner route ${ownerRoute} for key "${key}" has no prompt blueprint.`);
          continue;
        }
        if (!ownerBlueprint.crossThreadKeys.includes(key)) {
          failures.push(`ROUTE_PROMPT_BLUEPRINTS: route ${ownerRoute} must include key "${key}" in crossThreadKeys.`);
        }
      }
    }
  }
}

if (promptSource) {
  const threadSectionExists = promptSource.includes('## 5. Cross-screen Data Thread');
  if (!threadSectionExists) {
    failures.push('docs/v0-screen-prompts.md: missing "Cross-screen Data Thread" section.');
  }

  const requiredKeys = [
    'system_confidence',
    'decisions_audited',
    'critical_alert_thr001',
    'compliance_score',
    'pending_actions',
    'monthly_savings',
    'emergency_fund_progress',
  ];
  for (const key of requiredKeys) {
    if (!promptSource.includes(`\`${key}\``)) {
      failures.push(`docs/v0-screen-prompts.md: missing cross-thread key reference ${key}.`);
    }
  }
}

if (failures.length > 0) {
  console.error('Cross-thread consistency checks failed:');
  failures.forEach((line) => console.error(`- ${line}`));
  process.exit(1);
}

console.log('Cross-thread consistency checks passed.');
