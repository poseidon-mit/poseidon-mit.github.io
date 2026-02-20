import { motion } from 'framer-motion'
import {
  Shield,
  ShieldCheck,
  Lock,
  Eye,
  Brain,
  ScrollText,
  UserCheck,
  CheckCircle,
  FileText,
  ArrowRight,
} from 'lucide-react'
import { Link } from '@/router'
import { fadeUp, staggerContainer as stagger } from '@/lib/motion-presets'
import { DEMO_THREAD } from '@/lib/demo-thread'
import { Surface } from '@/design-system'
import { usePageTitle } from '@/hooks/use-page-title'

const snapshotStats = [
  {
    label: 'System confidence',
    value: DEMO_THREAD.systemConfidence.toFixed(2),
    spark: [0.88, 0.89, 0.9, 0.91, 0.91, 0.92, DEMO_THREAD.systemConfidence],
  },
  {
    label: 'Decisions audited',
    value: DEMO_THREAD.decisionsAudited.toLocaleString(),
    spark: [900, 980, 1050, 1120, 1180, 1210, DEMO_THREAD.decisionsAudited],
  },
  {
    label: 'Uptime snapshot',
    value: '99.97%',
    spark: [99.95, 99.96, 99.96, 99.97, 99.97, 99.97, 99.97],
  },
  {
    label: 'Response snapshot',
    value: '<200ms',
    spark: [220, 210, 200, 195, 190, 195, 190],
  },
]

const shapFactors = [
  { name: 'Velocity anomaly', weight: 0.42 },
  { name: 'Geo mismatch', weight: 0.31 },
  { name: 'Amount pattern', weight: 0.18 },
]

