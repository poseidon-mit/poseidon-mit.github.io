import React from 'react';
import { AbsoluteFill } from 'remotion';
import { theme } from './shared/theme';
import { IconTritonWordmark } from './shared/icons/IconTritonWordmark';
import { IconTrident } from './shared/icons/IconTrident';

/**
 * Logo composition: Poseidon Trident Lettermark
 * Renders the wordmark with trident-T and optional icon mark.
 */
export const LogoTritonWordmark: React.FC<{
    variant?: 'wordmark-only' | 'lockup-horizontal' | 'lockup-stacked';
    background?: 'transparent' | 'navy' | 'abyss';
}> = ({
    variant = 'lockup-stacked',
    background = 'navy',
}) => {
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
                {/* Aurora background */}
                {background === 'abyss' && (
                    <>
                        <div style={{
                            position: 'absolute', inset: '-12% -8% -6% -8%',
                            background: theme.aurora.layers,
                            opacity: 0.12,
                            filter: `blur(${theme.aurora.auroraBlur}px) saturate(1.25)`,
                            mixBlendMode: 'screen',
                        }} />
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: `${theme.vignette.topVignette}, ${theme.vignette.bottomVignette}`,
                            opacity: 0.5,
                        }} />
                    </>
                )}

                {variant === 'wordmark-only' && (
                    <IconTritonWordmark fontSize={160} neon />
                )}

                {variant === 'lockup-horizontal' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
                        <IconTrident size={160} color={theme.accent.cyan} neon />
                        <IconTritonWordmark fontSize={80} neon />
                    </div>
                )}

                {variant === 'lockup-stacked' && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 32,
                    }}>
                        <IconTrident size={220} color={theme.accent.cyan} neon />
                        <IconTritonWordmark fontSize={72} neon />
                    </div>
                )}
            </AbsoluteFill>
        );
    };
