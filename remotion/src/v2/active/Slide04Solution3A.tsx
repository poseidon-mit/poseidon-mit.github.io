/**
 * Experiment: 案3-A改 — Govern Panel as Container
 * Governパネル自体を大きくし、Protect/Grow/Executeを内包。
 * 「Governが全エンジンを統制する」を包含関係で直感的に表現。
 *
 * 本流パイプライン (render-all-slides / gen-v3-pptx) には含まれない。
 * 個別レンダリング: npx remotion still src/index.ts Slide04Solution3A out/experiment-3A.png --scale 3
 */
import React from 'react';
import { SlideFrame } from '../../shared/SlideFrame';
import { copy } from '../../shared/copy';
import { theme } from '../../shared/theme';
import { Tier3Background } from '../../shared/visuals/tier3/Tier3Background';
import { DustMotes } from '../../shared/effects/FloatingParticles';
import { GlassCard } from '../../shared/GlassCard';
import { v4Presets } from '../../shared/backgroundPresets.v4';
import { SlideHeader } from '../../shared/SlideHeader';
import { slideLayouts, v2Policy } from '../../shared/slideLayouts';
import { SlideIcon } from '../../shared/SlideIcon';
import { authorityDarkGlassStyle } from '../../shared/authorityDarkGlassStyle';
import { getSlideHeaderColors, recolorBackgroundLayers } from '../../shared/slideThemeColor';

const tc = getSlideHeaderColors('blue');

interface Slide04Solution3AProps {
  debug?: boolean;
  debugGrid?: boolean;
  debugIds?: boolean;
}

const ENGINE_META = [
  {
    id: 'protect',
    icon: 'shield',
    glow: 'teal' as const,
    color: theme.accent.teal,
    variant: 'teal' as const,
  },
  {
    id: 'grow',
    icon: 'wave',
    glow: 'violet' as const,
    color: theme.accent.violet,
    variant: 'violet' as const,
  },
  {
    id: 'execute',
    icon: 'gear',
    glow: 'amber' as const,
    color: theme.accent.amber,
    variant: 'gold' as const,
  },
  {
    id: 'govern',
    icon: 'govern-core',
    glow: 'blue' as const,
    color: theme.accent.blue,
    variant: 'blue' as const,
  },
] as const;

type EngineId = (typeof ENGINE_META)[number]['id'];

const ENGINE_CONTENT: Record<
  EngineId,
  {
    proof: string;
    metric?: string;
    signals: ReadonlyArray<{ icon: string; label: string }>;
  }
> = {
  protect: {
    proof: 'Personalized ML models across your accounts',
    signals: [
      { icon: 'risk-warning', label: 'Detection' },
      { icon: 'shield', label: 'Fraud' },
      { icon: 'data-grid', label: 'Subscription' },
      { icon: 'pulse', label: 'Anomaly' },
    ],
  },
  grow: {
    proof: 'Cashflow and saving opportunities',
    signals: [
      { icon: 'wave', label: 'Cashflow Forecast' },
      { icon: 'roadmap-pin', label: 'Spending Analysis' },
      { icon: 'budget-tool', label: 'Saving Opportunities' },
      { icon: 'signal-beam', label: 'Next Best Review' },
    ],
  },
  execute: {
    proof: 'Execution assistant',
    signals: [
      { icon: 'orbit-connector', label: 'Regulatory Compliant UI' },
      { icon: 'replay-spiral', label: 'Execution steps' },
    ],
  },
  govern: {
    proof: 'Ensures auditability of all engines',
    signals: [
      { icon: 'regulation-scale', label: 'Compliance' },
      { icon: 'ai-brain', label: 'AI Governance' },
      { icon: 'audit-timeline', label: 'Full Auditability' },
      { icon: 'data-grid', label: 'Transparent UI' },
    ],
  },
};

/* Top-3 engines (Protect, Grow, Execute) */
const TOP_ENGINES = ENGINE_META.filter((m) => m.id !== 'govern');
const GOVERN_META = ENGINE_META.find((m) => m.id === 'govern')!;


