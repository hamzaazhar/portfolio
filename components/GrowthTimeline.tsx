'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface TimelineItem {
  year: string
  label: string
}

interface GrowthTimelineProps {
  items: TimelineItem[]
}

// Color mapping based on year
const getColor = (index: number) => {
  const colors = [
    { accent: 'text-accent-yellow', border: 'border-accent-yellow', bg: 'bg-accent-yellow/10', iconBg: 'bg-accent-yellow/20' },
    { accent: 'text-accent-yellow', border: 'border-accent-yellow', bg: 'bg-accent-yellow/10', iconBg: 'bg-accent-yellow/20' },
    { accent: 'text-accent-purple', border: 'border-accent-purple', bg: 'bg-accent-purple/10', iconBg: 'bg-accent-purple/20' },
    { accent: 'text-accent-purple', border: 'border-accent-purple', bg: 'bg-accent-purple/10', iconBg: 'bg-accent-purple/20' },
    { accent: 'text-accent-red', border: 'border-accent-red', bg: 'bg-accent-red/10', iconBg: 'bg-accent-red/20' },
  ]
  return colors[index % colors.length]
}

export function GrowthTimeline({ items }: GrowthTimelineProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    // Set initial width
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth)
    }

    // Handle window resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Determine if we should use mobile layout (single column)
  const isMobile = windowWidth > 0 && windowWidth < 768
  const isTablet = windowWidth >= 768 && windowWidth < 1024
  const isDesktop = windowWidth >= 1024

  return (
    <div className="relative w-full">
      {/* Vertical Line with gradient - visible on all screen sizes, positioned left on mobile */}
      <div className={`absolute top-0 bottom-0 bg-gradient-to-b from-accent via-accent-purple to-accent-red ${
        isMobile 
          ? 'left-0 w-0.5' 
          : 'left-1/2 -translate-x-1/2 w-0.5 sm:w-1'
      }`} />
      
      <div className={`space-y-4 sm:space-y-6 ${isMobile ? 'pl-0' : ''}`}>
        {items.map((item, index) => {
          const colors = getColor(index)
          // On mobile, all items align left. On larger screens, alternate left/right
          const isRight = isMobile ? false : index % 2 === 0
          
          return (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : (isMobile ? 0 : (isRight ? 20 : -20)) }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ 
                duration: prefersReducedMotion ? 0.06 : 0.28, 
                delay: prefersReducedMotion ? 0 : index * 0.04,
                ease: prefersReducedMotion ? [0, 0, 1, 1] : [0.2, 0.7, 0.2, 1] as [number, number, number, number]
              }}
              className={`relative flex items-baseline ${
                isMobile ? 'min-h-[50px] pl-6' : 'min-h-[60px]'
              }`}
            >
              {/* Dot on the line - aligned with text baseline */}
              <div 
                className={`absolute rounded-full border-2 border-surface shadow-md z-10 ${
                  isMobile 
                    ? 'left-0 -translate-x-1/2 w-3 h-3' 
                    : 'left-1/2 -translate-x-1/2 w-4 h-4 sm:w-5 sm:h-5'
                }`}
                style={{
                  top: isMobile ? '0.5rem' : '0.75rem',
                  backgroundColor: index === 0 ? '#FFC857' : index === 1 ? '#FFC857' : index === 2 ? '#6C63FF' : index === 3 ? '#6C63FF' : '#F87171',
                  boxShadow: `0 0 0 2px ${index === 0 ? 'rgba(255, 200, 87, 0.2)' : index === 1 ? 'rgba(255, 200, 87, 0.2)' : index === 2 ? 'rgba(108, 99, 255, 0.2)' : index === 3 ? 'rgba(108, 99, 255, 0.2)' : 'rgba(248, 113, 113, 0.2)'}`
                }} 
              />
              
              {/* Content wrapper - responsive width and layout */}
              <div 
                className={`flex items-baseline gap-2 sm:gap-4 ${
                  isMobile 
                    ? 'flex-row w-full' 
                    : isRight 
                      ? 'flex-row' 
                      : 'flex-row-reverse'
                }`} 
                style={!isMobile ? { 
                  width: isTablet ? 'calc(50% - 16px)' : 'calc(50% - 20px)', 
                  marginLeft: isRight ? 'auto' : '0', 
                  marginRight: isRight ? '0' : 'auto' 
                } : {}}
              >
                {/* Year - responsive width */}
                <div className={`flex-shrink-0 ${
                  isMobile 
                    ? 'w-16' 
                    : isTablet 
                      ? 'w-20' 
                      : 'w-20 sm:w-24'
                }`}>
                  <span className={`font-heading font-bold ${colors.accent} leading-none ${
                    isMobile 
                      ? 'text-base' 
                      : 'text-lg sm:text-xl'
                  }`}>
                    {item.year}
                  </span>
                </div>
                
                {/* Content Card with colored bottom border - responsive padding */}
                <div className="flex-1 min-w-0">
                  <div className={`relative rounded-lg ${colors.bg} border-b-2 ${colors.border} ${
                    isMobile 
                      ? 'p-3' 
                      : 'p-4 sm:p-5'
                  }`}>
                    <p className={`text-text leading-relaxed ${
                      isMobile 
                        ? 'text-sm' 
                        : 'text-base sm:text-lg'
                    }`}>
                      {item.label}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

