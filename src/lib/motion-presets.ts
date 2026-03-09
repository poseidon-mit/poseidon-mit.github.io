/**
 * Framer Motion presets for the Poseidon adaptation workflow.
 *
 * Convention: hidden/visible keys — matches engine page JSX
 * (initial="hidden" animate="visible").
 */

import type { Variants, Transition } from 'framer-motion'

/* ── Transition Curves ── */
export const easings = {
  standard: [0.2, 0.8, 0.2, 1] as const,
  emphasized: [0.2, 0, 0, 1] as const,
  decelerate: [0, 0, 0.2, 1] as const,
  /** Premium scroll-reveal curve — fast attack, long deceleration tail */
  poseidonScroll: [0.23, 1, 0.32, 1] as const,
}

/* ── Spring config (Apple creator-studio baseline) ── */
const spring = { type: 'spring' as const, stiffness: 220, damping: 30 }
export const creatorStudioSpringPress = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 25,
  mass: 0.8,
}

/** Hover-lift spring for KPI / stat cards (Dashboard, etc.) */
export const hoverLift = { type: 'spring' as const, stiffness: 400, damping: 25 }

/** Card-select spring for interactive selection (GrowScenarios, etc.) */
export const cardSelect = { type: 'spring' as const, stiffness: 280, damping: 24, mass: 0.8 }

/* ── Page Transition ── */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -3 },
}

export const pageTransitionConfig = {
  duration: 0.3,
  ease: easings.standard,
} satisfies Transition

/* ── Card / Element Entry ── */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.995 },
  visible: { opacity: 1, y: 0, scale: 1, transition: spring },
}

export const creatorStudioFadeUp: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.995 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: spring,
  },
}

export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: spring },
}

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: spring },
}

/* ── Stagger Container ── */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.02,
      staggerChildren: 0.025,
    },
  },
}

export const creatorStudioStaggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.02,
      staggerChildren: 0.025,
    },
  },
}

/** Compatibility alias for old delayed-stagger API (now synced for simultaneous entry). */
export const staggerContainerDelayed: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.08,
    },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.995 },
  visible: { opacity: 1, y: 0, scale: 1, transition: spring },
}

export const creatorStudioStaggerItem: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.995 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: spring,
  },
}

/** Route-level contract: all children enter at the same time (no staggering). */
export const creatorStudioRouteSyncContainer: Variants = {
  hidden: {},
  visible: {},
}

/** Route-level card/item contract: spring movement without opacity fade (anti-flicker). */
export const creatorStudioRouteSyncItem: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.995 },
  visible: { opacity: 1, y: 0, scale: 1, transition: spring },
}

/* ── Helper: stagger delay for index ── */
export function staggerDelay(i: number, base = 0.1): Transition {
  return { delay: i * base }
}

/* ── Presentation mode variants (slower for readability) ── */
export const staggerContainerPresentation: Variants = {
  hidden: {},
  visible: {},
}

/* ── Accordion expand/collapse ── */
export const accordionVariants: Variants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
}

export const accordionTransition: Transition = {
  duration: 0.25,
  ease: 'easeInOut' as const,
}

/* ── Reduced motion variants (instant, no animation) ── */
export const staticVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
}

export const staticContainer: Variants = {
  hidden: {},
  visible: {},
}

/** Page transition with reduced motion (instant) */
export const pageTransitionReduced: Variants = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 1, y: 0 },
}

/**
 * Returns motion-safe or static variants based on prefers-reduced-motion.
 * Use at the top of a component to pick the right set.
 */
export function getMotionPreset(prefersReduced: boolean) {
  return {
    fadeUp: prefersReduced ? staticVariants : fadeUp,
    creatorStudioFadeUp: prefersReduced ? staticVariants : creatorStudioFadeUp,
    fadeIn: prefersReduced ? staticVariants : fadeIn,
    fadeScale: prefersReduced ? staticVariants : fadeScale,
    staggerContainer: prefersReduced ? staticContainer : staggerContainer,
    creatorStudioStaggerContainer: prefersReduced ? staticContainer : creatorStudioStaggerContainer,
    staggerContainerDelayed: prefersReduced ? staticContainer : staggerContainerDelayed,
    staggerItem: prefersReduced ? staticVariants : staggerItem,
    creatorStudioStaggerItem: prefersReduced ? staticVariants : creatorStudioStaggerItem,
    creatorStudioRouteSyncContainer: prefersReduced ? staticContainer : creatorStudioRouteSyncContainer,
    creatorStudioRouteSyncItem: prefersReduced ? staticVariants : creatorStudioRouteSyncItem,
    pageTransition: prefersReduced ? pageTransitionReduced : pageTransition,
  }
}
