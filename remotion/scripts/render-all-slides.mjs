/**
 * Render selected deck slides using Remotion (parallel, programmatic API).
 * Usage: node scripts/render-all-slides.mjs [--fast] [--scale <n>] [--no-cache-clear] [--incremental] [--concurrency <n>]
 *
 * Options:
 *   --fast            Render at scale=1 (1920x1080) for quick iteration
 *   --scale <n>       Explicit scale factor (default: 3 for 5760x3240 master; use 1 for fast)
 *   --no-cache-clear  Skip clearing the Remotion bundle cache
 *   --incremental     Skip slides whose source files have not changed (SHA-256 cache)
 *   --concurrency <n> Max parallel renders (default: 3)
 *
 * Output: remotion/out/v3-{CompositionId}.png  (unified output directory)
 */

import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { mkdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { needsRender, updateHash } from './render-cache.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const outputDir = join(rootDir, 'out');
const args = process.argv.slice(2);

// ── CLI flags ────────────────────────────────────────────────
const fast = args.includes('--fast');
const noCacheClear = args.includes('--no-cache-clear');
const incremental = args.includes('--incremental');

const scaleIdx = args.indexOf('--scale');
const scale = fast ? 1 : (scaleIdx !== -1 ? Number(args[scaleIdx + 1]) : 3);

const concurrencyIdx = args.indexOf('--concurrency');
const concurrency = concurrencyIdx !== -1 ? Number(args[concurrencyIdx + 1]) : 3;

// ── Slide definitions ────────────────────────────────────────
const slides = [
    { id: 'Slide01TitleV3', source: 'src/v2/Slide01TitleV2.tsx' },
    { id: 'Slide02ProblemV3', source: 'src/v2/Slide02ProblemV2.tsx' },
    { id: 'Slide03WhyNowV3', source: 'src/v2/Slide03WhyNowV2.tsx' },
    { id: 'Slide04SolutionV3', source: 'src/v2/Slide04SolutionV2.tsx' },
    { id: 'Slide05DifferentiationV3', source: 'src/v2/Slide05DifferentiationV2.tsx' },
    { id: 'Slide06BusinessV3', source: 'src/v2/Slide06BusinessV2.tsx' },
    { id: 'Slide07DemoV3', source: 'src/v2/Slide07DemoV2.tsx' },
    { id: 'Slide08SummaryV3', source: 'src/v2/Slide08SummaryV2.tsx' },
    { id: 'Slide09EpilogueV3', source: 'src/v2/Slide09EpilogueV2.tsx' },
    { id: 'Slide10AppendixV3', source: 'src/v2/Slide10AppendixV2.tsx' },
    { id: 'Slide11FinModelV3', source: 'src/v2/Slide11FinModelV2.tsx' },
];

// ── Main ─────────────────────────────────────────────────────
async function main() {
    mkdirSync(outputDir, { recursive: true });

    // Cache clear
    if (!noCacheClear && !incremental) {
        const cacheDir = join(rootDir, 'node_modules', '.cache');
        rmSync(cacheDir, { recursive: true, force: true });
        console.log('Cleared Remotion bundle cache.');
    } else {
        console.log('Skipping cache clear.');
    }

    // Filter slides needing render
    const toRender = [];
    let skipped = 0;

    for (const [index, slide] of slides.entries()) {
        if (incremental && !needsRender(slide.id, slide.source)) {
            skipped++;
            console.log(`[${index + 1}/${slides.length}] SKIP  ${slide.id} (unchanged)`);
        } else {
            toRender.push({ ...slide, index });
        }
    }

    if (toRender.length === 0) {
        console.log(`Done: 0 rendered, ${skipped} skipped (scale=${scale}).`);
        return;
    }

    const resolution = scale === 1 ? '1920x1080' : `${1920 * scale}x${1080 * scale}`;
    console.log(`\nBundling Remotion project...`);

    // Bundle once, share across all renders
    const bundled = await bundle(join(rootDir, 'src/index.ts'), () => undefined, {
        webpackOverride: (config) => config,
    });

    console.log(`Rendering ${toRender.length} slides at scale=${scale} (${resolution}), concurrency=${concurrency} ...\n`);

    // Render in chunks of `concurrency`
    let rendered = 0;
    const errors = [];

    for (let i = 0; i < toRender.length; i += concurrency) {
        const chunk = toRender.slice(i, i + concurrency);

        // Log start for each slide in chunk
        for (const slide of chunk) {
            console.log(`[${slide.index + 1}/${slides.length}] Rendering ${slide.id} ...`);
        }

        const results = await Promise.allSettled(
            chunk.map(async (slide) => {
                const start = Date.now();
                const outPath = join(outputDir, `v3-${slide.id}.png`);

                const composition = await selectComposition({
                    serveUrl: bundled,
                    id: slide.id,
                    inputProps: {},
                });

                await renderStill({
                    composition,
                    serveUrl: bundled,
                    output: outPath,
                    imageFormat: 'png',
                    scale,
                });

                updateHash(slide.id, slide.source);
                const elapsed = ((Date.now() - start) / 1000).toFixed(1);
                return { slide, elapsed };
            }),
        );

        // Process results
        for (const result of results) {
            if (result.status === 'fulfilled') {
                const { slide, elapsed } = result.value;
                rendered++;
                console.log(`[${slide.index + 1}/${slides.length}] OK    ${slide.id} (${elapsed}s)`);
            } else {
                const reason = result.reason;
                // Extract slide id from error context
                const failedSlide = chunk.find((s) => {
                    const msg = reason?.message || '';
                    return msg.includes(s.id);
                }) || chunk[results.indexOf(result)];
                const slideId = failedSlide?.id || 'unknown';
                errors.push({ id: slideId, error: reason?.message || String(reason) });
                console.error(`[${failedSlide ? failedSlide.index + 1 : '?'}/${slides.length}] FAIL  ${slideId}: ${reason?.message || reason}`);
            }
        }
    }

    // Summary
    console.log(`\nDone: ${rendered} rendered, ${skipped} skipped, ${errors.length} failed (scale=${scale}).`);

    if (errors.length > 0) {
        console.error('\n=== Error Summary ===');
        for (const err of errors) {
            console.error(`  ${err.id}: ${err.error}`);
        }
        process.exit(1);
    }
}

main().catch((err) => {
    console.error('Fatal error:', err.message || err);
    process.exit(1);
});
