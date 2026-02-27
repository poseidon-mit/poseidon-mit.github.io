/**
 * S6LoopClose — 27–30s (frames 810–900, local frame 0–90)
 * 4 real engine page screenshots in a 2×2 grid.
 * Light arc connects them in a loop, Poseidon.AI logo fades in.
 */
import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { theme } from '../../shared/theme';

const ENGINES = [
  { id: 'PROTECT', label: 'Protect',  color: theme.accent.emerald, file: 'protect.png' },
  { id: 'GROW',    label: 'Grow',     color: theme.accent.violet,  file: 'grow.png'    },
  { id: 'EXECUTE', label: 'Execute',  color: theme.accent.amber,   file: 'execute.png' },
  { id: 'GOVERN',  label: 'Govern',   color: theme.accent.blue,    file: 'govern.png'  },
] as const;

const GAP = 8;
const W = 1920;
const H = 1080;
const CELL_W = (W - GAP) / 2;
const CELL_H = (H - GAP) / 2;

// Grid cell top-left corners
const CELLS = [
  { x: 0,           y: 0 },          // PROTECT top-left
  { x: CELL_W + GAP, y: 0 },         // GROW top-right
  { x: 0,           y: CELL_H + GAP }, // EXECUTE bottom-left
  { x: CELL_W + GAP, y: CELL_H + GAP }, // GOVERN bottom-right
];

// Centers of each cell (for arc drawing)
const CENTERS = CELLS.map(c => ({
  x: c.x + CELL_W / 2,
  y: c.y + CELL_H / 2,
}));

// Clockwise arc order: PROTECT → GROW → GOVERN → EXECUTE → PROTECT
const ARC_ORDER = [0, 1, 3, 2, 0];

function buildArcPath(): string {
  const pts = ARC_ORDER.map(i => CENTERS[i]);
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cp = {
      x: (pts[i - 1].x + pts[i].x) / 2,
      y: (pts[i - 1].y + pts[i].y) / 2,
    };
    d += ` Q ${pts[i - 1].x} ${pts[i - 1].y} ${cp.x} ${cp.y}`;
  }
  d += ` Q ${pts[pts.length - 1].x} ${pts[pts.length - 1].y} ${pts[0].x} ${pts[0].y}`;
  return d;
}

export const S6LoopClose: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in/out
  const opacity = interpolate(frame, [0, 12, 78, 90], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Overall zoom-out effect
  const scale = interpolate(frame, [0, 60, 90], [1.06, 1.0, 0.97], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Each cell: staggered reveal springs
  const cellReveals = ENGINES.map((_, i) => {
    const revealSpring = spring({ frame: frame - i * 6, fps, config: { damping: 20, stiffness: 55 } });
    return {
      opacity: revealSpring,
      scale: interpolate(revealSpring, [0, 1], [0.95, 1]),
    };
  });

  // Cell label reveal
  const labelReveal = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Connecting arc: appears at frame 36, draws over 28 frames
  const arcProgress = interpolate(
    spring({ frame: frame - 36, fps, config: { damping: 22, stiffness: 40 } }),
    [0, 1], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Logo fades in at frame 58
  const logoOpacity = interpolate(frame, [58, 72], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Leading dot along arc
  let dotX = CENTERS[0].x;
  let dotY = CENTERS[0].y;
  let dotColor: string = ENGINES[0].color;
  if (arcProgress > 0.01 && arcProgress < 0.99) {
    const rawIdx = arcProgress * 4;
    const segIdx = Math.min(Math.floor(rawIdx), 3);
    const local = rawIdx - segIdx;
    const fromC = CENTERS[ARC_ORDER[segIdx]];
    const toC = CENTERS[ARC_ORDER[segIdx + 1]];
    dotX = fromC.x + (toC.x - fromC.x) * local;
    dotY = fromC.y + (toC.y - fromC.y) * local;
    dotColor = ENGINES[ARC_ORDER[segIdx]].color;
  }

  return (
    <AbsoluteFill
      style={{
        background: '#020410',
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        overflow: 'hidden',
      }}
    >
      {/* 2×2 grid of engine page screenshots */}
      {ENGINES.map((engine, i) => {
        const cell = CELLS[i];
        const { opacity: cellOp, scale: cellScale } = cellReveals[i];
        return (
          <div
            key={engine.id}
            style={{
              position: 'absolute',
              left: cell.x,
              top: cell.y,
              width: CELL_W,
              height: CELL_H,
              overflow: 'hidden',
              opacity: cellOp,
              transform: `scale(${cellScale})`,
              transformOrigin: 'center center',
            }}
          >
            <Img
              src={staticFile(`assets/screenshots/demo/${engine.file}`)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />

            {/* Engine color tint overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `${engine.color}08`,
              pointerEvents: 'none',
            }} />

            {/* Engine color border */}
            <div style={{
              position: 'absolute',
              inset: 0,
              border: `2px solid ${engine.color}44`,
              pointerEvents: 'none',
              boxShadow: `inset 0 0 32px ${engine.color}18`,
            }} />

            {/* Engine label badge */}
            <div style={{
              opacity: labelReveal,
              position: 'absolute',
              top: 16,
              left: 16,
              background: 'rgba(2,4,16,0.75)',
              border: `1px solid ${engine.color}55`,
              borderRadius: 20,
              padding: '4px 12px',
              fontSize: 11,
              color: engine.color,
              fontFamily: theme.typography.fontMono,
              fontWeight: 600,
              letterSpacing: '0.10em',
              backdropFilter: 'blur(8px)',
            }}>
              ▸ {engine.label.toUpperCase()}
            </div>
          </div>
        );
      })}

      {/* SVG connecting arc overlay */}
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'visible',
        }}
      >
        {/* Glow arc */}
        <path
          d={buildArcPath()}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={12}
          strokeDasharray={`${arcProgress * 4000} 4000`}
          strokeLinecap="round"
        />
        {/* Crisp arc */}
        <path
          d={buildArcPath()}
          fill="none"
          stroke="rgba(255,255,255,0.60)"
          strokeWidth={2}
          strokeDasharray={`${arcProgress * 4000} 4000`}
          strokeLinecap="round"
        />

        {/* Leading dot */}
        {arcProgress > 0.01 && arcProgress < 0.99 && (
          <>
            <circle cx={dotX} cy={dotY} r={8} fill={dotColor} opacity={0.9} />
            <circle cx={dotX} cy={dotY} r={18} fill={dotColor} opacity={0.25} />
          </>
        )}
      </svg>

      {/* Center logo overlay */}
      <div style={{
        opacity: logoOpacity,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{
          background: 'rgba(2,4,16,0.85)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 20,
          padding: '18px 36px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 0 60px rgba(0,240,255,0.12)',
        }}>
          <div style={{
            fontSize: 28,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.88)',
            letterSpacing: '-0.02em',
            fontFamily: theme.typography.fontUi,
          }}>
            Poseidon<span style={{ color: theme.accent.cyan }}>.</span>AI
          </div>
          <div style={{
            marginTop: 6,
            fontSize: 11,
            color: 'rgba(255,255,255,0.35)',
            fontFamily: theme.typography.fontMono,
            letterSpacing: '0.14em',
          }}>
            MIT CTO CAPSTONE 2026
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
