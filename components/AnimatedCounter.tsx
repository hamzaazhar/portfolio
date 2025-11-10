'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

interface AnimatedCounterProps {
  from?: number
  to: number
  duration?: number
  suffix?: string
  prefix?: string
}

export function AnimatedCounter({ 
  from = 0, 
  to, 
  duration = 1.5,
  suffix = '',
  prefix = ''
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' })
  const motionValue = useMotionValue(from)
  
  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)
    } catch (err) {
      setPrefersReducedMotion(false)
    }
  }, [])

  // Optimize spring configuration for better mobile performance
  const springValue = useSpring(motionValue, {
    damping: prefersReducedMotion ? 1000 : 100,
    stiffness: prefersReducedMotion ? 1000 : 100,
  })

  useEffect(() => {
    if (inView) {
      motionValue.set(to)
    }
  }, [motionValue, inView, to])

  // Cross-browser number formatting with fallbacks
  const formatNumber = useCallback((value: number) => {
    const num = Math.floor(value)
    
    // Try modern Intl.NumberFormat first
    if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
      try {
        return new Intl.NumberFormat('en-US').format(num)
      } catch (error) {
        // Fall through to manual formatting
      }
    }
    
    // Fallback for older browsers
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }, [])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        const formatted = formatNumber(latest)
        ref.current.textContent = `${prefix}${formatted}${suffix}`
      }
    })
    return unsubscribe
  }, [springValue, formatNumber, prefix, suffix])

  return <span ref={ref}>{prefix}{from}{suffix}</span>
}

