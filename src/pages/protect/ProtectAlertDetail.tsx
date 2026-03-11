import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, Link } from '@/router'
import { SubPageNav } from '@/components/poseidon'
import { ShapWaterfall } from '@/components/poseidon/shap-waterfall'
import {
  AlertTriangle,
  MapPin,
  CreditCard,
  Globe,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  CircleDot,
  Upload,
  Zap,
  Copy,
  Check,
  ShieldCheck,
  ArrowLeft,
  Shield,
  Clock,
} from "lucide-react"
import { formatConfidence, formatDemoTimestamp } from '@/lib/demo-date'
import { getMotionPreset, accordionVariants, accordionTransition } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { usePageTitle } from '@/hooks/use-page-title'
import { useToastContext } from '@/components/providers/ToastProvider'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { selectThreatFactors, selectThreatTiming } from '@/domain/poseidon-universe'
import {
  THREATS,
  deriveFactors,
} from './protect-data'
import type { DerivedFactor, ThreatSeverity } from './protect-data'
import { useDismissedAlerts } from './useDismissedAlerts'

/* ── Severity config for light theme ── */

const severityBadgeConfig: Record<ThreatSeverity, { bg: string; text: string; border: string; iconBg: string; iconColor: string }> = {
  Critical: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', iconBg: 'bg-red-100', iconColor: 'text-red-600' },
  High: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', iconBg: 'bg-red-100', iconColor: 'text-red-600' },
  Medium: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
  Low: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
}

function getRiskLevel(confidence: number): { label: string; color: string; bg: string; ring: string } {
  if (confidence >= 0.7) return { label: 'High Risk', color: 'text-red-600', bg: 'bg-red-100', ring: 'border-red-300' }
  if (confidence >= 0.4) return { label: 'Medium Risk', color: 'text-amber-600', bg: 'bg-amber-100', ring: 'border-amber-300' }
  return { label: 'Low Risk', color: 'text-green-600', bg: 'bg-green-100', ring: 'border-green-300' }
}

/* ═══════════════════════════════════════════════════════
   PROTECT ALERT DETAIL PAGE — Light Theme
   ═══════════════════════════════════════════════════════ */

