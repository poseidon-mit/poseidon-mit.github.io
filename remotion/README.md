# Remotion — High-Quality PNG Stills + Canonical Video

> The HTML + Playwright export pipeline is deprecated (`slides/DEPRECATED.md`); this Remotion workspace is the single source for every PPTX PNG. See `docs/overview/high-level-summary.md` for the current enforcement plan.

Poseidon uses Remotion to render **high-quality PNG stills** for the Opening, Demo30s keyframe, and the active 11-slide V3 deck (`Slide01TitleV3` … `Slide11FinModelV3`). All slides achieve full visual fidelity with the HTML/CSS slides (aurora, vignette, glass, neon, icon glow, gradient text). Remotion also provides the **canonical 30s video** pipeline (`VideoMasterWWDCv4`) and its vertical counterpart.

**Clean setup:** This repo does not copy intermediate files from other Remotion projects. Only the minimal source files listed in [docs/mit-capstone/plan/mit-capstone-remotion-dual-support-plan.md](../docs/mit-capstone/plan/mit-capstone-remotion-dual-support-plan.md) are used, so no past-project styles or caches are forced.

## Scope

- **In scope:** `renderStill()` / `npx remotion still` → PNG output. Active 9 slides + Opening + Demo30s + chart/demo compositions.
- **In scope (video):** `npx remotion render` → MP4 output. Canonical video: `VideoMasterWWDCv4` (16:9) and `VideoVertical9x16` (9:16).

## Setup

```bash
cd remotion
npm install
npm run copy-assets   # copies ../../docs/assets -> public/assets
```

## Compositions

| Id | Description |
|----|-------------|
| Opening | Title + subtitle + engine pills. Aurora + vignette; neon text; SVG icon glow. |
| Demo30s | 30-second demo keyframe (Protect → Grow → Execute → Govern flow). Aurora + vignette; neon. |
| Slide01Title | Title — The Guardian Arrives. |
| Slide02Problem | The Coordination Gap. |
| Slide03WhyNow | Why Now — Three Forces Converging. |
| Slide04Solution | The Unified AI Backbone. |
| Slide05Differentiation | Beyond Aggregation. |
| Slide06Business | Roadmap & Governance. |
| Slide07Demo | Introduction Video. |
| Slide08Summary | Summary. |
| Slide09Epilogue | Tough, and Totally Worth It. |
| ChartDemo | Legacy chart demo (custom charts). |
| HighFidelityDemo | High-fidelity visual demo. |
| ChartSpecDemo | Shared chart spec demo (line + stacked area). |
| ChartVerification | Chart spec verification. |
| VideoMasterWWDCv4 | **Canonical** 30s video (16:9). |
| VideoMaster30s | Alias of canonical 30s video (16:9). |
| VideoVertical9x16 | Canonical vertical 30s video (9:16). |
| VideoMasterV5 | Scratch-built v5 composition (16:9) for new explorations. |
| LogoFavicon, LogoAppIcon, LogoStandard, LogoWordmark, LogoPrint, LogoTridentOnly | Logo export targets (various sizes). |

Legacy (not rendered to PPTX) slide components are stored in `src/legacy/slides/`.
Legacy video sources are stored in `src/legacy/video/` and are not registered in `Root.tsx`.

All slide/demo compositions: **1920×1080**, 30fps, 1 frame (still output). Video compositions: **30s @ 30fps** (16:9 and 9:16).

For deck exports, the V3 pipeline renders and packages 11 slides (`Slide01TitleV3` ... `Slide11FinModelV3`) via `scripts/render-all-slides.mjs`.

## Tier3 Visual System

All active slides use the `Tier3Background` component for high-fidelity background visuals.

### Visual Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `VisualHexMesh` | `src/shared/visuals/tier3/VisualHexMesh.tsx` | Hexagonal mesh grid with pulsing nodes |
| `VisualCircuit` | `src/shared/visuals/tier3/VisualCircuit.tsx` | Manhattan-path circuit traces with traveling pulses |
| `VisualHoloGlobe` | `src/shared/visuals/tier3/VisualHoloGlobe.tsx` | 3D orthographic globe with city markers |
| `VisualParticleField` | `src/shared/visuals/tier3/VisualParticleField.tsx` | Ambient particle dots with pulsing opacity |
| `VisualDataFlow` | `src/shared/visuals/tier3/VisualDataFlow.tsx` | Bezier-connected data flow nodes |
| `VisualWaveform` | `src/shared/visuals/tier3/VisualWaveform.tsx` | Layered sinusoidal waveform |

