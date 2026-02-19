import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, HelpCircle, Search, Rocket, Cpu, Brain, Shield, BookOpen, Code2, ScrollText, Lock, Database, FileText, ThumbsUp, ThumbsDown, ChevronDown, ExternalLink, Send } from 'lucide-react';
import { Link } from '../router';
import { GovernFooter, AuroraPulse } from '@/components/poseidon'
import { GOVERNANCE_META } from '@/lib/governance-meta'
import { fadeUp, staggerContainer as stagger } from '@/lib/motion-presets'

const quickLinks = [
  { title: 'Getting Started', icon: Rocket, iconColor: 'var(--engine-protect)', iconBg: 'rgba(34,197,94,0.15)', desc: 'Setup guide and first steps' },
  { title: 'Engine Guides', icon: Cpu, iconColor: 'var(--engine-grow)', iconBg: 'rgba(139,92,246,0.15)', desc: 'Protect, Grow, Execute, Govern docs' },
  { title: 'AI & Trust', icon: Brain, iconColor: 'var(--engine-govern)', iconBg: 'rgba(59,130,246,0.15)', desc: 'How AI decisions are made' },
  { title: 'Account & Security', icon: Shield, iconColor: 'var(--engine-execute)', iconBg: 'rgba(234,179,8,0.15)', desc: 'Authentication and privacy' },
];

const faqItems = [
  { q: 'How does Poseidon.AI protect my data?', a: 'All data is encrypted at rest (AES-256) and in transit (TLS 1.3). SOC 2 Type II in progress. Sensitive data never leaves your control through our zero-knowledge architecture.' },
  { q: 'What does "confidence score" mean?', a: 'A confidence score (0.0-1.0) represents how certain the AI model is about its recommendation. Higher scores indicate stronger evidence supporting the decision. Scores below 0.70 are always flagged for human review.' },
  { q: 'Can I undo an automated action?', a: 'Yes. All actions marked as reversible can be rolled back within 24 hours from the Execute > History page. Irreversible actions always require explicit human approval before execution.' },
  { q: 'How do I dispute a blocked transaction?', a: 'Navigate to Protect > Alert Detail for the blocked transaction and click "Dispute." Provide your reason and supporting information. Our team reviews disputes within 4 hours.' },
  { q: 'What AI models are used?', a: 'Poseidon uses 8 specialized models across 4 engines plus the dashboard command center: FraudDetection & BehavioralBaseline (Protect), GrowthForecast & GoalTracker (Grow), BillNegotiator & ExecuteEngine (Execute), GovernanceEngine & PolicyEngine (Govern).' },
  { q: 'How is my financial data secured?', a: 'Bank-grade 256-bit encryption, read-only access to accounts, SOC 2 Type II in progress, plus zero-knowledge proofs to help ensure your data is never exposed.' },
  { q: 'Can I export my data?', a: 'Yes. Go to Settings > Data Rights to request a JSON or CSV export of all your data. Exports are typically ready within 24 hours.' },
  { q: 'How do I contact support?', a: 'Use the contact form on this page, or email support@poseidon.ai. Priority support is available for Pro and Enterprise plans with a 4-hour SLA.' },
];

const docLinks = [
  { title: 'API Reference', icon: Code2, desc: 'REST API endpoints' },
  { title: 'Engine Docs', icon: BookOpen, desc: 'All 4 engine guides' },
  { title: 'Governance Policies', icon: ScrollText, desc: 'Compliance docs' },
  { title: 'Security Whitepaper', icon: Lock, desc: 'Architecture details' },
  { title: 'Data Dictionary', icon: Database, desc: 'Field definitions' },
  { title: 'Release Notes', icon: FileText, desc: 'Version changelog' },
];

