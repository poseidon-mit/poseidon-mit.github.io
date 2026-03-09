import type { ModelId } from '@/lib/types';
import { MODELS } from '@/lib/models';
import { cn } from '@/lib/utils';

interface ModelTagProps {
  model: ModelId;
  size?: 'sm' | 'md';
}

export function ModelTag({ model, size = 'md' }: ModelTagProps) {
  const modelConfig = MODELS[model];

  const sizeClasses = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';

  // Use rgba with 8% opacity for background (roughly rgba opacity)
  const bgStyle = {
    backgroundColor: `${modelConfig.color}14`, // 14 in hex ≈ 8% opacity
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap',
        sizeClasses,
        modelConfig.textClass
      )}
      style={bgStyle}
    >
      <div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: modelConfig.color }}
      />
      {modelConfig.label}
    </div>
  );
}
