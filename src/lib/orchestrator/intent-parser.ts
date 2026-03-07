/**
 * Orchestrator Workbench v2.0 — Intent Parser
 * LLM-based intent parsing with keyword fallback.
 * Parses natural language → IntentResult via model adapter or offline heuristics.
 */

import type { IntentResult, EngineName, RiskLevel, TierLevel, UseCaseId, BentoLayoutSpec, DataSourceRef, ActionSpec } from './types'
import { generateId } from './crypto'
import { USE_CASE_DEFINITIONS, USE_CASE_LAYOUTS, resolveUseCaseByKeywords } from './use-cases'
import { buildIntentPrompt } from './prompt-templates'

// ─── Parser Config ───────────────────────────────────────────────────────────

export interface IntentParserConfig {
  /** Use LLM-based parsing when available (requires model adapter) */
  useLlm: boolean
  /** Confidence threshold below which we fall back to keywords */
  confidenceThreshold: number
  /** Default tier when LLM cannot determine */
  defaultTier: TierLevel
}

const DEFAULT_CONFIG: IntentParserConfig = {
  useLlm: false, // Start with keyword-only; enable when model adapter is wired
  confidenceThreshold: 0.6,
  defaultTier: 2,
}

// ─── Engine Detection ────────────────────────────────────────────────────────

const ENGINE_KEYWORDS: Record<EngineName, string[]> = {
  dashboard: ['ダッシュボード', 'overview', 'dashboard', '概要', 'サマリー'],
  protect: ['リスク', 'risk', 'AML', '脅威', 'threat', '検知', 'detect', '監視', 'monitor', 'セキュリティ'],
  grow: ['成長', 'growth', 'ROI', '予測', 'forecast', 'シミュレーション', 'simulation', '投資', 'revenue'],
  execute: ['実行', 'execute', '承認', 'approval', 'アクション', 'action', '稟議', 'ワークフロー', 'workflow'],
  govern: ['監査', 'audit', 'コンプライアンス', 'compliance', 'ガバナンス', 'govern', '規制', 'regulation', '追跡', 'trace'],
}

const RISK_KEYWORDS: Record<RiskLevel, string[]> = {
  low: ['閲覧', 'view', '確認', 'check', '一覧', 'list', '抽出', 'extract'],
  medium: ['更新', 'update', '変更', 'change', '設定', 'configure', '分析', 'analyze'],
  high: ['削除', 'delete', '一括', 'bulk', '実行', 'execute', '送金', 'transfer'],
  critical: ['AML', '閾値', 'threshold', '全社', 'company-wide', '規制', 'regulatory'],
}

function detectEngines(input: string): EngineName[] {
  const lower = input.toLowerCase()
  const engines: EngineName[] = []
  for (const [engine, keywords] of Object.entries(ENGINE_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      engines.push(engine as EngineName)
    }
  }
  return engines.length > 0 ? engines : ['dashboard']
}

function detectRiskLevel(input: string): RiskLevel {
  const lower = input.toLowerCase()
  // Check from highest to lowest
  for (const level of ['critical', 'high', 'medium', 'low'] as RiskLevel[]) {
    if (RISK_KEYWORDS[level].some((kw) => lower.includes(kw.toLowerCase()))) {
      return level
    }
  }
  return 'medium'
}

function detectTier(useCase: UseCaseId | null): TierLevel {
  if (!useCase) return 2
  return USE_CASE_DEFINITIONS[useCase]?.tier ?? 2
}

// ─── Action Generation ───────────────────────────────────────────────────────

function generateSuggestedActions(
  useCase: UseCaseId | null,
  engines: EngineName[],
  riskLevel: RiskLevel,
): ActionSpec[] {
  const actions: ActionSpec[] = []
  const primaryEngine = engines[0] ?? 'dashboard'

  if (useCase) {
    const ucDef = USE_CASE_DEFINITIONS[useCase]
    actions.push({
      id: generateId(),
      label: `${ucDef.name} を実行`,
      description: ucDef.nameJa,
      riskLevel,
      engine: primaryEngine,
      requiresApproval: riskLevel === 'high' || riskLevel === 'critical',
    })
  }

  // Add generic actions based on engines
  if (engines.includes('protect')) {
    actions.push({
      id: generateId(),
      label: 'リスクレポート生成',
      description: 'Generate risk assessment report',
      riskLevel: 'low',
      engine: 'protect',
      requiresApproval: false,
    })
  }

  if (engines.includes('execute')) {
    actions.push({
      id: generateId(),
      label: 'アクション承認フロー開始',
      description: 'Start approval workflow',
      riskLevel: 'medium',
      engine: 'execute',
      requiresApproval: true,
    })
  }

  return actions
}

