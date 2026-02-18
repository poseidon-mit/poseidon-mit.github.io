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
if (appNav) {
  if (!/group:\s*'engine'\s*\|\s*'system'/.test(appNav)) {
    failures.push('AppNavShell must define engine/system nav groups.');
  }
  if (appNav.includes('entry-btn--primary')) {
    failures.push('AppNavShell nav must not include primary CTA button styling.');
  }
}

const contractSource = read('src/contracts/rebuild-contracts.ts');
if (contractSource) {
  const targetScopeMatch = contractSource.match(
    /export const TARGET_SCOPE_READY_ROUTES = \[([\s\S]*?)\] as const;/,
  );
  const requiredRoutes = targetScopeMatch
    ? Array.from(targetScopeMatch[1].matchAll(/'([^']+)'/g), (m) => m[1]).filter(
        (route) => route !== '/404',
      )
    : [];

  if (requiredRoutes.length === 0) {
    failures.push('rebuild-contracts.ts: could not parse TARGET_SCOPE_READY_ROUTES.');
  }

  for (const route of requiredRoutes) {
    if (!contractSource.includes(`'${route}'`)) {
      failures.push(`rebuild-contracts.ts: missing target route ${route}.`);
    }
  }

  const missingFirst5s = requiredRoutes.filter((route) => {
    const routePos = contractSource.indexOf(`route: '${route}'`);
    if (routePos === -1) return true;
    const window = contractSource.slice(routePos, routePos + 550);
    return !/first5sMessage:\s*'[^']{10,}'/.test(window);
  });
  if (missingFirst5s.length > 0) {
    failures.push(
      `rebuild-contracts.ts: missing first5sMessage for routes: ${missingFirst5s.join(', ')}`,
    );
  }

  const badBudget = /secondaryMax:\s*(?!1\b)\d+/.test(contractSource)
    || /primary:\s*(?!1\b)\d+/.test(contractSource);
  if (badBudget) {
    failures.push('CTA budget contract must be primary=1 and secondaryMax=1.');
  }

  const routeBlockRegex = /'([^']+)':\s*routeMeta\(\{([\s\S]*?)\n\s*\}\),/g;
  const routePrimaryActionPath = new Map();
  for (const match of contractSource.matchAll(routeBlockRegex)) {
    const route = match[1];
    const block = match[2];
    const primaryPathMatch = block.match(/primaryActionPath:\s*'([^']+)'/);
    if (primaryPathMatch) {
      routePrimaryActionPath.set(route, primaryPathMatch[1]);
    }
  }

  const targetReadyRouteSet = new Set(requiredRoutes);
  for (const route of requiredRoutes) {
    const primaryActionPath = routePrimaryActionPath.get(route);
    if (!primaryActionPath) {
      failures.push(`rebuild-contracts.ts: missing primaryActionPath for ${route}.`);
      continue;
    }
    if (!targetReadyRouteSet.has(primaryActionPath)) {
      failures.push(
        `rebuild-contracts.ts: ${route} primaryActionPath must stay within target scope (found ${primaryActionPath}).`,
      );
    }
  }
}

const lazyRoutes = read('src/router/lazyRoutes.ts');
if (lazyRoutes) {
  const legacyAliases = ['/protect-v2', '/grow-v2', '/execute-v2', '/govern-v2', '/onboarding-v2', '/engines', '/v3'];
  for (const alias of legacyAliases) {
    if (lazyRoutes.includes(alias)) {
      failures.push(`lazyRoutes.ts: legacy alias ${alias} must not exist.`);
    }
  }
}

if (failures.length > 0) {
  console.error('CTA hierarchy checks failed:');
  failures.forEach((line) => console.error(`- ${line}`));
  process.exit(1);
}

console.log('CTA hierarchy checks passed.');
