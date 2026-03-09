"use strict";
/**
 * Poseidon.AI design tokens (single source of truth).
 * Remotion consumes this directly; web/prototype tokens are generated from it.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.theme = void 0;
// Pre-computed neon text-shadow strings (6-layer): MAXIMUM intensity with extended range
// Ultra-bright core + massive outer glow for dramatic effect
const neonCyanStandard = '0 0 2px rgba(0,240,255,1), 0 0 6px rgba(0,240,255,1), 0 0 15px rgba(0,240,255,0.8), 0 0 30px rgba(0,240,255,0.6), 0 0 50px rgba(0,240,255,0.4), 0 0 80px rgba(0,240,255,0.2)';
const neonCyanDeep = '0 0 2px rgba(0,240,255,1), 0 0 6px rgba(0,240,255,1), 0 0 15px rgba(0,240,255,0.95), 0 0 30px rgba(0,240,255,0.8), 0 0 50px rgba(0,240,255,0.6), 0 0 80px rgba(0,240,255,0.4), 0 0 120px rgba(0,240,255,0.2)';
const neonVioletStandard = '0 0 2px rgba(139,92,246,1), 0 0 6px rgba(139,92,246,1), 0 0 15px rgba(139,92,246,0.8), 0 0 30px rgba(139,92,246,0.6), 0 0 50px rgba(139,92,246,0.4), 0 0 80px rgba(139,92,246,0.2)';
const neonVioletDeep = '0 0 2px rgba(139,92,246,1), 0 0 6px rgba(139,92,246,1), 0 0 15px rgba(139,92,246,0.95), 0 0 30px rgba(139,92,246,0.8), 0 0 50px rgba(139,92,246,0.6), 0 0 80px rgba(139,92,246,0.4), 0 0 120px rgba(139,92,246,0.2)';
const neonAmberStandard = '0 0 2px rgba(245,158,11,1), 0 0 6px rgba(245,158,11,1), 0 0 15px rgba(245,158,11,0.8), 0 0 30px rgba(245,158,11,0.6), 0 0 50px rgba(245,158,11,0.4), 0 0 80px rgba(245,158,11,0.2)';
const neonAmberDeep = '0 0 2px rgba(245,158,11,1), 0 0 6px rgba(245,158,11,1), 0 0 15px rgba(245,158,11,0.95), 0 0 30px rgba(245,158,11,0.8), 0 0 50px rgba(245,158,11,0.6), 0 0 80px rgba(245,158,11,0.4), 0 0 120px rgba(245,158,11,0.2)';
const neonBlueStandard = '0 0 2px rgba(59,130,246,1), 0 0 6px rgba(59,130,246,1), 0 0 15px rgba(59,130,246,0.8), 0 0 30px rgba(59,130,246,0.6), 0 0 50px rgba(59,130,246,0.4), 0 0 80px rgba(59,130,246,0.2)';
const neonBlueDeep = '0 0 2px rgba(59,130,246,1), 0 0 6px rgba(59,130,246,1), 0 0 15px rgba(59,130,246,0.95), 0 0 30px rgba(59,130,246,0.8), 0 0 50px rgba(59,130,246,0.6), 0 0 80px rgba(59,130,246,0.4), 0 0 120px rgba(59,130,246,0.2)';
const neonRedStandard = '0 0 2px rgba(239,68,68,1), 0 0 6px rgba(239,68,68,1), 0 0 15px rgba(239,68,68,0.8), 0 0 30px rgba(239,68,68,0.6), 0 0 50px rgba(239,68,68,0.4), 0 0 80px rgba(239,68,68,0.2)';
const neonRedDeep = '0 0 2px rgba(239,68,68,1), 0 0 6px rgba(239,68,68,1), 0 0 15px rgba(239,68,68,0.95), 0 0 30px rgba(239,68,68,0.8), 0 0 50px rgba(239,68,68,0.6), 0 0 80px rgba(239,68,68,0.4), 0 0 120px rgba(239,68,68,0.2)';
const neonTealStandard = '0 0 2px rgba(20,184,166,1), 0 0 6px rgba(20,184,166,1), 0 0 15px rgba(20,184,166,0.8), 0 0 30px rgba(20,184,166,0.6), 0 0 50px rgba(20,184,166,0.4), 0 0 80px rgba(20,184,166,0.2)';
const neonTealDeep = '0 0 2px rgba(20,184,166,1), 0 0 6px rgba(20,184,166,1), 0 0 15px rgba(20,184,166,0.95), 0 0 30px rgba(20,184,166,0.8), 0 0 50px rgba(20,184,166,0.6), 0 0 80px rgba(20,184,166,0.4), 0 0 120px rgba(20,184,166,0.2)';
// Sharper neon variant: Dark, ominous, sharp glow - tight core with minimal diffusion
const neonCyanSharper = '0 0 1px rgba(0,240,255,1), 0 0 3px rgba(0,240,255,1), 0 0 8px rgba(0,240,255,0.9), 0 0 16px rgba(0,240,255,0.5), 0 0 28px rgba(0,240,255,0.2)';
const neonVioletSharper = '0 0 1px rgba(139,92,246,1), 0 0 3px rgba(139,92,246,1), 0 0 8px rgba(139,92,246,0.9), 0 0 16px rgba(139,92,246,0.5), 0 0 28px rgba(139,92,246,0.2)';
const neonAmberSharper = '0 0 1px rgba(245,158,11,1), 0 0 3px rgba(245,158,11,1), 0 0 8px rgba(245,158,11,0.9), 0 0 16px rgba(245,158,11,0.5), 0 0 28px rgba(245,158,11,0.2)';
const neonBlueSharper = '0 0 1px rgba(59,130,246,1), 0 0 3px rgba(59,130,246,1), 0 0 8px rgba(59,130,246,0.9), 0 0 16px rgba(59,130,246,0.5), 0 0 28px rgba(59,130,246,0.2)';
const neonRedSharper = '0 0 1px rgba(239,68,68,1), 0 0 3px rgba(239,68,68,1), 0 0 8px rgba(239,68,68,0.9), 0 0 16px rgba(239,68,68,0.5), 0 0 28px rgba(239,68,68,0.2)';
const neonTealSharper = '0 0 1px rgba(20,184,166,1), 0 0 3px rgba(20,184,166,1), 0 0 8px rgba(20,184,166,0.9), 0 0 16px rgba(20,184,166,0.5), 0 0 28px rgba(20,184,166,0.2)';
// Icon glow: 3-layer drop-shadow() chains (from base.css:127-156)
const iconGlowDefault = 'drop-shadow(0 0 6px rgba(255,255,255,0.35)) drop-shadow(0 0 14px rgba(0,240,255,0.45)) drop-shadow(0 0 28px rgba(0,240,255,0.35))';
const iconGlowTeal = 'drop-shadow(0 0 6px rgba(255,255,255,0.35)) drop-shadow(0 0 14px rgba(20,184,166,0.55)) drop-shadow(0 0 28px rgba(20,184,166,0.4))';
const iconGlowAmber = 'drop-shadow(0 0 6px rgba(255,255,255,0.35)) drop-shadow(0 0 14px rgba(245,158,11,0.55)) drop-shadow(0 0 28px rgba(245,158,11,0.4))';
const iconGlowViolet = 'drop-shadow(0 0 6px rgba(255,255,255,0.35)) drop-shadow(0 0 14px rgba(139,92,246,0.55)) drop-shadow(0 0 28px rgba(139,92,246,0.4))';
const iconGlowBlue = 'drop-shadow(0 0 6px rgba(255,255,255,0.35)) drop-shadow(0 0 14px rgba(59,130,246,0.55)) drop-shadow(0 0 28px rgba(59,130,246,0.4))';
const iconGlowRed = 'drop-shadow(0 0 6px rgba(255,255,255,0.35)) drop-shadow(0 0 14px rgba(239,68,68,0.55)) drop-shadow(0 0 28px rgba(239,68,68,0.4))';
exports.theme = {
    background: {
        deepNavy: '#020410',
        abyss: '#000000',
        navy: '#0B1221',
        surface: '#1E293B',
    },
    /** Base radial gradient for slide artboard (slides.css .slide-artboard) */
    backgroundGradient: 'radial-gradient(ellipse 120% 80% at 50% 0%, #0f172a 0%, #020410 50%, #000000 100%)',
    /** Legacy linear fallback if needed */
    backgroundGradientLinear: 'linear-gradient(to bottom, #020410 0%, #000000 100%)',
    accent: {
        cyan: '#00F0FF',
        amber: '#F59E0B',
        violet: '#8B5CF6',
        teal: '#14B8A6',
        gold: '#EAB308',
        blue: '#3B82F6',
        red: '#EF4444',
    },
    semantic: {
        ai: '#00F0FF',
        human: '#F59E0B',
        growth: '#8B5CF6',
        threat: '#EF4444',
    },
    typography: {
        fontHeader: "'Space Grotesk', system-ui, sans-serif",
        fontUi: "'Inter', 'Noto Sans JP', system-ui, sans-serif",
        fontMono: "'JetBrains Mono', 'Noto Sans JP', ui-monospace, monospace",
        fallbackCjk: "'Noto Sans JP', sans-serif",
        numericFeatureSettings: '"tnum" 1, "lnum" 1',
        numericVariant: 'tabular-nums lining-nums',
        textXs: '0.75rem',
        textSm: '0.875rem',
        textBase: '1rem',
        textLg: '1.125rem',
        textXl: '1.25rem', // 20px
        text2xl: '1.5rem', // 24px
        text3xl: '2rem', // 32px
        text4xl: '2.5rem', // 40px
        text5xl: '3rem', // 48px
        text6xl: '4rem', // 64px
        text7xl: '4.5rem', // 72px
        text8xl: '5rem', // 80px
        text9xl: '6rem', // 96px
    },
    readability: {
        minBodyOpacity: 0.8,
        minSecondaryOpacity: 0.6,
        minMetaOpacity: 0.45,
    },
    typographyScale: {
        badge: 14,
        title: 76,
        subtitle: 36,
        meta: 20,
        cardTitle: 38,
        body: 28,
        bodyStrong: 32,
        label: 20,
        footnote: 16,
    },
    /** Aurora background (slides.css .slide-artboard::before) */
    aurora: {
        baseGradient: 'radial-gradient(ellipse 120% 80% at 50% 0%, #0f172a 0%, #020410 50%, #000000 100%)',
        layers: [
            'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 42%, rgba(255,255,255,0.12) 100%)',
            'radial-gradient(55% 45% at 12% 10%, rgba(0,240,255,0.36) 0%, rgba(0,240,255,0) 70%)',
            'radial-gradient(50% 45% at 88% 8%, rgba(139,92,246,0.32) 0%, rgba(139,92,246,0) 70%)',
            'radial-gradient(50% 60% at 50% 35%, rgba(20,184,166,0.28) 0%, rgba(20,184,166,0) 70%)',
            'radial-gradient(40% 50% at 72% 72%, rgba(245,158,11,0.24) 0%, rgba(245,158,11,0) 70%)',
            'conic-gradient(from 210deg at 50% 30%, rgba(0,240,255,0.08), rgba(139,92,246,0.08), rgba(0,0,0,0))',
        ].join(', '),
        auroraOpacity: 0.9,
        auroraBlur: 12,
    },
    /** Vignette + grain (slides.css .slide-artboard::after) */
    vignette: {
        topVignette: 'radial-gradient(120% 120% at 50% 8%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 62%, rgba(0,0,0,0.78) 100%)',
        bottomVignette: 'radial-gradient(140% 140% at 50% 100%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.85) 70%)',
        grainPattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.035) 0, rgba(255,255,255,0.035) 1px, transparent 1px)',
        grainSize: '3px 3px',
        vignetteOpacity: 0.65,
    },
    glass: {
        glassBorder: 'rgba(255,255,255,0.16)',
        glassBorderSubtle: 'rgba(255,255,255,0.08)',
        glassBg: 'rgba(8,12,24,0.62)',
        glassBgStrong: 'rgba(8,12,24,0.72)',
        glassBgSoft: 'rgba(10,16,28,0.6)',
        glassGlow: 'rgba(0,240,255,0.18)',
        glassBlur: 26,
        glassBlurStrong: 44,
        /** tokens.css: --poseidon-glass-backdrop */
        glassBackdrop: 'blur(44px) saturate(1.55) brightness(1.08)',
        /** tokens.css: --poseidon-glass-backdrop-strong */
        glassBackdropStrong: 'blur(64px) saturate(1.65) brightness(1.1)',
        /** Diagonal overlay (tokens.css --poseidon-glass-overlay) */
        glassOverlay: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 38%, rgba(255,255,255,0.02) 100%)',
        /** Sheen radial (components.css:12-18) */
        glassSheen: 'radial-gradient(120% 120% at 0% 0%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0) 70%)',
        /** Rim-light screen blend (components.css:20-28) */
        glassRimLight: 'linear-gradient(120deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 40%, rgba(0,240,255,0.10) 100%)',
        glassShadow: '0 24px 70px rgba(0,0,0,0.62), 0 0 28px rgba(0,240,255,0.12)',
        glassShadowAmber: '0 24px 70px rgba(0,0,0,0.55), 0 0 38px rgba(234,179,8,0.22)',
        glassInsetHighlight: 'inset 0 1px 0 0 rgba(255,255,255,0.26), inset 0 -1px 0 0 rgba(255,255,255,0.1), inset 0 0 20px rgba(255,255,255,0.06)',
        glassEdge: 'inset 0 0 0 1px rgba(255,255,255,0.18), inset 0 -16px 30px rgba(0,0,0,0.35)',
    },
    /** Neon text-shadow (base.css .text-neon / .text-neon--deep / .text-neon--sharper) */
    neon: {
        cyan: { standard: neonCyanStandard, deep: neonCyanDeep, sharper: neonCyanSharper },
        violet: { standard: neonVioletStandard, deep: neonVioletDeep, sharper: neonVioletSharper },
        amber: { standard: neonAmberStandard, deep: neonAmberDeep, sharper: neonAmberSharper },
        blue: { standard: neonBlueStandard, deep: neonBlueDeep, sharper: neonBlueSharper },
        red: { standard: neonRedStandard, deep: neonRedDeep, sharper: neonRedSharper },
        teal: { standard: neonTealStandard, deep: neonTealDeep, sharper: neonTealSharper },
    },
    /** Icon glow filter (base.css .icon-glow-*) */
    iconGlow: {
        default: iconGlowDefault,
        teal: iconGlowTeal,
        amber: iconGlowAmber,
        violet: iconGlowViolet,
        blue: iconGlowBlue,
        red: iconGlowRed,
    },
    /** Gradient text + accompanying shadows (base.css .text-gradient-*) */
    gradientText: {
        cyan: 'linear-gradient(90deg, #bffcff 0%, #00f0ff 100%)',
        teal: 'linear-gradient(90deg, #5eead4 0%, #15e1c2 100%)',
        violet: 'linear-gradient(90deg, #d7b7ff 0%, #8b5cf6 100%)',
        amber: 'linear-gradient(90deg, #ffe0a1 0%, #f59e0b 100%)',
        blue: 'linear-gradient(90deg, #b8d6ff 0%, #58a6ff 100%)',
        rainbow: 'linear-gradient(90deg, #00f0ff 0%, #8b5cf6 35%, #f59e0b 70%, #14b8a6 100%)',
    },
    text: {
        primary: '#f8fafc',
        muted: 'rgba(255,255,255,0.72)',
        muted2: 'rgba(255,255,255,0.5)',
    },
    textGlowSoft: '0 0 8px rgba(255,255,255,0.25)',
    textGlowStrong: '0 0 8px rgba(255,255,255,0.35), 0 0 20px rgba(255,255,255,0.25)',
    textCrisp: '0 1px 2px rgba(0,0,0,0.5)',
    /** Gradient text glow (base.css .text-gradient) */
    gradientTextShadow: '0 0 12px rgba(0,240,255,0.25), 0 0 28px rgba(0,240,255,0.2)',
    textShadowNeon: '0 0 12px rgba(255,255,255,0.4)',
    /** Compliance badge (components.css:287-303) */
    complianceBadge: {
        background: 'rgba(0,240,255,0.12)',
        border: '1px solid rgba(0,240,255,0.6)',
        color: '#e6fbff',
        boxShadow: '0 0 12px rgba(0,240,255,0.55), 0 0 28px rgba(0,240,255,0.45), 0 0 52px rgba(0,240,255,0.3), inset 0 0 14px rgba(0,240,255,0.22)',
        textShadow: '0 0 8px rgba(0,240,255,0.4)',
    },
    /** Warning badge (components.css:347-363) */
    warningBadge: {
        background: 'rgba(239,68,68,0.15)',
        border: '1px solid rgba(239,68,68,0.4)',
        color: '#ff6b6b',
        boxShadow: '0 0 12px rgba(239,68,68,0.5), 0 0 24px rgba(239,68,68,0.35), inset 0 0 10px rgba(239,68,68,0.2)',
        textShadow: '0 0 10px rgba(239,68,68,0.6)',
    },
    state: {
        hoverBg: 'rgba(255,255,255,0.06)',
        activeBg: 'rgba(255,255,255,0.12)',
        focusRing: '0 0 0 2px rgba(0,240,255,0.6)',
        disabledText: 'rgba(255,255,255,0.4)',
        errorBorder: 'rgba(239,68,68,0.6)',
        successBorder: 'rgba(21,225,194,0.6)',
        loadingBg: 'rgba(255,255,255,0.04)',
    },
    motion: {
        duration: {
            fast: '120ms',
            base: '200ms',
            slow: '320ms',
        },
        easing: {
            standard: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
            emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
        },
    },
    radius: {
        lg: '24px',
        md: '16px',
        sm: '12px',
    },
    surface: {
        canvas: '#020410',
        base: '#0B1221',
        panel: '#1E293B',
        glass: 'rgba(8,12,24,0.62)',
        glassStrong: 'rgba(8,12,24,0.72)',
        glassSoft: 'rgba(10,16,28,0.6)',
    },
    breakpoints: {
        sm: 600,
        md: 900,
        lg: 1100,
        xl: 1280,
    },
    layout: {
        containerMax: '1600px',
        contentMax: '1240px',
        gridGap: '24px',
        sectionGap: '32px',
    },
    chart: {
        line: {
            primary: '#00F0FF',
            secondary: '#8B5CF6',
            neutral: '#CBD5F5',
            tertiary: '#14B8A6',
        },
        fill: {
            primary: 'rgba(0,240,255,0.35)',
            secondary: 'rgba(139,92,246,0.3)',
            neutral: 'rgba(203,213,245,0.25)',
        },
        grid: {
            light: 'rgba(255,255,255,0.1)',
            mid: 'rgba(255,255,255,0.2)',
            strong: 'rgba(255,255,255,0.3)',
        },
        stroke: {
            default: '1.5px',
            thin: '1px',
            heavy: '2px',
        },
        glow: {
            soft: '0 0 24px rgba(0,240,255,0.12)',
            strong: '0 0 32px rgba(0,240,255,0.2)',
        },
    },
    spacing: {
        space1: '0.25rem',
        space2: '0.5rem',
        space3: '0.75rem',
        space4: '1rem',
        space5: '1.25rem',
        space6: '1.5rem',
        space8: '2rem',
        space10: '2.5rem',
        space12: '3rem',
        space16: '4rem',
        space20: '5rem',
        space24: '6rem',
        marginX: '120px',
        marginY: '80px',
    },
};
