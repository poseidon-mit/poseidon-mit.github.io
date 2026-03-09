import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Message, ModelId } from '@/lib/types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

interface MessageListProps {
  messages: Message[];
  isGenerating: boolean;
  generatingModels?: ModelId[];
}

export function MessageList({
  messages,
  isGenerating,
  generatingModels = [],
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(messages.length);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      // Scroll if this is a new message or we're generating
      if (messages.length > prevLengthRef.current || isGenerating) {
        setTimeout(() => {
          scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth',
          });
        }, 100);
      }
    }
    prevLengthRef.current = messages.length;
  }, [messages, isGenerating]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-2"
    >
      {messages.length === 0 ? (
        <motion.div
          className="h-full flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h2 className="text-xl font-semibold text-slate-300 mb-2">
              Start a conversation
            </h2>
            <p className="text-sm text-slate-400">
              Select models and a mode, then type your message to begin
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="mx-auto max-w-3xl"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {messages.map((msg) => (
            <motion.div key={msg.id} variants={item}>
              <MessageBubble message={msg} />
            </motion.div>
          ))}

          {/* Typing indicators for generating models */}
          {isGenerating && generatingModels.length > 0 && (
            <motion.div
              className="space-y-2 mt-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {generatingModels.map((model) => (
                <motion.div key={`typing-${model}`} variants={item}>
                  <div className="flex gap-3">
                    <TypingIndicator model={model} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
