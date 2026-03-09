export type ModelId = 'claude' | 'gpt' | 'gemini';

export type MessageRole = 'user' | 'assistant' | 'system' | 'orchestrator';

export interface Message {
  id: string;
  role: MessageRole;
  model?: ModelId;
  content: string;
  timestamp: number;
  replyTo?: string;
  meta?: {
    mode?: OrchestrationMode;
    promptTemplate?: string;
    tokens?: number;
    latencyMs?: number;
  };
}

export type OrchestrationMode =
  | 'single'
  | 'parallel'
  | 'debate'
  | 'review'
  | 'refine'
  | 'custom';

export interface Session {
  id: string;
  title: string;
  messages: Message[];
  models: ModelId[];
  mode: OrchestrationMode;
  createdAt: number;
  updatedAt: number;
}

export interface OrchestratorConfig {
  mode: OrchestrationMode;
  activeModels: ModelId[];
  rounds?: number;
  systemPrompt?: string;
  outputFormat?: string;
  temperature?: number;
}

export interface PromptTemplate {
  id: string;
  name: string;
  mode: OrchestrationMode;
  models: ModelId[];
  systemPrompt: string;
  outputFormat?: string;
  rounds: number;
  isBuiltIn?: boolean;
}

export interface LLMAdapter {
  send(model: ModelId, messages: Message[], config?: Partial<OrchestratorConfig>): Promise<Message>;
  stream(model: ModelId, messages: Message[], config?: Partial<OrchestratorConfig>): AsyncIterable<string>;
}
