'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MetricCard } from './MetricCardEnhanced'
import { cn } from '@/lib/utils'
import { getMotionProps, MOTION } from '@/lib/motion'

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

  const [isIOS, setIsIOS] = useState(false)
  
  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    setIsIOS(isIOSDevice)
  }, [])

  // Faster animations for iOS
  const gridDuration = prefersReducedMotion ? MOTION.duration.reduced : (isIOS ? 0.15 : 0.22)
  const h1Delay = prefersReducedMotion ? 0 : (isIOS ? 0.05 : 0.1)
  const subheadDelay = prefersReducedMotion ? 0 : (isIOS ? 0.1 : 0.2)
  const metricsDelay = prefersReducedMotion ? 0 : (isIOS ? 0.15 : 0.3)
  const ctaDelay = prefersReducedMotion ? 0 : (isIOS ? 0.2 : 0.4)
  const staggerDelay = prefersReducedMotion ? 0 : (isIOS ? MOTION.stagger.ios : MOTION.stagger.default)

  return (
    <div className="relative min-h-screen flex items-start justify-center overflow-hidden">
      {/* Grid Background Pattern with reduced opacity */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: prefersReducedMotion ? 0.15 : 0.15 }}
        transition={{ duration: gridDuration }}
        style={{
          backgroundImage: `
            linear-gradient(to right, #E7E2D9 1px, transparent 1px),
            linear-gradient(to bottom, #E7E2D9 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          opacity: 0.15,
        }}
      />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-accent/25 to-transparent blur-3xl pointer-events-none"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-[700px] h-[700px] rounded-full bg-gradient-to-l from-accent-2/25 to-transparent blur-3xl pointer-events-none"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10 text-center space-y-4 sm:space-y-5 md:space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 md:pt-40 pb-6 sm:pb-8 md:pb-12">
        {/* H1 Headline - Word by word stagger animation */}
        <motion.h1
          className="font-heading font-bold text-text px-2"
          style={{ 
            fontSize: 'clamp(32px, 4.5vw, 72px)',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            wordBreak: 'break-word',
            hyphens: 'auto'
          }}
          initial="hidden"
          animate="visible"
          variants={{ 
            visible: { 
              transition: { 
                staggerChildren: prefersReducedMotion ? 0 : (isIOS ? 0.05 : 0.08) 
              } 
            } 
          }}
        >
          {headline.split(' ').map((word, index) => (
            <motion.span
              key={index}
              variants={{
                hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: prefersReducedMotion ? 0.01 : (isIOS ? 0.2 : 0.5),
                    ease: isIOS ? [0.25, 0.46, 0.45, 0.94] : [0.2, 0.7, 0.2, 1]
                  }
                }
              }}
              className="inline-block mr-1.5 sm:mr-2 md:mr-3"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: prefersReducedMotion ? 0.06 : (isIOS ? 0.15 : 0.3), 
            delay: subheadDelay,
            ease: isIOS ? [0.25, 0.46, 0.45, 0.94] : [0.2, 0.7, 0.2, 1]
          }}
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-text leading-relaxed mx-auto px-2"
          style={{ 
            fontSize: 'clamp(16px, 1.8vw, 28px)', 
            lineHeight: 1.6,
            maxWidth: '68ch',
            wordBreak: 'break-word'
          }}
        >
          {subhead.startsWith('I ') ? (
            <>
              I{' '}
              <span className="inline-block relative" style={{ letterSpacing: '-0.02em' }}>
                {name.split('').map((char, charIdx) => {
                  if (char === ' ') {
                    return <span key={charIdx} className="inline-block" style={{ width: '0.3em' }} />
                  }
                  
                  // Each letter starts 5 steps ahead of previous
                  const stepOffset = charIdx * 5
                  const totalSteps = 100
                  
                  // Generate smooth color wave for each step
                  const getColorForStep = (step: number) => {
                    // Normalize to 0-1, create smooth sine wave
                    const normalized = (step % totalSteps) / totalSteps
                    // Sine wave: 0 → 1 → 0 (smooth cycle)
                    const wave = Math.sin(normalized * Math.PI * 2) * 0.5 + 0.5
                    
                    // Interpolate between light yellow and dark yellow (middle ground)
                    // Light: rgb(255, 212, 109), Dark: rgb(250, 138, 0)
                    const r = Math.round(255 - wave * 5) // 255 → 250
                    const g = Math.round(212 - wave * 74) // 212 → 138
                    const b = Math.round(109 - wave * 109)  // 109 → 0
                    
                    return `rgb(${r}, ${g}, ${b})`
                  }
                  
                  // Generate all color steps for smooth animation
                  const colorSteps = Array.from({ length: totalSteps }, (_, i) => {
                    const step = (i + stepOffset) % totalSteps
                    return getColorForStep(step)
                  })
                  
                  return (
                    <motion.span
                      key={charIdx}
                      className="font-heading font-bold inline-block"
                      style={{
                        fontWeight: 800,
                        lineHeight: 1.2,
                        willChange: 'color',
                      }}
                      animate={{
                        color: colorSteps,
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                        times: Array.from({ length: totalSteps }, (_, i) => i / (totalSteps - 1)),
                      }}
                    >
                      {char}
                    </motion.span>
                  )
                })}
              </span>
              {' '}
              {subhead.substring(2).replace('manufacturing teams', 'business teams').replace('operations teams', 'business teams')}
            </>
          ) : (
            subhead.replace('manufacturing teams', 'business teams').replace('operations teams', 'business teams')
          )}
        </motion.p>

        {/* Micro Proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: prefersReducedMotion ? 0.06 : (isIOS ? 0.15 : 0.25), 
            delay: subheadDelay + (prefersReducedMotion ? 0 : (isIOS ? 0.05 : 0.1)),
            ease: isIOS ? [0.25, 0.46, 0.45, 0.94] : [0.2, 0.7, 0.2, 1]
          }}
          className="text-base md:text-lg text-muted max-w-3xl mx-auto"
          style={{ fontSize: 'clamp(16px, 1.4vw, 18px)', lineHeight: 1.6 }}
        >
          {microProof}
        </motion.p>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: prefersReducedMotion ? 0.06 : (isIOS ? 0.15 : 0.3), 
            delay: metricsDelay,
            ease: isIOS ? [0.25, 0.46, 0.45, 0.94] : [0.2, 0.7, 0.2, 1]
          }}
          className="grid md:grid-cols-3 gap-3 md:gap-4 pt-5 md:pt-6 pb-2 max-w-6xl mx-auto w-full"
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
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: prefersReducedMotion ? 0.06 : (isIOS ? 0.15 : 0.3), 
            delay: ctaDelay,
            ease: isIOS ? [0.25, 0.46, 0.45, 0.94] : [0.2, 0.7, 0.2, 1]
          }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-5 md:pt-6"
        >
          <a
            href={ctas.primary.href}
            onClick={(e) => {
              if (ctas.primary.href.startsWith('#')) {
                e.preventDefault()
                const sectionId = ctas.primary.href.substring(1)
                const element = document.getElementById(sectionId)
                if (element) {
                  // Special handling for hero section
                  if (sectionId === 'hero') {
                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    })
                  } else {
                    const headerHeight = 64
                    const rect = element.getBoundingClientRect()
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
                    const elementTop = rect.top + scrollTop
                    const offsetPosition = Math.max(0, elementTop - headerHeight)
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    })
                  }
                  window.history.pushState(null, '', ctas.primary.href)
                }
              }
            }}
            className={cn(
              'inline-flex items-center justify-center rounded-xl',
              'bg-accent text-text font-bold',
              'hover:bg-accent/90 transition-colors shadow-md hover:shadow-lg',
              'px-6 py-3 text-base sm:px-8 sm:py-3.5 sm:text-lg md:px-10 md:py-4',
              'min-h-[44px] w-full sm:w-auto sm:min-w-[200px] md:min-w-[220px]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'
            )}
            aria-label={ctas.primary.text}
          >
            {ctas.primary.text}
          </a>
          <a
            href={ctas.secondary.href}
            onClick={(e) => {
              if (ctas.secondary.href.startsWith('#')) {
                e.preventDefault()
                const sectionId = ctas.secondary.href.substring(1)
                const element = document.getElementById(sectionId)
                if (element) {
                  // Special handling for hero section
                  if (sectionId === 'hero') {
                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    })
                  } else {
                    const headerHeight = 64
                    const rect = element.getBoundingClientRect()
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
                    const elementTop = rect.top + scrollTop
                    const offsetPosition = Math.max(0, elementTop - headerHeight)
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    })
                  }
                  window.history.pushState(null, '', ctas.secondary.href)
                }
              }
            }}
            className={cn(
              'inline-flex items-center justify-center rounded-xl',
              'border border-text/80 text-text font-bold',
              'hover:border-accent hover:text-accent transition-colors',
              'px-6 py-3 text-base sm:px-8 sm:py-3.5 sm:text-lg md:px-10 md:py-4',
              'min-h-[44px] w-full sm:w-auto sm:min-w-[200px] md:min-w-[220px]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'
            )}
            aria-label={ctas.secondary.text}
          >
            {ctas.secondary.text}
          </a>
        </motion.div>
      </div>
    </div>
  )
}

