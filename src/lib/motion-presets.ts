/**
 * Framer Motion presets for the Poseidon adaptation workflow.
 *
 * Applied during the "Poseidon化" step (Architecture B, Step 3)
 * to add page transitions and micro-interactions.
 */

import type { Variants, Transition } from 'framer-motion'

/* ── Transition Curves ── */
export const easings = {
  standard: [0.2, 0.8, 0.2, 1] as const,
  emphasized: [0.2, 0, 0, 1] as const,
  decelerate: [0, 0, 0.2, 1] as const,
}

/* ── Page Transition ── */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export const pageTransitionConfig = {
  duration: 0.3,
  ease: easings.standard,
} satisfies Transition

/* ── Card / Element Entry ── */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
}

export const fadeScale: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
}

export const slideRight: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
}

/* ── Stagger Container ── */
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

/* ── Helper: stagger delay for index ── */
export function staggerDelay(i: number, base = 0.06): Transition {
  return { delay: i * base }
}

