import React from 'react';
import { AbsoluteFill } from 'remotion';
import { theme } from './shared/theme';
import { IconTrident } from './shared/icons/IconTrident';
import { IconPoseidonWordmark } from './shared/icons/IconPoseidonWordmark';

export const LogoPoseidonWordmark: React.FC<{
    variant?: 'stacked' | 'horizontal' | 'text-only';
    background?: 'transparent' | 'navy' | 'abyss';
    fontFamily?: string;
}> = ({
    variant = 'stacked',
    background = 'navy',
    fontFamily = "'Outfit', system-ui, sans-serif",
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
            }}
        >
            {/* Aurora background */}
            {background !== 'transparent' && (
                <>
                    <div style={{
                        position: 'absolute', inset: '-12% -8% -6% -8%',
                        background: theme.aurora.layers,
                        opacity: 0.10,
                        filter: `blur(${theme.aurora.auroraBlur}px) saturate(1.25)`,
                        mixBlendMode: 'screen',
                    }} />
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: `${theme.vignette.topVignette}, ${theme.vignette.bottomVignette}`,
                        opacity: 0.4,
                    }} />
                </>
            )}

            {variant === 'text-only' && (
                <IconPoseidonWordmark
                    fontSize={140}
                    fontFamily={fontFamily}
                    fontWeight={300}
                    letterSpacing="0.18em"
                />
            )}

            {variant === 'horizontal' && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    position: 'relative',
                    zIndex: 1,
                }}>
                    <IconTrident
                        size={400}
                        neon={false}
                        style={{ width: 280, height: 280, marginRight: -70 }}
                    />
                    <IconPoseidonWordmark
                        fontSize={96}
                        fontFamily={fontFamily}
                        fontWeight={300}
                        letterSpacing="0.15em"
                    />
                </div>
            )}

            {variant === 'stacked' && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 12,
                    position: 'relative',
                    zIndex: 1,
                }}>
                    <IconTrident
                        size={400}
                        neon={false}
                        style={{ width: 320, height: 320 }}
                    />
                    <IconPoseidonWordmark
                        fontSize={72}
                        fontFamily={fontFamily}
                        fontWeight={300}
                        letterSpacing="0.20em"
                    />
                </div>
            )}
        </AbsoluteFill>
    );
};
