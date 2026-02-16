import React, { useState } from 'react';
import { GovernContractSet } from '../components/GovernContractSet';
import { PageShell } from '../components/PageShell';
import { ProofLine } from '../components/ProofLine';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';

/* ── mock data ────────────────────────────────────────────── */

const quickLinks = [
  { title: 'Getting Started', description: 'Set up accounts, connect banks, and configure AI engines.', icon: 'R' },
  { title: 'Engine Guides', description: 'Deep dives into Protect, Grow, Execute, and Govern.', icon: 'C' },
  { title: 'AI & Trust', description: 'How AI decisions are made, explained, and audited.', icon: 'B' },
  { title: 'Account & Security', description: '2FA, data protection, session management, and more.', icon: 'S' },
];

const faqItems = [
  { q: 'How does Poseidon.AI explain its decisions?', a: 'Every AI decision includes a SHAP-based explanation showing which factors contributed to the outcome. You can view these in any alert detail, execution history, or audit entry.' },
  { q: 'Can I revoke an automated action?', a: 'Yes. All actions marked as reversible can be rolled back within 24 hours from the execution history page. Irreversible actions always require explicit approval.' },
  { q: 'How is my data protected?', a: 'All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We maintain SOC 2 Type II compliance and never share data with third parties.' },
  { q: 'What is the Govern Contract Set?', a: 'The Govern Contract Set appears at the bottom of every page. It provides audit ID, model version, and explanation version for full transparency and traceability.' },
  { q: 'How do I exercise my data rights?', a: 'Navigate to Settings > Data Rights to export, restrict, or delete your data. All requests are processed within 72 hours per GDPR/CCPA requirements.' },
  { q: 'What happens if the AI makes a mistake?', a: 'You can flag any decision as incorrect through the human feedback mechanism on audit detail pages. This trains the model and triggers a review by the governance team.' },
  { q: 'How are trust scores calculated?', a: 'Trust scores combine accuracy, transparency, fairness, and compliance metrics using a weighted composite formula. Scores are recalculated every 15 minutes.' },
  { q: 'Can I change my AI autonomy level?', a: 'Yes. Go to Settings > AI Configuration to adjust the global autonomy level and per-engine settings. Changes take effect immediately and are audit-logged.' },
];

const docLinks = [
  { title: 'API Reference', description: 'REST API endpoints and authentication' },
  { title: 'Engine Documentation', description: 'Technical guides for all 4 engines' },
  { title: 'Governance Policies', description: 'Compliance and audit policies' },
  { title: 'Security Whitepaper', description: 'Architecture and encryption details' },
  { title: 'Data Dictionary', description: 'Complete field and metric definitions' },
  { title: 'Release Notes', description: 'Version history and changelog' },
];

/* ── component ────────────────────────────────────────────── */

export const HelpSupport: React.FC = () => {
  const contract = getRouteScreenContract('help');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [helpful, setHelpful] = useState<Record<number, boolean | null>>({});

  const filteredFaqs = searchQuery.trim()
    ? faqItems.filter((f) => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase()))
    : faqItems;

  /* ── primary feed ───────────────────────────────────────── */
  const primaryFeed = (
    <>
      {/* Search Bar */}
      <div className="relative mb-6">
        <input type="text" placeholder="Search help articles, FAQs, and documentation..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 pl-10 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500/50" />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>

      {/* Quick Links */}
      <section className="mb-6">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <div key={link.title} className="engine-card hover:bg-white/[0.06] transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                  <span className="text-blue-400 text-sm font-semibold">{link.icon}</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">{link.title}</h4>
                  <p className="text-xs text-white/50 mt-0.5">{link.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="mb-6">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Frequently Asked Questions</h3>
        <div className="space-y-2">
          {filteredFaqs.map((faq, idx) => (
            <div key={idx} className="engine-card">
              <button onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)} className="w-full text-left flex items-center justify-between">
                <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                <span className={`text-white/30 transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
              </button>
              {expandedFaq === idx && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-xs text-white/60 leading-relaxed">{faq.a}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-[10px] text-white/30">Was this helpful?</span>
                    <button onClick={() => setHelpful({ ...helpful, [idx]: true })} className={`text-xs px-2 py-1 rounded ${helpful[idx] === true ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/30 hover:text-white/50'}`}>Yes</button>
                    <button onClick={() => setHelpful({ ...helpful, [idx]: false })} className={`text-xs px-2 py-1 rounded ${helpful[idx] === false ? 'bg-red-500/20 text-red-400' : 'text-white/30 hover:text-white/50'}`}>No</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Documentation Links */}
      <section className="mb-6">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Documentation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {docLinks.map((doc) => (
            <div key={doc.title} className="engine-card hover:bg-white/[0.06] transition-colors cursor-pointer">
              <h4 className="text-sm font-medium text-blue-400">{doc.title}</h4>
              <p className="text-xs text-white/40 mt-1">{doc.description}</p>
            </div>
          ))}
        </div>
      </section>

      <GovernContractSet auditId="GV-2026-0216-HELP" modelVersion="HelpSystem v1.0" explanationVersion="xai-1.0" />
    </>
  );

  /* ── decision rail (contact form) ───────────────────────── */
  const decisionRail = (
    <>
      <article className="engine-card">
        <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">Submit a Ticket</h4>
        <div className="space-y-3">
          <input type="text" placeholder="Subject" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500/50" />
          <select className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-white/50 focus:outline-none">
            <option>Category</option>
            <option>Technical issue</option>
            <option>Account question</option>
            <option>Feature request</option>
            <option>Security concern</option>
          </select>
          <div className="flex gap-2">
            {['Low', 'Normal', 'High'].map((p) => (
              <label key={p} className="flex items-center gap-1.5 text-xs text-white/50">
                <input type="radio" name="priority" defaultChecked={p === 'Normal'} className="accent-blue-500" />
                {p}
              </label>
            ))}
          </div>
          <textarea placeholder="Describe your issue..." rows={4} className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-none" />
          <button className="w-full rounded-lg bg-blue-500 text-white text-xs font-semibold py-2.5 hover:bg-blue-600 transition-colors">Submit ticket</button>
        </div>
        <ProofLine claim="Avg response time: 4 hours" evidence="97% satisfaction | 30 cases resolved this month" source="Support system" basis="30d rolling" sourceType="system" />
      </article>
    </>
  );

  return (
    <PageShell
      slug="settings"
      contract={contract}
      layout="engine"
      heroVariant="editorial"
      hero={{
        kicker: 'Help Center',
        headline: 'Find answers, browse documentation, or submit a ticket.',
        subline: 'Search the knowledge base or contact our support team.',
        proofLine: { claim: '97% satisfaction rate', evidence: 'Avg response: 4h | 30 cases resolved this month', source: 'Support system' },
        freshness: new Date(Date.now() - 60 * 60 * 1000),
        kpis: [
          { label: 'Articles', value: '142', accent: 'blue', definition: 'Knowledge base articles' },
          { label: 'Avg response', value: '4h', accent: 'teal', definition: 'Average first response time' },
          { label: 'Satisfaction', value: '97%', accent: 'cyan', definition: 'User satisfaction score' },
          { label: 'Open cases', value: '1', accent: 'amber', definition: 'Your open support cases' },
        ],
      }}
      primaryFeed={primaryFeed}
      decisionRail={decisionRail}
    />
  );
};

export default HelpSupport;
