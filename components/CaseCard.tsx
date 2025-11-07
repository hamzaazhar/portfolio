'use client'

import { motion } from 'framer-motion'
import { Card } from './Card'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface CaseCardProps {
  title: string
  context: string
  built: string
  outcome: string
  stack: string[]
  accentColor?: 'yellow' | 'purple' | 'red'
  delay?: number
  thumbnail?: string
}

export function CaseCard({
  title,
  context,
  built,
  outcome,
  stack,
  accentColor = 'yellow',
  delay = 0,
  thumbnail,
}: CaseCardProps) {
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
      transition={{ 
        duration: prefersReducedMotion ? 0.06 : 0.28, 
        delay: prefersReducedMotion ? 0 : delay,
        ease: prefersReducedMotion ? [0, 0, 1, 1] : [0.2, 0.7, 0.2, 1] as [number, number, number, number]
      }}
      whileHover={prefersReducedMotion ? undefined : { 
        scale: 1.02, 
        y: -6,
        transition: { duration: 0.16 }
      }}
      className="h-full"
    >
      <Card accentColor={accentColor} className="h-full flex flex-col overflow-hidden">
        {/* Thumbnail */}
        <div className="relative w-full h-48 mb-6 overflow-hidden bg-surface rounded-t-lg">
          {/* Placeholder - always shown, image will overlay if it loads */}
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 via-accent-2/10 to-accent-red/10">
            <div className="text-5xl opacity-30" aria-hidden="true">📊</div>
          </div>
          {/* Try to load image, but don't fail if it doesn't exist */}
          {thumbnail && (
            <div className="absolute inset-0">
              <Image
                src={thumbnail}
                alt={`Architecture diagram for ${title} highlighting system components`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                onError={(e) => {
                  // Hide image on error - placeholder is already visible
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
                onLoad={(e) => {
                  // Show image when it loads successfully
                  const target = e.target as HTMLImageElement
                  target.style.opacity = '1'
                }}
                style={{ opacity: 0, transition: 'opacity 0.3s' }}
                unoptimized={thumbnail.startsWith('/images/cases/')} // Skip optimization for placeholder paths
              />
            </div>
          )}
          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, #1a1a1a 1px, transparent 1px),
                linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />
        </div>
        
        <div className="flex-grow flex flex-col">
          <h3 className="text-xl md:text-2xl font-heading font-bold text-text mb-4">{title}</h3>
          
          <div className="space-y-4 flex-grow">
            <div>
              <h4 className="text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                Context
              </h4>
              <p className="text-text text-sm leading-relaxed">{context}</p>
            </div>

            <div>
              <h4 className="text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                What I Built
              </h4>
              <p className="text-text text-sm leading-relaxed">{built}</p>
            </div>

            <div>
              <h4 className="text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                Outcome
              </h4>
              <p className="text-text font-bold text-base leading-relaxed">{outcome}</p>
            </div>
          </div>

          {stack && stack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border">
              {stack.map((tech) => (
                <span
                  key={tech}
                  className={cn(
                    'px-2.5 py-1 text-xs rounded-full border font-medium',
                    accentColor === 'yellow' &&
                      'bg-accent/10 text-accent border-accent/20',
                    accentColor === 'purple' &&
                      'bg-accent-2/10 text-accent-2 border-accent-2/20',
                    accentColor === 'red' &&
                      'bg-accent-red/10 text-accent-red border-accent-red/20'
                  )}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

