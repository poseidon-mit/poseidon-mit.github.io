/**
 * V2 Visual-First: Slide 05 — Beyond Aggregation
 * 案2: 3-stage escalation — COMMODITIZED → EMERGING → ONLY POSEIDON
 */
import React from 'react';
import { SlideFrame } from '../../shared/SlideFrame';
import { theme } from '../../shared/theme';
import { Tier3Background } from '../../shared/visuals/tier3/Tier3Background';
import { DustMotes } from '../../shared/effects/FloatingParticles';
import { v4Presets } from '../../shared/backgroundPresets.v4';
import { GlassCard } from '../../shared/GlassCard';
import { slideLayouts, v2Policy } from '../../shared/slideLayouts';
import { authorityDarkGlassStyle } from '../../shared/authorityDarkGlassStyle';
import { SlideHeader } from '../../shared/SlideHeader';
import { SlideIcon } from '../../shared/SlideIcon';
import { NeonText } from '../../shared/NeonText';
import { getSlideHeaderColors, recolorBackgroundLayers } from '../../shared/slideThemeColor';

const tc = getSlideHeaderColors('amber');

interface StageItem {
  icon: string;
  label: string;
  mark: string;
  desc?: string;
}

interface Stage {
  id: string;
  header: string;
  subheader: string;
  variant?: 'teal' | 'violet' | 'gold' | 'blue' | 'red';
  accentColor: string;
  glowColor?: 'teal' | 'amber' | 'red';
  items: readonly StageItem[];
}

const STAGES: readonly Stage[] = [
  {
    id: 'commoditized',
    header: 'COMMODITIZED',
    subheader: 'Everyone does this',
    variant: undefined,
    accentColor: '#64748B',
    items: [
      { icon: 'data-grid', label: 'Aggregation', mark: '✓', desc: 'Multi-bank account linking' },
      { icon: 'budget-tool', label: 'Budgeting', mark: '✓', desc: 'Rule-based spend tracking' },
    ],
  },
  {
    id: 'emerging',
    header: 'EMERGING',
    subheader: 'Some are trying',
    variant: 'teal',
    accentColor: theme.accent.teal,
    glowColor: 'teal',
    items: [
      { icon: 'data-grid', label: 'Dashboard', mark: '○', desc: 'Visibility without action' },
      { icon: 'insight-lamp', label: 'Financial Tracking', mark: '○', desc: 'Budget management' },
    ],
  },
  {
    id: 'only-poseidon',
    header: 'ONLY POSEIDON',
    subheader: 'No one else',
    variant: 'gold',
    accentColor: theme.accent.amber,
    glowColor: 'amber',
    items: [
      { icon: 'ai-brain', label: 'Predictive Intelligence', mark: '★', desc: 'Personalized ML models' },
      { icon: 'explainability', label: 'Explainable AI', mark: '★', desc: 'Plain English explanation with low temperature + contributing factors' },
      { icon: 'consent-check', label: 'Approval-first Execution', mark: '★', desc: 'Human-in-the-loop automation' },
    ],
  },
];

interface Slide05DifferentiationV2Props {
  debug?: boolean;
  debugGrid?: boolean;
  debugIds?: boolean;
}

