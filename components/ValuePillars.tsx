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
    <div className="grid md:grid-cols-3 gap-8">
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
              'relative h-full p-8 rounded-xl bg-surface border-2 transition-all duration-300',
              'hover:shadow-xl',
              borderColor
            )}>
              {/* Icon with gradient background */}
              <div className={cn(
                'w-16 h-16 rounded-xl bg-gradient-to-br mb-6 flex items-center justify-center',
                'border-2',
                color,
                borderColor
              )}>
                <Icon className={cn('w-8 h-8', iconColor)} strokeWidth={2.5} />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-heading font-bold text-text leading-tight">
                  {pillar.title}
                </h3>
                <p className="text-muted leading-relaxed" style={{ fontSize: 'clamp(14px, 1.2vw, 16px)', lineHeight: 1.7 }}>
                  {pillar.statement}
                </p>
              </div>

              {/* Decorative corner accent */}
              <div className={cn(
                'absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-10',
                'bg-gradient-to-br',
                color
              )} />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

