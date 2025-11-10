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
    } as AddEventListenerOptions
    
    // Use type assertion to bypass strict type checking for test event
    const testEvent = 'test' as keyof WindowEventMap
    const nullListener = null as any
    
    window.addEventListener(testEvent, nullListener, options)
    window.removeEventListener(testEvent, nullListener, options)
  } catch (err) {
    passiveSupported = false
  }
  return passiveSupported
}