export const Slide05DifferentiationV2: React.FC<Slide05DifferentiationV2Props> = ({
  debug = false,
  debugGrid,
  debugIds,
}) => {
  const layout = slideLayouts.slide05v2;

  return (
    <SlideFrame debug={debug} debugGrid={debugGrid} debugIds={debugIds} slideNumber={5}>
      <Tier3Background layers={recolorBackgroundLayers(v4Presets.slide05Differentiation, { primary: 'amber', secondary: 'teal', intensityMultiplier: 1.4 })} />
      <DustMotes count={26} opacity={0.05} />

      {/* ═══ Header ═══ */}
      <SlideHeader
        badge="DIFFERENTIATOR"
        title="Beyond Aggregation"
        subtitle="From dashboards to prediction, and approval-first execution."
        subtitleHighlight="prediction, and approval-first execution."
        badgeTheme={tc.badgeTheme}
        titleColor="white"
        subtitleHighlightColor={tc.subtitleHighlightColor}
        subtitleHighlightShadow={tc.subtitleHighlightShadow}
        maxWidth={1720}
        headerStyle={{ marginBottom: theme.spacing.space3 }}
        titleStyle={{
          fontSize: Math.min(96, v2Policy.header.titleMaxPx),
          lineHeight: 1,
          textShadow: tc.titleTextShadow,
        }}
        subtitleStyle={{
          fontSize: Math.min(48, v2Policy.header.subtitleMaxPx),
          lineHeight: 1.08,
          maxWidth: 1760,
        }}
        debugId="slide05v2.header"
        debugBadgeId="slide05v2.header.badge"
        debugTitleId="slide05v2.header.title"
        debugSubtitleId="slide05v2.header.subtitle"
      />

      {/* ═══ Content ═══ */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          gap: 16,
        }}
        data-debug-id="slide05v2.body"
      >
        {/* ═══ Moat Arrow — Glass Capsule ═══ */}
        <div
          style={{
            position: 'relative',
            height: 46,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
          }}
          data-debug-id="slide05v2.moat-arrow"
        >
          {/* Bottom-edge gradient strip: gray → amber → teal */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              background: 'linear-gradient(90deg, #64748B 0%, #64748B 25%, #2DD4BF 50%, #F7AD39 78%, #F7AD39 100%)',
              boxShadow: '0 -2px 16px rgba(247,173,57,0.18), 0 -2px 8px rgba(45,212,191,0.10)',
            }}
          />
          <NeonText
            color="amber"
            sharper
            as="div"
            style={{
              fontFamily: theme.typography.fontMono,
              fontSize: layout.moatLabelSize,
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              position: 'relative',
              zIndex: 1,
            }}
          >
            Competitive moat deepens
          </NeonText>
          <div
            style={{
              position: 'absolute',
              right: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: theme.iconGlow.amber,
            }}
          >
            <svg width={28} height={22} viewBox="0 0 28 22" fill="none">
              <rect x={0} y={8.5} width={18} height={5} rx={2.5} fill={theme.accent.amber} />
              <path d="M15 2L27 11L15 20" stroke={theme.accent.amber} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* 3-column stage grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1.15fr',
            gap: layout.cardGap,
            flex: 1,
            minHeight: 0,
          }}
          data-debug-id="slide05v2.stages"
        >
          {STAGES.map((stage) => {
            const isPoseidon = stage.id === 'only-poseidon';
            const isEmerging = stage.id === 'emerging';
            const isCommoditized = stage.id === 'commoditized';

            return (
              <div
                key={stage.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  minHeight: 0,
                }}
              >
                {/* Stage header + subheader */}
                <div style={{ flexShrink: 0 }}>
                  <div
                    style={{
                      fontFamily: theme.typography.fontMono,
                      fontSize: layout.stageHeaderSize,
                      fontWeight: 700,
                      color: stage.accentColor,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      lineHeight: 1,
                    }}
                  >
                    {stage.header}
                  </div>
                  <div
                    style={{
                      fontFamily: theme.typography.fontUi,
                      fontSize: layout.stageSubheaderSize,
                      color: isCommoditized
                        ? 'rgba(255,255,255,0.60)'
                        : `${stage.accentColor}88`,
                      fontStyle: 'italic',
                      lineHeight: 1,
                      marginTop: 4,
                    }}
                  >
                    {stage.subheader}
                  </div>
                </div>

                {/* Card */}
                <GlassCard
                  variant={stage.variant}
                  tone="dark"
                  liquidGlass="premium"
                  glassQuality="premium"
                  flexContent
                  style={{
                    ...authorityDarkGlassStyle,
                    padding: layout.cardPadding,
                    flex: 1,
                    minHeight: 0,
                    gap: 0,
                    borderTop: isPoseidon
                      ? `4px solid ${stage.accentColor}`
                      : isEmerging
                        ? `3px solid ${stage.accentColor}`
                        : `2px solid #475569`,
                    borderLeft: isPoseidon
                      ? `2px solid ${stage.accentColor}`
                      : undefined,
                    ...(isPoseidon
                      ? {
                          boxShadow: `${authorityDarkGlassStyle.boxShadow}, inset 0 0 40px rgba(247,173,57,0.06), 0 0 32px rgba(247,173,57,0.08)`,
                        }
                      : {}),
                  }}
                  debugId={`slide05v2.stage.${stage.id}`}
                >
                  {/* Vertical centering wrapper */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 24 }}>
                    {stage.items.map((item) => (
                      <div
                        key={item.label}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            width: layout.itemIconSize,
                            height: layout.itemIconSize,
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: isCommoditized ? 0.4 : 1,
                          }}
                        >
                          <SlideIcon
                            name={item.icon}
                            size={layout.itemIconSize}
                            glowColor={stage.glowColor || 'teal'}
                            renderMode="mask"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span
                              style={{
                                fontFamily: theme.typography.fontUi,
                                fontSize: layout.itemMarkSize,
                                fontWeight: isPoseidon ? 700 : isCommoditized ? 400 : 600,
                                color: isCommoditized
                                  ? '#94A3B8'
                                  : stage.accentColor,
                                lineHeight: 1,
                                width: 22,
                                display: 'inline-flex',
                                justifyContent: 'center',
                                ...(isPoseidon
                                  ? { textShadow: theme.textCrisp }
                                  : {}),
                              }}
                            >
                              {item.mark}
                            </span>
                            <span
                              style={{
                                fontFamily: theme.typography.fontUi,
                                fontSize: layout.itemLabelSize,
                                fontWeight: isPoseidon ? 700 : isCommoditized ? 400 : 600,
                                color: isCommoditized
                                  ? '#94A3B8'
                                  : 'rgba(255,255,255,0.90)',
                                lineHeight: 1.2,
                              }}
                            >
                              {item.label}
                            </span>
                          </div>
                          {item.desc && (
                            <div
                              style={{
                                fontFamily: theme.typography.fontUi,
                                fontSize: layout.itemDescSize,
                                color: isPoseidon
                                  ? `${stage.accentColor}99`
                                  : 'rgba(255,255,255,0.60)',
                                lineHeight: 1.3,
                                marginLeft: 30,
                              }}
                            >
                              {item.desc}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>

      </div>
    </SlideFrame>
  );
};
