'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  accentColor?: 'yellow' | 'purple' | 'red'
  illustration?: ReactNode
}

export function Card({ children, className, hover = true, accentColor = 'yellow', illustration }: CardProps) {
  const accentColors = {
    yellow: 'bg-accent-yellow',
    purple: 'bg-accent-purple',
    red: 'bg-accent-red',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -6, scale: 1.02 } : undefined}
      className={cn(
        'relative',
        'bg-surface border border-border rounded-xl',
        'p-6 md:p-8',
        'transition-all duration-200',
        hover && 'hover:shadow-lg hover:border-accent/30',
        className
      )}
    >
      {illustration && (
        <div className="mb-4 flex items-center justify-center">
          {illustration}
        </div>
      )}
      {children}
      {hover && (
        <motion.div
          className={cn('absolute bottom-0 left-0 right-0 h-1 rounded-b-xl', accentColors[accentColor])}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  )
}

