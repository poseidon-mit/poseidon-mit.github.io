/**
 * Render selected deck slides using Remotion.
 * Usage: node scripts/render-all-slides.mjs [--fast] [--scale <n>] [--no-cache-clear] [--incremental]
 *
 * Options:
 *   --fast            Render at scale=1 (1920x1080) for quick iteration
 *   --scale <n>       Explicit scale factor (default: 3 for 5760x3240 master; use 1 for fast)
 *   --no-cache-clear  Skip clearing the Remotion bundle cache
 *   --incremental     Skip slides whose source files have not changed (SHA-256 cache)
 *
 * Output: remotion/out/v3-{CompositionId}.png  (unified output directory)
 */

import { execSync } from 'child_process';
import { mkdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { needsRender, updateHash } from './render-cache.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const outputDir = join(rootDir, 'out');
const args = process.argv.slice(2);

const fast = args.includes('--fast');
const noCacheClear = args.includes('--no-cache-clear');
const incremental = args.includes('--incremental');
const scaleIdx = args.indexOf('--scale');
const scale = fast ? 1 : (scaleIdx !== -1 ? Number(args[scaleIdx + 1]) : 3);

mkdirSync(outputDir, { recursive: true });

if (!noCacheClear && !incremental) {
    const cacheDir = join(rootDir, 'node_modules', '.cache');
    rmSync(cacheDir, { recursive: true, force: true });
    console.log('Cleared Remotion bundle cache.');
} else {
    console.log('Skipping cache clear.');
}

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

const resolution = scale === 1 ? '1920x1080' : `${1920 * scale}x${1080 * scale}`;
console.log(`Rendering ${slides.length} slides at scale=${scale} (${resolution}) to remotion/out/ ...`);

let rendered = 0;
let skipped = 0;

slides.forEach((slide, index) => {
    const outFile = `v3-${slide.id}.png`;
    const outPath = join(outputDir, outFile);

    if (incremental && !needsRender(slide.id, slide.source)) {
        skipped++;
        console.log(`[${index + 1}/${slides.length}] SKIP  ${slide.id} (unchanged)`);
        return;
    }

    console.log(`[${index + 1}/${slides.length}] Rendering ${slide.id} -> ${outFile}`);
    try {
        execSync(`npx remotion still src/index.ts ${slide.id} "${outPath}" --scale ${scale} --quiet`, {
            cwd: rootDir,
            stdio: 'inherit'
        });
        updateHash(slide.id, slide.source);
        rendered++;
    } catch (e) {
        console.error(`Failed to render ${slide.id}`);
        process.exit(1);
    }
});

console.log(`Done: ${rendered} rendered, ${skipped} skipped (scale=${scale}).`);
