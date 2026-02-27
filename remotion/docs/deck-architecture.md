# Poseidon Deck Architecture (V3 Production)

## 1. Canonical Slide Map (Composition ID -> Implementation)

Production V3 (12-slide export path):

| Composition ID | Implementation file |
|---|---|
| `Slide01TitleV3` | `src/v2/active/Slide01TitleV2.tsx` |
| `Slide02ProblemV3` | `src/v2/active/Slide02ProblemV2.tsx` |
| `Slide03WhyNowV3` | `src/v2/active/Slide03WhyNowV2.tsx` |
| `Slide04SolutionV3` | `src/v2/active/Slide04Solution3A.tsx` |
| `Slide05DifferentiationV3` | `src/v2/active/Slide05DifferentiationV2.tsx` |
| `Slide06BusinessV3` | `src/v2/active/Slide06BusinessV2.tsx` |
| `Slide07DemoV3` | `src/v2/active/Slide07DemoV2.tsx` |
| `Slide08SummaryV3` | `src/v2/active/Slide08SummaryV2.tsx` |
| `Slide09EpilogueV3` | `src/v2/active/Slide09EpilogueV2.tsx` |
| `Slide10AppendixV3` | `src/v2/active/Slide10AppendixV2.tsx` |
| `Slide11FinModelV3` | `src/v2/active/Slide11FinModelV2.tsx` |
| `Slide12QAV3` | `src/v2/active/Slide12QAV2.tsx` |

Compatibility and legacy variants:
- `src/v2/archive/*` keeps non-production variants and rollback candidates.
- `Slide02ProblemOptionB/C`, `Slide04SolutionV2`, `Slide07FinModelV2` are archived.

## 2. Shared Components and Responsibilities

Core shared contracts under `src/shared/`:

- `theme.ts`: design tokens (color, typography, glass, glow, spacing).
- `slideLayouts.ts`: per-slide layout constants + V2 policy constraints.
- `copy.ts`: canonical copy strings and labels.
- `SlideFrame.tsx`: artboard shell, safe area, footer, debug overlays.
- `SlideHeader.tsx`: common badge/title/subtitle rendering contract.
- `GlassCard.tsx`: glass surface behavior (`tone`, `glassQuality`, `liquidGlass`, `overflow`).
- `slideThemeColor.ts`, `backgroundPresets*.ts`: slide palette and background variant controls.
- `Tier3Background`, `DustMotes`, `SlideIcon`, `Connector`, `ChartLine`: reusable visual/effect primitives.

Change caution:
- Shared token/layout edits are global by default.
- `GlassCard` backdrop/overflow/radius combinations can trigger Chromium compositing artifacts in still renders.

## 3. Slide-Specific Boundary

Use this boundary to avoid accidental global regressions:

- Keep in `active/SlideXX...tsx` when behavior/layout is unique to one slide.
- Promote to `shared/` only when used in 2+ slides or when repeated implementation appears.
- Text should come from `copy.ts` unless the text is intentionally local to one variant experiment.

## 4. Fastest Single-Slide Change Flow

1. Identify the target composition in `src/Root.tsx`.
2. Open the mapped implementation in `src/v2/active/`.
3. Check imported shared contracts before editing (`theme`, `slideLayouts`, `GlassCard`, etc.).
4. Prefer slide-local fixes first; escalate to shared only if cross-slide consistency is required.
5. Render only the target composition for quick visual validation.
6. Run type/lint checks.
7. Re-run full pipeline only after local validation passes.

## 5. Output Commands and Validation Points

Run from `remotion/`.

### Static checks

```bash
npx tsc --noEmit
npx eslint src/ scripts/
node scripts/check-readability-gate.mjs
```

### PNG (master quality)

```bash
node scripts/render-all-slides.mjs --scale 3
```

Checks:
- 12 files generated: `out/v3-Slide*.png`
- Expected dimensions: `5760x3240`

### PPTX (master)

```bash
node scripts/gen-v3-pptx.js --image-format png --notes --alt-text
```

