/**
 * Poseidon unified design tokens — CSS variable references
 * These values correspond to custom properties defined in src/styles/system/tokens.css.
 * Use this object when you need type-safe access to design tokens in TypeScript/JSX.
 */

export const theme = {
  colors: {
    background: {
      deepNavy: 'var(--bg-deep)',
      navy: 'var(--bg)',
      surface: 'var(--bg-surface)',
      abyss: '#000000',
    },
    accent: {
      cyan: 'var(--accent-cyan)',
      cyanSoft: '#40E8F0',
      teal: 'var(--accent-teal)',
      violet: 'var(--accent-violet)',
      amber: 'var(--accent-amber)',
      gold: 'var(--accent-gold)',
      blue: 'var(--accent-blue)',
      red: 'var(--accent-red)',
    },
    semantic: {
      ai: 'var(--accent-cyan)',
      human: 'var(--accent-amber)',
      growth: 'var(--accent-violet)',
      threat: 'var(--accent-red)',
    },
    engine: {
      dashboard: 'var(--engine-dashboard)',
      protect: 'var(--engine-protect)',
      grow: 'var(--engine-grow)',
      execute: 'var(--engine-execute)',
      govern: 'var(--engine-govern)',
    },
    text: {
      primary: 'var(--text)',
      muted: 'var(--muted)',
      muted2: 'var(--muted-2)',
      onAccent: 'var(--text-on-accent)',
    },
    glass: {
      bg: 'var(--glass-bg)',
      bgStrong: 'var(--glass-bg-strong)',
      bgSoft: 'var(--glass-bg-soft)',
      bgSubtle: 'var(--glass-bg-subtle)',
      border: 'var(--glass-border)',
      borderStrong: 'var(--glass-border-strong)',
      glow: 'rgba(0,240,255,0.18)',
    },
    state: {
      hoverBg: 'var(--state-hover-bg)',
      activeBg: 'var(--state-active-bg)',
      disabledText: 'var(--state-disabled-text)',
      errorBorder: 'var(--state-error-border)',
      successBorder: 'var(--state-success-border)',
      loadingBg: 'var(--state-loading-bg)',
    },

    // Flat semantic aliases (referenced across 26+ components)
    info: 'var(--accent-blue)',
    success: 'var(--accent-teal)',
    error: 'var(--accent-red)',
    warning: 'var(--accent-amber)',
    neutral: 'var(--muted)',
  },

  typography: {
    fontHeader: "var(--font-body)",
    fontUi: "var(--font-body)",
    fontMono: "var(--font-mono)",

    // Mobile-first fluid typography
    scale: {
      display: 'var(--font-size-display)',
      h1: 'var(--font-size-h1)',
      h2: 'var(--font-size-h2)',
      h3: 'var(--font-size-h3)',
      bodyLg: 'var(--font-size-body-lg)',
      body: 'var(--font-size-body)',
      bodySm: 'var(--font-size-body-sm)',
      caption: 'var(--font-size-caption)',
      label: 'var(--font-size-label)',
      small: 'var(--font-size-small)',
      badge: 'var(--font-size-badge)',
    },

    weight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },

    lineHeight: {
      tight: 1.1,
      body: 1.5,
      relaxed: 1.65,
    },

    numericFeatures: '"tnum" 1, "lnum" 1',
  },

  effects: {
    neon: {
      // Desktop (sharper variant - premium tone)
      cyan: 'var(--neon-cyan-sharper)',
      violet: 'var(--neon-violet-sharper)',
      amber: 'var(--neon-amber-sharper)',
      blue: 'var(--neon-blue-sharper)',
      teal: 'var(--neon-teal-sharper)',
      red: 'var(--neon-red-sharper)',
      // Mobile (optimized for performance)
      cyanMobile: 'var(--neon-cyan-mobile)',
      violetMobile: 'var(--neon-violet-mobile)',
      amberMobile: 'var(--neon-amber-mobile)',
      blueMobile: 'var(--neon-blue-mobile)',
      tealMobile: 'var(--neon-teal-mobile)',
      redMobile: 'var(--neon-red-mobile)',
    },

    iconGlow: {
      default: 'var(--icon-glow-default)',
      teal: 'var(--icon-glow-teal)',
      amber: 'var(--icon-glow-amber)',
      violet: 'var(--icon-glow-violet)',
      blue: 'var(--icon-glow-blue)',
      red: 'var(--icon-glow-red)',
    },

    glass: {
      shadow: 'var(--glass-shadow)',
      shadowAmber: '0 24px 70px rgba(0,0,0,0.55), 0 0 38px rgba(234,179,8,0.22)',
      insetHighlight: 'var(--glass-inset)',
      edge: 'var(--glass-edge)',
      backdrop: 'var(--glass-backdrop)',
      backdropMobile: 'var(--glass-backdrop-mobile)',
    },

    gradient: {
      text: {
        cyan: 'var(--text-gradient-cyan)',
        teal: 'var(--text-gradient-teal)',
        violet: 'var(--text-gradient-violet)',
        amber: 'var(--text-gradient-amber)',
        blue: 'var(--text-gradient-blue)',
        rainbow: 'linear-gradient(90deg, #00f0ff 0%, #8b5cf6 35%, #f59e0b 70%, #14b8a6 100%)',
      },
      background: 'radial-gradient(ellipse 120% 80% at 50% 0%, #0f172a 0%, #020410 50%, #000000 100%)',
    },

    textShadow: {
      soft: '0 0 8px rgba(255,255,255,0.25)',
      strong: '0 0 8px rgba(255,255,255,0.35), 0 0 20px rgba(255,255,255,0.25)',
      crisp: '0 1px 2px rgba(0,0,0,0.5)',
      neon: 'var(--text-shadow-neon)',
      gradientGlow: '0 0 12px rgba(0,240,255,0.25), 0 0 28px rgba(0,240,255,0.2)',
    },

    focus: 'var(--state-focus-ring)',
  },

  radius: {
    lg: 'var(--radius-lg)',
    md: 'var(--radius-md)',
    sm: 'var(--radius-sm)',
  },

  spacing: {
    space1: 'var(--space-1)',
    space2: 'var(--space-2)',
    space3: 'var(--space-3)',
    space4: 'var(--space-4)',
    space5: 'var(--space-5)',
    space6: 'var(--space-6)',
    space8: 'var(--space-8)',
    space10: 'var(--space-10)',
    space12: 'var(--space-12)',
    space14: 'var(--space-14)',
    space16: '64px',
    space20: '80px',
    space24: '96px',
  },

  layout: {
    containerMax: 'var(--container-max)',
    contentMax: 'var(--content-max)',
    gridGap: 'var(--grid-gap)',
    sectionGap: 'var(--section-gap)',
    touchMin: 'var(--touch-min)',
    navBottomHeight: 'var(--nav-bottom-height)',
    pagePadding: 'var(--page-padding)',
  },

  motion: {
    duration: {
      fast: 'var(--motion-duration-fast)',
      base: 'var(--motion-duration-base)',
      slow: 'var(--motion-duration-slow)',
    },
    easing: {
      standard: 'var(--motion-easing-standard)',
      emphasized: 'var(--motion-easing-emphasized)',
    },
  },

  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },

  zIndex: {
    base: 0,
    cardOverlay: 2,
    stickyNav: 100,
    bottomNav: 150,
    overlay: 200,
    modal: 210,
    drawer: 220,
    dropdown: 230,
    mobileBackdrop: 240,
    mobileNav: 250,
    toast: 500,
    skipLink: 10000,
  },
} as const;

export type Theme = typeof theme;
