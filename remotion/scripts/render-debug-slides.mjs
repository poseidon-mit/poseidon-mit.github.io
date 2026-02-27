/**
 * Render debug versions of deck slides using Remotion.
 * Renders with debug overlay (grid + IDs) for visual QA.
 *
 * Usage:
 *   node scripts/render-debug-slides.mjs          # Render V3 debug slides (default)
 *   node scripts/render-debug-slides.mjs --v1     # Render V1 debug slides
 *   node scripts/render-debug-slides.mjs --v2     # Render V2 debug slides
 */

import { execSync } from 'child_process';
import { rmSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const outputDir = join(rootDir, '..', 'output', 'png-debug');

const cacheDir = join(rootDir, 'node_modules', '.cache');
rmSync(cacheDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });
console.log('Cleared Remotion bundle cache.');

const version = process.argv.includes('--v1') ? 'v1' : process.argv.includes('--v2') ? 'v2' : 'v3';

const v1Slides = [
    { id: 'Slide01TitleDebug', file: 'slide-01-title-debug.png' },
    { id: 'Slide02ProblemDebug', file: 'slide-02-problem-debug.png' },
    { id: 'Slide03WhyNowDebug', file: 'slide-03-why-now-debug.png' },
    { id: 'Slide04SolutionDebug', file: 'slide-04-solution-debug.png' },
    { id: 'Slide05DifferentiationDebug', file: 'slide-05-differentiation-debug.png' },
    { id: 'Slide06BusinessDebug', file: 'slide-06-business-debug.png' },
    { id: 'Slide07DemoDebug', file: 'slide-07-demo-debug.png' },
    { id: 'Slide08SummaryDebug', file: 'slide-08-summary-debug.png' },
    { id: 'Slide09EpilogueDebug', file: 'slide-09-epilogue-debug.png' },
];

const v2Slides = [
    { id: 'Slide01TitleV2Debug', file: 'v2-slide-01-title-debug.png' },
    { id: 'Slide02ProblemV2Debug', file: 'v2-slide-02-problem-debug.png' },
    { id: 'Slide02OptionADebug', file: 'v2-slide-02-option-a-debug.png' },
    { id: 'Slide02OptionBDebug', file: 'v2-slide-02-option-b-debug.png' },
    { id: 'Slide02OptionCDebug', file: 'v2-slide-02-option-c-debug.png' },
    { id: 'Slide03WhyNowV2Debug', file: 'v2-slide-03-why-now-debug.png' },
    { id: 'Slide04SolutionV2Debug', file: 'v2-slide-04-solution-debug.png' },
    { id: 'Slide05DifferentiationV2Debug', file: 'v2-slide-05-differentiation-debug.png' },
    { id: 'Slide06BusinessV2Debug', file: 'v2-slide-06-business-debug.png' },
    { id: 'Slide07FinModelV2Debug', file: 'v2-slide-07-fin-model-debug.png' },
    { id: 'Slide07DemoV2Debug', file: 'v2-slide-07-demo-debug.png' },
    { id: 'Slide08SummaryV2Debug', file: 'v2-slide-08-summary-debug.png' },
    { id: 'Slide09EpilogueV2Debug', file: 'v2-slide-09-epilogue-debug.png' },
    { id: 'Slide10AppendixV2Debug', file: 'v2-slide-10-appendix-debug.png' },
    { id: 'Slide11FinModelV2Debug', file: 'v2-slide-11-fin-model-debug.png' },
    { id: 'Slide12QAV2Debug', file: 'v2-slide-12-qa-debug.png' },
];

const v3Slides = [
    { id: 'Slide01TitleV3Debug', file: 'v3-slide-01-title-debug.png' },
    { id: 'Slide02ProblemV3Debug', file: 'v3-slide-02-problem-debug.png' },
    { id: 'Slide02OptionAV3Debug', file: 'v3-slide-02-option-a-debug.png' },
    { id: 'Slide02OptionBV3Debug', file: 'v3-slide-02-option-b-debug.png' },
    { id: 'Slide02OptionCV3Debug', file: 'v3-slide-02-option-c-debug.png' },
    { id: 'Slide03WhyNowV3Debug', file: 'v3-slide-03-why-now-debug.png' },
    { id: 'Slide04SolutionV3Debug', file: 'v3-slide-04-solution-debug.png' },
    { id: 'Slide05DifferentiationV3Debug', file: 'v3-slide-05-differentiation-debug.png' },
    { id: 'Slide06BusinessV3Debug', file: 'v3-slide-06-business-debug.png' },
    { id: 'Slide07DemoV3Debug', file: 'v3-slide-07-demo-debug.png' },
    { id: 'Slide08SummaryV3Debug', file: 'v3-slide-08-summary-debug.png' },
    { id: 'Slide09EpilogueV3Debug', file: 'v3-slide-09-epilogue-debug.png' },
    { id: 'Slide10AppendixV3Debug', file: 'v3-slide-10-appendix-debug.png' },
    { id: 'Slide11FinModelV3Debug', file: 'v3-slide-11-fin-model-debug.png' },
    { id: 'Slide12QAV3Debug', file: 'v3-slide-12-qa-debug.png' },
];

const slides = version === 'v1' ? v1Slides : version === 'v2' ? v2Slides : v3Slides;

console.log(`Rendering ${slides.length} ${version.toUpperCase()} debug slides to output/png-debug/ ...`);

slides.forEach((slide, index) => {
    console.log(`[${index + 1}/${slides.length}] Rendering ${slide.id} -> ${slide.file}`);
    try {
        execSync(`npx remotion still ${slide.id} "${join(outputDir, slide.file)}" --scale 2 --quiet`, {
            cwd: rootDir,
            stdio: 'inherit'
        });
    } catch {
        console.error(`Failed to render ${slide.id}`);
        process.exit(1);
    }
});

console.log('✅ All debug slides rendered successfully.');
