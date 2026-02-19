import { motion } from 'framer-motion';
import { Link } from '@/router';
import { JETON_COPY } from '@/content/landing-copy-jeton';
import { Footer } from './Footer';
import { FeatureSection } from './FeatureSection';
import { HeroSection } from './HeroSection';
import { MenuOverlay } from './MenuOverlay';
import { JETON_EASING } from './jeton-config';

export function JetonLandingPage() {
  return (
    <>
      <MenuOverlay />

      <div className="overflow-x-clip bg-[#0B1221] text-white">
        <HeroSection />

        <div id="platform">
          <FeatureSection />
        </div>

        <section id="governance" className="px-6 py-28 md:px-8 md:py-36">
          <div className="mx-auto w-full max-w-7xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, ease: JETON_EASING }}
              className="text-xs font-medium tracking-[0.22em] text-white/55"
            >
              {JETON_COPY.governance.eyebrow}
            </motion.p>

            <div className="mt-6 space-y-2 font-display text-5xl font-semibold leading-[1.1] tracking-[-0.03em] md:text-7xl">
              <motion.p
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.72, ease: JETON_EASING }}
                className="text-sky-300"
              >
                {JETON_COPY.governance.words[0]}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.72, delay: 0.12, ease: JETON_EASING }}
                className="text-cyan-300"
              >
                {JETON_COPY.governance.words[1]}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.72, delay: 0.24, ease: JETON_EASING }}
                className="text-amber-300"
              >
                {JETON_COPY.governance.words[2]}
              </motion.p>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.42, ease: JETON_EASING }}
              className="mt-6 max-w-3xl text-base leading-[1.65] tracking-[0.01em] text-white/72 md:text-lg"
            >
              {JETON_COPY.governance.body}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.58, delay: 0.5, ease: JETON_EASING }}
              className="mt-8 inline-flex flex-wrap items-center gap-2 rounded-full border border-white/14 bg-white/5 px-5 py-2 text-xs text-white/65"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--state-healthy)]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--state-healthy)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--state-healthy)] animate-pulse" aria-hidden="true" />
                Live
              </span>
              {JETON_COPY.governance.proof}
            </motion.p>
          </div>
        </section>

        <section id="cta" className="px-6 pb-24 pt-4 md:px-8 md:pb-32">
          <div className="mx-auto w-full max-w-7xl rounded-[2rem] border border-white/14 bg-[radial-gradient(ellipse_at_15%_20%,rgba(0,240,255,0.12),transparent_58%),radial-gradient(ellipse_at_85%_90%,rgba(56,189,248,0.12),transparent_62%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] px-8 py-14 md:px-14 md:py-20">
            <h2 className="max-w-4xl text-balance font-display text-4xl font-semibold leading-[1.06] tracking-[-0.03em] md:text-6xl">
              {JETON_COPY.cta.titleA}
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-teal-300 bg-clip-text text-transparent">
                {JETON_COPY.cta.titleB}
              </span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-[1.65] tracking-[0.01em] text-white/72 md:text-lg">
              {JETON_COPY.cta.body}
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to="/signup"
                className="btn-liquid-glass inline-flex min-h-11 items-center justify-center rounded-full px-9 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[0.985]"
              >
                {JETON_COPY.cta.button}
              </Link>
              <p className="text-xs text-white/62">{JETON_COPY.cta.meta}</p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
