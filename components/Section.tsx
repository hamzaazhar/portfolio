'use client'

import { motion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  id: string
  children: React.ReactNode
  className?: string
  eyebrow?: string
  as?: 'section' | 'div' | 'article' | 'main' | 'header' | 'footer'
  variant?: 'light' | 'dark'
  spacing?: { top?: number; bottom?: number }
  accent?: 'yellow' | 'purple' | 'red'
}

export function Section({
  id,
  children,
  className,
  eyebrow,
  as: Component = 'section',
  variant = 'light',
  spacing = { top: 80, bottom: 64 },
  accent = 'yellow',
}: SectionProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // For non-section components, create a wrapper ref for IntersectionObserver
  const wrapperRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const targetRef = Component === 'section' ? ref.current : wrapperRef.current
    if (!targetRef) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(targetRef)
    return () => observer.disconnect()
  }, [Component, hasAnimated])

  const accentColorMap = {
    yellow: 'var(--color-accent-yellow)',
    purple: 'var(--color-accent-purple)',
    red: 'var(--color-accent-red)',
  }

  const baseProps = {
    id,
    'data-accent': accent,
    className: cn(
      'snap-start flex flex-col items-center justify-center min-h-[60vh]',
      variant === 'dark' ? 'bg-bg-dark text-white' : 'bg-bg-light text-fg',
      className
    ),
    style: {
      paddingTop: spacing.top === 0 ? '0' : `clamp(${(spacing.top || 112) * 0.75}px, 8vw, ${spacing.top || 112}px)`,
      paddingBottom: `clamp(${(spacing.bottom || 84) * 0.75}px, 6vw, ${spacing.bottom || 84}px)`,
      ['--section-accent' as string]: accentColorMap[accent],
    } as React.CSSProperties,
  }

  if (Component === 'section') {
    return (
      <section {...baseProps} ref={ref as React.RefObject<HTMLElement>}>
        {renderContent()}
      </section>
    )
  }

  return (
    <Component {...baseProps}>
      <div ref={wrapperRef}>
        {renderContent()}
      </div>
    </Component>
  )

  function renderContent() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    const revealDuration = prefersReducedMotion ? 0.06 : (isIOS ? 0.15 : 0.2)
    const revealEase = prefersReducedMotion ? [0, 0, 1, 1] : (isIOS ? [0.25, 0.46, 0.45, 0.94] : [0.2, 0.7, 0.2, 1])
    const staggerDelay = prefersReducedMotion ? 0 : (isIOS ? 0.01 : 0.02)

    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-reveal={hasAnimated}>
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
            animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
            transition={{ 
              duration: revealDuration, 
              ease: revealEase as [number, number, number, number]
            }}
            className={cn(
              'text-sm font-medium uppercase tracking-wider mb-4',
              variant === 'dark' ? 'text-white/70' : 'text-muted'
            )}
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
          animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
          transition={{ 
            duration: revealDuration, 
            delay: eyebrow ? staggerDelay : 0, 
            ease: revealEase as [number, number, number, number]
          }}
        >
          {children}
        </motion.div>
      </div>
    )
  }
}

