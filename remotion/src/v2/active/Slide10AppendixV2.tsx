import React from 'react';
import { SlideFrame } from '../../shared/SlideFrame';
import { copy } from '../../shared/copy';
import { theme } from '../../shared/theme';
import { Tier3Background } from '../../shared/visuals/tier3/Tier3Background';
import { v4Presets } from '../../shared/backgroundPresets.v4';
import { DustMotes } from '../../shared/effects/FloatingParticles';
import { slideLayouts } from '../../shared/slideLayouts';
import { getSlideHeaderColors, recolorBackgroundLayers } from '../../shared/slideThemeColor';

const tc = getSlideHeaderColors('blue');

interface Slide10AppendixV2Props {
  debug?: boolean;
  debugGrid?: boolean;
  debugIds?: boolean;
}

export const Slide10AppendixV2: React.FC<Slide10AppendixV2Props> = ({
  debug = false,
  debugGrid,
  debugIds,
}) => {
  const layout = slideLayouts.slide10v2;

  return (
    <SlideFrame debug={debug} debugGrid={debugGrid} debugIds={debugIds} slideNumber={11}>
      <Tier3Background layers={recolorBackgroundLayers(v4Presets.slide10Appendix, { primary: 'blue', secondary: 'white', intensityMultiplier: 1.4 })} />
      <DustMotes count={22} opacity={0.04} />

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        data-debug-id="slide10v2.layout"
      >
        <div
          style={{
            width: '100%',
            maxWidth: layout.titleBlockMaxWidth,
            textAlign: 'center',
          }}
          data-debug-id="slide10v2.title.block"
        >
          <h1
            style={{
              margin: 0,
              fontFamily: theme.typography.fontHeader,
              fontSize: layout.titleSize,
              fontWeight: 700,
              lineHeight: 0.98,
              letterSpacing: '-0.02em',
              color: 'rgba(255,255,255,0.96)',
              textShadow: tc.titleTextShadow,
            }}
            data-debug-id="slide10v2.title"
          >
            {copy.slide10.title}
          </h1>
          {copy.slide10.index.length > 0 ? (
            <div
              style={{
                marginTop: 32,
                fontFamily: theme.typography.fontMono,
                fontSize: layout.indexSize,
                color: 'rgba(255,255,255,0.50)',
                letterSpacing: '0.08em',
                lineHeight: 2.0,
              }}
              data-debug-id="slide10v2.index"
            >
              {copy.slide10.index.join('\u2003/\u2003')}
            </div>
          ) : null}
        </div>
      </div>
    </SlideFrame>
  );
};
