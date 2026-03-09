import { useEffect } from 'react';
import { Command } from 'cmdk';
import { cn } from '@/lib/utils';
import {
  Plus,
  MessageSquare,
  Columns3,
  Swords,
  ClipboardCheck,
  Layers,
  Settings2,
  PanelLeft,
  Download,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string, payload?: any) => void;
}

const commands = [
  {
    category: 'Chat',
    items: [
      {
        id: 'new-chat',
        label: 'New Chat',
        description: 'Start a new conversation',
        icon: Plus,
      },
      {
        id: 'clear-chat',
        label: 'Clear Chat',
        description: 'Clear current conversation',
        icon: Trash2,
      },
      {
        id: 'export-chat',
        label: 'Export Chat',
        description: 'Export conversation to file',
        icon: Download,
      },
    ],
  },
  {
    category: 'Models',
    items: [
      {
        id: 'switch-claude',
        label: 'Switch to Claude',
        description: 'Set active model to Claude',
        icon: MessageSquare,
      },
      {
        id: 'switch-gpt',
        label: 'Switch to GPT',
        description: 'Set active model to GPT',
        icon: MessageSquare,
      },
      {
        id: 'switch-gemini',
        label: 'Switch to Gemini',
        description: 'Set active model to Gemini',
        icon: MessageSquare,
      },
    ],
  },
  {
    category: 'Modes',
    items: [
      {
        id: 'mode-single',
        label: 'Mode: Single',
        description: 'Send to one model',
        icon: MessageSquare,
      },
      {
        id: 'mode-parallel',
        label: 'Mode: Parallel',
        description: 'All models answer independently',
        icon: Columns3,
      },
      {
        id: 'mode-debate',
        label: 'Mode: Debate',
        description: 'Models respond to each other',
        icon: Swords,
      },
      {
        id: 'mode-review',
        label: 'Mode: Review',
        description: 'One drafts, others critique',
        icon: ClipboardCheck,
      },
      {
        id: 'mode-refine',
        label: 'Mode: Refine',
        description: 'Each model improves the previous',
        icon: Layers,
      },
      {
        id: 'mode-custom',
        label: 'Mode: Custom',
        description: 'User-defined prompt chain',
        icon: Settings2,
      },
    ],
  },
  {
    category: 'Interface',
    items: [
      {
        id: 'toggle-sidebar',
        label: 'Toggle Sidebar',
        description: 'Show or hide the sidebar',
        icon: PanelLeft,
      },
    ],
  },
];

export function CommandPalette({ isOpen, onClose, onAction }: CommandPaletteProps) {
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const allCommands = commands.flatMap((cat) =>
    cat.items.map((item) => ({
      ...item,
      category: cat.category,
    }))
  );

  const handleCommand = (id: string) => {
    onAction(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <Command className={cn('glass-surface', 'rounded-lg overflow-hidden shadow-2xl')}>
              {/* Input */}
              <Command.Input
                placeholder="Type a command or search..."
                className={cn(
                  'px-4 py-3',
                  'text-foreground placeholder-neutral-400',
                  'border-b border-neutral-700',
                  'bg-transparent outline-none',
                  'text-sm',
                )}
              />

              {/* List */}
              <Command.List className="max-h-96 overflow-y-auto">
                {/* No results state */}
                <Command.Empty className="px-4 py-6 text-center text-sm text-neutral-400">
                  No commands found.
                </Command.Empty>

                {/* Grouped Commands */}
                {commands.map((group) => (
                  <Command.Group
                    key={group.category}
                    heading={group.category}
                    className="overflow-hidden py-1"
                  >
                    <div className="px-2 py-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                      {group.category}
                    </div>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Command.Item
                          key={item.id}
                          value={item.id}
                          onSelect={() => handleCommand(item.id)}
                          className={cn(
                            'flex items-center gap-3 px-4 py-2.5',
                            'cursor-pointer',
                            'data-[selected=true]:bg-neutral-800 data-[selected=true]:bg-opacity-50',
                            'transition-colors duration-100',
                          )}
                        >
                          <Icon size={16} className="flex-shrink-0 text-neutral-400" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground">{item.label}</div>
                            <div className="text-xs text-neutral-400">{item.description}</div>
                          </div>
                        </Command.Item>
                      );
                    })}
                  </Command.Group>
                ))}
              </Command.List>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2 text-xs text-neutral-400 border-t border-neutral-700">
                <span>Press ESC to close</span>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
