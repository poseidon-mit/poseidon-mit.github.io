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

interface Slide02ProblemOptionBProps {
  debug?: boolean;
  debugGrid?: boolean;
  debugIds?: boolean;
}

const APPS = [
  { id: 'bank', label: 'Banking', icon: 'risk-warning', glow: 'red' as const },
  { id: 'card', label: 'Card', icon: 'data-grid', glow: 'amber' as const },
  { id: 'budget', label: 'Budget', icon: 'pulse', glow: 'violet' as const },
  { id: 'invest', label: 'Invest', icon: 'audit-timeline', glow: 'blue' as const },
] as const;

const STAGES = [
  {
    id: 'detect',
    label: 'Detect',
    icon: 'signal-beam',
    status: ['native', 'native', 'native', 'native'] as const,
  },
  {
    id: 'decide',
    label: 'Decide',
    icon: 'ai-brain',
    status: ['partial', 'partial', 'native', 'partial'] as const,
  },
  {
    id: 'act',
    label: 'Act',
    icon: 'gear',
    status: ['none', 'none', 'none', 'partial'] as const,
  },
  {
    id: 'audit',
    label: 'Audit',
    icon: 'audit-timeline',
    status: ['none', 'none', 'none', 'none'] as const,
  },
] as const;

const STATUS_STYLE = {
  native: {
    label: 'LOCAL',
    color: '#7dd3fc',
    border: 'rgba(56,189,248,0.45)',
    background: 'rgba(56,189,248,0.14)',
  },
  partial: {
    label: 'PARTIAL',
    color: '#facc15',
    border: 'rgba(250,204,21,0.45)',
    background: 'rgba(250,204,21,0.12)',
  },
  none: {
    label: 'MISSING',
    color: '#fca5a5',
    border: 'rgba(239,68,68,0.45)',
    background: 'rgba(239,68,68,0.12)',
  },
} as const;

const MANUAL_QUEUE = [
  {
    id: 'q1',
    icon: 'consent-rail',
    glow: 'red' as const,
    task: 'Collect approvals across four systems',
    owner: 'Customer + support ops',
  },
  {
    id: 'q2',
    icon: 'orbit-connector',
    glow: 'amber' as const,
    task: 'Reconcile timing mismatch and settlement windows',
    owner: 'Ops analyst',
  },
  {
    id: 'q3',
    icon: 'replay-spiral',
    glow: 'violet' as const,
    task: 'Rebuild event sequence for dispute handling',
    owner: 'Compliance team',
  },
  {
    id: 'q4',
    icon: 'compliance-badge',
    glow: 'blue' as const,
    task: 'Produce audit evidence after the incident',
    owner: 'Risk office',
  },
] as const;

const METRICS = [
  {
    id: 'waste',
    label: 'Subscription Waste',
    value: copy.slide02.statCards[0]?.value ?? '$133/mo',
    note: 'Average user impact per month.',
    color: theme.accent.red,
    shadow: theme.neon.red.sharper,
  },
  {
    id: 'loss',
    label: 'Coordination Loss',
    value: copy.slide02.statCards[1]?.value ?? '$24B+/yr',
    note: 'System-level annual leakage.',
    color: theme.accent.amber,
    shadow: theme.neon.amber.sharper,
  },
] as const;

