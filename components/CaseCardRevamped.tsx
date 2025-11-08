'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { ArrowUpRight, Zap, TrendingUp, CheckCircle } from 'lucide-react'

interface CaseCardRevampedProps {
  title: string
  context: string
  built: string
  outcome: string
  stack: string[]
  accentColor?: 'yellow' | 'purple' | 'red'
  delay?: number
}

const accentConfig = {
  yellow: {
    gradient: 'from-accent via-accent/80 to-accent/60',
    glow: 'shadow-accent/20',
    text: 'text-accent',
    bg: 'bg-accent/5',
    border: 'border-accent/30',
    hoverBorder: 'hover:border-accent/60',
  },
  purple: {
    gradient: 'from-accent-purple via-accent-purple/80 to-accent-purple/60',
    glow: 'shadow-accent-purple/20',
    text: 'text-accent-purple',
    bg: 'bg-accent-purple/5',
    border: 'border-accent-purple/30',
    hoverBorder: 'hover:border-accent-purple/60',
  },
  red: {
    gradient: 'from-accent-red via-accent-red/80 to-accent-red/60',
    glow: 'shadow-accent-red/20',
    text: 'text-accent-red',
    bg: 'bg-accent-red/5',
    border: 'border-accent-red/30',
    hoverBorder: 'hover:border-accent-red/60',
  },
}

