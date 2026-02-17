import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Check, X, CheckCircle, Lock, Star, ChevronDown, ArrowRight, Zap } from 'lucide-react';
import { Link } from '../router';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const features = [
  { name: 'Dashboard monitoring', group: 'AI Features', starter: true, pro: true, enterprise: true },
  { name: 'Protect engine', group: 'AI Features', starter: true, pro: true, enterprise: true },
  { name: 'Grow engine', group: 'AI Features', starter: false, pro: true, enterprise: true },
  { name: 'Execute engine', group: 'AI Features', starter: false, pro: true, enterprise: true },
  { name: 'AI decisions/mo', group: 'AI Features', starter: '100', pro: '10,000', enterprise: 'Unlimited' },
  { name: 'Audit trail', group: 'Security', starter: 'Basic', pro: 'Full', enterprise: 'Full + SOC 2' },
  { name: 'SHAP explanations', group: 'Security', starter: false, pro: true, enterprise: true },
  { name: 'Custom model training', group: 'Security', starter: false, pro: false, enterprise: true },
  { name: 'Data encryption', group: 'Security', starter: true, pro: true, enterprise: true },
  { name: 'Email support', group: 'Support', starter: true, pro: true, enterprise: true },
  { name: 'Priority support', group: 'Support', starter: false, pro: '4h SLA', enterprise: '1h SLA' },
  { name: 'Dedicated AM', group: 'Support', starter: false, pro: false, enterprise: true },
];

const faqItems = [
  { q: 'Can I switch plans at any time?', a: 'Yes. Upgrade instantly, downgrade at end of billing period. No lock-in contracts.' },
  { q: 'Is there a free trial for Pro?', a: 'Yes, 14-day free trial with full Pro features. No credit card required to start.' },
  { q: 'What happens to my data if I downgrade?', a: 'Your data is preserved. Features above your plan tier are disabled but data remains accessible.' },
  { q: 'Do you offer nonprofit discounts?', a: 'Yes. Contact sales for 50% off Pro and custom Enterprise pricing for qualified nonprofits.' },
];

