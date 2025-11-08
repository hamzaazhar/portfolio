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
    iframe.height = '1000px'
    iframe.style.border = 'none'
    iframe.title = 'Resume PDF'
    iframe.setAttribute('aria-label', 'Resume PDF viewer')

    container.appendChild(iframe)

    return () => {
      if (container && iframe.parentNode) {
        container.removeChild(iframe)
      }
    }
  }, [isIOS])

  // iOS Safari doesn't handle PDFs well in iframes/embeds - show direct link instead
  if (isIOS) {
    return (
      <div className="w-full min-h-[800px] flex flex-col items-center justify-center bg-bg-light p-8 space-y-6">
        <div className="text-center space-y-4">
          <FileText className="w-16 h-16 text-muted mx-auto" />
          <p className="text-text text-lg font-medium">
            For the best viewing experience on iOS, please open the PDF directly in Safari.
          </p>
          <p className="text-muted text-sm">
            This ensures all pages are displayed correctly.
          </p>
        </div>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex items-center gap-2 px-6 py-3 rounded-md',
            'bg-accent text-text font-bold text-base',
            'hover:bg-accent/90 transition-colors shadow-md',
            'min-h-[44px]'
          )}
          aria-label="Open resume PDF in Safari"
        >
          <Download className="w-5 h-5" />
          Open PDF in Safari
        </a>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="w-full min-h-[800px] flex items-center justify-center bg-bg-light"
    />
  )
}

