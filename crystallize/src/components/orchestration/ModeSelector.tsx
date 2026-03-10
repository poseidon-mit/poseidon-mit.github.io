import { useState, useRef, useEffect } from 'react';
import type { OrchestrationMode } from '@/lib/types';
import { MODE_LABELS } from '@/lib/models';
import { cn } from '@/lib/utils';
import {
  MessageSquare,
  Columns3,
  Swords,
  ClipboardCheck,
  Layers,
  Settings2,
  ChevronDown,
  Check,
} from 'lucide-react';

interface ModeSelectorProps {
  mode: OrchestrationMode;
  onChange: (mode: OrchestrationMode) => void;
}

const modeIcons: Record<OrchestrationMode, React.ReactNode> = {
  single: <MessageSquare size={16} />,
  parallel: <Columns3 size={16} />,
  debate: <Swords size={16} />,
  review: <ClipboardCheck size={16} />,
  refine: <Layers size={16} />,
  custom: <Settings2 size={16} />,
};

const modes: OrchestrationMode[] = ['single', 'parallel', 'debate', 'review', 'refine', 'custom'];

export function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentMode = MODE_LABELS[mode];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'glass-surface glass-surface-hover',
          'flex items-center gap-2 px-3 py-2',
          'rounded-md text-sm font-medium',
          'transition-all duration-200',
          'hover:bg-opacity-100',
        )}
      >
        <span className="flex items-center gap-2">
          {modeIcons[mode]}
          <span>{currentMode.label}</span>
        </span>
        <ChevronDown size={14} className={cn('transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div
          className={cn(
            'glass-surface',
            'absolute bottom-full mb-2 left-0 z-50',
            'w-64 rounded-md',
            'py-1 shadow-lg',
            'border border-neutral-700',
          )}
        >
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => {
                onChange(m);
                setIsOpen(false);
              }}
              className={cn(
                'w-full text-left px-3 py-2',
                'flex items-center gap-2',
                'text-sm transition-colors duration-150',
                mode === m
                  ? 'bg-neutral-800 bg-opacity-50 text-cyan-400'
                  : 'text-neutral-300 hover:bg-neutral-800 hover:bg-opacity-30',
              )}
            >
              <span className="flex items-center gap-2 flex-1">
                {modeIcons[m]}
                <div>
                  <div className="font-medium">{MODE_LABELS[m].label}</div>
                  <div className="text-xs text-neutral-400">{MODE_LABELS[m].description}</div>
                </div>
              </span>
              {mode === m && <Check size={16} className="text-cyan-400 ml-auto flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
