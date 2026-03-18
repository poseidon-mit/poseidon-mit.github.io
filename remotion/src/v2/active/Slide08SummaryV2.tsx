import React from 'react';
import { SlideFrame } from '../../shared/SlideFrame';
import { copy } from '../../shared/copy';
import { theme } from '../../shared/theme';
import { Tier3Background } from '../../shared/visuals/tier3/Tier3Background';
import { DustMotes } from '../../shared/effects/FloatingParticles';
import { GlassRefraction } from '../../shared/cinematic/GlassRefraction';
import { v4Presets } from '../../shared/backgroundPresets.v4';
import { SlideHeader } from '../../shared/SlideHeader';
import { slideLayouts, v2Policy } from '../../shared/slideLayouts';
import { getSlideHeaderColors, recolorBackgroundLayers } from '../../shared/slideThemeColor';
import { ShapeHalo } from '../../shared/visuals/ShapeHalo';
import { SlideIcon } from '../../shared/SlideIcon';

const tc = getSlideHeaderColors('white');

interface Slide08SummaryV2Props {
  debug?: boolean;
  debugGrid?: boolean;
  debugIds?: boolean;
}

const resolvePillarColor = (pillarId: string, fallback: string): string => {
  const pillars = copy.slide08.pillars as ReadonlyArray<{ id: string; color: string }>;
  return pillars.find((pillar) => pillar.id === pillarId)?.color ?? fallback;
};

const GOVERNANCE_COLOR = resolvePillarColor('governance', '#14d8c1');
const ARCHITECTURE_COLOR = resolvePillarColor('assistant', '#f7b228');

/* ── Governance glass chips ── */
const GOVERNANCE_CHIPS = [
  { icon: 'compliance-badge', label: 'Regulatory Compliance', glow: 'teal' as const },
  { icon: 'gear', label: 'ML/LLMOps', glow: 'teal' as const },
  { icon: 'explainability', label: 'Model management', glow: 'teal' as const },
  { icon: 'replay-spiral', label: '3rd party assessment', glow: 'teal' as const },
];

/* ── Architecture timeline steps ── */
const ARCH_TIMELINE = [
  { icon: 'ai-brain', label: 'Deterministic models compute', detail: 'ML models calculate with precision', color: theme.accent.amber },
  { icon: 'explainability', label: 'GenAI explains', detail: 'Plain English explanation', color: theme.accent.teal },
  { icon: 'gear', label: 'Minimize user effort', detail: 'Workflow orchestration', color: theme.accent.violet },
  { icon: 'consent-check', label: 'Auditability', detail: 'Every recommendation auditable', color: theme.accent.blue },
];


/* ── Shared glass chip style (Slide06 pattern) ── */
const glassChipStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 7,
  background: theme.glassPremium.innerPanelBg,
  border: `1px solid ${theme.glassPremium.innerPanelBorder}`,
  borderRadius: 8,
  padding: '14px 14px',
  flexShrink: 0,
};

/* ── Pillar bar container style ── */
const pillarBarStyle = (accentColor: string): React.CSSProperties => ({
  background: theme.glassPremium.innerPanelBg,
  border: `1px solid ${accentColor}44`,
  borderLeft: `3px solid ${accentColor}`,
  borderRadius: 12,
  padding: '16px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  flex: 1,
});

