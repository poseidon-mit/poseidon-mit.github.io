import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from '@/router';
import { Shield, TrendingUp, Zap, Scale, Lock, ShieldCheck, Eye, Blocks, ArrowRight, CheckCircle2, Presentation } from 'lucide-react';
import { fadeUp, staggerContainer, staggerItem } from '@/lib/motion-presets';
import { markPerformance } from '@/lib/performance-marks';
import { usePageTitle } from '@/hooks/use-page-title';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { MenuOverlay } from '@/components/landing/jeton/MenuOverlay';
import { Footer } from '@/components/landing/jeton/Footer';
import { LANDING_COPY } from '@/content/landing-copy';

const ENGINE_COLORS: Record<string, string> = {
  protect: 'var(--engine-protect)',
  grow: 'var(--engine-grow)',
  execute: 'var(--engine-execute)',
  govern: 'var(--engine-govern)',
};

const HERO_VIDEO_POSTER_WEBP_SRC = '/videos/hero-theme-poster-v3.webp';
const HERO_VIDEO_POSTER_FALLBACK_SRC = '/videos/hero-theme-poster-v2.jpg';
const HERO_VIDEO_SOURCES = {
  mobile: '/videos/hero-theme-mobile-v3.mp4',
  tablet: '/videos/hero-theme-tablet-v3.mp4',
  desktop: '/videos/hero-theme-desktop-v3.mp4',
} as const;

function resolveLandingHeroVideoSrc(width: number): string {
  if (width < 768) return HERO_VIDEO_SOURCES.mobile;
  if (width < 1200) return HERO_VIDEO_SOURCES.tablet;
  return HERO_VIDEO_SOURCES.desktop;
}

function useLandingHeroVideoSrc(): string {
  const [src, setSrc] = useState(() =>
    typeof window !== 'undefined'
      ? resolveLandingHeroVideoSrc(window.innerWidth)
      : HERO_VIDEO_SOURCES.desktop,
  );

  useEffect(() => {
    const sync = () => {
      setSrc(resolveLandingHeroVideoSrc(window.innerWidth));
    };

    sync();
    window.addEventListener('resize', sync);
    window.addEventListener('orientationchange', sync);

    return () => {
      window.removeEventListener('resize', sync);
      window.removeEventListener('orientationchange', sync);
    };
  }, []);

  return src;
}

const ENGINES = [
  { id: 'protect', name: LANDING_COPY.engineShowcase.cards[0].name, desc: LANDING_COPY.engineShowcase.cards[0].description, icon: Shield, confidence: LANDING_COPY.engineShowcase.cards[0].confidence },
  { id: 'grow', name: LANDING_COPY.engineShowcase.cards[1].name, desc: LANDING_COPY.engineShowcase.cards[1].description, icon: TrendingUp, confidence: LANDING_COPY.engineShowcase.cards[1].confidence },
  { id: 'execute', name: LANDING_COPY.engineShowcase.cards[2].name, desc: LANDING_COPY.engineShowcase.cards[2].description, icon: Zap, confidence: LANDING_COPY.engineShowcase.cards[2].confidence },
  { id: 'govern', name: LANDING_COPY.engineShowcase.cards[3].name, desc: LANDING_COPY.engineShowcase.cards[3].description, icon: Scale, confidence: LANDING_COPY.engineShowcase.cards[3].confidence },
];

