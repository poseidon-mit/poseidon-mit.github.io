import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { CROSS_SCREEN_DATA_THREAD } from '../contracts/rebuild-contracts'
import { DEMO_THREAD } from '../lib/demo-thread'
import {
  selectGovernAuditSummaryView,
  selectGovernSummaryView,
  validateCanonicalUniverse,
  CANONICAL_UNIVERSE,
} from '../domain/poseidon-universe'

const repoRoot = resolve(__dirname, '..', '..')

function readSource(pathFromRoot: string): string {
  return readFileSync(resolve(repoRoot, pathFromRoot), 'utf-8')
}

describe('demo coherence invariants', () => {
  it('keeps pending actions consistent across contracts and UI wiring', () => {
    expect(DEMO_THREAD.pendingActions).toBe(CROSS_SCREEN_DATA_THREAD.pending_actions.value)

    const navShell = readSource('src/components/layout/AppNavShell.tsx')
    expect(navShell).toMatch(/(DEMO_THREAD\.pendingActions|getPendingExecuteCount)/)

    const commandPalette = readSource('src/components/layout/CommandPalette.tsx')
    expect(commandPalette).toContain('DEMO_THREAD.pendingActions')
  })

  it('keeps governed audit totals arithmetically consistent', () => {
    const summary = selectGovernSummaryView()
    expect(
      summary.verifiedDecisions + summary.pendingReviewDecisions + summary.flaggedDecisions,
    ).toBe(DEMO_THREAD.decisionsAudited)

    const auditSummary = selectGovernAuditSummaryView()
    expect(auditSummary.total).toBe(summary.decisionsAuditedTotal)
  })

  it('uses canonical universe selectors on golden-path pages', () => {
    const selectorExpectations: Array<{ file: string; selector: string }> = [
      { file: 'src/pages/Dashboard.tsx', selector: 'selectDashboardView' },
      { file: 'src/pages/protect/protect-data.ts', selector: 'selectProtectThreats' },
      { file: 'src/pages/Execute.tsx', selector: 'selectExecuteActionsView' },
      { file: 'src/pages/Govern.tsx', selector: 'selectGovernLedgerPreview' },
      { file: 'src/pages/GovernAuditLedger.tsx', selector: 'selectGovernAuditEntries' },
    ]

    for (const { file, selector } of selectorExpectations) {
      const source = readSource(file)
      expect(source).toContain(selector)
      expect(source).not.toContain('MerchantX')
      expect(source).not.toContain('$4,200')
    }
  })

  it('keeps SOC 2 wording consistently in-progress in govern data', () => {
    const source = readSource('src/pages/govern/govern-data.ts')
    expect(source).toContain('SOC 2 Type II in progress')
    expect(source).not.toMatch(/SOC 2 certified/i)
    expect(source).not.toMatch(/SOC 2 compliance maintained/i)
  })

  it('validates canonical universe invariants', () => {
    expect(validateCanonicalUniverse(CANONICAL_UNIVERSE)).toEqual([])
  })
})
