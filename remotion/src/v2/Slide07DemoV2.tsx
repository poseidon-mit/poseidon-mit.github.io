/**
 * V2 Visual-First: Slide 07 — Demo
 * Single hero video surface with centered play CTA.
 */
import React from 'react';
import { SlideFrame } from '../shared/SlideFrame';
import { theme } from '../shared/theme';
import { Tier3Background } from '../shared/visuals/tier3/Tier3Background';
import { v4Presets } from '../shared/backgroundPresets.v4';
import { SlideHeader } from '../shared/SlideHeader';
import { slideLayouts, v2Policy } from '../shared/slideLayouts';
import { DustMotes } from '../shared/effects/FloatingParticles';
import { staticFile } from 'remotion';
import { DeviceFrame } from '../shared/visuals/DeviceFrame';
import { getSlideHeaderColors, recolorBackgroundLayers } from '../shared/slideThemeColor';

const tc = getSlideHeaderColors('cyan');



interface Slide07DemoV2Props {
  debug?: boolean;
  debugGrid?: boolean;
  debugIds?: boolean;
}

export const Slide07DemoV2: React.FC<Slide07DemoV2Props> = ({
  debug = false,
  debugGrid,
  debugIds,
}) => {
  const layout = slideLayouts.slide07v2;

  return (
    <SlideFrame debug={debug} debugGrid={debugGrid} debugIds={debugIds} slideNumber={7}>
      <Tier3Background layers={recolorBackgroundLayers(v4Presets.slide07Demo, { primary: 'cyan', secondary: 'gray', intensityMultiplier: 1.4 })} />
      <DustMotes count={30} opacity={0.04} />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: theme.spacing.space4,
        }}
        data-debug-id="slide07v2.body"
      >
        {/* Header */}
        <div
          style={{ width: '100%', maxWidth: layout.headerMaxWidth, textAlign: 'center' }}
          data-debug-id="slide07v2.header"
        >
          <SlideHeader
            title="Product Walkthrough"
            subtitle="See Poseidon in action — from alert to execution"
            subtitleHighlight="from alert to execution"
            badge="DEMO"
            badgeTheme={tc.badgeTheme}
            titleColor="white"
            subtitleHighlightColor={tc.subtitleHighlightColor}
            subtitleHighlightShadow={tc.subtitleHighlightShadow}
            align="center"
            maxWidth={1620}
            titleStyle={{
              fontSize: Math.min(96, v2Policy.header.titleMaxPx),
              lineHeight: 1,
              textShadow: tc.titleTextShadow,
            }}
            subtitleStyle={{
              fontSize: Math.min(48, v2Policy.header.subtitleMaxPx),
              lineHeight: 1.1,
              maxWidth: 1500,
            }}
            headerStyle={{ marginBottom: theme.spacing.space2, textAlign: 'center' }}
            debugId="slide07v2.header.inner"
            debugBadgeId="slide07v2.header.badge"
            debugTitleId="slide07v2.header.title"
            debugSubtitleId="slide07v2.header.subtitle"
          />
        </div>

        {/* Single video player surface */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            width: '100%',
            minHeight: 0,
          }}
          data-debug-id="slide07v2.playerWrap"
        >
          <DeviceFrame
            device="macbook"
            toolbar
            perspective
            reflection={false}
            style={{
              width: 1060,
              height: 590,
              marginBottom: 24,
              flexShrink: v2Policy.card.cardFlexShrink,
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
              data-debug-id="slide07v2.playerSurface"
            >
              {/* Dashboard screenshot background */}
              <img
                src={staticFile('assets/screenshots/demo/dashboard.png')}
                alt="Poseidon Dashboard"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {/* Dark overlay for play button contrast */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%)',
                  pointerEvents: 'none',
                }}
              />
              {/* Play button */}
              <div
                style={{
                  width: layout.playButtonSize,
                  height: layout.playButtonSize,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${theme.glassPremium.innerPanelBorder}`,
                  background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.06) 42%, rgba(2,8,18,0.72) 100%)',
                  boxShadow:
                    '0 0 0 8px rgba(255,255,255,0.05), 0 24px 72px rgba(0,0,0,0.74), 0 0 18px rgba(255,255,255,0.10)',
                  zIndex: theme.zIndex.overlay,
                }}
                data-debug-id="slide07v2.playButton"
              >
                <div
                  style={{
                    marginLeft: 8,
                    width: 0,
                    height: 0,
                    borderTop: `${layout.playGlyphHeight / 2}px solid transparent`,
                    borderBottom: `${layout.playGlyphHeight / 2}px solid transparent`,
                    borderLeft: `${layout.playGlyphWidth}px solid rgba(255,255,255,0.95)`,
                    filter: `drop-shadow(${theme.textGlowSoft})`,
                  }}
                />
              </div>
            </div>
          </DeviceFrame>
        </div>

      </div>
    </SlideFrame>
  );
};
