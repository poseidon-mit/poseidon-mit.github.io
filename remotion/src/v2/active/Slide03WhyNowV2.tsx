/**
 * V2 Visual-First: Slide 03 — Why Now
 * Open Banking (2021) & AI-Native Expectation (2025) above timeline, AI Economics (2023) below.
 * All 3 cards equal size via shared 3-column grid alignment.
 */
import React from 'react';
import { SlideFrame } from '../../shared/SlideFrame';
import { theme } from '../../shared/theme';
import { Tier3Background } from '../../shared/visuals/tier3/Tier3Background';
import { DustMotes } from '../../shared/effects/FloatingParticles';
import { GlassCard } from '../../shared/GlassCard';
import { v4Presets } from '../../shared/backgroundPresets.v4';
import { getSlideHeaderColors, recolorBackgroundLayers } from '../../shared/slideThemeColor';
import { SlideHeader } from '../../shared/SlideHeader';
import { slideLayouts, v2Policy } from '../../shared/slideLayouts';
import { SlideIcon } from '../../shared/SlideIcon';
import { ChartLine } from '../../shared/charts/ChartLine';
import { authorityDarkGlassStyle } from '../../shared/authorityDarkGlassStyle';
import { Connector } from '../../shared/Connector';
import { CANVAS } from '../../shared/canvasBudget';

interface Slide03WhyNowV2Props {
  debug?: boolean;
  debugGrid?: boolean;
  debugIds?: boolean;
}

const tc = getSlideHeaderColors('teal');

/* AI inference cost decline curve */
const COST_DECLINE = [100, 20, 4, 0.8];
const COST_LABELS = ['2022', '2023', '2024', '2025'];

/* Shared card base style — cardWidthExtra widens each card beyond its grid column */
const cardBase: React.CSSProperties = {
  gap: 12,
  ...authorityDarkGlassStyle,
};

/* Shared 3-column grid props — ensures dots, connectors and cards align */
const GRID_COLUMNS = '1fr 1fr 1fr';