export const Slide04Solution3A: React.FC<Slide04Solution3AProps> = ({
  debug = false,
  debugGrid,
  debugIds,
}) => {
  const layout = slideLayouts.slide04v2;
  const engines = copy.slide04.engines;
  const governEngine = engines.find((e) => e.id === 'govern')!;
  const governContent = ENGINE_CONTENT.govern;

  return (
    <SlideFrame debug={debug} debugGrid={debugGrid} debugIds={debugIds} slideNumber={4}>
      <Tier3Background layers={recolorBackgroundLayers(v4Presets.slide04Solution, { primary: 'blue', secondary: 'teal', intensityMultiplier: 1.4 })} />
      <DustMotes count={26} opacity={0.05} />

      <SlideHeader
        badge="GOVERNANCE BY DESIGN ARCHITECTURE"
        title="Poseidon: 4 Engines"
        subtitle="Protect, Grow, Execute, and Govern as one auditable system."
        subtitleHighlight="one auditable system."
        badgeTheme={tc.badgeTheme}
        titleColor="white"
        subtitleHighlightColor={tc.subtitleHighlightColor}
        subtitleHighlightShadow={tc.subtitleHighlightShadow}
        maxWidth={1720}
        headerStyle={{ marginBottom: theme.spacing.space4 }}
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
        debugId="slide04-3a.header"
        debugBadgeId="slide04-3a.header.badge"
        debugTitleId="slide04-3a.header.title"
        debugSubtitleId="slide04-3a.header.subtitle"
      />

      {/* Wrapper for govern container + footer */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '0 0 auto',
          gap: 0,
        }}
        data-debug-id="slide04-3a.content-wrapper"
      >
        {/* ═══ GOVERN — Large container panel encompassing all engines ═══ */}
        <GlassCard
          variant="blue"
          tone="dark"
          liquidGlass="premium"
          glassQuality="premium"
          flexContent
          style={{
            ...authorityDarkGlassStyle,
            borderRadius: 18,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
              padding: '22px 24px 24px',
              background: 'linear-gradient(170deg, rgba(59,130,246,0.06) 0%, rgba(59,130,246,0.02) 40%, rgba(14,22,38,0.38) 100%)',
            }}
            data-debug-id="slide04-3a.govern-container"
          >
            {/* ── Govern header row: Icon + Title + Proof + Signals ── */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 24,
              }}
            >
              {/* Left: Icon + Title + Proof */}
              <SlideIcon name={GOVERN_META.icon} glowColor="blue" size={64} variant="simple" renderMode="mask" style={{ flexShrink: 0 }} />
              <div style={{ flexShrink: 0 }}>
                <div
                  style={{
                    fontFamily: theme.typography.fontHeader,
                    fontSize: layout.engineNameSize,
                    fontWeight: 700,
                    color: theme.accent.blue,
                    textShadow: theme.textCrisp,
                    lineHeight: 1,
                  }}
                >
                  {governEngine.name}
                </div>
                <div
                  style={{
                    fontFamily: theme.typography.fontUi,
                    fontSize: layout.proofTextSize,
                    color: 'rgba(255,255,255,0.70)',
                    lineHeight: 1.3,
                    marginTop: 4,
                  }}
                >
                  {governContent.proof}
                </div>
              </div>

              {/* Right: Signals 2x2 grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px 20px',
                  flex: 1,
                  marginLeft: 60,
                }}
              >
                {governContent.signals.map((signal) => (
                  <div
                    key={signal.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <SlideIcon name={signal.icon} size={44} glowColor="blue" renderMode="mask" style={{ flexShrink: 0 }} />
                    <span
                      style={{
                        fontFamily: theme.typography.fontUi,
                        fontSize: layout.signalLabelSize,
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.85)',
                        lineHeight: 1.2,
                      }}
                    >
                      {signal.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Separator ── */}
            <div
              style={{
                height: 1,
                background: `linear-gradient(90deg, transparent 0%, ${theme.accent.blue}33 15%, ${theme.accent.blue}33 85%, transparent 100%)`,
              }}
            />

            {/* ═══ 3 Engine Cards — nested inside Govern ═══ */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
                gap: theme.spacing.space5,
              }}
              data-debug-id="slide04-3a.engines"
            >
              {TOP_ENGINES.map((meta) => {
                const engine = engines.find((e) => e.id === meta.id);
                if (!engine) return null;
                const content = ENGINE_CONTENT[meta.id];

                return (
                  <GlassCard
                    key={engine.id}
                    variant={meta.variant}
                    tone="dark"
                    liquidGlass="premium"
                    glassQuality="premium"
                    flexContent
                    style={{
                      gap: layout.engineCardGap,
                      padding: layout.engineCardPadding,
                      minHeight: 0,
                      flexShrink: v2Policy.card.cardFlexShrink,
                      ...authorityDarkGlassStyle,
                    }}
                    debugId={`slide04-3a.engine.${engine.id}`}
                  >
                    {/* Icon + Title row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
                      <SlideIcon name={meta.icon} glowColor={meta.glow} size={56} variant="simple" renderMode="mask" />
                      <div
                        style={{
                          fontFamily: theme.typography.fontHeader,
                          fontSize: layout.engineNameSize,
                          fontWeight: 700,
                          color: meta.color,
                          textShadow: theme.textCrisp,
                          lineHeight: 1,
                        }}
                      >
                        {engine.name}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div
                        style={{
                          fontFamily: theme.typography.fontUi,
                          fontSize: layout.proofTextSize,
                          color: 'rgba(255,255,255,0.70)',
                          textAlign: 'center',
                          lineHeight: 1.3,
                          minHeight: 58,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {content.proof}
                      </div>

                      {/* Signals — compact 2x2 grid */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: content.signals.length <= 2 ? '1fr' : '1fr 1fr',
                          gap: '10px 10px',
                          flex: 1,
                          alignContent: 'center',
                          marginTop: 15,
                        }}
                      >
                        {content.signals.map((signal) => (
                          <div
                            key={signal.label}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 7,
                            }}
                          >
                            <SlideIcon
                              name={signal.icon}
                              size={34}
                              glowColor={meta.glow}
                              renderMode="mask"
                              style={{ flexShrink: 0 }}
                            />
                            <span
                              style={{
                                fontFamily: theme.typography.fontUi,
                                fontSize: layout.signalLabelSize - 2,
                                fontWeight: 600,
                                color: 'rgba(255,255,255,0.85)',
                                lineHeight: 1.2,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {signal.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </GlassCard>

        {/* ═══ Architecture Principle Footer ═══ */}
        <div
          style={{
            marginTop: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            flexShrink: v2Policy.card.cardFlexShrink,
          }}
          data-debug-id="slide04-3a.architecture-footer"
        >
          {/* Badge label */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: theme.glassPremium.innerPanelBg,
              border: `1px solid ${theme.accent.blue}55`,
              borderRadius: 999, padding: '8px 24px 7px',
              boxShadow: `0 0 12px ${theme.accent.blue}18`,
            }}
          >
            <SlideIcon name="regulation-scale" size={36} glowColor="blue" renderMode="mask" />
            <span style={{
              fontFamily: theme.typography.fontMono,
              fontSize: layout.archPrincipleLabelSize,
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: theme.accent.blue,
              textTransform: 'uppercase' as const,
              textShadow: `${theme.textCrisp}, ${theme.neon.blue.sharper}`,
            }}>
              Architecture Principle
            </span>
          </div>
          {/* Principle chips */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {([
              { text: 'Deterministic models compute', icon: 'gear', glow: 'teal' as const },
              { text: 'GenAI explains', icon: 'explainability', glow: 'violet' as const },
              { text: 'Minimize user effort', icon: 'gear', glow: 'amber' as const },
              { text: 'Auditable analysis result', icon: 'compliance-badge', glow: 'blue' as const },
            ]).map((item) => (
              <div
                key={item.text}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: theme.glassPremium.innerPanelBg,
                  border: `1px solid ${theme.glassPremium.innerPanelBorder}`,
                  borderRadius: 12, padding: '10px 20px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.30)',
                }}
              >
                <SlideIcon name={item.icon} size={32} glowColor={item.glow} renderMode="mask" style={{ flexShrink: 0 }} />
                <span style={{
                  fontFamily: theme.typography.fontUi,
                  fontSize: layout.archPrincipleChipSize,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.90)',
                  whiteSpace: 'nowrap',
                  textShadow: theme.textCrisp,
                }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};
