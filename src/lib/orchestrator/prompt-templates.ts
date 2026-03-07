/**
 * Orchestrator Workbench v2.0 — Prompt Templates
 * System prompts and user message templates for all LLM roles.
 */

import { USE_CASE_DEFINITIONS } from './use-cases'
import type { AuditEvent, GovernScore } from './types'

// ─── Intent Parser Prompts ───────────────────────────────────────────────────

const INTENT_SYSTEM_PROMPT = `You are an intent parser for a banking orchestrator workbench.
Your job is to analyze user input (Japanese or English) and extract:
1. The best-matching use case ID (UC-01 through UC-10) or null
2. Which engine(s) are relevant: dashboard, protect, grow, execute, govern
3. Risk level: low, medium, high, critical
4. Confidence score: 0.0 to 1.0

Available use cases:
${Object.entries(USE_CASE_DEFINITIONS)
  .map(([id, def]) => `- ${id}: ${def.nameJa} (${def.name}) [engines: ${def.engines.join(', ')}]`)
  .join('\n')}

Respond ONLY in valid JSON format:
{
  "useCase": "UC-XX" | null,
  "engines": ["engine1", ...],
  "riskLevel": "low" | "medium" | "high" | "critical",
  "confidence": 0.0-1.0,
  "reasoning": "Brief explanation"
}`

export function buildIntentPrompt(userInput: string): string {
  return `${INTENT_SYSTEM_PROMPT}\n\nUser input: "${userInput}"`
}

export function getIntentSystemPrompt(): string {
  return INTENT_SYSTEM_PROMPT
}

// ─── Audit Translation Prompts ───────────────────────────────────────────────

const AUDIT_TRANSLATION_SYSTEM = `You are an audit trail translator for a banking compliance system.
Convert technical audit events into clear, human-readable Japanese descriptions.
The audience is compliance officers and auditors who need to understand what happened.
Be precise, factual, and include relevant IDs/timestamps.
Keep each translation to 1-2 sentences.`

export function buildAuditTranslationPrompt(event: AuditEvent): string {
  return `Translate this audit event into plain Japanese:

Event Type: ${event.type}
Timestamp: ${event.timestamp}
Actor: ${event.actor.label} (${event.actor.type})
Payload: ${JSON.stringify(event.payload, null, 2)}
Hash: ${event.hash.slice(0, 8)}...`
}

export function getAuditTranslationSystemPrompt(): string {
  return AUDIT_TRANSLATION_SYSTEM
}

// ─── AI Insight Prompts ──────────────────────────────────────────────────────

const INSIGHT_SYSTEM_PROMPT = `You are an AI financial analyst for a Japanese banking orchestrator.
Provide concise, actionable insights based on the data provided.
Format your response in structured sections:
1. 概要 (Summary): 1-2 sentences
2. 主要リスク (Key Risks): bullet points
3. 推奨アクション (Recommended Actions): numbered list
4. 信頼度 (Confidence): percentage

Always include quantitative evidence when available.
Respond in Japanese unless the input is in English.`

export function buildInsightPrompt(context: {
  useCase: string
  data: Record<string, unknown>
  question?: string
}): string {
  return `${INSIGHT_SYSTEM_PROMPT}

Use Case: ${context.useCase}
Data Context: ${JSON.stringify(context.data, null, 2)}
${context.question ? `Specific Question: ${context.question}` : '分析してインサイトを提供してください。'}`
}

// ─── Risk Assessment Prompts ─────────────────────────────────────────────────

const RISK_SYSTEM_PROMPT = `You are a risk assessment model for a banking orchestrator.
Evaluate the risk level of proposed actions considering:
1. Financial impact (金額影響)
2. Reversibility (可逆性)
3. Regulatory implications (規制影響)
4. Scope of affected systems/users (影響範囲)

Respond in JSON:
{
  "riskLevel": "low" | "medium" | "high" | "critical",
  "factors": [{ "name": string, "score": 0.0-1.0, "reasoning": string }],
  "recommendation": string,
  "requiredApprovals": number
}`

export function buildRiskAssessmentPrompt(action: {
  label: string
  description: string
  context: Record<string, unknown>
}): string {
  return `${RISK_SYSTEM_PROMPT}

Action: ${action.label}
Description: ${action.description}
Context: ${JSON.stringify(action.context, null, 2)}`
}

// ─── Govern Score Explanation Prompts ─────────────────────────────────────────

export function buildGovernScoreExplanationPrompt(score: GovernScore): string {
  return `Explain this governance score in clear Japanese for a compliance officer:

Overall: ${score.overall}/100
Dimensions:
- 監査性 (Auditability): ${score.dimensions.auditability}/100
- 説明可能性 (Explainability): ${score.dimensions.explainability}/100
- コンプライアンス (Compliance): ${score.dimensions.compliance}/100
- 人間監視 (Human Oversight): ${score.dimensions.humanOversight}/100

Computed at: ${score.computedAt}

Provide:
1. A 1-sentence overall assessment
2. The weakest dimension and why it matters
3. One specific recommendation to improve the score`
}

// ─── Template Registry ───────────────────────────────────────────────────────

export const PROMPT_TEMPLATES = {
  intent: { system: getIntentSystemPrompt, build: buildIntentPrompt },
  auditTranslation: { system: getAuditTranslationSystemPrompt, build: buildAuditTranslationPrompt },
  insight: { build: buildInsightPrompt },
  riskAssessment: { build: buildRiskAssessmentPrompt },
  governExplanation: { build: buildGovernScoreExplanationPrompt },
} as const
