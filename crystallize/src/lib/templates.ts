import type { PromptTemplate } from './types';

export const BUILT_IN_TEMPLATES: PromptTemplate[] = [
  {
    id: 'three-ideas',
    name: '3 Ideas from 3 Models',
    mode: 'parallel',
    models: ['claude', 'gpt', 'gemini'],
    systemPrompt:
      'Generate one unique idea from a different angle than other models would take. Be specific and original.',
    rounds: 1,
    isBuiltIn: true,
  },
  {
    id: 'debate-2-rounds',
    name: 'Debate (2 rounds)',
    mode: 'debate',
    models: ['claude', 'gpt', 'gemini'],
    systemPrompt: 'Engage in a structured debate. Challenge assumptions. Cite specific reasoning.',
    rounds: 2,
    isBuiltIn: true,
  },
  {
    id: 'draft-and-review',
    name: 'Draft → Review → Final',
    mode: 'refine',
    models: ['claude', 'gpt', 'gemini'],
    systemPrompt:
      'First model: draft. Second model: review and critique. Third model: produce the final polished version incorporating the review.',
    rounds: 1,
    isBuiltIn: true,
  },
  {
    id: 'red-team',
    name: 'Red Team',
    mode: 'review',
    models: ['claude', 'gpt', 'gemini'],
    systemPrompt:
      'One model generates the proposal. The other two independently identify weaknesses, risks, and blind spots. Be rigorous.',
    rounds: 1,
    isBuiltIn: true,
  },
  {
    id: 'executive-polish',
    name: 'Executive Polish',
    mode: 'refine',
    models: ['claude', 'gpt'],
    systemPrompt:
      'First model: write the executive draft. Second model: refine for precision, tone, and executive credibility. Output format: polished final version only.',
    rounds: 1,
    isBuiltIn: true,
  },
  {
    id: 'format-lock',
    name: 'Format Lock',
    mode: 'single',
    models: ['claude'],
    systemPrompt:
      'Output strictly in the format specified by the user. No commentary, no preamble. Format only.',
    outputFormat: 'User specifies in message',
    rounds: 1,
    isBuiltIn: true,
  },
];

export function getTemplateById(id: string): PromptTemplate | undefined {
  return BUILT_IN_TEMPLATES.find(t => t.id === id);
}

export function getTemplates(includeBuiltIn = true): PromptTemplate[] {
  // In the future, this can load custom templates from localStorage
  // For now, just return built-in templates
  return includeBuiltIn ? BUILT_IN_TEMPLATES : [];
}