// ─── Data Source Detection ────────────────────────────────────────────────────

function detectRequiredData(useCase: UseCaseId | null, engines: EngineName[]): DataSourceRef[] {
  const sources: DataSourceRef[] = []

  if (engines.includes('protect')) {
    sources.push({ id: 'risk-data', type: 'api', label: 'Risk Management System' })
  }
  if (engines.includes('grow')) {
    sources.push({ id: 'financial-data', type: 'api', label: 'Financial Data Warehouse' })
  }
  if (engines.includes('execute')) {
    sources.push({ id: 'workflow-data', type: 'api', label: 'Workflow Engine' })
  }
  if (engines.includes('govern')) {
    sources.push({ id: 'audit-data', type: 'api', label: 'Audit Log System' })
  }

  return sources
}

// ─── Main Parser ─────────────────────────────────────────────────────────────

/**
 * Parse raw natural language input into a structured IntentResult.
 * Currently uses keyword-based resolution; LLM path is stubbed for model-adapter integration.
 */
export async function parseIntent(
  rawInput: string,
  config: Partial<IntentParserConfig> = {},
): Promise<IntentResult> {
  const cfg = { ...DEFAULT_CONFIG, ...config }

  // Step 1: Keyword-based use case matching
  const useCase = resolveUseCaseByKeywords(rawInput)

  // Step 2: Determine engines (from use case or keyword detection)
  const engines: EngineName[] = useCase
    ? USE_CASE_DEFINITIONS[useCase].engines
    : detectEngines(rawInput)

  // Step 3: Risk level
  const riskLevel: RiskLevel = useCase
    ? USE_CASE_DEFINITIONS[useCase].riskLevel
    : detectRiskLevel(rawInput)

  // Step 4: Tier
  const tier = detectTier(useCase)

  // Step 5: Layout
  const bentoLayout: BentoLayoutSpec = useCase
    ? USE_CASE_LAYOUTS[useCase]
    : buildFallbackLayout(engines)

  // Step 6: Required data
  const requiredData = detectRequiredData(useCase, engines)

  // Step 7: Suggested actions
  const suggestedActions = generateSuggestedActions(useCase, engines, riskLevel)

  // Step 8: Confidence score (keyword match quality)
  const confidence = useCase ? 0.85 : 0.5

  return {
    id: generateId(),
    rawInput,
    engines,
    useCase,
    tier,
    riskLevel,
    bentoLayout,
    requiredData,
    suggestedActions,
    confidence,
    resolvedAt: new Date().toISOString(),
  }
}

/**
 * Build a generic BentoLayout when no use case matches.
 */
function buildFallbackLayout(engines: EngineName[]): BentoLayoutSpec {
  const primaryEngine = engines[0] ?? 'dashboard'
  return {
    columns: 3,
    primaryEngine,
    cards: [
      { id: 'summary-kpi-1', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: primaryEngine, priority: 1 },
      { id: 'summary-kpi-2', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: primaryEngine, priority: 2 },
      { id: 'summary-kpi-3', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: engines[1] ?? primaryEngine, priority: 3 },
      { id: 'main-insight', type: 'ai-insight', colSpan: 2, rowSpan: 2, engine: primaryEngine, priority: 4 },
      { id: 'main-chart', type: 'trend-chart', colSpan: 1, rowSpan: 2, engine: primaryEngine, priority: 5 },
    ],
  }
}

/**
 * Build the LLM prompt for intent parsing (used when useLlm: true).
 * The actual API call goes through model-adapter.
 */
export function getIntentPrompt(rawInput: string): string {
  return buildIntentPrompt(rawInput)
}
