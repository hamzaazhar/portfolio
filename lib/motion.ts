/**
 * Centralized motion constants for consistent animations across the site
 * Respects prefers-reduced-motion and optimizes for iOS performance
 */

// Detect iOS for performance optimizations
export function isIOSDevice(): boolean {
  if (typeof window === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

export const MOTION = {
  // Durations (in seconds) - faster for iOS
  duration: {
    fast: 0.1,
    normal: 0.15,
    slow: 0.2,
    reveal: 0.2, // Reduced from 0.28 for faster animations
    reduced: 0.06,
    ios: 0.15, // Even faster for iOS
  },
  
  // Easing curves - simpler for better iOS performance
  easing: {
    entrance: [0.2, 0.7, 0.2, 1] as [number, number, number, number],
    entranceIOS: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number], // Simpler curve for iOS
    exit: [0.4, 0, 0.2, 1] as [number, number, number, number],
    reduced: [0, 0, 1, 1] as [number, number, number, number],
  },
  
  // Stagger delays - reduced for faster loading
  stagger: {
    default: 0.02, // Reduced from 0.04
    reduced: 0,
    ios: 0.01, // Even faster for iOS
  },
  
  // Viewport settings
  viewport: {
    once: true,
    amount: 0.2,
    margin: '-100px',
  },
} as const

/**
 * Get motion props based on reduced motion preference and iOS detection
 */
export function getMotionProps(reduced: boolean, delay: number = 0) {
  const isIOS = isIOSDevice()
  return {
    duration: reduced 
      ? MOTION.duration.reduced 
      : isIOS 
        ? MOTION.duration.ios 
        : MOTION.duration.reveal,
    delay: reduced ? 0 : (isIOS ? delay * 0.5 : delay), // Reduce delays on iOS
    ease: reduced 
      ? MOTION.easing.reduced 
      : isIOS 
        ? MOTION.easing.entranceIOS 
        : MOTION.easing.entrance,
  }
}

