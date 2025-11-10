'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface SectionDividerProps {
  color?: 'light' | 'dark'
}

export function SectionDivider({ color = 'light' }: SectionDividerProps) {
  const [isMobile, setIsMobile] = useState(false)
  const gradientId = `dividerGradient-${color}-${Math.random().toString(36).substr(2, 9)}`
  const gradientColors = color === 'light'
    ? { stop1: '#E7E2D9', stop2: '#D4CFC4' } // Light colors for light background
    : { stop1: '#1a1a1a', stop2: '#2a2a2a' } // Dark colors for dark background

  useEffect(() => {
    const checkMobile = () => {
      // Enhanced mobile detection with cross-browser compatibility
      const isMobileWidth = window.innerWidth <= 768
      const isMobileUA = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      setIsMobile(isMobileWidth || isMobileUA || (isTouchDevice && window.innerWidth <= 1024))
    }
    
    checkMobile()
    
    // Throttle resize events for better performance
    let resizeTimer: NodeJS.Timeout
    const throttledResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(checkMobile, 100)
    }
    
    window.addEventListener('resize', throttledResize)
    return () => {
      window.removeEventListener('resize', throttledResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  // Mobile-optimized version with simpler animation
  if (isMobile) {
    return (
      <div className="relative h-16 md:h-24 w-full overflow-hidden">
        <svg
          className="absolute bottom-0 left-0 w-full h-full"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          style={{ display: 'block' }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: gradientColors.stop1, stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: gradientColors.stop2, stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path
            d="M1440,80C1200,80,960,0,720,0C480,0,240,80,0,80V120H1440V80Z"
            fill={`url(#${gradientId})`}
            style={{ opacity: 1 }}
          />
        </svg>
      </div>
    )
  }

  // Desktop version with full animations
  return (
    <div className="relative h-20 md:h-32 w-full overflow-hidden">
      <motion.svg
        className="absolute bottom-0 left-0 w-full h-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        viewport={{ once: true }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: gradientColors.stop1, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: gradientColors.stop2, stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <motion.path
          d="M1440,80C1200,80,960,0,720,0C480,0,240,80,0,80V120H1440V80Z"
          fill={`url(#${gradientId})`}
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        />
      </motion.svg>
    </div>
  )
}

