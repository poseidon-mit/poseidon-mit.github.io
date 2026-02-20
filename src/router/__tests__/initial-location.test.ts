import { describe, expect, it } from 'vitest'
import {
  resolveInitialLocation,
  resolveInitialPath,
  resolveInitialSearch,
} from '@/router'

interface LocationLike {
  pathname: string
  search: string
}

function makeLocation(pathname: string, search = ''): LocationLike {
  return { pathname, search }
}

describe('resolveInitialLocation', () => {
  it('uses pathname directly for normal deep links', () => {
    const resolved = resolveInitialLocation(makeLocation('/dashboard', '?tab=overview'))
    expect(resolved.path).toBe('/dashboard')
    expect(resolved.search).toBe('?tab=overview')
  })

  it('restores GitHub Pages query-style route from /?/path', () => {
    const resolved = resolveInitialLocation(makeLocation('/', '?/govern/audit-detail&decision=GV-2026-0319-847'))
    expect(resolved.path).toBe('/govern/audit-detail')
    expect(resolved.search).toBe('?decision=GV-2026-0319-847')
  })

  it('decodes encoded ampersands from GitHub Pages fallback payload', () => {
    const resolved = resolveInitialLocation(makeLocation('/', '?/execute/history&filter=approved~and~deferred'))
    expect(resolved.path).toBe('/execute/history')
    expect(resolved.search).toBe('?filter=approved&deferred')
  })

  it('keeps root path when no route payload exists', () => {
    const resolved = resolveInitialLocation(makeLocation('/', ''))
    expect(resolved.path).toBe('/')
    expect(resolved.search).toBe('')
  })
})

describe('resolveInitialPath/resolveInitialSearch', () => {
  it('returns path and search helpers consistently', () => {
    const location = makeLocation('/', '?/dashboard&next=%2Fprotect')
    expect(resolveInitialPath(location)).toBe('/dashboard')
    expect(resolveInitialSearch(location)).toBe('?next=/protect')
  })
})
