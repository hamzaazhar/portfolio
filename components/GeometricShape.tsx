'use client'

interface GeometricShapeProps {
  color?: 'yellow' | 'purple' | 'red'
  size?: number
}

export function GeometricShape({ color = 'yellow', size = 40 }: GeometricShapeProps) {
  const colors = {
    yellow: 'bg-accent-yellow',
    purple: 'bg-accent-purple',
    red: 'bg-accent-red',
  }
  return (
    <div
      className={`${colors[color]} rounded-full`}
      style={{ width: size, height: size }}
    />
  )
}

