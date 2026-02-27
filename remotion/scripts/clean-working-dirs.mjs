/**
 * Clean up working directories after successful build.
 * Removes intermediate renders from remotion/out/ while preserving the final PPTX.
 *
 * Usage: node scripts/clean-working-dirs.mjs [--dry-run]
 *
 * Options:
 *   --dry-run   Show what would be deleted without deleting
 */

import { rmSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function getDirSize(dir) {
  if (!existsSync(dir)) return 0;
  let total = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      total += getDirSize(full);
    } else {
      total += statSync(full).size;
    }
  }
  return total;
}

console.log(`\n=== Working Directory Cleanup ${dryRun ? '(DRY RUN)' : ''} ===\n`);

const outDir = join(rootDir, 'out');
let totalFreed = 0;

// Clean intermediate PNGs from remotion/out/ (keep .pptx files)
if (existsSync(outDir)) {
  const entries = readdirSync(outDir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(outDir, entry.name);

    // Keep PPTX files
    if (!entry.isDirectory() && extname(entry.name) === '.pptx') {
      console.log(`  KEEP  ${entry.name}`);
      continue;
    }

    // Remove intermediate PNG renders and backup directories
    if (entry.isDirectory() || extname(entry.name) === '.png') {
      const size = entry.isDirectory() ? getDirSize(full) : statSync(full).size;
      totalFreed += size;
      console.log(`  ${dryRun ? 'WOULD DELETE' : 'DELETE'}  ${entry.name} (${formatBytes(size)})`);
      if (!dryRun) {
        rmSync(full, { recursive: true, force: true });
      }
    }
  }
}

// Clean render cache file
const renderCacheFile = join(outDir, '.render-cache.json');
if (existsSync(renderCacheFile)) {
  const size = statSync(renderCacheFile).size;
  totalFreed += size;
  console.log(`  ${dryRun ? 'WOULD DELETE' : 'DELETE'}  .render-cache.json (${formatBytes(size)})`);
  if (!dryRun) {
    rmSync(renderCacheFile, { force: true });
  }
}

// Clean Remotion bundle cache
const cacheDir = join(rootDir, 'node_modules', '.cache');
if (existsSync(cacheDir)) {
  const size = getDirSize(cacheDir);
  totalFreed += size;
  console.log(`  ${dryRun ? 'WOULD DELETE' : 'DELETE'}  node_modules/.cache (${formatBytes(size)})`);
  if (!dryRun) {
    rmSync(cacheDir, { recursive: true, force: true });
  }
}

console.log(`\n${dryRun ? 'Would free' : 'Freed'}: ${formatBytes(totalFreed)}`);
console.log(`\n=== Done ===\n`);
