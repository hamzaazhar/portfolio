'use client'

import { motion } from 'framer-motion'
import { Card } from './Card'
import { cn } from '@/lib/utils'

interface CaseStoryProps {
  title: string
  context: string
  built: string
  outcome: string
  stack: string[]
  accentColor?: 'yellow' | 'purple' | 'red'
  delay?: number
}

export function CaseStory({
  title,
  context,
  built,
  outcome,
  stack,
  accentColor = 'yellow',
  delay = 0,
}: CaseStoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card accentColor={accentColor} className="h-full">
        <h3 className="text-xl md:text-2xl font-heading font-bold text-fg mb-6">{title}</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-fg-muted uppercase tracking-wider mb-2">
              Context
            </h4>
            <p className="text-fg leading-relaxed text-sm md:text-base">{context}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-fg-muted uppercase tracking-wider mb-2">
              What I Built
            </h4>
            <p className="text-fg leading-relaxed text-sm md:text-base">{built}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-fg-muted uppercase tracking-wider mb-2">
              Outcome
            </h4>
            <p className="text-fg font-bold text-base md:text-lg leading-relaxed">{outcome}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-fg-muted uppercase tracking-wider mb-2">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {stack.map((tech) => (
                <span
                  key={tech}
                  className={cn(
                    'px-3 py-1 text-xs rounded border font-medium',
                    accentColor === 'yellow' &&
                      'bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20',
                    accentColor === 'purple' &&
                      'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
                    accentColor === 'red' &&
                      'bg-accent-red/10 text-accent-red border-accent-red/20'
                  )}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

