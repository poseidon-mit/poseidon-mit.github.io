import React from 'react';
import { SlideFrame } from '../../shared/SlideFrame';
import { copy } from '../../shared/copy';
import { theme } from '../../shared/theme';
import { Tier3Background } from '../../shared/visuals/tier3/Tier3Background';
import { v4Presets } from '../../shared/backgroundPresets.v4';
import { DustMotes } from '../../shared/effects/FloatingParticles';
import { SlideHeader } from '../../shared/SlideHeader';
import { GlassCard } from '../../shared/GlassCard';
import { slideLayouts, v2Policy } from '../../shared/slideLayouts';
import { getSlideHeaderColors, recolorBackgroundLayers } from '../../shared/slideThemeColor';
import { buildMicroGlow, withAlpha } from '../../shared/colorUtils';

const tc = getSlideHeaderColors('teal');

interface Slide12QAV2Props {
  debug?: boolean;
  debugGrid?: boolean;
  debugIds?: boolean;
}

type RiskLevel = 'High' | 'Medium' | 'Low';
type ResidualLevel = 'Moderate' | 'Low';
type RiskEntry = (typeof copy.slide12.risks)[number];

const levelColor: Record<RiskLevel | ResidualLevel, string> = {
  High: theme.accent.red,
  Medium: theme.accent.amber,
  Moderate: theme.accent.amber,
  Low: theme.accent.teal,
};

const severityVariant: Record<RiskLevel, 'red' | 'gold' | 'teal'> = {
  High: 'red',
  Medium: 'gold',
  Low: 'teal',
};

const severityFromRating = (risk: RiskEntry): RiskLevel => {
  if (risk.ratingImpact === 'High' && risk.ratingLikelihood === 'High') {
    return 'High';
  }
  if (
    (risk.ratingImpact === 'High' && risk.ratingLikelihood === 'Medium') ||
    (risk.ratingImpact === 'Medium' && risk.ratingLikelihood === 'High')
  ) {
    return 'Medium';
  }
  return 'Low';
};

export const Slide12QAV2: React.FC<Slide12QAV2Props> = ({
  debug = false,
  debugGrid,
  debugIds,
}) => {
  const slide = copy.slide12;
  const layout = slideLayouts.slide12v2;

  return (
    <SlideFrame debug={debug} debugGrid={debugGrid} debugIds={debugIds} slideNumber={12}>
      <Tier3Background
        layers={recolorBackgroundLayers(v4Presets.slide10Appendix, {
          primary: 'teal',
          secondary: 'blue',
          intensityMultiplier: 1.35,
        })}
      />
      <DustMotes count={22} opacity={0.045} />

      <SlideHeader
        badge={slide.badge}
        title={slide.title}
        subtitle={slide.subtitle}
        subtitleHighlight={slide.subtitleHighlight}
        subtitleHighlightColor={tc.subtitleHighlightColor}
        subtitleHighlightShadow={tc.subtitleHighlightShadow}
        titleColor="white"
        badgeTheme={tc.badgeTheme}
        maxWidth={1740}
        headerStyle={{ marginBottom: theme.spacing.space2 }}
        titleStyle={{
          fontSize: Math.min(88, v2Policy.header.titleMaxPx),
          lineHeight: 1,
          textShadow: tc.titleTextShadow,
        }}
        subtitleStyle={{
          fontSize: Math.min(42, v2Policy.header.subtitleMaxPx),
          lineHeight: 1.14,
          maxWidth: 1720,
        }}
        debugId="slide12v2.header"
        debugBadgeId="slide12v2.header.badge"
        debugTitleId="slide12v2.header.title"
        debugSubtitleId="slide12v2.header.subtitle"
      />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: layout.gridColumns,
          gap: layout.gridGap,
        }}
        data-debug-id="slide12v2.layout"
      >
        {slide.risks.map((risk, index) => {
          const severity = severityFromRating(risk);
          const severityColor = levelColor[severity];
          const residualColor = levelColor[risk.residualLevel];
          return (
            <GlassCard
              key={risk.id}
              tone="dark"
              liquidGlass="premium"
              glassQuality="premium"
              variant={severityVariant[severity]}
              flexContent
              style={{
                minHeight: 0,
                padding: layout.cardPadding,
              }}
              debugId={`slide12v2.card.${index + 1}`}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: layout.cardInnerGap,
                  minHeight: 0,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: layout.chipGap,
                      minWidth: 0,
                      flexWrap: 'nowrap',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: theme.typography.fontMono,
                        fontSize: layout.riskIndexSize,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: withAlpha(severityColor, 0.95),
                        textShadow: buildMicroGlow(severityColor),
                        whiteSpace: 'nowrap',
                      }}
                    >
                      #{index + 1}
                    </div>
                    {([
                      { label: 'Impact', value: risk.ratingImpact as RiskLevel },
                      { label: 'Likelihood', value: risk.ratingLikelihood as RiskLevel },
                    ] as const).map((chip) => {
                      const chipColor = levelColor[chip.value];
                      return (
                        <div
                          key={`${risk.id}-${chip.label}`}
                          style={{
                            padding: '3px 7px',
                            borderRadius: 7,
                            border: `1px solid ${withAlpha(chipColor, 0.62)}`,
                            background: withAlpha(chipColor, 0.18),
                            color: withAlpha(chipColor, 0.95),
                            fontFamily: theme.typography.fontMono,
                            fontSize: layout.chipSize,
                            fontWeight: 700,
                            letterSpacing: '0.02em',
                            textShadow: buildMicroGlow(chipColor),
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {chip.label}: {chip.value}
                        </div>
                      );
                    })}
                  </div>
                  <div
                    style={{
                      display: 'inline-flex',
                      width: 'fit-content',
                      padding: '4px 8px',
                      borderRadius: 7,
                      border: `1px solid ${withAlpha(residualColor, 0.58)}`,
                      background: withAlpha(residualColor, 0.16),
                      color: withAlpha(residualColor, 0.95),
                      fontFamily: theme.typography.fontMono,
                      fontSize: layout.residualValueSize,
                      fontWeight: 700,
                      letterSpacing: '0.02em',
                      textShadow: buildMicroGlow(residualColor),
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Residual: {risk.residualLevel}
                  </div>
                </div>

                <div
                  style={{
                    fontFamily: theme.typography.fontUi,
                    fontSize: layout.riskTitleSize,
                    fontWeight: 650,
                    lineHeight: 1.18,
                    color: 'rgba(255,255,255,0.92)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {risk.inherentRisk}
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: layout.mitigationGap,
                    minHeight: 0,
                  }}
                >
                  <div
                    style={{
                      fontFamily: theme.typography.fontMono,
                      fontSize: layout.mitigationTitleSize,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.58)',
                    }}
                  >
                    Mitigation
                  </div>
                  {risk.mitigations.slice(0, 2).map((mitigation) => (
                    <div
                      key={`${risk.id}-${mitigation}`}
                      style={{
                        display: 'flex',
                        gap: 6,
                        alignItems: 'flex-start',
                      }}
                    >
                      <span
                        style={{
                          marginTop: 2,
                          color: withAlpha(severityColor, 0.9),
                          textShadow: buildMicroGlow(severityColor),
                          fontSize: layout.mitigationSize,
                          lineHeight: 1,
                        }}
                      >
                        •
                      </span>
                      <span
                        style={{
                          fontFamily: theme.typography.fontUi,
                          fontSize: layout.mitigationSize,
                          color: 'rgba(255,255,255,0.78)',
                          lineHeight: 1.24,
                        }}
                      >
                        {mitigation}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </SlideFrame>
  );
};
