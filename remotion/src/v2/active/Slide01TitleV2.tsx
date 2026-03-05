/**
 * V2 Visual-First: Slide 01 — Title
 * Light polish with tighter opening hierarchy.
 */
import React from 'react';
import { staticFile } from 'remotion';
import { SlideFrame } from '../../shared/SlideFrame';
import { copy } from '../../shared/copy';
import { theme } from '../../shared/theme';
import { Tier3Background } from '../../shared/visuals/tier3/Tier3Background';
import { NeonText } from '../../shared/NeonText';
import { v4Presets } from '../../shared/backgroundPresets.v4';
import { getSlideHeaderColors, recolorBackgroundLayers } from '../../shared/slideThemeColor';
import { slideLayouts, v2Policy } from '../../shared/slideLayouts';
import { IconPoseidonWordmark } from '../../shared/icons/IconPoseidonWordmark';

import { DustMotes } from '../../shared/effects/FloatingParticles';

const tc = getSlideHeaderColors('cyan');

const avatarGradients = [
  `linear-gradient(135deg, ${theme.accent.cyan}, ${theme.accent.violet})`,
  `linear-gradient(135deg, ${theme.accent.teal}, ${theme.accent.gold})`,
  `linear-gradient(135deg, ${theme.accent.violet}, ${theme.accent.blue})`,
  `linear-gradient(135deg, ${theme.accent.amber}, ${theme.accent.cyan})`,
];

interface Slide01TitleV2Props {
  debug?: boolean;
  debugGrid?: boolean;
  debugIds?: boolean;
}

export const Slide01TitleV2: React.FC<Slide01TitleV2Props> = ({
  debug = false,
  debugGrid,
  debugIds,
}) => {
  const layout = slideLayouts.slide01;
  const content = copy.slide01;

  return (
    <SlideFrame debug={debug} debugGrid={debugGrid} debugIds={debugIds} showDisclosure slideNumber={1}>
      <Tier3Background layers={recolorBackgroundLayers(v4Presets.slide01Title, { primary: 'cyan', secondary: 'violet', intensityMultiplier: 1.4 })} />
      <DustMotes count={36} opacity={0.07} />

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
        data-debug-id="slide01v2.content"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme.spacing.space2,
            transform: 'translateX(-35px)',
          }}
          data-debug-id="slide01v2.logoWrap"
        >
          <img
            src={staticFile('assets/png/logo-webui.png')}
            alt="Poseidon trident icon"
            style={{
              width: 240,
              height: 240,
              marginRight: -40,
              transform: 'translateX(-20px)',
              flexShrink: 0,
              objectFit: 'contain',
            }}
          />
          <IconPoseidonWordmark
            fontSize={144}
            fontFamily="'Outfit', system-ui, sans-serif"
            fontWeight={300}
            letterSpacing="0.15em"
          />
        </div>

        <div style={{ maxWidth: layout.maxWidth }} data-debug-id="slide01v2.text">

          <h2
            style={{
              fontFamily: theme.typography.fontUi,
              fontSize: Math.min(48, v2Policy.header.subtitleMaxPx),
              fontWeight: 500,
              marginTop: 0,
              marginBottom: 0,
            }}
            data-debug-id="slide01v2.subtitle"
          >
            <NeonText color="cyan">{content.subtitle}</NeonText>
          </h2>

        </div>

        <div
          style={{
            width: 520,
            height: 1,
            background:
              'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(0,240,255,0.34) 50%, rgba(255,255,255,0) 100%)',
          }}
          data-debug-id="slide01v2.rule"
        />

        {/* ═══ Group 7 + Team Members — single row ═══ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 28,
          }}
          data-debug-id="slide01v2.team"
        >
          <div
            style={{
              fontFamily: theme.typography.fontHeader,
              fontSize: layout.groupLabelSize,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
            }}
          >
            Group 7
          </div>
          <div
            style={{
              width: 1,
              height: 36,
              background: 'rgba(255,255,255,0.18)',
            }}
          />
          {copy.slide01.team.map((member, i) => (
            <div
              key={member.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  padding: 2,
                  background: avatarGradients[i % avatarGradients.length],
                  boxShadow: '0 0 12px rgba(0,240,255,0.18)',
                  flexShrink: 0,
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
                  color: 'rgba(255,255,255,0.65)',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {member.name}
              </div>
            </div>
          ))}
        </div>

      </div>
    </SlideFrame>
  );
};
