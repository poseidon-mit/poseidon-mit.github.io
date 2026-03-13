export const JETON_COPY = {
  hero: {
    eyebrow: 'POSEIDON FINANCIAL OS',
    titleA: 'Your Money. One Brain.',
    titleB: 'Always Your Call.',
    body: 'Four AI engines compute, explain, and stage actions — nothing moves until you approve.',
    primaryCta: 'Open Prototype',
    secondaryCta: 'Deck',
    trustLine: 'Read-only bank connections · SOC 2 Type II · AES-256 encrypted · LLM zero-retention',
  },
  valueProp: {
    eyebrow: 'THE PLATFORM',
    title: 'Four Engines. One Balance Sheet.',
    body: 'Protect spots fraud. Grow finds savings. Execute stages actions. Govern keeps the receipts. All four share context so nothing falls through the cracks.',
  },
  governance: {
    eyebrow: 'TRUST ARCHITECTURE',
    words: ['Explainable.', 'Auditable.', 'Reversible.'] as const,
    body: 'Every recommendation includes an evidence trail, decision lineage, and controlled rollback path.',
    proof: 'System uptime 99.97% · Last audit: 4m ago · Model v3.2.1 · Decisions today: 47',
  },
  cta: {
    titleA: 'See what your money',
    titleB: 'could be doing.',
    body: 'The interactive prototype runs on simulated data. Explore all four engines in under a minute.',
    button: 'LAUNCH DASHBOARD',
    meta: 'Read-only connections · Explainable AI · No invisible automation',
  },
  trust: {
    eyebrow: 'TRUST ARCHITECTURE',
    title: 'Don\'t Take Our Word. Verify.',
    pillars: [
      {
        title: 'AES-256 Encryption',
        description: 'Your financial data is encrypted at rest and in transit with the same standard used by governments and defense systems.',
        icon: 'lock' as const,
      },
      {
        title: 'Read-Only Access',
        description: 'Poseidon can see your accounts but cannot move a single dollar. No write tokens. Transactions require your explicit approval.',
        icon: 'shield' as const,
      },
      {
        title: 'Full Evidence Trails',
        description: 'Every recommendation shows which signals fired, how much each contributed, and the model version — so you can audit the reasoning yourself.',
        icon: 'eye' as const,
      },
    ],
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
    description: 'Catches suspicious charges like a $1,299 Apple Store Miami purchase when your phone is in Boston. Explains exactly why.',
    confidence: '0.94',
    tone: 'protect',
    wide: true,
  },
  {
    name: 'Grow',
    description: 'Finds money you\'re leaving on the table. Example: move $20K idle cash to 8% APY and earn +$133/mo.',
    confidence: '0.89',
    tone: 'grow',
  },
  {
    name: 'Execute',
    description: 'AI prepares the action. You tap approve. Changed your mind? Full rollback for 24–72 hours. Nothing runs without you.',
    confidence: '0.91',
    tone: 'execute',
  },
  {
    name: 'Govern',
    description: 'Every AI decision is logged with its reasoning, confidence score, and model version. 100% coverage, zero training on your data.',
    confidence: '0.97',
    tone: 'govern',
    wide: true,
  },
] as const;