export default function Landing() {
  usePageTitle('Welcome to Poseidon');
  const reducedMotion = useReducedMotionSafe();
  const { scrollYProgress } = useScroll();

  const [isMobile, setIsMobile] = useState(false);
  const [shouldLoadHeroVideo, setShouldLoadHeroVideo] = useState(false);
  const [heroVideoReady, setHeroVideoReady] = useState(false);
  const [heroVideoFailed, setHeroVideoFailed] = useState(false);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const posterImageRef = useRef<HTMLImageElement | null>(null);
  const posterMarkedRef = useRef(false);
  const heroVideoSrc = useLandingHeroVideoSrc();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      setShouldLoadHeroVideo(true);
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    setHeroVideoReady(false);
    setHeroVideoFailed(false);
  }, [heroVideoSrc]);

  useEffect(() => {
    const posterImage = posterImageRef.current;
    if (!posterImage?.complete || posterMarkedRef.current) return;
    posterMarkedRef.current = true;
    markPerformance('landing_poster_visible');
  }, []);
  // Section 1: Hero Lens
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const lensX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const lensY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  const handleHeroPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isMobile || reducedMotion) return;
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    mouseX.set((clientX - left) - width / 2);
    mouseY.set((clientY - top) - height / 2);
  };


  useEffect(() => {
    if (!shouldLoadHeroVideo || heroVideoFailed) {
      return;
    }

    const video = heroVideoRef.current;
    const heroSection = heroSectionRef.current;
    if (!video || !heroSection) {
      return;
    }

    video.defaultMuted = true;
    video.muted = true;

    let visible = document.visibilityState === 'visible';
    let intersecting = true;
    let disposed = false;
    let retryScheduled = false;
    let readyReported = false;

    const reportVideoReady = () => {
      if (!readyReported) {
        readyReported = true;
        markPerformance('landing_video_first_frame');
      }
      setHeroVideoReady(true);
    };

    const tryPlay = async () => {
      if (!visible || !intersecting || disposed) return;

      try {
        await video.play();
      } catch (error: any) {
        if (disposed) return;
        if (error?.name === 'AbortError') {
          if (!retryScheduled) {
            retryScheduled = true;
            window.setTimeout(() => {
              retryScheduled = false;
              void tryPlay();
            }, 200);
          }
          return;
        }

        if (error?.name !== 'NotAllowedError') {
          setHeroVideoFailed(true);
        }
      }
    };

    const handleLoadedData = () => {
      reportVideoReady();
      void tryPlay();
    };

    const handleCanPlay = () => {
      reportVideoReady();
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

    video.addEventListener('loadeddata', handleLoadedData);
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
      observer.observe(heroSection);
    }

    if (video.readyState >= 2) {
      reportVideoReady();
      void tryPlay();
    }

    return () => {
      disposed = true;
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer?.disconnect();
      video.pause();
    };
  }, [heroVideoFailed, heroVideoSrc, shouldLoadHeroVideo]);

  const handlePosterLoad = () => {
    if (posterMarkedRef.current) return;
    posterMarkedRef.current = true;
    markPerformance('landing_poster_visible');
  };

  const handlePresentationClick = () => {
    markPerformance('landing_cta_click_start');
  };

  const heroPosterClassName = isMobile
    ? 'absolute inset-0 h-full w-full object-cover opacity-60 transition-opacity duration-500'
    : 'absolute inset-0 h-full w-full object-cover scale-[1.04] opacity-62 transition-opacity duration-500 mix-blend-screen';

  const heroVideoClassName = isMobile
    ? 'absolute inset-0 h-full w-full object-cover opacity-58 transition-opacity duration-700'
    : 'absolute inset-0 h-full w-full object-cover scale-[1.04] opacity-60 transition-opacity duration-700 mix-blend-screen';

  return (
    <div className="overflow-x-clip bg-[#06060A] text-white selection:bg-[var(--engine-dashboard)]/30">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
      >
        {LANDING_COPY.skipLink}
      </a>
      <MenuOverlay />
      
      <main id="main-content" role="main">
        {/* =========================================
            SECTION 1: THE MONOLITHIC OBELISK (HERO)
            ========================================= */}
        <motion.section
          ref={heroSectionRef}
          onPointerMove={handleHeroPointerMove}
          className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-16 group"
        >
          <div className="absolute inset-0 overflow-hidden">
            <picture className={`pointer-events-none absolute inset-0 block transition-opacity duration-500 ${heroVideoReady && !heroVideoFailed ? 'opacity-0' : 'opacity-100'}`}>
              <source srcSet={HERO_VIDEO_POSTER_WEBP_SRC} type="image/webp" />
              <img
                ref={posterImageRef}
                src={HERO_VIDEO_POSTER_FALLBACK_SRC}
                alt=""
                aria-hidden="true"
                fetchPriority="high"
                decoding="async"
                onLoad={handlePosterLoad}
                className={heroPosterClassName}
              />
            </picture>

            <video
              ref={heroVideoRef}
              key={heroVideoSrc}
              src={shouldLoadHeroVideo ? heroVideoSrc : undefined}
              loop
              muted
              playsInline
              disablePictureInPicture
              preload={shouldLoadHeroVideo ? 'auto' : 'none'}
              onError={() => setHeroVideoFailed(true)}
              className={`${heroVideoClassName} ${heroVideoReady && !heroVideoFailed ? 'opacity-100' : 'opacity-0'} pointer-events-none`}
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>

          {/* Cinematic Gradient Overlay */}
          <div className={`absolute inset-0 pointer-events-none ${isMobile ? 'bg-gradient-to-b from-[rgba(0,240,255,0.04)] via-[rgba(6,6,10,0.64)] to-[#06060A]' : 'bg-gradient-to-b from-[var(--engine-dashboard)]/5 via-[#06060A]/60 to-[#06060A]'}`} />

          {/* WOW Visual 2: Central Aurora Glass Lens */}
          {!isMobile && !reducedMotion && (
            <motion.div
              style={{ x: lensX, y: lensY }}
              className="absolute left-1/2 top-1/2 -ml-[250px] -mt-[250px] w-[500px] h-[500px] rounded-full mix-blend-overlay pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
            >
              <div className="w-full h-full rounded-full backdrop-blur-2xl bg-[var(--engine-dashboard)]/5 [mask-image:radial-gradient(black,transparent_70%)]" />
            </motion.div>
          )}

          <div className="relative z-10 flex flex-col items-center px-6 text-center w-full max-w-5xl mx-auto">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
                <ShieldCheck className="w-4 h-4 text-[var(--engine-dashboard)]" />
                <span className="text-xs font-mono text-white/70 uppercase tracking-widest">{LANDING_COPY.hero.badge}</span>
              </div>

              <h1 className="font-medium tracking-tight leading-[1] mb-8 mix-blend-lighten">
                <span className="block text-3xl sm:text-5xl md:text-7xl filter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{LANDING_COPY.hero.headlineLine1}</span>
                <span className="block text-4xl sm:text-6xl md:text-8xl bg-gradient-to-r from-[var(--engine-dashboard)] to-[var(--engine-grow)] bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(0,240,255,0.3)]">
                  {LANDING_COPY.hero.headlineLine2}
                </span>
              </h1>

              <p className="text-lg md:text-2xl text-white/50 max-w-2xl mx-auto mb-12 font-light tracking-wide">
                {LANDING_COPY.hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 w-full max-w-2xl mx-auto">
                <Link
                  to="/dashboard"
                  prefetch="intent"
                  navigationStrategy="optimistic"
                  className="group relative inline-flex min-h-[56px] [touch-action:manipulation] items-center justify-center px-8 py-4 rounded-full bg-[var(--engine-dashboard)] text-[#06060A] font-semibold text-[15px] tracking-wide transition-all hover:scale-[1.02] shadow-[0_0_40px_rgba(0,240,255,0.3)] hover:shadow-[0_0_60px_rgba(0,240,255,0.5)] flex-1 min-w-[200px]"
                >
                  <span className="relative z-10">{LANDING_COPY.hero.primaryCta}</span>
                  <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                <Link
                  to="/deck"
                  prefetch="intent"
                  navigationStrategy="optimistic"
                  onClick={handlePresentationClick}
                  className="inline-flex min-h-[56px] [touch-action:manipulation] items-center justify-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium text-[15px] hover:bg-white/10 transition-colors backdrop-blur-md flex-1 min-w-[200px]"
                >
                  <Presentation className="w-4 h-4" />
                  Presentation
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mt-20 text-white/40 text-sm font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              {LANDING_COPY.hero.trustItems.map((item, idx) => {
                const Icon = idx === 0 ? Lock : idx === 1 ? ShieldCheck : Eye;
                return (
                  <span key={item} className="flex items-center gap-2 tracking-wide">
                    <Icon size={14} className="text-[var(--engine-dashboard)]/50" /> {item}
                  </span>
                );
              })}
            </motion.div>
          </div>
        </motion.section>

        {/* =========================================
            SECTION 2: CINEMATIC HUD
            ========================================= */}
        <section className="relative px-6 py-32 md:py-40 md:px-8 bg-gradient-to-b from-[#06060A] to-[#0A0A0F]">
          <div className="mx-auto max-w-7xl relative z-10">
            <motion.div
              className="mb-20 text-center md:text-left"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-20%' }}
            >
              <h2 className="text-3xl sm:text-5xl font-medium tracking-tight mb-6">
                {LANDING_COPY.engineShowcase.sectionTitle}
              </h2>
              <p className="text-base md:text-xl text-white/50 max-w-2xl leading-relaxed">
                {LANDING_COPY.engineShowcase.sectionSubtitle}
              </p>
            </motion.div>

            {/* WOW Visual 4: Fast-Packet Neural Synapses */}
            {!isMobile && !reducedMotion && (
              <div className="absolute top-0 left-0 right-0 h-0 overflow-visible">
                <svg className="absolute inset-0 w-full h-[2px] overflow-visible" preserveAspectRatio="none">
                  <motion.line
                    x1="0" y1="0" x2="100%" y2="0"
                    stroke="var(--engine-dashboard)"
                    strokeWidth="2"
                    strokeDasharray="100 1000"
                    initial={{ strokeDashoffset: -1000 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    style={{ filter: 'drop-shadow(0 0 8px var(--engine-dashboard))' }}
                  />
                </svg>
              </div>
            )}

            <motion.div
              className="flex flex-col sm:flex-row items-stretch gap-4 md:gap-6 w-full"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-10%' }}
            >
              {ENGINES.map((engine) => (
                <TiltHUDCard key={engine.id} engine={engine} isMobile={isMobile} reducedMotion={reducedMotion} />
              ))}
            </motion.div>
          </div>
        </section>


        {/* =========================================
            SECTION 4: FLUID Z-PATTERN CTA
            ========================================= */}
        <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 py-32 text-center bg-[#06060A] overflow-hidden">
          {/* WOW Visual 7: Z-Pattern Energy Descent */}
          <div className="absolute inset-0 pointer-events-none opacity-50">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <motion.path
                d="M 100 0 L 100 200 L 90% 400 L 50% 600 L 50% 100%"
                fill="none"
                stroke="var(--engine-dashboard)"
                strokeWidth="2"
                style={{ pathLength: reducedMotion || isMobile ? 1 : scrollYProgress }}
                className="opacity-30 drop-shadow-[0_0_8px_var(--engine-dashboard)]"
              />
            </svg>
          </div>

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--engine-dashboard)_0%,transparent_50%)] opacity-[0.03] animate-pulse" />

          <motion.div
            className="relative z-10 max-w-3xl flex flex-col items-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-20%' }}
          >
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-8">
              <span className="text-white filter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{LANDING_COPY.finalCta.headlineLine1}</span>
              <br />
              <span className="bg-gradient-to-r from-[var(--engine-dashboard)] to-[var(--engine-grow)] bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                {LANDING_COPY.finalCta.headlineLine2}
              </span>
            </h2>

            <p className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl font-light">
              {LANDING_COPY.finalCta.subtitle}
            </p>

            {/* WOW Visual 8: Magnetic Supermassive CTA */}
            <MagneticCTA isMobile={isMobile} reducedMotion={reducedMotion} />

            <div className="mt-12 flex items-center justify-center gap-6 text-sm text-white/40">
               <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[var(--engine-protect)]" /> {LANDING_COPY.finalCta.proofPoints[0]}</span>
               <span className="hidden sm:flex items-center gap-2"><CheckCircle2 size={14} className="text-[var(--engine-grow)]" /> {LANDING_COPY.finalCta.proofPoints[1]}</span>
            </div>
          </motion.div>
        </section>

      </main>
      <Footer />

    </div>
  );
}

