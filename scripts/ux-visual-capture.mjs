#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = process.cwd();
const baselineConfigPath = path.join(root, "spec", "ux-visual-baseline.json");
const outDir = path.join(root, "docs", "baselines", "screenshots", "latest");

const strict = process.argv.includes("--strict");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeResult(result) {
  const outputPath = path.join(
    root,
    "docs",
    "baselines",
    "ux-visual-capture-last-run.json",
  );
  ensureDir(path.dirname(outputPath));
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
}

if (!fs.existsSync(baselineConfigPath)) {
  writeResult({ ok: false, reason: "missing-config", captures: [] });
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(baselineConfigPath, "utf8"));
const baseUrl = process.env.POSEIDON_UX_BASE_URL ?? config.baseUrl;

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  if (strict) {
    writeResult({
      ok: false,
      skipped: false,
      reason: "playwright-not-installed-strict-mode",
      captures: [],
    });
    console.error(
      "ERROR: Playwright is required in strict mode. Run: npx playwright install chromium",
    );
    process.exit(1);
  }
  writeResult({
    ok: true,
    skipped: true,
    reason: "playwright-not-installed",
    captures: [],
  });
  process.exit(0);
}

const ignoreSelectors = Array.isArray(config.ignoreSelectors)
  ? config.ignoreSelectors
  : [];

const captures = [];
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext();
  const page = await context.newPage();

  ensureDir(outDir);
  for (const route of config.routes) {
    for (const viewport of config.viewports) {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });

      // Hide non-deterministic elements before capture
      if (ignoreSelectors.length > 0) {
        await page.evaluate((selectors) => {
          for (const sel of selectors) {
            document.querySelectorAll(sel).forEach((el) => {
              el.style.visibility = "hidden";
            });
          }
        }, ignoreSelectors);
      }

      // Brief settle after hiding elements
      await page.waitForTimeout(100);

      const fileName = `${route === "/" ? "root" : route.slice(1).replaceAll("/", "__")}__${viewport.name}.png`;
      const filePath = path.join(outDir, fileName);
      await page.screenshot({ path: filePath, fullPage: true });
      captures.push({
        route,
        viewport: viewport.name,
        path: path.relative(root, filePath),
      });
    }
  }
  writeResult({ ok: true, skipped: false, strict, captures });
} finally {
  await browser.close();
}