export default function ProtectAlertDetailPage() {
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  usePageTitle('Alert Detail')
  const { search, navigate } = useRouter()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [disputeState, setDisputeState] = useState<'idle' | 'drafting' | 'submitted' | 'neutralized'>('idle')
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const toggleCard = (id: string) => setExpandedCards(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })
  const [copied, setCopied] = useState(false)

  const { showToast } = useToastContext()
  const [actionTaken, setActionTaken] = useState<'blocked' | 'confirmed' | null>(null)

  const { dismiss } = useDismissedAlerts()

  const alert = useMemo(() => {
    const alertId = new URLSearchParams(search).get('alertId')
    return THREATS.find(t => t.id === alertId) ?? null
  }, [search])

  useEffect(() => {
    if (!alert) navigate('/protect/threats')
  }, [alert, navigate])

  if (!alert) return null

  const sevConfig = severityBadgeConfig[alert.severity]
  const riskLevel = getRiskLevel(alert.confidence)

  const factors = useMemo(() => {
    const items = selectThreatFactors(alert.id)
    return deriveFactors(items, alert.confidence)
  }, [alert.id, alert.confidence])

  const sortedFactors = useMemo(() => {
    const risk = factors.filter(f => !f.mitigating).sort((a, b) => b.value - a.value)
    const safe = factors.filter(f => f.mitigating).sort((a, b) => a.value - b.value)
    return [...risk, ...safe]
  }, [factors])

  const caseBrief = useMemo(() => {
    const topRisk = sortedFactors.filter(f => !f.mitigating).slice(0, 3)
    const findings = topRisk.map(f => {
      const first = f.details.split('. ')[0]
      return first.endsWith('.') ? first : `${first}.`
    })
    const t = selectThreatTiming(alert.id) || { detected: '' }
    const dateStr = t.detected ? new Date(t.detected).toISOString().replace('T', ' ').slice(0, 16) + ' UTC' : 'N/A'
    const caseId = `POS-DIS-${alert.id.replace('THR-', '')}`
    const text = [
      `CASE BRIEF — ${alert.id}`,
      '',
      `Transaction    ${alert.amount} · ${alert.counterparty}`,
      `Date           ${dateStr}`,
      ...(alert.account ? [`Account        ${alert.account}`] : []),
      `AI Confidence  ${formatConfidence(alert.confidence)} (${alert.severity})`,
      '',
      'Key Findings',
      ...findings.map(f => `· ${f}`),
      '',
      `Reference      ${caseId}`,
    ].join('\n')
    return { findings, dateStr, caseId, text }
  }, [alert, sortedFactors])

  const handleCopyBrief = () => {
    navigator.clipboard.writeText(caseBrief.text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const timing = selectThreatTiming(alert.id)
  const detectedAt = timing ? formatDemoTimestamp(timing.detected) : null

  interface TimelineStep { label: string; time: string; status: "complete" | "active" }
  const timelineSteps: TimelineStep[] | null = timing ? [
    { label: "Threat detected", time: timing.times[0], status: "complete" },
    { label: "Analysis complete", time: timing.times[1], status: "complete" },
    { label: "Alert raised", time: timing.times[2], status: "complete" },
    { label: "User notified", time: timing.times[3], status: "complete" },
    { label: "Resolution pending", time: "Now", status: "active" },
  ] : null

  return (
    <>
      <SubPageNav engine="protect" parentPath="/protect/threats" parentLabel="Threats" currentLabel={`Alert #${alert.id}`} />

      <motion.main
        id="main-content"
        role="main"
        className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 pb-12 bg-[#F8F7F4] min-h-screen pt-6`}
        style={PAGE_CONTENT_STYLE}
        variants={staggerContainerVariant}
        initial="hidden"
        animate="visible"
      >

        {/* ── Alert Header ── */}
        <motion.div variants={fadeUpVariant}>
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${sevConfig.iconBg}`}>
                    <AlertTriangle className={`h-6 w-6 ${sevConfig.iconColor}`} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-xl font-bold text-gray-900">{alert.counterparty}</h1>
                      <Badge variant="outline" className={`${sevConfig.bg} ${sevConfig.text} ${sevConfig.border}`}>
                        {alert.severity} Risk
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{alert.description}</p>
                    {detectedAt && (
                      <p className="mt-1 text-xs text-gray-400">Detected: {detectedAt}</p>
                    )}
                    <p className="mt-1 text-lg font-bold font-mono text-gray-900">{alert.amount}</p>
                  </div>
                </div>

                {/* Action buttons — only in idle state */}
                {disputeState === 'idle' && (
                  <>
                    <div className="flex flex-col sm:flex-row gap-2 shrink-0 sticky bottom-0 z-50 bg-white/95 backdrop-blur-sm border-t border-border p-4 -mx-4 lg:static lg:bg-transparent lg:backdrop-blur-none lg:border-0 lg:p-0 lg:mx-0">
                      <Button
                        variant="outline"
                        disabled={actionTaken !== null}
                        onClick={() => {
                          setActionTaken('confirmed')
                          showToast({ message: 'Activity confirmed as yours', variant: 'success' })
                          dismiss(alert.id)
                        }}
                        className="gap-1"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {actionTaken === 'confirmed' ? '✓ Confirmed' : 'This was Me'}
                      </Button>
                      <Button
                        variant="destructive"
                        disabled={actionTaken !== null}
                        onClick={() => {
                          setActionTaken('blocked')
                          showToast({ message: 'Threat blocked and reported', variant: 'success' })
                          setDisputeState('drafting')
                        }}
                        className="gap-1"
                      >
                        <XCircle className="h-4 w-4" />
                        {actionTaken === 'blocked' ? '✓ Blocked' : 'Block & Report'}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Your response helps train our AI to better protect you</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Details + Risk Assessment Grid ── */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Alert Details Card */}
          <motion.div variants={fadeUpVariant}>
            <Card className="bg-white border-gray-200 shadow-sm h-full">
              <div
                className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => toggleCard('details')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCard('details') } }}
              >
                <h3 className="text-lg font-semibold text-gray-900">Alert Details</h3>
                <ChevronDown className={cn('h-5 w-5 text-gray-400 transition-transform', expandedCards.has('details') && 'rotate-180')} />
              </div>
              <AnimatePresence initial={false}>
                {expandedCards.has('details') && (
                  <motion.div
                    key="details-content"
                    variants={accordionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={accordionTransition}
                    style={{ overflow: 'hidden' }}
                  >
                    <CardContent className="space-y-4">
                      {alert.account && (
                        <DetailRow icon={<CreditCard className="h-4 w-4 text-gray-400" />} label="Account" value={alert.account} />
                      )}
                      <DetailRow icon={<AlertTriangle className="h-4 w-4 text-gray-400" />} label="Alert Type" value={alert.description} />
                      <DetailRow icon={<Shield className="h-4 w-4 text-gray-400" />} label="Amount" value={alert.amount} />
                      {alert.location && (
                        <DetailRow icon={<MapPin className="h-4 w-4 text-gray-400" />} label="Location" value={alert.location} />
                      )}
                      {alert.flaggedIp && (
                        <DetailRow icon={<Globe className="h-4 w-4 text-gray-400" />} label="IP Address" value={alert.flaggedIp} />
                      )}
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                          <Clock className="h-4 w-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">AI Confidence</p>
                          <Badge variant="outline" className={`${sevConfig.bg} ${sevConfig.text} ${sevConfig.border}`}>{formatConfidence(alert.confidence)}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Risk Assessment Card */}
          <motion.div variants={fadeUpVariant}>
            <Card className="bg-white border-gray-200 shadow-sm h-full">
              <div
                className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => toggleCard('risk')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCard('risk') } }}
              >
                <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
                <ChevronDown className={cn('h-5 w-5 text-gray-400 transition-transform', expandedCards.has('risk') && 'rotate-180')} />
              </div>
              <AnimatePresence initial={false}>
                {expandedCards.has('risk') && (
                  <motion.div
                    key="risk-content"
                    variants={accordionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={accordionTransition}
                    style={{ overflow: 'hidden' }}
                  >
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <div className={`flex h-20 w-20 items-center justify-center rounded-2xl ${riskLevel.bg}`}>
                        <AlertTriangle className={`h-10 w-10 ${riskLevel.color}`} />
                      </div>
                      <p className={`mt-4 text-2xl font-bold ${riskLevel.color}`}>{riskLevel.label}</p>
                      <p className="mt-1 text-sm text-gray-500 text-center max-w-xs">
                        7 risk factors detected
                      </p>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>

        {/* ── SHAP Waterfall Chart (dark card) ── */}
        <motion.div variants={fadeUpVariant}>
          <Card className="bg-white border-gray-200 shadow-sm">
            <div
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => toggleCard('drivers')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCard('drivers') } }}
            >
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-700">Why Poseidon Flagged This</h3>
                <p className="text-xs text-gray-500 tracking-wide mt-1">
                  Key factors behind this alert
                </p>
              </div>
              <ChevronDown className={cn('h-5 w-5 text-gray-400 transition-transform shrink-0', expandedCards.has('drivers') && 'rotate-180')} />
            </div>
            <AnimatePresence initial={false}>
              {expandedCards.has('drivers') && (
                <motion.div
                  key="drivers-content"
                  variants={accordionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={accordionTransition}
                  style={{ overflow: 'hidden' }}
                >
                  <CardContent className="p-6 lg:p-8 pt-0 lg:pt-0">
                    <ShapWaterfall
                      factors={factors.map(f => ({ name: f.title, value: f.value }))}
                      baseValue={0}
                    />
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* ── Recommended Actions / Dispute Workflow ── */}
        <motion.div variants={fadeUpVariant}>
          {disputeState === 'idle' && (
            <Card className="bg-white border-gray-200 shadow-sm">
              <div
                className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => toggleCard('actions')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCard('actions') } }}
              >
                <h3 className="text-lg font-semibold text-gray-900">Recommended Actions</h3>
                <ChevronDown className={cn('h-5 w-5 text-gray-400 transition-transform', expandedCards.has('actions') && 'rotate-180')} />
              </div>
              <AnimatePresence initial={false}>
                {expandedCards.has('actions') && (
                  <motion.div
                    key="actions-content"
                    variants={accordionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={accordionTransition}
                    style={{ overflow: 'hidden' }}
                  >
                    <CardContent className="space-y-3">
                      {/* If this was you */}
                      <div className="flex items-center justify-between gap-4 rounded-xl border border-green-200 bg-green-50 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">If this was you</p>
                            <p className="text-sm text-gray-500">Mark as recognized to improve AI accuracy</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0 border-green-600 text-green-600 hover:bg-green-50"
                          onClick={() => { dismiss(alert.id); navigate('/protect') }}
                        >
                          This was me
                        </Button>
                      </div>

                      {/* If this was NOT you */}
                      <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                            <XCircle className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">If this was NOT you</p>
                            <p className="text-sm text-gray-500">Secure your account immediately</p>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="shrink-0"
                          onClick={() => setDisputeState('drafting')}
                        >
                          Secure Account
                        </Button>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          )}

          {/* Drafting state — dark card for case brief */}
          {disputeState === 'drafting' && (
            <Card className="bg-white border-amber-200 shadow-sm">
              <CardContent className="p-6 lg:p-8">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-700 border-b border-gray-200 pb-4">Case Brief</h3>
              <div className="flex flex-col lg:flex-row gap-6 mt-4">
                <div className="flex-1 flex flex-col gap-4">
                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-5 font-mono text-xs leading-relaxed">
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-gray-700">
                      <span className="text-gray-500">Transaction</span>
                      <span><span className="text-red-600 font-bold">{alert.amount}</span>{' · '}<span className="text-gray-900 font-bold">{alert.counterparty}</span></span>
                      <span className="text-gray-500">Date</span>
                      <span className="text-gray-700">{caseBrief.dateStr}</span>
                      {alert.account && <><span className="text-gray-500">Account</span><span className="text-gray-700">{alert.account}</span></>}
                      <span className="text-gray-500">AI Confidence</span>
                      <Badge variant="outline" className={`${sevConfig.bg} ${sevConfig.text} ${sevConfig.border}`}>{formatConfidence(alert.confidence)}</Badge>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <p className="text-[10px] uppercase tracking-widest text-amber-600 font-semibold mb-2">Key Findings</p>
                      <ul className="flex flex-col gap-1.5">
                        {caseBrief.findings.map((f, i) => (
                          <li key={i} className="text-gray-700 flex gap-2">
                            <span className="text-amber-600 shrink-0">·</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
                      <span className="text-gray-500">Reference <span className="text-gray-900 font-bold">{caseBrief.caseId}</span></span>
                      <button
                        onClick={handleCopyBrief}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-widest transition-all border border-gray-300 hover:border-amber-400 hover:bg-amber-50 text-gray-500 hover:text-gray-700"
                      >
                        {copied ? <><Check size={12} className="text-emerald-400" />Copied</> : <><Copy size={12} />Copy to clipboard</>}
                      </button>
                    </div>
                  </div>
                  <div className="rounded-xl border border-dashed border-amber-300 hover:border-amber-400 cursor-pointer p-4 text-center bg-amber-50 hover:bg-amber-100 transition-colors group">
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-gray-600 mx-auto mb-2 transition-colors" />
                    <p className="text-xs font-medium tracking-wide text-gray-700">Attach Supporting Documents</p>
                    <p className="text-[10px] text-gray-500 mt-1">Receipts, invoices, or correspondence</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 lg:justify-end lg:w-48 shrink-0">
                  <button
                    onClick={() => {
                      setDisputeState('submitted')
                      setTimeout(() => {
                        setDisputeState('neutralized')
                        window.dispatchEvent(new CustomEvent('poseidon:execute-approved', {
                          detail: { govId: caseBrief.caseId, actionId: alert.id, actionTitle: `Dispute filed: ${alert.counterparty} ${alert.amount}` }
                        }))
                      }, 2000)
                    }}
                    className={cn(buttonVariants({ variant: "default" }), "w-full rounded-xl py-3 bg-amber-500 hover:bg-amber-400 border-none text-black font-bold tracking-wide flex items-center justify-center gap-2 transition-all")}
                  >
                    <Zap size={16} />Email to Bank
                  </button>
                  <button
                    onClick={() => setDisputeState('idle')}
                    className={cn(buttonVariants({ variant: "ghost" }), "w-full rounded-xl py-3 border border-gray-300 hover:bg-gray-100 text-gray-600 font-medium")}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              </CardContent>
            </Card>
          )}

          {/* Submitted state */}
          {disputeState === 'submitted' && (
            <Card className="border-emerald-200 bg-emerald-50 shadow-sm">
              <CardContent className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 text-center sm:text-left">
                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                    <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Dispute Filed</h3>
                    <p className="text-sm text-gray-600">
                      Case <span className="font-mono text-emerald-700 font-bold bg-emerald-100 px-1 rounded border border-emerald-200">{caseBrief.caseId}</span> sent to your bank.
                    </p>
                  </div>
                </div>
                <div className="bg-white border border-emerald-200 rounded-xl p-3 flex-1 text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Next Step</p>
                  <p className="text-sm font-medium text-emerald-700">Your bank will review within 10 business days (Reg E). Provisional credit may apply within 48h.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Neutralized state */}
          {disputeState === 'neutralized' && (
            <motion.div
              initial={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <Card className="border-emerald-200 bg-emerald-50 shadow-sm">
                <CardContent className="flex flex-col items-center gap-4 text-center py-8">
                  <motion.div
                    initial={prefersReducedMotion ? {} : { scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
                    className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center"
                  >
                    <ShieldCheck className="w-10 h-10 text-emerald-600" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900">Threat Neutralized</h3>
                  <p className="text-sm text-gray-500 max-w-md">
                    Your account has been secured. Dispute filed as case{' '}
                    <Link
                      to={`/govern/audit-detail?decision=${caseBrief.caseId}`}
                      className="font-mono text-emerald-700 font-bold underline underline-offset-2 hover:text-emerald-600 transition-colors"
                    >
                      {caseBrief.caseId}
                    </Link>.
                    Your bank will review within 10 business days.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* ── Evidence Analysis ── */}
        <motion.div variants={fadeUpVariant}>
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Evidence Analysis</CardTitle>
              <p className="text-sm text-gray-500">Why our AI flagged this transaction</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {sortedFactors.map(item => {
                const expanded = expandedId === item.id
                const displayValue = item.value >= 0 ? `+${item.value.toFixed(2)}` : item.value.toFixed(2)
                const isRisk = !item.mitigating
                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-gray-200 bg-gray-50 transition-all hover:bg-gray-100 cursor-pointer"
                    onClick={() => setExpandedId(expanded ? null : item.id)}
                  >
                    <div className="flex items-center justify-between px-4 py-3" aria-expanded={expanded}>
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            'inline-flex items-center justify-center rounded-lg text-xs font-bold font-mono tabular-nums px-2 py-1',
                            isRisk ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          )}
                        >
                          {displayValue}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{item.title}</span>
                      </div>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center border border-gray-200 bg-white">
                        {expanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                      </div>
                    </div>
                    <AnimatePresence>
                      {expanded && (
                        <motion.div variants={accordionVariants} initial="hidden" animate="visible" exit="exit" transition={accordionTransition} className="overflow-hidden">
                          <div className="px-4 pb-3 mx-4 pt-2 border-t border-gray-200">
                            <p className="text-sm leading-relaxed text-gray-600">{item.details}</p>
                            {item.model && <span className="text-xs font-mono text-gray-400 uppercase tracking-widest mt-1 block">Model: {item.model}</span>}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Timeline ── */}
        {timelineSteps && (
          <motion.div variants={fadeUpVariant}>
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-0" role="list" aria-label="Alert timeline">
                  {timelineSteps.map((step, i) => (
                    <div key={step.label} className="flex items-start gap-4" role="listitem">
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            'flex items-center justify-center rounded-full shrink-0 border',
                            step.status === 'complete'
                              ? 'bg-emerald-100 border-emerald-200'
                              : 'bg-amber-100 border-amber-200',
                            step.status === 'active' && 'animate-pulse'
                          )}
                          style={{ width: 28, height: 28 }}
                        >
                          {step.status === 'complete'
                            ? <CheckCircle2 size={14} className="text-emerald-600" />
                            : <CircleDot size={14} className="text-amber-600" />
                          }
                        </div>
                        {i < timelineSteps.length - 1 && (
                          <div className="w-px h-8 bg-gray-200" aria-hidden="true" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 pb-6 mt-1">
                        <span className="text-sm font-medium text-gray-900">{step.label}</span>
                        <span className="text-xs font-mono text-gray-400">{step.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

      </motion.main>
    </>
  )
}

/* ── Detail Row helper ── */

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  )
}
