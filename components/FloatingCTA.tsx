'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, Mail } from 'lucide-react'
import { throttleScroll, getScrollPosition } from '@/lib/scrollUtils'
import { cn } from '@/lib/utils'

interface FloatingCTAProps {
  email?: string
  ctaText?: string
}

export function FloatingCTA({ 
  email = 'mailto:contact@example.com',
  ctaText = 'Get in Touch'
}: FloatingCTAProps) {
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Show scroll-to-top button when user scrolls down 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (getScrollPosition() > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    const throttledHandler = throttleScroll(toggleVisibility)
    window.addEventListener('scroll', throttledHandler)
    return () => window.removeEventListener('scroll', throttledHandler)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {/* CTA Button - Bottom Right */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5, type: 'spring', stiffness: 100 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <a
          href={email}
          className={cn(
            'inline-flex items-center justify-center gap-2',
            'px-6 py-4 rounded-full shadow-2xl',
            'bg-accent text-text font-bold text-base',
            'hover:bg-accent/90 transition-all duration-300',
            'transform hover:scale-110',
            'min-h-[52px] min-w-[52px]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'
          )}
          aria-label={ctaText}
        >
          <Mail className="w-5 h-5" style={{ width: '20px', height: '20px', flexShrink: 0 }} />
          <span className="hidden sm:inline">{ctaText}</span>
        </a>
      </motion.div>

      {/* Scroll to Top Button - Bottom Left */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 100 }}
            className="fixed bottom-6 left-6 z-50"
          >
            <button
              onClick={scrollToTop}
              className={cn(
                'inline-flex items-center justify-center',
                'w-12 h-12 rounded-full shadow-2xl',
                'bg-accent text-text font-semibold',
                'hover:bg-accent/90 transition-all duration-300',
                'transform hover:scale-110',
                'min-h-[48px] min-w-[48px]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'
              )}
              aria-label="Scroll to top"
            >
              <ChevronUp className="w-6 h-6" style={{ width: '24px', height: '24px', flexShrink: 0 }} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

