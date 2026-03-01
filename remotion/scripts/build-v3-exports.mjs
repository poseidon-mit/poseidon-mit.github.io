#!/usr/bin/env node
/**
 * Orchestrate quality-first master + delivery exports.
 */

import { execSync } from 'child_process';
import { existsSync, statSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(join(import.meta.dirname, '..'));
const OUT_DIR = join(ROOT, 'out');

function parseArgs(argv) {
  const args = {
    scale: 3,
    skipRender: false,
    skipMasterPptx: false,
    skipPdf: false,
    deliveryPptx: false,
    pdfMin: 10,
    pdfMax: 13,
    pdfQualityStart: 74,
  };
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    const next = argv[i + 1];
    if (token === '--scale' && next) {
      args.scale = Number(next);
      i++;
    } else if (token === '--skip-render') {
      args.skipRender = true;
    } else if (token === '--skip-master-pptx') {
      args.skipMasterPptx = true;
    } else if (token === '--skip-pdf') {
      args.skipPdf = true;
    } else if (token === '--delivery-pptx') {
      args.deliveryPptx = true;
    } else if (token === '--pdf-target-min' && next) {
      args.pdfMin = Number(next);
      i++;
    } else if (token === '--pdf-target-max' && next) {
      args.pdfMax = Number(next);
      i++;
    } else if (token === '--pdf-quality-start' && next) {
      args.pdfQualityStart = Number(next);
      i++;
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
  console.log(`Usage: node scripts/build-v3-exports.mjs [options]

Options:
  --scale <n>             Render scale for master PNGs (default: 3)
  --skip-render           Skip PNG rendering
  --skip-master-pptx      Skip master PPTX generation
  --skip-pdf              Skip delivery PDF generation
  --delivery-pptx         Also build delivery PPTX (JPEG q82)
  --pdf-target-min <n>    Delivery PDF target min MB (default: 10)
  --pdf-target-max <n>    Delivery PDF target max MB (default: 13)
  --pdf-quality-start <n> Delivery PDF quality search start (default: 74)
  --help, -h              Show this help
`);
}

function run(cmd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
}

function printFile(pathLabel, pathValue) {
  if (!existsSync(pathValue)) return;
  const sizeMb = statSync(pathValue).size / (1024 * 1024);
  console.log(`${pathLabel}: ${pathValue} (${sizeMb.toFixed(2)} MB)`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.skipRender) {
    run(`node scripts/render-all-slides.mjs --scale ${args.scale}`);
  }

  if (!args.skipMasterPptx) {
    run('node scripts/gen-v3-pptx.js --image-format png --alt-text --transitions --no-notes');
  }

  if (!args.skipPdf) {
    run(
      [
        'node scripts/gen-v3-pdf.mjs',
        `--target-mb-min ${args.pdfMin}`,
        `--target-mb-max ${args.pdfMax}`,
        `--jpeg-quality-start ${args.pdfQualityStart}`,
      ].join(' '),
    );
  }

  if (args.deliveryPptx) {
    run('node scripts/gen-v3-pptx.js --image-format jpeg --jpeg-quality 82 --alt-text --transitions --no-notes');
  }

  console.log('\n=== Export summary ===');
  printFile(
    'Master PPTX',
    join(OUT_DIR, 'Group7-CTO-Poseidon.pptx'),
  );
  printFile(
    'Delivery PDF',
    join(OUT_DIR, 'Poseidon_AI_MIT_CTO_V3_Visual_First.pdf'),
  );
  printFile(
    'Delivery PPTX',
    join(OUT_DIR, 'Poseidon_AI_MIT_CTO_V3_Visual_First_Delivery.pptx'),
  );
}

try {
  main();
} catch (err) {
  console.error(`build-v3-exports error: ${err.message}`);
  process.exit(1);
}
