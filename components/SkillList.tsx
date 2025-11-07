'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SkillListProps {
  skills: string[]
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function SkillList({ skills, columns = 3, className }: SkillListProps) {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-4', columnClasses[columns], className)}>
      {skills.map((skill, index) => (
        <motion.div
          key={skill}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={cn(
            'px-3 py-2 rounded-md text-sm',
            'bg-bg-muted/50 border border-card-border',
            'hover:border-accent-yellow/30 transition-colors',
            'text-fg-muted hover:text-fg font-medium'
          )}
        >
          {skill}
        </motion.div>
      ))}
    </div>
  )
}

