/**
 * V2 Visual-First: Slide 09 — Epilogue (案4: Full-screen CTA)
 * QR code as hero element, compact avatar row, maximum "scan me" retention.
 */
import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { staticFile } from 'remotion';
import { IconTrident } from '../shared/icons/IconTrident';
import { IconPoseidonWordmark } from '../shared/icons/IconPoseidonWordmark';
import { SlideFrame } from '../shared/SlideFrame';
import { copy } from '../shared/copy';
import { theme } from '../shared/theme';
import { Tier3Background } from '../shared/visuals/tier3/Tier3Background';
import { DustMotes } from '../shared/effects/FloatingParticles';
import { v4Presets } from '../shared/backgroundPresets.v4';
import { GlassCard } from '../shared/GlassCard';
import { slideLayouts, v2Policy } from '../shared/slideLayouts';
import { authorityDarkGlassStyle } from '../shared/authorityDarkGlassStyle';
import { SlideHeader } from '../shared/SlideHeader';
import { getSlideHeaderColors, recolorBackgroundLayers } from '../shared/slideThemeColor';

const tc = getSlideHeaderColors('teal');

interface Slide09EpilogueV2Props {
  debug?: boolean;
  debugGrid?: boolean;
  debugIds?: boolean;
}

const avatarGradients = [
  `linear-gradient(135deg, ${theme.accent.cyan}, ${theme.accent.violet})`,
  `linear-gradient(135deg, ${theme.accent.teal}, ${theme.accent.gold})`,
  `linear-gradient(135deg, ${theme.accent.violet}, ${theme.accent.blue})`,
  `linear-gradient(135deg, ${theme.accent.amber}, ${theme.accent.cyan})`,
];

