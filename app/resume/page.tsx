'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Download, Printer, ArrowLeft, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
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
      <Navbar />
      <main className="pt-16 pb-[72px] min-h-screen bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <Link
                  href={backHref}
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 rounded-md',
                    'border border-border text-text font-medium',
                    'hover:border-accent hover:text-accent transition-colors',
                    'min-h-[44px]'
                  )}
                  aria-label="Back to home"
                  onClick={() => {
                    // Clear the stored section after using it
                    if (typeof window !== 'undefined') {
                      sessionStorage.removeItem('previousSection')
                    }
                  }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md bg-accent/10 border border-accent/30 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <Heading variant="h2">Resume</Heading>
                    <p className="text-muted mt-1">{profile.name}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="/resume.pdf"
                  download
                  className={cn(
                    'inline-flex items-center gap-2 px-6 py-3 rounded-md',
                    'bg-accent text-text font-bold text-base',
                    'hover:bg-accent/90 transition-colors shadow-md',
                    'min-h-[44px]'
                  )}
                  aria-label="Download resume PDF"
                >
                  <Download className="w-5 h-5" />
                  Download
                </a>
                <button
                  onClick={handlePrint}
                  className={cn(
                    'inline-flex items-center gap-2 px-6 py-3 rounded-md',
                    'border border-border text-text font-bold text-base',
                    'hover:bg-surface transition-colors',
                    'min-h-[44px]'
                  )}
                  aria-label="Print resume"
                >
                  <Printer className="w-5 h-5" />
                  Print
                </button>
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
              <div className="p-12 text-center">
                <div className="mb-6">
                  <FileText className="w-16 h-16 text-muted mx-auto mb-4" />
                  <p className="text-lg text-text mb-2">Your browser doesn't support PDF embedding.</p>
                  <p className="text-sm text-muted">Please download the PDF to view it.</p>
                </div>
                <a
                  href="/resume.pdf"
                  download
                  className={cn(
                    'inline-flex items-center gap-2 px-6 py-3 rounded-md',
                    'bg-accent text-text font-bold text-base',
                    'hover:bg-accent/90 transition-colors shadow-md',
                    'min-h-[44px]'
                  )}
                >
                  <Download className="w-5 h-5" />
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