export const Slide08SummaryV2: React.FC<Slide08SummaryV2Props> = ({
  debug = false,
  debugGrid,
  debugIds,
}) => {
  const layout = slideLayouts.slide08v2;

  return (
    <SlideFrame debug={debug} debugGrid={debugGrid} debugIds={debugIds} slideNumber={7}>
      <Tier3Background layers={recolorBackgroundLayers(v4Presets.slide08Summary, { primary: 'white', secondary: 'violet', intensityMultiplier: 1.4 })} />
      <DustMotes count={26} opacity={0.04} />

      <SlideHeader
        badge="SUMMARY"
        title="Poseidon Strategy Summary"
        titleColor="white"
        badgeTheme={{
          background: 'linear-gradient(90deg, rgba(0,240,255,0.12) 0%, rgba(139,92,246,0.10) 45%, rgba(245,158,11,0.10) 100%)',
          border: `1px solid ${theme.glassPremium.innerPanelBorder}`,
          color: '#f8fafc',
          boxShadow: '0 10px 28px rgba(0,0,0,0.34), 0 0 10px rgba(255,255,255,0.08)',
          textShadow: '0 0 6px rgba(255,255,255,0.16)',
        }}
        maxWidth={1740}
        headerStyle={{ marginBottom: theme.spacing.space3 }}
        titleStyle={{
          fontSize: Math.min(96, v2Policy.header.titleMaxPx),
          lineHeight: 1,
          textShadow: tc.titleTextShadow,
        }}
        debugId="slide08v2.header"
        debugBadgeId="slide08v2.header.badge"
        debugTitleId="slide08v2.header.title"
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          flex: 1,
        }}
        data-debug-id="slide08v2.body"
      >
        {/* ══════ Vision Hero ══════ */}
        <div
          style={{
            position: 'relative',
            flexShrink: v2Policy.card.cardFlexShrink,
          }}
        >
          <ShapeHalo
            size={1100}
            opacity={0.14}
            color={theme.accent.cyan}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: theme.zIndex.background,
              filter: 'blur(8px)',
            }}
          />
          <div style={{ position: 'relative', zIndex: theme.zIndex.content }}>
            <GlassRefraction
              intensity={0.4}
              chromaticAberration={false}
              innerGlow
              glowColor={theme.accent.cyan}
              edgeHighlight
              borderRadius={12}
              frosted
              frostedBlur={16}
            >
              <div
                style={{
                  padding: layout.visionPadding,
                  textAlign: 'center',
                  background: 'linear-gradient(170deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 40%, rgba(14,22,38,0.38) 100%)',
                }}
                data-debug-id="slide08v2.vision"
              >
                <div
                  style={{
                    fontFamily: theme.typography.fontMono,
                    fontSize: Math.max(v2Policy.typography.metaMinPx, 15),
                    color: 'rgba(255,255,255,0.56)',
                    letterSpacing: '0.02em',
                    marginBottom: 10,
                  }}
                >
                  {copy.slide08.visionLabel}
                </div>
                <div
                  style={{
                    fontFamily: theme.typography.fontUi,
                    fontSize: layout.visionBodySize,
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.9)',
                    lineHeight: 1.35,
                  }}
                >
                  <span
                    style={{
                      color: 'rgba(52,211,153,0.92)',
                      fontWeight: 700,
                      textShadow: theme.textCrisp,
                    }}
                  >
                    {copy.slide08.visionHighlight}
                  </span>{' '}
                  <span>{copy.slide08.visionBody}</span>
                </div>
              </div>
            </GlassRefraction>
          </div>
        </div>

        {/* ══════ 3 Pillar Horizontal Bars ══════ */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            flex: 1,
          }}
        >
          {/* ── Pillar 1: Governance — Glass Chips ── */}
          <div style={pillarBarStyle(GOVERNANCE_COLOR)} data-debug-id="slide08v2.pillar.governance">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <SlideIcon name="compliance-badge" size={46} glowColor="teal" renderMode="mask" />
              <span
                style={{
                  fontFamily: theme.typography.fontHeader,
                  fontSize: layout.pillarTitleSize,
                  fontWeight: 700,
                  color: GOVERNANCE_COLOR,
                  textShadow: theme.textCrisp,
                }}
              >
                Compliance first
              </span>
              <span
                style={{
                  fontFamily: theme.typography.fontUi,
                  fontSize: layout.pillarSubtitleSize,
                  color: 'rgba(255,255,255,0.6)',
                  marginLeft: 8,
                }}
              >
                Make sure Poseidon meets regulatory expectations
              </span>
            </div>
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 10 }}>
              {GOVERNANCE_CHIPS.map((chip) => (
                <div key={chip.label} style={{ ...glassChipStyle, flex: 1, justifyContent: 'center' }}>
                  <SlideIcon name={chip.icon} size={40} glowColor={chip.glow} renderMode="mask" style={{ flexShrink: 0 }} />
                  <span
                    style={{
                      fontFamily: theme.typography.fontUi,
                      fontSize: layout.pillarSubtitleSize,
                      color: 'rgba(255,255,255,0.72)',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {chip.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Pillar 2: Architecture — Vertical Timeline ── */}
          <div style={pillarBarStyle(ARCHITECTURE_COLOR)} data-debug-id="slide08v2.pillar.architecture">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <SlideIcon name="ai-brain" size={46} glowColor="amber" renderMode="mask" />
              <span
                style={{
                  fontFamily: theme.typography.fontHeader,
                  fontSize: layout.pillarTitleSize,
                  fontWeight: 700,
                  color: ARCHITECTURE_COLOR,
                  textShadow: theme.textCrisp,
                }}
              >
                Architecture
              </span>
              <span
                style={{
                  fontFamily: theme.typography.fontUi,
                  fontSize: layout.pillarSubtitleSize,
                  color: 'rgba(255,255,255,0.6)',
                  marginLeft: 8,
                }}
              >
                Unified AI Architecture
              </span>
            </div>

            {/* Horizontal Timeline */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                gap: 0,
                flex: 1,
                alignItems: 'flex-start',
                marginTop: 15,
              }}
            >
              {/* Horizontal line */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 6,
                  height: 2,
                  background: `linear-gradient(90deg, ${theme.accent.amber}88, ${theme.accent.teal}88, ${theme.accent.violet}88, ${theme.accent.blue}88)`,
                }}
              />
              {ARCH_TIMELINE.map((step) => (
                <div
                  key={step.label}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: 22,
                    position: 'relative',
                  }}
                >
                  {/* Neon dot — centered above text */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: step.color,
                      boxShadow: `0 0 6px ${step.color}, 0 0 14px ${step.color}88, 0 0 2px #fff`,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: theme.typography.fontUi,
                      fontWeight: 700,
                      fontSize: layout.timelineStepLabelSize,
                      color: step.color,
                      textAlign: 'center',
                    }}
                  >
                    {step.label}
                  </span>
                  <span
                    style={{
                      fontFamily: theme.typography.fontUi,
                      fontSize: layout.timelineStepDetailSize,
                      color: 'rgba(255,255,255,0.50)',
                      textAlign: 'center',
                    }}
                  >
                    {step.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </SlideFrame>
  );
};