export const Slide09EpilogueV2: React.FC<Slide09EpilogueV2Props> = ({
  debug = false,
  debugGrid,
  debugIds,
}) => {
  const layout = slideLayouts.slide09;
  const content = copy.slide09;

  /* ── QR code generation (same pattern as QrDockCard) ── */
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const qrOptions = useMemo(
    () => ({
      errorCorrectionLevel: 'H' as const,
      margin: 1,
      width: layout.qrImageSize,
      color: { dark: '#000000', light: '#ffffff' },
    }),
    [layout.qrImageSize],
  );

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(content.cta.url, qrOptions)
      .then((dataUrl: string) => {
        if (active) setQrDataUrl(dataUrl);
      })
      .catch(() => {
        if (active) setQrDataUrl(null);
      });
    return () => {
      active = false;
    };
  }, [content.cta.url, qrOptions]);

  return (
    <SlideFrame debug={debug} debugGrid={debugGrid} debugIds={debugIds} slideNumber={9}>
      <Tier3Background layers={recolorBackgroundLayers(v4Presets.slide09Epilogue, { primary: 'teal', secondary: 'cyan', intensityMultiplier: 1.4 })} />
      <DustMotes count={26} opacity={0.05} />

      {/* ═══ Main content column ═══ */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: theme.spacing.space4,
        }}
        data-debug-id="slide09v2.body"
      >
        {/* ═══ Header ═══ */}
        <div style={{ flexShrink: 0 }} data-debug-id="slide09v2.header">
          <SlideHeader
            badge="ONE YEAR REFLECTION"
            title={content.title}
            titleNode={
              <>
                {content.titleLead}{' '}
                <span style={{ color: 'white' }}>
                  {content.titleHighlight}
                </span>
                {content.titleTail}
              </>
            }
            titleColor="white"
            badgeTheme={{
              background:
                'linear-gradient(90deg, rgba(255,107,107,0.16) 0%, rgba(255,217,61,0.16) 20%, rgba(52,211,153,0.16) 40%, rgba(0,240,255,0.18) 60%, rgba(139,92,246,0.16) 80%, rgba(255,107,107,0.16) 100%)',
              border: '2px solid transparent',
              color: '#f8fafc',
              boxShadow:
                '0 0 10px rgba(255,107,107,0.11), 0 0 14px rgba(52,211,153,0.11), 0 0 18px rgba(0,240,255,0.11), 0 0 22px rgba(139,92,246,0.11)',
              textShadow: '0 0 8px rgba(255,255,255,0.22)',
            }}
            align="center"
            maxWidth={1600}
            headerStyle={{ marginBottom: 0 }}
            badgeStyle={{
              fontSize: layout.badgeFontSize,
              padding: '12px 36px',
              backgroundImage:
                'linear-gradient(135deg, rgba(8,12,25,0.92), rgba(12,16,30,0.88)), linear-gradient(90deg, #FF6B6B, #FFD93D, #34D399, #00F0FF, #8B5CF6, #FF6B6B)',
              backgroundOrigin: 'padding-box, border-box',
              backgroundClip: 'padding-box, border-box',
            }}
            titleStyle={{
              fontSize: Math.min(96, v2Policy.header.titleMaxPx),
              lineHeight: 1,
              textShadow: tc.titleTextShadow,
            }}
            debugId="slide09v2.header.inner"
            debugBadgeId="slide09v2.header.badge"
            debugTitleId="slide09v2.header.title"
          />
        </div>

        {/* ═══ CTA Card — hero element ═══ */}
        <GlassCard
          tone="dark"
          liquidGlass="premium"
          glassQuality="premium"
          style={{
            width: '100%',
            maxWidth: layout.ctaMaxWidth,
            padding: '36px 56px',
            borderTop: `2px solid ${theme.accent.teal}`,
            ...authorityDarkGlassStyle,
          }}
          debugId="slide09v2.cta"
        >
          {/* Upper: QR + text */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 48,
            }}
          >
            {/* QR code box */}
            <div
              style={{
                width: layout.qrBoxSize,
                height: layout.qrBoxSize,
                borderRadius: 18,
                border: `1px solid ${theme.glass.glassBorder}`,
                background: 'rgba(6,12,24,0.82)',
                boxShadow:
                  'inset 0 0 24px rgba(0,240,255,0.1), 0 0 24px rgba(0,240,255,0.16)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
              }}
              data-debug-id="slide09v2.cta.qr"
            >
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Prototype QR code"
                  style={{
                    width: layout.qrImageSize,
                    height: layout.qrImageSize,
                    borderRadius: 10,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: layout.qrImageSize,
                    height: layout.qrImageSize,
                    borderRadius: 10,
                    border: '1px dashed rgba(255,255,255,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: theme.typography.fontMono,
                    fontSize: layout.qrPlaceholderSize,
                    color: 'rgba(255,255,255,0.75)',
                  }}
                >
                  {content.cta.url}
                </div>
              )}
            </div>

            {/* Text stack */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  fontFamily: theme.typography.fontHeader,
                  fontSize: layout.ctaTitleSize,
                  fontWeight: 700,
                  color: theme.accent.teal,
                  textShadow: `${theme.textCrisp}, ${theme.neon.teal.sharper}`,
                  lineHeight: 1,
                }}
              >
                Try the prototype
              </div>
              <div
                style={{
                  fontFamily: theme.typography.fontUi,
                  fontSize: layout.ctaUrlSize,
                  color: theme.accent.teal,
                  lineHeight: 1,
                }}
              >
                https://poseidon-mit.com
              </div>
            </div>
          </div>

          {/* Separator */}
          <div
            style={{
              height: 1,
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 15%, rgba(255,255,255,0.15) 85%, transparent 100%)',
              margin: '24px 0 20px',
            }}
          />

          {/* Team members — evenly spaced with names */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 56,
            }}
            data-debug-id="slide09v2.cta.team"
          >
            {content.team.map((member, i) => (
              <div
                key={member.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: layout.avatarSize,
                    height: layout.avatarSize,
                    borderRadius: '50%',
                    padding: 3,
                    background: avatarGradients[i % avatarGradients.length],
                    boxShadow: `0 0 16px rgba(0,240,255,0.25), 0 0 32px rgba(139,92,246,0.15)`,
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: theme.background.deepNavy,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: theme.typography.fontHeader,
                      fontSize: layout.avatarInitialSize,
                      fontWeight: 700,
                      color: 'white',
                      textShadow: theme.neon.cyan.sharper,
                    }}
                  >
                    {member.initials}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: theme.typography.fontUi,
                    fontSize: layout.teamNameSize,
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.80)',
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {member.name}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* ═══ Poseidon Logo ═══ */}
        <div
          style={{
            width: '100%',
            height: 220,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          data-debug-id="slide09v2.footer-logo"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: 'fit-content',
              transform: 'translateX(-45px) translateY(-35px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <div style={{ overflow: 'hidden', width: 160, height: 220, flexShrink: 0 }}>
                <IconTrident
                  size={400}
                  neon={false}
                  style={{ width: 220, height: 220 }}
                />
              </div>
              <IconPoseidonWordmark
                fontSize={100}
                fontFamily="'Outfit', system-ui, sans-serif"
                fontWeight={300}
                letterSpacing="0.15em"
              />
            </div>

            <div
              style={{
                width: 1,
                height: 100,
                margin: '0 16px',
                background: 'rgba(255,255,255,0.24)',
                boxShadow: `0 0 8px ${theme.accent.cyan}33`,
                borderRadius: 1,
              }}
            />

            <div
              style={{
                width: 480,
                height: 96,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <img
                src={staticFile('mit-professional-education-transparent.png')}
                alt="MIT Professional Education logo"
                style={{
                  width: 480,
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};
