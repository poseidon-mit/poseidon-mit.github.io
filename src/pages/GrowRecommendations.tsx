import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lightbulb, Sparkles, DollarSign, ChevronDown, ChevronUp, Send, X, Filter } from 'lucide-react';
import { Link } from '../router';
import { usePageTitle } from '../hooks/use-page-title';
import { GovernFooter, AuroraPulse } from '@/components/poseidon';
import { GOVERNANCE_META } from '@/lib/governance-meta';
import { fadeUp, staggerContainer as stagger } from '@/lib/motion-presets';
import { Button, Surface } from '@/design-system';

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

type Category = 'All' | 'Savings' | 'Debt' | 'Income' | 'Investment';
type SortMode = 'Highest Impact' | 'Highest Confidence' | 'Easiest';
type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface ShapFactor {name: string;weight: number;}

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
const difficultyColors: Record<Difficulty, {text: string;bg: string;}> = {
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
        className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]"

        aria-label="Breadcrumb">
        
        <div className="mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center gap-2" style={{ maxWidth: '1280px' }}>
          <Link to="/grow" className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: 'var(--engine-grow)' }}>
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
        role="main">
        
        {/* Hero */}
        <motion.div variants={fadeUp} className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}>
              <Lightbulb className="h-4 w-4" style={{ color: 'var(--engine-grow)' }} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--engine-grow)' }}>
              Grow · Recommendations
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Growth Recommendations</h1>
          <p className="text-sm text-slate-400">
            {recommendations.length} AI-generated recommendations · Est. +${totalMonthlyImpact}/mo total impact · Updated 2h ago
          </p>
        </motion.div>

        {/* KPI bar */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
            { label: 'Total impact', value: `+$${totalMonthlyImpact}/mo`, color: 'var(--engine-grow)' },
            { label: 'High confidence', value: String(highConfidenceCount), color: 'var(--engine-protect)' },
            { label: 'Actionable now', value: String(actionableNowCount), color: 'var(--engine-dashboard)' },
            { label: 'Avg confidence', value: avgConfidence, color: 'var(--engine-execute)' }].
            map((kpi) => <Surface
              key={kpi.label} className="rounded-2xl" variant="glass" padding="md">
                <p className="text-xs text-white/40 mb-1">{kpi.label}</p>
                <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              </Surface>
            )}
          </div>
        </motion.div>

        {/* Filter row */}
        <motion.div variants={fadeUp} className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="h-4 w-4 text-white/30 shrink-0" />
            {sortOptions.map((s) =>
            <Button
              key={s}
              onClick={() => setSort(s)}
              variant="glass"
              engine="grow"
              size="sm"
              className={`whitespace-nowrap rounded-full text-xs font-medium transition-colors border ${sort === s ? 'text-violet-300 border-violet-500/40' : 'text-white/50 border-white/10 hover:bg-white/10'}`}>
              
                {s}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categoryOptions.map((c) =>
            <Button
              key={c}
              onClick={() => setCategory(c)}
              variant="glass"
              engine="grow"
              size="sm"
              className={`whitespace-nowrap rounded-full text-xs font-medium transition-colors border ${category === c ? 'text-violet-300 border-violet-500/40' : 'text-white/50 border-white/10 hover:bg-white/10'}`}>
              
                {c}
              </Button>
            )}
          </div>
        </motion.div>

        {/* 2-column layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main feed */}
          <div className="flex-1 min-w-0 lg:w-2/3 flex flex-col gap-4">
            {filtered.map((rec) => <Surface

              key={rec.rank}
              variants={fadeUp} className="rounded-2xl"

              style={{ borderLeftWidth: 3, borderLeftColor: 'var(--engine-grow)' }} variant="glass" padding="md" as={motion.div}>
              
                {/* Top row */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(139,92,246,0.2)', color: 'var(--engine-grow)' }}>
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
                    <DollarSign className="h-3.5 w-3.5" style={{ color: 'var(--engine-grow)' }} />
                    <span className="text-sm font-bold" style={{ color: 'var(--engine-grow)' }}>+${rec.monthlySavings}/mo</span>
                  </div>
                  <span className="text-xs text-white/50">${rec.annualSavings.toLocaleString()}/yr</span>
                  <span className="text-xs text-white/50">Confidence: {(rec.confidence * 100).toFixed(0)}%</span>
                </div>

                {/* Confidence bar */}
                <div className="h-1.5 rounded-full bg-white/10 mb-4">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${rec.confidence * 100}%`, background: 'var(--engine-grow)' }} />
                </div>

                {/* Expandable section */}
                <Button
                onClick={() => toggleExpand(rec.rank)}
                variant="ghost"
                engine="grow"
                className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white/70 transition-colors mb-3 !px-0 !h-auto !min-h-0"
                aria-expanded={!!expanded[rec.rank]}>
                
                  {expanded[rec.rank] ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  {expanded[rec.rank] ? 'Hide details' : 'Show SHAP factors & evidence'}
                </Button>

                {expanded[rec.rank] &&
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 space-y-3">
                
                    {/* SHAP factors */}
                    <div className="space-y-2">
                      {rec.shapFactors.map((f) =>
                  <div key={f.name} className="flex items-center gap-2">
                          <span className="text-xs text-white/50 w-32 shrink-0 truncate">{f.name}</span>
                          <div className="flex-1 h-1.5 rounded-full bg-white/10">
                            <div className="h-full rounded-full" style={{ width: `${f.weight * 100}%`, background: 'var(--engine-grow)', opacity: 0.7 }} />
                          </div>
                          <span className="text-xs text-white/40 w-10 text-right">{f.weight.toFixed(2)}</span>
                        </div>
                  )}
                    </div>

                    {/* Evidence */}
                    <p className="text-xs text-white/40 italic">{rec.evidence}</p>

                    {/* Model + audit */}
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-white/30 bg-white/5">{rec.modelVersion}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-white/30 bg-white/5">{rec.auditId}</span>
                    </div>
                  </motion.div>
              }

                {/* Action row */}
                <div className="flex gap-3">
                  <Button variant="glass" engine="grow" size="sm" className="flex items-center gap-1.5 rounded-lg text-xs">
                    <Send className="h-3.5 w-3.5" />
                    Add to Execute
                  </Button>
                  <Button variant="secondary" engine="grow" size="sm" className="flex items-center gap-1.5 rounded-lg text-xs">
                    <X className="h-3.5 w-3.5" />
                    Dismiss
                  </Button>
                </div>
              </Surface>
            )}
          </div>

          {/* Side rail */}
          <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-4" aria-label="Recommendations sidebar">
            {/* Summary */}
            <Surface className="rounded-2xl" variant="glass" padding="md">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">Summary</h3>
              <div className="space-y-3">
                {[
                { label: 'Monthly impact', value: `$${totalMonthlyImpact}`, color: 'var(--engine-grow)' },
                { label: 'Annual impact', value: `$${totalAnnualImpact.toLocaleString()}`, color: 'var(--engine-grow)' },
                { label: 'Actions pending', value: String(actionableNowCount), color: 'var(--engine-execute)' },
                { label: 'Confidence avg', value: avgConfidence, color: 'var(--engine-protect)' }].
                map((s) =>
                <div key={s.label} className="flex justify-between items-center">
                    <span className="text-xs text-white/50">{s.label}</span>
                    <span className="text-sm font-bold" style={{ color: s.color }}>{s.value}</span>
                  </div>
                )}
              </div>
            </Surface>

            {/* Impact breakdown */}
            <Surface className="rounded-2xl" variant="glass" padding="md">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">Impact Breakdown</h3>
              <div className="space-y-3">
                {[
                { label: 'Savings', amount: impactByCategory.Savings, max: maxCategoryImpact },
                { label: 'Investment', amount: impactByCategory.Investment, max: maxCategoryImpact },
                { label: 'Debt', amount: impactByCategory.Debt, max: maxCategoryImpact },
                { label: 'Income', amount: impactByCategory.Income, max: maxCategoryImpact }].
                map((b) =>
                <div key={b.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/50">{b.label}</span>
                      <span className="text-white/70">${b.amount}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10">
                      <div className="h-full rounded-full" style={{ width: `${b.amount / b.max * 100}%`, background: 'var(--engine-grow)' }} />
                    </div>
                  </div>
                )}
              </div>
            </Surface>

            {/* AI Analysis */}
            <Surface className="rounded-2xl" style={{ borderLeftWidth: 3, borderLeftColor: 'var(--engine-grow)' }} variant="glass" padding="md">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold" style={{ background: 'rgba(139,92,246,0.2)', color: 'var(--engine-grow)' }}>AI</div>
                <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--engine-grow)' }} />
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                Your top opportunity is subscription consolidation — 3 overlapping services total $140/mo.
              </p>
              <p className="text-[10px] text-white/30 mt-2">ScenarioEngine v1.4 · GV-2026-0216-GROW</p>
            </Surface>
          </aside>
        </div>

        <GovernFooter auditId={GOVERNANCE_META['/grow/recommendations'].auditId} pageContext={GOVERNANCE_META['/grow/recommendations'].pageContext} />
      </motion.div>
    </div>);

}

export default GrowRecommendations;