# v0-poseidon

Poseidon.AI — AI-powered personal finance guardian (MIT CTO Program Capstone Project).

## Runtime Policy

- Frontend runtime is **Vite-only**.
- Canonical route components live in `src/pages/`.
- Next.js assets are archived under `legacy/next/` and are excluded from active build/test flows.
- Package manager is **npm** (`package-lock.json` is authoritative).

## Overview

Poseidon.AI is a unified AI backbone for personal finance that combines governance-first compliance, deterministic ML models, GenAI explanations, and consent-based execution. This repository contains the interactive prototype and pitch deck source.

## Repository Structure

```
poseidon-mit.github.io/
├── src/                  # React + Vite prototype app (36 screens)
│   ├── pages/            # Screen components
│   ├── components/       # Shared UI components
│   ├── design-system/    # Design tokens & system
│   └── ...
├── remotion/             # Pitch deck rendering pipeline
│   ├── src/v2/           # Active slide components (11 slides)
│   ├── src/shared/       # Shared theme, GlassCard, icons, visuals
│   ├── scripts/          # Render & PPTX generation scripts
│   └── out/              # Rendered PNGs + PPTX output
├── public/               # Static assets (PWA manifest, icons)
└── docs/                 # Documentation
```

## Prototype App

Interactive React SPA showcasing all 36 screens of the Poseidon.AI experience.

```bash
npm install
npm run dev        # Start dev server
npm run build      # Production build
npm test           # Run tests
```

Common quality gates:

```bash
npm run guard:vite-only
npm run typecheck
npm run test:run
npm run check:contracts
npm run check:target-contracts
npm run check:design-system
npm run check:a11y-structure
npm run check:inline-style-hex
```

## CI/CD

- Deploy workflow: `.github/workflows/deploy.yml`
  - Builds Vite app and deploys `dist/` to GitHub Pages (main branch only)
  - Includes Vite preview smoke check before artifact upload
- CI workflow: `.github/workflows/ci.yml`
  - PR/dispatch validation: guard, typecheck, tests, contract gates, design-system gates, build
- UX workflow: `.github/workflows/ux-quality.yml`
  - PR split jobs (`ux-pr-fast`, `ux-pr-visual`) for faster feedback
  - Nightly non-blocking UX scan/report with summary output

To include the pitch deck PDF on the site (e.g. for `/deck` and download), copy it into `public/` before building:

```bash
npm run copy:deck-pdf   # copies remotion/out/Poseidon_AI_MIT_CTO_V3_Visual_First.pdf → public/
npm run build
```

**Tech stack:** React 19, Vite, Tailwind CSS v4, Framer Motion, Recharts, Lucide Icons

## Pitch Deck (Remotion)

11-slide visual-first pitch deck with quality-first export profiles:
- `master`: scale-3 PNG (`5760x3240`) + PNG-embedded PPTX
- `delivery`: target-sized PDF (`10-13MB`) and optional JPEG-embedded PPTX

```bash
cd remotion
npm install
npm start                          # Remotion Studio preview
node scripts/build-v3-exports.mjs  # Master PNG + master PPTX + delivery PDF
node scripts/gen-v3-pptx.js        # Master PPTX (PNG images, notes on by default)
node scripts/gen-v3-pptx.js --image-format jpeg --jpeg-quality 82 --notes --alt-text # Optional delivery PPTX
```

**Slides:** Title, Problem, Why Now, Solution, Differentiation, Business/Roadmap, Demo, Summary, Epilogue, Appendix, Financial Model

**Design system:** 8-layer premium glass cards, Tabler-based SVG icons, neon text effects, Tier3 animated backgrounds

## Team

MIT CTO Program — Poseidon Team

## License

Private — MIT CTO Program Capstone
