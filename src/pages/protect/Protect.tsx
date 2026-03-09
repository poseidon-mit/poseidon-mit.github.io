import { useMemo } from "react"
import { motion } from "framer-motion"
import { useRouter } from '@/router'
import { ShieldCheck } from "lucide-react"
import { EngineBadge } from '@/components/poseidon'
import { ProtectAnomalyRadar, ProtectThreatPosture } from '@/components/poseidon/protect-hero'
import { selectAlertAuditChain, selectThreatFactors } from '@/domain/poseidon-universe'
import { getMotionPreset } from '@/lib/motion-presets'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { THREATS, severityConfig, deriveFactors } from './protect-data'
import type { ThreatSeverity } from './protect-data'
import { useDismissedAlerts } from './useDismissedAlerts'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'

/* ── Helpers ── */
type Pickable = { id: string; severity: ThreatSeverity; confidence: number }

/** Deterministic top-alert selection: severity desc → confidence desc → id asc. */
export function pickTopAlert<T extends Pickable>(threats: T[]): T | null {
  if (threats.length === 0) return null
  return threats.reduce((best, t) => {
    const orderCmp = severityConfig[t.severity].order - severityConfig[best.severity].order
    if (orderCmp !== 0) return orderCmp > 0 ? t : best
    const confCmp = t.confidence - best.confidence
    if (confCmp !== 0) return confCmp > 0 ? t : best
    return t.id < best.id ? t : best
  })
}

/* ═══════════════════════════════════════════════════════
   PROTECT PAGE
   ═══════════════════════════════════════════════════════ */

export default function ProtectPage() {
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  const { navigate } = useRouter()
  usePageTitle('Protect')

  const { dismissed } = useDismissedAlerts()
  const activeThreats = useMemo(() => THREATS.filter(t => !dismissed.has(t.id)), [dismissed])

  const highCount = activeThreats.filter((t) => t.severity === "High").length

  /* ── Hero data ── */
  const criticalAlert = useMemo(
    () => pickTopAlert(activeThreats.filter(t => t.severity === 'Critical')),
    [activeThreats],
  )

  // Radar axes: derived contribution values on fixed 0-0.30 scale
  const radarAxes = useMemo(() => {
    if (!criticalAlert) return []
    const items = selectThreatFactors(criticalAlert.id)
    if (items.length === 0) return []
    const derived = deriveFactors(items, criticalAlert.confidence)
    return derived
      .filter(f => !f.mitigating)
      .map(f => ({
        label: f.title.replace('Unusual ', '').replace('Known ', ''),
        value: f.value,
        maxValue: 0.30,
        color: f.value >= 0.20 ? 'var(--state-critical)' : 'var(--state-warning)',
      }))
  }, [criticalAlert])

  // Evidence cues from authored heroCue field
  const evidenceCues = useMemo(() => {
    if (!criticalAlert) return []
    const items = selectThreatFactors(criticalAlert.id)
    if (items.length === 0) return []
    return items
      .filter(i => !i.mitigating && i.heroCue)
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3)
      .map(i => i.heroCue!)
  }, [criticalAlert])

  // Audit chain from canonical relations (strict: null if ambiguous)
  const auditChain = useMemo(
    () => criticalAlert ? selectAlertAuditChain(criticalAlert.id) : null,
    [criticalAlert],
  )

  const topAlert = useMemo(() => pickTopAlert(activeThreats), [activeThreats])

  const totalExposure = useMemo(
    () => activeThreats.reduce((sum, t) => sum + t.numericAmount, 0),
    [activeThreats],
  )

  return (
    <>

      <motion.div id="main-content" className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 md:gap-8`} style={PAGE_CONTENT_STYLE} variants={staggerContainerVariant} initial="hidden" animate="visible" role="main" aria-label="Protect - Threat Detection">

        {/* ── Hero ── */}
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6 mb-8">
          <motion.div variants={fadeUpVariant} className="flex items-center gap-2">
            <EngineBadge engine="protect" icon={ShieldCheck} label="Protection Active" />
          </motion.div>
          <h1 className="sr-only">Protect</h1>

          {criticalAlert ? (
            <motion.div variants={fadeUpVariant}>
              <ProtectAnomalyRadar
                alert={criticalAlert}
                radarAxes={radarAxes}
                evidenceCues={evidenceCues}
                auditChain={auditChain}
                remainingCount={activeThreats.length - 1}
                totalExposure={totalExposure}
                fpRate="0.01%"
                onReviewThreat={() => navigate(`/protect/alert-detail?alertId=${criticalAlert.id}`)}
              />
            </motion.div>
          ) : (
            <motion.div variants={fadeUpVariant}>
              <ProtectThreatPosture
                activeCount={activeThreats.length}
                highCount={highCount}
                mediumCount={activeThreats.filter(t => t.severity === 'Medium').length}
                lowCount={activeThreats.filter(t => t.severity === 'Low').length}
                resolvedCount={dismissed.size}
                fpRate="0.01%"
                modelUpdate="2d ago"
                topAlert={topAlert}
                onOpenTopAlert={topAlert ? () => navigate(`/protect/alert-detail?alertId=${topAlert.id}`) : null}
              />
            </motion.div>
          )}
        </motion.section>


      </motion.div>
    </>
  )
}
