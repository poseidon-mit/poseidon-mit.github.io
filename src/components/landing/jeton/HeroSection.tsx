import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FileText, Lock, PlayCircle, Shield, ShieldCheck } from 'lucide-react';
import { Link, useRouter } from '@/router';
import { JETON_COPY } from '@/content/landing-copy-jeton';
import { useDemoState } from '@/lib/demo-state/provider';
import { useJetonHeroVideoEnabled } from './hooks/useJetonWebGLEnabled';
import { JETON_EASING } from './jeton-config';

const HERO_VIDEO_DESKTOP_SRC = '/videos/hero-theme-desktop.mp4';
const HERO_VIDEO_MOBILE_SRC = '/videos/hero-theme-mobile.mp4';
const HERO_VIDEO_POSTER_SRC = '/videos/hero-theme-poster.jpg';

function useHeroVideoSrc() {
  const [src, setSrc] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768
      ? HERO_VIDEO_MOBILE_SRC
      : HERO_VIDEO_DESKTOP_SRC,
  );

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const update = (e: MediaQueryListEvent | MediaQueryList) =>
      setSrc(e.matches ? HERO_VIDEO_MOBILE_SRC : HERO_VIDEO_DESKTOP_SRC);
    update(mql);
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  return src;
}

export function HeroSection() {
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const heroVideoEnabled = useJetonHeroVideoEnabled();
  const heroVideoSrc = useHeroVideoSrc();
  const { navigate } = useRouter();
  const { beginDemoSession } = useDemoState();

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

    // Safari/iOS strict autoplay workaround:
    // React's `muted` attribute is sometimes ignored by Safari's autoplay policies.
    video.defaultMuted = true;
    video.muted = true;

    let visible = document.visibilityState === 'visible';
    let intersecting = true;
    let disposed = false;
    let abortRetryScheduled = false;

    const tryPlay = async () => {
      if (!visible || !intersecting || disposed) {
        return;
      }
      try {
        await video.play();
      } catch (err: any) {
        if (disposed) return;
        if (err.name === 'AbortError') {
          // Retry at most once after a short delay — AbortError is transient.
          if (!abortRetryScheduled) {
            abortRetryScheduled = true;
            setTimeout(() => {
              abortRetryScheduled = false;
              void tryPlay();
            }, 200);
          }
        } else if (err.name !== 'NotAllowedError') {
          setVideoFailed(true);
        }
      }
    };

    const handleCanPlay = () => {
      setVideoReady(true);
      void tryPlay();
    };

    const handleVisibilityChange = () => {
      visible = document.visibilityState === 'visible';
      if (!visible) {
        video.pause();
        return;
      }
      void tryPlay();
    };

    video.addEventListener('canplay', handleCanPlay);
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

    // If the video is already loaded, play immediately
    if (video.readyState >= 3) {
      setVideoReady(true);
      void tryPlay();
    }

    return () => {
      disposed = true;
      video.removeEventListener('canplay', handleCanPlay);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer?.disconnect();
      video.pause();
    };
  }, [heroVideoEnabled, heroVideoSrc]);

  return (
    <section ref={sectionRef} className="relative isolate flex min-h-screen items-center overflow-hidden bg-[var(--bg-oled)] px-6 pb-20 pt-28 md:px-8 md:pt-32">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(0,240,255,0.08),transparent_60%),radial-gradient(ellipse_at_85%_15%,rgba(56,189,248,0.16),transparent_58%),var(--bg-oled)] transition-opacity duration-[650ms] ${showFallback ? 'opacity-100' : 'opacity-0'
          }`}
      />

      {heroVideoEnabled && !videoFailed ? (
        <div className={`pointer-events-none absolute inset-0 transition-opacity duration-[650ms] ${videoReady ? 'opacity-100' : 'opacity-0'}`}>
          <video
            ref={videoRef}
            key={heroVideoSrc}
            src={heroVideoSrc}
            className="h-full w-full object-cover object-center brightness-[0.68] saturate-[0.86]"
            loop
            muted
            playsInline
            disablePictureInPicture
            preload="auto"
            poster={HERO_VIDEO_POSTER_SRC}
            aria-hidden="true"
            tabIndex={-1}
            onError={() => setVideoFailed(true)}
          />
        </div>
      ) : null}

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(5,5,8,0.76)] via-[rgba(5,5,8,0.56)] to-[rgba(5,5,8,0.95)] backdrop-blur-[2px] md:from-[rgba(5,5,8,0.62)] md:via-[rgba(5,5,8,0.42)] md:to-[rgba(5,5,8,0.95)]"
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
            className="btn-liquid-glass inline-flex w-full min-h-11 items-center justify-center rounded-full px-8 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[0.985] active:scale-[0.97] sm:w-auto"
          >
            {JETON_COPY.hero.primaryCta}
          </Link>
          <button
            type="button"
            onClick={() => {
              beginDemoSession({ method: 'skip' });
              navigate('/dashboard');
            }}
            className="inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/12 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-cyan-300/20 hover:shadow-[0_0_26px_rgba(56,189,248,0.2)] sm:w-auto"
          >
            <PlayCircle className="h-4 w-4" aria-hidden="true" />
            {JETON_COPY.hero.secondaryCta}
          </button>
          <a
            href="/CTO-Group7-Poseidon.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/12 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-cyan-300/20 hover:shadow-[0_0_26px_rgba(56,189,248,0.2)] sm:w-auto"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Presentation
          </a>
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
