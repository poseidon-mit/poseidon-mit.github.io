import React from 'react';
import { SlideFrame } from '../../shared/SlideFrame';
import { copy } from '../../shared/copy';
import { theme, weakNeonTextShadow } from '../../shared/theme';
import { Tier3Background } from '../../shared/visuals/tier3/Tier3Background';
import { v4Presets } from '../../shared/backgroundPresets.v4';
import { DustMotes } from '../../shared/effects/FloatingParticles';
import { SlideHeader } from '../../shared/SlideHeader';
import { slideLayouts, v2Policy } from '../../shared/slideLayouts';
import { GlassCard } from '../../shared/GlassCard';
import { NeonText } from '../../shared/NeonText';
import { ChartLine } from '../../shared/charts/ChartLine';
import { authorityDarkGlassStyle } from '../../shared/authorityDarkGlassStyle';

interface Slide07FinModelV2Props {
  debug?: boolean;
  debugGrid?: boolean;
  debugIds?: boolean;
}

const HERO_TONES = {
  teal: {
    neon: 'teal' as const,
    variant: 'teal' as const,
  },
  violet: {
    neon: 'violet' as const,
    variant: 'violet' as const,
  },
  amber: {
    neon: 'amber' as const,
    variant: 'gold' as const,
  },
} as const;

const MARKER_COLORS = {
  seriesA: theme.accent.amber,
  profitability: theme.accent.teal,
  cumulativeBreakeven: theme.accent.cyan,
  endpoint: theme.accent.violet,
} as const;

const CHART_COLORS = {
  primary: theme.accent.violet,
  secondary: theme.accent.amber,
} as const;

const FIXED_GRID_LEVELS = [25, 50, 75] as const;
const CHART_PADDING = { top: 14, right: 12, bottom: 30, left: 58 } as const;
const CHART_SVG_OFFSET_X = 42;
const CHART_X_PADDING = 34;