export function TrustSecurity() {
  usePageTitle('Trust')

  return (
    <div className="app-bg-oled min-h-screen w-full">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-[var(--engine-protect)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950"
      >
        Skip to main content
      </a>

      <nav className="glass-header border-b border-white/[0.06]">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" style={{ color: 'var(--engine-dashboard)' }} />
            <span className="text-base font-bold text-white">Poseidon.AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-white/60 hover:text-white/80 transition-colors">
              Sign in
            </Link>
            <Link
              to="/signup"
              className="rounded-xl bg-[var(--engine-protect)] px-4 py-2 text-xs font-semibold text-slate-950 transition-opacity hover:opacity-90"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <motion.div
        id="main-content"
        role="main"
        className="mx-auto flex flex-col gap-8 md:gap-12 px-4 py-10 md:px-6 md:py-16 lg:px-8"
        style={{ maxWidth: '1280px' }}
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp} className="text-center flex flex-col items-center gap-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(34,197,94,0.1)', boxShadow: '0 0 40px rgba(34,197,94,0.2)' }}
          >
            <Shield className="h-10 w-10" style={{ color: 'var(--engine-protect)' }} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--engine-protect)' }}>
            Security First
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white text-balance">Trusted by design, not by chance</h1>
          <p className="text-sm text-slate-400 max-w-lg text-pretty">
            Every decision auditable. Every byte encrypted. Zero trust architecture.
          </p>
          <p className="text-xs text-cyan-300/90">Metrics below are demo snapshots generated from simulated data.</p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {['GDPR', 'CCPA', 'SOC 2 Type II in progress'].map((badge) => (
              <span
                key={badge}
                className="text-xs font-semibold px-3 py-1 rounded-full border"
                style={{ borderColor: 'var(--engine-protect)', color: 'var(--engine-protect)' }}
              >
                {badge}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-3">Demo snapshot metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {snapshotStats.map((stat) => (
              <Surface key={stat.label} className="rounded-2xl" variant="glass" padding="md">
                <p className="text-xs text-white/40 mb-1">{stat.label}</p>
                <p className="text-lg font-bold" style={{ color: 'var(--engine-protect)' }}>
                  {stat.value}
                </p>
                <div className="flex items-end gap-0.5 h-6 mt-2" aria-hidden="true">
                  {stat.spark.map((value, index) => {
                    const max = Math.max(...stat.spark)
                    const min = Math.min(...stat.spark)
                    const range = max - min || 1
                    const h = 8 + ((value - min) / range) * 16
                    return (
                      <div
                        key={`${stat.label}-${index}`}
                        className="flex-1 rounded-sm"
                        style={{
                          height: `${h}px`,
                          background: 'var(--engine-protect)',
                          opacity: 0.4 + (index / stat.spark.length) * 0.6,
                        }}
                      />
                    )
                  })}
                </div>
              </Surface>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Lock,
              color: 'var(--engine-protect)',
              title: 'Encrypted in transit & at rest',
              desc: 'AES-256 encryption at rest. TLS 1.3 for all data in transit. Keys rotated automatically.',
            },
            {
              icon: Eye,
              color: 'var(--engine-govern)',
              title: 'Read-only data access',
              desc: 'We see, never touch. Read-only connections to your financial accounts. No write permissions ever.',
            },
            {
              icon: ShieldCheck,
              color: 'var(--engine-grow)',
              title: 'Zero-knowledge architecture',
              desc: 'OAuth 2.0 authentication. No credentials stored. Your secrets remain yours.',
            },
          ].map((pillar) => (
            <Surface key={pillar.title} className="rounded-2xl" variant="glass" padding="md">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ background: `${pillar.color}15` }}
              >
                <pillar.icon className="h-6 w-6" style={{ color: pillar.color }} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">{pillar.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
            </Surface>
          ))}
        </motion.div>

        <motion.div variants={fadeUp}>
          <h2 className="text-xl font-bold text-white mb-6 text-center">Every AI decision explained</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: 'SHAP attribution',
                desc: 'See which factors drove each decision with quantified feature importance.',
              },
              {
                icon: ScrollText,
                title: 'Audit trail',
                desc: 'Every decision timestamped, versioned, and traceable to its source model.',
              },
              {
                icon: UserCheck,
                title: 'Human override',
                desc: 'Override any AI decision at any time. Your judgment always takes priority.',
              },
            ].map((column) => (
              <Surface key={column.title} className="rounded-2xl text-center" variant="glass" padding="md">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(34,197,94,0.15)' }}>
                  <column.icon className="h-5 w-5" style={{ color: 'var(--engine-protect)' }} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{column.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{column.desc}</p>
                {column.title === 'SHAP attribution' ? (
                  <div className="flex flex-col gap-1.5 mt-3">
                    {shapFactors.map((factor) => (
                      <div key={factor.name} className="flex items-center gap-2">
                        <span className="text-[10px] text-white/40 w-24 text-left truncate">{factor.name}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/10">
                          <div className="h-full rounded-full" style={{ width: `${factor.weight * 100}%`, background: 'var(--engine-protect)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
                {column.title === 'Audit trail' ? (
                  <div className="flex flex-col gap-2 mt-3 text-left">
                    {['Decision logged', 'Evidence recorded', 'Trail sealed'].map((entry) => (
                      <div key={entry} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--engine-protect)' }} />
                        <span className="text-[10px] text-white/40">{entry}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </Surface>
            ))}
          </div>
        </motion.div>

        <Surface variants={fadeUp} className="rounded-2xl max-w-2xl mx-auto w-full" variant="glass" padding="md" as={motion.div}>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-4 w-4 text-white/30" />
            <span className="text-xs text-white/30 uppercase tracking-wider">Audit Record Format (Demo example)</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="text-xs font-mono px-2 py-0.5 rounded"
              style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--engine-govern)' }}
            >
              GV-2026-0216-001
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Protect</span>
          </div>
          <p className="text-sm text-white font-medium mb-2">
            {`Blocked suspicious transaction $${DEMO_THREAD.criticalAlert.amount.toLocaleString()}`}
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-white/40 mb-3">
            <span>
              Confidence: <span className="text-white/70 font-semibold">{DEMO_THREAD.criticalAlert.confidence.toFixed(2)}</span>
            </span>
            <span>Feb 16, 2026 14:28</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {shapFactors.map((factor) => (
              <span key={factor.name} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40">
                {factor.name} ({(factor.weight * 100).toFixed(0)}%)
              </span>
            ))}
          </div>
        </Surface>

        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            {[
              { badge: 'GDPR', label: 'General Data Protection Regulation' },
              { badge: 'CCPA', label: 'California Consumer Privacy Act' },
              { badge: 'ISO 27001', label: 'Information Security Management' },
              { badge: 'SOC 2 Type II in progress', label: 'Service Organization Controls' },
            ].map((item) => (
              <div key={item.badge} className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-white/70">{item.badge}</span>
                <span className="text-xs text-white/40">{item.label}</span>
              </div>
            ))}
          </div>
          <Surface className="rounded-2xl" variant="glass" padding="md">
            <p className="text-sm text-white/60 leading-relaxed">
              Poseidon.AI is built with a security-first, defense-in-depth architecture. Every data access is logged,
              every AI decision is explained, and every user action is auditable. This demo uses simulated data to
              demonstrate end-to-end governance behavior.
            </p>
          </Surface>
        </motion.div>

        <motion.div variants={fadeUp} className="text-center flex flex-col items-center gap-4 py-8">
          <div className="flex gap-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-6 py-3 rounded-xl text-sm font-semibold text-slate-950 hover:opacity-90 transition-opacity"
              style={{ background: 'var(--engine-protect)' }}
            >
              Open demo dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="/CTO-Group7-Poseidon.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl text-sm font-semibold border border-white/10 text-white/70 hover:bg-white/5 transition-colors"
            >
              Read security whitepaper
            </a>
          </div>
        </motion.div>

        <motion.footer variants={fadeUp} className="text-center text-xs text-white/20 py-4 border-t border-white/[0.06]">
          &copy; 2026 Poseidon.AI &middot; MIT Sloan CTO Program &middot; Privacy &middot; Terms
        </motion.footer>
      </motion.div>
    </div>
  )
}

export default TrustSecurity
