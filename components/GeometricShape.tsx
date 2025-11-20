'use client'

import { useState, useEffect } from 'react'

interface GeometricShapeProps {
  color?: 'yellow' | 'purple' | 'red'
  size?: number
}

export function GeometricShape({ color = 'yellow', size = 40 }: GeometricShapeProps) {
  const [windowWidth, setWindowWidth] = useState(0)
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth)
      window.addEventListener('resize', handleResize)
    }
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Responsive sizing for mobile
  const responsiveSize = windowWidth > 0 && windowWidth < 768 
    ? Math.max(size * 0.75, size * 0.6) 
    : size

  const colors = {
    yellow: 'bg-accent-yellow',
    purple: 'bg-accent-purple',
    red: 'bg-accent-red',
  }
  return (
    <div
      className={`${colors[color]} rounded-full`}
      style={{ width: responsiveSize, height: responsiveSize }}
    />
  )
}

