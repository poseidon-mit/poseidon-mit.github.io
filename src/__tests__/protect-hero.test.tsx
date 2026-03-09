import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { pickTopAlert } from '../pages/protect/Protect'
import { ProtectAnomalyRadar, ProtectThreatPosture } from '../components/poseidon/protect-hero'
import {
  THREATS,
  deriveFactors,
} from '../pages/protect/protect-data'
import type { ThreatSeverity } from '../pages/protect/protect-data'
import { selectThreatFactors } from '../domain/poseidon-universe'

/* ── Mock router (Link component needs it) ── */
vi.mock('../router', () => ({
  Link: ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => (
    <a href={to} className={className}>{children}</a>
  ),
  useRouter: () => ({ navigate: vi.fn() }),
}))

/* ── Test helpers ── */

const THR_001 = THREATS.find(t => t.id === 'THR-001')!

function makeRadarAxes(alertId: string, confidence: number) {
  const items = selectThreatFactors(alertId)
  if (!items.length) return []
  const derived = deriveFactors(items, confidence)
  return derived
    .filter(f => !f.mitigating)
    .map(f => ({
      label: f.title.replace('Unusual ', '').replace('Known ', ''),
      value: f.value,
      maxValue: 0.30,
      color: f.value >= 0.20 ? 'var(--state-critical)' : 'var(--state-warning)',
    }))
}

function makeEvidenceCues(alertId: string) {
  const items = selectThreatFactors(alertId)
  if (!items.length) return []
  return items
    .filter(i => !i.mitigating && i.heroCue)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map(i => i.heroCue!)
}

const AUDIT_CHAIN = { alertId: 'THR-001', actionId: 'EXE-002', decisionId: 'GV-2026-0319-846' }

/* ═══════════════════════════════════════════════════════
   FACADE-LEVEL TESTS
   ═══════════════════════════════════════════════════════ */

