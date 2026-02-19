/**
 * Command Palette Hook
 * Manages command palette state and global keyboard listener
 */

import { useState, useEffect, useCallback } from 'react';

export interface UseCommandPaletteReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Hook for managing command palette state
 * Registers global Cmd+K / Ctrl+K keyboard listener
 */
export function useCommandPalette(): UseCommandPaletteReturn {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
      const isCommandKey = isMac ? e.metaKey : e.ctrlKey;

      if (isCommandKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        open();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return {
    isOpen,
    open,
    close,
    toggle
  };
}
