#!/usr/bin/env node
/**
 * scripts/smoke-test-build.mjs
 *
 * Pre-deploy production smoke test.
 * Starts `vite preview` against the built dist/, launches headless Chromium,
 * and verifies that:
 *   1. React mounts (#root is non-empty) on each key route
 *   2. No critical uncaught JS errors appear in the console
 *   3. Expected text is visible on each page
 *
 * This catches runtime crashes (e.g. vendor-chunk initialization errors,
 * missing assets, React not mounting) that plain curl-based HTML checks miss.
 *
 * Usage (CI — dist/ must already exist):
 *   node scripts/smoke-test-build.mjs
 *
 * Usage (local):
 *   npm run build && node scripts/smoke-test-build.mjs
 */

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

const PORT = 4176; // distinct port to avoid conflicts with other preview servers
const BASE_URL = `http://127.0.0.1:${PORT}`;
const SERVER_READY_TIMEOUT_MS = 30_000;
const PAGE_LOAD_TIMEOUT_MS = 30_000;
const TEXT_WAIT_TIMEOUT_MS = 15_000;

/**
 * Routes to verify. Each entry checks:
 *   - React mounts
 *   - No critical console errors
 *   - At least one pattern from `expectAny` is visible
 */
const ROUTES = [
  {
    path: '/',
    desc: 'Landing page',
    expectAny: [/poseidon/i, /orchestrated by ai/i, /your money/i, /MIT Capstone/i],
  },
  {
    path: '/dashboard',
    desc: 'Dashboard',
    expectAny: [/dashboard/i, /net worth/i, /protect/i, /grow/i],
  },
  {
    path: '/govern/audit',
    desc: 'Govern — Audit Ledger',
    expectAny: [/audit/i, /ledger/i, /govern/i],
  },
  {
    path: '/protect/alert-detail?alertId=THR-001',
    desc: 'Protect — Alert Detail',
    expectAny: [/apple store miami/i, /secure account/i, /this was me/i],
    viewport: { width: 1024, height: 768 },
    assertNoHorizontalOverflow: true,
    buttonsInViewport: [/this was me/i, /secure account/i],
  },
];

/**
 * Console error patterns that indicate a genuine crash.
 * Informational/deprecation messages are ignored.
 */
const CRASH_PATTERNS = [
  /Uncaught TypeError/i,
  /Cannot read propert/i,
  /is not a function/i,
  /is not defined/i,
  /ChunkLoadError/i,
  /Loading chunk/i,
  /Failed to fetch dynamically imported module/i,
  /SyntaxError/i,
];

/** Patterns to ignore even if they look like errors. */
const IGNORE_PATTERNS = [
  /favicon/i,
  /apple-mobile-web-app-capable/i,
  /deprecated/i,
  /SES Removing/i,           // MetaMask lockdown — informational
  /Models fetched/i,
  /\[telemetry\]/i,
];

function isCrash(text) {
  return (
    CRASH_PATTERNS.some((p) => p.test(text)) &&
    !IGNORE_PATTERNS.some((p) => p.test(text))
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;
const failures = [];

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

function ok(msg) {
  log(`  ✓ ${msg}`);
  passed++;
}

function fail(msg) {
  process.stderr.write(`  ✗ ${msg}\n`);
  failures.push(msg);
  failed++;
}

async function waitForServer(url, timeoutMs = SERVER_READY_TIMEOUT_MS) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // server not up yet
    }
    await sleep(300);
  }
  throw new Error(`Preview server at ${url} did not start within ${timeoutMs}ms`);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function startPreviewServer() {
  const child = spawn(
    'npx',
    ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PORT)],
    { stdio: ['ignore', 'pipe', 'pipe'], shell: process.platform === 'win32' },
  );
  // Suppress noisy vite output — only surface on error
  const serverLogs = [];
  child.stdout.on('data', (d) => serverLogs.push(String(d)));
  child.stderr.on('data', (d) => serverLogs.push(String(d)));
  child.on('exit', (code) => {
    if (code && code !== 0 && code !== null) {
      process.stderr.write('[smoke] Preview server exited with code ' + code + '\n');
      serverLogs.forEach((l) => process.stderr.write(l));
    }
  });
  return child;
}

// ---------------------------------------------------------------------------
// Route check
// ---------------------------------------------------------------------------

