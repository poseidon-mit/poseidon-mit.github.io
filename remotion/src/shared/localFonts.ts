/**
 * Local font loader — network-independent.
 * Loads all deck fonts from public/fonts/ via Remotion's staticFile().
 *
 * Run `npm run download-fonts` once to populate public/fonts/.
 * After that, rendering works without any internet access.
 */

import { continueRender, delayRender, staticFile } from 'remotion';

type FontEntry = {
  family: string;
  file: string;
  /** CSS font-weight range, e.g. '300 700' for variable font */
  weight: string;
  style?: string;
};

const FONT_ENTRIES: FontEntry[] = [
  { family: 'Space Grotesk',   file: 'fonts/SpaceGrotesk-latin.woff2',   weight: '300 700' },
  { family: 'Inter',           file: 'fonts/Inter-latin.woff2',           weight: '100 900' },
  { family: 'JetBrains Mono',  file: 'fonts/JetBrainsMono-latin.woff2',  weight: '100 800' },
  { family: 'Noto Sans JP',    file: 'fonts/NotoSansJP-latin.woff2',     weight: '400 700' },
  { family: 'Outfit',          file: 'fonts/Outfit-latin.woff2',          weight: '100 900' },
  { family: 'Sora',            file: 'fonts/Sora-latin.woff2',            weight: '100 800' },
];

export function loadLocalFonts(): void {
  for (const entry of FONT_ENTRIES) {
    const handle = delayRender(`Loading local font: ${entry.family}`);
    const fontFace = new FontFace(
      entry.family,
      `url('${staticFile(entry.file)}') format('woff2')`,
      { weight: entry.weight, style: entry.style ?? 'normal' },
    );
    fontFace
      .load()
      .then(() => {
        document.fonts.add(fontFace);
        continueRender(handle);
      })
      .catch(() => {
        // Non-fatal: fall back to system font
        continueRender(handle);
      });
  }
}
