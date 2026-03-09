import { motion } from 'framer-motion';
import type { Message } from '@/lib/types';
import { MODELS } from '@/lib/models';
import { formatTimestamp, cn } from '@/lib/utils';
import { ModelTag } from './ModelTag';
import { renderMarkdown } from './markdown-renderer';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isSystem = message.role === 'system' || message.role === 'orchestrator';

  const { elements: contentElements } = renderMarkdown(message.content);

  if (isSystem) {
    return (
      <motion.div
        className="flex justify-center my-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-slate-500 to-transparent" />
          <p className="text-sm italic text-slate-400">{message.content}</p>
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-slate-500 to-transparent" />
        </div>
      </motion.div>
    );
  }

  const modelConfig = isAssistant && message.model ? MODELS[message.model] : null;
  const borderColor = modelConfig?.color || '#00F0FF';

  return (
    <motion.div
      className={cn('flex gap-3 mb-4', isUser ? 'justify-end' : 'justify-start')}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={cn(
          'max-w-md lg:max-w-2xl rounded-2xl px-4 py-3',
          isUser
            ? 'bg-white/10 text-white'
            : 'glass-surface-card'
        )}
        style={
          isAssistant && modelConfig
            ? {
                borderLeft: `2px solid ${borderColor}`,
              }
            : undefined
        }
      >
        {/* Model tag for assistant messages */}
        {isAssistant && modelConfig && (
          <div className="mb-2 flex items-center gap-2">
            <ModelTag model={message.model!} size="sm" />
          </div>
        )}

        {/* Message content */}
        <div className="text-sm leading-relaxed space-y-2">
          {contentElements}
        </div>

        {/* Metadata footer */}
        {(message.meta?.tokens || message.timestamp) && (
          <div className="mt-2 pt-2 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
            <span>{formatTimestamp(message.timestamp)}</span>
            {message.meta?.tokens && <span>{message.meta.tokens} tokens</span>}
            {message.meta?.latencyMs && (
              <span>{(message.meta.latencyMs / 1000).toFixed(2)}s</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
