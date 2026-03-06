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
    subtitle: 'The AI-native money platform that shows its work before it asks for trust.',
    primaryCta: 'Get Started',
    secondaryCta: 'Presentation',
    videoCta: 'Video',
    videoUrl: 'https://youtu.be/ymwtd7X3CYI?si=QDTH_Yvul-gLER-8',
    trustItems: TRUST_BAR_ITEMS,
    protectProof: {
      headline: '2.4x Higher Credential Leak Risk',
      sublabel: 'Spike detected across your merchant network',
    },
    growProof: {
      label: 'Projected 3-Year Advantage',
      sublabel: 'platform-wide savings identified',
      formulaNote: 'avgMonthlySavings × activeProfiles',
    },
  },
  gap: {
    title: 'The coordination gap is real.',
    subtitle: 'Fintech solved visibility. Coordination is the next frontier.',
    stats: [
      { value: '$133/mo', label: 'Average cost of financial friction', source: 'C+R Research, 2024' },
      { value: '$12.5B', label: 'Lost to fraud annually', source: 'FTC, 2024' },
      { value: '$6B/yr', label: 'In junk fees consumers can\'t track', source: 'CFPB, 2023' },
    ],
  },
  architecture: {
    title: 'Human-centered AI architecture.',
    subtitle: 'Four steps. You stay in control.',
    steps: [
      { label: 'Models Compute', description: 'ML models analyze risk, savings, and compliance across all accounts.' },
      { label: 'GenAI Explains', description: 'Every recommendation comes with evidence you can inspect.' },
      { label: 'Agents Prepare', description: 'Autonomous agents stage actions — nothing executes without you.' },
      { label: 'You Approve', description: 'One-tap approval with full audit trail and rollback window.' },
    ],
  },
  engines: {
    title: 'Four engines. One command center.',
  },
  cta: {
    title: 'Start your demo in under 60 seconds.',
    button: 'Get Started — Free',
  },
} as const
