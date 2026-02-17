import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lightbulb, Sparkles, TrendingUp, DollarSign, BarChart3, ChevronDown, ChevronUp, Send, X, Shield, Filter } from 'lucide-react';
import { Link } from '../router';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

type Category = 'All' | 'Savings' | 'Debt' | 'Income' | 'Investment';
type SortMode = 'Highest Impact' | 'Highest Confidence' | 'Easiest';
type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface ShapFactor { name: string; weight: number }

interface Recommendation {
  rank: number;
  title: string;
  description: string;
  category: Exclude<Category, 'All'>;
  difficulty: Difficulty;
  monthlySavings: number;
  annualSavings: number;
  confidence: number;
  shapFactors: ShapFactor[];
  evidence: string;
  modelVersion: string;
  auditId: string;
}

const recommendations: Recommendation[] = [
  {
    rank: 1, title: 'Consolidate streaming subscriptions', description: 'Three overlapping streaming services detected. Merge into one premium plan to retain 95% content coverage while saving significantly.', category: 'Savings', difficulty: 'Easy', monthlySavings: 140, annualSavings: 1680, confidence: 0.92,
    shapFactors: [{ name: 'Usage overlap', weight: 0.42 }, { name: 'Cost per stream', weight: 0.31 }, { name: 'Content coverage', weight: 0.27 }],
    evidence: '3 overlapping services detected via transaction analysis over 90 days.', modelVersion: 'GrowthForecast v3.2', auditId: 'GV-2026-0216-R01',
  },
  {
    rank: 2, title: 'Increase 401k contribution 2%', description: 'Employer matches up to 6%. Current contribution at 4% leaves $180/mo in unclaimed match on the table.', category: 'Investment', difficulty: 'Medium', monthlySavings: 180, annualSavings: 2160, confidence: 0.88,
    shapFactors: [{ name: 'Employer match gap', weight: 0.48 }, { name: 'Tax benefit', weight: 0.30 }, { name: 'Compound growth', weight: 0.22 }],
    evidence: 'Payroll analysis shows 2% gap to full employer match.', modelVersion: 'GrowthForecast v3.2', auditId: 'GV-2026-0216-R02',
  },
  {
    rank: 3, title: 'Refinance auto loan', description: 'Current rate 6.9% APR is 2.1% above market for your credit profile. Refinancing saves $95/mo over remaining 36 months.', category: 'Debt', difficulty: 'Hard', monthlySavings: 95, annualSavings: 1140, confidence: 0.85,
    shapFactors: [{ name: 'Rate differential', weight: 0.52 }, { name: 'Credit score', weight: 0.28 }, { name: 'Remaining term', weight: 0.20 }],
    evidence: 'Rate comparison across 12 lenders for your credit tier (740+).', modelVersion: 'GrowthForecast v3.2', auditId: 'GV-2026-0216-R03',
  },
  {
    rank: 4, title: 'Cancel unused gym membership', description: 'No visits in 47 days. Membership auto-renews in 13 days at $55/mo. Cancel window open.', category: 'Savings', difficulty: 'Easy', monthlySavings: 55, annualSavings: 660, confidence: 0.97,
    shapFactors: [{ name: 'Visit frequency', weight: 0.62 }, { name: 'Cost per visit', weight: 0.23 }, { name: 'Alternative options', weight: 0.15 }],
    evidence: '0 check-ins in 47 days via linked bank transaction pattern.', modelVersion: 'GrowthForecast v3.2', auditId: 'GV-2026-0216-R04',
  },
  {
    rank: 5, title: 'Open high-yield savings account', description: 'Current savings earning 0.5% APY. HYSA offers 4.8% APY on same FDIC-insured deposits. Passive income boost.', category: 'Savings', difficulty: 'Easy', monthlySavings: 85, annualSavings: 1020, confidence: 0.91,
    shapFactors: [{ name: 'Rate differential', weight: 0.55 }, { name: 'FDIC coverage', weight: 0.25 }, { name: 'Liquidity match', weight: 0.20 }],
    evidence: 'APY comparison across top 15 HYSA providers as of Feb 2026.', modelVersion: 'GrowthForecast v3.2', auditId: 'GV-2026-0216-R05',
  },
  {
    rank: 6, title: 'Negotiate internet bill', description: 'Current plan $89/mo is $45 above market rate for equivalent 500Mbps service in your area.', category: 'Savings', difficulty: 'Easy', monthlySavings: 45, annualSavings: 540, confidence: 0.89,
    shapFactors: [{ name: 'Market comparison', weight: 0.50 }, { name: 'Loyalty duration', weight: 0.30 }, { name: 'Competitor offers', weight: 0.20 }],
    evidence: 'Price comparison across 4 ISPs in your zip code.', modelVersion: 'GrowthForecast v3.2', auditId: 'GV-2026-0216-R06',
  },
  {
    rank: 7, title: 'Balance transfer credit card', description: 'Transfer $4,200 balance from 22.9% APR card to 0% intro APR for 18 months. Save $120/mo in interest.', category: 'Debt', difficulty: 'Medium', monthlySavings: 120, annualSavings: 1440, confidence: 0.83,
    shapFactors: [{ name: 'Interest savings', weight: 0.48 }, { name: 'Balance amount', weight: 0.32 }, { name: 'Credit utilization', weight: 0.20 }],
    evidence: 'Pre-qualified offers detected from 3 issuers for your profile.', modelVersion: 'GrowthForecast v3.2', auditId: 'GV-2026-0216-R07',
  },
  {
    rank: 8, title: 'Side income from skills', description: 'Your professional skills (data analysis, Python) have high freelance demand. Estimated $200/mo from 5h/week.', category: 'Income', difficulty: 'Hard', monthlySavings: 200, annualSavings: 2400, confidence: 0.72,
    shapFactors: [{ name: 'Skill demand', weight: 0.45 }, { name: 'Market rate', weight: 0.35 }, { name: 'Time availability', weight: 0.20 }],
    evidence: 'Freelance market analysis from 3 platforms for your skill set.', modelVersion: 'GrowthForecast v3.2', auditId: 'GV-2026-0216-R08',
  },
];

