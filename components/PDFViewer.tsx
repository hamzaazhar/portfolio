'use client'

import { useEffect, useRef } from 'react'

export default function PDFViewer() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create iframe for PDF embedding
    const iframe = document.createElement('iframe')
    iframe.src = '/resume.pdf'
    iframe.width = '100%'
    iframe.height = '1000px'
    iframe.style.border = 'none'
    iframe.title = 'Resume PDF'
    iframe.setAttribute('aria-label', 'Resume PDF viewer')

    containerRef.current.appendChild(iframe)

    return () => {
      if (containerRef.current && iframe.parentNode) {
        containerRef.current.removeChild(iframe)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full min-h-[800px] flex items-center justify-center bg-bg-light"
    />
  )
}

