'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MetricPillProps {
  value: string
  label?: string
  animate?: boolean
  className?: string
}

export function MetricPill({ value, label, animate = false, className }: MetricPillProps) {
  const [displayValue, setDisplayValue] = useState(animate ? '0' : value)

  useEffect(() => {
    if (!animate) return

    const numMatch = value.match(/(\d+)/)
    if (!numMatch) {
      setDisplayValue(value)
      return
    }

    const targetNum = parseInt(numMatch[1], 10)
    const prefix = value.substring(0, numMatch.index)
    const suffix = value.substring((numMatch.index || 0) + numMatch[0].length)

    let current = 0
    const increment = targetNum / 30
    const timer = setInterval(() => {
      current += increment
      if (current >= targetNum) {
        current = targetNum
        clearInterval(timer)
      }
      setDisplayValue(`${prefix}${Math.floor(current)}${suffix}`)
    }, 16)

    return () => clearInterval(timer)
  }, [value, animate])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'inline-flex flex-col items-center justify-center',
        'px-6 py-4 rounded-lg',
        'bg-card border border-card-border',
        'text-accent-yellow font-heading font-bold',
        'shadow-sm hover:shadow-md transition-shadow',
        className
      )}
    >
      <span className="text-2xl md:text-3xl">{displayValue}</span>
      {label && <span className="text-xs text-fg-muted mt-1">{label}</span>}
    </motion.div>
  )
}