const categoryColors: Record<Exclude<Category, 'All'>, string> = { Savings: '#22C55E', Debt: '#EF4444', Income: '#00F0FF', Investment: '#8B5CF6' };
const difficultyColors: Record<Difficulty, { text: string; bg: string }> = {
  Easy: { text: '#22C55E', bg: 'rgba(34,197,94,0.15)' },
  Medium: { text: '#EAB308', bg: 'rgba(234,179,8,0.15)' },
  Hard: { text: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export function GrowRecommendations() {
  const [sort, setSort] = useState<SortMode>('Highest Impact');
  const [category, setCategory] = useState<Category>('All');
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleExpand = (rank: number) => setExpanded((prev) => ({ ...prev, [rank]: !prev[rank] }));

  const filtered = recommendations
    .filter((r) => category === 'All' || r.category === category)
    .sort((a, b) => {
      if (sort === 'Highest Impact') return b.monthlySavings - a.monthlySavings;
      if (sort === 'Highest Confidence') return b.confidence - a.confidence;
      const diffOrder: Record<Difficulty, number> = { Easy: 0, Medium: 1, Hard: 2 };
      return diffOrder[a.difficulty] - diffOrder[b.difficulty];
    });

  const sortOptions: SortMode[] = ['Highest Impact', 'Highest Confidence', 'Easiest'];
  const categoryOptions: Category[] = ['All', 'Savings', 'Debt', 'Income', 'Investment'];

  return (
    <div className="min-h-screen w-full" style={{ background: '#0B1221' }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: '#8B5CF6', color: '#fff' }}
      >
        Skip to main content
      </a>

      {/* Sticky back nav */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]"
        style={{ background: 'rgba(11,18,33,0.8)' }}
        aria-label="Breadcrumb"
      >
        <div className="mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center gap-2" style={{ maxWidth: '1280px' }}>
          <Link to="/grow" className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: '#8B5CF6' }}>
            <ArrowLeft className="h-4 w-4" />
            Grow
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/50">Recommendations</span>
        </div>
      </nav>

      <motion.div
        id="main-content"
        className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8"
        style={{ maxWidth: '1280px' }}
        variants={stagger}
        initial="hidden"
        animate="visible"
        role="main"
      >
        {/* Hero */}
        <motion.div variants={fadeUp} className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}>
              <Lightbulb className="h-4 w-4" style={{ color: '#8B5CF6' }} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#8B5CF6' }}>
              Grow · Recommendations
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Growth Recommendations</h1>
          <p className="text-sm text-slate-400">
            8 AI-generated recommendations · Est. +$840/mo total impact · Updated 2h ago
          </p>
        </motion.div>

        {/* KPI bar */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total impact', value: '+$840/mo', color: '#8B5CF6' },
              { label: 'High confidence', value: '5', color: '#22C55E' },
              { label: 'Actionable now', value: '3', color: '#00F0FF' },
              { label: 'Avg confidence', value: '0.91', color: '#EAB308' },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                <p className="text-xs text-white/40 mb-1">{kpi.label}</p>
                <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Filter row */}
        <motion.div variants={fadeUp} className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="h-4 w-4 text-white/30 shrink-0" />
            {sortOptions.map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${sort === s ? 'text-violet-300 border-violet-500/40' : 'text-white/50 border-white/10 bg-white/5 hover:bg-white/10'}`}
                style={sort === s ? { background: 'rgba(139,92,246,0.15)' } : {}}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categoryOptions.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${category === c ? 'text-violet-300 border-violet-500/40' : 'text-white/50 border-white/10 bg-white/5 hover:bg-white/10'}`}
                style={category === c ? { background: 'rgba(139,92,246,0.15)' } : {}}
              >
                {c}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 2-column layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main feed */}
          <div className="flex-1 min-w-0 lg:w-2/3 flex flex-col gap-4">
            {filtered.map((rec) => (
              <motion.div
                key={rec.rank}
                variants={fadeUp}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6"
                style={{ borderLeftWidth: 3, borderLeftColor: '#8B5CF6' }}
              >
                {/* Top row */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(139,92,246,0.2)', color: '#8B5CF6' }}>
                    #{rec.rank}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border" style={{ color: categoryColors[rec.category], borderColor: `${categoryColors[rec.category]}40`, background: `${categoryColors[rec.category]}15` }}>
                    {rec.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ color: difficultyColors[rec.difficulty].text, background: difficultyColors[rec.difficulty].bg }}>
                    {rec.difficulty}
                  </span>
                </div>

                {/* Title + description */}
                <h3 className="text-base font-bold text-white mb-1">{rec.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-2 mb-4">{rec.description}</p>

                {/* Impact metrics */}
                <div className="flex flex-wrap items-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5" style={{ color: '#8B5CF6' }} />
                    <span className="text-sm font-bold" style={{ color: '#8B5CF6' }}>+${rec.monthlySavings}/mo</span>
                  </div>
                  <span className="text-xs text-white/50">${rec.annualSavings.toLocaleString()}/yr</span>
                  <span className="text-xs text-white/50">Confidence: {(rec.confidence * 100).toFixed(0)}%</span>
                </div>

                {/* Confidence bar */}
                <div className="h-1.5 rounded-full bg-white/10 mb-4">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${rec.confidence * 100}%`, background: '#8B5CF6' }} />
                </div>

                {/* Expandable section */}
                <button
                  onClick={() => toggleExpand(rec.rank)}
                  className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white/70 transition-colors mb-3"
                  aria-expanded={!!expanded[rec.rank]}
                >
                  {expanded[rec.rank] ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  {expanded[rec.rank] ? 'Hide details' : 'Show SHAP factors & evidence'}
                </button>

                {expanded[rec.rank] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 space-y-3"
                  >
                    {/* SHAP factors */}
                    <div className="space-y-2">
                      {rec.shapFactors.map((f) => (
                        <div key={f.name} className="flex items-center gap-2">
                          <span className="text-xs text-white/50 w-32 shrink-0 truncate">{f.name}</span>
                          <div className="flex-1 h-1.5 rounded-full bg-white/10">
                            <div className="h-full rounded-full" style={{ width: `${f.weight * 100}%`, background: '#8B5CF6', opacity: 0.7 }} />
                          </div>
                          <span className="text-xs text-white/40 w-10 text-right">{f.weight.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Evidence */}
                    <p className="text-xs text-white/40 italic">{rec.evidence}</p>

                    {/* Model + audit */}
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-white/30 bg-white/5">{rec.modelVersion}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-white/30 bg-white/5">{rec.auditId}</span>
                    </div>
                  </motion.div>
                )}

                {/* Action row */}
                <div className="flex gap-3">
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: '#8B5CF6' }}>
                    <Send className="h-3.5 w-3.5" />
                    Add to Execute
                  </button>
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-white/10 transition-colors">
                    <X className="h-3.5 w-3.5" />
                    Dismiss
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Side rail */}
          <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-4" aria-label="Recommendations sidebar">
            {/* Summary */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">Summary</h3>
              <div className="space-y-3">
                {[
                  { label: 'Monthly impact', value: '$840', color: '#8B5CF6' },
                  { label: 'Annual impact', value: '$10,080', color: '#8B5CF6' },
                  { label: 'Actions pending', value: '3', color: '#EAB308' },
                  { label: 'Confidence avg', value: '0.91', color: '#22C55E' },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between items-center">
                    <span className="text-xs text-white/50">{s.label}</span>
                    <span className="text-sm font-bold" style={{ color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact breakdown */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">Impact Breakdown</h3>
              <div className="space-y-3">
                {[
                  { label: 'Savings', amount: 325, max: 325 },
                  { label: 'Investment', amount: 180, max: 325 },
                  { label: 'Debt', amount: 215, max: 325 },
                  { label: 'Income', amount: 120, max: 325 },
                ].map((b) => (
                  <div key={b.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/50">{b.label}</span>
                      <span className="text-white/70">${b.amount}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10">
                      <div className="h-full rounded-full" style={{ width: `${(b.amount / b.max) * 100}%`, background: '#8B5CF6' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Analysis */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4" style={{ borderLeftWidth: 3, borderLeftColor: '#8B5CF6' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold" style={{ background: 'rgba(139,92,246,0.2)', color: '#8B5CF6' }}>AI</div>
                <Sparkles className="h-3.5 w-3.5" style={{ color: '#8B5CF6' }} />
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                Your top opportunity is subscription consolidation — 3 overlapping services total $140/mo.
              </p>
              <p className="text-[10px] text-white/30 mt-2">ScenarioEngine v1.4 · GV-2026-0216-GROW</p>
            </div>
          </aside>
        </div>

        {/* Govern footer */}
        <motion.footer
          variants={fadeUp}
          className="flex flex-wrap items-center gap-3 rounded-2xl border-t border-white/10 bg-white/[0.03] px-4 py-3"
          role="contentinfo"
          aria-label="Governance verification"
        >
          <Shield className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Verified</span>
          <span className="text-xs font-mono text-white/30">GV-2026-0216-GROW-REC</span>
          <span className="text-xs text-white/20">·</span>
          <span className="text-xs text-white/30">GrowthForecast v3.2</span>
          <button className="ml-auto text-xs text-white/40 hover:text-white/60 transition-colors">Request human review</button>
        </motion.footer>
      </motion.div>
    </div>
  );
}

export default GrowRecommendations;
