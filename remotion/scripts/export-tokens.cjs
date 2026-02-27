/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..', '..');
const remotionDir = path.join(repoRoot, 'remotion');
const tmpDir = path.join(remotionDir, '.tmp', 'token-export');
const tscConfig = path.join(remotionDir, 'tsconfig.tokens.json');

const designTokensJson = path.join(repoRoot, 'design-tokens', 'tokens.json');
const designTokensTs = path.join(repoRoot, 'design-tokens', 'tokens.ts');
const prototypeTokensCss = path.join(repoRoot, 'prototype', 'src', 'styles', 'tokens.css');

const ensureCleanDir = (dir) => {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
};

const toPx = (value) => (typeof value === 'number' ? `${value}px` : value);

const buildTokens = (theme) => {
  const glassBorder = theme.glass.glassBorderSubtle ?? theme.glass.glassBorder;

  return {
    color: {
      background: {
        deepNavy: theme.background.deepNavy,
        abyssBlack: theme.background.abyss,
        navy: theme.background.navy,
        surface: theme.background.surface,
      },
      accent: {
        ...theme.accent,
      },
      semantic: {
        ...theme.semantic,
      },
      surface: {
        glassBorder,
        glassGlow: theme.glass.glassGlow,
      },
    },
    text: {
      ...theme.text,
    },
    radius: {
      ...theme.radius,
    },
    state: {
      ...theme.state,
    },
    motion: {
      ...theme.motion,
    },
    typography: {
      fontFamily: {
        ui: theme.typography.fontUi,
        header: theme.typography.fontHeader,
        mono: theme.typography.fontMono,
      },
      numeric: {
        featureSettings: theme.typography.numericFeatureSettings,
        variant: theme.typography.numericVariant,
      },
      scale: {
        xs: theme.typography.textXs,
        sm: theme.typography.textSm,
        base: theme.typography.textBase,
        lg: theme.typography.textLg,
        xl: theme.typography.textXl,
        '2xl': theme.typography.text2xl,
        '3xl': theme.typography.text3xl,
        '4xl': theme.typography.text4xl,
        '5xl': theme.typography.text5xl,
        '6xl': theme.typography.text6xl,
      },
    },
    spacing: {
      1: theme.spacing.space1,
      2: theme.spacing.space2,
      3: theme.spacing.space3,
      4: theme.spacing.space4,
      5: theme.spacing.space5,
      6: theme.spacing.space6,
      8: theme.spacing.space8,
      10: theme.spacing.space10,
      12: theme.spacing.space12,
      16: theme.spacing.space16,
      20: theme.spacing.space20,
      24: theme.spacing.space24,
    },
    glass: {
      blur: toPx(theme.glass.glassBlur),
      border: `1px solid ${glassBorder}`,
      glow: theme.glass.glassGlow,
    },
    surface: {
      ...theme.surface,
    },
    chart: {
      ...theme.chart,
    },
    breakpoints: {
      sm: toPx(theme.breakpoints.sm),
      md: toPx(theme.breakpoints.md),
      lg: toPx(theme.breakpoints.lg),
      xl: toPx(theme.breakpoints.xl),
    },
    layout: {
      ...theme.layout,
    },
  };
};

