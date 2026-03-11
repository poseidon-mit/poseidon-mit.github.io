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
  protect: 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20',
  grow: 'text-violet-400 bg-violet-500/10 hover:bg-violet-500/20',
  execute: 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20',
  general: 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20',
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
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
      <div className="flex items-center gap-2 mb-3">
        <Wallet className="h-5 w-5 text-cyan-500" />
        <span className="text-sm font-semibold text-foreground">Net Worth</span>
      </div>
      <p className="text-3xl font-bold text-foreground">${data.total.toLocaleString()}</p>
      <div className="flex items-center gap-1 mt-1">
        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
        <span className="text-sm text-emerald-400 font-medium">+${data.change.toLocaleString()} ({data.changePercent}%)</span>
        <span className="text-sm text-white/40 ml-1">this month</span>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/[0.06]">
        <div>
          <p className="text-xs text-muted-foreground">Assets</p>
          <p className="text-lg font-semibold text-foreground">${data.assets.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Liabilities</p>
          <p className="text-lg font-semibold text-rose-400">${data.liabilities.toLocaleString()}</p>
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
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
      <div className="flex items-center gap-2 mb-3">
        <Wallet className="h-5 w-5 text-blue-400" />
        <span className="text-sm font-semibold text-foreground">Account Balances</span>
      </div>
      <div className="grid grid-cols-3 gap-2 rounded-xl bg-white/[0.04] p-3 mb-4">
        <div className="min-w-0">
          <p className="text-[9px] text-muted-foreground uppercase tracking-wide truncate">Assets</p>
          <p className="text-xs font-bold text-emerald-400 truncate">${data.summary.totalAssets.toLocaleString()}</p>
        </div>
        <div className="min-w-0">
          <p className="text-[9px] text-muted-foreground uppercase tracking-wide truncate">Liabilities</p>
          <p className="text-xs font-bold text-rose-400 truncate">${data.summary.totalLiabilities.toLocaleString()}</p>
        </div>
        <div className="min-w-0">
          <p className="text-[9px] text-muted-foreground uppercase tracking-wide truncate">Net Worth</p>
          <p className="text-xs font-bold text-foreground truncate">${data.summary.netWorth.toLocaleString()}</p>
        </div>
      </div>
      <div className="space-y-2">
        {data.accounts.map((acc) => {
          const Icon = typeIcons[acc.type] ?? Wallet
          const isNeg = acc.balanceUsd < 0
          return (
            <div key={acc.id} className="flex items-center justify-between rounded-xl border border-white/[0.06] p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04]">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{acc.label}</p>
                  <p className="text-xs text-white/40">{acc.institution} · •{acc.last4}</p>
                </div>
              </div>
              <p className={cn('text-sm font-semibold', isNeg ? 'text-rose-400' : 'text-foreground')}>
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
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-foreground">Spending Breakdown</span>
        <span className="text-xs text-white/40">{data.comparedToPrevious} vs prev month</span>
      </div>
      <p className="text-2xl font-bold text-foreground mb-4">${data.totalSpent.toLocaleString()}</p>
      <div className="space-y-2">
        {data.categories.map((cat) => (
          <div key={cat.name} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-foreground">{cat.name}</span>
                <span className="text-xs text-muted-foreground">${cat.amount.toLocaleString()}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06]">
                <div className="h-1.5 rounded-full bg-blue-400" style={{ width: `${cat.percentage}%` }} />
              </div>
            </div>
            <span className={cn('text-[10px] font-medium w-10 text-right', cat.trend.startsWith('+') ? 'text-rose-400' : cat.trend.startsWith('-') ? 'text-emerald-400' : 'text-white/40')}>
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
    Critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    High: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    Low: 'bg-white/[0.04] text-muted-foreground border-white/[0.06]',
  }
  return (
    <div className="space-y-2">
      {data.threats.map((threat) => (
        <div key={threat.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-semibold text-foreground">{threat.counterparty}</span>
              </div>
              <p className="text-xs text-muted-foreground">{threat.description}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', severityColor[threat.severity])}>
                {threat.severity}
              </span>
              <span className="text-xs font-medium text-foreground">${threat.amountUsd.toLocaleString()}</span>
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
        <div key={rec.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-semibold text-foreground">{rec.title}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round(rec.confidence * 100)}% confidence · {rec.alternativeType}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-emerald-400">+${rec.projectedBenefitUsd.toLocaleString()}</p>
              <p className="text-[10px] text-white/40">/year</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ActionCards({ data }: { data: Extract<CardPayload, { type: 'actions' }> }) {
  const urgencyColor = { high: 'text-red-400', medium: 'text-amber-400', low: 'text-muted-foreground' }
  return (
    <div className="space-y-2">
      {data.actions.map((action) => (
        <div key={action.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-semibold text-foreground">{action.title}</span>
              </div>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-foreground">{action.amountLabel}</p>
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
    <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.06] p-5">
      <div className="flex items-center gap-2 mb-4">
        <ArrowUpRight className="h-5 w-5 text-blue-400" />
        <span className="text-sm font-semibold text-foreground">Transfer Preview</span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">From</p>
            <p className="text-sm font-medium text-foreground">{data.from}</p>
          </div>
          <ArrowDownRight className="h-4 w-4 text-white/40" />
          <div className="text-right">
            <p className="text-xs text-muted-foreground">To</p>
            <p className="text-sm font-medium text-foreground">{data.to}</p>
          </div>
        </div>
        <div className="rounded-xl bg-white/[0.04] p-3 border border-blue-500/10">
          <p className="text-2xl font-bold text-foreground">${data.amount.toLocaleString()}</p>
          <p className="text-xs text-emerald-400 font-medium mt-1">{data.benefit}</p>
        </div>
        {confirmed ? (
          <div className="flex items-center gap-2 text-emerald-400">
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
              className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/[0.04] transition-colors cursor-pointer"
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
    <div className="hero-viewport flex flex-col bg-[#0A0A0F]">
      {/* Messages or Empty State */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full px-4 py-12">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/[0.06] shadow-[0_0_30px_rgba(139,92,246,0.2)]">
              <MessageCircle className="h-10 w-10 text-violet-400" />
            </div>
            <h2 className="typo-display mt-6 text-2xl md:text-3xl text-foreground">Talk Your Money</h2>
            <p className="mt-2 max-w-md text-center text-muted-foreground text-sm">
              Your AI financial companion is ready to help you understand,
              manage, and optimize your money.
            </p>
            <div className="mt-8 w-full max-w-2xl">
              <p className="mb-3 text-sm font-medium text-white/40 text-center">Try asking:</p>
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
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/[0.06]">
                    <MessageCircle className="h-4 w-4 text-violet-400" />
                  </div>
                  <div className="flex flex-col gap-2 max-w-[85%]">
                    {toolCallLabel && (
                      <div className="flex items-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin text-cyan-400 drop-shadow-[0_0_4px_rgba(0,240,255,0.4)]" />
                        {toolCallLabel}...
                      </div>
                    )}
                    {streamingText && (
                      <div className="rounded-2xl bg-white/[0.06] px-4 py-3 text-sm text-foreground whitespace-pre-wrap">
                        {streamingText}
                        <span className="inline-block w-0.5 h-4 bg-white/40 animate-pulse ml-0.5 align-text-bottom" />
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
      <div className="border-t border-white/[0.06] bg-[#0A0A0F] px-4 py-3">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className={cn(
            'flex items-end gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-md p-2',
            'transition-colors focus-within:border-blue-500/30 focus-within:bg-white/[0.04]',
          )}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); adjustHeight() }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your finances..."
              rows={1}
              className="flex-1 resize-none bg-transparent py-2 px-2 text-sm text-foreground placeholder:text-white/40 focus:outline-none max-h-[200px]"
            />
            {isStreaming ? (
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0A0A0F] cursor-pointer"
              >
                <div className="h-3 w-3 rounded-sm bg-[#0A0A0F]" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors cursor-pointer',
                  input.trim() ? 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-[0_0_12px_rgba(0,240,255,0.3)]' : 'bg-white/[0.06] text-white/40',
                )}
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="text-[10px] text-white/40 text-center mt-2">
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
        isUser ? 'bg-blue-500 text-white' : 'bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/[0.06]',
      )}>
        {isUser ? (
          <span className="text-xs font-bold">SF</span>
        ) : (
          <MessageCircle className="h-4 w-4 text-violet-400" />
        )}
      </div>
      <div className={cn('flex flex-col gap-2', isUser ? 'items-end' : 'items-start', 'max-w-[85%]')}>
        <div className={cn(
          'rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap',
          isUser ? 'bg-blue-500 text-white' : 'bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] text-foreground',
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
