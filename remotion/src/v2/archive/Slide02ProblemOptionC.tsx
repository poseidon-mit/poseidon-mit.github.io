import React from 'react';
import { SlideFrame } from '../../shared/SlideFrame';
import { copy } from '../../shared/copy';
import { theme } from '../../shared/theme';
import { Tier3Background } from '../../shared/visuals/tier3/Tier3Background';
import { backgroundPresets } from '../../shared/backgroundPresets';
import { SlideHeader } from '../../shared/SlideHeader';
import { GlassCard } from '../../shared/GlassCard';
import { SlideIcon } from '../../shared/SlideIcon';
import { authorityDarkGlassStyle } from '../../shared/authorityDarkGlassStyle';
import { slideLayouts, v2Policy } from '../../shared/slideLayouts';

interface Slide02ProblemOptionCProps {
  debug?: boolean;
  debugGrid?: boolean;
  debugIds?: boolean;
}

const NODES = [
  {
    id: 'bank',
    title: 'Banking App',
    icon: 'risk-warning',
    glow: 'red' as const,
    signal: 'Sees cash risk early.',
    missing: 'No outbound action contract.',
  },
  {
    id: 'card',
    title: 'Card Dashboard',
    icon: 'data-grid',
    glow: 'amber' as const,
    signal: 'Sees merchant anomalies.',
    missing: 'No cross-product decision state.',
  },
  {
    id: 'budget',
    title: 'Budget Tool',
    icon: 'pulse',
    glow: 'violet' as const,
    signal: 'Sees overspend trajectories.',
    missing: 'No execution authority.',
  },
  {
    id: 'invest',
    title: 'Investment App',
    icon: 'audit-timeline',
    glow: 'blue' as const,
    signal: 'Sees portfolio exposure shifts.',
    missing: 'No shared audit evidence.',
  },
] as const;

const LEDGER = [
  {
    id: 'l1',
    time: '08:42',
    event: 'Risk alert triggered in banking app.',
    delay: 'Waiting for user handoff',
  },
  {
    id: 'l2',
    time: '09:07',
    event: 'Card anomaly confirmed by card dashboard.',
    delay: 'No shared approval state',
  },
  {
    id: 'l3',
    time: '10:11',
    event: 'Budget tool recommends corrective action.',
    delay: 'Action cannot execute across products',
  },
  {
    id: 'l4',
    time: '11:30',
    event: 'Audit story assembled after incident.',
    delay: 'Evidence reconstructed manually',
  },
] as const;

const METRICS = [
  {
    id: 'waste',
    label: 'Subscription Waste',
    value: copy.slide02.statCards[0]?.value ?? '$133/mo',
    definition: 'Average hidden monthly cost per user.',
    color: theme.accent.red,
    shadow: theme.neon.red.sharper,
  },
  {
    id: 'loss',
    label: 'Coordination Loss',
    value: copy.slide02.statCards[1]?.value ?? '$24B+/yr',
    definition: 'Annual loss from fragmented execution paths.',
    color: theme.accent.amber,
    shadow: theme.neon.amber.sharper,
  },
] as const;

