/**
 * Shared Grow Simulation Data (RE-EXPORT SHIM)
 *
 * All data has been migrated to canonical.ts.
 * This file re-exports for backward compatibility.
 * Will be removed in Phase 4 when all Grow consumers migrate to canonical selectors directly.
 */

import {
  selectGrowSimulationData,
  selectProjected3yAdvantage,
} from '@/domain/poseidon-universe'

export const GROWTH_SIMULATION_DATA = selectGrowSimulationData()
export const PROJECTED_3Y_ADVANTAGE = selectProjected3yAdvantage()
