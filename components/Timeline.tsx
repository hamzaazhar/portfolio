'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TimelineItem {
  title: string
  subtitle?: string
  issuer?: string
  start: string
  end?: string
  location?: string
  description?: string
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const [year, month] = dateStr.split('-')
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${monthNames[parseInt(month, 10) - 1]} ${year}`
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {items.map((item, index) => (
        <motion.div
          key={`${item.title}-${index}`}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="relative pl-8 pb-8 last:pb-0"
        >
          <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-accent" />
          {index < items.length - 1 && (
            <div className="absolute left-[3px] top-4 bottom-0 w-px bg-fg-muted/20" />
          )}
          <div>
            <h3 className="text-lg font-heading font-semibold text-fg">{item.title}</h3>
            {(item.subtitle || item.issuer) && (
              <p className="text-sm text-fg-muted mt-1">{item.subtitle || item.issuer}</p>
            )}
            <div className="flex items-center gap-2 mt-2 text-xs text-fg-muted">
              <span>
                {formatDate(item.start)} {item.end && `- ${item.end === 'present' ? 'Present' : formatDate(item.end)}`}
              </span>
              {item.location && (
                <>
                  <span>•</span>
                  <span>{item.location}</span>
                </>
              )}
            </div>
            {item.description && (
              <p className="text-sm text-fg-muted mt-2">{item.description}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

