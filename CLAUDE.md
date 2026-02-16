# Poseidon.AI — Claude Code Guide

## Architecture B: v0 Foundation + Poseidon Expression Layer

This project uses a **2-layer CSS architecture** for v0 integration:

- **Layer 1** (`src/styles/layers/shadcn.css`): shadcn/ui standard CSS variables — v0 output works as-is
- **Layer 2** (`src/styles/layers/poseidon.css`): Poseidon extension tokens (engine colors, glass morphism, neon effects)

## Directory Map

```
src/
├── components/
│   ├── ui/           ← v0 drop-in zone (shadcn/ui primitives)
│   ├── blocks/       ← v0-generated composite blocks (post-adaptation)
│   ├── poseidon/     ← Poseidon facade components (GlassCard, EngineBadge, etc.)
│   ├── layout/       ← Structural wrappers (AppShell, PageShell, Section)
│   └── ...           ← Existing domain components (100+)
├── design-system/    ← DS v2 internals (72 components) — do NOT modify directly
├── styles/
│   ├── layers/       ← Layer 1 + Layer 2 CSS
│   └── effects/      ← Glass + Neon utility classes
├── lib/              ← utils.ts, engine-tokens.ts, motion-presets.ts
└── hooks/            ← use-engine-theme.ts, use-reduced-motion.ts
```

## v0 → Production Adaptation Checklist

When integrating v0 output, follow these steps:

1. **Import fix**: `next/image` → `<img>`, `next/link` → `<a>` or react-router `<Link>`
2. **Verify Layer 1**: shadcn/ui classes should render correctly (dark theme, colors)
3. **Glass morphism**: Wrap cards with `<GlassCard>` or add `glass-surface` class
4. **Engine colors**: Add `engine` prop to `<EngineBadge>`, `<GlassCard>`, `<Section>`
5. **GovernFooter**: Add `<GovernFooter />` at page bottom (Tier 1-2 pages)
6. **ProofLine**: Inject `<ProofLine source="..." confidence={85} />` in data cards
7. **Animations**: Use presets from `@/lib/motion-presets` (fadeUp, staggerContainer)
8. **Sparkline/ScoreRing**: Replace plain numbers with `<Sparkline>` or `<ScoreRing>`
9. **Mobile**: Verify 375px layout, touch targets ≥44px
10. **Accessibility**: Contrast ratio, keyboard nav, aria-labels

## Key Imports

```tsx
// Poseidon facade components
import { GlassCard, EngineBadge, ScoreRing, GovernFooter, ProofLine, NeonText, Sparkline } from '@/components/poseidon'

// Layout wrappers
import { PageShell, Section } from '@/components/layout'

// Engine utilities
import { type EngineName, getEngineToken } from '@/lib/engine-tokens'
import { useEngineTheme } from '@/hooks/use-engine-theme'

// Motion presets
import { fadeUp, staggerContainer, staggerItem, pageTransition } from '@/lib/motion-presets'
```

## Engine Color System

| Engine | Color | CSS Variable | Usage |
|--------|-------|-------------|-------|
| Dashboard | Cyan `#00F0FF` | `--engine-dashboard` | Overview screens |
| Protect | Green `#22C55E` | `--engine-protect` | Threat detection |
| Grow | Violet `#8B5CF6` | `--engine-grow` | Forecasts, goals |
| Execute | Amber `#EAB308` | `--engine-execute` | Approval queues |
| Govern | Blue `#3B82F6` | `--engine-govern` | Audit, compliance |

## CSS Utility Classes

```css
/* Glass morphism */
.glass-surface          /* Standard glass card */
.glass-surface-strong   /* Heavier glass */
.glass-surface-card     /* Full card treatment with inset + shadow */

/* Neon glow (engine-mapped) */
.neon-glow-protect      /* Green glow */
.neon-glow-grow         /* Violet glow */
.neon-glow-execute      /* Amber glow */
.neon-glow-govern       /* Blue glow */

/* Neon text */
.neon-text-cyan         /* Cyan text glow */
.neon-text-violet       /* Violet text glow */
```

## Rules

- **Never modify** files in `src/design-system/` directly — use `components/poseidon/` facades
- **Always add GovernFooter** to Tier 1-2 pages (dashboard, protect, execute, govern, grow)
- **Use PageShell** for consistent page structure: `<PageShell engine="protect" hero={...}>`
- **Prefer existing DS v2** components via facades over creating new ones
- v0 output goes into `components/ui/` (primitives) or `components/blocks/` (composites)

## Tech Stack

- React 19 + TypeScript 5.4 + Vite 5.2
- Tailwind CSS 4.1 + shadcn/ui (new-york style)
- Framer Motion 12 + Recharts 3.7
- Radix UI primitives + class-variance-authority
