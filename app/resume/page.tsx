'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Download, Printer, ArrowLeft, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Heading } from '@/components/Heading'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { motion } from 'framer-motion'
import type { Profile } from '@/types/profile'

// Lazy load PDF viewer
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[600px]">
      <LoadingSpinner />
    </div>
  ),
})

export default function ResumePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [hasPDFSupport, setHasPDFSupport] = useState(true)
  const [backHref, setBackHref] = useState('/#hero')

  useEffect(() => {
    // Get the previous section from sessionStorage, default to home
    if (typeof window !== 'undefined') {
      const previousSection = sessionStorage.getItem('previousSection')
      setBackHref(previousSection ? `/${previousSection}` : '/#hero')
    }
  }, [])

  useEffect(() => {
    // Fetch profile data on client side
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => {
        console.error('Failed to load profile:', err)
        // Fallback: try to load from public JSON
        fetch('/content/profile.json')
          .then((res) => res.json())
          .then((data) => setProfile(data))
          .catch(console.error)
      })
  }, [])

  useEffect(() => {
    // Check if browser supports PDF embedding
    const testSupport = () => {
      const hasPDFInWindow = 'PDF' in window
      const hasMimeType = navigator.mimeTypes && 
        typeof navigator.mimeTypes.namedItem === 'function' &&
        navigator.mimeTypes.namedItem('application/pdf') !== null
      const hasSupport = hasPDFInWindow || hasMimeType
      setHasPDFSupport(hasSupport)
    }
    testSupport()
  }, [])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = '/resume.pdf'
    link.download = 'Rana_Muhammad_Hamza_Resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrint = () => {
    window.print()
  }

  if (!profile) {
    return <LoadingSpinner />
  }

  return (
    <>
      <main className="pt-16 pb-[72px] min-h-screen bg-bg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
            className="mb-4 sm:mb-6 md:mb-8"
          >
            <div className="flex flex-col gap-4 sm:gap-6 mb-4 sm:mb-6 md:mb-8">
              {/* Top row: Back button and title */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
                  <Link
                    href={backHref}
                    className={cn(
                      'inline-flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-md',
                      'border border-border text-text font-medium',
                      'hover:border-accent hover:text-accent transition-colors',
                      'min-h-[44px] text-sm sm:text-base'
                    )}
                    aria-label="Back to home"
                    onClick={() => {
                      // Clear the stored section after using it
                      if (typeof window !== 'undefined') {
                        sessionStorage.removeItem('previousSection')
                      }
                    }}
                  >
                    <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Back</span>
                  </Link>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <Heading variant="h2" className="text-xl sm:text-2xl md:text-3xl">Resume</Heading>
                      <p className="text-muted mt-0.5 sm:mt-1 text-xs sm:text-sm md:text-base truncate" style={{ fontSize: 'clamp(12px, 1.1vw, 16px)' }}>{profile.name}</p>
                    </div>
                  </div>
                </div>
                {/* Action buttons - stack on mobile */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <a
                    href="/resume.pdf"
                    download
                    className={cn(
                      'inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-md',
                      'bg-accent text-text font-bold',
                      'hover:bg-accent/90 transition-colors shadow-md',
                      'min-h-[44px] text-sm sm:text-base w-full sm:w-auto'
                    )}
                    aria-label="Download resume PDF"
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    Download
                  </a>
                  <button
                    onClick={handlePrint}
                    className={cn(
                      'inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-md',
                      'border border-border text-text font-bold',
                      'hover:bg-surface transition-colors',
                      'min-h-[44px] text-sm sm:text-base w-full sm:w-auto'
                    )}
                    aria-label="Print resume"
                  >
                    <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
                    Print
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* PDF Viewer */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.04, ease: [0.2, 0.7, 0.2, 1] }}
            className="bg-surface rounded-lg shadow-md overflow-hidden border border-border"
          >
            {hasPDFSupport ? (
              <PDFViewer />
            ) : (
              <div className="p-6 sm:p-8 md:p-12 text-center">
                <div className="mb-4 sm:mb-6">
                  <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-muted mx-auto mb-3 sm:mb-4" />
                  <p className="text-base sm:text-lg text-text mb-2" style={{ fontSize: 'clamp(14px, 1.2vw, 18px)' }}>Your browser doesn&apos;t support PDF embedding.</p>
                  <p className="text-xs sm:text-sm text-muted" style={{ fontSize: 'clamp(12px, 1vw, 14px)' }}>Please download the PDF to view it.</p>
                </div>
                <a
                  href="/resume.pdf"
                  download
                  className={cn(
                    'inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-md',
                    'bg-accent text-text font-bold',
                    'hover:bg-accent/90 transition-colors shadow-md',
                    'min-h-[44px] text-sm sm:text-base w-full sm:w-auto max-w-xs mx-auto'
                  )}
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  Download PDF
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer contact={profile.contact} />
    </>
  )
}

