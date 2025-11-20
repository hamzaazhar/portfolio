'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { getMotionProps, MOTION } from '@/lib/motion'
import { Database, GitBranch, BarChart3, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExpertiseCluster {
  title: string
  items: string[]
}

interface ExpertiseClustersProps {
  clusters: ExpertiseCluster[]
}

const clusterIcons = [
  { Icon: BarChart3, gradient: 'from-accent to-accent/50', bg: 'bg-accent/5' },
  { Icon: Database, gradient: 'from-accent-purple to-accent-purple/50', bg: 'bg-accent-purple/5' },
  { Icon: GitBranch, gradient: 'from-accent-red to-accent-red/50', bg: 'bg-accent-red/5' },
]

export function ExpertiseClusters({ clusters }: ExpertiseClustersProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
      {clusters.map((cluster, index) => {
        const { Icon, gradient, bg } = clusterIcons[index % 3]
        const accentColor = index % 3 === 0 ? 'accent' : index % 3 === 1 ? 'accent-purple' : 'accent-red'
        
        return (
          <motion.div
            key={cluster.title}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={MOTION.viewport}
            transition={getMotionProps(prefersReducedMotion, index * MOTION.stagger.default)}
            className="h-full"
          >
            <div className={cn(
              'relative h-full rounded-xl bg-surface border border-border',
              'hover:shadow-lg transition-all duration-300',
              'p-4 sm:p-5 md:p-6',
              bg
            )}>
              {/* Header with icon */}
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
                <div className={cn(
                  'rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0',
                  'w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12',
                  gradient
                )}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
                </div>
                <h3 className="font-heading font-bold text-text" style={{ 
                  fontSize: 'clamp(16px, 1.8vw, 18px)'
                }}>
                  {cluster.title}
                </h3>
              </div>

              {/* Skills list */}
              <ul className="space-y-2 sm:space-y-2.5 md:space-y-3">
                {cluster.items.map((item) => (
                  <motion.li
                    key={item}
                    className="flex items-start gap-2 sm:gap-2.5 md:gap-3 group"
                    whileHover={prefersReducedMotion ? undefined : { x: 4, transition: { duration: 0.15 } }}
                  >
                    <CheckCircle2 
                      className={cn(
                        'flex-shrink-0 mt-0.5 transition-colors',
                        'w-4 h-4 sm:w-5 sm:h-5',
                        `text-${accentColor}`,
                        'group-hover:scale-110 transition-transform'
                      )}
                      strokeWidth={2}
                    />
                    <span className="text-text font-medium" style={{ 
                      fontSize: 'clamp(13px, 1.1vw, 14px)'
                    }}>
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* Bottom gradient accent */}
              <div className={cn(
                'absolute bottom-0 left-0 right-0 rounded-b-xl bg-gradient-to-r',
                'h-0.5 sm:h-0.75 md:h-1',
                gradient
              )} />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

