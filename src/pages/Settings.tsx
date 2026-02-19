import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from '@/router'
import {
  Settings,
  User,
  Bell,
  Shield,
  Scale,
  Monitor,
} from "lucide-react"
import { GOVERNANCE_META } from '@/lib/governance-meta'

/* ── Motion presets ── */
const spring = { type: "spring" as const, stiffness: 380, damping: 30 }
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: spring },
}
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

/* ── AuroraPulse ── */
function AuroraPulse({ color }: { color: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
      style={{
        background: `radial-gradient(70% 50% at 50% 0%, ${color}0F, transparent), radial-gradient(40% 40% at 80% 20%, ${color}08, transparent)`,
        animation: "aurora-drift 8s ease-in-out infinite alternate",
      }}
    />
  )
}

/* ── GovernFooter ── */
function GovernFooter({ auditId, pageContext }: { auditId: string; pageContext: string }) {
  return (
    <footer
      className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-2xl border border-white/[0.06] px-4 py-3 md:px-6 md:py-4"
      style={{ background: "rgba(255,255,255,0.03)" }}
      role="contentinfo"
      aria-label="Governance verification footer"
    >
      <div className="flex items-center gap-3">
        <Scale size={14} style={{ color: "var(--engine-govern)" }} />
        <span className="text-xs" style={{ color: "#94A3B8" }}>
          Every decision on this page is logged to the immutable audit ledger.
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "#64748B" }}>
          {auditId}
        </span>
        <Link
          to="/govern/audit"
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: "var(--engine-govern)" }}
        >
          Open ledger
        </Link>
      </div>
    </footer>
  )
}

/* ── Toggle component ── */
function SettingToggle({
  label,
  desc,
  defaultOn = true,
}: {
  label: string
  desc: string
  defaultOn?: boolean
}) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div className="flex items-start justify-between gap-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div>
        <p className="text-sm font-medium" style={{ color: "#F1F5F9" }}>{label}</p>
        <p className="text-xs" style={{ color: "#94A3B8" }}>{desc}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className="relative w-11 h-6 rounded-full flex-shrink-0 transition-colors"
        style={{ background: on ? "var(--engine-dashboard)" : "rgba(255,255,255,0.1)" }}
        role="switch"
        aria-checked={on}
        aria-label={label}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
          style={{
            background: "#0B1221",
            left: on ? "calc(100% - 22px)" : "2px",
          }}
        />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <div className="relative">
      <AuroraPulse color="var(--engine-dashboard)" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: "var(--engine-dashboard)", color: "#0B1221" }}
      >
        Skip to main content
      </a>

      <motion.main
        id="main-content"
        className="command-center__main"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* ── P1: Settings Summary ── */}
        <motion.section variants={staggerContainer} className="hero-section">
          <motion.div variants={fadeUp} className="hero-kicker">
            <span className="hero-kicker__icon"><Settings size={14} /></span>
            Settings
          </motion.div>

          <motion.h1 variants={fadeUp} className="hero-headline">
            Control your{" "}
            <span style={{ color: "var(--engine-dashboard)" }}>experience</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="hero-subline">
            Manage your profile, notifications, and security preferences. All changes are logged.
          </motion.p>
        </motion.section>

        {/* ── P2: Control Cards ── */}
        <div className="flex flex-col lg:flex-row gap-4 px-4 md:px-6 lg:px-8">
          {/* Profile card */}
          <motion.div variants={fadeUp} className="flex-1 glass-surface rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl"
                style={{ background: "rgba(0,240,255,0.08)" }}
              >
                <User size={20} style={{ color: "var(--engine-dashboard)" }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>Profile</p>
                <p className="text-xs" style={{ color: "#64748B" }}>Account details</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "#94A3B8" }}>Name</span>
                <span className="text-sm font-medium" style={{ color: "#F1F5F9" }}>Jane Doe</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "#94A3B8" }}>Email</span>
                <span className="text-sm font-medium" style={{ color: "#F1F5F9" }}>jane@example.com</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "#94A3B8" }}>Plan</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(0,240,255,0.1)", color: "var(--engine-dashboard)" }}>Pro</span>
              </div>
            </div>
          </motion.div>

          {/* Notification preferences */}
          <motion.div variants={fadeUp} className="flex-1 glass-surface rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl"
                style={{ background: "rgba(234,179,8,0.08)" }}
              >
                <Bell size={20} style={{ color: "var(--engine-execute)" }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>Notifications</p>
                <p className="text-xs" style={{ color: "#64748B" }}>Alert preferences</p>
              </div>
            </div>
            <SettingToggle label="Threat alerts" desc="Immediate notification for critical threats" defaultOn={true} />
            <SettingToggle label="Weekly digest" desc="Summary of activity and recommendations" defaultOn={true} />
            <SettingToggle label="Execution alerts" desc="Notify when actions are auto-queued" defaultOn={false} />
          </motion.div>
        </div>

        {/* Security section */}
        <motion.section variants={fadeUp} className="px-4 md:px-6 lg:px-8">
          <div className="glass-surface rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl"
                style={{ background: "rgba(34,197,94,0.08)" }}
              >
                <Shield size={20} style={{ color: "var(--engine-protect)" }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>Security</p>
                <p className="text-xs" style={{ color: "#64748B" }}>Authentication and access controls</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: "#F1F5F9" }}>Two-factor authentication</p>
                  <p className="text-xs" style={{ color: "#94A3B8" }}>Add an extra layer of security</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.1)", color: "var(--state-healthy)" }}>
                  Enabled
                </span>
              </div>
              <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: "#F1F5F9" }}>Active sessions</p>
                  <p className="text-xs" style={{ color: "#94A3B8" }}>Manage your logged-in devices</p>
                </div>
                <span className="text-sm font-mono" style={{ color: "#F1F5F9" }}>2 devices</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium" style={{ color: "#F1F5F9" }}>Data export</p>
                  <p className="text-xs" style={{ color: "#94A3B8" }}>Download all your data</p>
                </div>
                <button
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.06)", color: "#CBD5E1" }}
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── P3: Review action bar ── */}
        <motion.section variants={fadeUp} className="px-4 md:px-6 lg:px-8">
          <div className="glass-surface rounded-2xl p-5 flex items-center justify-between">
            <p className="text-sm" style={{ color: "#94A3B8" }}>
              All settings changes are recorded in the audit ledger.
            </p>
            {/* CTA: Primary -> /settings (self) */}
            <Link
              to="/settings"
              className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl"
              style={{
                background: "linear-gradient(135deg, #14B8A6, #06B6D4)",
                color: "#0B1221",
              }}
            >
              Review settings controls
            </Link>
          </div>
        </motion.section>

        {/* GovernFooter */}
        <div className="px-4 md:px-6 lg:px-8">
          <GovernFooter
            auditId={GOVERNANCE_META['/settings'].auditId}
            pageContext={GOVERNANCE_META['/settings'].pageContext}
          />
        </div>
      </motion.main>
    </div>
  )
}
