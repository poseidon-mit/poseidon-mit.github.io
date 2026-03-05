/**
 * V2 Visual-First: Slide 07 — Demo
 * Single hero video surface with centered play CTA.
 */
import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { SlideFrame } from '../../shared/SlideFrame';
import { copy } from '../../shared/copy';
import { theme } from '../../shared/theme';
import { Tier3Background } from '../../shared/visuals/tier3/Tier3Background';
import { v4Presets } from '../../shared/backgroundPresets.v4';
import { SlideHeader } from '../../shared/SlideHeader';
import { slideLayouts, v2Policy } from '../../shared/slideLayouts';
import { DustMotes } from '../../shared/effects/FloatingParticles';
import { staticFile } from 'remotion';
import { DeviceFrame } from '../../shared/visuals/DeviceFrame';
import { GlassCard } from '../../shared/GlassCard';
import { getSlideHeaderColors, recolorBackgroundLayers } from '../../shared/slideThemeColor';

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
  const content = copy.slide07;
  const youtubeCta = content.youtubeCta;
  const hasYoutubeTitle = Boolean(youtubeCta.title?.trim());
  const hasYoutubeSubtitle = Boolean(youtubeCta.subtitle?.trim());

  const [youtubeQrDataUrl, setYoutubeQrDataUrl] = useState<string | null>(null);
  const youtubeQrOptions = useMemo(
    () => ({
      errorCorrectionLevel: 'H' as const,
      margin: 2,
      width: layout.youtubeQrSize,
      color: { dark: '#0A0A0A', light: '#FFFFFF' },
    }),
    [layout.youtubeQrSize],
  );

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(youtubeCta.url, youtubeQrOptions)
      .then((dataUrl: string) => {
        if (active) setYoutubeQrDataUrl(dataUrl);
      })
      .catch(() => {
        if (active) setYoutubeQrDataUrl(null);
      });
    return () => {
      active = false;
    };
  }, [youtubeCta.url, youtubeQrOptions]);

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
          style={{ width: '100%', maxWidth: '100%', textAlign: 'center' }}
          data-debug-id="slide07v2.header"
        >
          <SlideHeader
            title="Financial Confidence, Effortlessly"
            subtitle="Poseidon turns financial complexity into seamless action"
            subtitleHighlight="seamless action"
            badge="PRODUCT VIDEO"
            badgeTheme={tc.badgeTheme}
            titleColor="white"
            subtitleHighlightColor={tc.subtitleHighlightColor}
            subtitleHighlightShadow={tc.subtitleHighlightShadow}
            align="center"
            maxWidth="100%"
            titleStyle={{
              fontSize: Math.min(96, v2Policy.header.titleMaxPx),
              lineHeight: 1,
              textShadow: tc.titleTextShadow,
              whiteSpace: 'nowrap',
            }}
            subtitleStyle={{
              fontSize: Math.min(48, v2Policy.header.subtitleMaxPx),
              lineHeight: 1.1,
              whiteSpace: 'nowrap',
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
          <div
            style={{
              position: 'relative',
              width: 1060,
              height: 590,
              marginBottom: 24,
            }}
            data-debug-id="slide07v2.playerStage"
          >
            <DeviceFrame
              device="macbook"
              toolbar
              perspective
              reflection={false}
              style={{
                width: 1060,
                height: 590,
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

            {/* YouTube audio-safe fallback card */}
            <GlassCard
              tone="dark"
              liquidGlass="premium"
              glassQuality="premium"
              debugId="slide07v2.youtubeCta"
              style={{
                position: 'absolute',
                right: layout.youtubeCardRight,
                bottom: layout.youtubeCardBottom,
                width: layout.youtubeCardWidth,
                height: layout.youtubeCardHeight,
                padding: '10px 12px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: theme.zIndex.overlay + 1,
                borderRadius: 18,
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 26px 68px rgba(0,0,0,0.66), 0 0 18px rgba(0,240,255,0.14)',
              }}
            >
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
                title={youtubeCta.note}
              >
                <img
                  src={staticFile('assets/png/youtubelogo-clean-filled.png')}
                  alt={`${youtubeCta.badge} icon`}
                  style={{
                    height: layout.youtubeBadgeHeight,
                    width: 'auto',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>

              {hasYoutubeTitle ? (
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: theme.typography.fontHeader,
                    fontSize: Math.min(20, layout.youtubeTitleSize),
                    fontWeight: 700,
                    lineHeight: 1.08,
                    color: '#FFFFFF',
                    textShadow: theme.textCrisp,
                    textAlign: 'center',
                  }}
                >
                  {youtubeCta.title}
                </div>
              ) : null}
              {hasYoutubeSubtitle ? (
                <div
                  style={{
                    marginTop: 4,
                    fontFamily: theme.typography.fontUi,
                    fontSize: Math.min(15, layout.youtubeBodySize),
                    fontWeight: 500,
                    lineHeight: 1.1,
                    color: 'rgba(226,236,248,0.94)',
                    textAlign: 'center',
                  }}
                >
                  {youtubeCta.subtitle}
                </div>
              ) : null}

              <div
                style={{
                  marginTop: hasYoutubeTitle || hasYoutubeSubtitle ? 8 : 14,
                  width: layout.youtubeQrSize,
                  height: layout.youtubeQrSize,
                  boxSizing: 'border-box',
                  padding: layout.youtubeQrPad,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  borderRadius: 14,
                  background: '#FFFFFF',
                  border: '1px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 10px 24px rgba(0,0,0,0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {youtubeQrDataUrl ? (
                  <img
                    src={youtubeQrDataUrl}
                    alt="YouTube audio demo QR"
                    style={{ width: '100%', height: '100%', display: 'block' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 8,
                      border: '1px dashed rgba(10,10,10,0.55)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      color: 'rgba(10,10,10,0.72)',
                      fontFamily: theme.typography.fontMono,
                      fontSize: 12,
                      lineHeight: 1.1,
                      padding: '0 4px',
                    }}
                  >
                    {youtubeCta.displayUrl}
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>

      </div>
    </SlideFrame>
  );
};