export function Pricing() {
  const [annual, setAnnual] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

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
            <Link to="/signup" className="px-4 py-2 rounded-xl text-xs font-semibold text-[#0B1221] hover:opacity-90 transition-opacity" style={{ background: '#00F0FF' }}>Get started</Link>
          </div>
        </div>
      </nav>

      <motion.div className="mx-auto flex flex-col gap-8 md:gap-12 px-4 py-10 md:px-6 md:py-16 lg:px-8" style={{ maxWidth: '1280px' }} variants={stagger} initial="hidden" animate="visible">
        {/* Hero */}
        <motion.div variants={fadeUp} className="text-center flex flex-col items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'rgba(0,240,255,0.15)', color: '#00F0FF' }}>Pricing</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white text-balance">Simple, transparent pricing</h1>
          <p className="text-sm text-slate-400 max-w-md text-pretty">Start free, scale when you&apos;re ready. All plans include full audit trails.</p>
          <div className="flex items-center gap-3 mt-4">
            <span className={`text-sm ${!annual ? 'text-white' : 'text-white/40'}`}>Monthly</span>
            <button onClick={() => setAnnual(!annual)} className={`w-12 h-6 rounded-full relative transition-colors ${annual ? '' : 'bg-white/10'}`} style={annual ? { background: '#00F0FF' } : {}} role="switch" aria-checked={annual}>
              <div className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${annual ? 'translate-x-7 bg-[#0B1221]' : 'translate-x-1 bg-white'}`} />
            </button>
            <span className={`text-sm ${annual ? 'text-white' : 'text-white/40'}`}>Annual</span>
            {annual && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Save 20%</span>}
          </div>
        </motion.div>

        {/* Pricing cards */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-1">Starter</h3>
            <p className="text-xs text-white/40 mb-4">Free forever</p>
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">$0</span>
              <span className="text-sm text-white/40">/mo</span>
            </div>
            <ul className="flex flex-col gap-2 mb-6 flex-1">
              {['Basic monitoring', '1 goal', '100 AI decisions/mo', 'Email support'].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                  <Check className="h-3.5 w-3.5 text-white/30 shrink-0" />{f}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="w-full text-center py-3 rounded-xl text-sm font-semibold border border-white/10 text-white/70 hover:bg-white/5 transition-colors">Get started free</Link>
          </div>

          {/* Pro */}
          <div className="rounded-2xl border-2 p-6 flex flex-col relative" style={{ borderColor: '#00F0FF', background: 'rgba(0,240,255,0.03)' }}>
            <span className="absolute -top-3 right-4 text-[10px] font-bold px-3 py-1 rounded-full" style={{ background: '#00F0FF', color: '#0B1221' }}>Most popular</span>
            <h3 className="text-lg font-bold text-white mb-1">Pro</h3>
            <p className="text-xs text-white/40 mb-4">For serious users</p>
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">${annual ? '23' : '29'}</span>
              <span className="text-sm text-white/40">/mo</span>
              {annual && <span className="text-xs text-white/30 ml-2 line-through">$29</span>}
            </div>
            <ul className="flex flex-col gap-2 mb-6 flex-1">
              {['All Protect + Grow + Execute', 'Unlimited goals', '10,000 decisions/mo', 'Priority support', 'Full audit trail', 'SHAP explanations'].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                  <Check className="h-3.5 w-3.5 shrink-0" style={{ color: '#00F0FF' }} />{f}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="w-full text-center py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity" style={{ background: '#00F0FF', color: '#0B1221' }}>Start free trial</Link>
          </div>

          {/* Enterprise */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-1">Enterprise</h3>
            <p className="text-xs text-white/40 mb-4">Custom pricing</p>
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">Custom</span>
            </div>
            <ul className="flex flex-col gap-2 mb-6 flex-1">
              {['Unlimited everything', 'Custom model training', 'SOC 2 report', 'Dedicated AM', 'SLA guarantee', 'On-prem option'].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                  <Check className="h-3.5 w-3.5 text-white/30 shrink-0" />{f}
                </li>
              ))}
            </ul>
            <button className="w-full text-center py-3 rounded-xl text-sm font-semibold border border-white/10 text-white/70 hover:bg-white/5 transition-colors">Contact sales</button>
          </div>
        </motion.div>

        {/* Feature comparison table */}
        <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-4 py-3 text-xs text-white/50">Feature</th>
                <th className="px-4 py-3 text-xs text-white/50 text-center">Starter</th>
                <th className="px-4 py-3 text-xs text-center" style={{ color: '#00F0FF' }}>Pro</th>
                <th className="px-4 py-3 text-xs text-white/50 text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                let lastGroup = '';
                return features.map((f) => {
                  const showGroup = f.group !== lastGroup;
                  lastGroup = f.group;
                  const renderCell = (val: boolean | string) => {
                    if (val === true) return <CheckCircle className="h-4 w-4 text-emerald-400 mx-auto" />;
                    if (val === false) return <X className="h-4 w-4 text-red-400/40 mx-auto" />;
                    return <span className="text-xs text-white/60">{val}</span>;
                  };
                  return (
                    <React.Fragment key={f.name}>
                      {showGroup && (
                        <tr><td colSpan={4} className="px-4 pt-4 pb-2 text-[10px] font-semibold text-white/30 uppercase tracking-wider">{f.group}</td></tr>
                      )}
                      <tr className="border-b border-white/[0.04]">
                        <td className="px-4 py-2.5 text-xs text-white/60">{f.name}</td>
                        <td className="px-4 py-2.5 text-center">{renderCell(f.starter)}</td>
                        <td className="px-4 py-2.5 text-center">{renderCell(f.pro)}</td>
                        <td className="px-4 py-2.5 text-center">{renderCell(f.enterprise)}</td>
                      </tr>
                    </React.Fragment>
                  );
                });
              })()}
            </tbody>
          </table>
        </motion.div>

        {/* Trust signals */}
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-6">
          {[
            { icon: Lock, text: 'Bank-grade security' },
            { icon: Shield, text: 'GDPR + CCPA' },
            { icon: Star, text: 'MIT CTO Program 2026' },
          ].map((t) => (
            <div key={t.text} className="flex items-center gap-2">
              <t.icon className="h-4 w-4 text-white/30" />
              <span className="text-sm text-white/40">{t.text}</span>
            </div>
          ))}
        </motion.div>

        {/* FAQ */}
        <motion.div variants={fadeUp}>
          <h2 className="text-lg font-bold text-white mb-4 text-center">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto flex flex-col gap-2">
            {faqItems.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
                <button onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)} className="w-full text-left flex items-center justify-between p-4">
                  <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-white/30 shrink-0 transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {expandedFaq === idx && (
                  <div className="px-4 pb-4 border-t border-white/[0.06]">
                    <p className="text-xs text-slate-400 leading-relaxed pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div variants={fadeUp} className="text-center flex flex-col items-center gap-4 py-8">
          <h2 className="text-2xl font-bold text-white">Ready to get started?</h2>
          <div className="flex gap-3">
            <Link to="/dashboard" className="flex items-center gap-1.5 px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity" style={{ background: '#00F0FF', color: '#0B1221' }}>
              Open Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <button className="px-6 py-3 rounded-xl text-sm font-semibold border border-white/10 text-white/70 hover:bg-white/5 transition-colors">Talk to sales</button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer variants={fadeUp} className="text-center text-xs text-white/20 py-4 border-t border-white/[0.06]">
          &copy; 2026 Poseidon.AI &middot; Privacy &middot; Terms
        </motion.footer>
      </motion.div>
    </div>
  );
}

export default Pricing;
