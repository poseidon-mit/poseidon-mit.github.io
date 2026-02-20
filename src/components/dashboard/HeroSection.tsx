import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/motion-presets';
import { LayoutDashboard, Info } from 'lucide-react';
import { useRouter } from '../../router';
import { ViewModeToggle, CitationCard } from '@/components/poseidon';
import type { ViewMode } from '@/hooks/useViewMode';
import type { CitationSource } from '@/types/engine-data';


const dashboardCitations: CitationSource[] = [
  {
    id: 'dash-1',
    label: 'Subscription analysis',
    excerpt: '3 overlapping subscriptions detected — Adobe, Figma, Creative Cloud.',
    url: '/execute',
  },
  {
    id: 'dash-2',
    label: 'Cash flow model',
    excerpt: 'Projected $140/mo savings based on 90-day usage pattern.',
  },
];

interface HeroSectionProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function HeroSection({ viewMode, onViewModeChange }: HeroSectionProps) {
  const { navigate } = useRouter();
  return (
    <motion.section
      className="hero-section"
      variants={staggerContainer}
      aria-label="Dashboard overview"
    >
      {/* Kicker badge + ViewModeToggle */}
      <motion.div variants={fadeUp} className="flex items-center justify-between hero-kicker">
        <div className="flex items-center gap-2">
          <span className="hero-kicker__icon">
            <LayoutDashboard size={14} />
          </span>
          <span>Dashboard</span>
        </div>
        <ViewModeToggle value={viewMode} onChange={onViewModeChange} accentColor="#00F0FF" />
      </motion.div>

      {/* Headline */}
      <motion.h1 variants={fadeUp} className="hero-headline">
        Good morning. System confidence: <span className="hero-headline__accent">0.92</span> across 4 engines.
      </motion.h1>

      {/* Subline */}
      <motion.p variants={fadeUp} className="hero-subline">
        One unresolved alert. Three actions queued. Cash buffer at 14 days.
      </motion.p>

      {/* AI Insight — CitationCard */}
      <motion.div variants={fadeUp}>
        <CitationCard
          summary="Top recommendation: Consolidate 3 overlapping subscriptions — projected save $140/mo (92% confidence)"
          sources={dashboardCitations}
          confidence={0.92}
          accentColor="#00F0FF"
          viewMode={viewMode}
        />
      </motion.div>

      {/* Proof line */}
      <motion.div variants={fadeUp} className="hero-proof" role="status" aria-label="Engine confidence scores">
        <span className="hero-proof__label">System confidence 0.92</span>
        <span className="hero-proof__sep" aria-hidden="true">|</span>
        <span style={{ color: 'var(--engine-protect)' }}>Protect 0.94</span>
        <span className="hero-proof__sep" aria-hidden="true">|</span>
        <span style={{ color: 'var(--engine-grow)' }}>Grow 0.89</span>
        <span className="hero-proof__sep" aria-hidden="true">|</span>
        <span style={{ color: 'var(--engine-execute)' }}>Execute 0.91</span>
        <span className="hero-proof__sep" aria-hidden="true">|</span>
        <span style={{ color: 'var(--engine-govern)' }}>Govern 0.97</span>
        <button className="hero-proof__info" type="button" aria-label="About confidence scoring" onClick={() => navigate('/help')}>
          <Info size={13} />
        </button>
      </motion.div>
    </motion.section>
  );
}
