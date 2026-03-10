import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { CROSS_SCREEN_DATA_THREAD } from '../contracts/rebuild-contracts'
import { DEMO_THREAD } from '../lib/demo-thread'
import {
  getCanonicalUniverse,
  selectDashboardView,
  selectGovernAuditEntries,
  selectGovernAuditSummaryView,
  selectGovernLedgerPreview,
  selectGovernSummaryView,
  validateCanonicalUniverse,
  CANONICAL_UNIVERSE,
} from '../domain/poseidon-universe'
import { TRUST_POLICIES, TRUST_BAR_ITEMS } from '../content/trust-policies'
import { LANDING_COPY } from '../content/landing-copy'
import { selectThreatFactors } from '../domain/poseidon-universe'
import { recommendationDetails } from '../pages/grow/recommendation-detail-data'

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
      { file: 'src/pages/Govern.tsx', selector: 'selectGovernAuditEntries' },
      { file: 'src/pages/GovernAuditLedger.tsx', selector: 'selectGovernAuditEntries' },
    ]

    for (const { file, selector } of selectorExpectations) {
      const source = readSource(file)
      expect(source).toContain(selector)
      expect(source).not.toContain('MerchantX')
      expect(source).not.toContain('$4,200')
    }
  })

  it('keeps SOC 2 wording consistently in-progress in landing copy (jeton)', () => {
    const source = readSource('src/content/landing-copy-jeton.ts')
    expect(source).toContain('SOC 2 Type II in progress')
    expect(source).not.toMatch(/SOC 2 certified/i)
    expect(source).not.toMatch(/SOC 2 compliance maintained/i)
  })

  it('keeps SOC 2 wording consistently in-progress across trust policies', () => {
    expect(TRUST_POLICIES.soc2).toContain('SOC 2 Type II in progress')
    expect(TRUST_POLICIES.soc2).not.toMatch(/SOC 2 certified/i)
    expect(TRUST_POLICIES.soc2).not.toMatch(/SOC 2 compliance maintained/i)
  })

  it('validates canonical universe invariants', () => {
    expect(validateCanonicalUniverse(CANONICAL_UNIVERSE)).toEqual([])
  })

  it('keeps Dashboard hero optimization tied to canonical potential optimization', () => {
    const dashboard = selectDashboardView()
    const universe = getCanonicalUniverse()
    expect(dashboard.monthlyOptimizationPotentialUsd).toBe(
      universe.metrics.monthlyOptimizationPotentialUsd,
    )
    expect(dashboard.recommendationCount).toBe(
      universe.entities.recommendations.length,
    )
  })

  it('uses selectCohortMetrics on downstream pages', () => {
    const cohortPages = [
      { file: 'src/pages/Landing.tsx', selector: 'selectCohortMetrics' },
      { file: 'src/pages/Dashboard.tsx', selector: 'selectCohortMetrics' },
    ]

    for (const { file, selector } of cohortPages) {
      const source = readSource(file)
      expect(source).toContain(selector)
    }
  })

  it('keeps cohort contract values tied to canonical universe', () => {
    const cohort = CANONICAL_UNIVERSE.metrics.cohort
    expect(CROSS_SCREEN_DATA_THREAD.cohort_acceptance_rate.value).toBe(cohort.recommendationAcceptanceRate)
    expect(CROSS_SCREEN_DATA_THREAD.cohort_avg_savings.value).toBe(cohort.avgMonthlySavingsUsd)
    expect(CROSS_SCREEN_DATA_THREAD.projected_3y_advantage.value).toBe(cohort.projected3yAdvantageUsd)
    const trendContract = CROSS_SCREEN_DATA_THREAD.cohort_fraud_trend.value as { label: string; changePercent: number; period: string }
    expect(trendContract.label).toBe(cohort.fraudTrend.label)
    expect(trendContract.changePercent).toBe(cohort.fraudTrend.changePercent)
    expect(trendContract.period).toBe(cohort.fraudTrend.period)
  })

  it('derives ledger preview from audit entries (single source of truth)', () => {
    const ledger = selectGovernLedgerPreview()
    const audit = selectGovernAuditEntries()
    expect(ledger.length).toBe(audit.length)
    for (let i = 0; i < audit.length; i++) {
      expect(ledger[i].id).toBe(audit[i].id)
      expect(ledger[i].action).toBe(audit[i].action)
      expect(ledger[i].type).toBe(audit[i].type)
      expect(ledger[i].confidence).toBe(audit[i].confidence)
    }
  })

  it('keeps architectural trust invariants tied to canonical universe', () => {
    const trust = CANONICAL_UNIVERSE.metrics.architecturalTrust
    expect(trust.autoExecutionsWithoutConsent).toBe(0)
    expect(trust.auditCoveragePercent).toBe(100)
    expect(trust.llmRetentionDays).toBe(0)
    expect(trust.llmTrainingOptOut).toBe(true)
    expect(CROSS_SCREEN_DATA_THREAD.zero_auto_executions.value).toBe(trust.autoExecutionsWithoutConsent)
    expect(CROSS_SCREEN_DATA_THREAD.audit_coverage_percent.value).toBe(trust.auditCoveragePercent)
  })

  it('binds landing trust bar to shared trust policies (closed loop)', () => {
    expect(LANDING_COPY.hero.trustItems).toBe(TRUST_BAR_ITEMS)
    expect(TRUST_BAR_ITEMS).toContain(TRUST_POLICIES.llmZeroRetention)
    expect(CANONICAL_UNIVERSE.metrics.architecturalTrust.llmRetentionDays).toBe(0)
  })

  it('uses selectArchitecturalTrust on downstream pages', () => {
    for (const file of ['src/pages/Landing.tsx', 'src/pages/Execute.tsx']) {
      expect(readSource(file)).toContain('selectArchitecturalTrust')
    }
  })

  it('Landing.tsx renders trust bar from shared source, not hardcoded', () => {
    const landingSource = readSource('src/pages/Landing.tsx')
    expect(landingSource).toContain('LANDING_COPY.hero.trustItems')
    expect(landingSource).not.toMatch(/Read-Only Bank APIs/)
    expect(landingSource).not.toMatch(/LLM Zero-Retention/)
  })

  it('Govern.tsx renders hero with canonical audit data', () => {
    const governSource = readSource('src/pages/Govern.tsx')
    expect(governSource).toContain('selectGovernAuditSummaryView')
    expect(governSource).toContain('selectGovernAuditEntries')
  })

  it('keeps risk incidents flagged tied to canonical via contract', () => {
    const perf = CANONICAL_UNIVERSE.metrics.cohort.protectPerformance
    expect(CROSS_SCREEN_DATA_THREAD.risk_incidents_flagged.value).toBe(perf.riskIncidentsFlagged)
  })

  it('keeps avg monthly exposure tied to canonical via contract', () => {
    const perf = CANONICAL_UNIVERSE.metrics.cohort.protectPerformance
    expect(CROSS_SCREEN_DATA_THREAD.avg_monthly_exposure.value).toBe(perf.avgMonthlyExposureUsd)
  })

  it('keeps platform profile count tied to canonical via contract', () => {
    expect(CROSS_SCREEN_DATA_THREAD.platform_profile_count.value).toBe(
      CANONICAL_UNIVERSE.metrics.platformProfileCount,
    )
  })

  it('aligns platformProfileCount to roadmap Phase 3 (~180K)', () => {
    const count = CANONICAL_UNIVERSE.metrics.platformProfileCount
    expect(count).toBeGreaterThanOrEqual(180_000)
    expect(count).toBeLessThanOrEqual(200_000)
  })

  it('keeps platformProfileCount distinct from cohortSize', () => {
    expect(CANONICAL_UNIVERSE.metrics.platformProfileCount).toBeGreaterThan(
      CANONICAL_UNIVERSE.metrics.cohort.cohortSize,
    )
  })

  it('anchors protect proof thread to canonical selectors (always visible)', () => {
    const src = readSource('src/pages/protect/Protect.tsx')
    expect(src).toContain('selectProtectThreats')
    expect(src).toContain('selectAccounts')
  })

  it('renders chart with simulation data on grow hero', () => {
    expect(readSource('src/components/poseidon/grow-hero.tsx')).toContain('simulationData')
  })

  it('uses read-only honest language — no "block" in user-facing copy', () => {
    const BANNED_SOURCE_PATTERNS = [
      /blockedCount/,
      /[Aa]uto[- ]?[Bb]lock/,
      /[Bb]locked\b/,
      /[Bb]locking\b/,
    ]

    for (const file of [
      'src/pages/protect/Protect.tsx',
      'src/components/poseidon/protect-hero.tsx',
      'src/pages/Notifications.tsx',
      'src/pages/Settings.tsx',
      'src/domain/poseidon-universe/canonical.ts',
      'src/lib/govern-audit-data.ts',
    ]) {
      const src = readSource(file)
      for (const pattern of BANNED_SOURCE_PATTERNS) {
        expect(src, `${pattern} found in ${file}`).not.toMatch(pattern)
      }
    }
  })

  it('THR-005 password change uses factual, non-accusatory language', () => {
    const thr005 = CANONICAL_UNIVERSE.entities.protectThreats.find(t => t.id === 'THR-005')!
    expect(thr005.description).toMatch(/password|confirmed|intentional/i)
    expect(thr005.description).not.toMatch(/high-risk category/i)
    const factors = selectThreatFactors('THR-005')
    const allText = factors.map(f => `${(f as any).heroCue ?? ''} ${f.details}`).join(' ')
    expect(allText).not.toMatch(/inherently suspicious/i)
  })

  it('EXE-003 does not claim content overlap from billing data', () => {
    const exe003 = CANONICAL_UNIVERSE.entities.executeActions.find(a => a.id === 'EXE-003')!
    expect(exe003.description).not.toMatch(/content overlap/i)
    const overlapFactor = exe003.factors.find(f => /overlap/i.test(f.label))
    expect(overlapFactor).toBeUndefined()
    const allStepText = exe003.steps.map(s => s.description).join(' ')
    expect(allStepText).not.toMatch(/88%.*overlap|content overlap/i)
  })

  it('REC-003 streaming consolidation is semi-auto with billing-detectable data', () => {
    const rec003 = recommendationDetails.find(r => r.id === 3)!
    expect(rec003).toBeDefined()
    expect(rec003.executionType).toBe('semi-auto')
    expect(rec003.title).toContain('Streaming')
    expect(rec003.title).not.toMatch(/gym/i)
    expect(rec003.dataSources.some(ds => /subscription|billing/i.test(ds))).toBe(true)
  })
})
