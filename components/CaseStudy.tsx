'use client'

import { motion } from 'framer-motion'
import { Card } from './Card'

interface CaseStudyProps {
  problem: string
  solution: string
  outcome: string
  techStack: string[]
  accentColor?: 'yellow' | 'purple' | 'red'
  delay?: number
}

export function CaseStudy({
  problem,
  solution,
  outcome,
  techStack,
  accentColor = 'yellow',
  delay = 0,
}: CaseStudyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      <Card accentColor={accentColor} className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-fg-muted uppercase tracking-wider mb-2">Problem</h4>
          <p className="text-fg leading-relaxed">{problem}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-fg-muted uppercase tracking-wider mb-2">Solution</h4>
          <p className="text-fg leading-relaxed">{solution}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-fg-muted uppercase tracking-wider mb-2">Outcome</h4>
          <p className="text-fg font-semibold leading-relaxed">{outcome}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-fg-muted uppercase tracking-wider mb-2">Tech Stack</h4>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className={`px-3 py-1 text-xs rounded border font-medium ${
                  accentColor === 'yellow'
                    ? 'bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20'
                    : accentColor === 'purple'
                      ? 'bg-accent-purple/10 text-accent-purple border-accent-purple/20'
                      : 'bg-accent-red/10 text-accent-red border-accent-red/20'
                }`}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

