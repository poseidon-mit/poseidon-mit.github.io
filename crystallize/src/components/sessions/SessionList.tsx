import { useState, useMemo } from 'react';
import type { Session } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Plus, Search, X } from 'lucide-react';
import { SessionItem } from './SessionItem';
import { motion, AnimatePresence } from 'framer-motion';

interface SessionListProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

export function SessionList({
  sessions,
  activeSessionId,
  onSelect,
  onCreate,
  onDelete,
  onRename,
}: SessionListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Sort sessions by updatedAt (most recent first) and filter by search query
  const filteredSessions = useMemo(() => {
    return sessions
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .filter((session) => session.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [sessions, searchQuery]);

  return (
    <div className="flex flex-col h-full gap-3">
      {/* New Chat Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCreate}
        className={cn(
          'glass-surface glass-surface-hover',
          'flex items-center justify-center gap-2',
          'w-full px-4 py-3',
          'rounded-md font-medium text-sm',
          'transition-all duration-200',
          'text-cyan-400',
          'border border-cyan-500 border-opacity-30',
        )}
      >
        <Plus size={18} />
        <span>New Chat</span>
      </motion.button>

      {/* Search Input */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search sessions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            'glass-surface glass-surface-hover',
            'w-full pl-10 pr-4 py-2',
            'rounded-md text-sm',
            'text-foreground placeholder-neutral-400',
            'outline-none transition-all duration-200',
            'border border-transparent focus:border-neutral-600',
          )}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {filteredSessions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full text-center px-4"
            >
              <div className="text-neutral-400">
                {sessions.length === 0 ? (
                  <div>
                    <p className="text-sm font-medium mb-1">No chats yet</p>
                    <p className="text-xs">Create a new chat to get started</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm">No sessions match your search</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-1">
              {filteredSessions.map((session) => (
                <motion.div
                  key={session.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <SessionItem
                    session={session}
                    isActive={activeSessionId === session.id}
                    onSelect={() => onSelect(session.id)}
                    onDelete={() => onDelete(session.id)}
                    onRename={(title) => onRename(session.id, title)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
