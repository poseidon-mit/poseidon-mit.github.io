/**
 * Tag rendered PNG slides with sRGB IEC61966-2.1 ICC profile.
 * Ensures accurate color reproduction on projectors and external displays.
 *
 * Requires: macOS with `sips` command.
 * Usage: node scripts/tag-png-icc.mjs
 */

import { execSync } from 'child_process';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'out');
const iccProfile = '/System/Library/ColorSync/Profiles/sRGB Profile.icc';

const pngs = readdirSync(outDir).filter(f => f.startsWith('v3-') && f.endsWith('.png'));

if (pngs.length === 0) {
  console.log('No v3-*.png files found in out/. Render slides first.');
  process.exit(0);
}

console.log(`\nTagging ${pngs.length} PNGs with sRGB IEC61966-2.1 ICC profile...\n`);

let tagged = 0;
for (const png of pngs) {
  const fullPath = join(outDir, png);
  try {
    execSync(`sips -m "${iccProfile}" "${fullPath}" --out "${fullPath}"`, { stdio: 'pipe' });
    console.log(`  ✓ ${png}`);
    tagged++;
  } catch (err) {
    console.warn(`  ⚠ ${png} — sips failed: ${err.message?.substring(0, 80)}`);
  }
}

console.log(`\nTagged ${tagged}/${pngs.length} PNGs with sRGB ICC profile.\n`);
