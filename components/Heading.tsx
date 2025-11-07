'use client'

import { cn } from '@/lib/utils'

interface HeadingProps {
  variant?: 'hero' | 'h2' | 'h3'
  children: React.ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
}

const variantStyles = {
  hero: 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold leading-[1.1]',
  h2: 'text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight',
  h3: 'text-2xl md:text-3xl font-heading font-bold tracking-tight',
}

// Clamp font sizes for fluid typography
const clampStyles = {
  hero: { fontSize: 'clamp(36px, 4vw, 64px)' },
  h2: { fontSize: 'clamp(28px, 3vw, 40px)' },
  h3: { fontSize: 'clamp(24px, 2.5vw, 32px)' },
}

const defaultTags = {
  hero: 'h1',
  h2: 'h2',
  h3: 'h3',
} as const

export function Heading({ variant = 'h2', children, className, as }: HeadingProps) {
  const Tag = as || defaultTags[variant]
  return (
    <Tag 
      className={cn(variantStyles[variant], 'text-balance', className)}
      style={clampStyles[variant]}
    >
      {children}
    </Tag>
  )
}

