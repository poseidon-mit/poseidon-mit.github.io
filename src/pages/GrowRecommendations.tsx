import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lightbulb, Sparkles, DollarSign, ChevronDown, ChevronUp, Send, X, Filter } from 'lucide-react';
import { Link } from '@/router';
import { usePageTitle } from '@/hooks/use-page-title';

import { EngineBadge, KpiCard } from '@/components/poseidon';
import { getMotionPreset, accordionVariants, accordionTransition } from '@/lib/motion-presets';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE, PAGE_HEADING_CLASS, PAGE_HEADING_STYLE } from '@/lib/page-layout';
import { RECOMMENDATIONS_FOR_LIST } from './grow/recommendation-detail-data';

/* ═══════════════════════════════════════════
   DATA — sourced from recommendation-detail-data.ts (SSOT)
   ═══════════════════════════════════════════ */

type Category = 'All' | 'Savings' | 'Debt' | 'Income' | 'Investment';
type SortMode = 'Highest Impact' | 'Highest Confidence' | 'Easiest';
type Difficulty = 'Easy' | 'Medium' | 'Hard';


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
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  const [sort, setSort] = useState<SortMode>('Highest Impact');
  const [category, setCategory] = useState<Category>('All');
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleExpand = (rank: number) => setExpanded((prev) => ({ ...prev, [rank]: !prev[rank] }));

  const filtered = RECOMMENDATIONS_FOR_LIST.
    filter((r) => category === 'All' || r.category === category).
    sort((a, b) => {
      if (sort === 'Highest Impact') return b.monthlySavings - a.monthlySavings;
      if (sort === 'Highest Confidence') return b.confidence - a.confidence;
      const diffOrder: Record<Difficulty, number> = { Easy: 0, Medium: 1, Hard: 2 };
      return diffOrder[a.difficulty] - diffOrder[b.difficulty];
    });
  const totalMonthlyImpact = RECOMMENDATIONS_FOR_LIST.reduce((sum, rec) => sum + rec.monthlySavings, 0);
  const totalAnnualImpact = RECOMMENDATIONS_FOR_LIST.reduce((sum, rec) => sum + rec.annualSavings, 0);
  const highConfidenceCount = RECOMMENDATIONS_FOR_LIST.filter((rec) => rec.confidence >= 0.85).length;
  const actionableNowCount = RECOMMENDATIONS_FOR_LIST.filter((rec) => rec.confidence >= 0.9).length;
  const avgConfidence = (RECOMMENDATIONS_FOR_LIST.reduce((sum, rec) => sum + rec.confidence, 0) / RECOMMENDATIONS_FOR_LIST.length).toFixed(2);
  const impactByCategory = {
    Savings: RECOMMENDATIONS_FOR_LIST.filter((rec) => rec.category === 'Savings').reduce((sum, rec) => sum + rec.monthlySavings, 0),
    Investment: RECOMMENDATIONS_FOR_LIST.filter((rec) => rec.category === 'Investment').reduce((sum, rec) => sum + rec.monthlySavings, 0),
    Debt: RECOMMENDATIONS_FOR_LIST.filter((rec) => rec.category === 'Debt').reduce((sum, rec) => sum + rec.monthlySavings, 0),
    Income: RECOMMENDATIONS_FOR_LIST.filter((rec) => rec.category === 'Income').reduce((sum, rec) => sum + rec.monthlySavings, 0)
  };
  const maxCategoryImpact = Math.max(...Object.values(impactByCategory), 1);

  const sortOptions: SortMode[] = ['Highest Impact', 'Highest Confidence', 'Easiest'];
  const categoryOptions: Category[] = ['All', 'Savings', 'Debt', 'Income', 'Investment'];

  return (
    <>

      {/* Sticky back nav */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-2xl border-b border-white/[0.06] bg-black/40"
        aria-label="Breadcrumb">
        <div className={`${PAGE_CONTENT_CLASS} h-16 flex items-center gap-2`} style={PAGE_CONTENT_STYLE}>
          <Link to="/grow" className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity bg-white/[0.05] border border-white/[0.05] rounded-xl px-4 py-2" style={{ color: 'var(--engine-grow)' }}>
            <ArrowLeft className="h-4 w-4" />
            Back to Grow
          </Link>
        </div>
      </nav>

      <motion.div
        id="main-content"
        className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 md:gap-8 py-6 md:py-8`}
        style={PAGE_CONTENT_STYLE}
        variants={staggerContainerVariant}
        initial="hidden"
        animate="visible"
        role="main">

        {/* Hero */}
        <motion.div variants={fadeUpVariant} className="flex flex-col gap-6 mb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-2">
              <EngineBadge engine="grow" icon={Lightbulb} label="Grow · Recommendations" />
            </div>
            <h1 className={`${PAGE_HEADING_CLASS} mb-2`} style={PAGE_HEADING_STYLE}>
              Growth Recommendations
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed tracking-wide mt-2">
              <span className="font-medium text-white/80">{RECOMMENDATIONS_FOR_LIST.length}</span> AI-generated recommendations · Est. <span className="text-[var(--engine-grow)] font-mono font-medium drop-shadow-[0_0_8px_rgba(139,92,246,0.4)] px-1">+${totalMonthlyImpact}/mo</span> total impact
            </p>
          </div>
        </motion.div>

        {/* KPI bar */}
        <motion.div variants={fadeUpVariant} className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Total impact', value: `+$${totalMonthlyImpact}/mo`, color: 'var(--engine-grow)' },
              { label: 'High conf.', value: String(highConfidenceCount), color: 'var(--engine-protect)' },
              { label: 'Actionable', value: String(actionableNowCount), color: 'var(--engine-dashboard)' },
              { label: 'Avg conf.', value: `${(Number(avgConfidence) * 100).toFixed(0)}%`, color: 'var(--engine-execute)' },
            ].map((kpi) => (
              <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} color={kpi.color} size="md" className="rounded-[32px] p-6 lg:p-8" />
            ))}
          </div>
        </motion.div>

        {/* Filter row */}
        <motion.div variants={fadeUpVariant} className="flex flex-col gap-4 py-2 md:flex-row md:items-center md:justify-between border-y border-white/[0.06] mt-4 mb-2">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <Filter className="h-4 w-4 text-white/30 shrink-0" />
            {sortOptions.map((s) =>
              <Button
                key={s}
                onClick={() => setSort(s)}
                variant="glass"
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
              <motion.div
                key={rec.rank}
                variants={fadeUpVariant}
                className="glass-card rounded-[32px] p-6 lg:p-10 flex flex-col transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.08)', borderLeftWidth: 4, borderLeftColor: 'var(--engine-grow)' }}
              >
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
                  className="relative z-10 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors mb-4 !px-0 !h-auto !min-h-0 bg-transparent hover:bg-transparent"
                  aria-expanded={!!expanded[rec.rank]}>

                  {expanded[rec.rank] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {expanded[rec.rank] ? 'Hide details' : 'Show AI decision drivers & evidence'}
                </Button>

                {expanded[rec.rank] &&
                  <motion.div
                    variants={accordionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={accordionTransition}
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
                  <Link to="/execute" className={cn(buttonVariants({ variant: "default", size: "lg" }), "flex items-center gap-2 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-all bg-gradient-to-r from-[var(--engine-dashboard)] to-blue-400 text-black font-bold tracking-wide border-none px-8")}>
                    <Send size={18} />
                    Add to Execute
                  </Link>
                  <Button variant="glass" size="lg" className="flex items-center gap-2 rounded-2xl px-8 border border-white/[0.1] hover:bg-white/[0.05] transition-all font-semibold tracking-wide shadow-lg backdrop-blur-md">
                    <X size={18} />
                    Dismiss
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Side rail */}
          <aside className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6" aria-label="Recommendations sidebar">
            <div className="sticky top-24 flex flex-col gap-6">
              {/* Summary */}
              <motion.div className="glass-card rounded-[32px] p-6 lg:p-8 flex flex-col gap-2 transition-colors">
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
              </motion.div>

              {/* Impact breakdown */}
              <motion.div className="glass-card rounded-[32px] p-6 lg:p-8 flex flex-col gap-2 transition-colors">
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
              </motion.div>

              {/* AI Analysis */}
              <motion.div className="glass-card rounded-[32px] p-6 lg:p-8 flex flex-col gap-4 transition-colors" style={{ border: '1px solid rgba(255,255,255,0.08)', borderLeftWidth: 4, borderLeftColor: 'var(--engine-grow)' }}>
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-grow)]/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center gap-3 border-b border-white/[0.06] pb-4 mb-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-[0_0_10px_rgba(139,92,246,0.3)]" style={{ background: 'rgba(139,92,246,0.2)', color: 'var(--engine-grow)' }}><Sparkles size={16} /></div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--engine-grow)] drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]">AI Analysis</span>
                </div>
                <p className="relative z-10 text-base font-light text-white/80 leading-relaxed tracking-wide">
                  Your top opportunity is <strong className="text-white font-medium">{RECOMMENDATIONS_FOR_LIST[0]?.title}</strong> — estimated <span className="font-mono text-[var(--engine-grow)] font-bold drop-shadow-[0_0_5px_rgba(139,92,246,0.4)]">${RECOMMENDATIONS_FOR_LIST[0]?.monthlySavings}/mo</span> impact.
                </p>
                <p className="relative z-10 text-[10px] uppercase tracking-widest font-mono text-white/30 pt-2 border-t border-white/[0.04]">
                  ScenarioEngine v1.4<br />GV-2026-0216-GROW
                </p>
              </motion.div>
            </div>
          </aside>
        </div>

      </motion.div>
    </>);

}

export default GrowRecommendations;
