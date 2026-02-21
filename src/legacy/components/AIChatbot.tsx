/**
 * AI Chatbot - Refactored to use modular chat architecture
 * Uses chatService for NL processing, ChatMessage/ChatInput/VoiceInput components
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatService, QuickAction } from '../services/chatService';
import { ChatMessage, Message } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Bot } from 'lucide-react';
import { VoiceInput } from './VoiceInput';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useReducedMotionSafe } from '../hooks/useReducedMotionSafe';

const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'Welcome to Poseidon. I can help with your accounts, spending, goals, and more.',
  timestamp: new Date(),
  responseType: 'text',
};

export function AIChatbot() {
  const reducedMotion = useReducedMotionSafe();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [quickActions] = useState<QuickAction[]>(() => chatService.getQuickActions());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const titleId = 'ai-chatbot-title';
  const descriptionId = 'ai-chatbot-description';

  useFocusTrap(dialogRef, isOpen, triggerRef);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [reducedMotion]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim()) return;

    setHasInteracted(true);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setSuggestions([]);

    try {
      const response = await chatService.processMessage(text);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
        responseType: response.responseType,
        data: response.data,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      const newSuggestions = response.suggestions || chatService.getSuggestions(text);
      setSuggestions(newSuggestions.slice(0, 3));
    } catch {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date(),
        responseType: 'text',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const handleVoiceTranscript = useCallback((transcript: string) => {
    if (transcript.trim()) {
      handleSend(transcript);
    }
  }, [handleSend]);

  const handleQuickAction = useCallback((action: QuickAction) => {
    handleSend(action.query);
  }, [handleSend]);

  return (
    <>
      {!isOpen && (
        <motion.button
          ref={triggerRef}
          initial={reducedMotion ? false : { scale: 0.98, opacity: 0 }}
          animate={reducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
          whileHover={reducedMotion ? undefined : { scale: 1.02 }}
          whileTap={reducedMotion ? undefined : { scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant"
          className="mission-chatbot-trigger"
        >
          <Bot size={18} />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.99 }}
            transition={{ duration: reducedMotion ? 0 : 0.16, ease: [0.2, 0.8, 0.2, 1] }}
            className="mission-chatbot"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            tabIndex={-1}
          >
            <div className="mission-chatbot-header">
              <div className="mission-chatbot-title-row">
                <div className="mission-chatbot-avatar">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 id={titleId}>Poseidon AI</h3>
                  <p id={descriptionId} className="sr-only">
                    Conversational assistant for account, spending, and goal support.
                  </p>
                  <p>Online</p>
                </div>
              </div>

              <div className="mission-chatbot-actions">
                <VoiceInput onTranscript={handleVoiceTranscript} className="mission-chatbot-voice" />
                <button
                  onClick={() => setIsOpen(false)}
                  className="mission-chatbot-close"
                  aria-label="Close chat"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="mission-chatbot-messages">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mission-chatbot-typing"
                >
                  <div className="mission-chatbot-typing-avatar">
                    <Bot size={18} />
                  </div>
                  <div className="mission-chatbot-typing-bubble">
                    <div className="mission-chatbot-typing-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {!hasInteracted && (
              <div className="mission-chatbot-quick-actions">
                <div className="mission-chatbot-quick-label">Quick actions</div>
                {quickActions.slice(0, 6).map((action) => (
                  <motion.button
                    key={action.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleQuickAction(action)}
                    className="mission-chatbot-quick-chip"
                  >
                    <span>{action.icon}</span>
                    <span>{action.label}</span>
                  </motion.button>
                ))}
              </div>
            )}

            <ChatInput
              onSend={handleSend}
              isTyping={isTyping}
              suggestions={hasInteracted ? suggestions : undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
