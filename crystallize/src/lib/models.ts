import type { ModelId } from './types';

export interface ModelConfig {
  id: ModelId;
  label: string;
  shortLabel: string;
  color: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}

export const MODELS: Record<ModelId, ModelConfig> = {
  claude: {
    id: 'claude',
    label: 'Claude',
    shortLabel: 'C',
    color: '#00F0FF',
    bgClass: 'bg-model-claude',
    textClass: 'text-model-claude',
    borderClass: 'border-model-claude',
  },
  gpt: {
    id: 'gpt',
    label: 'GPT',
    shortLabel: 'G',
    color: '#22C55E',
    bgClass: 'bg-model-gpt',
    textClass: 'text-model-gpt',
    borderClass: 'border-model-gpt',
  },
  gemini: {
    id: 'gemini',
    label: 'Gemini',
    shortLabel: 'Gm',
    color: '#8B5CF6',
    bgClass: 'bg-model-gemini',
    textClass: 'text-model-gemini',
    borderClass: 'border-model-gemini',
  },
};

export const ALL_MODELS: ModelId[] = ['claude', 'gpt', 'gemini'];

export const MODE_LABELS: Record<string, { label: string; description: string }> = {
  single: { label: 'Single', description: 'Send to one model' },
  parallel: { label: 'Parallel', description: 'All models answer independently' },
  debate: { label: 'Debate', description: 'Models respond to each other' },
  review: { label: 'Review', description: 'One drafts, others critique' },
  refine: { label: 'Refine', description: 'Each model improves the previous' },
  custom: { label: 'Custom', description: 'User-defined prompt chain' },
};
