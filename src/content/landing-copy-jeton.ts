export const JETON_COPY = {
  hero: {
    eyebrow: 'POSEIDON FINANCIAL OS',
    titleA: 'Your Money.',
    titleB: 'AI-Governed.',
    body: 'Four engines. One command center. Every decision explainable, auditable, and reversible.',
    primaryCta: 'Start Now',
    secondaryCta: 'Watch Demo',
    trustLine: 'Bank-grade encryption · GDPR ready · SOC 2 Type II in progress',
  },
  valueProp: {
    eyebrow: 'THE PLATFORM',
    title: 'Four AI Engines. One Command Center.',
    body: 'Protect, Grow, Execute, and Govern work together as one operating layer for high-trust financial decisions.',
  },
  governance: {
    eyebrow: 'TRUST ARCHITECTURE',
    words: ['Explainable.', 'Auditable.', 'Reversible.'] as const,
    body: 'Every recommendation includes an evidence trail, decision lineage, and controlled rollback path.',
    proof: 'System uptime 99.97% · Last audit: 4m ago · Model v3.2.1 · Decisions today: 47',
  },
  cta: {
    titleA: 'Take Command of Your',
    titleB: 'Financial Future.',
    body: 'Built at MIT Sloan. Production-minded from day one.',
    button: 'Get Started — It\'s Free',
    meta: 'Trusted by pilot users · SOC 2 Type II in progress · MIT Sloan CTO Program',
  },
} as const;

export interface JetonFeatureItem {
  name: 'Protect' | 'Grow' | 'Execute' | 'Govern';
  description: string;
  confidence: string;
  tone: 'protect' | 'grow' | 'execute' | 'govern';
  wide?: boolean;
}

export const JETON_FEATURES: readonly JetonFeatureItem[] = [
  {
    name: 'Protect',
    description: 'Real-time threat defense with explainable signals and contextual evidence.',
    confidence: '0.94',
    tone: 'protect',
    wide: true,
  },
  {
    name: 'Grow',
    description: 'Forecast-driven growth planning with scenario-aware recommendations.',
    confidence: '0.89',
    tone: 'grow',
  },
  {
    name: 'Execute',
    description: 'Consent-first automation with rollback controls for every action.',
    confidence: '0.91',
    tone: 'execute',
  },
  {
    name: 'Govern',
    description: 'Unified oversight with full audit lineage from signal to decision.',
    confidence: '0.97',
    tone: 'govern',
    wide: true,
  },
] as const;