export const Slide03WhyNowV2: React.FC<Slide03WhyNowV2Props> = ({
  debug = false,
  debugGrid,
  debugIds,
}) => {
  const layout = slideLayouts.slide03v2;

  /* Compute explicit card width in pixels — calc() doesn't resolve reliably in Remotion */
  const slideMarginX = CANVAS.marginX;
  const contentWidth = 1920 - 2 * slideMarginX;
  const colWidth = (contentWidth - 2 * layout.cardGap) / 3;
  const cardWidth = colWidth + layout.cardWidthExtra;
  const halfExtra = layout.cardWidthExtra / 2;

  /* Shift top cards toward center so gap between them ≈ 15px.
     Connector lines stay centered in their grid columns (alignSelf:'center'). */
  const symmetricGap = contentWidth - colWidth - cardWidth;
  const bottomTargetGap = 15;
  const centerShift = Math.max(0, (symmetricGap - bottomTargetGap) / 2);
  // Open Banking (col 1): shift right → AI-Native (col 3): shift left
  const obMarginLeft = -halfExtra + centerShift;
  const obMarginRight = -halfExtra - centerShift;
  const andMarginLeft = -halfExtra - centerShift;
  const andMarginRight = -halfExtra + centerShift;

  return (
    <SlideFrame debug={debug} debugGrid={debugGrid} debugIds={debugIds} slideNumber={3}>
      <Tier3Background layers={recolorBackgroundLayers(v4Presets.slide03WhyNow, { primary: 'teal', secondary: 'violet', intensityMultiplier: 1.4 })} />
      <DustMotes count={26} opacity={0.05} />

      <SlideHeader
        badge="WHY NOW?"
        badgeTheme={tc.badgeTheme}
        title="Environmental Shift"
        subtitle="Three forces converging to make trustworthy personal finance AI."
        subtitleHighlight="trustworthy personal finance AI."
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
        debugId="slide03v2.header"
        debugBadgeId="slide03v2.header.badge"
        debugTitleId="slide03v2.header.title"
        debugSubtitleId="slide03v2.header.subtitle"
      />

      {/* Content wrapper */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: 0,
          minHeight: 0,
        }}
        data-debug-id="slide03v2.body"
      >
        {/* ═══ TOP: Open Banking (col 1) + AI-Native Expectation (col 3) ═══ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: GRID_COLUMNS,
            gap: layout.cardGap,
            flex: layout.topSectionFlex,
            minHeight: 0,
          }}
        >
          {/* Col 1: Open Banking */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              minHeight: 0,
            }}
          >
            <GlassCard
              variant="teal"
              tone="dark"
              liquidGlass="premium"
              glassQuality="premium"
              flexContent
              style={{
                ...cardBase,
                padding: layout.forceCardPadding,
                flex: 1,
                minHeight: 0,
                width: cardWidth,
                marginLeft: obMarginLeft,
                marginRight: obMarginRight,
              }}
              debugId="slide03v2.force.open-banking"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <SlideIcon name="open-banking" size={layout.iconSize} glowColor="teal" variant="simple" renderMode="mask" style={{ flexShrink: 0 }} />
                <div
                  style={{
                    fontFamily: theme.typography.fontHeader,
                    fontSize: layout.forceCardTitleSize,
                    fontWeight: 700,
                    color: theme.accent.teal,
                    textShadow: theme.textCrisp,
                    lineHeight: 1,
                  }}
                >
                  Open Banking
                </div>
              </div>
              <div
                style={{
                  fontFamily: theme.typography.fontUi,
                  fontSize: layout.forceDescSize,
                  color: 'rgba(255,255,255,0.70)',
                  lineHeight: 1.25,
                }}
              >
                <div>- APIs are standardizing</div>
                <div>- Data processing rules clarified(GDPR, etc)</div>
              </div>
              <div style={{ display: 'flex', gap: 28, justifyContent: 'center', alignItems: 'center', marginTop: 'auto', flexWrap: 'wrap' }}>
                {[
                  { icon: 'orbit-connector', label: 'API' },
                  { icon: 'regulation-scale', label: 'Regulation' },
                  { icon: 'api-standard', label: 'Data' },
                ].map((tag) => (
                  <div key={tag.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <SlideIcon name={tag.icon} size={layout.miniIconSize} glowColor="teal" renderMode="mask" style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: theme.typography.fontUi, fontSize: layout.tagLabelSize, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                      {tag.label}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
            {/* Connector from card → 2021 dot */}
            <Connector
              width={layout.connectorWidth}
              length={layout.connectorHeight}
              color={`${theme.accent.teal}50`}
              toColor={theme.accent.teal}
              style={{ alignSelf: 'center' }}
            />
          </div>
          {/* Col 2: empty */}
          <div />

          {/* Col 3: AI-Native Expectation */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              minHeight: 0,
            }}
          >
            <GlassCard
              variant="gold"
              tone="dark"
              liquidGlass="premium"
              glassQuality="premium"
              flexContent
              style={{
                ...cardBase,
                padding: layout.forceCardPadding,
                flex: 1,
                minHeight: 0,
                width: cardWidth,
                marginLeft: andMarginLeft,
                marginRight: andMarginRight,
              }}
              debugId="slide03v2.force.ai-native"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <SlideIcon name="consumer-demand" size={layout.iconSize} glowColor="amber" variant="simple" renderMode="mask" style={{ flexShrink: 0 }} />
                <div
                  style={{
                    fontFamily: theme.typography.fontHeader,
                    fontSize: layout.forceCardTitleSize,
                    fontWeight: 700,
                    color: theme.accent.amber,
                    textShadow: theme.textCrisp,
                    lineHeight: 1,
                  }}
                >
                  AI-Native Expectation
                </div>
              </div>
              <div
                style={{
                  fontFamily: theme.typography.fontUi,
                  fontSize: layout.forceDescSize,
                  color: 'rgba(255,255,255,0.70)',
                  lineHeight: 1.25,
                }}
              >
                Users now expect proactive, personalized financial guidance
              </div>
              <div style={{ display: 'flex', gap: 28, justifyContent: 'center', alignItems: 'center', marginTop: 'auto', flexWrap: 'wrap' }}>
                {[
                  { icon: 'digital-shift', label: 'Behavioral Shift' },
                  { icon: 'advice-first', label: 'AI Native Expectation' },
                ].map((tag) => (
                  <div key={tag.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <SlideIcon name={tag.icon} size={layout.miniIconSize} glowColor="amber" renderMode="mask" style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: theme.typography.fontUi, fontSize: layout.tagLabelSize, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                      {tag.label}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
            {/* Connector from card → 2025 dot */}
            <Connector
              width={layout.connectorWidth}
              length={layout.connectorHeight}
              color={`${theme.accent.amber}50`}
              toColor={theme.accent.amber}
              style={{ alignSelf: 'center' }}
            />
          </div>
        </div>

        {/* ═══ TIMELINE: horizontal line + 3 dots (same 3-col grid) ═══ */}
        <div
          style={{
            position: 'relative',
            flexShrink: 0,
          }}
          data-debug-id="slide03v2.timeline"
        >
          {/* Horizontal gradient line — behind dots */}
          <div
            style={{
              position: 'absolute',
              top: 7,
              left: '4%',
              right: '3%',
              height: 3,
              background: `linear-gradient(90deg, ${theme.accent.teal} 0%, ${theme.accent.violet} 45%, ${theme.accent.amber} 80%, ${theme.accent.cyan} 100%)`,
              borderRadius: 2,
              opacity: 0.7,
            }}
          />
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              top: 1,
              right: '2%',
              width: 0,
              height: 0,
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
              borderLeft: `12px solid ${theme.accent.cyan}`,
              opacity: 0.7,
            }}
          />
          {/* Dots + year labels (same 3-col grid to match card columns) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: GRID_COLUMNS,
              gap: layout.cardGap,
              position: 'relative',
              zIndex: theme.zIndex.content,
            }}
          >
            {[
              { year: '2021', color: theme.accent.teal, yearAboveLine: false },
              { year: '2023', color: theme.accent.violet, yearAboveLine: true },
              { year: '2025', color: theme.accent.amber, yearAboveLine: false },
            ].map((m) => (
              <div
                key={m.year}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                {m.yearAboveLine && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -34,
                      fontFamily: theme.typography.fontMono,
                      fontSize: layout.timelineYearSize,
                      fontWeight: 700,
                      color: m.color,
                      fontVariantNumeric: theme.typography.numericVariant,
                      fontFeatureSettings: theme.typography.numericFeatureSettings,
                    }}
                  >
                    {m.year}
                  </div>
                )}
                <div
                  style={{
                    width: layout.timelineMarkerSize,
                    height: layout.timelineMarkerSize,
                    borderRadius: '50%',
                    background: m.color,
                    boxShadow: `0 0 6px ${m.color}, 0 0 14px ${m.color}88, 0 0 2px #fff`,
                  }}
                />
                {!m.yearAboveLine && (
                  <div
                    style={{
                      fontFamily: theme.typography.fontMono,
                      fontSize: layout.timelineYearSize,
                      fontWeight: 700,
                      color: m.color,
                      marginTop: 6,
                      fontVariantNumeric: theme.typography.numericVariant,
                      fontFeatureSettings: theme.typography.numericFeatureSettings,
                    }}
                  >
                    {m.year}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ═══ BOTTOM: AI Economics (col 2) ═══ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: GRID_COLUMNS,
            gap: layout.cardGap,
            flex: layout.bottomSectionFlex,
            minHeight: 0,
          }}
          data-debug-id="slide03v2.cards"
        >
          {/* Col 1: empty */}
          <div />
          {/* Col 2: AI Economics */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              minHeight: 0,
            }}
          >
            {/* Connector from 2023 dot → card */}
            <Connector
              width={layout.connectorWidth}
              length={layout.connectorHeight}
              color={theme.accent.violet}
              toColor={`${theme.accent.violet}50`}
              style={{ alignSelf: 'center', marginTop: -30 }}
            />
            <GlassCard
              variant="violet"
              tone="dark"
              liquidGlass="premium"
              glassQuality="premium"
              flexContent
              style={{
                ...cardBase,
                padding: '20px 30px 4px',
                flex: 1,
                minHeight: 0,
                width: cardWidth,
                marginLeft: -layout.cardWidthExtra / 2,
                marginRight: -layout.cardWidthExtra / 2,
              }}
              debugId="slide03v2.force.ai-economics"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <SlideIcon name="ai-economics" size={layout.iconSize} glowColor="violet" variant="simple" renderMode="mask" style={{ flexShrink: 0 }} />
                <div
                  style={{
                    fontFamily: theme.typography.fontHeader,
                    fontSize: layout.forceCardTitleSize,
                    fontWeight: 700,
                    color: theme.accent.violet,
                    textShadow: theme.textCrisp,
                    lineHeight: 1,
                  }}
                >
                  AI Economics
                </div>
              </div>
              <div
                style={{
                  fontFamily: theme.typography.fontUi,
                  fontSize: layout.forceDescSize,
                  color: 'rgba(255,255,255,0.70)',
                  lineHeight: 1.25,
                }}
              >
                Inference cost dropping 10x annually (Epoch AI, 2025)
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', minHeight: 0 }}>
                <ChartLine
                  data={COST_DECLINE}
                  width={layout.chartLineWidth}
                  height={80}
                  color={theme.accent.violet}
                  strokeWidth={2.5}
                  showArea
                  showGrid={false}
                  showDotGrid
                  smooth
                  smoothTension={0.42}
                  highlightLastPoint={false}
                  xLabels={COST_LABELS}
                  showAxisLabels
                  xPadding={40}
                  xLabelFontSize={18}
                  xLabelYOffset={8}
                  style={{
                    filter: `drop-shadow(0 0 12px ${theme.accent.violet}50)`,
                  }}
                />
              </div>
            </GlassCard>
          </div>

          {/* Col 3: empty */}
          <div />
        </div>

        {/* ═══ Footer Callout ═══ */}
        <div
          style={{
            padding: '23px 20px 12px',
            flexShrink: v2Policy.card.cardFlexShrink,
          }}
          data-debug-id="slide03v2.footer"
        >
          <div
            style={{
              fontFamily: theme.typography.fontUi,
              fontSize: layout.footerTextSize,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.16,
              textAlign: 'center',
            }}
          >
            Infrastructure + economics + user demand converged in 2025.
            <span
              style={{
                color: theme.accent.cyan,
                textShadow: `${theme.textCrisp}, ${theme.neon.cyan.deep}`,
                marginLeft: 10,
                fontWeight: 700,
              }}
            >
              Ready for scale.
            </span>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};
