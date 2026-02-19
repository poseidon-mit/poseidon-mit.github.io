import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { CROSS_SCREEN_DATA_THREAD } from '../contracts/rebuild-contracts'
import { DEMO_THREAD } from '../lib/demo-thread'

const repoRoot = resolve(__dirname, '..', '..')

function readSource(pathFromRoot: string): string {
  return readFileSync(resolve(repoRoot, pathFromRoot), 'utf-8')
}

describe('demo coherence invariants', () => {
  it('keeps pending actions consistent across contracts and UI wiring', () => {
    expect(DEMO_THREAD.pendingActions).toBe(CROSS_SCREEN_DATA_THREAD.pending_actions.value)

    const navShell = readSource('src/components/layout/AppNavShell.tsx')
    expect(navShell).toContain('value: DEMO_THREAD.pendingActions')

    const commandPalette = readSource('src/components/layout/CommandPalette.tsx')
    expect(commandPalette).toContain('DEMO_THREAD.pendingActions')
  })

  it('keeps governed audit totals arithmetically consistent', () => {
    const auditLedger = readSource('src/pages/GovernAuditLedger.tsx')
    const verified = Number(auditLedger.match(/const VERIFIED_COUNT = (\d+)/)?.[1] ?? NaN)
    const pending = Number(auditLedger.match(/const PENDING_REVIEW_COUNT = (\d+)/)?.[1] ?? NaN)
    const flagged = Number(auditLedger.match(/const FLAGGED_COUNT = (\d+)/)?.[1] ?? NaN)

    expect(Number.isFinite(verified)).toBe(true)
    expect(Number.isFinite(pending)).toBe(true)
    expect(Number.isFinite(flagged)).toBe(true)
    expect(verified + pending + flagged).toBe(DEMO_THREAD.decisionsAudited)
  })

  it('uses canonical critical-alert data on demo-path pages', () => {
    const files = [
      'src/pages/ProtectDispute.tsx',
      'src/pages/AlertsHub.tsx',
      'src/pages/Dashboard.tsx',
      'src/pages/ExecuteApproval.tsx',
      'src/pages/ProtectAlertDetail.tsx',
      'src/pages/GovernOversight.tsx',
      'src/pages/TrustSecurity.tsx',
    ]

    for (const file of files) {
      const source = readSource(file)
      expect(source).toContain('DEMO_THREAD.criticalAlert')
      expect(source).not.toContain('MerchantX')
      expect(source).not.toContain('$4,200')
    }
  })
})