export const Slide02ProblemOptionC: React.FC<Slide02ProblemOptionCProps> = ({
  debug = false,
  debugGrid,
  debugIds,
}) => {
  return (
    <SlideFrame debug={debug} debugGrid={debugGrid} debugIds={debugIds}>
      <Tier3Background layers={backgroundPresets.warningSoft} />

      <SlideHeader
        badge="OPTION C · FRACTURED CONTROL LOOP"
        title="The Coordination Gap"
        subtitle="Four intelligent surfaces, one missing control owner."
        subtitleHighlight="one missing control owner."
        badgeVariant="warning"
        titleColor={theme.accent.red}
        subtitleHighlightColor={theme.accent.red}
        subtitleHighlightShadow={theme.neon.red.sharper}
        headerStyle={{ marginBottom: theme.spacing.space4, maxWidth: 1720 }}
        titleStyle={{ fontSize: 102, lineHeight: 1, textShadow: `${theme.textCrisp}, ${theme.neon.red.sharper}` }}
        subtitleStyle={{ fontSize: 48, lineHeight: 1.08 }}
        debugId="slide02.optionC.header"
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: slideLayouts.slide02OptionC.gridColumns,
          gap: slideLayouts.slide02OptionC.gridGap,
          flex: 1,
          minHeight: 0,
        }}
        data-debug-id="slide02.optionC.body"
      >
        <GlassCard
          variant="blue"
          tone="dark"
          liquidGlass="premium"
          glassQuality="premium"
          style={{
            ...authorityDarkGlassStyle,
            padding: slideLayouts.slide02OptionC.loopCardPadding,
            display: 'grid',
            gridTemplateRows: '1fr auto 1fr',
            gridTemplateColumns: '1fr 1fr',
            gap: slideLayouts.slide02OptionC.loopCardGap,
            minHeight: 0,
          }}
          debugId="slide02.optionC.loop"
        >
          {NODES.slice(0, 2).map((node) => (
            <div
              key={node.id}
              style={{
                borderRadius: 12,
                border: `1px solid ${theme.glassPremium.innerPanelBorder}`,
                background: theme.glassPremium.innerPanelBg,
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SlideIcon name={node.icon} glowColor={node.glow} size={48} renderMode="mask" />
                <div
                  style={{
                    fontFamily: theme.typography.fontUi,
                    fontSize: 24,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.92)',
                  }}
                >
                  {node.title}
                </div>
              </div>
              <div
                style={{
                  fontFamily: theme.typography.fontUi,
                  fontSize: Math.max(v2Policy.typography.metaMinPx, 16),
                  color: 'rgba(255,255,255,0.72)',
                  lineHeight: 1.18,
                }}
              >
                {node.signal}
              </div>
              <div
                style={{
                  fontFamily: theme.typography.fontUi,
                  fontSize: Math.max(v2Policy.typography.metaMinPx, 16),
                  color: '#ff9a9a',
                  lineHeight: 1.18,
                }}
              >
                {node.missing}
              </div>
            </div>
          ))}

          <div
            style={{
              gridColumn: '1 / span 2',
              minHeight: 120,
              borderRadius: 14,
              border: `1px solid ${theme.glassPremium.innerPanelBorder}`,
              background:
                'radial-gradient(circle at 50% 50%, rgba(239,68,68,0.24) 0%, rgba(10,14,24,0.76) 56%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 6,
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '10%',
                right: '10%',
                top: 16,
                borderTop: '1px dashed rgba(255,255,255,0.3)',
              }}
            />
            <div
              style={{
                fontFamily: theme.typography.fontMono,
                fontSize: Math.max(v2Policy.typography.metaMinPx, 13),
                letterSpacing: '0.12em',
                color: 'rgba(255,255,255,0.68)',
                textTransform: 'uppercase',
              }}
            >
              CONTROL OWNER
            </div>
            <div
              style={{
                fontFamily: theme.typography.fontHeader,
                fontSize: 48,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.95)',
                lineHeight: 1,
                textShadow: theme.textCrisp,
              }}
            >
              YOU
            </div>
            <div
              style={{
                fontFamily: theme.typography.fontUi,
                fontSize: 24,
                color: 'rgba(255,255,255,0.8)',
                lineHeight: 1.12,
                textAlign: 'center',
              }}
            >
              Manual coordination stitches every decision.
            </div>
          </div>

          {NODES.slice(2).map((node) => (
            <div
              key={node.id}
              style={{
                borderRadius: 12,
                border: `1px solid ${theme.glassPremium.innerPanelBorder}`,
                background: theme.glassPremium.innerPanelBg,
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SlideIcon name={node.icon} glowColor={node.glow} size={48} renderMode="mask" />
                <div
                  style={{
                    fontFamily: theme.typography.fontUi,
                    fontSize: 24,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.92)',
                  }}
                >
                  {node.title}
                </div>
              </div>
              <div
                style={{
                  fontFamily: theme.typography.fontUi,
                  fontSize: Math.max(v2Policy.typography.metaMinPx, 16),
                  color: 'rgba(255,255,255,0.72)',
                  lineHeight: 1.18,
                }}
              >
                {node.signal}
              </div>
              <div
                style={{
                  fontFamily: theme.typography.fontUi,
                  fontSize: Math.max(v2Policy.typography.metaMinPx, 16),
                  color: '#ff9a9a',
                  lineHeight: 1.18,
                }}
              >
                {node.missing}
              </div>
            </div>
          ))}
        </GlassCard>

        <div
          style={{
            display: 'grid',
            gridTemplateRows: 'minmax(0, 1fr) auto auto',
            gap: slideLayouts.slide02OptionC.rightGridGap,
            minHeight: 0,
          }}
        >
          <GlassCard
            variant="red"
            tone="dark"
            liquidGlass="premium"
            glassQuality="premium"
            flexContent
            style={{
              ...authorityDarkGlassStyle,
              padding: slideLayouts.slide02OptionC.ledgerCardPadding,
              gap: slideLayouts.slide02OptionC.ledgerCardGap,
            }}
            debugId="slide02.optionC.ledger"
          >
            <div
              style={{
                fontFamily: theme.typography.fontMono,
                fontSize: Math.max(v2Policy.typography.metaMinPx, 13),
                letterSpacing: '0.12em',
                color: 'rgba(255,255,255,0.62)',
                textTransform: 'uppercase',
              }}
            >
              FAILURE LEDGER
            </div>

            {LEDGER.map((entry) => (
              <div
                key={entry.id}
                style={{
                  borderRadius: 10,
                  border: `1px solid ${theme.glassPremium.innerPanelBorder}`,
                  background: theme.glassPremium.innerPanelBg,
                  padding: '8px 10px',
                  display: 'grid',
                  gridTemplateColumns: 'auto minmax(0, 1fr)',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    fontFamily: theme.typography.fontMono,
                    fontSize: Math.max(v2Policy.typography.metaMinPx, 12),
                    color: '#93c5fd',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    paddingTop: 2,
                  }}
                >
                  {entry.time}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div
                    style={{
                      fontFamily: theme.typography.fontUi,
                      fontSize: Math.max(v2Policy.typography.bodySecondaryMinPx, 15),
                      color: 'rgba(255,255,255,0.86)',
                      lineHeight: 1.15,
                    }}
                  >
                    {entry.event}
                  </div>
                  <div
                    style={{
                      fontFamily: theme.typography.fontUi,
                      fontSize: Math.max(v2Policy.typography.metaMinPx, 14),
                      color: '#ff9a9a',
                      lineHeight: 1.15,
                    }}
                  >
                    {entry.delay}
                  </div>
                </div>
              </div>
            ))}
          </GlassCard>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 12,
            }}
          >
            {METRICS.map((metric) => (
              <GlassCard
                key={metric.id}
                variant={metric.id === 'waste' ? 'red' : 'gold'}
                tone="dark"
                liquidGlass="premium"
                glassQuality="premium"
                flexContent
                style={{
                  ...authorityDarkGlassStyle,
                  padding: slideLayouts.slide02OptionC.metricCardPadding,
                  gap: slideLayouts.slide02OptionC.metricCardGap,
                }}
              >
                <div
                  style={{
                    fontFamily: theme.typography.fontMono,
                    fontSize: Math.max(v2Policy.typography.metaMinPx, 11),
                    color: metric.color,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {metric.label}
                </div>
                <div
                  style={{
                    fontFamily: theme.typography.fontHeader,
                    fontSize: 52,
                    lineHeight: 1,
                    fontWeight: 700,
                    color: metric.color,
                    textShadow: metric.shadow,
                  }}
                >
                  {metric.value}
                </div>
                <div
                  style={{
                    fontFamily: theme.typography.fontUi,
                    fontSize: Math.max(v2Policy.typography.bodySecondaryMinPx, 15),
                    color: 'rgba(255,255,255,0.74)',
                    lineHeight: 1.14,
                  }}
                >
                  {metric.definition}
                </div>
              </GlassCard>
            ))}
          </div>

          <GlassCard
            tone="dark"
            liquidGlass="premium"
            glassQuality="premium"
            style={{
              ...authorityDarkGlassStyle,
              minHeight: slideLayouts.slide02OptionC.footerMinHeight,
              padding: slideLayouts.slide02OptionC.footerPadding,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontFamily: theme.typography.fontUi,
                fontSize: 24,
                color: 'rgba(255,255,255,0.9)',
                textAlign: 'center',
                lineHeight: 1.14,
              }}
            >
              The failure is coordination, not visibility.
            </div>
          </GlassCard>
        </div>
      </div>
    </SlideFrame>
  );
};
