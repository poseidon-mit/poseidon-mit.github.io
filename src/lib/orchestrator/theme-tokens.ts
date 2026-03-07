/**
 * Orchestrator Workbench v2.0 — Theme Tokens
 * Standard (Cyan) vs Govern (Deep Blue) mode tokens.
 */

import type { ThemeMode } from './types'

export const THEME_STANDARD: ThemeMode = {
  mode: 'standard',
  primaryColor: 'var(--engine-dashboard)',
  backgroundClass: 'app-bg-oled',
  accentGlow: 'neon-glow-dashboard',
  auditTrailExpanded: false,
}

export const THEME_GOVERN: ThemeMode = {
  mode: 'govern',
  primaryColor: 'var(--engine-govern)',
  backgroundClass: 'app-bg-govern-deep',
  accentGlow: 'neon-glow-govern',
  auditTrailExpanded: true,
}

export function getThemeMode(mode: 'standard' | 'govern'): ThemeMode {
  return mode === 'govern' ? THEME_GOVERN : THEME_STANDARD
}

/** CSS custom properties applied to the workbench root */
export function getThemeCSSVars(theme: ThemeMode): Record<string, string> {
  return {
    '--wb-primary': theme.primaryColor,
    '--wb-glow': theme.mode === 'govern' ? 'var(--engine-govern)' : 'var(--engine-dashboard)',
    '--wb-surface': theme.mode === 'govern'
      ? 'hsl(220 30% 8%)'
      : 'hsl(220 20% 4%)',
    '--wb-surface-card': theme.mode === 'govern'
      ? 'hsl(220 25% 12% / 0.8)'
      : 'hsl(220 15% 8% / 0.8)',
    '--wb-border': theme.mode === 'govern'
      ? 'hsl(220 40% 25% / 0.3)'
      : 'hsl(200 30% 20% / 0.2)',
  }
}
