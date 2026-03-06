/**
 * Shared Grow Simulation Data
 *
 * Single source of truth for 3-year growth projection values.
 * Consumed by Grow.tsx (page display) and canonical.ts (universe metrics).
 */

export const GROWTH_SIMULATION_DATA = [
  { year: 'Now', baseline: 200000, aiOptimized: 200000, low: 200000, high: 200000 },
  { year: '1Y',  baseline: 204000, aiOptimized: 211584, low: 211480, high: 211690 },
  { year: '2Y',  baseline: 208080, aiOptimized: 223797, low: 223345, high: 224266 },
  { year: '3Y',  baseline: 212242, aiOptimized: 236679, low: 235609, high: 237812 },
] as const

const FINAL_DATA = GROWTH_SIMULATION_DATA[GROWTH_SIMULATION_DATA.length - 1]

/** Projected 3-year advantage: AI-optimized minus baseline */
export const PROJECTED_3Y_ADVANTAGE = FINAL_DATA.aiOptimized - FINAL_DATA.baseline
