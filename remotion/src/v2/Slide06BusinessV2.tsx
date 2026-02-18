/**
 * V2 Visual-First: Slide 06 — Business / Roadmap
 * Bullet points → KPI badges + mini icons + ChartBar
 * 73 words → 32 words target (56% reduction)
 */
import React from 'react';
import { SlideFrame } from '../shared/SlideFrame';
import { copy } from '../shared/copy';
import { theme, weakNeonTextShadow } from '../shared/theme';
import { Tier3Background } from '../shared/visuals/tier3/Tier3Background';
import { DustMotes } from '../shared/effects/FloatingParticles';
import { GlassCard } from '../shared/GlassCard';
import { v4Presets } from '../shared/backgroundPresets.v4';
import { SlideHeader } from '../shared/SlideHeader';
import { slideLayouts, v2Policy } from '../shared/slideLayouts';
import { authorityDarkGlassStyle } from '../shared/authorityDarkGlassStyle';
import { SlideIcon, IconGlowColor } from '../shared/SlideIcon';
import { getSlideHeaderColors, recolorBackgroundLayers } from '../shared/slideThemeColor';

const tc = getSlideHeaderColors('violet');

/** Icon mapping for bullet phases (Phase 1 & 3) */
const BULLET_ICONS: Record<string, { icon: string; glow: IconGlowColor }> = {
  // Phase 1: Foundation
  'Compliance': { icon: 'compliance-badge', glow: 'violet' },
  'Governance': { icon: 'regulation-scale', glow: 'violet' },
  'Compliance and governance': { icon: 'compliance-badge', glow: 'violet' },
  'AI explainability': { icon: 'explainability', glow: 'violet' },
  'Detection and Grow pilots': { icon: 'shield', glow: 'violet' },
  'Data Architecture': { icon: 'vault', glow: 'violet' },
  'LLMOps / MLOps': { icon: 'gear', glow: 'violet' },
  // Phase 3: Frontier
  // Precision moved to gateMetrics for Phase 3
  'Reverse Option': { icon: 'replay-spiral', glow: 'blue' },
  'Workflow & dashboard': { icon: 'data-grid', glow: 'blue' },
};

/** Icon mapping for KPI metric rows (Phase 2 & 4) */
const METRIC_ICONS: Record<string, string> = {
  'Users': 'pulse',
  'Precision': 'ai-brain',
  'Availability': 'data-grid',
  'False Pos': 'risk-warning',
};

/** Map phase color → glow color for metric icons */
const PHASE_GLOW: Record<string, IconGlowColor> = {
  '#00d5cc': 'teal',
  '#8B5CF6': 'violet',
  '#3B82F6': 'blue',
  '#F59E0B': 'amber',
};

type RoadmapPhase = {
  id: string;
  label: string;
  period: string;
  pillar: string;
  title: string;
  goal: string;
  definition: string;
  bullets: ReadonlyArray<string | { label: string; description: string }>;
  gateMetrics: ReadonlyArray<{
    label: string;
    target: string;
    value: number;
  }>;
  color: string;
};

interface Slide06BusinessV2Props {
  debug?: boolean;
  debugGrid?: boolean;
  debugIds?: boolean;
}

const PILLAR_BADGE_DARK_STYLE: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(5,10,20,0.90), rgba(4,8,16,0.86))',
  boxShadow: '0 8px 20px rgba(0,0,0,0.46)',
};

