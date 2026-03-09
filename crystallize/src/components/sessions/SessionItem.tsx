import { useState, useRef, useEffect } from 'react';
import type { Session } from '@/lib/types';
import { MODELS } from '@/lib/models';
import { cn, formatTimestamp, truncate } from '@/lib/utils';
import { MoreVertical, Trash2, Edit2, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface SessionItemProps {
  session: Session;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
}

export function SessionItem({ session, isActive, onSelect, onDelete, onRename }: SessionItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(session.title);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const handleRename = () => {
    if (editedTitle.trim()) {
      onRename(editedTitle.trim());
    } else {
      setEditedTitle(session.title);
    }
    setIsEditing(false);
    setShowMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditedTitle(session.title);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      initial={false}
      animate={{
        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
      }}
      transition={{ duration: 0.15 }}
      className={cn(
        'group flex items-center gap-3 px-3 py-2.5',
        'rounded-md cursor-pointer',
        'transition-all duration-150',
        'hover:bg-neutral-800 hover:bg-opacity-30',
        isActive && 'border border-cyan-500 border-opacity-40',
      )}
    >
      <div className="flex-1 min-w-0" onClick={onSelect}>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'glass-surface',
              'w-full px-2 py-1',
              'rounded text-sm',
              'text-foreground',
              'outline-none border border-cyan-500 border-opacity-50',
            )}
          />
        ) : (
          <div className="flex flex-col gap-1.5">
            {/* Session Title */}
            <div className="text-sm font-medium text-foreground">
              {truncate(session.title, 32)}
            </div>

            {/* Model Dots & Timestamp */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                {session.models.map((modelId) => {
                  const config = MODELS[modelId];
                  return (
                    <div
                      key={modelId}
                      className={cn(
                        'w-4 h-4 rounded-full flex items-center justify-center',
                        'text-xs font-bold',
                        config.bgClass,
                        config.textClass,
                      )}
                      title={config.label}
                    >
                      {config.shortLabel}
                    </div>
                  );
                })}
              </div>

              {/* Timestamp */}
              <div className="text-xs text-neutral-400">{formatTimestamp(session.updatedAt)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Menu Button (visible on hover or when editing) */}
      {!isEditing && (
        <div ref={menuRef} className="relative">
          <motion.button
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className={cn(
              'p-1.5 rounded-md',
              'text-neutral-400 hover:text-neutral-200',
              'hover:bg-neutral-700 hover:bg-opacity-30',
              'transition-colors duration-150',
              'opacity-0 group-hover:opacity-100',
              showMenu && 'opacity-100 bg-neutral-700 bg-opacity-30 text-neutral-200',
            )}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            <MoreVertical size={16} />
          </motion.button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div
              className={cn(
                'glass-surface',
                'absolute top-full right-0 mt-1 z-50',
                'w-40 rounded-md py-1',
                'border border-neutral-700',
              )}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className={cn(
                  'w-full text-left px-3 py-2',
                  'flex items-center gap-2',
                  'text-sm text-neutral-300',
                  'hover:bg-neutral-800 hover:bg-opacity-50',
                  'transition-colors duration-150',
                )}
              >
                <Edit2 size={14} />
                Rename
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  setShowMenu(false);
                }}
                className={cn(
                  'w-full text-left px-3 py-2',
                  'flex items-center gap-2',
                  'text-sm text-red-400',
                  'hover:bg-red-500 hover:bg-opacity-10',
                  'transition-colors duration-150',
                  'border-t border-neutral-700',
                )}
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      {/* Edit Actions (visible when editing) */}
      {isEditing && (
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleRename();
            }}
            className={cn(
              'p-1.5 rounded-md',
              'text-green-400 hover:text-green-300',
              'hover:bg-green-500 hover:bg-opacity-10',
              'transition-colors duration-150',
            )}
            title="Save"
          >
            <Save size={16} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setEditedTitle(session.title);
              setIsEditing(false);
            }}
            className={cn(
              'p-1.5 rounded-md',
              'text-neutral-400 hover:text-neutral-200',
              'hover:bg-neutral-700 hover:bg-opacity-30',
              'transition-colors duration-150',
            )}
            title="Cancel"
          >
            <X size={16} />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
