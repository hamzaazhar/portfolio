'use client'

import { motion } from 'framer-motion'
import { Card } from './Card'
import { useState, useEffect } from 'react'
import { getMotionProps } from '@/lib/motion'

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

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={getMotionProps(prefersReducedMotion, delay)}
    >
      <Card accentColor={accentColor} className="text-center hover:scale-105">
        <div className="font-heading font-black text-text mb-3 bg-gradient-to-br from-text to-text/70 bg-clip-text" 
             style={{ fontSize: 'clamp(36px, 4vw, 64px)' }}>
          {value}
        </div>
        <div className="font-semibold text-text" style={{ fontSize: 'clamp(14px, 1.2vw, 16px)' }}>{label}</div>
      </Card>
    </motion.div>
  )
}

