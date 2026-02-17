/**
 * verify-pptx-pipeline.mjs — End-to-end verification for V3 deck exports.
 *
 * Profiles:
 * - master: scale-3 PNG slides + master PPTX (PNG images, notes required)
 * - delivery: optional delivery PPTX (JPEG expected) + delivery PDF
 * - all: master + delivery
 */

import { existsSync, readFileSync, statSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const remotionDir = join(__dirname, '..');
const outDir = join(remotionDir, 'out');
const args = process.argv.slice(2);

const hasPhaseFlag =
  args.includes('--source') ||
  args.includes('--png') ||
  args.includes('--pptx') ||
  args.includes('--delivery');
const phaseSource = args.includes('--source') || !hasPhaseFlag;
const phasePng = args.includes('--png') || !hasPhaseFlag;
const phasePptx = args.includes('--pptx') || !hasPhaseFlag;
const phaseDelivery = args.includes('--delivery') || !hasPhaseFlag;

const profileIdx = args.indexOf('--profile');
const profile = profileIdx !== -1 ? args[profileIdx + 1] : 'master';
if (!['master', 'delivery', 'all'].includes(profile)) {
  console.error(`Invalid --profile value: ${profile}. Use master|delivery|all.`);
  process.exit(1);
}

function readIntFlag(name, fallback) {
  const idx = args.indexOf(name);
  if (idx === -1) return fallback;
  const parsed = Number(args[idx + 1]);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readStringFlag(name, fallback) {
  const idx = args.indexOf(name);
  return idx === -1 ? fallback : args[idx + 1];
}

const expectedWidth = readIntFlag('--expected-width', 5760);
const expectedHeight = readIntFlag('--expected-height', 3240);
const minPngBytes = readIntFlag('--min-png-bytes', 500 * 1024);
const minPdfMb = readIntFlag('--pdf-min-mb', 8);
const maxPdfMb = readIntFlag('--pdf-max-mb', 22);
const masterPptxName = readStringFlag('--master-pptx-file', 'Poseidon_AI_MIT_CTO_V3_Visual_First.pptx');
const deliveryPptxName = readStringFlag('--delivery-pptx-file', 'Poseidon_AI_MIT_CTO_V3_Visual_First_Delivery.pptx');
const deliveryPdfName = readStringFlag('--delivery-pdf-file', 'Poseidon_AI_MIT_CTO_V3_Visual_First.pdf');

const SLIDES = [
  { compositionId: 'Slide01TitleV3', sourceFile: 'src/v2/Slide01TitleV2.tsx', pngFile: 'v3-Slide01TitleV3.png' },
  { compositionId: 'Slide02ProblemV3', sourceFile: 'src/v2/Slide02ProblemV2.tsx', pngFile: 'v3-Slide02ProblemV3.png' },
  { compositionId: 'Slide03WhyNowV3', sourceFile: 'src/v2/Slide03WhyNowV2.tsx', pngFile: 'v3-Slide03WhyNowV3.png' },
  { compositionId: 'Slide04SolutionV3', sourceFile: 'src/v2/Slide04SolutionV2.tsx', pngFile: 'v3-Slide04SolutionV3.png' },
  { compositionId: 'Slide05DifferentiationV3', sourceFile: 'src/v2/Slide05DifferentiationV2.tsx', pngFile: 'v3-Slide05DifferentiationV3.png' },
  { compositionId: 'Slide06BusinessV3', sourceFile: 'src/v2/Slide06BusinessV2.tsx', pngFile: 'v3-Slide06BusinessV3.png' },
  { compositionId: 'Slide07DemoV3', sourceFile: 'src/v2/Slide07DemoV2.tsx', pngFile: 'v3-Slide07DemoV3.png' },
  { compositionId: 'Slide08SummaryV3', sourceFile: 'src/v2/Slide08SummaryV2.tsx', pngFile: 'v3-Slide08SummaryV3.png' },
  { compositionId: 'Slide09EpilogueV3', sourceFile: 'src/v2/Slide09EpilogueV2.tsx', pngFile: 'v3-Slide09EpilogueV3.png' },
  { compositionId: 'Slide10AppendixV3', sourceFile: 'src/v2/Slide10AppendixV2.tsx', pngFile: 'v3-Slide10AppendixV3.png' },
  { compositionId: 'Slide11FinModelV3', sourceFile: 'src/v2/Slide11FinModelV2.tsx', pngFile: 'v3-Slide11FinModelV3.png' },
];

const SHARED_FILES = [
  'src/shared/theme.ts',
  'src/shared/copy.ts',
  'src/shared/slideLayouts.ts',
  'src/shared/backgroundPresets.ts',
  'src/shared/speaker-notes.json',
  'src/Root.tsx',
  'scripts/gen-v3-pdf.mjs',
  'scripts/build-v3-exports.mjs',
];

let totalChecks = 0;
let passCount = 0;
let failCount = 0;
const failures = [];

function check(label, condition, detail) {
  totalChecks++;
  if (condition) {
    passCount++;
    console.log(`  PASS  ${label}`);
    return;
  }
  failCount++;
  const msg = detail ? `${label} — ${detail}` : label;
  failures.push(msg);
  console.error(`  FAIL  ${msg}`);
}

function commandExists(name) {
  try {
    execSync(`command -v ${name}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function pngDimensions(filePath) {
  try {
    const fd = readFileSync(filePath);
    if (fd.length < 24) return null;
    if (fd[0] !== 0x89 || fd[1] !== 0x50 || fd[2] !== 0x4e || fd[3] !== 0x47) return null;
    const width = fd.readUInt32BE(16);
    const height = fd.readUInt32BE(20);
    return { width, height };
  } catch {
    return null;
  }
}

function verifySource() {
  console.log('\n--- Phase 1: Source integrity ---\n');

  for (const slide of SLIDES) {
    check(`Source: ${slide.sourceFile}`, existsSync(join(remotionDir, slide.sourceFile)), 'file not found');
  }
  for (const f of SHARED_FILES) {
    check(`Shared: ${f}`, existsSync(join(remotionDir, f)), 'file not found');
  }

  const rootPath = join(remotionDir, 'src', 'Root.tsx');
  const rootSource = existsSync(rootPath) ? readFileSync(rootPath, 'utf8') : '';
  for (const slide of SLIDES) {
    const pattern = `id="${slide.compositionId}"`;
    check(`Root.tsx registers ${slide.compositionId}`, rootSource.includes(pattern), `"${pattern}" not found`);
  }

  try {
    execSync('python3 -c "from pptx import Presentation"', { stdio: 'pipe' });
    check('python-pptx importable', true);
  } catch {
    check('python-pptx importable', false, 'run: pip install python-pptx');
  }
}

function verifyPng() {
  console.log('\n--- Phase 2: Rendered PNG integrity ---\n');
  for (const slide of SLIDES) {
    const pngPath = join(outDir, slide.pngFile);
    check(`PNG exists: ${slide.pngFile}`, existsSync(pngPath), 'file not found');
    if (!existsSync(pngPath)) continue;
    const dims = pngDimensions(pngPath);
    check(`PNG valid header: ${slide.pngFile}`, dims !== null, 'invalid or corrupt PNG');
    if (!dims) continue;
    check(
      `PNG ${expectedWidth}x${expectedHeight}: ${slide.pngFile}`,
      dims.width === expectedWidth && dims.height === expectedHeight,
      `got ${dims.width}x${dims.height}`,
    );
    const sizeBytes = statSync(pngPath).size;
    check(`PNG size > ${Math.round(minPngBytes / 1024)}KB: ${slide.pngFile}`, sizeBytes > minPngBytes, `${sizeBytes} bytes`);
  }
}

function verifyPptxFile(pptxName, expectedImageFormat) {
  const pptxPath = join(outDir, pptxName);
  check(`PPTX exists: ${pptxName}`, existsSync(pptxPath), 'file not found');
  if (!existsSync(pptxPath)) return;

  if (commandExists('unzip')) {
    try {
      execSync(`unzip -t "${pptxPath}"`, { stdio: 'ignore' });
      check(`PPTX zip integrity: ${pptxName}`, true);
    } catch {
      check(`PPTX zip integrity: ${pptxName}`, false, 'unzip -t failed');
    }
  }

  const verifyScript = join(__dirname, 'verify-pptx-contents.py');
  try {
    const result = execSync(
      [
        `python3 "${verifyScript}" "${pptxPath}"`,
        `--expected-slides ${SLIDES.length}`,
        '--require-notes',
        '--require-alt-text',
        `--expected-image-format ${expectedImageFormat}`,
        '--json',
      ].join(' '),
      { encoding: 'utf8', timeout: 40000 },
    );
    const report = JSON.parse(result.trim());
    check(`PPTX slide count = ${SLIDES.length}: ${pptxName}`, report.slideCount === SLIDES.length, `got ${report.slideCount}`);
    check(
      `PPTX notes on all slides: ${pptxName}`,
      report.slidesWithNotes === SLIDES.length && report.shortNotes === 0,
      `${report.slidesWithNotes}/${SLIDES.length}, short=${report.shortNotes}`,
    );
    check(
      `PPTX alt text on all slides: ${pptxName}`,
      report.slidesWithAltText === SLIDES.length,
      `${report.slidesWithAltText}/${SLIDES.length}`,
    );
    if (expectedImageFormat === 'PNG') {
      check(`PPTX image format PNG-only: ${pptxName}`, report.jpegImageCount === 0, `jpeg=${report.jpegImageCount}`);
    }
    if (expectedImageFormat === 'JPEG') {
      check(`PPTX image format JPEG-only: ${pptxName}`, report.pngImageCount === 0, `png=${report.pngImageCount}`);
    }
  } catch (err) {
    check(`PPTX content validation: ${pptxName}`, false, err.message || 'verification script failed');
  }
}

function verifyPptx() {
  console.log('\n--- Phase 3: PPTX integrity ---\n');
  if (profile === 'master' || profile === 'all') {
    verifyPptxFile(masterPptxName, 'PNG');
  }
  if (profile === 'delivery' || profile === 'all') {
    verifyPptxFile(deliveryPptxName, 'JPEG');
  }
}

function verifyDelivery() {
  console.log('\n--- Phase 4: Delivery artifact integrity ---\n');
  if (!(profile === 'delivery' || profile === 'all')) {
    console.log('  SKIP  Delivery checks (--profile master)');
    return;
  }
  const pdfPath = join(outDir, deliveryPdfName);
  check(`Delivery PDF exists: ${deliveryPdfName}`, existsSync(pdfPath), 'file not found');
  if (!existsSync(pdfPath)) return;
  const sizeMb = statSync(pdfPath).size / (1024 * 1024);
  check(
    `Delivery PDF size ${minPdfMb}-${maxPdfMb}MB (got ${sizeMb.toFixed(2)}MB)`,
    sizeMb >= minPdfMb && sizeMb <= maxPdfMb,
    `${sizeMb.toFixed(2)}MB`,
  );
}

console.log('=== Poseidon V3 Export Verification ===');
console.log(
  `Profile=${profile}, PNG=${expectedWidth}x${expectedHeight}, PDF target=${minPdfMb}-${maxPdfMb}MB`,
);

if (phaseSource) verifySource();
if (phasePng) verifyPng();
if (phasePptx) verifyPptx();
if (phaseDelivery) verifyDelivery();

console.log('\n' + '='.repeat(50));
console.log(`Total: ${totalChecks} checks — ${passCount} passed, ${failCount} failed`);
if (failCount > 0) {
  console.error('\nFailures:');
  for (const f of failures) console.error(`  - ${f}`);
  console.error('');
  process.exit(1);
}
console.log('\nAll checks passed.\n');
