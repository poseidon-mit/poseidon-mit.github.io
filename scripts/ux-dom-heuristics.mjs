#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = process.cwd();
const configPath = path.join(root, 'spec', 'ux-visual-baseline.json');
const outputPath = path.join(root, 'docs', 'baselines', 'ux-dom-heuristics-last-run.json');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeResult(result) {
  ensureDir(path.dirname(outputPath));
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
}

if (!fs.existsSync(configPath)) {
  writeResult({ ok: false, reason: 'missing-config', checks: [] });
  process.exit(1);
}

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  writeResult({
    ok: true,
    skipped: true,
    reason: 'playwright-not-installed',
    checks: [],
  });
  process.exit(0);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const baseUrl = config.baseUrl;
const routes = Array.isArray(config.routes) ? config.routes : [];
const checks = [];

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1024, height: 768 },
  });
  const page = await context.newPage();

  for (const route of routes) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });

    const h1Count = await page.locator('h1').count();
    checks.push({
      route,
      key: 'single-h1',
      criteria: 'first5s',
      ok: h1Count === 1,
      severity: 'P1',
      demoImpact: 'high',
      effort: 'S',
      message: `Expected exactly one h1; found ${h1Count}.`,
      fixHypothesis: 'Ensure one and only one primary page heading exists.',
      autofixable: false,
    });

    const primaryCtaCount = await page.locator('[data-cta-priority="primary"], .entry-btn--primary').count();
    checks.push({
      route,
      key: 'cta-budget',
      criteria: 'oneCta',
      ok: primaryCtaCount <= 1,
      severity: primaryCtaCount > 1 ? 'P0' : 'P2',
      demoImpact: 'high',
      effort: 'S',
      message: `Expected <= 1 primary CTA; found ${primaryCtaCount}.`,
      fixHypothesis: 'Demote secondary CTA variants to ghost/minor.',
      autofixable: primaryCtaCount > 1,
      autofixRule: primaryCtaCount > 1 ? 'engine-core-nav-cta-demotion' : undefined,
    });

    // Note: requiredCoreSlots (hero_message, primary_feed, govern_controls)
    // were removed — they belong to the legacy PageShell architecture.
    // v0 pages are self-contained and do not emit data-slot containers.
  }
} finally {
  await browser.close();
}

const result = {
  ok: true,
  skipped: false,
  checks,
};
writeResult(result);
