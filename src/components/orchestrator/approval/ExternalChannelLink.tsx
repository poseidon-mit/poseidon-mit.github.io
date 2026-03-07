/**
 * Orchestrator Workbench v2.0 — External Channel Link
 * Slack/Teams notification link for approval requests.
 * UI-only component — actual API integration in external-channels.ts.
 */

import { motion } from 'framer-motion'
import { ExternalLink, MessageCircle, Hash } from 'lucide-react'

export type ChannelType = 'slack' | 'teams' | 'email'

interface ExternalChannelLinkProps {
  channel: ChannelType
  channelName: string
  channelUrl?: string
  notificationSent?: boolean
  sentAt?: string
  governMode?: boolean
  onSendNotification?: () => void
}

const CHANNEL_CONFIG: Record<ChannelType, { icon: typeof MessageCircle; label: string; color: string }> = {
  slack: {
    icon: Hash,
    label: 'Slack',
    color: 'text-[#E01E5A]',
  },
  teams: {
    icon: MessageCircle,
    label: 'Teams',
    color: 'text-[#6264A7]',
  },
  email: {
    icon: ExternalLink,
    label: 'Email',
    color: 'text-zinc-400',
  },
}

export function ExternalChannelLink({
  channel,
  channelName,
  channelUrl,
  notificationSent,
  sentAt,
  governMode,
  onSendNotification,
}: ExternalChannelLinkProps) {
  const config = CHANNEL_CONFIG[channel]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        flex items-center justify-between rounded-md border px-3 py-2
        ${governMode ? 'border-blue-800/40 bg-blue-950/20' : 'border-zinc-700/40 bg-zinc-900/40'}
      `}
    >
      <div className="flex items-center gap-2">
        <Icon className={`w-3.5 h-3.5 ${config.color}`} />
        <div className="flex flex-col">
          <span className="text-xs text-zinc-300">{config.label}: {channelName}</span>
          {sentAt && (
            <span className="text-[10px] text-zinc-600 font-mono">
              送信済 {new Date(sentAt).toLocaleString('ja-JP')}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {notificationSent ? (
          <span className="text-[10px] text-emerald-500 font-mono">✓ 通知済</span>
        ) : (
          <button
            onClick={onSendNotification}
            className={`
              text-[10px] px-2 py-1 rounded transition-colors
              ${governMode
                ? 'bg-blue-600/30 text-blue-300 hover:bg-blue-600/50'
                : 'bg-cyan-600/30 text-cyan-300 hover:bg-cyan-600/50'
              }
            `}
          >
            通知を送信
          </button>
        )}

        {channelUrl && (
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </motion.div>
  )
}
