import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lightbulb, Sparkles, DollarSign, ChevronDown, ChevronUp, Send, X, Filter } from 'lucide-react';
import { Link } from '../router';
import { usePageTitle } from '../hooks/use-page-title';
import { GovernFooter, AuroraPulse } from '@/components/poseidon';
import { GOVERNANCE_META } from '@/lib/governance-meta';
import { fadeUp, staggerContainer as stagger } from '@/lib/motion-presets';
import { Button, ButtonLink, Surface } from '@/design-system';

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

type Category = 'All' | 'Savings' | 'Debt' | 'Income' | 'Investment';
type SortMode = 'Highest Impact' | 'Highest Confidence' | 'Easiest';
type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface ShapFactor { name: string; weight: number; }

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
    evidence: '3 overlapping services detected via transaction analysis over 90 days.', modelVersion: 'GrowthForecast v3.2', auditId: 'GV-2026-0216-R01'
  },
  {
    rank: 2, title: 'Increase 401k contribution 2%', description: 'Employer matches up to 6%. Current contribution at 4% leaves $180/mo in unclaimed match on the table.', category: 'Investment', difficulty: 'Medium', monthlySavings: 180, annualSavings: 2160, confidence: 0.88,
    shapFactors: [{ name: 'Employer match gap', weight: 0.48 }, { name: 'Tax benefit', weight: 0.30 }, { name: 'Compound growth', weight: 0.22 }],
    evidence: 'Payroll analysis shows 2% gap to full employer match.', modelVersion: 'GrowthForecast v3.2', auditId: 'GV-2026-0216-R02'
  },
  {
    rank: 3, title: 'Refinance auto loan', description: 'Current rate 6.9% APR is 2.1% above market for your credit profile. Refinancing saves $95/mo over remaining 36 months.', category: 'Debt', difficulty: 'Hard', monthlySavings: 95, annualSavings: 1140, confidence: 0.85,
    shapFactors: [{ name: 'Rate differential', weight: 0.52 }, { name: 'Credit score', weight: 0.28 }, { name: 'Remaining term', weight: 0.20 }],
    evidence: 'Rate comparison across 12 lenders for your credit tier (740+).', modelVersion: 'GrowthForecast v3.2', auditId: 'GV-2026-0216-R03'
  },
  {
    rank: 4, title: 'Cancel unused gym membership', description: 'No visits in 47 days. Membership auto-renews in 13 days at $55/mo. Cancel window open.', category: 'Savings', difficulty: 'Easy', monthlySavings: 55, annualSavings: 660, confidence: 0.97,
    shapFactors: [{ name: 'Visit frequency', weight: 0.62 }, { name: 'Cost per visit', weight: 0.23 }, { name: 'Alternative options', weight: 0.15 }],
    evidence: '0 check-ins in 47 days via linked bank transaction pattern.', modelVersion: 'GrowthForecast v3.2', auditId: 'GV-2026-0216-R04'
  },
  {
    rank: 5, title: 'Open high-yield savings account', description: 'Current savings earning 0.5% APY. HYSA offers 4.8% APY on same FDIC-insured deposits. Passive income boost.', category: 'Savings', difficulty: 'Easy', monthlySavings: 85, annualSavings: 1020, confidence: 0.91,
    shapFactors: [{ name: 'Rate differential', weight: 0.55 }, { name: 'FDIC coverage', weight: 0.25 }, { name: 'Liquidity match', weight: 0.20 }],
    evidence: 'APY comparison across top 15 HYSA providers as of Feb 2026.', modelVersion: 'GrowthForecast v3.2', auditId: 'GV-2026-0216-R05'
  },
  {
    rank: 6, title: 'Negotiate internet bill', description: 'Current plan $89/mo is $45 above market rate for equivalent 500Mbps service in your area.', category: 'Savings', difficulty: 'Easy', monthlySavings: 45, annualSavings: 540, confidence: 0.89,
    shapFactors: [{ name: 'Market comparison', weight: 0.50 }, { name: 'Loyalty duration', weight: 0.30 }, { name: 'Competitor offers', weight: 0.20 }],
    evidence: 'Price comparison across 4 ISPs in your zip code.', modelVersion: 'GrowthForecast v3.2', auditId: 'GV-2026-0216-R06'
  },
  {
    rank: 7, title: 'Balance transfer credit card', description: 'Transfer $4,200 balance from 22.9% APR card to 0% intro APR for 18 months. Save $120/mo in interest.', category: 'Debt', difficulty: 'Medium', monthlySavings: 120, annualSavings: 1440, confidence: 0.83,
    shapFactors: [{ name: 'Interest savings', weight: 0.48 }, { name: 'Balance amount', weight: 0.32 }, { name: 'Credit utilization', weight: 0.20 }],
    evidence: 'Pre-qualified offers detected from 3 issuers for your profile.', modelVersion: 'GrowthForecast v3.2', auditId: 'GV-2026-0216-R07'
  },
  {
    rank: 8, title: 'Side income from skills', description: 'Your professional skills (data analysis, Python) have high freelance demand. Estimated $200/mo from 5h/week.', category: 'Income', difficulty: 'Hard', monthlySavings: 200, annualSavings: 2400, confidence: 0.72,
    shapFactors: [{ name: 'Skill demand', weight: 0.45 }, { name: 'Market rate', weight: 0.35 }, { name: 'Time availability', weight: 0.20 }],
    evidence: 'Freelance market analysis from 3 platforms for your skill set.', modelVersion: 'GrowthForecast v3.2', auditId: 'GV-2026-0216-R08'
  }];


