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
│   └── dashboard/    ← v0 Dashboard sub-components (HeroSection, KpiGrid, etc.)
├── legacy/           ← ⛔ ARCHIVED — do NOT import from here in v0 pages
│   └── components/   ← 135 legacy domain components (TrustIndexCard, NetWorthHero, etc.)
├── design-system/    ← DS v2 internals (72 components) — do NOT modify directly
├── styles/
│   ├── layers/       ← Layer 1 + Layer 2 CSS
│   └── effects/      ← Glass + Neon utility classes
├── lib/              ← utils.ts, engine-tokens.ts, motion-presets.ts
└── hooks/            ← use-engine-theme.ts, use-reduced-motion.ts
```

## v0 → Production Adaptation (Poseidon化) Rules

When integrating v0 output, apply **only** minimal adaptations. Do NOT alter v0's layout or content.

### Required adaptations:

1. **Import fix**: `next/image` → `<img>`, `next/link` → router `<Link>`, remove `"use client"`
2. **Path fix**: `@/components/ui/*` → verify import paths match project structure
3. **Verify Layer 1**: shadcn/ui classes should render correctly (dark theme, colors)
4. **GovernFooter**: Add `<GovernFooter />` at page bottom (Tier 1-2 pages only, if not already present)
5. **Mobile**: Verify 375px layout, touch targets ≥44px

### Prohibited:

- **Do NOT import from `src/legacy/`** — archived legacy components, never use in v0 pages
- **Do NOT import from `src/design-system/` directly** — use `components/poseidon/` facades
- **Do NOT add old content** — never import or re-create old components (TrustIndexCard, NetWorthHero, RiskScoreDial, ScoreRing, etc.) inside v0-generated pages
- **Do NOT wrap with PageShell** — v0 pages are self-contained, no old layout wrappers
- **Do NOT add old context dependencies** — v0 pages should not depend on old context providers
- **Do NOT add glass/neon/engine decorations** unless v0 output already includes them

### v0 Merge Safety

v0 は単体アプリとして出力するため、PR マージ時に以下が上書きされていないことを確認:
- `src/main.tsx` — ルーター (MinimalApp + RouterProvider) が残っていること
- `src/styles/tailwind.css` — `@import 'tailwindcss'` + `@theme inline` が残っていること
- `src/router/lazyRoutes.ts` — 全 Tier 1 ルートが残っていること

CI テスト `src/__tests__/infra-integrity.test.ts` が自動検証する。

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
- **v0 output is authoritative** — preserve v0-generated layout/content as-is
- **Never add old components** to v0 pages (no PageShell, no old context providers, no old data visualizations)
- v0 pages go into `src/pages/` directly as self-contained components
- v0 primitives go into `components/ui/`, composites into `components/blocks/`

### New Page Requirements (App Shell routes)

Every page under AppNavShell (27+ routes) **must** include:

1. **GovernFooter** — `<GovernFooter auditId={GOVERNANCE_META['/path'].auditId} pageContext={GOVERNANCE_META['/path'].pageContext} />`
2. **Motion presets** — `import { fadeUp, staggerContainer } from '@/lib/motion-presets'` (ローカル定義禁止)
3. **Engine color tokens** — hex 直書き禁止。`var(--engine-*)` または `engineTokens[engine].*Class` を使用
4. **AuroraPulse** — サブページは `<AuroraPulse color="var(--engine-*)" intensity="subtle" />`
5. **governance-meta.ts** — 新規ルートは `src/lib/governance-meta.ts` にエントリ追加必須

## Tech Stack

- React 19 + TypeScript 5.9 + Vite 7
- Tailwind CSS 4.1 + shadcn/ui (new-york style)
- Framer Motion 12 + Recharts 3.7
- Radix UI primitives + class-variance-authority
- pdfjs-dist 5 (DeckViewer)