export function CaseCardRevamped({
  title,
  context,
  built,
  outcome,
  stack,
  accentColor = 'yellow',
  delay = 0,
}: CaseCardRevampedProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const config = accentConfig[accentColor]

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    setIsIOS(isIOSDevice)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ 
        duration: prefersReducedMotion ? 0.06 : (isIOS ? 0.15 : 0.3), 
        delay: prefersReducedMotion ? 0 : (isIOS ? delay * 0.5 : delay),
        ease: isIOS ? [0.25, 0.46, 0.45, 0.94] : [0.2, 0.7, 0.2, 1]
      }}
      className="h-full group flex"
    >
      <div className={cn(
        'relative h-full w-full rounded-xl border-2 transition-all duration-300 overflow-hidden flex flex-col',
        'bg-gradient-to-br from-white/[0.05] to-white/[0.02]',
        'backdrop-blur-sm',
        config.border,
        config.hoverBorder,
        'hover:shadow-xl',
        config.glow
      )}>
        {/* Animated gradient border effect on hover - center focused */}
        <div 
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500',
            'blur-3xl -z-10'
          )}
          style={{
            background: accentColor === 'yellow' 
              ? 'radial-gradient(circle, rgba(255, 200, 87, 0.3) 0%, rgba(255, 200, 87, 0.1) 50%, transparent 100%)'
              : accentColor === 'purple'
              ? 'radial-gradient(circle, rgba(108, 99, 255, 0.3) 0%, rgba(108, 99, 255, 0.1) 50%, transparent 100%)'
              : 'radial-gradient(circle, rgba(248, 113, 113, 0.3) 0%, rgba(248, 113, 113, 0.1) 50%, transparent 100%)'
          }}
        />

        {/* Top accent line with animated width - properly aligned with border */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: delay + 0.2 }}
          className={cn(
            'absolute left-0 right-0 origin-left',
            'bg-gradient-to-r',
            config.gradient
          )}
          style={{ 
            top: '-2px',
            height: '2px',
            borderRadius: '16px 16px 0 0'
          }}
        />

        <div className="relative flex flex-col h-full p-4 md:p-5">
          {/* Compact Header - Fixed Height */}
          <div className="flex items-start justify-between gap-2 md:gap-3 mb-3 md:mb-4 flex-shrink-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2 h-4">
                <Zap className={cn('w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0', config.text)} strokeWidth={2.5} />
                <span className={cn('text-[9px] md:text-[10px] font-bold uppercase tracking-wider leading-none', config.text)}>
                  Impact
                </span>
              </div>
              <h3 className="text-lg md:text-xl lg:text-xl font-heading font-black text-white leading-tight min-h-[2.25rem] md:min-h-[2.5rem]">
                {title}
              </h3>
            </div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 45 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                'border-2',
                config.border,
                config.bg
              )}
            >
              <ArrowUpRight className={cn('w-3.5 h-3.5 md:w-4 md:h-4', config.text)} strokeWidth={2.5} />
            </motion.div>
          </div>

          {/* Compact Content - Vertical Stack for 3-column layout */}
          <div className="space-y-3 md:space-y-4 mb-3 md:mb-4 flex-1">
            {/* Challenge */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: delay + 0.1 }}
              className="space-y-1.5 flex flex-col"
            >
              <div className="flex items-center gap-1.5 h-3.5 flex-shrink-0">
                <div className={cn('w-1 h-1 rounded-full flex-shrink-0', config.gradient, 'bg-gradient-to-r')} />
                <h4 className="text-[9px] md:text-[10px] font-bold text-white/50 uppercase tracking-wider leading-none">
                  Challenge
                </h4>
              </div>
              <p className="text-xs md:text-sm text-white/75 leading-relaxed flex-1">
                {context}
              </p>
            </motion.div>

            {/* Solution */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: delay + 0.2 }}
              className="space-y-1.5 flex flex-col"
            >
              <div className="flex items-center gap-1.5 h-3.5 flex-shrink-0">
                <div className={cn('w-1 h-1 rounded-full flex-shrink-0', config.gradient, 'bg-gradient-to-r')} />
                <h4 className="text-[9px] md:text-[10px] font-bold text-white/50 uppercase tracking-wider leading-none">
                  Solution
                </h4>
              </div>
              <p className="text-xs md:text-sm text-white/75 leading-relaxed flex-1">
                {built}
              </p>
            </motion.div>
          </div>

          {/* Compact Outcome - Full Width - Fixed Height */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: delay + 0.3 }}
            className={cn(
              'relative p-2.5 md:p-3 rounded-lg border flex-shrink-0',
              config.border,
              config.bg,
              'group-hover:border-opacity-60 transition-all duration-300',
              'mb-3 md:mb-4',
              'min-h-[4rem] md:min-h-[4.5rem]'
            )}
          >
            <div className="flex items-center gap-2 md:gap-2.5 h-full">
              <div className={cn(
                'w-7 h-7 md:w-8 md:h-8 rounded-md flex items-center justify-center flex-shrink-0',
                'bg-gradient-to-br',
                config.gradient
              )}>
                <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0 flex items-center">
                <p className="text-white font-bold text-sm md:text-base leading-tight">
                  {outcome}
                </p>
              </div>
              <CheckCircle className={cn('w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0', config.text)} strokeWidth={2.5} />
            </div>
          </motion.div>

          {/* Compact Tech Stack - Fixed at Bottom */}
          <div className="flex-shrink-0">
            {stack && stack.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: delay + 0.4 }}
                className="pt-2.5 md:pt-3 border-t border-white/10"
              >
                <div className="flex flex-wrap gap-1 md:gap-1.5">
                  {stack.map((tech, index) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.15, delay: delay + 0.4 + (index * 0.03) }}
                      whileHover={{ scale: 1.05, y: -1 }}
                      className={cn(
                        'px-1.5 md:px-2 py-0.5 md:py-1 text-[9px] md:text-[10px] font-semibold rounded-md',
                        'bg-white/5 text-white/70',
                        'border border-white/10',
                        'hover:border-white/30 transition-all duration-200',
                        'backdrop-blur-sm'
                      )}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Corner decoration */}
        <div className={cn(
          'absolute bottom-0 right-0 w-32 h-32 rounded-tl-full opacity-5',
          'bg-gradient-to-tl',
          config.gradient,
          'pointer-events-none'
        )} />
      </div>
    </motion.div>
  )
}

