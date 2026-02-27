#!/usr/bin/env node

import { existsSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');

const args = process.argv.slice(2);
const getArg = (name, fallback = null) => {
  const idx = args.indexOf(name);
  if (idx === -1) return fallback;
  return args[idx + 1] ?? fallback;
};

const targetPath = getArg('--file', 'public/Poseidon_AI_MIT_CTO_V3_Visual_First.pdf');
const maxMb = Number(getArg('--max-mb', '10'));
const minMbRaw = getArg('--min-mb', null);
const minMb = minMbRaw === null ? null : Number(minMbRaw);

const absolutePath = join(root, targetPath);

if (!existsSync(absolutePath)) {
  console.error(`[check-pdf-size] file not found: ${absolutePath}`);
  process.exit(1);
}

const sizeMb = statSync(absolutePath).size / (1024 * 1024);

if (minMb !== null && sizeMb < minMb) {
  console.error(`[check-pdf-size] failed: ${sizeMb.toFixed(2)}MB < min ${minMb.toFixed(2)}MB (${targetPath})`);
  process.exit(1);
}

if (sizeMb > maxMb) {
  console.error(`[check-pdf-size] failed: ${sizeMb.toFixed(2)}MB > max ${maxMb.toFixed(2)}MB (${targetPath})`);
  process.exit(1);
}

console.log(`[check-pdf-size] ok: ${sizeMb.toFixed(2)}MB (${targetPath}), max ${maxMb.toFixed(2)}MB`);
