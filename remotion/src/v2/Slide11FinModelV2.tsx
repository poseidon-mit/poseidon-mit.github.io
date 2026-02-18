/**
 * V2 Visual-First: Slide 11 — Financial Model
 * 案2: 左ナラティブ + 右J-curveチャート（非対称分割）
 */
import React from 'react';
import { SlideFrame } from '../shared/SlideFrame';
import { copy } from '../shared/copy';
import { theme } from '../shared/theme';
import { Tier3Background } from '../shared/visuals/tier3/Tier3Background';
import { v4Presets } from '../shared/backgroundPresets.v4';
import { DustMotes } from '../shared/effects/FloatingParticles';
import { SlideHeader } from '../shared/SlideHeader';
import { slideLayouts, v2Policy } from '../shared/slideLayouts';
import { getSlideHeaderColors, recolorBackgroundLayers } from '../shared/slideThemeColor';
import { GlassCard } from '../shared/GlassCard';
import { ChartLine } from '../shared/charts/ChartLine';
import { authorityDarkGlassStyle } from '../shared/authorityDarkGlassStyle';

const tc = getSlideHeaderColors('violet');

interface Slide11FinModelV2Props {
  debug?: boolean;
  debugGrid?: boolean;
  debugIds?: boolean;
}

const TIER_ACCENT: Record<string, string> = {
  Free: theme.accent.teal,
  Plus: theme.accent.blue,
  Pro: theme.accent.violet,
};

/** Thin horizontal separator */
const Separator: React.FC = () => (
  <div
    style={{
      height: 1,
      background:
        'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 15%, rgba(255,255,255,0.12) 85%, transparent 100%)',
    }}
  />
);

