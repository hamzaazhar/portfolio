'use client'

import { ExternalLink } from 'lucide-react'
import { Card } from './Card'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  title: string
  description: string
  tags?: string[]
  url?: string
  start?: string
  end?: string
  institution?: string
  className?: string
  accentColor?: 'yellow' | 'purple' | 'red'
}

export function ProjectCard({
  title,
  description,
  tags,
  url,
  start,
  end,
  institution,
  className,
  accentColor = 'yellow',
}: ProjectCardProps) {
  return (
    <Card accentColor={accentColor} className={className}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-xl font-heading font-bold text-fg">{title}</h3>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent/80 transition-colors"
            aria-label={`Open ${title} in new tab`}
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        )}
      </div>
      {institution && (
        <p className="text-sm text-fg-muted mb-2">{institution}</p>
      )}
      {(start || end) && (
        <p className="text-xs text-fg-muted mb-3">
          {start && new Date(start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          {start && end && ' - '}
          {end && new Date(end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </p>
      )}
      <p className="text-sm text-fg-muted mb-4 leading-relaxed">{description}</p>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                'px-2 py-1 text-xs rounded border',
                accentColor === 'yellow' && 'bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20',
                accentColor === 'purple' && 'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
                accentColor === 'red' && 'bg-accent-red/10 text-accent-red border-accent-red/20'
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Card>
  )
}

