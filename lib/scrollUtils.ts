/**
 * Scroll utility functions for performance optimization
 */

/**
 * Get scroll position with cross-browser compatibility
 */
export function getScrollPosition(): number {
  return window.pageYOffset || window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
}

/**
 * Throttle scroll handler using requestAnimationFrame
 */
export function throttleScroll(handler: () => void): () => void {
  let ticking = false
  
  const throttledHandler = () => {
    if (!ticking) {
      const rafCallback = () => {
        handler()
        ticking = false
      }
      
      if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(rafCallback)
      } else {
        setTimeout(rafCallback, 16) // ~60fps fallback
      }
      ticking = true
    }
  }
  
  return throttledHandler
}

/**
 * Check if passive event listeners are supported
 */
export function supportsPassiveListeners(): boolean {
  let passiveSupported = false
  try {
    const options = {
      get passive() {
        passiveSupported = true
        return false
      }
    }
    window.addEventListener('test', null as any, options)
    window.removeEventListener('test', null as any, options)
  } catch (err) {
    passiveSupported = false
  }
  return passiveSupported
}

