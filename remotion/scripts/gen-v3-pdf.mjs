#!/usr/bin/env node
/**
 * Generate delivery PDF from V3 slide PNGs with adaptive JPEG quality search.
 *
 * Default target is 10-13 MB.
 */

import { execFileSync } from 'child_process';
import { existsSync, mkdtempSync, readdirSync, rmSync, statSync } from 'fs';
import { tmpdir } from 'os';
import { basename, join, resolve } from 'path';

const ROOT = resolve(join(import.meta.dirname, '..'));
const OUT_DIR = join(ROOT, 'out');
const DEFAULT_OUTPUT = join(OUT_DIR, 'Poseidon_AI_MIT_CTO_V3_Visual_First.pdf');
const CANONICAL_SLIDES = [
  'v3-Slide01TitleV3.png',
  'v3-Slide02ProblemV3.png',
  'v3-Slide03WhyNowV3.png',
  'v3-Slide04SolutionV3.png',
  'v3-Slide05DifferentiationV3.png',
  'v3-Slide06BusinessV3.png',
  'v3-Slide08SummaryV3.png',
  'v3-Slide09EpilogueV3.png',
  'v3-Slide10AppendixV3.png',
  'v3-Slide12QAV3.png',
];

function parseArgs(argv) {
  const args = {
    output: DEFAULT_OUTPUT,
    targetMbMin: 10,
    targetMbMax: 13,
    jpegQualityStart: 74,
    jpegQualityMin: 50,
    jpegQualityMax: 92,
    qualityStep: 2,
    maxDimension: null,
    keepTemp: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    const next = argv[i + 1];
    if (token === '--output' && next) {
      args.output = resolve(next);
      i++;
    } else if (token === '--target-mb-min' && next) {
      args.targetMbMin = Number(next);
      i++;
    } else if (token === '--target-mb-max' && next) {
      args.targetMbMax = Number(next);
      i++;
    } else if (token === '--jpeg-quality-start' && next) {
      args.jpegQualityStart = Number(next);
      i++;
    } else if (token === '--jpeg-quality-min' && next) {
      args.jpegQualityMin = Number(next);
      i++;
    } else if (token === '--jpeg-quality-max' && next) {
      args.jpegQualityMax = Number(next);
      i++;
    } else if (token === '--quality-step' && next) {
      args.qualityStep = Number(next);
      i++;
    } else if (token === '--max-dimension' && next) {
      args.maxDimension = Number(next);
      i++;
    } else if (token === '--keep-temp') {
      args.keepTemp = true;
    } else if (token === '--help' || token === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }
  return args;
}

function printHelp() {
  console.log(`Usage: node scripts/gen-v3-pdf.mjs [options]

Options:
  --output <path>             Output PDF path (default: remotion/out/Poseidon_AI_MIT_CTO_V3_Visual_First.pdf)
  --target-mb-min <n>         Minimum target size in MB (default: 10)
  --target-mb-max <n>         Maximum target size in MB (default: 13)
  --jpeg-quality-start <n>    Starting JPEG quality (default: 74)
  --jpeg-quality-min <n>      Minimum JPEG quality floor (default: 50)
  --jpeg-quality-max <n>      Maximum JPEG quality ceiling (default: 92)
  --quality-step <n>          Quality adjustment step (default: 2)
  --max-dimension <n>         Optional max image long-side before JPEG conversion
  --keep-temp                 Keep temporary JPEG folder for debugging
  --help, -h                  Show this help
`);
}

function commandExists(cmd) {
  try {
    execFileSync('zsh', ['-lc', `command -v ${cmd}`], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function assertTools() {
  if (!commandExists('sips')) {
    throw new Error("'sips' is required but not found.");
  }
  if (!commandExists('img2pdf')) {
    throw new Error("'img2pdf' is required but not found.");
  }
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function collectSlides() {
  const fromCanonical = CANONICAL_SLIDES.map((name) => join(OUT_DIR, name));
  const allPresent = fromCanonical.every((p) => existsSync(p));
  if (allPresent) return fromCanonical;

  const discovered = readdirSync(OUT_DIR)
    .filter((name) => /^v3-Slide\d+.*\.png$/i.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name) => join(OUT_DIR, name));

  if (discovered.length === 0) {
    throw new Error('No v3 slide PNG files found in remotion/out.');
  }
  return discovered;
}

function toMb(bytes) {
  return bytes / (1024 * 1024);
}

function convertSlidesToJpeg(slides, tempDir, quality, maxDimension) {
  const out = [];
  for (const slide of slides) {
    const stem = basename(slide, '.png');
    const jpg = join(tempDir, `${stem}.jpg`);
    const args = [];
    if (maxDimension !== null) {
      args.push('-Z', String(maxDimension));
    }
    args.push(
      '-s',
      'format',
      'jpeg',
      '-s',
      'formatOptions',
      String(quality),
      slide,
      '--out',
      jpg,
    );
    execFileSync('sips', args, { stdio: 'ignore' });
    out.push(jpg);
  }
  return out;
}

function buildPdf(jpegSlides, outputPdf) {
  execFileSync('img2pdf', [...jpegSlides, '-o', outputPdf], { stdio: 'ignore' });
  return statSync(outputPdf).size;
}

function pickBetterCandidate(current, candidate, targetMid) {
  if (!current) return candidate;
  const currentDelta = Math.abs(current.mb - targetMid);
  const candidateDelta = Math.abs(candidate.mb - targetMid);
  return candidateDelta < currentDelta ? candidate : current;
}

function main() {
  const cfg = parseArgs(process.argv.slice(2));
  if (cfg.targetMbMin > cfg.targetMbMax) {
    throw new Error('--target-mb-min must be <= --target-mb-max');
  }
  if (cfg.qualityStep < 1) {
    throw new Error('--quality-step must be >= 1');
  }
  cfg.jpegQualityStart = clamp(Math.round(cfg.jpegQualityStart), 1, 100);
  cfg.jpegQualityMin = clamp(Math.round(cfg.jpegQualityMin), 1, 100);
  cfg.jpegQualityMax = clamp(Math.round(cfg.jpegQualityMax), 1, 100);
  if (cfg.jpegQualityMin > cfg.jpegQualityMax) {
    throw new Error('--jpeg-quality-min must be <= --jpeg-quality-max');
  }
  if (cfg.maxDimension !== null && cfg.maxDimension < 640) {
    throw new Error('--max-dimension must be >= 640 when provided');
  }

  assertTools();
  const slides = collectSlides();
  const tempDir = mkdtempSync(join(tmpdir(), 'poseidon-v3-pdf-'));
  const targetMid = (cfg.targetMbMin + cfg.targetMbMax) / 2;
  const tried = new Set();
  let quality = clamp(cfg.jpegQualityStart, cfg.jpegQualityMin, cfg.jpegQualityMax);
  let best = null;

  console.log(
    `Generating PDF from ${slides.length} slides. Target=${cfg.targetMbMin}-${cfg.targetMbMax}MB, qualityStart=${quality}`,
  );

  try {
    for (let attempt = 1; attempt <= 30; attempt++) {
      if (tried.has(quality)) break;
      tried.add(quality);

      const jpegSlides = convertSlidesToJpeg(slides, tempDir, quality, cfg.maxDimension);
      const bytes = buildPdf(jpegSlides, cfg.output);
      const mb = toMb(bytes);
      const candidate = { quality, bytes, mb };
      best = pickBetterCandidate(best, candidate, targetMid);

      console.log(`Attempt ${attempt}: quality=${quality}, size=${mb.toFixed(2)}MB`);

      if (mb >= cfg.targetMbMin && mb <= cfg.targetMbMax) {
        best = candidate;
        break;
      }
      if (mb > cfg.targetMbMax && quality > cfg.jpegQualityMin) {
        quality = Math.max(cfg.jpegQualityMin, quality - cfg.qualityStep);
        continue;
      }
      if (mb < cfg.targetMbMin && quality < cfg.jpegQualityMax) {
        quality = Math.min(cfg.jpegQualityMax, quality + cfg.qualityStep);
      }
      break;
    }

    if (!best) throw new Error('Failed to produce any PDF candidate.');
    if (best.quality !== quality) {
      const jpegSlides = convertSlidesToJpeg(slides, tempDir, best.quality, cfg.maxDimension);
      buildPdf(jpegSlides, cfg.output);
    }
    console.log(
      `PDF generated: ${cfg.output} (${best.mb.toFixed(2)} MB, jpegQuality=${best.quality}, maxDimension=${cfg.maxDimension ?? 'none'})`,
    );
    if (best.mb < cfg.targetMbMin || best.mb > cfg.targetMbMax) {
      console.log('Note: size target not fully met; closest quality candidate was used.');
    }
  } finally {
    if (cfg.keepTemp) {
      console.log(`Keeping temp JPEG files: ${tempDir}`);
    } else {
      rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

try {
  main();
} catch (err) {
  console.error(`gen-v3-pdf error: ${err.message}`);
  process.exit(1);
}