Output:
- `out/Poseidon_AI_MIT_CTO_V3_Visual_First.pptx`

### PDF (delivery target 10-12MB, Landing and /deck source of truth)

```bash
node scripts/gen-v3-pdf.mjs --output out/Poseidon_AI_MIT_CTO_V3_Visual_First.pdf --target-mb-min 10 --target-mb-max 12 --jpeg-quality-start 76
```

Output:
- `out/Poseidon_AI_MIT_CTO_V3_Visual_First.pdf`
- `public/Poseidon_AI_MIT_CTO_V3_Visual_First.pdf` (after copy)

Copy to web app:

```bash
npm run copy:deck-pdf:delivery
npm run check:deck-pdf:size
```

### PDF (web viewer target 12–18MB, higher visual quality)

Run from repo root:

```bash
npm run pdf:v3:web
npm run copy:deck-pdf:web
```

Output:
- `remotion/out/Poseidon_AI_MIT_CTO_V3_Visual_Web.pdf` (source)
- `public/Poseidon_AI_MIT_CTO_V3_Visual_Web.pdf` (served by web app)

Viewer contract:
- Landing Presentation button goes to `/deck`.
- `/deck` renders `Poseidon_AI_MIT_CTO_V3_Visual_First.pdf` (10-12MB delivery PDF).
- `..._Visual_Web.pdf` is optional for ad-hoc quality comparison only, not the default Landing contract.

Troubleshooting quality mismatch (`/deck` vs downloaded PDF):
- `/deck` uses `pdfjs` canvas rendering, so perceived quality depends on render scale and viewport width.
- Flicker root cause was full deck re-render triggered by mobile `resize` events while scrolling (address-bar collapse/expand).
- Current viewer policy is width-thresholded re-render (`WIDTH_CHANGE_THRESHOLD_PX`) + visible-page priority rendering.
- Tune these constants in `src/pages/DeckViewer.tsx`:
  - `QUALITY_BOOST`
  - `MIN_RENDER_SCALE`
  - `MOBILE_MAX_RENDER_SCALE`
  - `DESKTOP_MAX_RENDER_SCALE`
  - `PREVIEW_SCALE_MOBILE`
  - `PREVIEW_SCALE_DESKTOP`
  - `WIDTH_CHANGE_THRESHOLD_PX`
- Rendering strategy:
  - Pass1: idle preview render for non-visible pages
  - Pass2: high-quality render for visible pages and ±1 neighbor buffer
  - In-flight render tasks are canceled on rerun to avoid race/flicker.

### Full verification

```bash
node scripts/verify-pptx-pipeline.mjs --profile all
```

## 6. Archive Operations and Rollback Rules

Directory contract:
- `src/v2/active/`: only production-authoritative slide implementations.
- `src/v2/archive/`: legacy, alternatives, and experiments.

Rollback (archive -> active):
1. Move file(s) to `active/`.
2. Update `src/Root.tsx` mappings.
3. Update `scripts/render-all-slides.mjs` source map.
4. Update `scripts/verify-pptx-pipeline.mjs` source map.
5. Update readability targets if needed.
6. Re-render and verify.

Prohibited:
- Mixing `archive` files into production script maps without explicit rollback update.
- Updating only `Root.tsx` while leaving script source maps stale.

## 7. Frequent Mismatch Checklist

Before merge, confirm:

- `Slide04SolutionV3` points to the same implementation in `Root.tsx`, render script, and verify script.
- `Slide04SolutionV3Debug` points to the production implementation (`Slide04Solution3A`).
- `Slide02ProblemV3` has no runtime option switching; Option A is fixed.
- No production script points at archived files.

Quick grep helpers:

```bash
rg -n "Slide04SolutionV3|Slide02ProblemV3" src/Root.tsx scripts/render-all-slides.mjs scripts/verify-pptx-pipeline.mjs
rg -n "src/v2/archive" scripts/render-all-slides.mjs scripts/verify-pptx-pipeline.mjs
```
