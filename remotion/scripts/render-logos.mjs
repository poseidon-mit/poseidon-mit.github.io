/**
 * Render all logo variants using Remotion.
 * Usage: node scripts/render-logos.mjs [--scale <1|2>]
 *
 * Output: remotion/out/logos/
 */

import { execSync } from 'child_process';
import { mkdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const outputDir = join(rootDir, 'out', 'logos');

const args = process.argv.slice(2);
const scaleIdx = args.indexOf('--scale');
const scale = scaleIdx !== -1 ? Number(args[scaleIdx + 1]) : 2;

mkdirSync(outputDir, { recursive: true });

const logos = [
    { id: 'LogoFavicon', file: 'logo-favicon.png' },
    { id: 'LogoAppIcon', file: 'logo-app-icon.png' },
    { id: 'LogoStandard', file: 'logo-standard.png' },
    { id: 'LogoWordmark', file: 'logo-wordmark.png' },
    { id: 'LogoPrint', file: 'logo-print.png' },
    { id: 'LogoTridentOnly', file: 'logo-trident-only.png' },
];

console.log(`Rendering ${logos.length} logo variants at scale=${scale} to out/logos/ ...`);

logos.forEach((logo, index) => {
    console.log(`[${index + 1}/${logos.length}] Rendering ${logo.id} -> ${logo.file}`);
    try {
        execSync(`npx remotion still src/index.ts ${logo.id} "${join(outputDir, logo.file)}" --scale ${scale} --quiet`, {
            cwd: rootDir,
            stdio: 'inherit',
        });
    } catch {
        console.error(`Failed to render ${logo.id}`);
        process.exit(1);
    }
});

// Copy trident-only to public assets for slide usage
const tridentSrc = join(outputDir, 'logo-trident-only.png');
const tridentDst = join(rootDir, 'public', 'assets', 'png', 'logo-trident-only.png');
try {
    mkdirSync(dirname(tridentDst), { recursive: true });
    copyFileSync(tridentSrc, tridentDst);
    console.log(`Copied logo-trident-only.png -> public/assets/png/`);
} catch (e) {
    console.warn(`Warning: Could not copy trident PNG to public assets: ${e.message}`);
}

console.log(`All ${logos.length} logo variants rendered successfully.`);
