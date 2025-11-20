'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { getMotionProps, MOTION } from '@/lib/motion'
import { Zap, Target, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ValuePillar {
  title: string
  statement: string
}

interface ValuePillarsProps {
  pillars: ValuePillar[]
}

const pillarIcons = [
  { Icon: Zap, color: 'from-accent/20 to-accent/5', iconColor: 'text-accent', borderColor: 'border-accent/30' },
  { Icon: Target, color: 'from-accent-purple/20 to-accent-purple/5', iconColor: 'text-accent-purple', borderColor: 'border-accent-purple/30' },
  { Icon: Users, color: 'from-accent-red/20 to-accent-red/5', iconColor: 'text-accent-red', borderColor: 'border-accent-red/30' },
]

export function ValuePillars({ pillars }: ValuePillarsProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 items-start">
      {pillars.map((pillar, index) => {
        const { Icon, color, iconColor, borderColor } = pillarIcons[index % 3]
        return (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={MOTION.viewport}
            transition={getMotionProps(prefersReducedMotion, index * MOTION.stagger.default)}
            whileHover={prefersReducedMotion ? undefined : { y: -8, transition: { duration: 0.2 } }}
            className="h-full"
          >
            <div className={cn(
              'relative h-full rounded-xl bg-surface border-2 transition-all duration-300',
              'hover:shadow-xl flex flex-col',
              'p-4 sm:p-6 md:p-8',
              borderColor
            )}>
              {/* Icon with gradient background */}
              <div className={cn(
                'rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 border-2',
                'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16',
                'mb-4 sm:mb-5 md:mb-6',
                color,
                borderColor
              )}>
                <Icon className={cn('w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8', iconColor)} strokeWidth={2.5} />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1">
                <h3 className="font-heading font-bold text-text leading-tight mb-3 sm:mb-4" style={{ 
                  fontSize: 'clamp(18px, 2vw, 24px)',
                  minHeight: 'clamp(2.5rem, 4vw, 3.5rem)'
                }}>
                  {pillar.title}
                </h3>
                <p className="text-muted leading-relaxed" style={{ 
                  fontSize: 'clamp(14px, 1.2vw, 16px)', 
                  lineHeight: 1.7 
                }}>
                  {pillar.statement}
                </p>
              </div>

              {/* Decorative corner accent */}
              <div className={cn(
                'absolute top-0 right-0 rounded-bl-full opacity-10 bg-gradient-to-br',
                'w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20',
                color
              )} />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

