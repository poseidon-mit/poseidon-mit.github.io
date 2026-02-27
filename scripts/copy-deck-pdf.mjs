#!/usr/bin/env node
/**
 * Copy a deck PDF from remotion/out/ (or custom path) to public/.
 * Default is the delivery PDF (<=10MB) used by /deck.
 *
 * Usage:
 *   node scripts/copy-deck-pdf.mjs
 *   node scripts/copy-deck-pdf.mjs --source remotion/out/Poseidon_AI_MIT_CTO_V3_Visual_First.pdf --dest public/Poseidon_AI_MIT_CTO_V3_Visual_First.pdf
 */

import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const args = process.argv.slice(2);

function readFlag(name) {
  const idx = args.indexOf(name);
  if (idx === -1) return null;
  return args[idx + 1] ?? null;
}

const sourceArg = readFlag('--source');
const destArg = readFlag('--dest');

const src = sourceArg
  ? join(root, sourceArg)
  : join(root, 'remotion', 'out', 'Poseidon_AI_MIT_CTO_V3_Visual_First.pdf');

const dest = destArg
  ? join(root, destArg)
  : join(root, 'public', 'Poseidon_AI_MIT_CTO_V3_Visual_First.pdf');

if (!existsSync(src)) {
  console.warn(
    `[copy-deck-pdf] Source not found: ${src}\n` +
      `  Skipping copy. The /deck page will show an error until the PDF is in public/.`
  );
  process.exit(0);
}

mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);
console.log(`[copy-deck-pdf] Copied deck PDF:\n  from: ${src}\n  to:   ${dest}`);
