import { TRUST_BAR_ITEMS } from './trust-policies'

export const LANDING_COPY = {
  pageTitle: "Welcome to Poseidon",
  skipLink: "Skip to content",
  nav: {
    brandText: "POSEIDON",
    brandAriaLabel: "Poseidon home",
    primaryCta: "Try the Demo"
  },
  hero: {
    badge: "MIT CTO Program Group 7",
    headlineLine1: "Your Money Effortlessly.",
    headlineLine2: "Always Your Control.",
    subtitle: "Four AI engines analyze your money and suggest the best moves. But nothing happens until you say yes.",
    primaryCta: "Try the Demo",
    secondaryCta: "Watch Video",
    videoUrl: 'https://youtu.be/ymwtd7X3CYI?si=QDTH_Yvul-gLER-8',
    trustItems: TRUST_BAR_ITEMS,
  },
  engineShowcase: {
    sectionTitle: "How It Works",
    sectionSubtitle: "Four smart engines working together to keep your money safe and growing.",
    cards: [
      { id: "protect", name: "Protect", description: "Watches your accounts 24/7 to alert anomaly before it happens.", confidence: "99.9%" },
      { id: "grow", name: "Grow", description: "Constantly looks for safe ways to earn you more money.", confidence: "98.2%" },
      { id: "execute", name: "Execute", description: "Sets up your transfers and waits for your final tap.", confidence: "100%" },
      { id: "govern", name: "Govern", description: "Keeps a perfect, unchangeable record of every action.", confidence: "100%" }
    ]
  },
  trustSection: {
    sectionTitle: "Built for Your Peace of Mind",
    sectionSubtitle: "You always know exactly what is happening with your money. Every suggestion is explained clearly, and you are always in full control.",
    features: [
      { label: "Bank-Level Security", description: "Your data is completely locked and protected at all times." },
      { label: "Clear Answers", description: "The AI tells you exactly why it makes every suggestion." },
      { label: "Perfect Memory", description: "A fully detailed history of everything that happens in your account." }
    ]
  },
  finalCta: {
    headlineLine1: "Experience",
    headlineLine2: "the Demo.",
    subtitle: "Try out our interactive app using non-real money.",
    button: "START DEMO",
    proofPoints: [
      "No real money used",
      "Prototype"
    ]
  },
  footer: {
    meta: "MIT Professional Education CTO Program · Group 7 · 2026",
    links: [
      "Security",
      "Pricing",
      "Contact"
    ]
  }
} as const;
