/**
 * V2 Visual-First: Slide 02 — The Coordination Gap
 * 案5A: Icons in a row + dashed connectors + hero statement + big numbers
 */
import React from 'react';
import { staticFile } from 'remotion';
import { SlideFrame } from '../../shared/SlideFrame';
import { copy } from '../../shared/copy';
import { theme } from '../../shared/theme';
import { Tier3Background } from '../../shared/visuals/tier3/Tier3Background';
import { DustMotes } from '../../shared/effects/FloatingParticles';
import { v4Presets } from '../../shared/backgroundPresets.v4';
import { getSlideHeaderColors, recolorBackgroundLayers } from '../../shared/slideThemeColor';
import { SlideHeader } from '../../shared/SlideHeader';
import { SlideIcon } from '../../shared/SlideIcon';
import { slideLayouts, v2Policy } from '../../shared/slideLayouts';
import { Connector } from '../../shared/Connector';

interface Slide02ProblemOptionAProps {
  debug?: boolean;
  debugGrid?: boolean;
  debugIds?: boolean;
}

const tc = getSlideHeaderColors('red');

/* Four financial tools — disconnected chain */
const TOOLS = [
  { id: 'banking', icon: 'banking-app', label: 'Banking', gap: 'Cross-institution fund move' },
  { id: 'credit', icon: 'credit-card', label: 'Credit', gap: 'Static auto-pay' },
  { id: 'investment', icon: 'investment-app', label: 'Investment', gap: 'Isolated from cash flow context' },
  { id: 'budget', icon: 'budget-tool', label: 'Budget', gap: 'Tracks but can\'t act on funds' },
] as const;

/* Impact metrics from copy data */
const IMPACT = copy.slide02.statCards.map((card) => ({
  label: card.label,
  value: card.value,
  source: card.subtext,
}));

