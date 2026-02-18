#!/usr/bin/env node
/**
 * Optional: Set default viewer preferences on the deck PDF so clients that
 * respect document metadata (e.g. some desktop viewers) open it with "fit window".
 * Mobile in-browser viewers often ignore this; the in-app /deck viewer is the
 * reliable fix for mobile.
 *
 * Run after generating the PDF:
 *   cd remotion && node scripts/gen-v3-pdf.mjs
 *   node scripts/set-pdf-viewer-prefs.mjs [path/to/file.pdf]
 *
 * Default path: remotion/out/Poseidon_AI_MIT_CTO_V3_Visual_First.pdf
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument } from 'pdf-lib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const defaultPath = join(root, 'remotion', 'out', 'Poseidon_AI_MIT_CTO_V3_Visual_First.pdf');

const pdfPath = process.argv[2] ? resolve(process.cwd(), process.argv[2]) : defaultPath;

if (!existsSync(pdfPath)) {
  console.warn(
    `[set-pdf-viewer-prefs] File not found: ${pdfPath}\n` +
      '  Generate the PDF first (e.g. cd remotion && node scripts/gen-v3-pdf.mjs).'
  );
  process.exit(0);
}

const bytes = readFileSync(pdfPath);
const pdfDoc = await PDFDocument.load(bytes);
const viewerPrefs = pdfDoc.catalog.getOrCreateViewerPreferences();
viewerPrefs.setFitWindow(true);
viewerPrefs.setCenterWindow(true);

const out = await pdfDoc.save();
writeFileSync(pdfPath, out);
console.log('[set-pdf-viewer-prefs] Updated viewer preferences (fit window, center) at', pdfPath);
