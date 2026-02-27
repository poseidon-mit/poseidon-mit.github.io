# V2 Archive Policy

This directory stores non-production slide variants and legacy implementations.

## Scope
- Deprecated variants retained for reference or rollback.
- Non-selected options (for example `Slide02ProblemOptionB/C`).
- Legacy implementations replaced in the active V3 pipeline (for example `Slide04SolutionV2`).

## Rules
- Do not reference files in this directory from V3 production scripts.
- Legacy composition IDs may still import archived files for compatibility/debug only.
- Any rollback must update all mapping points together:
  1. `src/Root.tsx` composition component mapping.
  2. `scripts/render-all-slides.mjs` source map.
  3. `scripts/verify-pptx-pipeline.mjs` source map.
  4. `scripts/check-readability-gate.mjs` target list if readability checks should include the restored file.

## Rollback Workflow
1. Move selected file(s) from `archive/` to `active/`.
2. Update imports and composition mappings.
3. Re-render affected slide PNG(s).
4. Run `npm run verify:source && npm run verify:png && npm run verify:pptx`.