const categoryColors: Record<Exclude<Category, 'All'>, string> = { Savings: 'var(--engine-protect)', Debt: 'var(--state-critical)', Income: 'var(--engine-dashboard)', Investment: 'var(--engine-grow)' };
const difficultyColors: Record<Difficulty, { text: string; bg: string; }> = {
  Easy: { text: 'var(--engine-protect)', bg: 'rgba(34,197,94,0.15)' },
  Medium: { text: 'var(--engine-execute)', bg: 'rgba(234,179,8,0.15)' },
  Hard: { text: 'var(--state-critical)', bg: 'rgba(var(--state-critical-rgb),0.15)' }
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export function GrowRecommendations() {
  usePageTitle('Recommendations');
  const [sort, setSort] = useState<SortMode>('Highest Impact');
  const [category, setCategory] = useState<Category>('All');
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleExpand = (rank: number) => setExpanded((prev) => ({ ...prev, [rank]: !prev[rank] }));

  const filtered = recommendations.
    filter((r) => category === 'All' || r.category === category).
    sort((a, b) => {
      if (sort === 'Highest Impact') return b.monthlySavings - a.monthlySavings;
      if (sort === 'Highest Confidence') return b.confidence - a.confidence;
      const diffOrder: Record<Difficulty, number> = { Easy: 0, Medium: 1, Hard: 2 };
      return diffOrder[a.difficulty] - diffOrder[b.difficulty];
    });
  const totalMonthlyImpact = recommendations.reduce((sum, rec) => sum + rec.monthlySavings, 0);
  const totalAnnualImpact = recommendations.reduce((sum, rec) => sum + rec.annualSavings, 0);
  const highConfidenceCount = recommendations.filter((rec) => rec.confidence >= 0.85).length;
  const actionableNowCount = recommendations.filter((rec) => rec.confidence >= 0.9).length;
  const avgConfidence = (recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / recommendations.length).toFixed(2);
  const impactByCategory = {
    Savings: recommendations.filter((rec) => rec.category === 'Savings').reduce((sum, rec) => sum + rec.monthlySavings, 0),
    Investment: recommendations.filter((rec) => rec.category === 'Investment').reduce((sum, rec) => sum + rec.monthlySavings, 0),
    Debt: recommendations.filter((rec) => rec.category === 'Debt').reduce((sum, rec) => sum + rec.monthlySavings, 0),
    Income: recommendations.filter((rec) => rec.category === 'Income').reduce((sum, rec) => sum + rec.monthlySavings, 0)
  };
  const maxCategoryImpact = Math.max(...Object.values(impactByCategory), 1);

  const sortOptions: SortMode[] = ['Highest Impact', 'Highest Confidence', 'Easiest'];
  const categoryOptions: Category[] = ['All', 'Savings', 'Debt', 'Income', 'Investment'];

  return (
    <div className="relative min-h-screen w-full">
      <AuroraPulse color="var(--engine-grow)" intensity="subtle" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: 'var(--engine-grow)', color: '#fff' }}>

        Skip to main content
      </a>

      {/* Sticky back nav */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-2xl border-b border-white/[0.06] bg-black/40"
        aria-label="Breadcrumb">
        <div className="mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center gap-2" style={{ maxWidth: '1280px' }}>
          <Link to="/grow" className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity bg-white/[0.05] border border-white/[0.05] rounded-xl px-4 py-2" style={{ color: 'var(--engine-grow)' }}>
            <ArrowLeft className="h-4 w-4" />
            Back to Grow
          </Link>
        </div>
      </nav>

      <motion.div
        id="main-content"
        className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8"
        style={{ maxWidth: '1280px' }}
        variants={stagger}
        initial="hidden"
        animate="visible"
        role="main">

        {/* Hero */}
        <motion.div variants={fadeUp} className="flex flex-col gap-6 mb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--engine-grow)]/20 bg-[var(--engine-grow)]/10 text-[var(--engine-grow)] text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                <Lightbulb size={12} /> Grow · Recommendations
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight text-white mb-2 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Growth Recommendations
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed tracking-wide mt-2">
              <span className="font-medium text-white/80">{recommendations.length}</span> AI-generated recommendations · Est. <span className="text-[var(--engine-grow)] font-mono font-medium drop-shadow-[0_0_8px_rgba(139,92,246,0.4)] px-1">+${totalMonthlyImpact}/mo</span> total impact
            </p>
          </div>
        </motion.div>

        {/* KPI bar */}
        <motion.div variants={fadeUp} className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Total impact', value: `+$${totalMonthlyImpact}/mo`, color: 'var(--engine-grow)' },
              { label: 'High conf.', value: String(highConfidenceCount), color: 'var(--engine-protect)' },
              { label: 'Actionable', value: String(actionableNowCount), color: 'var(--engine-dashboard)' },
              { label: 'Avg conf.', value: `${(Number(avgConfidence) * 100).toFixed(0)}%`, color: 'var(--engine-execute)' }].
              map((kpi) => (
                <Surface key={kpi.label} interactive className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col justify-center transition-all hover:bg-white/[0.02]" as={motion.div} padding="none">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
                  <div className="relative z-10 flex flex-col gap-1.5">
                    <p className="text-[10px] md:text-xs uppercase tracking-widest font-semibold text-white/50">{kpi.label}</p>
                    <p className="text-2xl md:text-3xl font-light font-mono text-white/90" style={{ textShadow: `0 0 20px ${kpi.color}40`, color: kpi.color }}>{kpi.value}</p>
                  </div>
                </Surface>
              ))}
          </div>
        </motion.div>

        {/* Filter row */}
        <motion.div variants={fadeUp} className="flex flex-col gap-4 py-2 md:flex-row md:items-center md:justify-between border-y border-white/[0.06] mt-4 mb-2">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <Filter className="h-4 w-4 text-white/30 shrink-0" />
            {sortOptions.map((s) =>
              <Button
                key={s}
                onClick={() => setSort(s)}
                variant="glass"
                engine="grow"
                size="sm"
                className={`whitespace-nowrap rounded-2xl text-xs font-semibold uppercase tracking-widest transition-all px-4 py-2 border ${sort === s ? 'text-[var(--engine-grow)] border-[var(--engine-grow)]/40 bg-[var(--engine-grow)]/10 shadow-[0_0_10px_rgba(139,92,246,0.2)]' : 'text-white/50 border-white/10 hover:bg-white/10'}`}>
                {s}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categoryOptions.map((c) =>
              <Button
                key={c}
                onClick={() => setCategory(c)}
                variant="glass"
                engine="grow"
                size="sm"
                className={`whitespace-nowrap rounded-2xl text-xs font-semibold uppercase tracking-widest transition-all px-4 py-2 border ${category === c ? 'text-[var(--engine-grow)] border-[var(--engine-grow)]/40 bg-[var(--engine-grow)]/10 shadow-[0_0_10px_rgba(139,92,246,0.2)]' : 'text-white/50 border-white/10 hover:bg-white/10'}`}>
                {c}
              </Button>
            )}
          </div>
        </motion.div>

        {/* 2-column layout */}
        <div className="flex flex-col lg:flex-row gap-8 mt-2">
          {/* Main feed */}
          <div className="flex-1 min-w-0 lg:w-2/3 flex flex-col gap-6">
            {filtered.map((rec) => (
              <Surface
                key={rec.rank}
                variants={fadeUp}
                interactive
                className="relative overflow-hidden rounded-[32px] p-6 lg:p-10 backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col transition-all hover:bg-white/[0.02]"
                style={{ border: '1px solid rgba(255,255,255,0.08)', borderLeftWidth: 4, borderLeftColor: 'var(--engine-grow)' }}
                as={motion.div}
                padding="none">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-grow)]/5 to-transparent pointer-events-none" />

                {/* Top row */}
                <div className="relative z-10 flex flex-wrap items-center gap-3 mb-6 border-b border-white/[0.06] pb-4">
                  <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shadow-[0_0_10px_rgba(139,92,246,0.3)]" style={{ background: 'rgba(139,92,246,0.2)', color: 'var(--engine-grow)' }}>
                    #{rec.rank}
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-inner border border-white/[0.05]" style={{ color: categoryColors[rec.category], background: `${categoryColors[rec.category]}15` }}>
                    {rec.category}
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-inner border border-white/[0.05]" style={{ color: difficultyColors[rec.difficulty].text, background: difficultyColors[rec.difficulty].bg }}>
                    {rec.difficulty}
                  </span>
                </div>

                {/* Title + description */}
                <div className="relative z-10 mb-8 max-w-3xl">
                  <h3 className="text-2xl md:text-3xl font-light text-white mb-3 leading-snug tracking-wide">{rec.title}</h3>
                  <p className="text-base text-white/50 leading-relaxed tracking-wide">{rec.description}</p>
                </div>

                {/* Impact metrics */}
                <div className="relative z-10 flex flex-wrap items-center gap-6 mb-8 bg-white/[0.02] p-4 rounded-2xl border border-white/[0.04]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--engine-grow)]/20 border border-[var(--engine-grow)]/30 flex items-center justify-center text-[var(--engine-grow)] shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                      <DollarSign size={18} />
                    </div>
                    <span className="text-2xl font-light font-mono text-[var(--engine-grow)] drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">+${rec.monthlySavings}<span className="text-sm text-[var(--engine-grow)]/60">/mo</span></span>
                  </div>
                  <div className="w-px h-8 bg-white/[0.08]" />
                  <span className="text-base font-mono text-white/70">${rec.annualSavings.toLocaleString()}/yr</span>
                  <div className="w-px h-8 bg-white/[0.08]" />
                  <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
                    <span className="text-xs text-white/50 tracking-widest uppercase font-semibold">Confidence: {(rec.confidence * 100).toFixed(0)}%</span>
                    <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(139,92,246,0.6)]" style={{ width: `${rec.confidence * 100}%`, background: 'var(--engine-grow)' }} />
                    </div>
                  </div>
                </div>

                {/* Expandable section */}
                <Button
                  onClick={() => toggleExpand(rec.rank)}
                  variant="ghost"
                  engine="grow"
                  className="relative z-10 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors mb-4 !px-0 !h-auto !min-h-0 bg-transparent hover:bg-transparent"
                  aria-expanded={!!expanded[rec.rank]}>

                  {expanded[rec.rank] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {expanded[rec.rank] ? 'Hide details' : 'Show SHAP factors & evidence'}
                </Button>

                {expanded[rec.rank] &&
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative z-10 mb-6 space-y-4 pt-4 border-t border-white/[0.06]">

                    {/* SHAP factors */}
                    <div className="space-y-3">
                      {rec.shapFactors.map((f) =>
                        <div key={f.name} className="flex items-center gap-4">
                          <span className="text-xs font-medium text-white/60 w-36 shrink-0 truncate tracking-wide">{f.name}</span>
                          <div className="flex-1 h-2 rounded-full bg-white/[0.05] overflow-hidden">
                            <div className="h-full rounded-full shadow-[0_0_8px_rgba(139,92,246,0.5)]" style={{ width: `${f.weight * 100}%`, background: 'var(--engine-grow)', opacity: 0.8 }} />
                          </div>
                          <span className="text-xs font-mono text-white/50 w-10 text-right">{f.weight.toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    {/* Evidence */}
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 mt-4">
                      <p className="text-xs leading-relaxed text-white/50 italic">{rec.evidence}</p>
                    </div>

                    {/* Model + audit */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest font-mono text-white/30 bg-white/[0.05] border border-white/[0.05]">{rec.modelVersion}</span>
                      <span className="px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest font-mono text-white/30 bg-white/[0.05] border border-white/[0.05]">{rec.auditId}</span>
                    </div>
                  </motion.div>
                }

                {/* Action row */}
                <div className="relative z-10 flex flex-wrap gap-4 mt-6 pt-6 border-t border-white/[0.06]">
                  <ButtonLink to="/execute" variant="primary" engine="dashboard" size="lg" className="flex items-center gap-2 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-all bg-gradient-to-r from-[var(--engine-dashboard)] to-blue-400 text-black font-bold tracking-wide border-none px-8">
                    <Send size={18} />
                    Add to Execute
                  </ButtonLink>
                  <Button variant="glass" engine="grow" size="lg" className="flex items-center gap-2 rounded-2xl px-8 border border-white/[0.1] hover:bg-white/[0.05] transition-all font-semibold tracking-wide shadow-lg backdrop-blur-md">
                    <X size={18} />
                    Dismiss
                  </Button>
                </div>
              </Surface>
            ))}
          </div>

          {/* Side rail */}
          <aside className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6" aria-label="Recommendations sidebar">
            <div className="sticky top-24 flex flex-col gap-6">
              {/* Summary */}
              <Surface interactive className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-2 transition-all hover:bg-white/[0.02]" as={motion.div} padding="none">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-grow)]/5 to-transparent pointer-events-none" />
                <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest border-b border-white/[0.06] pb-4 mb-4 relative z-10">Summary</h3>
                <div className="space-y-4 relative z-10">
                  {[
                    { label: 'Monthly impact', value: `$${totalMonthlyImpact}`, color: 'var(--engine-grow)' },
                    { label: 'Annual impact', value: `$${totalAnnualImpact.toLocaleString()}`, color: 'var(--engine-grow)' },
                    { label: 'Actions pending', value: String(actionableNowCount), color: 'var(--engine-dashboard)' },
                    { label: 'Confidence avg', value: `${(Number(avgConfidence) * 100).toFixed(0)}%`, color: 'var(--engine-protect)' }].
                    map((s) => (
                      <div key={s.label} className="flex justify-between items-center">
                        <span className="text-sm text-white/60 tracking-wide font-medium">{s.label}</span>
                        <span className="text-base font-mono font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ color: s.color }}>{s.value}</span>
                      </div>
                    ))}
                </div>
              </Surface>

              {/* Impact breakdown */}
              <Surface interactive className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-2 transition-all hover:bg-white/[0.02]" as={motion.div} padding="none">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-protect)]/5 to-transparent pointer-events-none" />
                <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest border-b border-white/[0.06] pb-4 mb-4 relative z-10">Impact Breakdown</h3>
                <div className="space-y-5 relative z-10">
                  {[
                    { label: 'Savings', amount: impactByCategory.Savings, max: maxCategoryImpact, color: 'var(--engine-protect)' },
                    { label: 'Investment', amount: impactByCategory.Investment, max: maxCategoryImpact, color: 'var(--engine-grow)' },
                    { label: 'Debt', amount: impactByCategory.Debt, max: maxCategoryImpact, color: 'var(--state-critical)' },
                    { label: 'Income', amount: impactByCategory.Income, max: maxCategoryImpact, color: 'var(--engine-dashboard)' }].
                    map((b) => (
                      <div key={b.label}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white/60 font-medium tracking-wide uppercase text-xs">{b.label}</span>
                          <span className="text-white/80 font-mono font-bold">${b.amount}</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden border border-white/[0.02]">
                          <div className="h-full rounded-full shadow-[0_0_10px_currentColor]" style={{ width: `${b.amount / b.max * 100}%`, background: b.color, color: b.color }} />
                        </div>
                      </div>
                    ))}
                </div>
              </Surface>

              {/* AI Analysis */}
              <Surface interactive className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-4 transition-all hover:bg-white/[0.02]" style={{ border: '1px solid rgba(255,255,255,0.08)', borderLeftWidth: 4, borderLeftColor: 'var(--engine-grow)' }} as={motion.div} padding="none">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-grow)]/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center gap-3 border-b border-white/[0.06] pb-4 mb-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-[0_0_10px_rgba(139,92,246,0.3)]" style={{ background: 'rgba(139,92,246,0.2)', color: 'var(--engine-grow)' }}><Sparkles size={16} /></div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--engine-grow)] drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]">AI Analysis</span>
                </div>
                <p className="relative z-10 text-base font-light text-white/80 leading-relaxed tracking-wide">
                  Your top opportunity is subscription consolidation — <strong className="text-white font-medium">3 overlapping services</strong> total <span className="font-mono text-[var(--engine-grow)] font-bold drop-shadow-[0_0_5px_rgba(139,92,246,0.4)]">$140/mo</span>.
                </p>
                <p className="relative z-10 text-[10px] uppercase tracking-widest font-mono text-white/30 pt-2 border-t border-white/[0.04]">
                  ScenarioEngine v1.4<br />GV-2026-0216-GROW
                </p>
              </Surface>
            </div>
          </aside>
        </div>

        <GovernFooter auditId={GOVERNANCE_META['/grow/recommendations'].auditId} pageContext={GOVERNANCE_META['/grow/recommendations'].pageContext} />
      </motion.div>
    </div>);

}

export default GrowRecommendations;