describe('ProtectAnomalyRadar', () => {
  const radarAxes = makeRadarAxes('THR-001', THR_001.confidence)
  const evidenceCues = makeEvidenceCues('THR-001')

  function renderRadar(overrides: Partial<Parameters<typeof ProtectAnomalyRadar>[0]> = {}) {
    const props = {
      alert: THR_001,
      radarAxes,
      evidenceCues,
      auditChain: AUDIT_CHAIN,
      remainingCount: 4,
      totalExposure: 13247,
      fpRate: '0.01%',
      onReviewThreat: vi.fn(),
      ...overrides,
    }
    return { ...render(<ProtectAnomalyRadar {...props} />), props }
  }

  it('fires onReviewThreat callback when Review Threat CTA is clicked', () => {
    const { props } = renderRadar()
    const btn = screen.getByRole('button', { name: /review threat/i })
    fireEvent.click(btn)
    expect(props.onReviewThreat).toHaveBeenCalledOnce()
  })

  it('renders headline with critical threat text', () => {
    renderRadar()
    expect(screen.getByText(/1 critical threat detected/i)).toBeInTheDocument()
  })

  it('renders action spotlight with alert id, counterparty, and amount', () => {
    renderRadar()
    // THR-001 appears in both action spotlight and audit chain
    expect(screen.getAllByText(THR_001.id).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(THR_001.counterparty)).toBeInTheDocument()
    expect(screen.getByText(THR_001.amount)).toBeInTheDocument()
  })

  it('renders evidence cues from heroCue field', () => {
    renderRadar()
    for (const cue of evidenceCues) {
      expect(screen.getByText(cue)).toBeInTheDocument()
    }
  })

  it('renders View Audit Trail link with decision deep-link when auditChain provided', () => {
    renderRadar()
    const auditLink = screen.getByRole('link', { name: /view audit trail/i })
    expect(auditLink).toBeInTheDocument()
    expect(auditLink).toHaveAttribute('href', '/govern/audit-detail?decision=GV-2026-0319-846')
  })

  it('renders View Audit Trail with generic link when auditChain is null', () => {
    renderRadar({ auditChain: null })
    const auditLink = screen.getByRole('link', { name: /view audit trail/i })
    expect(auditLink).toBeInTheDocument()
    expect(auditLink).toHaveAttribute('href', '/govern/audit')
  })

  it('shows bridge line with remaining count and total exposure', () => {
    renderRadar({ remainingCount: 3, totalExposure: 10000 })
    expect(screen.getByText(/3 more threats below/)).toBeInTheDocument()
    expect(screen.getByText(/\$10,000 total exposure/)).toBeInTheDocument()
  })

  it('renders radar SVG element', () => {
    const { container } = renderRadar()
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('renders radar axes from derived contribution values (all 5 risk factors)', () => {
    expect(radarAxes).toHaveLength(5)
    // All axes should have values in the 0-0.30 range (derived contributions)
    for (const axis of radarAxes) {
      expect(axis.value).toBeGreaterThan(0)
      expect(axis.value).toBeLessThanOrEqual(0.30)
      expect(axis.maxValue).toBe(0.30)
    }
  })
})

describe('ProtectThreatPosture', () => {
  it('renders active count and Review top alert CTA', () => {
    const onOpen = vi.fn()
    render(
      <ProtectThreatPosture
        activeCount={4}
        highCount={1}
        mediumCount={2}
        lowCount={1}
        resolvedCount={1}
        fpRate="0.01%"
        modelUpdate="2d ago"
        topAlert={{ id: 'THR-002', counterparty: 'Unknown Vendor', severity: 'High' }}
        onOpenTopAlert={onOpen}
      />,
    )
    expect(screen.getByText(/4 threats monitored/)).toBeInTheDocument()
    const btn = screen.getByRole('button', { name: /review top alert/i })
    fireEvent.click(btn)
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it('renders editorial heading with font-display and no adjacent icon (Calm Monitoring)', () => {
    render(
      <ProtectThreatPosture
        activeCount={4} highCount={1} mediumCount={2} lowCount={1}
        resolvedCount={1} fpRate="0.01%" modelUpdate="2d ago"
        topAlert={{ id: 'THR-002', counterparty: 'Unknown Vendor', severity: 'High' }}
        onOpenTopAlert={vi.fn()}
      />,
    )
    const heading = screen.getByRole('heading', { level: 2 })
    // Typography: editorial font-light + display font
    expect(heading).toHaveClass('font-light', 'tracking-tight')
    expect(heading.style.fontFamily).toContain('var(--font-display)')
    // Icon removal: no SVG siblings before the heading
    const parent = heading.parentElement!
    const headingIndex = Array.from(parent.children).indexOf(heading)
    const svgsBefore = Array.from(parent.children)
      .filter((el, i) => i < headingIndex && (el.tagName === 'svg' || el.querySelector('svg')))
    expect(svgsBefore).toHaveLength(0)
  })

  it('renders filled gradient CTA with h-auto, not glass variant', () => {
    render(
      <ProtectThreatPosture
        activeCount={4} highCount={1} mediumCount={2} lowCount={1}
        resolvedCount={1} fpRate="0.01%" modelUpdate="2d ago"
        topAlert={{ id: 'THR-002', counterparty: 'Unknown Vendor', severity: 'High' }}
        onOpenTopAlert={vi.fn()}
      />,
    )
    const btn = screen.getByRole('button', { name: /review top alert/i })
    // New common CTA shape
    expect(btn.className).toContain('rounded-2xl')
    expect(btn.className).toContain('bg-gradient-to-r')
    expect(btn.className).toContain('h-auto')
    expect(btn.className).toContain('from-emerald-500')
    // Old glass variant must be fully absent
    const glassSignatures = [
      'bg-white/5',
      'backdrop-blur',
      'border-white/10',
      'shadow-[0_0_15px_rgba(255,255,255',
      'hover:bg-white/10',
      'hover:shadow-[0_0_25px',
    ]
    for (const sig of glassSignatures) {
      expect(btn.className).not.toContain(sig)
    }
  })

  it('shows "All clear" when activeCount is 0', () => {
    render(
      <ProtectThreatPosture
        activeCount={0}
        highCount={0}
        mediumCount={0}
        lowCount={0}
        resolvedCount={5}
        fpRate="0.01%"
        modelUpdate="2d ago"
        topAlert={null}
        onOpenTopAlert={null}
      />,
    )
    expect(screen.getByText(/All clear/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /review top alert/i })).not.toBeInTheDocument()
  })
})

/* ═══════════════════════════════════════════════════════
   LOGIC TESTS
   ═══════════════════════════════════════════════════════ */

describe('pickTopAlert', () => {
  const threats = THREATS.map(t => ({
    id: t.id,
    severity: t.severity,
    confidence: t.confidence,
  }))

  it('returns the Critical alert when one exists', () => {
    const result = pickTopAlert(threats)
    expect(result).not.toBeNull()
    expect(result!.severity).toBe('Critical')
    expect(result!.id).toBe('THR-001')
  })

  it('picks highest severity when no Critical exists', () => {
    const nonCritical = threats.filter(t => t.severity !== 'Critical')
    const result = pickTopAlert(nonCritical)
    expect(result).not.toBeNull()
    expect(result!.severity).toBe('High')
    expect(result!.id).toBe('THR-002')
  })

  it('breaks ties by confidence descending', () => {
    const tied = [
      { id: 'A', severity: 'Medium' as ThreatSeverity, confidence: 0.5 },
      { id: 'B', severity: 'Medium' as ThreatSeverity, confidence: 0.9 },
    ]
    const result = pickTopAlert(tied)
    expect(result!.id).toBe('B')
  })

  it('breaks confidence ties by id ascending', () => {
    const tied = [
      { id: 'B', severity: 'High' as ThreatSeverity, confidence: 0.85 },
      { id: 'A', severity: 'High' as ThreatSeverity, confidence: 0.85 },
    ]
    const result = pickTopAlert(tied)
    expect(result!.id).toBe('A')
  })

  it('returns null for empty array', () => {
    expect(pickTopAlert([])).toBeNull()
  })
})
