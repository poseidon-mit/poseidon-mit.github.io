import React from 'react';
import { useCurrentFrame } from 'remotion';

/**
 * Animated liquid glass overlay for GlassCard.
 * Multi-radial + linear sheen with dynamic movement for a "living" glass effect.
 */
interface LiquidGlassLayerProps {
  mode?: 'subtle' | 'standard' | 'premium';
  style?: React.CSSProperties;
}

const modeConfig: Record<
  'subtle' | 'standard' | 'premium',
  { opacity: number; backdrop: string; motionScale: number; accentScale: number; whiteScale: number }
> = {
  subtle: {
    opacity: 0.18,
    backdrop: 'blur(6px) saturate(1.3) brightness(1.02)',
    motionScale: 1,
    accentScale: 1,
    whiteScale: 1,
  },
  standard: {
    opacity: 0.30,
    backdrop: 'blur(10px) saturate(1.5) brightness(1.04)',
    motionScale: 1.15,
    accentScale: 1.15,
    whiteScale: 1.1,
  },
  premium: {
    opacity: 0.11,
    backdrop: 'none',
    motionScale: 0.5,
    accentScale: 0.28,
    whiteScale: 1.18,
  },
};

export const LiquidGlassLayer: React.FC<LiquidGlassLayerProps> = ({ mode = 'standard', style }) => {
  const frame = useCurrentFrame();
  const config = modeConfig[mode];

  // Dynamic movement for "living" glass
  const driftX = Math.sin(frame / 45) * 2 * config.motionScale;
  const driftY = Math.cos(frame / 55) * 1.5 * config.motionScale;
  const rotate = Math.sin(frame / 120) * 0.5 * config.motionScale;

  const tintDamp = mode === 'premium' ? 0.62 : 1;
  const whiteA = 0.09 * config.whiteScale;
  const whiteB = 0.018 * config.whiteScale;
  const cyanA = 0.12 * config.accentScale * tintDamp;
  const violetA = 0.10 * config.accentScale * tintDamp;

  const background = [
    `radial-gradient(120% 120% at ${10 + driftX}% ${10 + driftY}%, rgba(255,255,255,${whiteA.toFixed(3)}) 0%, rgba(255,255,255,${whiteB.toFixed(3)}) 40%, rgba(255,255,255,0) 70%)`,
    `radial-gradient(90% 90% at ${80 - driftX}% ${15 - driftY}%, rgba(0,240,255,${cyanA.toFixed(3)}) 0%, rgba(0,240,255,0) 60%)`,
    `radial-gradient(80% 80% at ${30 + driftX}% ${80 + driftY}%, rgba(139,92,246,${violetA.toFixed(3)}) 0%, rgba(139,92,246,0) 60%)`,
    `linear-gradient(135deg, rgba(255,255,255,${(0.03 * config.whiteScale).toFixed(3)}), rgba(255,255,255,0) 60%)`,
  ].join(', ');

  return (
    <div
      style={{
        position: 'absolute',
        inset: '-20%',
        background,
        mixBlendMode: 'screen',
        opacity: config.opacity,
        backdropFilter: config.backdrop,
        WebkitBackdropFilter: config.backdrop,
        transform: `translate3d(${driftX}%, ${driftY}%, 0) scale(1.02) rotate(${rotate}deg)`,
        pointerEvents: 'none',
        borderRadius: 'inherit',
        ...style,
      }}
    />
  );
};
