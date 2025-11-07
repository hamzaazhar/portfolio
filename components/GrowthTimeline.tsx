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

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
  }, [])

  return (
    <div className="relative">
      {/* Vertical Line with gradient - centered */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-b from-accent via-accent-purple to-accent-red" />
      
      <div className="space-y-6">
        {items.map((item, index) => {
          const colors = getColor(index)
          const isRight = index % 2 === 0 // Even indices (0, 2, 4) = right side
          
          return (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : (isRight ? 20 : -20) }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ 
                duration: prefersReducedMotion ? 0.06 : 0.28, 
                delay: prefersReducedMotion ? 0 : index * 0.04,
                ease: prefersReducedMotion ? [0, 0, 1, 1] : [0.2, 0.7, 0.2, 1] as [number, number, number, number]
              }}
              className="relative flex items-baseline min-h-[60px]"
            >
              {/* Dot on the line - aligned with text baseline */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-surface shadow-md z-10"
                style={{
                  top: '0.75rem', // Align with text baseline 
                  backgroundColor: index === 0 ? '#FFC857' : index === 1 ? '#FFC857' : index === 2 ? '#6C63FF' : index === 3 ? '#6C63FF' : '#F87171',
                  boxShadow: `0 0 0 2px ${index === 0 ? 'rgba(255, 200, 87, 0.2)' : index === 1 ? 'rgba(255, 200, 87, 0.2)' : index === 2 ? 'rgba(108, 99, 255, 0.2)' : index === 3 ? 'rgba(108, 99, 255, 0.2)' : 'rgba(248, 113, 113, 0.2)'}`
                }} 
              />
              
              {/* Content wrapper - different order based on side */}
              <div 
                className={`flex items-baseline gap-4 ${isRight ? 'flex-row' : 'flex-row-reverse'}`} 
                style={{ 
                  width: 'calc(50% - 20px)', 
                  marginLeft: isRight ? 'auto' : '0', 
                  marginRight: isRight ? '0' : 'auto' 
                }}
              >
                {/* Year */}
                <div className="flex-shrink-0 w-20 md:w-24">
                  <span className={`text-lg md:text-xl font-heading font-bold ${colors.accent} leading-none`}>
                    {item.year}
                  </span>
                </div>
                
                {/* Content Card with colored bottom border */}
                <div className="flex-1">
                  <div className={`relative p-4 rounded-lg ${colors.bg} border-b-2 ${colors.border}`}>
                    <p className="text-base md:text-lg text-text leading-relaxed">
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

