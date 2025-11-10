'use client'

import { motion } from 'framer-motion'
import { Card } from './Card'
import { useState, useEffect } from 'react'
import { getMotionProps } from '@/lib/motion'
import { AnimatedCounter } from './AnimatedCounter'

interface MetricCardProps {
  value: string
  label: string
  accentColor?: 'yellow' | 'purple' | 'red'
  delay?: number
}

export function MetricCard({ value, label, accentColor = 'yellow', delay = 0 }: MetricCardProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
  }, [])

  const gradientStyles = {
    yellow: {
      background: 'linear-gradient(135deg, #FFC857 0%, #FFC857 40%, rgba(255, 200, 87, 0.3) 100%)',
      fallback: 'from-accent via-accent/60 to-accent/20'
    },
    purple: {
      background: 'linear-gradient(135deg, #6C63FF 0%, #6C63FF 40%, rgba(108, 99, 255, 0.3) 100%)',
      fallback: 'from-accent-2 via-accent-2/60 to-accent-2/20'
    },
    red: {
      background: 'linear-gradient(135deg, #F87171 0%, #F87171 40%, rgba(248, 113, 113, 0.3) 100%)',
      fallback: 'from-accent-red via-accent-red/60 to-accent-red/20'
    }
  }

  const bgColors = {
    yellow: 'bg-accent',
    purple: 'bg-accent-2',
    red: 'bg-accent-red'
  }

  // Parse value to separate number and unit (e.g., "3-4 days" -> "3-4" and "days", "70%" -> 70 and "%")
  const parseValue = (val: string) => {
    // Check for percentage
    if (val.includes('%')) {
      const numMatch = val.match(/(\d+)/)
      if (numMatch) {
        return { number: parseInt(numMatch[1], 10), unit: '%', isNumber: true }
      }
      return { number: val, unit: null, isNumber: false }
    }
    
    // Check if value ends with common units
    const unitPattern = /\s+(days?|hours?|months?|years?|weeks?)$/i
    const match = val.match(unitPattern)
    if (match) {
      const numberStr = val.substring(0, match.index).trim()
      const unit = match[0].trim()
      // Check if it's a range like "3-4"
      const rangeMatch = numberStr.match(/(\d+)-(\d+)/)
      if (rangeMatch) {
        return { number: numberStr, unit, isNumber: false }
      }
      // Try to parse as number
      const num = parseInt(numberStr, 10)
      if (!isNaN(num)) {
        return { number: num, unit, isNumber: true }
      }
      return { number: numberStr, unit, isNumber: false }
    }
    
    // Try to extract number from string
    const numMatch = val.match(/(\d+)/)
    if (numMatch) {
      return { number: parseInt(numMatch[1], 10), unit: null, isNumber: true }
    }
    
    // No unit found, not a number
    return { number: val, unit: null, isNumber: false }
  }

  const { number, unit, isNumber } = parseValue(value)

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20, scale: prefersReducedMotion ? 1 : 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={getMotionProps(prefersReducedMotion, delay)}
      whileHover={prefersReducedMotion ? undefined : { 
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2, ease: [0.2, 0.7, 0.2, 1] }
      }}
      className="h-full"
    >
      <Card accentColor={accentColor} className="text-center relative overflow-hidden group h-full shadow-md hover:shadow-lg transition-shadow duration-300 !p-4 md:!p-5">
        {/* Subtle glow effect on hover */}
        <div className={`absolute inset-0 ${bgColors[accentColor]} opacity-0 group-hover:opacity-5 blur-2xl transition-opacity duration-500`} />
        
        <div className="relative z-10 flex flex-col justify-center h-full">
          <motion.div 
            className="flex items-baseline justify-center gap-1 mb-2"
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: delay + 0.1, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {isNumber && typeof number === 'number' ? (
              <>
                <span
                  className="font-heading font-black"
                  style={{ 
                    fontSize: 'clamp(42px, 5.5vw, 80px)', 
                    lineHeight: 1,
                    background: gradientStyles[accentColor].background,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  <AnimatedCounter from={0} to={number} />
                </span>
                {unit && (
                  <span
                    className="font-heading font-bold"
                    style={{ 
                      fontSize: 'clamp(28px, 3.5vw, 56px)', 
                      lineHeight: 1,
                      background: gradientStyles[accentColor].background,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      opacity: 0.85,
                    }}
                  >
                    {unit}
                  </span>
                )}
              </>
            ) : (
              <>
                <span
                  className="font-heading font-black"
                  style={{ 
                    fontSize: 'clamp(42px, 5.5vw, 80px)', 
                    lineHeight: 1,
                    background: gradientStyles[accentColor].background,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {number}
                </span>
                {unit && (
                  <span
                    className="font-heading font-bold"
                    style={{ 
                      fontSize: 'clamp(28px, 3.5vw, 56px)', 
                      lineHeight: 1,
                      background: gradientStyles[accentColor].background,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      opacity: 0.85,
                    }}
                  >
                    {unit}
                  </span>
                )}
              </>
            )}
          </motion.div>
          <motion.div 
            className="font-medium text-text leading-snug" 
            style={{ fontSize: 'clamp(14px, 1.2vw, 16px)', lineHeight: 1.4 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: delay + 0.2 }}
          >
            {label}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  )
}

