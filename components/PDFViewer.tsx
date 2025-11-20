'use client'

import { useEffect, useRef, useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function PDFViewer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    setIsIOS(isIOSDevice)

    if (!containerRef.current || isIOSDevice) return

    // Use iframe for non-iOS devices
    const container = containerRef.current
    const iframe = document.createElement('iframe')
    iframe.src = '/resume.pdf'
    iframe.width = '100%'
    iframe.style.border = 'none'
    iframe.title = 'Resume PDF'
    iframe.setAttribute('aria-label', 'Resume PDF viewer')

    // Function to calculate and set responsive height
    const updateHeight = () => {
      const viewportHeight = window.innerHeight
      const headerHeight = 64 // Navbar height
      const isMobile = viewportHeight < 768
      const isTablet = viewportHeight >= 768 && viewportHeight < 1024
      const padding = isMobile ? 150 : isTablet ? 180 : 200 // Responsive padding
      const maxHeight = Math.max(
        isMobile ? 500 : isTablet ? 700 : 800,
        viewportHeight - headerHeight - padding
      )
      iframe.style.height = `${maxHeight}px`
    }

    // Set initial height
    updateHeight()

    // Update height on resize
    window.addEventListener('resize', updateHeight)

    container.appendChild(iframe)

    return () => {
      window.removeEventListener('resize', updateHeight)
      if (container && iframe.parentNode) {
        container.removeChild(iframe)
      }
    }
  }, [isIOS])

  // iOS Safari doesn't handle PDFs well in iframes/embeds - show direct link instead
  if (isIOS) {
    return (
      <div className="w-full min-h-[400px] sm:min-h-[600px] md:min-h-[800px] flex flex-col items-center justify-center bg-bg-light p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
        <div className="text-center space-y-3 sm:space-y-4 max-w-md mx-auto">
          <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-muted mx-auto" />
          <p className="text-text font-medium px-2" style={{ fontSize: 'clamp(14px, 1.2vw, 18px)' }}>
            For the best viewing experience on iOS, please open the PDF directly in Safari.
          </p>
          <p className="text-muted px-2" style={{ fontSize: 'clamp(12px, 1vw, 14px)' }}>
            This ensures all pages are displayed correctly.
          </p>
        </div>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-md',
            'bg-accent text-text font-bold',
            'hover:bg-accent/90 transition-colors shadow-md',
            'min-h-[44px] text-sm sm:text-base w-full sm:w-auto max-w-xs'
          )}
          aria-label="Open resume PDF in Safari"
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          Open PDF in Safari
        </a>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="w-full min-h-[400px] sm:min-h-[600px] md:min-h-[800px] flex items-center justify-center bg-bg-light"
    />
  )
}