export const Slide07FinModelV2: React.FC<Slide07FinModelV2Props> = ({
  debug = false,
  debugGrid,
  debugIds,
}) => {
  const layout = slideLayouts.slide07FinModelV2;
  const slide = copy.slide07FinModel;
  const growth = slide.growth;

  const values = growth.values;
  const labelIndex = (label: (typeof growth.labels)[number]) => growth.labels.indexOf(label);
  const chartWidth = layout.arrChartWidth;
  const chartHeight = layout.arrChartHeight;
  const chartMax = Math.max(...values);
  const chartMin = Math.min(...values);
  const chartRange = chartMax - chartMin || 1;
  const chartPaddedRange = chartRange * 1.2;
  const chartPaddedMin = chartMin - chartRange * 0.1;
  const chartDrawableWidth = Math.max(1, chartWidth - CHART_X_PADDING * 2);
  const getMarkerPoint = (label: (typeof growth.labels)[number]) => {
    const idx = Math.max(0, labelIndex(label));
    const val = values[idx] ?? values[0] ?? 0;
    const x = CHART_PADDING.left + CHART_SVG_OFFSET_X + CHART_X_PADDING + (idx / Math.max(1, values.length - 1)) * chartDrawableWidth;
    const y = CHART_PADDING.top + (chartHeight - ((val - chartPaddedMin) / chartPaddedRange) * chartHeight);
    return { x, y };
  };

  const markerSeriesA = getMarkerPoint(growth.markers.seriesA.at);
  const markerProfitability = getMarkerPoint(growth.markers.profitability.at);
  const markerCumulativeBreakeven = getMarkerPoint(growth.markers.cumulativeBreakeven.at);
  const markerEndpoint = getMarkerPoint(growth.markers.endpoint.at);

  // Zero-line Y position for J-curve (where cumulative profit = $0)
  const zeroLineY = chartHeight - ((0 - chartPaddedMin) / chartPaddedRange) * chartHeight;

  return (
    <SlideFrame debug={debug} debugGrid={debugGrid} debugIds={debugIds}>
      <Tier3Background layers={v4Presets.slide07FinModel} />
      <DustMotes count={24} opacity={0.05} />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: layout.bodyGap,
        }}
        data-debug-id="slide07FinModelV2.layout"
      >
        <SlideHeader
          badge={slide.badge}
          title={slide.title}
          subtitle={slide.subtitle}
          subtitleHighlight={slide.subtitleHighlight}
          subtitleHighlightColor={theme.accent.cyan}
          subtitleHighlightShadow={theme.neon.cyan.sharper}
          titleColor="white"
          maxWidth={1740}
          headerStyle={{ marginBottom: 0 }}
          titleStyle={{
            fontSize: Math.min(90, v2Policy.header.titleMaxPx),
            lineHeight: 1,
            textShadow: `${theme.textCrisp}, ${theme.neon.violet.sharper}`,
          }}
          subtitleStyle={{
            fontSize: Math.min(46, v2Policy.header.subtitleMaxPx),
            lineHeight: 1.1,
            maxWidth: 1720,
          }}
          debugId="slide07FinModelV2.header"
          debugBadgeId="slide07FinModelV2.header.badge"
          debugTitleId="slide07FinModelV2.header.title"
          debugSubtitleId="slide07FinModelV2.header.subtitle"
        />

        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'grid',
            gridTemplateRows: `${layout.heroStatsRowHeight}px minmax(0, 1fr)`,
            gap: layout.bodyGap,
          }}
          data-debug-id="slide07FinModelV2.body"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: layout.heroStatsGap,
            }}
            data-debug-id="slide07FinModelV2.heroStats"
          >
            {slide.heroStats.map((stat) => {
              const tone = HERO_TONES[stat.color];

              return (
                <GlassCard
                  key={stat.id}
                  variant={tone.variant}
                  tone="dark"
                  liquidGlass="premium"
                  glassQuality="premium"
                  flexContent
                  style={{
                    gap: layout.heroStatCardGap,
                    padding: layout.heroStatCardPadding,
                    minHeight: 0,
                    ...authorityDarkGlassStyle,
                  }}
                  debugId={`slide07FinModelV2.stat.${stat.id}`}
                >
                  <NeonText
                    color={tone.neon}
                    as="div"
                    sharper
                    style={{
                      fontFamily: theme.typography.fontHeader,
                      fontSize: layout.heroStatSize,
                      lineHeight: 0.9,
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {stat.value}
                  </NeonText>

                  <div
                    style={{
                      fontFamily: theme.typography.fontUi,
                      fontSize: layout.heroStatLabelSize,
                      fontWeight: 700,
                      color: 'rgba(255,255,255,0.92)',
                      lineHeight: 1.08,
                    }}
                  >
                    {stat.label}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 5,
                      marginTop: 8,
                    }}
                  >
                    {stat.facts.map((fact, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '5px 10px',
                          borderRadius: 10,
                          background: theme.glassPremium.innerPanelBg,
                          border: `1px solid ${theme.glassPremium.innerPanelBorder}`,
                          backdropFilter: 'blur(6px)',
                          WebkitBackdropFilter: 'blur(6px)',
                          fontFamily: theme.typography.fontUi,
                          fontSize: layout.heroStatFactSize,
                          lineHeight: 1.2,
                          color: 'rgba(255,255,255,0.82)',
                        }}
                      >
                        {fact}
                      </div>
                    ))}
                  </div>
                </GlassCard>
              );
            })}
          </div>

          <div
            style={{
              minHeight: 0,
              display: 'grid',
              gridTemplateColumns: `minmax(0, ${layout.pricingColumnWidth}) minmax(0, ${layout.chartColumnWidth})`,
              gap: layout.bodyGap,
            }}
            data-debug-id="slide07FinModelV2.row2"
          >
            <GlassCard
              variant="blue"
              tone="dark"
              liquidGlass="premium"
              glassQuality="premium"
              flexContent
              style={{
                gap: layout.pricingCardGap,
                minHeight: 0,
                padding: layout.pricingCardPadding,
                ...authorityDarkGlassStyle,
              }}
              debugId="slide07FinModelV2.pricing"
            >
              <div
                style={{
                  fontFamily: theme.typography.fontHeader,
                  fontSize: layout.cardTitleSize,
                  fontWeight: 700,
                  lineHeight: 1.02,
                  color: 'rgba(255,255,255,0.96)',
                  textShadow: `${theme.textCrisp}, ${theme.neon.blue.sharper}`,
                }}
              >
                Pricing Tiers
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  flex: 1,
                  minHeight: 0,
                  marginTop: 6,
                }}
              >
                {slide.pricing.rows.map((row, idx) => (
                  <div
                    key={row.tier}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0, 0.7fr) minmax(0, 1fr) minmax(0, 1.8fr) minmax(0, 1.5fr)',
                      gap: 10,
                      alignItems: 'center',
                      padding: '12px 12px',
                      borderRadius: 12,
                      border: `1px solid ${theme.glassPremium.innerPanelBorder}`,
                      background:
                        idx % 2 === 0
                          ? 'rgba(255,255,255,0.04)'
                          : 'rgba(255,255,255,0.025)',
                      flex: 1,
                      minHeight: 0,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: theme.typography.fontMono,
                        fontSize: layout.pricingTierNameSize,
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.94)',
                      }}
                    >
                      {row.tier}
                    </div>
                    <div
                      style={{
                        fontFamily: theme.typography.fontUi,
                        fontSize: layout.pricingTextSize,
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.92)',
                      }}
                    >
                      {row.price}
                    </div>
                    <div
                      style={{
                        fontFamily: theme.typography.fontUi,
                        fontSize: layout.pricingTextSize,
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.8)',
                        lineHeight: 1.1,
                        textAlign: 'center',
                      }}
                    >
                      {row.gate}
                    </div>
                    <div
                      style={{
                        fontFamily: theme.typography.fontUi,
                        fontSize: layout.pricingTextSize,
                        fontWeight: 600,
                        color: theme.accent.teal,
                        textShadow: weakNeonTextShadow(theme.accent.teal),
                        lineHeight: 1.1,
                        textAlign: 'center',
                      }}
                    >
                      {row.metric}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard
              variant="violet"
              tone="dark"
              liquidGlass="premium"
              glassQuality="premium"
              flexContent
              style={{
                gap: layout.chartCardGap,
                minHeight: 0,
                padding: layout.chartCardPadding,
                ...authorityDarkGlassStyle,
              }}
              debugId="slide07FinModelV2.chartCard"
            >
              <div
                style={{
                  fontFamily: theme.typography.fontHeader,
                  fontSize: layout.cardTitleSize,
                  fontWeight: 700,
                  lineHeight: 1.02,
                  color: theme.accent.violet,
                  textShadow: `${theme.textCrisp}, ${theme.neon.violet.sharper}`,
                }}
              >
                J-Curve: Cumulative Operating Profit
              </div>

              <div
                style={{
                  position: 'relative',
                  flex: 1,
                  minHeight: 0,
                  borderRadius: 14,
                  border: `1px solid ${theme.glassPremium.innerPanelBorder}`,
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 45%, rgba(0,0,0,0.28) 100%)',
                  padding: '14px 12px 28px 58px',
                  overflow: 'hidden',
                }}
                data-debug-id="slide07FinModelV2.chartArea"
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: 12,
                    pointerEvents: 'none',
                    fontFamily: theme.typography.fontMono,
                    fontSize: layout.chartAxisSize,
                    color: 'rgba(255,255,255,0.72)',
                  }}
                >
                  +$8M
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: CHART_PADDING.top + zeroLineY,
                    left: 12,
                    pointerEvents: 'none',
                    fontFamily: theme.typography.fontMono,
                    fontSize: layout.chartAxisSize,
                    color: 'rgba(255,255,255,0.56)',
                    transform: 'translateY(-50%)',
                  }}
                >
                  $0
                </div>

                <div
                  style={{
                    position: 'absolute',
                    left: 56,
                    right: 12,
                    top: 14,
                    bottom: 28,
                    pointerEvents: 'none',
                  }}
                >
                  {FIXED_GRID_LEVELS.map((level) => (
                    <div
                      key={level}
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: `${100 - level}%`,
                        transform: 'translateY(-0.5px)',
                        borderTop: '1px solid rgba(255,255,255,0.14)',
                      }}
                    />
                  ))}
                </div>

                {/* Zero-line ($0) */}
                <div
                  style={{
                    position: 'absolute',
                    left: 56,
                    right: 12,
                    top: CHART_PADDING.top + zeroLineY,
                    borderTop: '2px dashed rgba(255,255,255,0.35)',
                    pointerEvents: 'none',
                  }}
                />

                <ChartLine
                  data={[...values]}
                  width={layout.arrChartWidth}
                  height={layout.arrChartHeight}
                  color={CHART_COLORS.primary}
                  strokeWidth={4}
                  showArea
                  showGrid={false}
                  showDotGrid
                  smooth
                  smoothTension={0.42}
                  highlightLastPoint={false}
                  xLabels={[...growth.labels]}
                  showAxisLabels
                  xPadding={CHART_X_PADDING}
                  xLabelFontSize={16}
                  xLabelYOffset={20}
                  style={{
                    marginLeft: CHART_SVG_OFFSET_X,
                    filter: `drop-shadow(0 0 10px ${CHART_COLORS.primary}4D)`,
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    left: markerSeriesA.x,
                    top: markerSeriesA.y,
                    transform: 'translate(-50%, -50%)',
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: MARKER_COLORS.seriesA,
                    boxShadow: `0 0 12px ${MARKER_COLORS.seriesA}, 0 0 4px ${MARKER_COLORS.seriesA}`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: markerSeriesA.x,
                    top: markerSeriesA.y - 14,
                    transform: 'translate(-50%, -100%)',
                    borderRadius: 999,
                    border: `1px solid ${MARKER_COLORS.seriesA}`,
                    padding: '3px 8px',
                    background: 'rgba(7,12,22,0.92)',
                    fontFamily: theme.typography.fontMono,
                    fontSize: layout.chartMarkerSize,
                    color: MARKER_COLORS.seriesA,
                    lineHeight: 1.1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {growth.markers.seriesA.label}
                </div>

                <div
                  style={{
                    position: 'absolute',
                    left: markerProfitability.x,
                    top: markerProfitability.y,
                    transform: 'translate(-50%, -50%)',
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: MARKER_COLORS.profitability,
                    boxShadow: `0 0 12px ${MARKER_COLORS.profitability}, 0 0 4px ${MARKER_COLORS.profitability}`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: markerProfitability.x + 16,
                    top: markerProfitability.y - 28,
                    transform: 'translate(0, -50%)',
                    borderRadius: 999,
                    border: `1px solid ${MARKER_COLORS.profitability}`,
                    padding: '4px 10px',
                    background: 'rgba(7,12,22,0.92)',
                    fontFamily: theme.typography.fontMono,
                    fontSize: layout.chartMarkerSize,
                    color: MARKER_COLORS.profitability,
                    lineHeight: 1.1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {growth.markers.profitability.label}
                </div>

                <div
                  style={{
                    position: 'absolute',
                    left: markerCumulativeBreakeven.x,
                    top: markerCumulativeBreakeven.y,
                    transform: 'translate(-50%, -50%)',
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: MARKER_COLORS.cumulativeBreakeven,
                    boxShadow: `0 0 12px ${MARKER_COLORS.cumulativeBreakeven}, 0 0 4px ${MARKER_COLORS.cumulativeBreakeven}`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: markerCumulativeBreakeven.x,
                    top: markerCumulativeBreakeven.y - 14,
                    transform: 'translate(-50%, -100%)',
                    borderRadius: 999,
                    border: `1px solid ${MARKER_COLORS.cumulativeBreakeven}`,
                    padding: '3px 8px',
                    background: 'rgba(7,12,22,0.92)',
                    fontFamily: theme.typography.fontMono,
                    fontSize: layout.chartMarkerSize,
                    color: MARKER_COLORS.cumulativeBreakeven,
                    lineHeight: 1.1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {growth.markers.cumulativeBreakeven.label}
                </div>

                <div
                  style={{
                    position: 'absolute',
                    left: markerEndpoint.x,
                    top: markerEndpoint.y,
                    transform: 'translate(-50%, -50%)',
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: MARKER_COLORS.endpoint,
                    boxShadow: `0 0 12px ${MARKER_COLORS.endpoint}, 0 0 4px ${MARKER_COLORS.endpoint}`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '18%',
                    borderRadius: 8,
                    border: `1px solid ${MARKER_COLORS.endpoint}`,
                    padding: '4px 8px 3px',
                    background: 'rgba(7,12,22,0.92)',
                    fontFamily: theme.typography.fontMono,
                    fontSize: layout.chartMarkerSize,
                    color: MARKER_COLORS.endpoint,
                    lineHeight: 1.1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {growth.markers.endpoint.label}
                </div>
              </div>

            </GlassCard>
          </div>

        </div>
      </div>
    </SlideFrame>
  );
};
