import {
  lazy,
  Suspense,
  useMemo,
  useState,
} from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Lock, PlayCircle, Shield, ShieldCheck } from 'lucide-react';
import { Link, useRouter } from '@/router';
import { JETON_COPY } from '@/content/landing-copy-jeton';
import { useJetonWebGLEnabled } from './hooks/useJetonWebGLEnabled';
import { JETON_EASING, JETON_WEBGL_DEFAULTS } from './jeton-config';

const ParticleWave = lazy(() => import('./effects/ParticleWave'));

export function HeroSection() {
  const [webglReady, setWebglReady] = useState(false);
  const webglEnabled = useJetonWebGLEnabled();
  const { navigate } = useRouter();

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 540], [1, 0.26]);

  const trustBadges = useMemo(
    () => [
      { icon: Lock, label: 'Bank-grade encryption' },
      { icon: Shield, label: 'GDPR ready' },
      { icon: ShieldCheck, label: 'SOC 2 Type II in progress' },
    ],
    [],
  );

  return (
    <section className="relative isolate flex min-h-screen items-center overflow-hidden bg-[#0B1221] px-6 pb-20 pt-28 md:px-8 md:pt-32">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(0,240,255,0.08),transparent_60%),radial-gradient(ellipse_at_85%_15%,rgba(56,189,248,0.16),transparent_58%),#0B1221] transition-opacity duration-[650ms] ${
          webglReady ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {webglEnabled ? (
        <div className={`pointer-events-none absolute inset-0 transition-opacity duration-[650ms] ${webglReady ? 'opacity-100' : 'opacity-0'}`}>
          <Suspense fallback={null}>
            <ParticleWave
              onReady={() => setWebglReady(true)}
              quality={JETON_WEBGL_DEFAULTS.quality}
              pointerIntensity={JETON_WEBGL_DEFAULTS.pointerIntensity}
            />
          </Suspense>
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0B1221]/35 via-transparent to-[#0B1221]/92" aria-hidden="true" />

      <motion.div style={{ opacity: heroOpacity }} className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 text-white">
        <motion.p
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.66, ease: JETON_EASING }}
          className="text-xs font-medium tracking-[0.24em] text-white/70"
        >
          {JETON_COPY.hero.eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 38 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: JETON_EASING }}
          className="max-w-5xl text-balance font-display text-[clamp(2.8rem,9vw,8rem)] font-semibold leading-[0.95] tracking-[-0.04em]"
        >
          {JETON_COPY.hero.titleA}
          <br />
          <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-teal-300 bg-clip-text text-transparent">
            {JETON_COPY.hero.titleB}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.82, delay: 0.2, ease: JETON_EASING }}
          className="max-w-2xl text-pretty text-lg leading-[1.65] tracking-[0.01em] text-white/78 md:text-xl"
        >
          {JETON_COPY.hero.body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.62, delay: 0.5, ease: JETON_EASING }}
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Link
            to="/signup"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 px-8 py-3 text-sm font-semibold text-slate-950 transition-all duration-200 hover:scale-[0.985] hover:shadow-[0_0_40px_rgba(0,240,255,0.36)] active:scale-[0.97]"
          >
            {JETON_COPY.hero.primaryCta}
          </Link>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/90 transition-all duration-200 hover:bg-white/10"
          >
            <PlayCircle className="h-4 w-4" aria-hidden="true" />
            {JETON_COPY.hero.secondaryCta}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8, ease: JETON_EASING }}
          className="flex flex-wrap items-center gap-6 text-xs text-white/68"
        >
          {trustBadges.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {label}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