export const Slide11FinModelV2: React.FC<Slide11FinModelV2Props> = ({
  debug = false,
  debugGrid,
  debugIds,
}) => {
  const layout = slideLayouts.slide11v2;
  const slide = copy.slide11;
  const arrValues = slide.arr.values;

  return (
    <SlideFrame debug={debug} debugGrid={debugGrid} debugIds={debugIds} slideNumber={11}>
      <Tier3Background layers={recolorBackgroundLayers(v4Presets.slide11FinModel, { primary: 'violet', secondary: 'blue', intensityMultiplier: 1.4 })} />
      <DustMotes count={24} opacity={0.05} />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: layout.gridGap,
          minHeight: 0,
        }}
        data-debug-id="slide11v2.layout"
      >
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
          headerStyle={{ marginBottom: 0 }}
          titleStyle={{
            fontSize: Math.min(96, v2Policy.header.titleMaxPx),
            lineHeight: 1,
            textShadow: tc.titleTextShadow,
          }}
          subtitleStyle={{
            fontSize: Math.min(46, v2Policy.header.subtitleMaxPx),
            lineHeight: 1.1,
            maxWidth: 1720,
          }}
          debugId="slide11v2.header"
          debugBadgeId="slide11v2.header.badge"
          debugTitleId="slide11v2.header.title"
          debugSubtitleId="slide11v2.header.subtitle"
        />

        {/* ═══ 2-column asymmetric grid: left 1/3 narrative, right 2/3 chart ═══ */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'grid',
            gridTemplateColumns: layout.gridColumns,
            gap: layout.gridGap,
          }}
          data-debug-id="slide11v2.body"
        >
          {/* ═══ LEFT: Narrative Card ═══ */}
          <GlassCard
            tone="dark"
            liquidGlass="premium"
            glassQuality="premium"
            flexContent
            style={{
              padding: layout.leftColumnPadding,
              minHeight: 0,
              ...authorityDarkGlassStyle,
            }}
            debugId="slide11v2.narrative"
          >
            {/* Section 1: UNIT ECONOMICS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div
                style={{
                  fontFamily: theme.typography.fontMono,
                  fontSize: layout.leftSectionTitleSize,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: theme.accent.teal,
                  textShadow: `${theme.textCrisp}, ${theme.neon.teal.sharper}`,
                }}
              >
                UNIT ECONOMICS (AT SCALE)
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {([
                  { label: 'Customer Lifetime Return', value: '10x', accent: theme.accent.teal, detail: '' },
                  { label: 'Profit Margin', value: '87%', accent: theme.accent.violet, detail: '' },
                  { label: 'Operating Breakeven', value: 'Month 12', accent: theme.accent.amber, detail: '' },
                ] as const).map((row) => (
                  <div
                    key={row.label}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      padding: '10px 8px',
                      borderRadius: 8,
                      background: theme.glassPremium.innerPanelBg,
                      border: `1px solid ${theme.glassPremium.innerPanelBorder}`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: theme.typography.fontHeader,
                        fontSize: layout.leftValueSize,
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.92)',
                        lineHeight: 1,
                      }}
                    >
                      {row.value}
                    </div>
                    <div
                      style={{
                        fontFamily: theme.typography.fontUi,
                        fontSize: layout.leftMarketLabelSize,
                        fontWeight: 600,
                        color: row.accent,
                        lineHeight: 1.1,
                        textAlign: 'center',
                        minHeight: `calc(${layout.leftMarketLabelSize}px * 2.2)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {row.label}
                    </div>
                    {row.detail && (
                      <div
                        style={{
                          fontFamily: theme.typography.fontUi,
                          fontSize: layout.leftMarketDetailSize,
                          color: 'rgba(255,255,255,0.45)',
                          lineHeight: 1.2,
                          textAlign: 'center',
                        }}
                      >
                        {row.detail}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: MARKET OPPORTUNITY */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 20 }}>
              <div
                style={{
                  fontFamily: theme.typography.fontMono,
                  fontSize: layout.leftSectionTitleSize,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: theme.accent.emerald,
                  textShadow: `${theme.textCrisp}, ${theme.neon.teal.sharper}`,
                }}
              >
                MARKET OPPORTUNITY
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {slide.market.items.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                      padding: '8px 8px',
                      borderRadius: 8,
                      background: theme.glassPremium.innerPanelBg,
                      border: `1px solid ${theme.glassPremium.innerPanelBorder}`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: theme.typography.fontHeader,
                        fontSize: layout.leftMarketValueSize,
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.92)',
                        lineHeight: 1,
                      }}
                    >
                      {item.value}
                    </div>
                    <div
                      style={{
                        fontFamily: theme.typography.fontUi,
                        fontSize: layout.leftMarketLabelSize,
                        fontWeight: 600,
                        color: theme.accent.emerald,
                        lineHeight: 1,
                        textAlign: 'center',
                      }}
                    >
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  fontFamily: theme.typography.fontMono,
                  fontSize: layout.leftMarketCitationSize,
                  color: 'rgba(255,255,255,0.30)',
                  lineHeight: 1.2,
                  textAlign: 'right',
                }}
              >
                {slide.market.citation}
              </div>
            </div>

            {/* Section 3: PRICING PLANS */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5, minHeight: 0, marginTop: 15 }}>
              <div
                style={{
                  fontFamily: theme.typography.fontMono,
                  fontSize: layout.leftSectionTitleSize,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: theme.accent.blue,
                  textShadow: `${theme.textCrisp}, ${theme.neon.blue.sharper}`,
                }}
              >
                PRICING PLANS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {slide.pricing.rows.map((row) => {
                  const accent = TIER_ACCENT[row.tier] ?? theme.accent.blue;
                  return (
                    <div
                      key={row.tier}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '6px 10px',
                        borderRadius: 8,
                        background: theme.glassPremium.innerPanelBg,
                        border: `1px solid ${theme.glassPremium.innerPanelBorder}`,
                        borderLeft: `3px solid ${accent}`,
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: theme.typography.fontMono,
                            fontSize: layout.leftPricingTierSize,
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: accent,
                            textShadow: theme.textCrisp,
                            lineHeight: 1,
                          }}
                        >
                          {row.tier}
                        </div>
                        <div
                          style={{
                            fontFamily: theme.typography.fontUi,
                            fontSize: layout.leftPricingDescSize,
                            color: 'rgba(255,255,255,0.45)',
                            lineHeight: 1.1,
                          }}
                        >
                          {row.engines}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, flexShrink: 0 }}>
                        <div
                          style={{
                            fontFamily: theme.typography.fontHeader,
                            fontSize: layout.leftPricingPriceSize,
                            fontWeight: 700,
                            color: 'rgba(255,255,255,0.90)',
                            lineHeight: 1,
                          }}
                        >
                          {row.price}
                        </div>
                        <div
                          style={{
                            fontFamily: theme.typography.fontUi,
                            fontSize: layout.leftPricingDescSize,
                            color: `${accent}99`,
                            lineHeight: 1,
                          }}
                        >
                          {row.conversion}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassCard>

          {/* ═══ RIGHT: J-curve Chart Card ═══ */}
          <GlassCard
            variant="violet"
            tone="dark"
            liquidGlass="premium"
            glassQuality="premium"
            flexContent
            style={{
              gap: 8,
              minHeight: 0,
              padding: layout.rightCardPadding,
              ...authorityDarkGlassStyle,
            }}
            debugId="slide11v2.arrChart"
          >
            <div
              style={{
                fontFamily: theme.typography.fontMono,
                fontSize: layout.rightChartTitleSize,
                lineHeight: 1.02,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase' as const,
                color: theme.accent.violet,
                textShadow: `${theme.textCrisp}, ${theme.neon.violet.sharper}`,
              }}
            >
              Cumulative Profit ($M)
            </div>

            <div
              style={{
                position: 'relative',
                flex: 1,
                minHeight: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px 10px 18px',
                overflow: 'hidden',
              }}
              data-debug-id="slide11v2.arrChart.inner"
            >
              <div style={{ position: 'relative' }}>
                <ChartLine
                  data={[...arrValues]}
                  width={layout.arrChartWidth}
                  height={layout.arrChartHeight}
                  color={theme.accent.violet}
                  strokeWidth={4}
                  showArea
                  showGrid={false}
                  showDotGrid
                  smooth
                  smoothTension={0.42}
                  highlightLastPoint={false}
                  showDataPoints={false}
                  showZeroLine
                  zeroLineColor="rgba(255,255,255,0.25)"
                  xLabels={[...slide.arr.months]}
                  showAxisLabels
                  xPadding={24}
                  xLabelFontSize={20}
                  xLabelYOffset={20}
                  style={{ filter: 'none' }}
                />

                {/* Milestone badges */}
                {(() => {
                  const cw = layout.arrChartWidth;
                  const ch = layout.arrChartHeight;
                  const xPad = 24;
                  const dw = cw - xPad * 2;
                  const vals = [...arrValues] as number[];
                  const total = vals.length;
                  const min = Math.min(...vals);
                  const range = Math.max(...vals) - min;
                  const pRange = range * 1.2;
                  const pMin = min - range * 0.1;

                  const getX = (m: number) => xPad + ((m - 1) / (total - 1)) * dw;
                  const getY = (v: number) => ch - ((v - pMin) / pRange) * ch;

                  const accentMap: Record<string, string> = {
                    teal: theme.accent.teal,
                    blue: theme.accent.blue,
                    amber: theme.accent.amber,
                    violet: theme.accent.violet,
                    emerald: theme.accent.emerald,
                  };
                  const connH = 22;

                  let zeroCrossingMonth: number | null = null;
                  for (let i = 0; i < vals.length - 1; i++) {
                    if (vals[i] <= 0 && vals[i + 1] >= 0) {
                      const t = (0 - vals[i]) / (vals[i + 1] - vals[i]);
                      zeroCrossingMonth = i + 1 + t;
                      break;
                    }
                  }

                  return slide.arr.milestones.map((ms, idx) => {
                    const atZero = 'atZeroCrossing' in ms && (ms as { atZeroCrossing?: boolean }).atZeroCrossing;
                    const x = atZero && zeroCrossingMonth != null ? getX(zeroCrossingMonth) : getX(ms.month);
                    const v = atZero ? 0 : (vals[ms.month - 1] ?? 0);
                    const y = getY(v);
                    const accent = accentMap[ms.color] ?? theme.accent.teal;
                    const isLast = idx === total - 1 || idx === slide.arr.milestones.length - 1;
                    const isEndpoint = idx === slide.arr.milestones.length - 1;
                    const isLeftBadge = isEndpoint || idx === 1; // Month16 also left-of-dot

                    return (
                      <React.Fragment key={ms.label}>
                        {/* Dot */}
                        <div
                          style={{
                            position: 'absolute',
                            left: x - 7,
                            top: y - 7,
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            background: accent,
                            boxShadow: `0 0 12px ${accent}AA`,
                            zIndex: theme.zIndex.legend,
                          }}
                        />
                        {/* Connector */}
                        {!isLeftBadge && (
                          <div
                            style={{
                              position: 'absolute',
                              left: x - 3,
                              top: y - connH - 7,
                              width: 6,
                              height: connH,
                              background: `${accent}55`,
                              borderRadius: 3,
                              zIndex: theme.zIndex.legend,
                            }}
                          />
                        )}
                        {isLeftBadge && (
                          <svg
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              width: cw,
                              height: ch,
                              pointerEvents: 'none',
                              zIndex: theme.zIndex.legend,
                            }}
                          >
                            <line
                              x1={x - 50}
                              y1={y}
                              x2={x - 7}
                              y2={y}
                              stroke={`${accent}55`}
                              strokeWidth={6}
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                        {/* Badge */}
                        <div
                          style={{
                            position: 'absolute',
                            ...(isLeftBadge
                              ? {
                                  left: x - 50,
                                  top: y,
                                  transform: 'translateX(-100%) translateY(-50%)',
                                }
                              : {
                                  left: x,
                                  top: y - connH - 7,
                                  transform: 'translateX(-50%) translateY(-100%)',
                                }),
                            padding: '5px 14px',
                            borderRadius: 8,
                            background: 'rgba(3,10,22,0.92)',
                            border: `1px solid ${accent}66`,
                            fontFamily: theme.typography.fontMono,
                            fontSize: layout.milestoneBadgeSize,
                            fontWeight: 600,
                            color: accent,
                            letterSpacing: '0.02em',
                            whiteSpace: 'nowrap',
                            zIndex: theme.zIndex.legend + 1,
                          }}
                        >
                          {ms.label}
                        </div>
                      </React.Fragment>
                    );
                  });
                })()}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </SlideFrame>
  );
};