export const Slide02ProblemOptionA: React.FC<Slide02ProblemOptionAProps> = ({
  debug = false,
  debugGrid,
  debugIds,
}) => {
  const layout = slideLayouts.slide02v2;

  return (
    <SlideFrame debug={debug} debugGrid={debugGrid} debugIds={debugIds} slideNumber={2}>
      <Tier3Background layers={recolorBackgroundLayers(v4Presets.slide02Problem, { primary: 'red', secondary: 'amber', intensityMultiplier: 1.4 })} />
      <DustMotes count={26} opacity={0.05} />

      <SlideHeader
        badge="Structural Issue"
        badgeTheme={tc.badgeTheme}
        title="The Coordination Gap"
        subtitle="Your financial data is fragmented. You are responsible for coordination."
        subtitleHighlight="You are responsible for coordination."
        titleColor="white"
        subtitleHighlightColor={tc.subtitleHighlightColor}
        subtitleHighlightShadow={tc.subtitleHighlightShadow}
        headerStyle={{ marginBottom: theme.spacing.space3, maxWidth: 1720 }}
        titleStyle={{
          fontSize: Math.min(96, v2Policy.header.titleMaxPx),
          lineHeight: 1,
          textShadow: tc.titleTextShadow,
        }}
        subtitleStyle={{
          fontSize: Math.min(48, v2Policy.header.subtitleMaxPx),
          lineHeight: 1.1,
        }}
        debugId="slide02v2.header"
        debugBadgeId="slide02v2.header.badge"
        debugTitleId="slide02v2.header.title"
        debugSubtitleId="slide02v2.header.subtitle"
      />

      {/* Content wrapper — single vertical column */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
        }}
        data-debug-id="slide02v2.body"
      >
        {/* ═══ Tool Icons Row — disconnected chain (full width) ═══ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
          data-debug-id="slide02v2.tools"
        >
          {TOOLS.map((tool, i) => (
            <React.Fragment key={tool.id}>
              {/* Dashed connector between icons */}
              {i > 0 && (
                <Connector
                  direction="horizontal"
                  width={2}
                  color="rgba(255,255,255,0.25)"
                  dashed
                  opacity={1}
                  style={{ flex: 1, flexShrink: 1, marginBottom: 80, minWidth: 30 }}
                />
              )}
              {/* Icon column */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  width: 220,
                  flexShrink: 0,
                }}
              >
                <SlideIcon
                  name={tool.icon}
                  size={layout.toolIconSize}
                  glowColor="red"
                  renderMode="mask"
                />
                <div
                  style={{
                    fontFamily: theme.typography.fontUi,
                    fontSize: layout.toolLabelSize,
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.90)',
                    lineHeight: 1,
                  }}
                >
                  {tool.label}
                </div>
                {/* MANUAL pill badge */}
                <div
                  style={{
                    fontFamily: theme.typography.fontMono,
                    fontSize: layout.toolBadgeSize,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#ff9a9a',
                    border: '1px solid rgba(239,68,68,0.45)',
                    borderRadius: 999,
                    padding: '4px 14px',
                    textTransform: 'uppercase',
                  }}
                >
                  manual
                </div>
                {/* Gap description */}
                <div
                  style={{
                    fontFamily: theme.typography.fontUi,
                    fontSize: layout.toolGapDescSize,
                    lineHeight: 1,
                    color: 'rgba(255,255,255,0.65)',
                    textAlign: 'center',
                    marginTop: 2,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tool.gap}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* ═══ Hero Statement ═══ */}
        <div
          style={{
            textAlign: 'center',
            padding: '16px 0',
            flexShrink: 0,
          }}
          data-debug-id="slide02v2.hero"
        >
          <span
            style={{
              fontFamily: theme.typography.fontHeader,
              fontSize: layout.heroStatementSize,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.95)',
              lineHeight: 1,
            }}
          >
            You are the{' '}
          </span>
          <span
            style={{
              fontFamily: theme.typography.fontHeader,
              fontSize: layout.heroStatementSize,
              fontWeight: 700,
              color: theme.accent.red,
              textShadow: `${theme.textCrisp}, ${theme.neon.red.sharper}`,
              lineHeight: 1,
            }}
          >
            integration layer.
          </span>
        </div>

        {/* ═══ Separator Line ═══ */}
        <div
          style={{
            height: 2,
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 15%, rgba(255,255,255,0.25) 85%, transparent 100%)',
            flexShrink: 0,
            margin: '4px 0',
          }}
          data-debug-id="slide02v2.separator"
        />

        {/* ═══ Big Numbers Row ═══ */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 0,
          }}
          data-debug-id="slide02v2.stats"
        >
          {IMPACT.map((stat, i) => (
            <React.Fragment key={stat.label}>
              {/* Vertical divider */}
              {i > 0 && (
                <Connector
                  direction="vertical"
                  length={60}
                  width={1}
                  color="rgba(255,255,255,0.10)"
                  opacity={1}
                />
              )}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    fontFamily: theme.typography.fontMono,
                    fontSize: layout.statValueSize,
                    fontWeight: 700,
                    color: theme.accent.red,
                    lineHeight: 1,
                    textShadow: `0 0 12px ${theme.accent.red}44`,
                    fontVariantNumeric: theme.typography.numericVariant,
                    fontFeatureSettings: theme.typography.numericFeatureSettings,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: theme.typography.fontUi,
                    fontSize: layout.statLabelSize,
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.60)',
                    lineHeight: 1,
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    fontFamily: theme.typography.fontUi,
                    fontSize: layout.statSourceSize,
                    color: 'rgba(255,255,255,0.60)',
                    lineHeight: 1,
                    textAlign: 'center',
                    whiteSpace: 'normal',
                    maxWidth: 330,
                  }}
                >
                  {stat.source}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* ═══ Footer ═══ */}
        <div
          style={{
            textAlign: 'center',
            padding: '8px 20px 4px',
            flexShrink: 0,
          }}
          data-debug-id="slide02v2.footer"
        >
          <div
            style={{
              fontFamily: theme.typography.fontUi,
              fontSize: layout.footerTextSize,
              color: 'rgba(255,255,255,0.88)',
              lineHeight: 1.14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            <span style={{ whiteSpace: 'nowrap' }}>
              Fintech(
              <img
                src={staticFile('assets/svg/mint-logo-white.svg')}
                alt="Mint"
                style={{
                  height: '1.05em',
                  width: 'auto',
                  verticalAlign: '-0.08em',
                  margin: '0 6px',
                }}
              />
              , etc) solved visibility.
            </span>
            <span style={{ whiteSpace: 'nowrap' }}>
              What can we solve next?
            </span>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};
