'use client'

import { useState } from 'react'

export function SkipLink() {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <a
      href="#main-content"
      className="skip-link"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        position: 'absolute',
        top: isFocused ? '0' : '-40px',
        left: 0,
        background: 'var(--accent2)',
        color: 'var(--surface)',
        padding: '8px 16px',
        textDecoration: 'none',
        zIndex: 'calc(var(--z-modal) + 1)',
        borderRadius: 'var(--radius-sm)',
        transition: 'top 0.2s ease',
      }}
    >
      Skip to content
    </a>
  )
}

