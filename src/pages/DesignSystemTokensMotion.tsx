import React, { useState } from 'react';
import { Link } from '../router';
import { Button } from '@/design-system';

const durations = [
  { label: 'Fast', token: '--motion-fast', value: '120ms' },
  { label: 'Base', token: '--motion-base', value: '200ms' },
  { label: 'Slow', token: '--motion-slow', value: '320ms' },
];

const easings = [
  { label: 'Standard',   token: '--ease-standard',   value: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
  { label: 'Emphasized', token: '--ease-emphasized', value: 'cubic-bezier(0.2, 0, 0, 1)' },
];

const entries = ['fadeUp', 'fade', 'stagger', 'none'] as const;

export const DesignSystemTokensMotion: React.FC = () => {
  const [playing, setPlaying] = useState<string | null>(null);

  const play = (id: string) => {
    setPlaying(null);
    requestAnimationFrame(() => setPlaying(id));
  };

  return (
    <div style={{ minHeight: '100vh', padding: '48px 24px', color: 'rgba(255,255,255,0.92)' }}>
      <header style={{ maxWidth: 720, margin: '0 auto 40px' }}>
        <Link to="/design-system/tokens" style={{ fontSize: 13, opacity: 0.5, textDecoration: 'none', color: 'inherit' }}>
          Tokens
        </Link>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>Motion Tokens</h1>
      </header>

      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Durations</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {durations.map((d) => (
              <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ width: 80, fontSize: 14, fontWeight: 500 }}>{d.label}</span>
                <span style={{ fontSize: 13, fontFamily: 'monospace', opacity: 0.5, width: 60 }}>{d.value}</span>
                <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                  <div
                    key={playing === d.label ? 'a' : 'b'}
                    style={{
                      height: '100%', background: 'var(--accent-cyan)', borderRadius: 2,
                      width: playing === d.label ? '100%' : '0%',
                      transition: playing === d.label ? `width ${d.value} ease-out` : 'none',
                    }}
                  />
                </div>
                <Button type="button" onClick={() => play(d.label)} variant="glass" engine="dashboard" size="sm" className="rounded-md text-xs">
                  Play
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Easings</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {easings.map((e) => (
              <div key={e.label} style={{ padding: '12px 16px', background: 'var(--ds-surface-bg)', border: '1px solid var(--ds-surface-border)', borderRadius: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{e.label}</div>
                <div style={{ fontSize: 12, fontFamily: 'monospace', opacity: 0.5 }}>{e.value}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Animation Entries</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {entries.map((e) => (
              <div key={e} style={{ padding: '8px 16px', fontSize: 13, fontFamily: 'monospace', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}>
                {e}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, opacity: 0.4, marginTop: 12 }}>
            Set via --ds-animation-entry per effect preset.
          </p>
        </section>
      </div>
    </div>
  );
};

export default DesignSystemTokensMotion;
