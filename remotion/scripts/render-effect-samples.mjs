/**
 * Render effect sample slides and assemble into a PPTX.
 * Usage: node scripts/render-effect-samples.mjs
 */

import { execSync } from 'child_process';
import { mkdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const outputDir = join(rootDir, '..', 'output', 'effect-samples');

// Ensure output dir
mkdirSync(outputDir, { recursive: true });

// Clear cache
const cacheDir = join(rootDir, 'node_modules', '.cache');
rmSync(cacheDir, { recursive: true, force: true });
console.log('Cleared Remotion bundle cache.');

const slides = [
  { id: 'SampleHexmesh',   file: '01-hexmesh.png' },
  { id: 'SampleCircuit',   file: '02-circuit.png' },
  { id: 'SampleGlobe',     file: '03-globe.png' },
  { id: 'SampleParticles', file: '04-particles.png' },
  { id: 'SampleDataflow',  file: '05-dataflow.png' },
  { id: 'SampleWaveform',  file: '06-waveform.png' },
  { id: 'SampleGrid',      file: '07-grid.png' },
];

console.log(`Rendering ${slides.length} effect samples to output/effect-samples/ ...`);

slides.forEach((slide, index) => {
  console.log(`[${index + 1}/${slides.length}] Rendering ${slide.id} -> ${slide.file}`);
  try {
    execSync(
      `npx remotion still src/index.ts ${slide.id} "${join(outputDir, slide.file)}" --scale 2 --quiet`,
      { cwd: rootDir, stdio: 'inherit' }
    );
  } catch {
    console.error(`Failed to render ${slide.id}`);
    process.exit(1);
  }
});

console.log(`All ${slides.length} effect samples rendered.`);

// Assemble PPTX using python script with custom input dir
const pptxOut = join(rootDir, '..', 'output', 'effect-samples.pptx');
const pyScript = `
import sys, glob, os
from pptx import Presentation
from pptx.util import Inches

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

img_dir = sys.argv[1]
out_path = sys.argv[2]

files = sorted(glob.glob(os.path.join(img_dir, '*.png')))
for f in files:
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    slide.shapes.add_picture(f, 0, 0, prs.slide_width, prs.slide_height)
    print(f'  ✓ {os.path.basename(f)}')

prs.save(out_path)
print(f'Saved: {out_path}')
`;

console.log('\nAssembling effect-samples.pptx ...');
execSync(`python3 -c ${JSON.stringify(pyScript)} "${outputDir}" "${pptxOut}"`, {
  cwd: rootDir,
  stdio: 'inherit',
});
