#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const ROUTES_FILE = path.join(ROOT, 'src', 'router', 'lazyRoutes.ts')
const VISUAL_BASELINE_FILE = path.join(ROOT, 'spec', 'ux-visual-baseline.json')
const ROUTE_BASELINE_FILE = path.join(ROOT, 'docs', 'baselines', 'inline-style-route-baseline.json')
const EXCEPTIONS_FILE = path.join(ROOT, 'docs', 'baselines', 'inline-style-exceptions.json')

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function parseRouteLoaders(source) {
  const matches = [
    ...source.matchAll(/'([^']+)':\s*\(\)\s*=>\s*import\('\.\.\/pages\/([^']+)'\)/g),
  ]
  return matches.map((match) => ({
    route: match[1],
    pageFile: `src/pages/${match[2]}.tsx`,
  }))
}

function countInlineStyle(filePath) {
  const source = read(filePath)
  return (source.match(/style=\{\{/g) || []).length
}

function fail(message, failures) {
  failures.push(message)
}

const failures = []

if (!fs.existsSync(ROUTES_FILE)) {
  fail('src/router/lazyRoutes.ts is missing.', failures)
}
if (!fs.existsSync(VISUAL_BASELINE_FILE)) {
  fail('spec/ux-visual-baseline.json is missing.', failures)
}
if (!fs.existsSync(ROUTE_BASELINE_FILE)) {
  fail('docs/baselines/inline-style-route-baseline.json is missing.', failures)
}
if (!fs.existsSync(EXCEPTIONS_FILE)) {
  fail('docs/baselines/inline-style-exceptions.json is missing.', failures)
}

if (failures.length > 0) {
  console.error('Inline style contract checks failed:')
  failures.forEach((entry) => console.error(`- ${entry}`))
  process.exit(1)
}

const routeEntries = parseRouteLoaders(read(ROUTES_FILE))
const visualBaseline = JSON.parse(read(VISUAL_BASELINE_FILE))
const routeBaseline = JSON.parse(read(ROUTE_BASELINE_FILE))
const exceptions = JSON.parse(read(EXCEPTIONS_FILE))

const lockRoutes = new Set(Array.isArray(visualBaseline.routes) ? visualBaseline.routes : [])
const baselineRoutes = routeBaseline.routes ?? {}
const exceptionRoutes = exceptions.routes ?? {}

const currentRoutes = new Map()
for (const { route, pageFile } of routeEntries) {
  const absolutePath = path.join(ROOT, pageFile)
  if (!fs.existsSync(absolutePath)) {
    fail(`${pageFile}: missing page file for route ${route}.`, failures)
    continue
  }

  currentRoutes.set(route, {
    route,
    pageFile,
    inlineStyleCount: countInlineStyle(absolutePath),
  })
}

for (const [route, data] of currentRoutes.entries()) {
  const baseline = baselineRoutes[route]
  if (!baseline) {
    fail(`docs/baselines/inline-style-route-baseline.json: missing route baseline for ${route}.`, failures)
    continue
  }

  if (baseline.pageFile !== data.pageFile) {
    fail(
      `${route}: pageFile drifted (${baseline.pageFile} -> ${data.pageFile}). Update baseline deliberately.`,
      failures,
    )
  }

  if (typeof baseline.inlineStyleCount !== 'number') {
    fail(`${route}: baseline inlineStyleCount must be a number.`, failures)
    continue
  }

  if (data.inlineStyleCount > baseline.inlineStyleCount) {
    fail(
      `${route}: inline style count increased (${baseline.inlineStyleCount} -> ${data.inlineStyleCount}).`,
      failures,
    )
  }
}

for (const route of Object.keys(baselineRoutes)) {
  if (!currentRoutes.has(route)) {
    fail(`docs/baselines/inline-style-route-baseline.json contains stale route ${route}.`, failures)
  }
}

for (const route of lockRoutes) {
  const current = currentRoutes.get(route)
  if (!current) {
    fail(`visual-lock route ${route} is not found in lazyRoutes.ts.`, failures)
    continue
  }

  const exception = exceptionRoutes[route]
  const allowed = exception?.maxInlineStyles ?? 0

  if (typeof allowed !== 'number' || allowed < 0) {
    fail(`inline-style exception for ${route} must define non-negative maxInlineStyles.`, failures)
    continue
  }

  if (current.inlineStyleCount > allowed) {
    fail(
      `${route}: visual-lock route has ${current.inlineStyleCount} inline styles, allowed max is ${allowed}.`,
      failures,
    )
  }

  const baseline = baselineRoutes[route]
  if (baseline && allowed > baseline.inlineStyleCount) {
    fail(
      `${route}: exception maxInlineStyles (${allowed}) cannot exceed baseline (${baseline.inlineStyleCount}).`,
      failures,
    )
  }
}

for (const route of Object.keys(exceptionRoutes)) {
  if (!lockRoutes.has(route)) {
    fail(`docs/baselines/inline-style-exceptions.json: ${route} is not a visual-lock route.`, failures)
  }
}

if (failures.length > 0) {
  console.error('Inline style contract checks failed:')
  failures.forEach((entry) => console.error(`- ${entry}`))
  process.exit(1)
}

const lockSummary = [...lockRoutes]
  .map((route) => {
    const current = currentRoutes.get(route)
    return `${route}:${current?.inlineStyleCount ?? 'n/a'}`
  })
  .join(', ')

console.log(
  `Inline style contract checks passed. (routes=${currentRoutes.size}, lockRoutes=${lockRoutes.size}, lockCounts=[${lockSummary}])`,
)
