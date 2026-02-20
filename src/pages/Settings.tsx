import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from '@/router';
import {
  Settings,
  User,
  Bell,
  Shield,
  Scale,
  Monitor } from
"lucide-react";
import { GOVERNANCE_META } from '@/lib/governance-meta';
import { AuroraPulse, GovernFooter } from '@/components/poseidon';
import { fadeUp, staggerContainer } from '@/lib/motion-presets';
import { Button, ButtonLink, Toggle, Surface } from '@/design-system';

/* ── Toggle component ── */
function SettingToggle({
  label,
  desc,
  defaultOn = true




}: {label: string;desc: string;defaultOn?: boolean;}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-start justify-between gap-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div>
        <p className="text-sm font-medium" style={{ color: "#F1F5F9" }}>{label}</p>
        <p className="text-xs" style={{ color: "#94A3B8" }}>{desc}</p>
      </div>
      <Toggle checked={on} onChange={setOn} ariaLabel={label} />
    </div>);

}

export default function SettingsPage() {
  return (
    <div className="relative">
      <AuroraPulse engine="dashboard" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: "var(--engine-dashboard)", color: 'var(--bg-oled)' }}>
        
        Skip to main content
      </a>

      <motion.main
        id="main-content"
        className="command-center__main"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}>
        
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
          <Surface variants={fadeUp} className="flex-1 rounded-2xl p-5" variant="glass" padding="none" as={motion.div}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl"
                style={{ background: "rgba(0,240,255,0.08)" }}>
                
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
                <span className="text-sm font-medium" style={{ color: "#F1F5F9" }}>Shinji Fujiwara</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "#94A3B8" }}>Email</span>
                <span className="text-sm font-medium" style={{ color: "#F1F5F9" }}>shinji@example.com</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "#94A3B8" }}>Plan</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(0,240,255,0.1)", color: "var(--engine-dashboard)" }}>Pro</span>
              </div>
            </div>
          </Surface>

          {/* Notification preferences */}
          <Surface variants={fadeUp} className="flex-1 rounded-2xl p-5" variant="glass" padding="none" as={motion.div}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl"
                style={{ background: "rgba(234,179,8,0.08)" }}>
                
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
          </Surface>
        </div>

        {/* Security section */}
        <motion.section variants={fadeUp} className="px-4 md:px-6 lg:px-8">
          <Surface className="rounded-2xl p-5" variant="glass" padding="none">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl"
                style={{ background: "rgba(34,197,94,0.08)" }}>
                
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
                <Button
                  variant="glass"
                  engine="dashboard"
                  size="sm"
                  className="rounded-lg text-xs">
                  
                  Export
                </Button>
              </div>
            </div>
          </Surface>
        </motion.section>

        {/* ── P3: Review action bar ── */}
        <motion.section variants={fadeUp} className="px-4 md:px-6 lg:px-8">
          <Surface className="rounded-2xl p-5 flex items-center justify-between" variant="glass" padding="none">
            <p className="text-sm" style={{ color: "#94A3B8" }}>
              All settings changes are recorded in the audit ledger.
            </p>
            {/* CTA: Primary -> /settings (self) */}
            <ButtonLink
              to="/settings"
              variant="glass"
              engine="dashboard"
              size="md"
              className="rounded-xl">
              
              Review settings controls
            </ButtonLink>
          </Surface>
        </motion.section>

        {/* GovernFooter */}
        <div className="px-4 md:px-6 lg:px-8">
          <GovernFooter
            auditId={GOVERNANCE_META['/settings'].auditId}
            pageContext={GOVERNANCE_META['/settings'].pageContext} />
          
        </div>
      </motion.main>
    </div>);

}