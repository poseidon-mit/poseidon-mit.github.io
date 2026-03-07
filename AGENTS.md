# Poseidon.AI — Codex Guide

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
- Active frontend toolchain is Vite-only; do not introduce `next/*` imports into active app code

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



## Workflow Orchestration

### 1. Plan Node Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately – don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes – don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests – then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.