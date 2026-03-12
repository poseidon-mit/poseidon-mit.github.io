#!/usr/bin/env node
/**
 * ux-scan.mjs — Aggregate UX quality scan.
 *
 * Modes:
 *   (default)   Local-friendly — visual capture/diff skip gracefully if Playwright is absent.
 *   --strict    CI PR mode — Playwright is required; visual errors cause exit(1).
 */
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

const root = process.cwd();
const outputPath = path.join(root, "docs", "baselines", "ux-audit-latest.json");
const visualCapturePath = path.join(
  root,
  "docs",
  "baselines",
  "ux-visual-capture-last-run.json",
);
const visualDiffPath = path.join(
  root,
  "docs",
  "baselines",
  "ux-visual-diff-last-run.json",
);
const domHeuristicsPath = path.join(
  root,
  "docs",
  "baselines",
  "ux-dom-heuristics-last-run.json",
);

const strict = process.argv.includes("--strict");

const demoFlow = [
  "/",
  "/dashboard",
  "/protect",
  "/execute",
  "/govern",
  "/settings",
];
const criteria = [
  "first5s",
  "oneCta",
  "heroDiff",
  "navConfidence",
  "calm",
  "performance",
  "trust",
  "copy",
  "state",
  "a11y",
  "reliability",
  "memorable",
];

const checks = [
  "check:design-system",
  "check:motion-policy",
  "check:a11y-structure",
  "check:cta-hierarchy",
  "check:contrast-budget",
  "check:bundle-budget",
  "verify:pwa",
];

