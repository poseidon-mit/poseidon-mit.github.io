/**
 * Effect Sample Slide — renders a single background effect with a label.
 * Used for A/B testing background enhancements.
 */
import React from 'react';
import { SlideFrame } from '../../shared/SlideFrame';
import { theme } from '../../shared/theme';
import { Tier3Background } from '../../shared/visuals/tier3/Tier3Background';
import { v4Presets } from '../../shared/backgroundPresets.v4';

interface EffectSampleSlideProps {
  presetKey: string;
  label: string;
}

export const EffectSampleSlide: React.FC<EffectSampleSlideProps> = ({
  presetKey,
  label,
}) => {
  const layers = v4Presets[presetKey] ?? [];

  return (
    <SlideFrame>
      <Tier3Background layers={layers} />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 24,
        }}
      >
        <div
          style={{
            fontFamily: theme.typography.fontMono,
            fontSize: 20,
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.2em',
          }}
        >
          EFFECT SAMPLE
        </div>
        <h1
          style={{
            fontFamily: theme.typography.fontHeader,
            fontSize: 72,
            fontWeight: 700,
            color: 'white',
            margin: 0,
            textShadow: theme.textCrisp,
          }}
        >
          {label}
        </h1>
        <div
          style={{
            fontFamily: theme.typography.fontUi,
            fontSize: 28,
            color: 'rgba(255,255,255,0.6)',
            maxWidth: 800,
          }}
        >
          {layers.map((l, i) => (
            <span key={i}>
              {l.visual} (opacity: {l.opacity})
              {i < layers.length - 1 ? ' + ' : ''}
            </span>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
};
