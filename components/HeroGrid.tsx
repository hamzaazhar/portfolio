'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MetricCard } from './MetricCard'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface HeroGridProps {
  name: string
  headline: string
  subhead: string
  microProof: string
  metrics: Array<{ label: string; value: string }>
  ctas: {
    primary: { text: string; href: string }
    secondary: { text: string; href: string }
  }
}

export function HeroGrid({ name, headline, subhead, microProof, metrics, ctas }: HeroGridProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
  }, [])

  const gridDuration = prefersReducedMotion ? 0.06 : 0.22
  const h1Delay = prefersReducedMotion ? 0 : 0.04
  const subheadDelay = prefersReducedMotion ? 0 : 0.08
  const metricsDelay = prefersReducedMotion ? 0 : 0.12
  const ctaDelay = prefersReducedMotion ? 0 : 0.24
  const staggerDelay = prefersReducedMotion ? 0 : 0.04

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Grid Background Pattern - more subtle */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: prefersReducedMotion ? 0.25 : 0.25 }}
        transition={{ duration: gridDuration }}
        style={{
          backgroundImage: `
            linear-gradient(to right, #E7E2D9 1px, transparent 1px),
            linear-gradient(to bottom, #E7E2D9 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          opacity: 0.25,
        }}
      />

      <div className="relative z-10 text-center space-y-12 md:space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        {/* H1 Headline */}
        <motion.h1
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: prefersReducedMotion ? 0.06 : 0.28, 
            delay: h1Delay,
            ease: prefersReducedMotion ? [0, 0, 1, 1] : [0.2, 0.7, 0.2, 1] as [number, number, number, number]
          }}
          className="font-heading font-bold text-text"
          style={{ 
            fontSize: 'clamp(44px, 5vw, 72px)',
            lineHeight: 1.08,
            letterSpacing: '-0.01em'
          }}
        >
          {headline}
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: prefersReducedMotion ? 0.06 : 0.28, 
            delay: subheadDelay,
            ease: prefersReducedMotion ? [0, 0, 1, 1] : [0.2, 0.7, 0.2, 1] as [number, number, number, number]
          }}
          className="text-xl md:text-2xl lg:text-3xl font-medium text-text leading-relaxed mx-auto"
          style={{ 
            fontSize: 'clamp(18px, 1.8vw, 28px)', 
            lineHeight: 1.6,
            maxWidth: '68ch'
          }}
        >
          {subhead}
        </motion.p>

        {/* Micro Proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: prefersReducedMotion ? 0.06 : 0.28, 
            delay: subheadDelay + (prefersReducedMotion ? 0 : 0.04),
            ease: prefersReducedMotion ? [0, 0, 1, 1] : [0.2, 0.7, 0.2, 1] as [number, number, number, number]
          }}
          className="text-base md:text-lg text-muted max-w-3xl mx-auto"
          style={{ fontSize: 'clamp(16px, 1.4vw, 18px)', lineHeight: 1.6 }}
        >
          {microProof}
        </motion.p>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: prefersReducedMotion ? 0.06 : 0.28, 
            delay: metricsDelay,
            ease: prefersReducedMotion ? [0, 0, 1, 1] : [0.2, 0.7, 0.2, 1] as [number, number, number, number]
          }}
          className="grid md:grid-cols-3 gap-6 pt-8"
        >
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              value={metric.value}
              label={metric.label}
              accentColor={index % 3 === 0 ? 'yellow' : index % 3 === 1 ? 'purple' : 'red'}
              delay={metricsDelay + (index * staggerDelay)}
            />
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: prefersReducedMotion ? 0.06 : 0.28, 
            delay: ctaDelay,
            ease: prefersReducedMotion ? [0, 0, 1, 1] : [0.2, 0.7, 0.2, 1] as [number, number, number, number]
          }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
        >
          <Link
            href={ctas.primary.href}
            className={cn(
              'inline-flex items-center justify-center px-8 py-4 rounded-lg',
              'bg-accent text-text font-bold text-lg',
              'hover:bg-accent/90 transition-colors shadow-md',
              'min-h-[44px] min-w-[200px]'
            )}
          >
            {ctas.primary.text}
          </Link>
          <Link
            href={ctas.secondary.href}
            className={cn(
              'inline-flex items-center justify-center px-8 py-4 rounded-lg',
              'border-2 border-text text-text font-bold text-lg',
              'hover:bg-text hover:text-surface transition-colors',
              'min-h-[44px] min-w-[200px]'
            )}
          >
            {ctas.secondary.text}
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

