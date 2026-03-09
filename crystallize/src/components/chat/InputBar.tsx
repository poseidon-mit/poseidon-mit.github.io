import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Square,
  ChevronDown,
  Sparkles,
  Command,
} from 'lucide-react';
import type { ModelId, OrchestrationMode, PromptTemplate } from '@/lib/types';
import { MODELS, MODE_LABELS, ALL_MODELS } from '@/lib/models';
import { cn } from '@/lib/utils';

interface InputBarProps {
  onSend: (content: string) => void;
  onStop: () => void;
  isGenerating: boolean;
  activeModels: ModelId[];
  onToggleModel: (model: ModelId) => void;
  mode: OrchestrationMode;
  onModeChange: (mode: OrchestrationMode) => void;
  templates: PromptTemplate[];
  onApplyTemplate: (id: string) => void;
}

export function InputBar({
  onSend,
  onStop,
  isGenerating,
  activeModels,
  onToggleModel,
  mode,
  onModeChange,
  templates,
  onApplyTemplate,
}: InputBarProps) {
  const [input, setInput] = useState('');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(
        Math.max(textareaRef.current.scrollHeight, 24),
        32 * 8 // max 8 lines
      );
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        handleSend();
      }
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  const handleToggleModel = (model: ModelId) => {
    onToggleModel(model);
  };

  const handleApplyTemplate = (templateId: string) => {
    onApplyTemplate(templateId);
    setShowTemplateDropdown(false);
  };

  return (
    <div className="border-t border-slate-700/50 bg-slate-950/50 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl px-4 py-4">
        {/* Model pills and mode selector row */}
        <div className="flex items-center gap-3 mb-4">
          {/* Model toggles */}
          <div className="flex items-center gap-2">
            {ALL_MODELS.map((model) => {
              const isActive = activeModels.includes(model);
              const modelConfig = MODELS[model];

              return (
                <motion.button
                  key={model}
                  onClick={() => handleToggleModel(model)}
                  className={cn(
                    'w-10 h-10 rounded-full font-semibold transition-all flex items-center justify-center',
                    isActive
                      ? 'ring-2 ring-offset-2 ring-offset-slate-950'
                      : 'opacity-50 hover:opacity-75'
                  )}
                  style={
                    isActive
                      ? {
                          backgroundColor: modelConfig.color,
                          ringColor: modelConfig.color,
                          color: '#000',
                        }
                      : {
                          color: modelConfig.color,
                        }
                  }
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={modelConfig.label}
                >
                  {modelConfig.shortLabel}
                </motion.button>
              );
            })}
          </div>

          {/* Mode selector dropdown */}
          <div className="relative ml-auto">
            <motion.button
              onClick={() => setShowModeDropdown(!showModeDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors text-sm text-slate-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {MODE_LABELS[mode].label}
              <ChevronDown
                size={16}
                className={cn(
                  'transition-transform',
                  showModeDropdown && 'rotate-180'
                )}
              />
            </motion.button>

            <AnimatePresence>
              {showModeDropdown && (
                <motion.div
                  className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  {Object.entries(MODE_LABELS).map(([modeKey, { label, description }]) => (
                    <button
                      key={modeKey}
                      onClick={() => {
                        onModeChange(modeKey as OrchestrationMode);
                        setShowModeDropdown(false);
                      }}
                      className={cn(
                        'w-full text-left px-4 py-2.5 text-sm transition-colors',
                        mode === modeKey
                          ? 'bg-slate-700 text-white'
                          : 'text-slate-300 hover:bg-slate-700/50'
                      )}
                    >
                      <div className="font-medium">{label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {description}
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Textarea */}
        <div className="mb-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Shift+Enter for newline)"
            className={cn(
              'w-full bg-slate-900 text-slate-100 border border-slate-700 rounded-lg px-4 py-3',
              'placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500',
              'resize-none font-sm leading-relaxed',
              'max-h-64'
            )}
            rows={1}
            disabled={isGenerating}
          />
        </div>

        {/* Bottom row: Templates and Send button */}
        <div className="flex items-center justify-between">
          {/* Template dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
              className={cn(
                'inline-flex items-center gap-2 px-3 py-2 rounded-lg',
                'text-sm text-slate-300 transition-colors',
                templates.length > 0
                  ? 'bg-slate-800/50 hover:bg-slate-700/50'
                  : 'text-slate-500 cursor-not-allowed'
              )}
              disabled={templates.length === 0}
              whileHover={templates.length > 0 ? { scale: 1.02 } : {}}
              whileTap={templates.length > 0 ? { scale: 0.98 } : {}}
            >
              <Sparkles size={16} />
              Templates
              {templates.length > 0 && (
                <ChevronDown
                  size={14}
                  className={cn(
                    'transition-transform',
                    showTemplateDropdown && 'rotate-180'
                  )}
                />
              )}
            </motion.button>

            <AnimatePresence>
              {showTemplateDropdown && templates.length > 0 && (
                <motion.div
                  className="absolute left-0 top-full mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleApplyTemplate(template.id)}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 transition-colors border-b border-slate-700/30 last:border-0"
                    >
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {template.models.join(', ')} • {template.mode}
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Send/Stop button */}
          {isGenerating ? (
            <motion.button
              onClick={onStop}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
                'bg-red-600 hover:bg-red-700 text-white font-medium text-sm',
                'transition-colors'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              <Square size={16} fill="currentColor" />
              Stop
            </motion.button>
          ) : (
            <motion.button
              onClick={handleSend}
              disabled={!input.trim()}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
                'font-medium text-sm transition-colors',
                input.trim()
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              )}
              whileHover={input.trim() ? { scale: 1.02 } : {}}
              whileTap={input.trim() ? { scale: 0.95 } : {}}
            >
              <Send size={16} />
              Send
            </motion.button>
          )}
        </div>

        {/* Keyboard hint */}
        <div className="mt-2 text-xs text-slate-500 text-right flex items-center justify-end gap-1">
          <Command size={12} />
          <span>K for help</span>
        </div>
      </div>
    </div>
  );
}