function runNpmScript(script) {
  const cmd = spawnSync("npm", ["run", script], {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  return {
    script,
    ok: cmd.status === 0,
    status: cmd.status ?? 1,
    stdout: (cmd.stdout ?? "").trim().slice(-2000),
    stderr: (cmd.stderr ?? "").trim().slice(-2000),
  };
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function nextIssueId(index) {
  return `UX-AUTO-${String(index + 1).padStart(3, "0")}`;
}

function findFreePort(start = 4177) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", (error) => {
      server.close();
      if (error.code === "EADDRINUSE") {
        resolve(findFreePort(start + 1));
        return;
      }
      reject(error);
    });
    server.listen(start, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function startUxServer(port) {
  const child = spawn(
    "npx",
    ["vite", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
      shell: process.platform === "win32",
      env: process.env,
    },
  );
  const logs = [];
  child.stdout.on("data", (chunk) => logs.push(String(chunk)));
  child.stderr.on("data", (chunk) => logs.push(String(chunk)));
  return { child, logs };
}

async function waitForServer(url, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Server is still booting.
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(
    `UX preview server at ${url} did not start within ${timeoutMs}ms`,
  );
}

const uxPort = await findFreePort();
const uxBaseUrl = `http://127.0.0.1:${uxPort}`;
const { child: uxServer, logs: uxServerLogs } = startUxServer(uxPort);
const checkResults = checks.map(runNpmScript);

let captureRun = { status: 1 };
let diffRun = { status: 1 };
try {
  await waitForServer(uxBaseUrl);

  const visualEnv = {
    ...process.env,
    POSEIDON_UX_BASE_URL: uxBaseUrl,
  };

  // Visual capture — pass --strict in CI mode
  const captureArgs = ["scripts/ux-visual-capture.mjs"];
  if (strict) captureArgs.push("--strict");
  captureRun = spawnSync("node", captureArgs, {
    cwd: root,
    encoding: "utf8",
    stdio: "inherit",
    env: visualEnv,
  });

  // Visual diff — pass --strict in CI mode
  const diffArgs = ["scripts/ux-visual-diff.mjs"];
  if (strict) diffArgs.push("--strict");
  diffRun = spawnSync("node", diffArgs, {
    cwd: root,
    encoding: "utf8",
    stdio: "inherit",
    env: visualEnv,
  });

  // DOM heuristics — no strict mode (gracefully skips)
  spawnSync("node", ["scripts/ux-dom-heuristics.mjs"], {
    cwd: root,
    stdio: "inherit",
    env: visualEnv,
  });
} finally {
  uxServer.kill("SIGTERM");
}

const captureResult = fs.existsSync(visualCapturePath)
  ? JSON.parse(fs.readFileSync(visualCapturePath, "utf8"))
  : { ok: false, reason: "missing-capture-output" };
const diffResult = fs.existsSync(visualDiffPath)
  ? JSON.parse(fs.readFileSync(visualDiffPath, "utf8"))
  : { ok: false, reason: "missing-diff-output", diffs: [] };
const domHeuristicsResult = fs.existsSync(domHeuristicsPath)
  ? JSON.parse(fs.readFileSync(domHeuristicsPath, "utf8"))
  : { ok: false, reason: "missing-dom-heuristics-output", checks: [] };

const issues = [];

// Gate check failures
for (const check of checkResults) {
  if (check.ok) continue;
  issues.push({
    id: nextIssueId(issues.length),
    route: "/dashboard",
    criteria: "reliability",
    layer: "component",
    severity: "P0",
    demoImpact: "high",
    effort: "S",
    symptom: `Automated check failed: ${check.script}`,
    fixHypothesis: `Fix failing gate '${check.script}' and re-run ux:scan.`,
    owner: "frontend",
    status: "open",
    detectedBy: "rule",
    confidence: 0.98,
    autofixable: false,
  });
}

// Capture failures in strict mode
if (strict && !captureResult.ok && !captureResult.skipped) {
  issues.push({
    id: nextIssueId(issues.length),
    route: "/dashboard",
    criteria: "reliability",
    layer: "shell",
    severity: "P0",
    demoImpact: "high",
    effort: "S",
    symptom: `Visual capture failed: ${captureResult.reason ?? "unknown"}`,
    fixHypothesis: "Ensure Playwright is installed and dev server is running.",
    owner: "frontend",
    status: "open",
    detectedBy: "visual-capture",
    confidence: 0.95,
    autofixable: false,
  });
}

// Visual diff issues
const diffItems = Array.isArray(diffResult.diffs) ? diffResult.diffs : [];
for (const item of diffItems) {
  if (item.level !== "error" && item.level !== "warn") continue;
  issues.push({
    id: nextIssueId(issues.length),
    route: "/dashboard",
    criteria: "heroDiff",
    layer: "shell",
    severity: item.level === "error" ? "P1" : "P2",
    demoImpact: item.level === "error" ? "high" : "medium",
    effort: "M",
    symptom: `Visual drift detected in ${item.file} (ratio=${item.changeRatio}, method=${item.method ?? "unknown"}).`,
    fixHypothesis:
      "Inspect screenshot diff and apply targeted shell/page styling fixes.",
    owner: "frontend",
    status: "open",
    detectedBy: "visual-diff",
    confidence: item.method === "buffer" ? 0.85 : 0.7,
    autofixable: false,
  });
}

// DOM heuristic issues
const domChecks = Array.isArray(domHeuristicsResult.checks)
  ? domHeuristicsResult.checks
  : [];
for (const check of domChecks) {
  if (check.ok) continue;
  issues.push({
    id: nextIssueId(issues.length),
    route: check.route ?? "/dashboard",
    criteria: check.criteria ?? "a11y",
    layer: "shell",
    severity: check.severity ?? "P1",
    demoImpact: check.demoImpact ?? "high",
    effort: check.effort ?? "S",
    symptom: check.message ?? "DOM heuristic violation detected.",
    fixHypothesis:
      check.fixHypothesis ?? "Fix route markup to satisfy UX DOM heuristics.",
    owner: "frontend",
    status: "open",
    detectedBy: "rule",
    confidence: 0.9,
    autofixable: Boolean(check.autofixable),
    autofixRule: check.autofixRule,
  });
}

const failingChecks = checkResults.filter((c) => !c.ok).length;
const visualPenalty = diffItems.filter((d) => d.level === "error").length;
const capturePenalty = strict && !captureResult.ok ? 1 : 0;
const baseScore = Math.max(
  3.6,
  5 - failingChecks * 0.2 - visualPenalty * 0.1 - capturePenalty * 0.3,
);

const scores = criteria.map((key) => ({
  criteria: key,
  score: Number(baseScore.toFixed(1)),
  note:
    failingChecks > 0
      ? "Derived from failed gates; inspect checkResults."
      : "All gates passed. Verify visually for narrative quality.",
}));

const report = {
  baselineDate: new Date().toISOString().slice(0, 10),
  strict,
  demoFlow,
  scores,
  issues,
  meta: {
    checks: checkResults,
    visualCapture: captureResult,
    visualDiff: diffResult,
    domHeuristics: domHeuristicsResult,
  },
};

ensureDir(path.dirname(outputPath));
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
console.log(
  JSON.stringify(
    {
      ok: true,
      strict,
      outputPath: path.relative(root, outputPath),
      issues: issues.length,
    },
    null,
    2,
  ),
);

// In strict mode, exit non-zero if capture or diff failed
if (strict) {
  if (captureRun.status !== 0) {
    uxServerLogs.forEach((line) => process.stderr.write(line));
    console.error("STRICT: Visual capture failed.");
    process.exit(1);
  }
  if (diffRun.status !== 0) {
    uxServerLogs.forEach((line) => process.stderr.write(line));
    console.error("STRICT: Visual diff failed.");
    process.exit(1);
  }
}
