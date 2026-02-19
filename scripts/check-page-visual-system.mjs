#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const ROOT = process.cwd()
const ROUTES_FILE = path.join(ROOT, 'src', 'router', 'lazyRoutes.ts')
const APP_ROUTES_FILE = path.join(ROOT, 'src', 'router', 'app-shell-routes.ts')
const STRICT = process.argv.includes('--strict')

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

function hasInlineRootBackground(source) {
  return /<div\s+className="[^"]*min-h-screen[^"]*"[\s\S]{0,140}?style=\{\{\s*background:\s*['"]#0B1221['"]/.test(
    source,
  )
}

function checkPageInvariants(pagePath, source, strict) {
  const failures = []

  if (hasInlineRootBackground(source)) {
    failures.push(`${pagePath}: inline root background '#0B1221' is forbidden (use AppNavShell/app-bg-depth).`)
  }

  if (/function\s+AuroraPulse\s*\(/.test(source)) {
    failures.push(`${pagePath}: local AuroraPulse definition detected; import from '@/components/poseidon'.`)
  }
  if (/function\s+GovernFooter\s*\(/.test(source)) {
    failures.push(`${pagePath}: local GovernFooter definition detected; import from '@/components/poseidon'.`)
  }
  if (/const\s+fadeUp\s*=/.test(source)) {
    failures.push(`${pagePath}: local fadeUp motion preset detected; import from '@/lib/motion-presets'.`)
  }
  if (/const\s+staggerContainer\s*=/.test(source)) {
    failures.push(`${pagePath}: local staggerContainer motion preset detected; import from '@/lib/motion-presets'.`)
  }

  if (/<AuroraPulse\b/.test(source) && !/from\s+['"]@\/components\/poseidon['"]/.test(source)) {
    failures.push(`${pagePath}: AuroraPulse usage must import from '@/components/poseidon'.`)
  }
  if (/<GovernFooter\b/.test(source) && !/from\s+['"]@\/components\/poseidon['"]/.test(source)) {
    failures.push(`${pagePath}: GovernFooter usage must import from '@/components/poseidon'.`)
  }
  if (
    /(variants=\{fadeUp\}|variants=\{staggerContainer\}|staggerContainer\b|fadeUp\b)/.test(source) &&
    !/from\s+['"]@\/lib\/motion-presets['"]/.test(source)
  ) {
    failures.push(`${pagePath}: shared motion presets must be imported from '@/lib/motion-presets'.`)
  }

  return failures
}

const routeSource = read(ROUTES_FILE)
const appRouteSource = read(APP_ROUTES_FILE)
const appPrefixes = parseAppPrefixes(appRouteSource)
const routeEntries = parseRouteLoaders(routeSource)

if (appPrefixes.length === 0) {
  console.error('[visual-system] could not parse app-shell prefixes')
  process.exit(1)
}

const appRouteEntries = routeEntries.filter(({ route }) => isAppRoute(route, appPrefixes))
const failures = []

for (const { route, pageFile } of appRouteEntries) {
  const absolutePath = path.join(ROOT, pageFile)
  if (!fs.existsSync(absolutePath)) {
    failures.push(`${route}: page file is missing (${pageFile}).`)
    continue
  }

  const source = read(absolutePath)
  failures.push(...checkPageInvariants(pageFile, source, STRICT))
}

console.log(`[visual-system] Mode: ${STRICT ? 'strict' : 'contract'}`)
console.log(`[visual-system] app routes checked: ${appRouteEntries.length}`)
console.log(`[visual-system] app prefixes: ${appPrefixes.join(', ')}`)

if (failures.length > 0) {
  console.error('[visual-system] contract violations:')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('[visual-system] Route contract checks passed.')
