#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const ROUTES_FILE = path.join(ROOT, 'src', 'router', 'lazyRoutes.ts')
const APP_ROUTES_FILE = path.join(ROOT, 'src', 'router', 'app-shell-routes.ts')
const EXCEPTIONS_FILE = path.join(ROOT, 'docs', 'baselines', 'inline-style-hex-exceptions.json')

const FORBIDDEN_ENGINE_HEX = ['#00F0FF', '#22C55E', '#8B5CF6', '#EAB308', '#3B82F6']

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function parseAppPrefixes(source) {
  const blockMatch = source.match(/APP_SHELL_PREFIXES\s*=\s*\[([\s\S]*?)\]/)
  if (!blockMatch) return []
  const quoted = blockMatch[1].match(/'\/[^']*'/g) ?? []
  return [...new Set(quoted.map((item) => item.slice(1, -1)))]
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

function isAppRoute(route, prefixes) {
  return prefixes.some((prefix) => route === prefix || route.startsWith(`${prefix}/`))
}

function checkExceptionContract() {
  const failures = []
  if (!fs.existsSync(EXCEPTIONS_FILE)) {
    failures.push('docs/baselines/inline-style-hex-exceptions.json is missing.')
    return failures
  }

  let spec
  try {
    spec = JSON.parse(read(EXCEPTIONS_FILE))
  } catch (error) {
    failures.push(`inline-style-hex-exceptions.json is invalid JSON (${String(error)}).`)
    return failures
  }

  if (spec.maxExceptions !== 0) {
    failures.push('inline-style-hex-exceptions.json must set maxExceptions to 0.')
  }

  if (!Array.isArray(spec.exceptions) || spec.exceptions.length !== 0) {
    failures.push('inline-style-hex-exceptions.json must have an empty exceptions array.')
  }

  return failures
}

const routeSource = read(ROUTES_FILE)
const appRouteSource = read(APP_ROUTES_FILE)
const appPrefixes = parseAppPrefixes(appRouteSource)
const routeEntries = parseRouteLoaders(routeSource).filter((entry) => isAppRoute(entry.route, appPrefixes))

const failures = [...checkExceptionContract()]
let filesChecked = 0
let inlineRootCount = 0
let forbiddenHexCount = 0

for (const { pageFile } of routeEntries) {
  const absolutePath = path.join(ROOT, pageFile)
  if (!fs.existsSync(absolutePath)) {
    failures.push(`${pageFile}: missing page file.`)
    continue
  }

  filesChecked += 1
  const source = read(absolutePath)

  const rootBackgroundMatches =
    source.match(
      /<div\s+className="[^"]*min-h-screen[^"]*"[\s\S]{0,140}?style=\{\{\s*background:\s*['"]#0B1221['"]/g,
    ) ?? []
  if (rootBackgroundMatches.length > 0) {
    inlineRootCount += rootBackgroundMatches.length
    failures.push(
      `${pageFile}: root background '#0B1221' inline style detected (${rootBackgroundMatches.length}). Use AppNavShell background.`,
    )
  }

  for (const literal of FORBIDDEN_ENGINE_HEX) {
    const literalMatches = source.match(new RegExp(literal.replace('#', '\\#'), 'g')) ?? []
    if (literalMatches.length > 0) {
      forbiddenHexCount += literalMatches.length
      failures.push(`${pageFile}: forbidden engine hex literal ${literal} detected (${literalMatches.length}).`)
    }
  }
}

if (failures.length > 0) {
  console.error('Inline style/hex checks failed:')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(
  `Inline style/hex checks passed (filesChecked=${filesChecked}, inlineRootCount=${inlineRootCount}, forbiddenHexCount=${forbiddenHexCount}).`,
)