// ----- WOW Visual 3: Horizontal Holographic Tilt Display -----
function TiltHUDCard({ engine, isMobile, reducedMotion }: any) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useTransform(y, [0, 1], [15, -15]);
  const rotateY = useTransform(x, [0, 1], [-15, 15]);

  const smoothRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isMobile || reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handlePointerLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  const Icon = engine.icon;
  const color = ENGINE_COLORS[engine.id];

  return (
    <motion.div
      variants={staggerItem}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        rotateX: (!isMobile && !reducedMotion) ? smoothRotateX : 0,
        rotateY: (!isMobile && !reducedMotion) ? smoothRotateY : 0,
        transformPerspective: 1000,
      }}
      className="relative flex-1 rounded-xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md group overflow-hidden"
    >
      <div 
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${color}22 0%, transparent 70%)` }}
      />
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 border border-white/10" style={{ color }}>
            <Icon size={24} />
          </div>
          <span className="font-mono text-xs text-white/30 truncate backdrop-blur-md px-2 py-1 bg-black/20 rounded">
            {engine.confidence}
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-3 tracking-wide">{engine.name}</h3>
        <p className="text-sm text-white/50 leading-relaxed font-light flex-grow">
          {engine.desc}
        </p>
        
        {/* Holographic scanning line effect */}
        <div className="absolute left-0 right-0 h-px top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden">
           <motion.div 
             className="w-full h-full" 
             style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} 
             animate={{ x: ['-100%', '100%'] }} 
             transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
           />
        </div>
      </div>
    </motion.div>
  );
}


// ----- WOW Visual 8: Magnetic Supermassive CTA -----
function MagneticCTA({ isMobile, reducedMotion }: { isMobile: boolean, reducedMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.5 });

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isMobile || reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    
    // Magnetic pull radius 150px
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 150) {
      x.set(dx * 0.3);
      y.set(dy * 0.3);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className="relative p-12 -m-12" // large hit area
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Ambient breathing glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--engine-dashboard)]/20 to-[var(--engine-grow)]/20 blur-3xl rounded-full scale-150 animate-pulse pointer-events-none" />
      
      <motion.div ref={ref} style={{ x: springX, y: springY }}>
        <Link
          to="/dashboard"
          prefetch="intent"
          navigationStrategy="optimistic"
          className="group relative flex min-h-[60px] [touch-action:manipulation] items-center gap-3 px-12 py-5 rounded-full bg-white text-black font-semibold tracking-wide text-lg overflow-hidden transition-colors hover:bg-white/90"
        >
          <span className="relative z-10">{LANDING_COPY.finalCta.button}</span>
          <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </div>
  );
}

