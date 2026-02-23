import { motion } from "framer-motion";
import { Link } from '@/router';
import { TrendingUp } from "lucide-react";
import {
  ComposedChart, Line, XAxis, YAxis, Tooltip, ReferenceDot, Label,
  ResponsiveContainer
} from 'recharts';
import { EngineBadge, ConfidenceIndicator } from '@/components/poseidon';
import { getMotionPreset } from '@/lib/motion-presets';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE, PAGE_HEADING_CLASS, PAGE_HEADING_STYLE } from '@/lib/page-layout';
import { usePageTitle } from '@/hooks/use-page-title';
import { RECOMMENDATIONS_SUMMARY } from './grow/recommendation-detail-data';

/* ── 3-Year Growth Simulation Data ──
   Base: $200k current assets
   Status Quo: 2% annual growth, no additional savings
   AI Optimized: Base assets at same 2% + $612/mo savings invested at 7% market return
   Low/High: savings at 4% / 10%, base stays at 2%
── */
const GROWTH_SIMULATION_DATA = [
  { year: 'Now', baseline: 200000, aiOptimized: 200000, low: 200000, high: 200000 },
  { year: '1Y',  baseline: 204000, aiOptimized: 211584, low: 211480, high: 211690 },
  { year: '2Y',  baseline: 208080, aiOptimized: 223797, low: 223345, high: 224266 },
  { year: '3Y',  baseline: 212242, aiOptimized: 236679, low: 235609, high: 237812 },
];

const FINAL_DATA = GROWTH_SIMULATION_DATA[GROWTH_SIMULATION_DATA.length - 1];
const formatDollar = (v: number) => `$${v.toLocaleString()}`;
const formatDollarK = (v: number) => `$${Math.round(v / 1000)}k`;

interface TooltipPayloadEntry {
  payload: (typeof GROWTH_SIMULATION_DATA)[number];
}

function SimulationTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadEntry[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#0F1D32]/95 backdrop-blur-md px-4 py-3 shadow-xl text-xs">
      <p className="font-semibold text-white/90 mb-2">{label}</p>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#94A3B8]" />
          <span className="text-white/50">Status Quo (Baseline):</span>
          <span className="ml-auto font-mono text-white/90">{formatDollar(data.baseline)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--engine-grow)]" />
          <span className="text-white/50">AI Optimized:</span>
          <span className="ml-auto font-mono text-[var(--engine-grow)]">{formatDollar(data.aiOptimized)}</span>
        </div>
      </div>
    </div>
  );
}


