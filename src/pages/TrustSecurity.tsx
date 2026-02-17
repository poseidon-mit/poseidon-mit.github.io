import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, Lock, Eye, Brain, ScrollText, UserCheck, CheckCircle, FileText, ArrowRight } from 'lucide-react';
import { Link } from '../router';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const liveStats = [
  { label: 'System confidence', value: '0.92', spark: [0.88, 0.89, 0.90, 0.91, 0.91, 0.92, 0.92] },
  { label: 'Decisions audited', value: '1,247', spark: [900, 980, 1050, 1120, 1180, 1210, 1247] },
  { label: 'Uptime', value: '99.97%', spark: [99.95, 99.96, 99.96, 99.97, 99.97, 99.97, 99.97] },
  { label: 'Response time', value: '<200ms', spark: [220, 210, 200, 195, 190, 195, 190] },
];

const shapFactors = [
  { name: 'Velocity anomaly', weight: 0.42 },
  { name: 'Geo mismatch', weight: 0.31 },
  { name: 'Amount pattern', weight: 0.18 },
];

export function TrustSecurity() {
  return (
    <div className="min-h-screen w-full" style={{ background: '#0B1221' }}>
      {/* Top nav */}
      <nav className="border-b border-white/[0.06]" style={{ background: 'rgba(11,18,33,0.8)' }}>
        <div className="mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center justify-between" style={{ maxWidth: '1280px' }}>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" style={{ color: '#00F0FF' }} />
            <span className="text-base font-bold text-white">Poseidon.AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-white/60 hover:text-white/80 transition-colors">Sign in</Link>
            <Link to="/signup" className="px-4 py-2 rounded-xl text-xs font-semibold text-[#0B1221] hover:opacity-90 transition-opacity" style={{ background: '#22C55E' }}>Get started</Link>
          </div>
        </div>
      </nav>

      <motion.div className="mx-auto flex flex-col gap-8 md:gap-12 px-4 py-10 md:px-6 md:py-16 lg:px-8" style={{ maxWidth: '1280px' }} variants={stagger} initial="hidden" animate="visible">
        {/* Hero */}
        <motion.div variants={fadeUp} className="text-center flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.1)', boxShadow: '0 0 40px rgba(34,197,94,0.2)' }}>
            <Shield className="h-10 w-10" style={{ color: '#22C55E' }} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#22C55E' }}>Security First</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white text-balance">Trusted by design, not by chance</h1>
          <p className="text-sm text-slate-400 max-w-lg text-pretty">Every decision auditable. Every byte encrypted. Zero trust architecture.</p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {['GDPR', 'CCPA', 'SOC 2 (Coming)'].map((b) => (
              <span key={b} className="text-xs font-semibold px-3 py-1 rounded-full border" style={{ borderColor: '#22C55E', color: '#22C55E' }}>{b}</span>
            ))}
          </div>
        </motion.div>

        {/* Live stats */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {liveStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <p className="text-xs text-white/40 mb-1">{stat.label}</p>
              <p className="text-lg font-bold" style={{ color: '#22C55E' }}>{stat.value}</p>
              <div className="flex items-end gap-0.5 h-6 mt-2">
                {stat.spark.map((v, i) => {
                  const max = Math.max(...stat.spark);
                  const min = Math.min(...stat.spark);
                  const range = max - min || 1;
                  const h = 8 + ((v - min) / range) * 16;
                  return <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}px`, background: '#22C55E', opacity: 0.4 + (i / stat.spark.length) * 0.6 }} />;
                })}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Security pillars */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Lock, color: '#22C55E', title: 'Encrypted in transit & at rest', desc: 'AES-256 encryption at rest. TLS 1.3 for all data in transit. Keys rotated automatically.' },
            { icon: Eye, color: '#3B82F6', title: 'Read-only data access', desc: 'We see, never touch. Read-only connections to your financial accounts. No write permissions ever.' },
            { icon: ShieldCheck, color: '#8B5CF6', title: 'Zero-knowledge architecture', desc: 'OAuth 2.0 authentication. No credentials stored. Your secrets remain yours.' },
          ].map((pillar) => (
            <div key={pillar.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: `${pillar.color}15` }}>
                <pillar.icon className="h-6 w-6" style={{ color: pillar.color }} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">{pillar.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Explainability */}
        <motion.div variants={fadeUp}>
          <h2 className="text-xl font-bold text-white mb-6 text-center">Every AI decision explained</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Brain, title: 'SHAP attribution', desc: 'See which factors drove each decision with quantified feature importance.' },
              { icon: ScrollText, title: 'Audit trail', desc: 'Every decision timestamped, versioned, and traceable to its source model.' },
              { icon: UserCheck, title: 'Human override', desc: 'Override any AI decision at any time. Your judgment always takes priority.' },
            ].map((col) => (
              <div key={col.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 text-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(34,197,94,0.15)' }}>
                  <col.icon className="h-5 w-5" style={{ color: '#22C55E' }} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{col.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{col.desc}</p>
                {col.title === 'SHAP attribution' && (
                  <div className="flex flex-col gap-1.5 mt-3">
                    {shapFactors.map((f) => (
                      <div key={f.name} className="flex items-center gap-2">
                        <span className="text-[10px] text-white/40 w-24 text-left truncate">{f.name}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/10">
                          <div className="h-full rounded-full" style={{ width: `${f.weight * 100}%`, background: '#22C55E' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {col.title === 'Audit trail' && (
                  <div className="flex flex-col gap-2 mt-3 text-left">
                    {['Decision logged', 'Evidence recorded', 'Trail sealed'].map((entry, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#22C55E' }} />
                        <span className="text-[10px] text-white/40">{entry}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Audit proof card */}
        <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-4 w-4 text-white/30" />
            <span className="text-xs text-white/30 uppercase tracking-wider">Sample Audit Record</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}>GV-2026-0215-001</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Protect</span>
          </div>
          <p className="text-sm text-white font-medium mb-2">Blocked suspicious transaction $4,200</p>
          <div className="flex flex-wrap gap-4 text-xs text-white/40 mb-3">
            <span>Confidence: <span className="text-white/70 font-semibold">0.94</span></span>
            <span>Feb 15, 2026 14:28</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {shapFactors.map((f) => (
              <span key={f.name} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40">{f.name} ({(f.weight * 100).toFixed(0)}%)</span>
            ))}
          </div>
        </motion.div>

        {/* Compliance section */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            {[
              { badge: 'GDPR', label: 'General Data Protection Regulation' },
              { badge: 'CCPA', label: 'California Consumer Privacy Act' },
              { badge: 'ISO 27001', label: 'Information Security Management' },
              { badge: 'SOC 2', label: 'Service Organization Controls' },
            ].map((c) => (
              <div key={c.badge} className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-white/70">{c.badge}</span>
                <span className="text-xs text-white/40">{c.label}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
            <p className="text-sm text-white/60 leading-relaxed">
              Poseidon.AI is built on a zero-trust security architecture. Every data access is logged, every AI decision is explained, and every user action is auditable. We undergo annual third-party security audits and maintain compliance with international data protection regulations.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeUp} className="text-center flex flex-col items-center gap-4 py-8">
          <div className="flex gap-3">
            <Link to="/dashboard" className="flex items-center gap-1.5 px-6 py-3 rounded-xl text-sm font-semibold text-[#0B1221] hover:opacity-90 transition-opacity" style={{ background: '#22C55E' }}>
              See the dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <button className="px-6 py-3 rounded-xl text-sm font-semibold border border-white/10 text-white/70 hover:bg-white/5 transition-colors">Read security whitepaper</button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer variants={fadeUp} className="text-center text-xs text-white/20 py-4 border-t border-white/[0.06]">
          &copy; 2026 Poseidon.AI &middot; MIT Sloan CTO Program &middot; Privacy &middot; Terms
        </motion.footer>
      </motion.div>
    </div>
  );
}

export default TrustSecurity;