export const Slide06BusinessV2: React.FC<Slide06BusinessV2Props> = ({
  debug = false,
  debugGrid,
  debugIds,
}) => {
  const layout = slideLayouts.slide06v2;
  const slideCopy = copy.slide06;
  const phases = slideCopy.phases as ReadonlyArray<RoadmapPhase>;
  const phase5 = slideCopy.phase5;

  return (
    <SlideFrame debug={debug} debugGrid={debugGrid} debugIds={debugIds} slideNumber={6}>
      <Tier3Background layers={recolorBackgroundLayers(v4Presets.slide06Business, { primary: 'violet', secondary: 'red', intensityMultiplier: 1.4 })} />
      <DustMotes count={26} opacity={0.04} />

      <div style={{ flexShrink: 0 }} data-debug-id="slide06v2.header.wrap">
        <SlideHeader
          badge={slideCopy.badge}
          title={slideCopy.title}
          subtitle={slideCopy.coreClaim}
          subtitleHighlight={slideCopy.subtitleHighlight}
          badgeTheme={tc.badgeTheme}
          titleColor="white"
          subtitleHighlightColor={tc.subtitleHighlightColor}
          subtitleHighlightShadow={tc.subtitleHighlightShadow}
          maxWidth={1740}
          headerStyle={{ marginBottom: theme.spacing.space3 }}
          titleStyle={{
            fontSize: Math.min(96, v2Policy.header.titleMaxPx),
            lineHeight: 1,
            textShadow: tc.titleTextShadow,
          }}
          subtitleStyle={{
            fontSize: Math.min(48, v2Policy.header.subtitleMaxPx),
            lineHeight: 1.1,
          }}
          debugId="slide06v2.header"
          debugBadgeId="slide06v2.header.badge"
          debugTitleId="slide06v2.header.title"
          debugSubtitleId="slide06v2.header.subtitle"
        />
      </div>

      {/* Two-column layout: Phase 1 left, Phase 2/3/4 right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: layout.gridGap,
          flex: 1,
          alignItems: 'stretch',
        }}
        data-debug-id="slide06v2.body"
      >
        {/* ── LEFT: Phase 1 (detailed) ── */}
        {(() => {
          const p1 = phases[0];
          return (
            <div style={{ position: 'relative', height: '100%' }} data-debug-id="slide06v2.phase.phase-1">
              {/* Pillar Badge */}
              <div style={{ position: 'absolute', top: -14, right: 16, zIndex: theme.zIndex.overlay }}>
                <div style={{
                  borderRadius: 999, padding: '6px 18px 5px',
                  ...PILLAR_BADGE_DARK_STYLE,
                  border: `1px solid ${p1.color}`, color: p1.color,
                  fontFamily: theme.typography.fontMono, fontSize: layout.kpiBadgeSize,
                  fontWeight: 700, letterSpacing: '0.03em',
                }}>
                  {p1.pillar}
                </div>
              </div>

              <GlassCard
                variant="violet"
                tone="dark" liquidGlass="premium" glassQuality="premium" flexContent
                style={{
                  gap: 0,
                  padding: layout.phase1CardPadding, height: '100%',
                  flexShrink: v2Policy.card.cardFlexShrink,
                  ...authorityDarkGlassStyle,
                }}
              >
                <div style={{
                  display: 'flex', alignItems: 'baseline', gap: 14,
                  marginBottom: 8, flexShrink: 0,
                }}>
                  <span style={{
                    fontFamily: theme.typography.fontHeader, fontSize: layout.phaseLabelSize,
                    fontWeight: 700, color: p1.color,
                  }}>
                    {p1.label}
                  </span>
                  <span style={{
                    fontFamily: theme.typography.fontMono, fontSize: layout.periodSize,
                    color: 'rgba(255,255,255,0.5)',
                  }}>
                    {p1.period}
                  </span>
                </div>

                {/* Inner glass with title + goal + expanded bullets */}
                <div style={{
                  background: theme.glassPremium.innerPanelBg, borderRadius: 12,
                  padding: '14px 16px 14px',
                  border: `1px solid ${theme.glassPremium.innerPanelBorder}`,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.34)',
                  display: 'flex', flexDirection: 'column', gap: 10,
                  flexGrow: 1, overflow: 'hidden',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'baseline', gap: 12, flexShrink: 0,
                  }}>
                    <span style={{
                      fontFamily: theme.typography.fontHeader, fontSize: layout.titleSize,
                      fontWeight: 700, color: p1.color,
                      textShadow: weakNeonTextShadow(p1.color), lineHeight: 1.15,
                    }}>
                      {p1.title}
                    </span>
                    <span style={{
                      fontFamily: theme.typography.fontUi, fontSize: layout.goalNoteSize,
                      color: 'rgba(255,255,255,0.74)', lineHeight: 1.3,
                    }}>
                      {p1.goal}
                    </span>
                  </div>

                  {/* Expanded bullet list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1, justifyContent: 'space-evenly' }}>
                    {p1.bullets.map((bullet) => {
                      const isExpanded = typeof bullet === 'object';
                      const label = isExpanded ? bullet.label : String(bullet);
                      const description = isExpanded ? bullet.description : null;
                      const iconInfo = BULLET_ICONS[label];
                      return (
                        <div
                          key={label}
                          style={{
                            display: 'flex', alignItems: 'flex-start', gap: 14,
                            padding: '0 14px', lineHeight: 1.3,
                          }}
                        >
                          {iconInfo && (
                            <div style={{
                              flexShrink: 0, width: layout.phase1BulletIconWrapper, height: layout.phase1BulletIconWrapper,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              marginTop: 2,
                            }}>
                              <SlideIcon name={iconInfo.icon} size={layout.phase1BulletIconSize} glowColor={iconInfo.glow} renderMode="mask" />
                            </div>
                          )}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                            <span style={{
                              fontFamily: theme.typography.fontUi,
                              fontSize: layout.phase1BulletLabelSize,
                              color: 'rgba(255,255,255,0.82)', fontWeight: 600,
                            }}>
                              {label}
                            </span>
                            {description && (
                              <span style={{
                                fontFamily: theme.typography.fontUi,
                                fontSize: layout.bulletDescriptionSize,
                                color: `rgba(255,255,255,${layout.bulletDescriptionOpacity})`,
                                fontWeight: 400, lineHeight: 1.25,
                              }}>
                                {description}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </GlassCard>
            </div>
          );
        })()}

        {/* ── RIGHT: Outer glass wrapping Phase 2/3/4 stacked ── */}
        <GlassCard
          tone="dark" liquidGlass="premium" glassQuality="premium" flexContent
          style={{
            padding: layout.rightPanelPadding, height: '100%',
            ...authorityDarkGlassStyle,
          }}
          debugId="slide06v2.rightPanel"
        >
          <div style={{
            display: 'flex', flexDirection: 'column',
            gap: layout.rightCardGap, flex: 1,
          }}>
            {phases.slice(1).map((phase) => {
              const glow = PHASE_GLOW[phase.color] ?? 'cyan';
              return (
                <div
                  key={phase.id}
                  style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    background: theme.glassPremium.innerPanelBg,
                    border: `1px solid ${phase.color}44`,
                    borderRadius: 12, padding: '14px 18px 12px',
                    overflow: 'hidden',
                  }}
                  data-debug-id={`slide06v2.phase.${phase.id}`}
                >
                  {/* Header row: Phase label + period + pillar badge */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    marginBottom: 6,
                  }}>
                    <span style={{
                      fontFamily: theme.typography.fontHeader,
                      fontSize: layout.rightPhaseLabelSize, fontWeight: 700,
                      color: phase.color,
                    }}>
                      {phase.label}
                    </span>
                    <span style={{
                      fontFamily: theme.typography.fontMono,
                      fontSize: layout.rightPeriodSize,
                      color: 'rgba(255,255,255,0.5)',
                    }}>
                      {phase.period}
                    </span>
                    <div style={{ flex: 1 }} />
                    <div style={{
                      borderRadius: 999, padding: '3px 12px 2px',
                      ...PILLAR_BADGE_DARK_STYLE,
                      border: `1px solid ${phase.color}`,
                      color: phase.color,
                      fontFamily: theme.typography.fontMono,
                      fontSize: Math.max(v2Policy.typography.metaMinPx, 16),
                      fontWeight: 700, letterSpacing: '0.03em',
                    }}>
                      {phase.pillar}
                    </div>
                  </div>

                  {/* Title + goal (single line) */}
                  <div style={{
                    display: 'flex', alignItems: 'baseline', gap: 10,
                    lineHeight: 1.15, marginBottom: 8,
                  }}>
                    <span style={{
                      fontFamily: theme.typography.fontHeader,
                      fontSize: layout.rightTitleSize, fontWeight: 700,
                      color: phase.color,
                      textShadow: weakNeonTextShadow(phase.color),
                      flexShrink: 0,
                    }}>
                      {phase.title}
                    </span>
                    <span style={{
                      fontFamily: theme.typography.fontUi,
                      fontSize: layout.rightGoalSize,
                      color: 'rgba(255,255,255,0.68)',
                    }}>
                      {phase.goal}
                    </span>
                  </div>

                  {/* Metrics and bullets as horizontal chips (single row) */}
                  <div style={{
                    display: 'flex', flexWrap: 'nowrap', gap: 6,
                    marginTop: 4,
                  }}>
                    {phase.gateMetrics.map((metric) => {
                      const metricIcon = METRIC_ICONS[metric.label];
                      return (
                        <div
                          key={metric.label}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            background: theme.glassPremium.innerPanelBg,
                            border: `1px solid ${theme.glassPremium.innerPanelBorder}`,
                            borderRadius: 8, padding: '4px 10px',
                            whiteSpace: 'nowrap', flexShrink: 0,
                          }}
                        >
                          {metricIcon && (
                            <SlideIcon name={metricIcon} size={28} glowColor={glow} renderMode="mask" style={{ flexShrink: 0 }} />
                          )}
                          <span style={{
                            fontFamily: theme.typography.fontUi, fontSize: layout.chipTextSize,
                            color: 'rgba(255,255,255,0.72)', fontWeight: 500,
                          }}>
                            {metric.label === 'False Pos' ? 'FP' : metric.label}
                          </span>
                          <span style={{
                            fontFamily: theme.typography.fontMono, fontSize: layout.chipTextSize,
                            color: phase.color, fontWeight: 700,
                          }}>
                            {metric.target}
                          </span>
                        </div>
                      );
                    })}
                    {phase.bullets.map((bullet) => {
                      const label = typeof bullet === 'object' ? bullet.label : String(bullet);
                      const iconInfo = BULLET_ICONS[label];
                      return (
                        <div
                          key={label}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            background: theme.glassPremium.innerPanelBg,
                            border: `1px solid ${theme.glassPremium.innerPanelBorder}`,
                            borderRadius: 8, padding: '4px 10px',
                            whiteSpace: 'nowrap', flexShrink: 0,
                          }}
                        >
                          {iconInfo && (
                            <SlideIcon name={iconInfo.icon} size={28} glowColor={iconInfo.glow} renderMode="mask" style={{ flexShrink: 0 }} />
                          )}
                          <span style={{
                            fontFamily: theme.typography.fontUi, fontSize: layout.chipTextSize,
                            color: 'rgba(255,255,255,0.72)', fontWeight: 500,
                          }}>
                            {label}
                          </span>
                        </div>
                          );
                        })
                    }
                  </div>
                </div>
              );
            })}

            {/* Phase 5: compact horizontal glass bar */}
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: theme.glassPremium.innerPanelBg,
                border: `1px solid ${phase5.color}44`,
                borderRadius: 14, padding: '10px 18px',
              }}
              data-debug-id="slide06v2.phase.phase-5"
            >
              <span style={{
                fontFamily: theme.typography.fontHeader,
                fontSize: layout.rightPhaseLabelSize, fontWeight: 700,
                color: phase5.color,
              }}>
                {phase5.label}
              </span>
              <div style={{
                width: 1, height: 22,
                background: `${phase5.color}44`, flexShrink: 0,
              }} />
              <span style={{
                fontFamily: theme.typography.fontHeader,
                fontSize: layout.rightTitleSize, fontWeight: 600,
                color: phase5.color,
              }}>
                {phase5.title}
              </span>
              <div style={{ flex: 1 }} />
              <div style={{
                borderRadius: 999, padding: '3px 12px 2px',
                ...PILLAR_BADGE_DARK_STYLE,
                border: `1px solid ${phase5.color}`,
                color: phase5.color,
                fontFamily: theme.typography.fontMono,
                fontSize: Math.max(v2Policy.typography.metaMinPx, 16),
                fontWeight: 700, letterSpacing: '0.03em',
              }}>
                {phase5.pillar}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

    </SlideFrame>
  );
};
