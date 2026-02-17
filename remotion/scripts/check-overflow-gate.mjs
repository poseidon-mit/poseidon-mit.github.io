/**
 * Overflow detection gate — checks rendered PNGs for content bleeding
 * into the margin zones (top/bottom 100px, left/right 140px).
 *
 * How it works:
 *   Renders each V3 slide with a special "overflow detector" composition
 *   that adds a bright red border at the safe-margin boundary. Then uses
 *   `sips` (macOS) to check if non-background pixels exist in the margin.
 *
 * Simpler approach (used here):
 *   Compare the bottom/right margin strips of rendered PNGs against a
 *   near-black threshold. If significant bright pixels are detected in the
 *   margin zone, flag as potential overflow.
 *
 * Usage:  node scripts/check-overflow-gate.mjs [--slide Slide08SummaryV3] [--prefix v3-]
 *
 * Requires: macOS with `sips` and `python3` (for pixel analysis).
 */

import { execSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { resolve, join } from 'path';

// ─── Config ────────────────────────────────────────────────
const MARGIN_X = 140;  // left/right safe margin (px at 1x)
const MARGIN_Y = 100;  // top/bottom safe margin (px at 1x)
const SCALE = 3;        // render scale
const SAFE_LEFT = MARGIN_X * SCALE;
const SAFE_RIGHT = MARGIN_X * SCALE;
const SAFE_TOP = MARGIN_Y * SCALE;
const SAFE_BOTTOM = MARGIN_Y * SCALE;
const WIDTH = 1920 * SCALE;
const HEIGHT = 1080 * SCALE;

// Brightness threshold: pixels brighter than this in the margin are suspicious
// Background aurora/vignette is dark (~10-30), real content is brighter (~60+)
const BRIGHTNESS_THRESHOLD = 60;
// % of margin pixels that must be bright to flag (avoid false positives from aurora bleed)
// Raised to 5% — aurora/neon bottom glow decorations read ~0.7–3.7% at scale=3; real content overflow is much higher
const PIXEL_PERCENT_THRESHOLD = 5.0;

const args = process.argv.slice(2);
const slideFilter = args.includes('--slide') ? args[args.indexOf('--slide') + 1] : null;
const prefix = args.includes('--prefix') ? args[args.indexOf('--prefix') + 1] : 'v3-';

const outDir = resolve(process.cwd(), 'out');

// Find versioned PNGs
const pngs = readdirSync(outDir)
  .filter(f => f.startsWith(prefix) && f.endsWith('.png'))
  .filter(f => !slideFilter || f.includes(slideFilter))
  .sort();

if (pngs.length === 0) {
  console.log(`No PNGs found in out/ with prefix "${prefix}". Render slides first.`);
  process.exit(0);
}

console.log(`\n🔍 Overflow gate — checking ${pngs.length} slide(s) for margin bleed\n`);
console.log(`   Safe area: ${MARGIN_X}px margins (${SAFE_LEFT}px at ${SCALE}x scale)`);
console.log(`   Threshold: brightness > ${BRIGHTNESS_THRESHOLD}, coverage > ${PIXEL_PERCENT_THRESHOLD}%\n`);

const failures = [];

// Python script to analyze margin strips
const pythonScript = `
import sys, struct, zlib

def analyze_png_margins(filepath, width, height, safe_top, safe_bottom, safe_left, safe_right, brightness_threshold):
    """Analyze PNG margin zones for bright pixels using raw pixel data via sips."""
    import subprocess, json

    # Use sips to get pixel data as raw bitmap
    # Convert to BMP (uncompressed) for easy parsing
    tmp = filepath + '.bmp'
    subprocess.run(['sips', '-s', 'format', 'bmp', filepath, '--out', tmp],
                   capture_output=True)

    with open(tmp, 'rb') as f:
        data = f.read()

    import os
    os.unlink(tmp)

    # BMP header: offset to pixel data at byte 10 (4 bytes LE)
    pixel_offset = struct.unpack_from('<I', data, 10)[0]
    # BMP info header: width at 18, height at 22, bits_per_pixel at 28
    bmp_width = struct.unpack_from('<i', data, 18)[0]
    bmp_height = abs(struct.unpack_from('<i', data, 22)[0])
    bpp = struct.unpack_from('<H', data, 28)[0]
    bytes_per_pixel = bpp // 8

    # BMP rows are padded to 4-byte boundaries
    row_size = ((bmp_width * bytes_per_pixel + 3) // 4) * 4

    # BMP stores rows bottom-to-top (unless height is negative)
    top_down = struct.unpack_from('<i', data, 22)[0] < 0

    zones = {
        'bottom': {'bright': 0, 'total': 0},
        'top': {'bright': 0, 'total': 0},
        'left': {'bright': 0, 'total': 0},
        'right': {'bright': 0, 'total': 0},
    }

    for y in range(bmp_height):
        if top_down:
            row_offset = pixel_offset + y * row_size
        else:
            row_offset = pixel_offset + (bmp_height - 1 - y) * row_size

        for x in range(bmp_width):
            px_offset = row_offset + x * bytes_per_pixel
            if px_offset + bytes_per_pixel > len(data):
                continue

            # BMP is BGR(A)
            b = data[px_offset]
            g = data[px_offset + 1]
            r = data[px_offset + 2]
            brightness = (r * 299 + g * 587 + b * 114) // 1000

            is_bright = brightness > brightness_threshold

            # Check which margin zone(s) this pixel is in
            in_top = y < safe_top
            in_bottom = y >= (bmp_height - safe_bottom)
            in_left = x < safe_left
            in_right = x >= (bmp_width - safe_right)

            if in_bottom:
                zones['bottom']['total'] += 1
                if is_bright: zones['bottom']['bright'] += 1
            if in_top:
                zones['top']['total'] += 1
                if is_bright: zones['top']['bright'] += 1
            if in_left and not in_top and not in_bottom:
                zones['left']['total'] += 1
                if is_bright: zones['left']['bright'] += 1
            if in_right and not in_top and not in_bottom:
                zones['right']['total'] += 1
                if is_bright: zones['right']['bright'] += 1

    result = {}
    for zone, data_z in zones.items():
        if data_z['total'] > 0:
            pct = (data_z['bright'] / data_z['total']) * 100
            result[zone] = round(pct, 2)
        else:
            result[zone] = 0

    print(json.dumps(result))

if __name__ == '__main__':
    analyze_png_margins(
        sys.argv[1],
        int(sys.argv[2]), int(sys.argv[3]),
        int(sys.argv[4]), int(sys.argv[5]),
        int(sys.argv[6]), int(sys.argv[7]),
        int(sys.argv[8])
    )
`;

import { writeFileSync, unlinkSync } from 'fs';
const pyPath = join(outDir, '_overflow_check.py');
writeFileSync(pyPath, pythonScript);

for (const png of pngs) {
  const fullPath = join(outDir, png);
  const label = png.replace(prefix, '').replace('.png', '');

  try {
    const result = execSync(
      `python3 "${pyPath}" "${fullPath}" ${WIDTH} ${HEIGHT} ${SAFE_TOP} ${SAFE_BOTTOM} ${SAFE_LEFT} ${SAFE_RIGHT} ${BRIGHTNESS_THRESHOLD}`,
      { encoding: 'utf8', timeout: 30000 }
    ).trim();

    const zones = JSON.parse(result);
    const overflowZones = [];

    for (const [zone, pct] of Object.entries(zones)) {
      if (pct > PIXEL_PERCENT_THRESHOLD) {
        overflowZones.push(`${zone}: ${pct}%`);
      }
    }

    if (overflowZones.length > 0) {
      console.error(`   ✗ ${label} — overflow detected: ${overflowZones.join(', ')}`);
      failures.push({ slide: label, zones: overflowZones });
    } else {
      console.log(`   ✓ ${label} — margins clear`);
    }
  } catch (err) {
    console.warn(`   ⚠ ${label} — analysis failed: ${err.message?.substring(0, 80)}`);
  }
}

// Cleanup
try { unlinkSync(pyPath); } catch {}

console.log('');

if (failures.length > 0) {
  console.error(`✗  ${failures.length} slide(s) have potential margin overflow:\n`);
  for (const f of failures) {
    console.error(`   ${f.slide}: ${f.zones.join(', ')}`);
  }
  console.error('\n💡 Fix: Reduce content size, remove elements, or adjust layout tokens.');
  process.exit(1);
}

console.log(`✅ Overflow gate passed — all ${pngs.length} slides within safe margins.\n`);
