import type React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion-presets';
import { Surface } from '@/design-system';

interface EngineChip {
  name: string;
  color: string;
  status: string;
  confidence: number;
}

const engines: EngineChip[] = [
  { name: 'Protect', color: 'var(--engine-protect)', status: '0 threats in 24h', confidence: 0.94 },
  { name: 'Grow', color: 'var(--engine-grow)', status: '3 scenarios active', confidence: 0.89 },
  { name: 'Execute', color: 'var(--engine-execute)', status: '2 pending approvals', confidence: 0.91 },
  { name: 'Govern', color: 'var(--engine-govern)', status: 'All policies current', confidence: 0.97 },
];


export function EngineHealthStrip() {
  const [selected, setSelected] = useState(0);

  return (
    <motion.section
      className="engine-strip"
      variants={fadeUp}
      aria-label="Engine health status"
    >
      {engines.map((engine, i) => (
        <Surface
          key={engine.name}
          as="button"
          variant="glass"
          padding="md"
          className={`engine-chip ${i === selected ? 'engine-chip--active' : ''}`}
          onClick={() => setSelected(i)}
          aria-pressed={i === selected}
          type="button"
          style={{
            '--chip-color': engine.color,
            boxShadow: i === selected ? `0 0 16px ${engine.color}33, 0 0 4px ${engine.color}66` : undefined,
          } as React.CSSProperties}
        >
          <span className="engine-chip__dot" style={{ background: engine.color }} aria-hidden="true" />
          <span className="engine-chip__name">{engine.name}</span>
          <span className="engine-chip__sep" aria-hidden="true">|</span>
          <span className="engine-chip__status">{engine.status}</span>
          <span className="engine-chip__sep" aria-hidden="true">|</span>
          <span className="engine-chip__score" style={{ color: engine.color }}>{engine.confidence.toFixed(2)}</span>
        </Surface>
      ))}
    </motion.section>
  );
}
