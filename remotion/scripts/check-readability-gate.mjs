import { readFileSync } from 'fs';
import { resolve } from 'path';

const MIN_TEXT_OPACITY = 0.5;
const MIN_NORMAL_TEXT_CONTRAST = 4.5;
const MIN_LARGE_TEXT_CONTRAST = 3;
const TARGETS = [
  'src/Slide01Title.tsx',
  'src/Slide02Problem.tsx',
  'src/Slide03WhyNow.tsx',
  'src/Slide04Solution.tsx',
  'src/Slide05Differentiation.tsx',
  'src/Slide06Business.tsx',
  'src/Slide07Demo.tsx',
  'src/Slide08Summary.tsx',
  'src/Slide09Epilogue.tsx',
  'src/v2/active/Slide01TitleV2.tsx',
  'src/v2/active/Slide02ProblemV2.tsx',
  'src/v2/active/Slide02ProblemOptionA.tsx',
  'src/v2/active/Slide03WhyNowV2.tsx',
  'src/v2/active/Slide04Solution3A.tsx',
  'src/v2/active/Slide05DifferentiationV2.tsx',
  'src/v2/active/Slide06BusinessV2.tsx',
  'src/v2/active/Slide07DemoV2.tsx',
  'src/v2/active/Slide08SummaryV2.tsx',
  'src/v2/active/Slide09EpilogueV2.tsx',
  'src/shared/SlideHeader.tsx',
  'src/shared/StatCard.tsx',
  'src/shared/ComparisonTable.tsx',
  'src/shared/QrDockCard.tsx',
];

const colorPattern = /color:\s*'rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([0-9.]+)\s*\)'/g;

const failures = [];

const parseHex = (hex) => {
  const raw = hex.replace('#', '').trim();
  if (raw.length !== 6) {
    return null;
  }
  return {
    r: Number.parseInt(raw.slice(0, 2), 16),
    g: Number.parseInt(raw.slice(2, 4), 16),
    b: Number.parseInt(raw.slice(4, 6), 16),
  };
};

const srgbToLinear = (value) => {
  const v = value / 255;
  if (v <= 0.03928) {
    return v / 12.92;
  }
  return ((v + 0.055) / 1.055) ** 2.4;
};

const luminance = (rgb) =>
  0.2126 * srgbToLinear(rgb.r) +
  0.7152 * srgbToLinear(rgb.g) +
  0.0722 * srgbToLinear(rgb.b);

const contrastRatio = (fgHex, bgHex) => {
  const fg = parseHex(fgHex);
  const bg = parseHex(bgHex);
  if (!fg || !bg) {
    return null;
  }
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
};

const slide02ContrastPairs = [
  {
    name: 'Slide02 title red on deep navy',
    fg: '#EF4444',
    bg: '#020410',
    min: MIN_LARGE_TEXT_CONTRAST,
  },
  {
    name: 'Slide02 body text on dark glass',
    fg: '#F8FAFC',
    bg: '#0B1522',
    min: MIN_NORMAL_TEXT_CONTRAST,
  },
  {
    name: 'Slide02 annotation chips',
    fg: '#FCA5A5',
    bg: '#111827',
    min: MIN_NORMAL_TEXT_CONTRAST,
  },
  {
    name: 'Slide02 legend text',
    fg: '#E5E7EB',
    bg: '#08111A',
    min: MIN_NORMAL_TEXT_CONTRAST,
  },
  {
    name: 'Slide02 YOU cyan highlight',
    fg: '#00F0FF',
    bg: '#0A1A23',
    min: MIN_LARGE_TEXT_CONTRAST,
  },
];

for (const relativePath of TARGETS) {
  const fullPath = resolve(process.cwd(), relativePath);
  const source = readFileSync(fullPath, 'utf8');
  const lines = source.split('\n');

  lines.forEach((line, index) => {
    const matches = [...line.matchAll(colorPattern)];
    matches.forEach((match) => {
      const opacity = Number(match[1]);
      if (!Number.isNaN(opacity) && opacity < MIN_TEXT_OPACITY) {
        failures.push(`${relativePath}:${index + 1} opacity ${opacity} < ${MIN_TEXT_OPACITY}`);
      }
    });
  });
}

for (const pair of slide02ContrastPairs) {
  const ratio = contrastRatio(pair.fg, pair.bg);
  if (ratio === null) {
    failures.push(`Contrast parse failure: ${pair.name}`);
    continue;
  }
  if (ratio < pair.min) {
    failures.push(
      `Contrast failure: ${pair.name} ratio ${ratio.toFixed(2)} < ${pair.min.toFixed(2)}`
    );
  }
}

if (failures.length > 0) {
  console.error('Readability gate failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Readability gate passed (minimum text opacity ${MIN_TEXT_OPACITY}).`);
