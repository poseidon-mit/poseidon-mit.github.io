import { useState, useRef, useEffect } from 'react';
import type { PromptTemplate } from '@/lib/types';
import { MODELS, MODE_LABELS } from '@/lib/models';
import { cn } from '@/lib/utils';
import { Sparkles, ChevronDown, Check } from 'lucide-react';

interface PromptTemplateSelectorProps {
  templates: PromptTemplate[];
  onApply: (templateId: string) => void;
}

export function PromptTemplateSelector({ templates, onApply }: PromptTemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const builtInTemplates = templates.filter((t) => t.isBuiltIn);
  const customTemplates = templates.filter((t) => !t.isBuiltIn);

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
        <Sparkles size={16} />
        <span>Templates</span>
        <ChevronDown size={14} className={cn('transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div
          className={cn(
            'glass-surface',
            'absolute top-full mt-2 left-0 z-50',
            'w-80 rounded-md',
            'py-1 shadow-lg',
            'border border-neutral-700',
            'max-h-96 overflow-y-auto',
          )}
        >
          {/* Built-in Templates Section */}
          {builtInTemplates.length > 0 && (
            <>
              <div className="px-3 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                Built-in
              </div>
              {builtInTemplates.map((template) => (
                <TemplateItem
                  key={template.id}
                  template={template}
                  onSelect={() => {
                    onApply(template.id);
                    setIsOpen(false);
                  }}
                />
              ))}
            </>
          )}

          {/* Custom Templates Section */}
          {customTemplates.length > 0 && (
            <>
              <div className="px-3 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wide border-t border-neutral-700 mt-1">
                Custom
              </div>
              {customTemplates.map((template) => (
                <TemplateItem
                  key={template.id}
                  template={template}
                  onSelect={() => {
                    onApply(template.id);
                    setIsOpen(false);
                  }}
                />
              ))}
            </>
          )}

          {templates.length === 0 && (
            <div className="px-3 py-4 text-sm text-neutral-400 text-center">
              No templates available
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface TemplateItemProps {
  template: PromptTemplate;
  onSelect: () => void;
}

function TemplateItem({ template, onSelect }: TemplateItemProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full text-left px-3 py-3',
        'flex flex-col gap-2',
        'text-sm transition-colors duration-150',
        'hover:bg-neutral-800 hover:bg-opacity-30',
        'border-b border-neutral-800 last:border-0',
      )}
    >
      <div className="flex items-center justify-between">
        <div className="font-medium text-neutral-100">{template.name}</div>
        <div className={cn('px-2 py-1 rounded text-xs font-medium', 'bg-neutral-800 bg-opacity-50')}>
          {MODE_LABELS[template.mode].label}
        </div>
      </div>

      {/* Model dots */}
      <div className="flex items-center gap-1">
        {template.models.map((modelId) => {
          const config = MODELS[modelId];
          return (
            <div
              key={modelId}
              className={cn('w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold', config.bgClass, config.textClass)}
              title={config.label}
            >
              {config.shortLabel}
            </div>
          );
        })}
      </div>

      {/* Additional info */}
      <div className="text-xs text-neutral-400">
        {template.rounds} round{template.rounds !== 1 ? 's' : ''}
        {template.outputFormat && ` • ${template.outputFormat}`}
      </div>
    </button>
  );
}
