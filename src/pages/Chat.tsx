import { useState, useRef, useEffect, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  MessageCircle,
  Loader2,
  Shield,
  TrendingUp,
  Zap,
  HelpCircle,
  Wallet,
  PiggyBank,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePageTitle } from '@/hooks/use-page-title'
import { useSimulatedChat } from '@/lib/chat/use-chat'
import type { ChatMessage, CardPayload, SuggestedPrompt } from '@/lib/chat/types'

// ─── Suggested Prompts ──────────────────────────────────────────────────────

const SUGGESTIONS: SuggestedPrompt[] = [
  { text: "What's my current net worth?", engine: 'general' },
  { text: 'Are there any security threats?', engine: 'protect' },
  { text: 'How much did I spend last month?', engine: 'general' },
  { text: 'Show me savings opportunities', engine: 'grow' },
  { text: 'What actions need my approval?', engine: 'execute' },
  { text: 'Move $5,000 to high-yield savings', engine: 'execute' },
]

const ENGINE_ICONS = {
  protect: Shield,
  grow: TrendingUp,
  execute: Zap,
  general: HelpCircle,
} as const

const ENGINE_COLORS = {
  protect: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100',
  grow: 'text-violet-600 bg-violet-50 hover:bg-violet-100',
  execute: 'text-amber-600 bg-amber-50 hover:bg-amber-100',
  general: 'text-blue-600 bg-blue-50 hover:bg-blue-100',
} as const

// ─── Card Renderers ─────────────────────────────────────────────────────────

function CardRenderer({ card }: { card: CardPayload }) {
  switch (card.type) {
    case 'net-worth':
      return <NetWorthCard data={card} />
    case 'balance':
      return <BalanceCard data={card} />
    case 'spending':
      return <SpendingCard data={card} />
    case 'threats':
      return <ThreatCards data={card} />
    case 'recommendations':
      return <RecommendationCards data={card} />
    case 'actions':
      return <ActionCards data={card} />
    case 'transfer-preview':
      return <TransferPreviewCard data={card} />
    default:
      return null
  }
}

