'use client'

import { motion } from 'framer-motion'
import { Card } from './Card'

interface ValuePillar {
  title: string
  statement: string
  accentColor: 'yellow' | 'purple' | 'red'
}

interface ValuePropositionProps {
  pillars: ValuePillar[]
}

export function ValueProposition({ pillars }: ValuePropositionProps) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {pillars.map((pillar, index) => (
        <motion.div
          key={pillar.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card accentColor={pillar.accentColor}>
            <h3 className="text-2xl font-heading font-bold text-fg mb-4">{pillar.title}</h3>
            <p className="text-fg-muted leading-relaxed">{pillar.statement}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