### Chart Components

| Component | Location | Used In |
|-----------|----------|---------|
| `ChartLine` | `src/shared/charts/ChartLine.tsx` | Slide07 (growth + revenue) |
| `ChartBar` | `src/shared/charts/ChartBar.tsx` | Slide08 (user scaling) |
| `ChartPie` | `src/shared/charts/ChartPie.tsx` | Slide02 (cost breakdown) |
| `VisualGlowingChart` | `src/shared/visuals/VisualGlowingChart.tsx` | Slide09 (quality metrics) |
| `ChartGlowDefs` | `src/shared/charts/ChartGlowDefs.tsx` | Shared SVG filters (all charts) |

### Tier3Background

Wrapper component that renders full-bleed visuals behind slide content:
- Escapes SlideFrame margins (`left: -120, top: -80, width: 1920, height: 1080`)
- Supports: `hexmesh`, `circuit`, `globe`, `particles`, `dataflow`, `waveform`
- `zIndex: 0` (content at `zIndex: 1`)

## Commands

- **From repo root:** `npm run lint` (ESLint on `remotion/src/`), `npm run typecheck` (TypeScript check).
- **Preview:** `npm start` (opens Remotion Studio).
- **Render one still (from remotion/):**
  ```bash
  npx remotion still src/index.ts Opening ../output/remotion/opening.png
  npx remotion still src/index.ts Demo30s ../output/remotion/demo30s-keyframe.png
  npx remotion still src/index.ts Slide01Title ../output/remotion/slide-01-title.png
  ```
- **Batch render active V3 slides (default scale=2):**
  ```bash
  node scripts/render-all-slides.mjs
  ```
  Renders 11 V3 slides to `out/v3-*.png`. Use `--scale 3` for quality-first master output (`5760x3240`).
- **Build quality-first master exports in one command:**
  ```bash
  node scripts/build-v3-exports.mjs
  ```
  Generates scale-3 master PNG + master PPTX + delivery PDF (`10-13MB` target by default).
- **Build V3 master PPTX from rendered slides (PNG embedding default):**
  ```bash
  node scripts/gen-v3-pptx.js
  ```
  Writes `out/Poseidon_AI_MIT_CTO_V3_Visual_First.pptx` and updates `out/LATEST_V3_PPTX.txt`.
- **Build delivery PPTX (JPEG embedding):**
  ```bash
  node scripts/gen-v3-pptx.js --image-format jpeg --jpeg-quality 82 --notes --alt-text
  ```
- **Build delivery PDF with adaptive quality search:**
  ```bash
  node scripts/gen-v3-pdf.mjs --target-mb-min 10 --target-mb-max 13
  ```
- **Optional — set default “fit window” viewer preferences** (for viewers that respect document metadata; from repo root):
  ```bash
  npm run set-pdf-viewer-prefs
  ```
- **Verify master + delivery artifacts:**
  ```bash
  node scripts/verify-pptx-pipeline.mjs --profile all --delivery
  ```
- These PNGs are now the canonical exports for the deck; the former Playwright route has been retired (see `slides/DEPRECATED.md` for the archived workflow).
- **High-quality still:** For production or print, prefer `--scale 3` (`5760×3240`) for deck exports.
  ```bash
  npm run still:2x -- src/index.ts Opening ../output/remotion/opening.png
  ```
- **From repo root:** `npm run remotion:still -- Opening ../output/remotion/opening.png` (1x).
  `npm run remotion:still:2x -- Opening ../output/remotion/opening.png` (2x).
  `npm run remotion:charts` (batch charts to `output/charts/`).
  Pass composition id and output path after `--`.
- **Video render (from repo root):**
  ```bash
  npm run render:video
  npm run render:video:vertical
  npm run render:video:all
  ```
  Outputs to `output/video/`.
  If Chromium fails to launch (e.g., MachPortRendezvous permission errors on macOS), try:
  ```bash
  REMOTION_DISABLE_CHROMIUM_SANDBOX=1 npm run render:video
  ```
  You can also pass a system Chrome path via `REMOTION_BROWSER_EXECUTABLE`, set `REMOTION_CHROME_MODE` (e.g. `chrome-for-testing` or `headless-shell`), and add extra CLI args via `REMOTION_RENDER_ARGS`.

