/**
 * Slide diff viewer — generates an HTML page showing before/after PNGs
 * side by side for visual QA.
 *
 * Usage:
 *   node scripts/gen-slide-diff.mjs                    # Compare out/ vs out/prev/
 *   node scripts/gen-slide-diff.mjs --snapshot         # Save current PNGs as "prev" baseline
 *   node scripts/gen-slide-diff.mjs --dir1 out/prev --dir2 out  # Custom dirs
 *
 * Workflow:
 *   1. Before making changes:  node scripts/gen-slide-diff.mjs --snapshot
 *   2. Make changes, re-render
 *   3. Generate diff:          node scripts/gen-slide-diff.mjs
 *   4. Open:                   open out/diff.html
 */

import { readdirSync, copyFileSync, mkdirSync, existsSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';

const args = process.argv.slice(2);
const prefix = args.includes('--prefix') ? args[args.indexOf('--prefix') + 1] : 'v3-';
const outDir = resolve(process.cwd(), 'out');
const prevDir = resolve(outDir, 'prev');

// ─── Snapshot mode ─────────────────────────────────────────
if (args.includes('--snapshot')) {
  mkdirSync(prevDir, { recursive: true });
  const pngs = readdirSync(outDir).filter(f => f.startsWith(prefix) && f.endsWith('.png'));
  for (const png of pngs) {
    copyFileSync(join(outDir, png), join(prevDir, png));
  }
  console.log(`✅ Snapshot saved: ${pngs.length} PNGs copied to out/prev/`);
  process.exit(0);
}

// ─── Diff mode ─────────────────────────────────────────────
const dir1Arg = args.includes('--dir1') ? args[args.indexOf('--dir1') + 1] : 'out/prev';
const dir2Arg = args.includes('--dir2') ? args[args.indexOf('--dir2') + 1] : 'out';
const dir1 = resolve(process.cwd(), dir1Arg);
const dir2 = resolve(process.cwd(), dir2Arg);

if (!existsSync(dir1)) {
  console.error(`❌ Before directory not found: ${dir1}`);
  console.error('   Run with --snapshot first to save a baseline.');
  process.exit(1);
}

const pngs1 = new Set(readdirSync(dir1).filter(f => f.startsWith(prefix) && f.endsWith('.png')));
const pngs2 = new Set(readdirSync(dir2).filter(f => f.startsWith(prefix) && f.endsWith('.png')));
const allPngs = [...new Set([...pngs1, ...pngs2])].sort();

if (allPngs.length === 0) {
  console.error(`No PNGs found to compare for prefix "${prefix}".`);
  process.exit(1);
}

// Generate HTML
const rows = allPngs.map(png => {
  const label = png.replace(prefix, '').replace('.png', '');
  const hasBefore = pngs1.has(png);
  const hasAfter = pngs2.has(png);
  const beforeSrc = hasBefore ? `../${dir1Arg}/${png}` : '';
  const afterSrc = hasAfter ? `${png}` : '';

  return `
    <div class="slide-row">
      <h2>${label} ${!hasBefore ? '<span class="tag new">NEW</span>' : ''} ${!hasAfter ? '<span class="tag removed">REMOVED</span>' : ''}</h2>
      <div class="compare">
        <div class="panel">
          <h3>Before</h3>
          ${hasBefore ? `<img src="${beforeSrc}" alt="before" />` : '<div class="placeholder">No baseline</div>'}
        </div>
        <div class="panel">
          <h3>After</h3>
          ${hasAfter ? `<img src="${afterSrc}" alt="after" />` : '<div class="placeholder">Removed</div>'}
        </div>
      </div>
    </div>`;
}).join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Poseidon.AI Slide Diff</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a0a; color: #e0e0e0; font-family: system-ui, sans-serif; padding: 20px; }
    h1 { text-align: center; margin-bottom: 30px; color: #00f0ff; }
    .slide-row { margin-bottom: 40px; border: 1px solid #333; border-radius: 12px; padding: 16px; background: #111; }
    .slide-row h2 { font-size: 18px; margin-bottom: 12px; color: #ccc; }
    .compare { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .panel h3 { font-size: 13px; color: #888; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.1em; }
    .panel img { width: 100%; border-radius: 6px; border: 1px solid #333; }
    .placeholder { background: #1a1a1a; border: 1px dashed #444; border-radius: 6px; height: 200px; display: flex; align-items: center; justify-content: center; color: #555; }
    .tag { font-size: 11px; padding: 2px 8px; border-radius: 4px; margin-left: 8px; }
    .tag.new { background: #0f5132; color: #75b798; }
    .tag.removed { background: #5c1a1a; color: #ea868f; }
    .meta { text-align: center; color: #555; font-size: 13px; margin-top: 20px; }
  </style>
</head>
<body>
  <h1>Poseidon.AI — Slide Diff</h1>
  <p style="text-align:center;color:#666;margin-bottom:20px;">
    Before: <code>${dir1Arg}</code> → After: <code>${dir2Arg}</code> | ${allPngs.length} slide(s)
  </p>
  ${rows}
  <p class="meta">Generated ${new Date().toISOString()}</p>
</body>
</html>`;

const outputPath = join(outDir, 'diff.html');
writeFileSync(outputPath, html);
console.log(`✅ Diff viewer generated: ${outputPath}`);
console.log(`   Comparing ${allPngs.length} slides: ${dir1Arg} vs ${dir2Arg}`);
console.log(`   Open with: open out/diff.html`);
