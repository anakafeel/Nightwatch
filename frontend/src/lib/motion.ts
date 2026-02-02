/**
 * Framer Motion variants and utilities for consistent animations.
 * All animations respect the user's reduced motion preference.
 */
import type { Variants, Transition } from "framer-motion";

// Standard easing for Nightwatch theme (smooth, calm)
export const ease = [0.25, 0.1, 0.25, 1];

// Shared transition defaults
export const defaultTransition: Transition = {
  duration: 0.3,
  ease,
};

// Fade in from below (for sections on page load)
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

// Fade in (simple opacity)
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease },
  },
};

// Stagger children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Scale on hover/tap for buttons and cards
export const hoverScale = {
  scale: 1.02,
  transition: defaultTransition,
};

export const tapScale = {
  scale: 0.98,
};

// Dropdown menu animation
export const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -8,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease,
    },
  },
};

// Card hover lift effect
export const cardHover: Variants = {
  rest: {
    y: 0,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  hover: {
    y: -4,
    boxShadow: "0 20px 25px -5px rgba(15, 122, 130, 0.15)",
    transition: {
      duration: 0.3,
      ease,
    },
  },
};

// Route card specific animation
export const routeCardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease },
  },
};

// Helper to get motion props that disable animation when reduced motion is preferred
export function getMotionProps(reducedMotion: boolean): Record<string, unknown> {
  if (reducedMotion) {
    return {
      initial: undefined,
      animate: undefined,
      exit: undefined,
      whileHover: undefined,
      whileTap: undefined,
      whileInView: undefined,
      variants: undefined,
    };
  }
  return {};
}