async function checkRoute(browser, route) {
  const {
    path,
    desc,
    expectAny,
    viewport,
    assertNoHorizontalOverflow,
    buttonsInViewport,
  } = route;
  const url = `${BASE_URL}${path}`;
  log(`\n[smoke] ${desc} (${path})`);

  const crashMessages = [];
  const page = await browser.newPage();

  if (viewport) {
    await page.setViewportSize(viewport);
  }

  page.on('console', (msg) => {
    const text = msg.text();
    if (isCrash(text)) crashMessages.push(text);
  });

  page.on('pageerror', (err) => {
    const text = err.message;
    if (!IGNORE_PATTERNS.some((p) => p.test(text))) {
      crashMessages.push(text);
    }
  });

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: PAGE_LOAD_TIMEOUT_MS });
  } catch (err) {
    fail(`Navigation failed: ${err.message}`);
    await page.close();
    return;
  }

  // 1. React mounted?
  // Wait up to 10 s for #root to gain children (React's async render)
  let rootMounted = false;
  const mountDeadline = Date.now() + 10_000;
  while (Date.now() < mountDeadline) {
    rootMounted = await page.evaluate(() => {
      const root = document.getElementById('root');
      return Boolean(root && root.childElementCount > 0);
    });
    if (rootMounted) break;
    await sleep(200);
  }

  if (rootMounted) {
    ok('React mounted (#root has children)');
  } else {
    fail('React did NOT mount — #root is empty after 10 s');
  }

  // 2. Critical console errors?
  if (crashMessages.length === 0) {
    ok('No critical console errors');
  } else {
    for (const msg of crashMessages) {
      fail(`Console crash: ${msg.slice(0, 150)}`);
    }
  }

  // 3. Expected text visible?
  if (expectAny && expectAny.length > 0) {
    let textFound = false;
    const textDeadline = Date.now() + TEXT_WAIT_TIMEOUT_MS;
    while (Date.now() < textDeadline && !textFound) {
      const bodyText = await page.evaluate(() => document.body.innerText);
      textFound = expectAny.some((pattern) => pattern.test(bodyText));
      if (!textFound) await sleep(300);
    }
    if (textFound) {
      ok(`Expected content visible`);
    } else {
      const snippet = await page.evaluate(() => document.body.innerText.slice(0, 300));
      fail(`None of ${expectAny.map(String).join(' | ')} found. Body: ${snippet}`);
    }
  }

  if (assertNoHorizontalOverflow) {
    const widthMetrics = await page.evaluate(() => {
      const root = document.documentElement;
      const body = document.body;
      const scroller = document.scrollingElement;
      return {
        innerWidth: window.innerWidth,
        rootScrollWidth: root.scrollWidth,
        bodyScrollWidth: body.scrollWidth,
        scrollerScrollWidth: scroller?.scrollWidth ?? 0,
      };
    });
    const widest = Math.max(
      widthMetrics.rootScrollWidth,
      widthMetrics.bodyScrollWidth,
      widthMetrics.scrollerScrollWidth,
    );
    if (widest <= widthMetrics.innerWidth + 1) {
      ok('No horizontal overflow at desktop width');
    } else {
      fail(
        `Horizontal overflow detected: widest=${widest}px viewport=${widthMetrics.innerWidth}px`,
      );
    }
  }

  if (buttonsInViewport && buttonsInViewport.length > 0) {
    const viewportWidth = page.viewportSize()?.width ?? 0;
    for (const label of buttonsInViewport) {
      const button = page.getByRole('button', { name: label });
      const count = await button.count();
      if (count === 0) {
        fail(`Expected button ${label} not found`);
        continue;
      }
      const box = await button.first().boundingBox();
      if (!box) {
        fail(`Expected button ${label} is not visible`);
        continue;
      }
      if (box.x >= 0 && box.x + box.width <= viewportWidth + 1) {
        ok(`Button ${label} fits within desktop viewport`);
      } else {
        fail(
          `Button ${label} exceeds viewport: left=${box.x.toFixed(1)} right=${(box.x + box.width).toFixed(1)} viewport=${viewportWidth}`,
        );
      }
    }
  }

  await page.close();
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function run() {
  log('[smoke] Production build smoke test starting');
  log(`[smoke] Testing ${ROUTES.length} routes at ${BASE_URL}`);

  const server = startPreviewServer();
  let browser;

  try {
    await waitForServer(BASE_URL);
    log(`[smoke] Preview server ready`);

    browser = await chromium.launch({ headless: true });

    for (const route of ROUTES) {
      await checkRoute(browser, route);
    }
  } finally {
    await browser?.close();
    server.kill('SIGTERM');
  }

  log(`\n[smoke] ── Results: ${passed} passed, ${failed} failed ──`);

  if (failed > 0) {
    log('\n[smoke] FAILURES:');
    failures.forEach((f) => log(`  • ${f}`));
    log('');
    process.exitCode = 1;
  } else {
    log('[smoke] All checks passed ✓');
  }
}

run().catch((err) => {
  process.stderr.write(`[smoke] Fatal error: ${err.message}\n${err.stack}\n`);
  process.exitCode = 1;
});
