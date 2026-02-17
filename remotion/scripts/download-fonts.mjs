/**
 * Download and locally bundle the 6 fonts used in the slide deck.
 * Fonts are saved to remotion/public/fonts/ for network-independent rendering.
 *
 * Run once after npm install:
 *   node scripts/download-fonts.mjs
 *
 * Source: exact URLs extracted from @remotion/google-fonts v4.0.416
 * These are variable-font woff2 files; one file covers all weights.
 */

import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { get } from 'https';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fontsDir = join(__dirname, '..', 'public', 'fonts');
mkdirSync(fontsDir, { recursive: true });

/** @type {Array<{name: string, url: string}>} */
const FONTS = [
  // SpaceGrotesk v22 — variable font, latin subset, weights 300–700
  {
    name: 'SpaceGrotesk-latin.woff2',
    url: 'https://fonts.gstatic.com/s/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.woff2',
  },
  // Inter v20 — variable font, latin subset, weights 100–900
  {
    name: 'Inter-latin.woff2',
    url: 'https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2',
  },
  // JetBrainsMono v24 — variable font, latin subset, weights 100–800
  {
    name: 'JetBrainsMono-latin.woff2',
    url: 'https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbV2o-flEEny0FZhsfKu5WU4xD7OwE.woff2',
  },
  // NotoSansJP v56 — latin subset only (Japanese glyphs use system font fallback)
  {
    name: 'NotoSansJP-latin.woff2',
    url: 'https://fonts.gstatic.com/s/notosansjp/v56/-F62fjtqLzI2JPCgQBnw7HFYwQgP.woff2',
  },
  // Outfit v15 — variable font, latin subset, weights 100–900
  {
    name: 'Outfit-latin.woff2',
    url: 'https://fonts.gstatic.com/s/outfit/v15/QGYvz_MVcBeNP4NJtEtq.woff2',
  },
  // Sora v17 — variable font, latin subset, weights 100–800
  {
    name: 'Sora-latin.woff2',
    url: 'https://fonts.gstatic.com/s/sora/v17/xMQbuFFYT72XzQUpDg.woff2',
  },
];

function download(url, destPath) {
  return new Promise((resolve, reject) => {
    if (existsSync(destPath)) {
      console.log(`  SKIP  ${destPath.split('/').pop()} (already exists)`);
      resolve();
      return;
    }
    const file = createWriteStream(destPath);
    get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

console.log(`\nDownloading ${FONTS.length} font files to public/fonts/...\n`);

let ok = 0;
for (const { name, url } of FONTS) {
  const dest = join(fontsDir, name);
  try {
    await download(url, dest);
    console.log(`  OK    ${name}`);
    ok++;
  } catch (err) {
    console.error(`  FAIL  ${name}: ${err.message}`);
  }
}

console.log(`\n${ok}/${FONTS.length} fonts ready in public/fonts/.\n`);
console.log('Next: Root.tsx uses localFonts.ts which loads from public/fonts/.\n');
