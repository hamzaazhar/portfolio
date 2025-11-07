/**
 * Centralized motion constants for consistent animations across the site
 * Respects prefers-reduced-motion
 */

export const MOTION = {
  // Durations (in seconds)
  duration: {
    fast: 0.12,
    normal: 0.16,
    slow: 0.28,
    reveal: 0.28,
    reduced: 0.06,
  },
  
  // Easing curves
  easing: {
    entrance: [0.2, 0.7, 0.2, 1] as [number, number, number, number],
    exit: [0.4, 0, 0.2, 1] as [number, number, number, number],
    reduced: [0, 0, 1, 1] as [number, number, number, number],
  },
  
  // Stagger delays
  stagger: {
    default: 0.04,
    reduced: 0,
  },
  
  // Viewport settings
  viewport: {
    once: true,
    amount: 0.2,
    margin: '-100px',
  },
} as const

/**
 * Get motion props based on reduced motion preference
 */
export function getMotionProps(reduced: boolean, delay: number = 0) {
  return {
    duration: reduced ? MOTION.duration.reduced : MOTION.duration.reveal,
    delay: reduced ? 0 : delay,
    ease: reduced ? MOTION.easing.reduced : MOTION.easing.entrance,
  }
}

