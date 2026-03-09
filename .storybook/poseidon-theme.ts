import { create } from '@storybook/theming/create'

export default create({
  base: 'dark',
  brandTitle: 'Poseidon Design System v2',
  brandUrl: '/',

  // UI
  appBg: '#0B1221',
  appContentBg: '#0f172a',
  appBorderColor: 'rgba(255, 255, 255, 0.08)',
  appBorderRadius: 12,

  // Typography
  fontBase: "'Inter', 'Noto Sans JP', system-ui, sans-serif",
  fontCode: "'JetBrains Mono', monospace",

  // Text
  textColor: '#f8fafc',
  textMutedColor: 'rgba(255, 255, 255, 0.6)',
  textInverseColor: '#0B1221',

  // Toolbar
  barTextColor: 'rgba(255, 255, 255, 0.7)',
  barSelectedColor: '#00F0FF',
  barBg: '#0f172a',
  barHoverColor: '#00F0FF',

  // Colors
  colorPrimary: '#00F0FF',
  colorSecondary: '#8B5CF6',

  // Inputs
  inputBg: 'rgba(255, 255, 255, 0.05)',
  inputBorder: 'rgba(255, 255, 255, 0.1)',
  inputTextColor: '#f8fafc',
  inputBorderRadius: 8,

  // Booleans
  booleanBg: 'rgba(255, 255, 255, 0.05)',
  booleanSelectedBg: '#00F0FF',
})
