import { motion } from 'framer-motion';
import { LayoutDashboard, Sparkles, ChevronRight, Info } from 'lucide-react';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } },
};

export function HeroSection() {
  return (
    <motion.section
      className="hero-section"
      variants={stagger}
      initial="hidden"
      animate="visible"
      aria-label="Dashboard overview"
    >
      {/* Kicker badge */}
      <motion.div variants={fadeUp} className="hero-kicker">
        <span className="hero-kicker__icon">
          <LayoutDashboard size={14} />
        </span>
        <span>Dashboard</span>
      </motion.div>

      {/* Headline */}
      <motion.h1 variants={fadeUp} className="hero-headline">
        Good morning. System confidence: <span className="hero-headline__accent">0.92</span> across 4 engines.
      </motion.h1>

      {/* Subline */}
      <motion.p variants={fadeUp} className="hero-subline">
        One unresolved alert. Three actions queued. Cash buffer at 14 days.
      </motion.p>

      {/* AI insight banner */}
      <motion.div variants={fadeUp} className="hero-insight glass-surface" role="status">
        <div className="hero-insight__icon">
          <Sparkles size={18} />
        </div>
        <div className="hero-insight__body">
          <p className="hero-insight__text">
            <strong>Top recommendation:</strong> Consolidate 3 overlapping subscriptions — projected save $140/mo (92% confidence)
          </p>
        </div>
        <button className="hero-insight__cta" type="button">
          Review in Execute
          <ChevronRight size={14} />
        </button>
      </motion.div>

      {/* Proof line */}
      <motion.div variants={fadeUp} className="hero-proof" role="status" aria-label="Engine confidence scores">
        <span className="hero-proof__label">Composite confidence 0.92</span>
        <span className="hero-proof__sep" aria-hidden="true">|</span>
        <span style={{ color: 'var(--engine-protect)' }}>Protect 0.94</span>
        <span className="hero-proof__sep" aria-hidden="true">|</span>
        <span style={{ color: 'var(--engine-grow)' }}>Grow 0.89</span>
        <span className="hero-proof__sep" aria-hidden="true">|</span>
        <span style={{ color: 'var(--engine-execute)' }}>Execute 0.91</span>
        <span className="hero-proof__sep" aria-hidden="true">|</span>
        <span style={{ color: 'var(--engine-govern)' }}>Govern 0.97</span>
        <button className="hero-proof__info" type="button" aria-label="About confidence scoring">
          <Info size={13} />
        </button>
      </motion.div>
    </motion.section>
  );
}