export function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [helpful, setHelpful] = useState<Record<number, boolean | null>>({});

  const filteredFaqs = searchQuery.trim()
    ? faqItems.filter((f) => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase()))
    : faqItems;

  return (
    <div className="relative min-h-screen w-full" style={{ background: '#0B1221' }}>
      <AuroraPulse color="var(--engine-dashboard)" intensity="subtle" />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold" style={{ background: 'var(--engine-govern)', color: '#fff' }}>Skip to main content</a>

      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]" style={{ background: 'rgba(11,18,33,0.8)' }} aria-label="Breadcrumb">
        <div className="mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center gap-2" style={{ maxWidth: '1280px' }}>
          <Link to="/dashboard" className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: 'var(--engine-dashboard)' }}>
            <ArrowLeft className="h-4 w-4" />Dashboard
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/50">Help Center</span>
        </div>
      </nav>

      <motion.div id="main-content" className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8" style={{ maxWidth: '1280px' }} variants={stagger} initial="hidden" animate="visible" role="main">
        {/* Hero + Search */}
        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
              <HelpCircle className="h-4 w-4" style={{ color: 'var(--engine-govern)' }} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--engine-govern)' }}>Help Center</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">How can we help?</h1>
          <div className="relative mt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
            <label htmlFor="help-search" className="sr-only">Search help articles</label>
            <input
              id="help-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help articles..."
              className="w-full rounded-2xl bg-white/5 border border-white/10 pl-12 pr-4 py-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--engine-govern)]/50 transition-colors"
            />
          </div>
        </motion.div>

        {/* Quick links 2x2 */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickLinks.map((ql) => (
            <button key={ql.title} disabled className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 text-left opacity-60 cursor-not-allowed">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: ql.iconBg }}>
                  <ql.icon className="h-5 w-5" style={{ color: ql.iconColor }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{ql.title}</p>
                  <p className="text-xs text-white/40 mt-0.5">{ql.desc}</p>
                </div>
              </div>
              <span className="inline-block mt-3 text-[10px] font-semibold uppercase tracking-wider text-white/40">Preview</span>
            </button>
          ))}
        </motion.div>

        {/* FAQ accordion */}
        <motion.div variants={fadeUp}>
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-2">
            {filteredFaqs.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
                <button onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)} className="w-full text-left flex items-center justify-between p-4">
                  <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-white/30 shrink-0 transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {expandedFaq === idx && (
                  <div className="px-4 pb-4 border-t border-white/[0.06]">
                    <p className="text-xs text-slate-400 leading-relaxed pt-3">{faq.a}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-[10px] text-white/30">Was this helpful?</span>
                      <button onClick={() => setHelpful({ ...helpful, [idx]: true })} className={`p-1 rounded ${helpful[idx] === true ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/30 hover:text-white/50'}`}>
                        <ThumbsUp className="h-3 w-3" />
                      </button>
                      <button onClick={() => setHelpful({ ...helpful, [idx]: false })} className={`p-1 rounded ${helpful[idx] === false ? 'bg-red-500/20 text-red-400' : 'text-white/30 hover:text-white/50'}`}>
                        <ThumbsDown className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Documentation links */}
        <motion.div variants={fadeUp}>
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Documentation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {docLinks.map((dl) => (
              <button key={dl.title} disabled className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 text-left opacity-60 cursor-not-allowed">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <dl.icon className="h-4 w-4" style={{ color: 'var(--engine-govern)' }} />
                    <span className="text-sm font-medium text-white">{dl.title}</span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-white/20" />
                </div>
                <p className="text-xs text-white/40">{dl.desc}</p>
                <span className="inline-block mt-3 text-[10px] font-semibold uppercase tracking-wider text-white/40">Preview</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Contact form */}
        <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Submit a Ticket</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="help-subject" className="text-xs text-white/50 block mb-1.5">Subject</label>
              <input id="help-subject" type="text" placeholder="Brief summary of your issue" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--engine-govern)]/50 transition-colors" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="help-category" className="text-xs text-white/50 block mb-1.5">Category</label>
                <select id="help-category" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white/60 focus:outline-none focus:border-[var(--engine-govern)]/50">
                  <option>Technical</option><option>Billing</option><option>Security</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-white/50 block mb-1.5">Priority</label>
                <div className="flex gap-3 pt-2">
                  {['Low', 'Medium', 'High', 'Urgent'].map((p) => (
                    <label key={p} className="flex items-center gap-1 text-xs text-white/50 cursor-pointer">
                      <input type="radio" name="priority" defaultChecked={p === 'Medium'} className="accent-blue-500" />{p}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="help-description" className="text-xs text-white/50 block mb-1.5">Description</label>
              <textarea id="help-description" rows={4} placeholder="Describe your issue in detail..." className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--engine-govern)]/50 resize-none transition-colors" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/30">Avg response time: 2 hours</span>
              <button disabled className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white opacity-60 cursor-not-allowed" style={{ background: 'var(--engine-govern)' }} aria-label="Submit ticket preview only">
                <Send className="h-3.5 w-3.5" />Submit ticket · Preview
              </button>
            </div>
          </div>
        </motion.div>

        <GovernFooter auditId={GOVERNANCE_META['/help'].auditId} pageContext={GOVERNANCE_META['/help'].pageContext} />
      </motion.div>
    </div>
  );
}

export default HelpSupport;
