import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Lock, PlayCircle, Shield, ShieldCheck } from 'lucide-react';
import { Link, useRouter } from '@/router';
import { JETON_COPY } from '@/content/landing-copy-jeton';
import { useJetonHeroVideoEnabled } from './hooks/useJetonWebGLEnabled';
import { JETON_EASING } from './jeton-config';

const HERO_VIDEO_DESKTOP_SRC = '/videos/hero-theme-desktop.mp4';
const HERO_VIDEO_MOBILE_SRC = '/videos/hero-theme-mobile.mp4';
const HERO_VIDEO_POSTER_SRC = '/videos/hero-theme-poster.jpg';

export function HeroSection() {
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const heroVideoEnabled = useJetonHeroVideoEnabled();
  const { navigate } = useRouter();

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 540], [1, 0.26]);
  const showFallback = !heroVideoEnabled || videoFailed || !videoReady;

  const trustBadges = useMemo(
    () => [
      { icon: Lock, label: 'Bank-grade encryption' },
      { icon: Shield, label: 'GDPR ready' },
      { icon: ShieldCheck, label: 'SOC 2 Type II in progress' },
    ],
    [],
  );

  useEffect(() => {
    if (!heroVideoEnabled) {
      return;
    }

    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) {
      return;
    }

    let visible = document.visibilityState === 'visible';
    let intersecting = true;

    const tryPlay = async () => {
      if (!visible || !intersecting) {
        return;
      }
      try {
        await video.play();
      } catch {
        setVideoFailed(true);
      }
    };

    const handleVisibilityChange = () => {
      visible = document.visibilityState === 'visible';
      if (!visible) {
        video.pause();
        return;
      }
      void tryPlay();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    let observer: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          intersecting = Boolean(entry?.isIntersecting);
          if (!intersecting) {
            video.pause();
            return;
          }
          void tryPlay();
        },
        {
          threshold: 0.08,
        },
      );
      observer.observe(section);
    }

    void tryPlay();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer?.disconnect();
      video.pause();
    };
  }, [heroVideoEnabled]);

  return (
    <section ref={sectionRef} className="relative isolate flex min-h-screen items-center overflow-hidden bg-[#0B1221] px-6 pb-20 pt-28 md:px-8 md:pt-32">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(0,240,255,0.08),transparent_60%),radial-gradient(ellipse_at_85%_15%,rgba(56,189,248,0.16),transparent_58%),#0B1221] transition-opacity duration-[650ms] ${
          showFallback ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {heroVideoEnabled && !videoFailed ? (
        <div className={`pointer-events-none absolute inset-0 transition-opacity duration-[650ms] ${videoReady ? 'opacity-100' : 'opacity-0'}`}>
          <video
            ref={videoRef}
            className="h-full w-full object-cover object-center brightness-[0.68] saturate-[0.86]"
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            preload="metadata"
            poster={HERO_VIDEO_POSTER_SRC}
            aria-hidden="true"
            tabIndex={-1}
            onLoadedMetadata={() => setVideoReady(true)}
            onLoadedData={() => setVideoReady(true)}
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoFailed(true)}
          >
            <source src={HERO_VIDEO_MOBILE_SRC} media="(max-width: 767px)" type="video/mp4" />
            <source src={HERO_VIDEO_DESKTOP_SRC} type="video/mp4" />
          </video>
        </div>
      ) : null}

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0B1221]/76 via-[#0B1221]/56 to-[#0B1221]/95 backdrop-blur-[2px] md:from-[#0B1221]/62 md:via-[#0B1221]/42 md:to-[#0B1221]/95"
        aria-hidden="true"
      />

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
          className="max-w-5xl text-balance font-display text-[clamp(2.8rem,9vw,8rem)] font-semibold leading-[0.9] tracking-[-0.04em] drop-shadow-[0_12px_44px_rgba(2,6,23,0.88)]"
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
          className="max-w-2xl text-pretty text-lg leading-[1.65] tracking-[0.01em] text-white/84 drop-shadow-[0_8px_28px_rgba(2,6,23,0.82)] md:text-xl"
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
            className="btn-liquid-glass inline-flex min-h-11 items-center justify-center rounded-full px-8 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[0.985] active:scale-[0.97]"
          >
            {JETON_COPY.hero.primaryCta}
          </Link>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/90 transition-all duration-200 hover:border-white/25 hover:bg-white/10 hover:shadow-[0_0_26px_rgba(56,189,248,0.2)]"
          >
            <PlayCircle className="h-4 w-4" aria-hidden="true" />
            {JETON_COPY.hero.secondaryCta}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8, ease: JETON_EASING }}
          className="flex flex-wrap items-center gap-6 text-xs text-white/45"
        >
          {trustBadges.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5 transition-colors hover:text-white/75">
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {label}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
