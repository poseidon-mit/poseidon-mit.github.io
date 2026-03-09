/**
 * Talk to Money — Types
 *
 * State machine types for the conversational AI interface.
 */

export type TalkToMoneyState =
  | 'idle'
  | 'responding'
  | 'desktop-panel'
  | 'mobile-sheet'
  | 'unsupported'
  | 'follow-up'

export interface RouteContext {
  route: string
  label: string
  decisionId?: string
  summary?: string
  engine?: string
  action?: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export type TalkToMoneyEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'SEND_MESSAGE'; content: string }
  | { type: 'RESPONSE_COMPLETE'; content: string }
  | { type: 'ROUTE_CHANGE'; context: RouteContext | null }

export interface TalkToMoneyContext {
  state: TalkToMoneyState
  messages: Message[]
  routeContext: RouteContext | null
  isDesktop: boolean
}
