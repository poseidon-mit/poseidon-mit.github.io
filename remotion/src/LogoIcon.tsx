import React from 'react';
import { z } from 'zod';
import { AbsoluteFill } from 'remotion';
import { theme } from './shared/theme';
import { IconTrident } from './shared/icons/IconTrident';

export const logoIconSchema = z.object({
    variant: z.enum(['favicon', 'app-icon', 'standard', 'wordmark', 'print', 'trident-only']),
    background: z.enum(['transparent', 'navy', 'abyss']),
    showShield: z.boolean().optional(),
    showParticles: z.boolean().optional(),
    showWaveBase: z.boolean().optional(),
    showOrbitalRing: z.boolean().optional(),
    showWordmark: z.boolean().optional(),
});

type LogoIconProps = z.infer<typeof logoIconSchema>;

export const LogoIcon: React.FC<LogoIconProps> = ({
    variant = 'standard',
    background = 'transparent',
    showShield = false,
    showParticles = false,
    showWaveBase: _showWaveBase = false,
    showOrbitalRing: _showOrbitalRing = false,
    showWordmark = false,
}) => {
    // Scale trident size based on variant
    const tridentScale = {
        'favicon': 0.7,
        'app-icon': 0.75,
        'standard': 0.6,
        'wordmark': 0.45,
        'print': 0.55,
        'trident-only': 0.85,
    }[variant];

    // Shield scaling
    const shieldScale = 1.15;

    return (
        <AbsoluteFill
            style={{
                backgroundColor: background === 'transparent'
                    ? 'transparent'
                    : background === 'navy'
                        ? theme.background.deepNavy
                        : theme.background.abyss,
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: theme.typography.fontHeader,
            }}
        >
            {/* Layer 0: Aurora background (only if abyss, skip for navy per user request for flat icon) */}
            {background === 'abyss' && (
                <>
                    <div style={{
                        position: 'absolute', inset: '-12% -8% -6% -8%',
                        background: theme.aurora.layers,
                        opacity: variant === 'print' ? 0.2 : 0.15,
                        filter: `blur(${theme.aurora.auroraBlur}px) saturate(1.25)`,
                        mixBlendMode: 'screen',
                    }} />
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: `${theme.vignette.topVignette}, ${theme.vignette.bottomVignette}`,
                        opacity: 0.5,
                    }} />
                    {/* Grain texture */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: theme.vignette.grainPattern,
                        backgroundSize: theme.vignette.grainSize,
                        backgroundRepeat: 'repeat',
                        opacity: 0.35,
                        mixBlendMode: 'overlay',
                    }} />
                </>
            )}

            {/* Layer 2: Hexagonal shield backing (optional) */}
            {showShield && (
                <svg
                    viewBox="0 0 400 400"
                    style={{
                        position: 'absolute',
                        width: `${tridentScale * 100 * shieldScale}%`,
                        height: `${tridentScale * 100 * shieldScale}%`,
                        opacity: 1,
                        zIndex: 1,
                    }}
                >
                    <defs>
                        <pattern id="hex-mesh" width="30" height="26" patternUnits="userSpaceOnUse">
                            <polygon points="15,0 30,7.5 30,22.5 15,30 0,22.5 0,7.5"
                                fill="none" stroke="rgba(0,240,255,0.06)" strokeWidth="0.5" />
                        </pattern>
                    </defs>

                    {/* Main Hexagon */}
                    <polygon
                        points="200,30 350,110 350,290 200,370 50,290 50,110"
                        fill="rgba(8,12,24,0.15)"
                        stroke="rgba(0,240,255,0.2)"
                        strokeWidth="1.5"
                    />
                    <polygon points="200,30 350,110 350,290 200,370 50,290 50,110"
                        fill="url(#hex-mesh)" />

                    {/* Corner dots */}
                    <circle cx="200" cy="30" r="2" fill="rgba(0,240,255,0.4)" />
                    <circle cx="350" cy="110" r="2" fill="rgba(0,240,255,0.4)" />
                    <circle cx="350" cy="290" r="2" fill="rgba(0,240,255,0.4)" />
                    <circle cx="200" cy="370" r="2" fill="rgba(0,240,255,0.4)" />
                    <circle cx="50" cy="290" r="2" fill="rgba(0,240,255,0.4)" />
                    <circle cx="50" cy="110" r="2" fill="rgba(0,240,255,0.4)" />
                </svg>
            )}

            {/* Layer 4: Trident (primary element) — PNG logo */}
            <IconTrident
                size={400}
                color={theme.accent.cyan}
                neon={variant !== 'favicon'}
                style={{
                    width: `${tridentScale * 100}%`,
                    height: `${tridentScale * 100}%`,
                    position: 'relative',
                    zIndex: 2,
                }}
            />

            {/* Layer 5: Data particles (optional) */}
            {showParticles && (
                <div style={{ position: 'absolute', inset: 0 }}>
                    {/* Creating a few static particles for the 'still' export */}
                    <div style={{ position: 'absolute', left: '35%', top: '30%', width: 2, height: 2, background: theme.accent.cyan, borderRadius: '50%', opacity: 0.6, boxShadow: `0 0 4px ${theme.accent.cyan}` }} />
                    <div style={{ position: 'absolute', left: '62%', top: '25%', width: 3, height: 3, background: theme.accent.teal, borderRadius: '50%', opacity: 0.4 }} />
                    <div style={{ position: 'absolute', left: '40%', top: '65%', width: 2, height: 2, background: theme.accent.violet, borderRadius: '50%', opacity: 0.5 }} />
                    <div style={{ position: 'absolute', left: '65%', top: '60%', width: 2, height: 2, background: theme.accent.cyan, borderRadius: '50%', opacity: 0.3 }} />
                    <div style={{ position: 'absolute', left: '25%', top: '50%', width: 1.5, height: 1.5, background: theme.accent.cyan, borderRadius: '50%', opacity: 0.7 }} />
                    <div style={{ position: 'absolute', left: '75%', top: '45%', width: 2, height: 2, background: theme.accent.teal, borderRadius: '50%', opacity: 0.4 }} />
                </div>
            )}

            {/* Layer 6: Wordmark (optional) */}
            {showWordmark && (
                <div style={{
                    fontFamily: theme.typography.fontHeader,
                    fontSize: variant === 'print' ? '3rem' : '3.5rem', // Adjusted size for legibility
                    fontWeight: 700,
                    color: '#FFFFFF',
                    textShadow: theme.neon.cyan.standard,
                    marginTop: variant === 'print' ? 50 : 40,
                    top: '30%', // Push down relative to center
                    position: 'relative',
                    letterSpacing: '0.08em',
                    zIndex: 2,
                }}>
                    TRITON<span style={{ color: theme.accent.cyan }}>.AI</span>
                </div>
            )}
        </AbsoluteFill>
    );
};
