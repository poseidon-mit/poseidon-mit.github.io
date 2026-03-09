/**
 * Shared copy module for the redesigned Landing page.
 *
 * All trust/compliance strings live here so coherence tests
 * can guard against accidental drift (e.g., SOC 2 wording).
 */

import { TRUST_BAR_ITEMS } from './trust-policies'

export const LANDING_COPY = {
  hero: {
    badge: 'MIT CTO Program Group7',
    titleA: 'See the risk. See the upside.',
    titleB: 'Approve with confidence.',
    subtitle: 'The AI-native decisioning platform that shows its work before it asks for trust.',
    primaryCta: 'Explore Demo',
    secondaryCta: 'Get Started',
    videoUrl: 'https://youtu.be/ymwtd7X3CYI?si=QDTH_Yvul-gLER-8',
    trustItems: TRUST_BAR_ITEMS,
    protectProof: {
      sublabel: 'Evidence: counterparty risk, regulatory pattern match, jurisdiction flag',
    },
    growProof: {
      sublabel: 'Projected 3-year advantage per account',
    },
  },
  gap: {
    title: 'The coordination gap is real.',
    subtitle: 'Banking solved compliance. Cross-model decisioning is the next frontier.',
    stats: [
      { value: '$1.3M/mo', label: 'Average cost of decisioning friction per institution', source: 'McKinsey, 2024' },
      { value: '$12.5B', label: 'Lost to fraud annually', source: 'FTC, 2024' },
      { value: '37%', label: 'Of flagged transactions are false positives', source: 'Aite-Novarica, 2024' },
    ],
  },
  architecture: {
    title: 'Human-centered AI architecture.',
    subtitle: 'Four steps. The banker stays in control.',
    steps: [
      { label: 'Models Compute', description: 'Specialized AI models analyze risk, opportunity, and compliance across client portfolios.' },
      { label: 'Council Deliberates', description: 'Multiple models challenge each other — disagreements are surfaced, not hidden.' },
      { label: 'Agents Prepare', description: 'Autonomous agents stage actions — nothing executes without banker authorization.' },
      { label: 'You Authorize', description: 'Slide-to-approve for high-stakes actions, full audit trail and rollback window.' },
    ],
  },
  engines: {
    title: 'Four pillars. One command center.',
  },
  cta: {
    title: 'Start your demo in under 60 seconds.',
    button: 'Explore Demo',
  },
} as const
