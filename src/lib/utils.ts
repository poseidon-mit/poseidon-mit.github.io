import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ConfidenceFormat = 'percent' | 'decimal';

interface FormatConfidenceOptions {
  mode?: ConfidenceFormat;
  decimals?: number;
}

/**
 * Formats confidence values safely for UI.
 * Supports decimal inputs (0.94) and whole-percentage inputs (94).
 */
export function formatConfidence(
  value: number,
  { mode = 'percent', decimals = 2 }: FormatConfidenceOptions = {},
): string {
  const safe = Number.isFinite(value) ? value : 0;

  if (mode === 'decimal') {
    const decimal = safe > 1 ? safe / 100 : safe;
    return decimal.toFixed(decimals);
  }

  const percent = safe <= 1 ? safe * 100 : safe;
  return `${Math.round(percent)}%`;
}