export default function GrowPage() {
  usePageTitle('Grow Engine');
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  return (
    <>

      <motion.div
        id="main-content"
        className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 md:gap-8`}
        style={PAGE_CONTENT_STYLE}
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariant}>

        {/* ── Dashboard Hero ── */}
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6">
          <motion.div variants={fadeUpVariant} className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-2">
              <EngineBadge engine="grow" icon={TrendingUp} label="Engine status: Good" />
            </div>
            <h1 className={`${PAGE_HEADING_CLASS} mb-2`} style={PAGE_HEADING_STYLE}>
              Growth Plan{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">Optimized</span>
            </h1>
          </motion.div>

        </motion.section>

        {/* ── P3: Forecast Preview ── */}
        <div className="mb-12">
          {/* Asset Growth Simulation */}
          <motion.div variants={fadeUpVariant} className="glass-card rounded-2xl md:rounded-[32px] p-5 md:p-8 lg:p-12 flex flex-col transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-grow)]/5 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                <h3 className="text-lg md:text-xl font-light tracking-tight text-white/90">
                  Asset Growth Simulation
                </h3>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-[#94A3B8]">
                <span className="flex items-center gap-2">
                  <span className="h-[2px] w-4 rounded-full bg-[#94A3B8] inline-block" style={{ borderTop: '2px dashed #94A3B8', height: 0 }} />
                  Status Quo (Baseline)
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-[2px] w-4 rounded-full bg-[var(--engine-grow)] inline-block" />
                  AI Optimized Scenario
                </span>
              </div>

              {/* Chart */}
              <div className="h-[280px] md:h-[360px]" role="img" aria-label="Asset growth simulation comparing baseline savings with AI-optimized scenario over 3 years">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={GROWTH_SIMULATION_DATA} margin={{ top: 20, right: 65, left: 5, bottom: 5 }}>
                    <XAxis
                      dataKey="year"
                      tick={{ fill: '#64748B', fontSize: 11 }}
                      axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#64748B', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      domain={[198000, 240000]}
                      ticks={[200000, 210000, 220000, 230000, 240000]}
                    />
                    <Tooltip content={<SimulationTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.08)' }} />
                    {/* Baseline line */}
                    <Line
                      type="monotone"
                      dataKey="baseline"
                      stroke="#94A3B8"
                      strokeWidth={2}
                      strokeDasharray="6 3"
                      dot={{ r: 4, fill: '#0F1D32', stroke: '#94A3B8', strokeWidth: 2, strokeDasharray: 'none' }}
                      activeDot={{ r: 5, fill: '#94A3B8', strokeDasharray: 'none' }}
                      isAnimationActive={false}
                    />
                    {/* AI Optimized line */}
                    <Line
                      type="monotone"
                      dataKey="aiOptimized"
                      stroke="var(--engine-grow)"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#0F1D32', stroke: 'var(--engine-grow)', strokeWidth: 2 }}
                      activeDot={{ r: 5, fill: 'var(--engine-grow)' }}
                      isAnimationActive={false}
                    />
                    {/* End-value labels inside chart */}
                    <ReferenceDot x={FINAL_DATA.year} y={FINAL_DATA.aiOptimized} r={0} ifOverflow="extendDomain">
                      <Label value={formatDollarK(FINAL_DATA.aiOptimized)} position="right" offset={8} fill="#8B5CF6" fontSize={13} fontWeight={600} fontFamily="var(--font-mono, ui-monospace, monospace)" />
                    </ReferenceDot>
                    <ReferenceDot x={FINAL_DATA.year} y={FINAL_DATA.baseline} r={0} ifOverflow="extendDomain">
                      <Label value={formatDollarK(FINAL_DATA.baseline)} position="right" offset={8} fill="#64748B" fontSize={12} fontFamily="var(--font-mono, ui-monospace, monospace)" />
                    </ReferenceDot>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

            </div>
          </motion.div>
        </div>

        {/* ── AI Recommendations List ── */}
        <motion.section
          variants={staggerContainerVariant}
          className="flex flex-col gap-4 mb-12"
          aria-label="AI Recommendations"
        >
          <motion.div variants={fadeUpVariant} className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50">
              AI Recommendations
              <span className="ml-2 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-[var(--engine-grow)]/15 text-[var(--engine-grow)] text-[10px] font-bold tabular-nums">
                {RECOMMENDATIONS_SUMMARY.length}
              </span>
            </h2>
          </motion.div>

          <div className="flex flex-col gap-3">
            {RECOMMENDATIONS_SUMMARY.map((rec) => (
              <Link key={rec.rank} to={`/grow/recommendation?id=${rec.rank}`} className="block">
              <motion.div
                variants={fadeUpVariant}
                className="glass-card glass-card-overlay rounded-2xl p-5 md:p-6 flex items-start gap-4 transition-colors cursor-pointer"
              >
                {/* Rank badge */}
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full border border-[var(--engine-grow)]/30 bg-[var(--engine-grow)]/10 flex items-center justify-center text-sm font-semibold tabular-nums"
                  style={{ color: 'var(--engine-grow)' }}
                >
                  {rec.rank}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <p className="text-sm md:text-base font-semibold text-white/90 leading-snug">{rec.title}</p>
                  <p className="text-xs text-white/40 flex flex-wrap items-center gap-x-1.5">
                    <span className="font-mono font-semibold" style={{ color: 'var(--engine-grow)' }}>${rec.monthly}/mo</span>
                    <span className="text-white/20">&middot;</span>
                    <span className="font-mono">${rec.annual.toLocaleString()}/yr</span>
                  </p>
                  <ConfidenceIndicator value={rec.confidence} accentColor="var(--engine-grow)" format="percent" />
                </div>
              </motion.div>
              </Link>
            ))}
          </div>
        </motion.section>

      </motion.div>
    </>
  );
}
