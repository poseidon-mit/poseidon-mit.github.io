import type { AccountEntity, ProtectThreatEntity, RecommendationEntity, ExecuteActionEntity } from '@/domain/poseidon-universe/types'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  cards?: CardPayload[]
  toolCall?: { label: string; done: boolean }
  timestamp: number
}

export type CardPayload =
  | { type: 'balance'; accounts: AccountEntity[]; summary: { totalAssets: number; totalLiabilities: number; netWorth: number } }
  | { type: 'net-worth'; total: number; change: number; changePercent: number; assets: number; liabilities: number }
  | { type: 'spending'; totalSpent: number; categories: SpendingCategory[]; comparedToPrevious: string }
  | { type: 'threats'; threats: ProtectThreatEntity[] }
  | { type: 'recommendations'; recommendations: RecommendationEntity[] }
  | { type: 'actions'; actions: ExecuteActionEntity[] }
  | { type: 'transfer-preview'; from: string; to: string; amount: number; benefit: string }

export interface SpendingCategory {
  name: string
  amount: number
  percentage: number
  trend: string
}

export interface SuggestedPrompt {
  text: string
  engine: 'protect' | 'grow' | 'execute' | 'general'
}

export interface SimulatedResponse {
  text: string
  cards: CardPayload[]
  toolCallLabel?: string
}
