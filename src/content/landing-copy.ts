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
      sublabel: 'Evidence: merchant pattern, amount deviation, timing anomaly',
    },
    growProof: {
      sublabel: 'Projected 3-year advantage for your finances',
    },
  },
  gap: {
    title: 'The coordination gap is real.',
    subtitle: 'Your money is spread across apps that don\'t talk to each other.',
    stats: [
      { value: '$12.5B', label: 'Lost to fraud annually in the US', source: 'FTC, 2024' },
      { value: '$5,328', label: 'Average annual savings left on the table per household', source: 'McKinsey, 2024' },
      { value: '37%', label: 'Of fraud alerts are false positives', source: 'Aite-Novarica, 2024' },
    ],
  },
  architecture: {
    title: 'Human-centered AI architecture.',
    subtitle: 'Four steps. You stay in control.',
    steps: [
      { label: 'Models Compute', description: 'Specialized AI models analyze your spending, savings, and risk in real time.' },
      { label: 'Council Deliberates', description: 'Multiple models challenge each other — disagreements are surfaced, not hidden.' },
      { label: 'Agents Prepare', description: 'Autonomous agents stage actions — nothing executes without your authorization.' },
      { label: 'You Authorize', description: 'Approve with a tap for important actions, full audit trail and rollback window.' },
    ],
  },
  engines: {
    title: 'Four pillars. One dashboard.',
  },
  cta: {
    title: 'Start your demo in under 60 seconds.',
    button: 'Explore Demo',
  },
} as const
