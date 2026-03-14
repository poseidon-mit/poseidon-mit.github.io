function hasPerformanceApi(): boolean {
  return typeof performance !== 'undefined' && typeof performance.mark === 'function';
}

export function markPerformance(name: string): void {
  if (!hasPerformanceApi()) return;
  try {
    performance.mark(name);
  } catch {
    // Ignore unsupported or duplicate mark issues.
  }
}

export function measurePerformance(name: string, startMark: string, endMark: string): void {
  if (typeof performance === 'undefined' || typeof performance.measure !== 'function') return;
  try {
    performance.measure(name, startMark, endMark);
  } catch {
    // Ignore missing mark errors in non-observed flows.
  }
}
