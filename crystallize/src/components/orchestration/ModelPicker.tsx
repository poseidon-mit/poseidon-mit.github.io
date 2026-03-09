import type { ModelId, OrchestrationMode } from '@/lib/types';
import { MODELS, ALL_MODELS } from '@/lib/models';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ModelPickerProps {
  activeModels: ModelId[];
  onToggle: (model: ModelId) => void;
  mode: OrchestrationMode;
}

export function ModelPicker({ activeModels, onToggle, mode }: ModelPickerProps) {
  const isSingleMode = mode === 'single';
  const canAddMore = !isSingleMode || activeModels.length === 0;

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_MODELS.map((modelId) => {
        const config = MODELS[modelId];
        const isActive = activeModels.includes(modelId);
        const canToggle = isSingleMode ? isActive || canAddMore : true;

        return (
          <motion.button
            key={modelId}
            onClick={() => {
              if (canToggle) {
                onToggle(modelId);
              }
            }}
            disabled={!canToggle}
            whileHover={canToggle ? { scale: 1.05 } : {}}
            whileTap={canToggle ? { scale: 0.95 } : {}}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5',
              'rounded-full text-sm font-medium',
              'transition-all duration-200',
              'cursor-pointer',
              isActive
                ? cn(
                    config.bgClass,
                    config.borderClass,
                    'border',
                    config.textClass,
                    'ring-1 ring-opacity-50',
                  )
                : cn(
                    'bg-neutral-800 bg-opacity-30',
                    'text-neutral-400',
                    'border border-neutral-700',
                    'hover:bg-opacity-50',
                  ),
              !canToggle && 'opacity-40 cursor-not-allowed',
            )}
          >
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                isActive ? config.bgClass : 'bg-neutral-500',
              )}
            />
            <span>{config.shortLabel}</span>
          </motion.button>
        );
      })}

      {isSingleMode && activeModels.length > 0 && (
        <div className="text-xs text-neutral-400 flex items-center">
          (single mode)
        </div>
      )}
    </div>
  );
}
