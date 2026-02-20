import React, { useState, useEffect } from 'react';
import { Link } from '../router';
import { Button } from '@/design-system';

const PRESETS = ['minimal', 'glass', 'neon', 'aurora', 'terminal'] as const;
const PRESET_META: Record<string, { label: string; description: string }> = {
  minimal:  { label: 'Minimal',  description: 'Clean professional — no blur, no glow' },
  glass:    { label: 'Glass',    description: 'iOS-inspired frosted glass' },
  neon:     { label: 'Neon',     description: 'Poseidon signature glow style' },
  aurora:   { label: 'Aurora',   description: 'Maximum visual impact with stagger' },
  terminal: { label: 'Terminal', description: 'Bloomberg-style dense data' },
};

export const DesignSystemLanding: React.FC = () => {
  const [preset, setPreset] = useState<string>(
    () => document.documentElement.dataset.effectPreset || 'neon',
  );

  useEffect(() => {
    document.documentElement.dataset.effectPreset = preset;
  }, [preset]);

  return (
    <div style={{ minHeight: '100vh', padding: '48px 24px', color: 'rgba(255,255,255,0.92)' }}>
      <header style={{ maxWidth: 720, margin: '0 auto 48px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
          Poseidon Design System v2
        </h1>
        <p style={{ fontSize: 16, opacity: 0.7 }}>
          GenAI-Native Architecture — Schema-Driven Component Catalog
        </p>
      </header>

      <nav style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 48 }}>
        <Link to="/design-system/tokens" className="entry-btn entry-btn--primary">
          Tokens
        </Link>
        <Link to="/design-system/components" className="entry-btn entry-btn--ghost">
          Components
        </Link>
      </nav>

      <section style={{ maxWidth: 720, margin: '0 auto 48px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
          Effect Preset: <span style={{ color: 'var(--accent-cyan)' }}>{preset}</span>
        </h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {PRESETS.map((p) => (
            <Button
              key={p}
              onClick={() => setPreset(p)}
              variant="glass"
              engine="dashboard"
              size="sm"
              className={preset === p ? 'border-cyan-300/50 text-cyan-100' : 'text-white/80'}
            >
              {PRESET_META[p].label}
            </Button>
          ))}
        </div>
        <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 24 }}>
          {PRESET_META[preset]?.description}
        </p>

        <div
          style={{
            background: 'var(--ds-surface-bg)',
            border: '1px solid var(--ds-surface-border)',
            borderRadius: 'var(--ds-border-radius-surface, 16px)',
            backdropFilter: 'var(--ds-backdrop-filter)',
            boxShadow: 'var(--ds-surface-shadow)',
            padding: 24,
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
            Surface Demo Card
          </h3>
          <p style={{ fontSize: 14, opacity: 0.7 }}>
            This card responds to the active effect preset. Switch presets above to see
            changes in blur, glow, border, and shadow tokens.
          </p>
        </div>
      </section>
    </div>
  );
};

export default DesignSystemLanding;
