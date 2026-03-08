/**
 * Artifact Builders — Convert IntentResult data into ChatArtifact objects
 * for inline rendering in the chat thread.
 */

import type {
  IntentResult,
  ChatArtifact,
  ActionSpec,
  EngineName,
  DataSourceRef,
} from '../types'
import { generateId } from '../crypto'

// ─── KPI Artifact ───────────────────────────────────────────────────────────

export function buildKpiArtifacts(intent: IntentResult): ChatArtifact[] {
  const kpiCards = intent.bentoLayout.cards.filter((c) => c.type === 'kpi-metric')
  return kpiCards.map((card) => ({
    id: generateId(),
    type: 'kpi-metric' as const,
    title: `KPI — ${card.engine.charAt(0).toUpperCase() + card.engine.slice(1)} Engine`,
    engine: card.engine,
    data: {
      cardSpec: card,
      dataSource: card.dataSource ?? null,
    },
    metadata: {
      dataSource: card.dataSource,
      confidence: intent.confidence,
      riskLevel: intent.riskLevel,
    },
  }))
}

// ─── Chart / Trend Artifact ─────────────────────────────────────────────────

export function buildChartArtifact(intent: IntentResult): ChatArtifact | null {
  const chartCard = intent.bentoLayout.cards.find((c) => c.type === 'trend-chart')
  if (!chartCard) return null
  return {
    id: generateId(),
    type: 'trend-chart',
    title: 'Trend Analysis',
    engine: chartCard.engine,
    data: { cardSpec: chartCard },
    metadata: {
      confidence: intent.confidence,
      riskLevel: intent.riskLevel,
    },
  }
}

// ─── Risk Heatmap Artifact ──────────────────────────────────────────────────

export function buildHeatmapArtifact(intent: IntentResult): ChatArtifact | null {
  const heatmapCard = intent.bentoLayout.cards.find((c) => c.type === 'risk-heatmap')
  if (!heatmapCard) return null
  return {
    id: generateId(),
    type: 'risk-heatmap',
    title: 'Risk Heatmap',
    engine: heatmapCard.engine,
    data: { cardSpec: heatmapCard },
    metadata: {
      confidence: intent.confidence,
      riskLevel: intent.riskLevel,
    },
  }
}

// ─── Simulation Artifact ────────────────────────────────────────────────────

export function buildSimulationArtifact(intent: IntentResult): ChatArtifact | null {
  const simCard = intent.bentoLayout.cards.find((c) => c.type === 'simulation-result')
  if (!simCard) return null
  return {
    id: generateId(),
    type: 'simulation-result',
    title: 'Simulation Result',
    engine: simCard.engine,
    data: { cardSpec: simCard },
    metadata: {
      confidence: intent.confidence,
      riskLevel: intent.riskLevel,
    },
  }
}

// ─── Data Table Artifact ────────────────────────────────────────────────────

export function buildTableArtifact(intent: IntentResult): ChatArtifact | null {
  const tableCard = intent.bentoLayout.cards.find((c) => c.type === 'data-table')
  if (!tableCard) return null
  return {
    id: generateId(),
    type: 'data-table',
    title: 'Data Overview',
    engine: tableCard.engine,
    data: { cardSpec: tableCard },
    metadata: {
      dataSource: tableCard.dataSource,
      confidence: intent.confidence,
    },
  }
}

// ─── Friction Gate Artifact ─────────────────────────────────────────────────

export function buildFrictionGateArtifact(
  action: ActionSpec,
  intentId: string,
  frictionTier: 'transparent' | 'confirm' | 'verify' | 'multi-approve',
): ChatArtifact {
  return {
    id: generateId(),
    type: 'friction-gate',
    title: `Authorization Required — ${action.label}`,
    engine: action.engine,
    data: {
      gateType: frictionTier === 'multi-approve' ? 'approval'
        : frictionTier === 'verify' ? 'passkey'
        : 'confirm',
      title: `Authorization: ${action.label}`,
      description: action.description,
      intentId,
      riskLevel: action.riskLevel,
      frictionTier,
      actionLabel: 'Authorize',
      cancelLabel: 'Cancel',
    },
    metadata: {
      riskLevel: action.riskLevel,
    },
  }
}

// ─── Build All Artifacts for Intent ─────────────────────────────────────────

export function buildArtifactsForIntent(intent: IntentResult): ChatArtifact[] {
  const artifacts: ChatArtifact[] = []

  // Always include KPIs
  artifacts.push(...buildKpiArtifacts(intent))

  // Add chart if present
  const chart = buildChartArtifact(intent)
  if (chart) artifacts.push(chart)

  // Add heatmap if present
  const heatmap = buildHeatmapArtifact(intent)
  if (heatmap) artifacts.push(heatmap)

  // Add simulation if present
  const sim = buildSimulationArtifact(intent)
  if (sim) artifacts.push(sim)

  // Add table if present
  const table = buildTableArtifact(intent)
  if (table) artifacts.push(table)

  return artifacts
}