function NetWorthCard({ data }: { data: Extract<CardPayload, { type: 'net-worth' }> }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Wallet className="h-5 w-5 text-cyan-500" />
        <span className="text-sm font-semibold text-gray-900">Net Worth</span>
      </div>
      <p className="text-3xl font-bold text-gray-900">${data.total.toLocaleString()}</p>
      <div className="flex items-center gap-1 mt-1">
        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
        <span className="text-sm text-emerald-600 font-medium">+${data.change.toLocaleString()} ({data.changePercent}%)</span>
        <span className="text-sm text-gray-400 ml-1">this month</span>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500">Assets</p>
          <p className="text-lg font-semibold text-gray-900">${data.assets.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Liabilities</p>
          <p className="text-lg font-semibold text-rose-600">${data.liabilities.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

function BalanceCard({ data }: { data: Extract<CardPayload, { type: 'balance' }> }) {
  const typeIcons: Record<string, typeof Wallet> = {
    checking: Wallet,
    savings: PiggyBank,
    'credit-card': CreditCard,
    retirement: TrendingUp,
    'roth-ira': TrendingUp,
    brokerage: TrendingUp,
    'auto-loan': CreditCard,
  }
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Wallet className="h-5 w-5 text-blue-500" />
        <span className="text-sm font-semibold text-gray-900">Account Balances</span>
      </div>
      <div className="grid grid-cols-3 gap-3 rounded-xl bg-gray-50 p-3 mb-4">
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Assets</p>
          <p className="text-sm font-bold text-emerald-600">${data.summary.totalAssets.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Liabilities</p>
          <p className="text-sm font-bold text-rose-600">${data.summary.totalLiabilities.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Net Worth</p>
          <p className="text-sm font-bold text-gray-900">${data.summary.netWorth.toLocaleString()}</p>
        </div>
      </div>
      <div className="space-y-2">
        {data.accounts.map((acc) => {
          const Icon = typeIcons[acc.type] ?? Wallet
          const isNeg = acc.balanceUsd < 0
          return (
            <div key={acc.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <Icon className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{acc.label}</p>
                  <p className="text-xs text-gray-400">{acc.institution} · •{acc.last4}</p>
                </div>
              </div>
              <p className={cn('text-sm font-semibold', isNeg ? 'text-rose-600' : 'text-gray-900')}>
                {isNeg ? '-' : ''}${Math.abs(acc.balanceUsd).toLocaleString()}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SpendingCard({ data }: { data: Extract<CardPayload, { type: 'spending' }> }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-900">Spending Breakdown</span>
        <span className="text-xs text-gray-400">{data.comparedToPrevious} vs prev month</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-4">${data.totalSpent.toLocaleString()}</p>
      <div className="space-y-2">
        {data.categories.map((cat) => (
          <div key={cat.name} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">{cat.name}</span>
                <span className="text-xs text-gray-500">${cat.amount.toLocaleString()}</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100">
                <div className="h-1.5 rounded-full bg-blue-400" style={{ width: `${cat.percentage}%` }} />
              </div>
            </div>
            <span className={cn('text-[10px] font-medium w-10 text-right', cat.trend.startsWith('+') ? 'text-rose-500' : cat.trend.startsWith('-') ? 'text-emerald-500' : 'text-gray-400')}>
              {cat.trend}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ThreatCards({ data }: { data: Extract<CardPayload, { type: 'threats' }> }) {
  const severityColor = {
    Critical: 'bg-red-100 text-red-700 border-red-200',
    High: 'bg-orange-100 text-orange-700 border-orange-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Low: 'bg-gray-100 text-gray-600 border-gray-200',
  }
  return (
    <div className="space-y-2">
      {data.threats.map((threat) => (
        <div key={threat.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-semibold text-gray-900">{threat.counterparty}</span>
              </div>
              <p className="text-xs text-gray-500">{threat.description}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', severityColor[threat.severity])}>
                {threat.severity}
              </span>
              <span className="text-xs font-medium text-gray-900">${threat.amountUsd.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function RecommendationCards({ data }: { data: Extract<CardPayload, { type: 'recommendations' }> }) {
  return (
    <div className="space-y-2">
      {data.recommendations.map((rec) => (
        <div key={rec.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-violet-500" />
                <span className="text-sm font-semibold text-gray-900">{rec.title}</span>
              </div>
              <p className="text-xs text-gray-500">
                {Math.round(rec.confidence * 100)}% confidence · {rec.alternativeType}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-emerald-600">+${rec.projectedBenefitUsd.toLocaleString()}</p>
              <p className="text-[10px] text-gray-400">/year</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ActionCards({ data }: { data: Extract<CardPayload, { type: 'actions' }> }) {
  const urgencyColor = { high: 'text-red-600', medium: 'text-amber-600', low: 'text-gray-500' }
  return (
    <div className="space-y-2">
      {data.actions.map((action) => (
        <div key={action.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-semibold text-gray-900">{action.title}</span>
              </div>
              <p className="text-xs text-gray-500">{action.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{action.amountLabel}</p>
              <p className={cn('text-[10px] font-medium uppercase', urgencyColor[action.urgency])}>{action.urgency}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function TransferPreviewCard({ data }: { data: Extract<CardPayload, { type: 'transfer-preview' }> }) {
  const [confirmed, setConfirmed] = useState(false)
  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <ArrowUpRight className="h-5 w-5 text-blue-500" />
        <span className="text-sm font-semibold text-gray-900">Transfer Preview</span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">From</p>
            <p className="text-sm font-medium text-gray-900">{data.from}</p>
          </div>
          <ArrowDownRight className="h-4 w-4 text-gray-400" />
          <div className="text-right">
            <p className="text-xs text-gray-500">To</p>
            <p className="text-sm font-medium text-gray-900">{data.to}</p>
          </div>
        </div>
        <div className="rounded-xl bg-white p-3 border border-blue-100">
          <p className="text-2xl font-bold text-gray-900">${data.amount.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">{data.benefit}</p>
        </div>
        {confirmed ? (
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">Transfer confirmed (demo)</span>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmed(true)}
              className="flex-1 rounded-xl bg-blue-500 text-white py-2.5 text-sm font-semibold hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Confirm Transfer
            </button>
            <button
              type="button"
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Chat Page ─────────────────────────────────────────────────────────

export default function Chat() {
  usePageTitle('Talk your money')

  const { messages, isStreaming, streamingText, streamingCards, toolCallLabel, send } = useSimulatedChat()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isStreaming) {
      send(input)
      setInput('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleSuggestion = (text: string) => {
    if (!isStreaming) {
      send(text)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const adjustHeight = () => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`
    }
  }

  const isEmpty = messages.length === 0 && !isStreaming

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] lg:h-screen bg-white">
      {/* Messages or Empty State */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full px-4 py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-cyan-100">
              <MessageCircle className="h-8 w-8 text-violet-500" />
            </div>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">Talk your money</h2>
            <p className="mt-2 max-w-md text-center text-gray-500 text-sm">
              Your AI financial companion is ready to help you understand,
              manage, and optimize your money.
            </p>
            <div className="mt-8 w-full max-w-2xl">
              <p className="mb-3 text-sm font-medium text-gray-400 text-center">Try asking:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTIONS.map((s, i) => {
                  const Icon = ENGINE_ICONS[s.engine]
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSuggestion(s.text)}
                      className={cn('flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer', ENGINE_COLORS[s.engine])}
                    >
                      <Icon className="h-4 w-4" />
                      {s.text}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
            {/* Rendered messages */}
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Streaming state */}
            <AnimatePresence>
              {isStreaming && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-cyan-100">
                    <MessageCircle className="h-4 w-4 text-violet-500" />
                  </div>
                  <div className="flex flex-col gap-2 max-w-[85%]">
                    {toolCallLabel && (
                      <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-600">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        {toolCallLabel}...
                      </div>
                    )}
                    {streamingText && (
                      <div className="rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-900 whitespace-pre-wrap">
                        {streamingText}
                        <span className="inline-block w-0.5 h-4 bg-gray-400 animate-pulse ml-0.5 align-text-bottom" />
                      </div>
                    )}
                    {streamingCards.length > 0 && streamingText && (
                      <div className="space-y-2">
                        {streamingCards.map((card, i) => (
                          <CardRenderer key={i} card={card} />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Suggestion chips after response */}
      {!isEmpty && !isStreaming && (
        <div className="px-4 pb-2">
          <div className="mx-auto max-w-3xl flex flex-wrap gap-2 justify-center">
            {SUGGESTIONS.slice(0, 3).map((s, i) => {
              const Icon = ENGINE_ICONS[s.engine]
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSuggestion(s.text)}
                  className={cn('flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer', ENGINE_COLORS[s.engine])}
                >
                  <Icon className="h-3 w-3" />
                  {s.text}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="border-t border-gray-100 bg-white px-4 py-3">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className={cn(
            'flex items-end gap-2 rounded-2xl border bg-gray-50 p-2',
            'transition-colors focus-within:border-blue-300 focus-within:bg-white',
          )}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); adjustHeight() }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your finances..."
              rows={1}
              className="flex-1 resize-none bg-transparent py-2 px-2 text-sm placeholder:text-gray-400 focus:outline-none max-h-[200px]"
            />
            {isStreaming ? (
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white cursor-pointer"
              >
                <div className="h-3 w-3 rounded-sm bg-white" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors cursor-pointer',
                  input.trim() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-400',
                )}
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2">
            Demo simulation — responses are pre-scripted
          </p>
        </form>
      </div>
    </div>
  )
}

// ─── Message Bubble ─────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  return (
    <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
        isUser ? 'bg-blue-500 text-white' : 'bg-gradient-to-br from-violet-100 to-cyan-100',
      )}>
        {isUser ? (
          <span className="text-xs font-bold">SF</span>
        ) : (
          <MessageCircle className="h-4 w-4 text-violet-500" />
        )}
      </div>
      <div className={cn('flex flex-col gap-2', isUser ? 'items-end' : 'items-start', 'max-w-[85%]')}>
        <div className={cn(
          'rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap',
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900',
        )}>
          {message.content}
        </div>
        {message.cards && message.cards.length > 0 && (
          <div className="w-full space-y-2">
            {message.cards.map((card, i) => (
              <CardRenderer key={i} card={card} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