export const Slide02ProblemOptionB: React.FC<Slide02ProblemOptionBProps> = ({
  debug = false,
  debugGrid,
  debugIds,
}) => {
  return (
    <SlideFrame debug={debug} debugGrid={debugGrid} debugIds={debugIds}>
      <Tier3Background layers={backgroundPresets.warningSoft} />

      <SlideHeader
        badge="OPTION B · CAPABILITY MATRIX"
        title="The Coordination Gap"
        subtitle="Each app is locally smart, but no one owns the full decision loop."
        subtitleHighlight="no one owns the full decision loop."
        badgeVariant="warning"
        titleColor={theme.accent.red}
        subtitleHighlightColor={theme.accent.red}
        subtitleHighlightShadow={theme.neon.red.sharper}
        headerStyle={{ marginBottom: theme.spacing.space4, maxWidth: 1720 }}
        titleStyle={{ fontSize: 102, lineHeight: 1, textShadow: `${theme.textCrisp}, ${theme.neon.red.sharper}` }}
        subtitleStyle={{ fontSize: 48, lineHeight: 1.08 }}
        debugId="slide02.optionB.header"
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: slideLayouts.slide02OptionB.gridColumns,
          gap: slideLayouts.slide02OptionB.gridGap,
          flex: 1,
          minHeight: 0,
        }}
        data-debug-id="slide02.optionB.body"
      >
        <GlassCard
          variant="gold"
          tone="dark"
          liquidGlass="premium"
          glassQuality="premium"
          flexContent
          style={{
            ...authorityDarkGlassStyle,
            gap: slideLayouts.slide02OptionB.matrixCardGap,
            padding: slideLayouts.slide02OptionB.matrixCardPadding,
          }}
          debugId="slide02.optionB.matrix"
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
            COORDINATION CAPABILITY MATRIX
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.4fr) repeat(4, minmax(0, 1fr))',
              gap: slideLayouts.slide02OptionB.matrixGridGap,
            }}
          >
            <div />
            {APPS.map((app) => (
              <div
                key={app.id}
                style={{
                  borderRadius: 10,
                  border: `1px solid ${theme.glassPremium.innerPanelBorder}`,
                  background: theme.glassPremium.innerPanelBg,
                  padding: '8px 6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <SlideIcon name={app.icon} glowColor={app.glow} size={48} renderMode="mask" />
                <div
                  style={{
                    fontFamily: theme.typography.fontUi,
                    fontSize: Math.max(v2Policy.typography.metaMinPx, 14),
                    color: 'rgba(255,255,255,0.88)',
                    fontWeight: 700,
                  }}
                >
                  {app.label}
                </div>
              </div>
            ))}

            {STAGES.map((stage) => (
              <React.Fragment key={stage.id}>
                <div
                  style={{
                    borderRadius: 10,
                    border: `1px solid ${theme.glassPremium.innerPanelBorder}`,
                    background: theme.glassPremium.innerPanelBg,
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <SlideIcon name={stage.icon} glowColor="cyan" size={48} renderMode="mask" />
                  <div
                    style={{
                      fontFamily: theme.typography.fontUi,
                      fontSize: 24,
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: 700,
                    }}
                  >
                    {stage.label}
                  </div>
                </div>

                {stage.status.map((status, idx) => {
                  const token = STATUS_STYLE[status];
                  return (
                    <div
                      key={`${stage.id}-${APPS[idx]?.id ?? idx}`}
                      style={{
                        borderRadius: 10,
                        border: `1px solid ${token.border}`,
                        background: token.background,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px 4px',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: theme.typography.fontMono,
                          fontSize: Math.max(v2Policy.typography.metaMinPx, 11),
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          color: token.color,
                        }}
                      >
                        {token.label}
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          <div
            style={{
              marginTop: 'auto',
              borderRadius: 12,
              border: `1px solid ${theme.glassPremium.innerPanelBorder}`,
              background: theme.glassPremium.innerPanelBg,
              padding: '12px 14px',
              fontFamily: theme.typography.fontUi,
              fontSize: 24,
              lineHeight: 1.18,
              color: 'rgba(255,255,255,0.84)',
            }}
          >
            Insights stay inside product silos. Cross-account execution and audit ownership remain
            unassigned.
          </div>
        </GlassCard>

        <div
          style={{
            display: 'grid',
            gridTemplateRows: 'minmax(0, 1fr) auto auto',
            gap: slideLayouts.slide02OptionB.rightGridGap,
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
              padding: slideLayouts.slide02OptionB.queueCardPadding,
              gap: slideLayouts.slide02OptionB.queueCardGap,
            }}
            debugId="slide02.optionB.queue"
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
              MANUAL BRIDGE QUEUE
            </div>

            {MANUAL_QUEUE.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto minmax(0, 1fr) auto',
                  alignItems: 'center',
                  gap: 10,
                  borderRadius: 10,
                  border: `1px solid ${theme.glassPremium.innerPanelBorder}`,
                  background: theme.glassPremium.innerPanelBg,
                  padding: '8px 10px',
                }}
              >
                <SlideIcon name={item.icon} glowColor={item.glow} size={48} renderMode="mask" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div
                    style={{
                      fontFamily: theme.typography.fontUi,
                      fontSize: Math.max(v2Policy.typography.metaMinPx, 16),
                      color: 'rgba(255,255,255,0.88)',
                      lineHeight: 1.15,
                    }}
                  >
                    {item.task}
                  </div>
                  <div
                    style={{
                      fontFamily: theme.typography.fontUi,
                      fontSize: Math.max(v2Policy.typography.metaMinPx, 14),
                      color: 'rgba(255,255,255,0.68)',
                    }}
                  >
                    Owner: {item.owner}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: theme.typography.fontMono,
                    fontSize: Math.max(v2Policy.typography.metaMinPx, 11),
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#ff9a9a',
                    border: '1px solid rgba(239,68,68,0.45)',
                    borderRadius: 999,
                    padding: '4px 8px',
                    textTransform: 'uppercase',
                  }}
                >
                  human
                </div>
              </div>
            ))}

            <div
              style={{
                marginTop: 'auto',
                fontFamily: theme.typography.fontHeader,
                fontSize: 46,
                fontWeight: 700,
                lineHeight: 1,
                color: 'rgba(255,255,255,0.95)',
                textAlign: 'center',
              }}
            >
              YOU CLOSE THE LOOP.
            </div>
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
                  padding: slideLayouts.slide02OptionB.metricCardPadding,
                  gap: slideLayouts.slide02OptionB.metricCardGap,
                }}
              >
                <div
                  style={{
                    fontFamily: theme.typography.fontMono,
                    fontSize: Math.max(v2Policy.typography.metaMinPx, 11),
                    letterSpacing: '0.1em',
                    color: metric.color,
                    textTransform: 'uppercase',
                  }}
                >
                  {metric.label}
                </div>
                <div
                  style={{
                    fontFamily: theme.typography.fontHeader,
                    fontSize: 54,
                    fontWeight: 700,
                    lineHeight: 1,
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
                    lineHeight: 1.15,
                  }}
                >
                  {metric.note}
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
              minHeight: slideLayouts.slide02OptionB.footerMinHeight,
              padding: slideLayouts.slide02OptionB.footerPadding,
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
