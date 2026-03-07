/**
 * Orchestrator Workbench v2.0 — Intent Resolution Hook
 * Resolves natural language input into IntentResult via keyword matching (offline)
 * or LLM API (online, future Chunk 7).
 */

import { useCallback } from 'react'
import { generateId } from '@/lib/orchestrator/crypto'
import { resolveUseCaseByKeywords, USE_CASE_DEFINITIONS, USE_CASE_LAYOUTS } from '@/lib/orchestrator/use-cases'
import type { IntentResult, UseCaseId, EngineName, RiskLevel, TierLevel } from '@/lib/orchestrator/types'

interface ResolveOptions {
  isOffline?: boolean
}

export function useIntentResolver() {
  const resolve = useCallback(
    async (rawInput: string, options?: ResolveOptions): Promise<IntentResult> => {
      // Phase 1: Keyword-based resolution (mock/offline fallback)
      const useCaseId = resolveUseCaseByKeywords(rawInput)

      if (useCaseId) {
        const def = USE_CASE_DEFINITIONS[useCaseId]
        const layout = USE_CASE_LAYOUTS[useCaseId]

        return {
          id: generateId(),
          rawInput,
          engines: def.engines as EngineName[],
          useCase: useCaseId,
          tier: def.tier as TierLevel,
          riskLevel: def.riskLevel as RiskLevel,
          bentoLayout: layout,
          requiredData: layout.cards.map((c) => ({
            id: c.id,
            type: c.type,
            label: c.id.replace(/-/g, ' '),
          })),
          suggestedActions: [],
          confidence: 0.75,
          resolvedAt: new Date().toISOString(),
        }
      }

      // No match — return a default dashboard layout
      return {
        id: generateId(),
        rawInput,
        engines: ['dashboard'] as EngineName[],
        useCase: null,
        tier: 1 as TierLevel,
        riskLevel: 'low' as RiskLevel,
        bentoLayout: {
          columns: 3,
          primaryEngine: 'dashboard' as EngineName,
          cards: [
            { id: 'generic-insight', type: 'ai-insight', colSpan: 2, rowSpan: 2, engine: 'dashboard' as EngineName, priority: 1 },
            { id: 'generic-kpi-1', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'dashboard' as EngineName, priority: 2 },
            { id: 'generic-kpi-2', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'dashboard' as EngineName, priority: 3 },
            { id: 'generic-trend', type: 'trend-chart', colSpan: 3, rowSpan: 1, engine: 'dashboard' as EngineName, priority: 4 },
          ],
        },
        requiredData: [],
        suggestedActions: [],
        confidence: 0.3,
        resolvedAt: new Date().toISOString(),
      }
    },
    [],
  )

  return { resolve }
}
