/**
 * Orchestrator Workbench v2.0 — Model Adapter
 * Multi-model API adapter for LLM operations (intent parsing, translations, insights).
 * Provides a unified interface with model-specific prompt formatting.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type ModelProvider = 'openai' | 'anthropic' | 'google' | 'local'
export type ModelRole = 'intent-parser' | 'translator' | 'insight-generator' | 'risk-assessor'

export interface ModelConfig {
  provider: ModelProvider
  modelId: string
  displayName: string
  apiEndpoint: string
  maxTokens: number
  temperature: number
  supportedRoles: ModelRole[]
}

export interface CompletionRequest {
  role: ModelRole
  systemPrompt: string
  userMessage: string
  maxTokens?: number
  temperature?: number
  responseFormat?: 'text' | 'json'
}

export interface CompletionResponse {
  content: string
  model: string
  provider: ModelProvider
  tokensUsed: number
  latencyMs: number
  cached: boolean
}

// ─── Default Model Configurations ────────────────────────────────────────────

export const DEFAULT_MODELS: Record<ModelRole, ModelConfig> = {
  'intent-parser': {
    provider: 'openai',
    modelId: 'gpt-4o',
    displayName: 'GPT-4o (Intent)',
    apiEndpoint: '/api/v1/chat/completions',
    maxTokens: 2048,
    temperature: 0.1,
    supportedRoles: ['intent-parser'],
  },
  'translator': {
    provider: 'openai',
    modelId: 'gpt-4o-mini',
    displayName: 'GPT-4o-mini (Translation)',
    apiEndpoint: '/api/v1/chat/completions',
    maxTokens: 1024,
    temperature: 0.3,
    supportedRoles: ['translator'],
  },
  'insight-generator': {
    provider: 'anthropic',
    modelId: 'claude-sonnet-4-6',
    displayName: 'Claude Sonnet (Insights)',
    apiEndpoint: '/api/v1/messages',
    maxTokens: 4096,
    temperature: 0.4,
    supportedRoles: ['insight-generator'],
  },
  'risk-assessor': {
    provider: 'anthropic',
    modelId: 'claude-opus-4-6',
    displayName: 'Claude Opus (Risk)',
    apiEndpoint: '/api/v1/messages',
    maxTokens: 4096,
    temperature: 0.2,
    supportedRoles: ['risk-assessor'],
  },
}

// ─── Model Adapter Class ─────────────────────────────────────────────────────

export class ModelAdapter {
  private configs: Map<ModelRole, ModelConfig> = new Map()
  private apiKeys: Map<ModelProvider, string> = new Map()

  constructor(customConfigs?: Partial<Record<ModelRole, ModelConfig>>) {
    // Initialize with defaults
    for (const [role, config] of Object.entries(DEFAULT_MODELS)) {
      this.configs.set(role as ModelRole, config)
    }

    // Override with custom configs
    if (customConfigs) {
      for (const [role, config] of Object.entries(customConfigs)) {
        if (config) this.configs.set(role as ModelRole, config)
      }
    }
  }

  setApiKey(provider: ModelProvider, key: string): void {
    this.apiKeys.set(provider, key)
  }

  getModelConfig(role: ModelRole): ModelConfig {
    return this.configs.get(role) ?? DEFAULT_MODELS[role]
  }

  /**
   * Send a completion request to the appropriate model.
   * In production, this routes to the actual API endpoint.
   * Currently returns mock responses for demo purposes.
   */
  async complete(request: CompletionRequest): Promise<CompletionResponse> {
    const config = this.getModelConfig(request.role)
    const startTime = performance.now()

    // In production: route to actual API
    // For now: return structured mock response
    const content = await this.mockComplete(request, config)

    return {
      content,
      model: config.modelId,
      provider: config.provider,
      tokensUsed: Math.ceil(content.length / 4),
      latencyMs: Math.round(performance.now() - startTime),
      cached: false,
    }
  }

  /**
   * Mock completion for demo/offline mode.
   */
  private async mockComplete(request: CompletionRequest, config: ModelConfig): Promise<string> {
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300))

    switch (request.role) {
      case 'intent-parser':
        return JSON.stringify({
          useCase: null,
          engines: ['dashboard'],
          riskLevel: 'medium',
          confidence: 0.7,
          reasoning: 'Keyword-based fallback: no specific use case matched.',
        })

      case 'translator':
        return `[${config.displayName}] ${request.userMessage}`

      case 'insight-generator':
        return `分析結果: ${request.userMessage.slice(0, 100)}... に基づくAIインサイトを生成しました。詳細なリスク評価と推奨アクションを含みます。`

      case 'risk-assessor':
        return JSON.stringify({
          riskLevel: 'medium',
          factors: [
            { name: '操作複雑度', score: 0.6 },
            { name: '影響範囲', score: 0.4 },
            { name: '可逆性', score: 0.8 },
          ],
          recommendation: '標準承認フローを推奨',
        })

      default:
        return 'Unknown role'
    }
  }

  /**
   * Format a request body for the target provider's API format.
   */
  formatRequestBody(
    request: CompletionRequest,
    config: ModelConfig,
  ): Record<string, unknown> {
    switch (config.provider) {
      case 'openai':
        return {
          model: config.modelId,
          messages: [
            { role: 'system', content: request.systemPrompt },
            { role: 'user', content: request.userMessage },
          ],
          max_tokens: request.maxTokens ?? config.maxTokens,
          temperature: request.temperature ?? config.temperature,
          ...(request.responseFormat === 'json'
            ? { response_format: { type: 'json_object' } }
            : {}),
        }

      case 'anthropic':
        return {
          model: config.modelId,
          system: request.systemPrompt,
          messages: [{ role: 'user', content: request.userMessage }],
          max_tokens: request.maxTokens ?? config.maxTokens,
          temperature: request.temperature ?? config.temperature,
        }

      case 'google':
        return {
          model: config.modelId,
          contents: [{ parts: [{ text: `${request.systemPrompt}\n\n${request.userMessage}` }] }],
          generationConfig: {
            maxOutputTokens: request.maxTokens ?? config.maxTokens,
            temperature: request.temperature ?? config.temperature,
          },
        }

      default:
        return { prompt: `${request.systemPrompt}\n\n${request.userMessage}` }
    }
  }

  /**
   * List all configured models with their roles.
   */
  listModels(): Array<{ role: ModelRole; config: ModelConfig }> {
    return Array.from(this.configs.entries()).map(([role, config]) => ({
      role,
      config,
    }))
  }
}

// ─── Singleton Instance ──────────────────────────────────────────────────────

let _adapter: ModelAdapter | null = null

export function getModelAdapter(): ModelAdapter {
  if (!_adapter) {
    _adapter = new ModelAdapter()
  }
  return _adapter
}

export function resetModelAdapter(): void {
  _adapter = null
}