const buildCssVars = (theme) => [
  ['--font-display', theme.typography.fontHeader],
  ['--font-body', theme.typography.fontUi],
  ['--font-mono', theme.typography.fontMono],
  ['--bg', theme.background.navy],
  ['--bg-deep', theme.background.deepNavy],
  ['--bg-surface', theme.background.surface],
  ['--glass-bg', theme.glass.glassBg],
  ['--glass-bg-strong', theme.glass.glassBgStrong],
  ['--glass-bg-soft', theme.glass.glassBgSoft ?? theme.glass.glassBg],
  ['--glass-border', theme.glass.glassBorderSubtle ?? theme.glass.glassBorder],
  ['--glass-border-strong', theme.glass.glassBorder],
  ['--glass-shadow', theme.glass.glassShadow],
  ['--glass-inset', theme.glass.glassInsetHighlight],
  ['--glass-edge', theme.glass.glassEdge],
  ['--glass-backdrop', theme.glass.glassBackdrop],
  ['--text', theme.text.primary],
  ['--muted', theme.text.muted],
  ['--muted-2', theme.text.muted2],
  ['--accent-cyan', theme.accent.cyan],
  ['--accent-teal', theme.accent.teal],
  ['--accent-violet', theme.accent.violet],
  ['--accent-amber', theme.accent.amber],
  ['--accent-blue', theme.accent.blue],
  ['--accent-red', theme.accent.red],
  ['--accent-gold', theme.accent.gold],
  ['--engine-dashboard', theme.accent.cyan],
  ['--engine-protect', theme.accent.teal],
  ['--engine-grow', theme.accent.violet],
  ['--engine-execute', theme.accent.amber],
  ['--engine-govern', theme.accent.blue],
  ['--neon-cyan', theme.neon.cyan.standard],
  ['--neon-teal', theme.neon.teal.standard],
  ['--neon-violet', theme.neon.violet.standard],
  ['--neon-amber', theme.neon.amber.standard],
  ['--neon-blue', theme.neon.blue.standard],
  ['--neon-red', theme.neon.red.standard],
  ['--text-gradient-cyan', theme.gradientText.cyan],
  ['--text-gradient-teal', theme.gradientText.teal],
  ['--text-gradient-violet', theme.gradientText.violet],
  ['--text-gradient-amber', theme.gradientText.amber],
  ['--text-gradient-blue', theme.gradientText.blue],
  ['--text-shadow-neon', theme.textShadowNeon],
  ['--badge-bg', theme.complianceBadge.background],
  ['--badge-border', theme.complianceBadge.border],
  ['--badge-text', theme.complianceBadge.color],
  ['--badge-shadow', theme.complianceBadge.textShadow],
  ['--badge-box', theme.complianceBadge.boxShadow],
  ['--warning-bg', theme.warningBadge.background],
  ['--warning-border', theme.warningBadge.border],
  ['--warning-text', theme.warningBadge.color],
  ['--warning-shadow', theme.warningBadge.textShadow],
  ['--warning-box', theme.warningBadge.boxShadow],
  ['--radius-lg', theme.radius.lg],
  ['--radius-md', theme.radius.md],
  ['--radius-sm', theme.radius.sm],
  ['--state-hover-bg', theme.state.hoverBg],
  ['--state-active-bg', theme.state.activeBg],
  ['--state-focus-ring', theme.state.focusRing],
  ['--state-disabled-text', theme.state.disabledText],
  ['--state-error-border', theme.state.errorBorder],
  ['--state-success-border', theme.state.successBorder],
  ['--state-loading-bg', theme.state.loadingBg],
  ['--motion-duration-fast', theme.motion.duration.fast],
  ['--motion-duration-base', theme.motion.duration.base],
  ['--motion-duration-slow', theme.motion.duration.slow],
  ['--motion-easing-standard', theme.motion.easing.standard],
  ['--motion-easing-emphasized', theme.motion.easing.emphasized],
  ['--bp-sm', toPx(theme.breakpoints.sm)],
  ['--bp-md', toPx(theme.breakpoints.md)],
  ['--bp-lg', toPx(theme.breakpoints.lg)],
  ['--bp-xl', toPx(theme.breakpoints.xl)],
  ['--container-max', theme.layout.containerMax],
  ['--content-max', theme.layout.contentMax],
  ['--grid-gap', theme.layout.gridGap],
  ['--section-gap', theme.layout.sectionGap],
];

const writeJson = (filePath, data) => {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
};

const writeTs = (filePath, data) => {
  const serialized = JSON.stringify(data, null, 2);
  const body = `/**\n * AUTO-GENERATED from remotion/src/shared/theme.ts\n * Do not edit by hand. Run: node remotion/scripts/export-tokens.cjs\n */\n\nexport const tokens = ${serialized} as const;\n`;
  fs.writeFileSync(filePath, body);
};

const writeCss = (filePath, vars) => {
  const lines = vars.map(([name, value]) => `  ${name}: ${value};`).join('\n');
  const body = `/* AUTO-GENERATED from remotion/src/shared/theme.ts */\n:root {\n${lines}\n}\n`;
  fs.writeFileSync(filePath, body);
};

const run = () => {
  ensureCleanDir(tmpDir);
  const localTsc = path.join(remotionDir, 'node_modules', '.bin', 'tsc');
  const tscBin = fs.existsSync(localTsc) ? `"${localTsc}"` : 'npx tsc';
  execSync(`${tscBin} -p ${tscConfig}`, { stdio: 'inherit', cwd: repoRoot });

  const themePath = path.join(tmpDir, 'shared', 'theme.js');
  const { theme } = require(themePath);

  const tokens = buildTokens(theme);
  writeJson(designTokensJson, tokens);
  writeTs(designTokensTs, tokens);
  writeCss(prototypeTokensCss, buildCssVars(theme));

  console.log('Tokens exported successfully.');
};

run();
