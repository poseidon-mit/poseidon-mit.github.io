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

function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  if (typeof window.matchMedia === 'function') {
    return window.matchMedia('(max-width: 1023px)').matches;
  }
  return window.innerWidth <= 1023;
}

/**
 * Hook for managing command palette state
 * Registers global Cmd+K / Ctrl+K keyboard listener
 */
export function useCommandPalette(): UseCommandPaletteReturn {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    if (isMobileViewport()) return;
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => {
    if (isMobileViewport()) return;
    setIsOpen(prev => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (isMobileViewport()) return;
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
