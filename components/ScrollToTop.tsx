'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { throttleScroll, getScrollPosition } from '@/lib/scrollUtils'

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px or more
      if (getScrollPosition() > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    const throttledHandler = throttleScroll(toggleVisibility)
    window.addEventListener('scroll', throttledHandler)

    return () => {
      window.removeEventListener('scroll', throttledHandler)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
          onClick={scrollToTop}
          className={cn(
            'fixed bottom-28 right-8 z-50',
            'flex items-center justify-center',
            'w-12 h-12 rounded-full',
            'bg-accent text-text',
            'shadow-md hover:shadow-lg',
            'hover:bg-accent/90',
            'transition-all duration-200',
            'focus-visible:outline-none',
            'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
            'min-h-[48px] min-w-[48px]'
          )}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