## Shared Resources

- **Theme:** `src/shared/theme.ts` — aligned with `slides/css/tokens.css`. Includes background, aurora, vignette, glass (backdrop, overlay, sheen, rim-light), neon (5 colors × standard/deep), iconGlow, gradientText, complianceBadge, warningBadge, spacing, typography.
- **Copy:** `src/shared/copy.ts` — text for Opening, Demo30s, and active slides (titles, subtitles, stats, engines, points, phases, team, footer).
- **Shared components:** SlideFrame (aurora + vignette + grain + content + footer), GlassCard (sheen, rim-light, overlay, variant borders, optional LiquidGlassLayer), EnginePill (SVG icon + theme iconGlow), StatCard (neon value), SlideIcon, ComplianceBadge, NeonText, WarningBadge, LiquidGlassLayer.
- **New components:** `TimelineHorizontal`, `ComparisonTable`, `RevenueStreamRow`, and `TeamCard` supply the timeline strip, comparison table, revenue streams, and team layout details that were previously only in HTML. They render against the same token system so Remotion fully owns the final look.
- **Icons:** `src/shared/icons/*.tsx` — IconTrident, IconShield, IconGrowth, IconLightning, IconGovernance, IconBrain, IconSupport, IconVault, IconPulse.
- **Visuals:** `src/shared/visuals/*.tsx` — ShapeGrid, ShapeHalo, ShapeOrbit, VisualWealthWave, VisualWireframe, VisualGlowingChart, and tier3 visuals (VisualCircuit, VisualHexMesh, VisualHoloGlobe).
- **Charts:** `src/shared/charts/*.tsx` — ChartLine, ChartBar, ChartPie, ChartGlowDefs.
- **Assets:** `public/assets/` is populated by `npm run copy-assets` from `docs/assets` (SVG icons/shapes). Use `staticFile('assets/svg/icons/icon-shield.svg')` in components. This folder is gitignored (generated).

## Output

- **Individual stills** (via `npx remotion still` or `npm run remotion:still`): output to `output/remotion/` (sibling of `output/png/`).
- **Batch rendering** (via `render-all-slides.mjs`): outputs to `out/v3-*.png` (11-slide V3 set).
- **Master V3 PNG set** (`out/v3-*.png`): produced by `render-all-slides.mjs --scale 3` and consumed by `gen-v3-pptx.py`.
- **Master PPTX assembly** (`gen-v3-pptx.py` / `gen-v3-pptx.js`): outputs `out/Poseidon_AI_MIT_CTO_V3_Visual_First.pptx` with PNG embedding.
- **Delivery PPTX assembly** (`gen-v3-pptx.py` / `gen-v3-pptx.js --image-format jpeg`): outputs `out/Poseidon_AI_MIT_CTO_V3_Visual_First_Delivery.pptx`.
- **Delivery PDF assembly** (`gen-v3-pdf.mjs`): outputs `out/Poseidon_AI_MIT_CTO_V3_Visual_First.pdf`.
- **Video rendering** (via `render-video.mjs` or `npm run render:video*`): outputs to `output/video/`.

All output folders are under `output/` and are gitignored.

## References

- [docs/remotion.md](../docs/remotion.md) — Entry point: purpose, quick links, summary.
- [docs/mit-capstone/specs/remotion-still-spec.md](../docs/mit-capstone/specs/remotion-still-spec.md) — Full capability spec.
- [docs/mit-capstone/plan/mit-capstone-remotion-dual-support-plan.md](../docs/mit-capstone/plan/mit-capstone-remotion-dual-support-plan.md) — Implementation plan and clean Remotion policy.
- [docs/overview/high-level-summary.md](../docs/overview/high-level-summary.md) — Remotion-only pipeline assurance; links to `slides/DEPRECATED.md`.

## What We Don't Copy

We do not bring in from other repos: `.remotion/`, `node_modules/`, build output, template-specific config (Lambda, Cloud Run, recording presets), or global styles that would force a video look. See the plan doc for the full list.
