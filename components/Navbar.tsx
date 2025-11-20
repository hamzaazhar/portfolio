'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { throttleScroll, getScrollPosition, supportsPassiveListeners } from '@/lib/scrollUtils'

const navLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#value', label: 'Value' },
  { href: '#work', label: 'Work' },
  { href: '/resume', label: 'Resume' },
  { href: '#contact', label: 'Contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [isDarkSection, setIsDarkSection] = useState(false)
  const [navAccent, setNavAccent] = useState('var(--color-accent-yellow)')
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const storedScrollYRef = useRef<number>(0)
  const isManualNavigationRef = useRef<boolean>(false)
  const isNavigatingRef = useRef<boolean>(false)
  const isOpenRef = useRef(isOpen)
  const pendingSectionRef = useRef<string | null>(null)

  // Keep isOpenRef in sync with state for event handlers
  useEffect(() => {
    isOpenRef.current = isOpen
  }, [isOpen])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Scroll progress handler for dynamic navbar effects
  const handleScrollProgress = useCallback(() => {
    const scrollY = getScrollPosition()
    const maxScroll = 200
    const progress = Math.min(scrollY / maxScroll, 1)
    setScrollProgress(progress)
  }, [])

  // Sync active section with URL hash on mount and hash changes
  useEffect(() => {
    if (pathname === '/') {
      const hash = window.location.hash
      if (hash) {
        const sectionId = hash.substring(1)
        const element = document.getElementById(sectionId)
        if (element && navLinks.some(link => link.href === hash)) {
          setActiveSection(sectionId)
        }
      }
    }

    const handleHashChange = () => {
      if (pathname === '/') {
        const hash = window.location.hash
        if (hash) {
          const sectionId = hash.substring(1)
          const element = document.getElementById(sectionId)
          if (element && navLinks.some(link => link.href === hash)) {
            setActiveSection(sectionId)
          }
        } else {
          setActiveSection('hero')
        }
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [pathname])

  useEffect(() => {
    // Only run scroll-based section detection on home page
    // On other pages (like /resume), don't interfere with the URL hash
    if (pathname !== '/') {
      return
    }

    const sections = navLinks.filter(link => link.href.startsWith('#')).map((link) => link.href.substring(1))

    const handleScroll = () => {
      handleScrollProgress()

      const scrollPosition = getScrollPosition()

      // Skip section detection during manual navigation or when menu is open
      // Also prevent updating storedScrollYRef when menu is open to avoid capturing the 'fixed' position(0)
      if (isManualNavigationRef.current || isOpenRef.current) {
        return
      }

      // Update stored scroll position
      storedScrollYRef.current = scrollPosition

      // Use viewport center for better section detection on mobile
      const viewportHeight = window.innerHeight
      const detectionPoint = scrollPosition + (viewportHeight / 3)

      let currentSection = ''
      let isDark = false

      const colorMap = {
        yellow: 'var(--color-accent-yellow)',
        purple: 'var(--color-accent-purple)',
        red: 'var(--color-accent-red)',
      }

      // Find which section the detection point is in
      // Iterate through all sections to find the best match
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = rect.top + scrollPosition
          const elementBottom = elementTop + rect.height

          // Check if detection point is within this section
          if (detectionPoint >= elementTop && detectionPoint < elementBottom) {
            currentSection = section

            // Check if section has dark variant
            const hasDarkClass = element.classList.contains('bg-bg-dark')
            const computedBg = window.getComputedStyle(element).backgroundColor
            const isDarkBg = computedBg.includes('26, 26, 26') ||
                    computedBg.includes('rgb(26, 26, 26)') ||
                    computedBg.includes('#1a1a1a')
            isDark = hasDarkClass || isDarkBg

            // Read accent from section
            const accentKey = (element.dataset.accent as keyof typeof colorMap) || 'yellow'
            setNavAccent(colorMap[accentKey])
            break
          }
        }
      }

      // If no section found by scroll position, check if we're near the top
      // BUT: Don't override an existing hash if one is already set (prevents overwriting #value, #work, etc. on page load)
      if (!currentSection && scrollPosition < 100) {
        const existingHash = window.location.hash
        // Only default to 'hero' if there's no hash or the hash is already 'hero'
        if (!existingHash || existingHash === '#hero') {
          currentSection = 'hero'
        } else {
          // If there's a hash for a different section, respect it and don't override
          const hashSectionId = existingHash.substring(1)
          if (navLinks.some(link => link.href === existingHash)) {
            // Don't set currentSection here - let the fallback logic handle it
            // This prevents overwriting the hash during initial page load
          }
        }
      }

      // Update active section and URL hash
      if (currentSection) {
        setActiveSection(currentSection)
        setIsDarkSection(isDark)

        // Update URL hash to match current section
        // BUT: Don't overwrite if we're at the top and there's already a specific hash set
        const expectedHash = `#${currentSection}`
        const existingHash = window.location.hash
        // Only update hash if:
        // 1. It's different from expected, AND
        // 2. We're not at the top with a different valid hash (allows page to load and scroll to target)
        if (window.location.hash !== expectedHash) {
          // If we're near the top and there's a different valid hash, don't override it yet
          if (scrollPosition < 100 && existingHash && existingHash !== expectedHash) {
            const hashSectionId = existingHash.substring(1)
            if (navLinks.some(link => link.href === existingHash)) {
              // Don't override - let the page scroll to the target section first
              return
            }
          }
          window.history.replaceState(null, '', expectedHash)
        }
      } else if (pathname === '/') {
        // Fallback: if still no section detected, use URL hash
        const hash = window.location.hash
        if (hash) {
          const sectionId = hash.substring(1)
          if (navLinks.some(link => link.href === hash)) {
            setActiveSection(sectionId)
          }
        }
      }
    }

    const throttledHandler = throttleScroll(handleScroll)
    const eventOptions = supportsPassiveListeners() ? { passive: true } : false

    window.addEventListener('scroll', throttledHandler, eventOptions as any)
    handleScroll()
    return () => window.removeEventListener('scroll', throttledHandler)
  }, [handleScrollProgress, pathname])

  // Reset navbar state on route change and close mobile menu
  useEffect(() => {
    setScrollProgress(0)
    setIsOpen(false)
    // Clear activeSection when not on home page to prevent dual highlighting
    if (pathname !== '/') {
      setActiveSection('')
      // Clear any hash on non-home pages (like /resume) to prevent /resume#hero or /resume#value
      if (window.location.hash) {
        window.history.replaceState(null, '', pathname)
      }
    } else {
      // Check for pending section or hash in URL
      const hash = window.location.hash
      const sectionIdFromHash = hash ? hash.substring(1) : null
      const targetSection = pendingSectionRef.current || sectionIdFromHash
      
      if (targetSection && navLinks.some(link => link.href === `#${targetSection}`)) {
        const sectionId = targetSection
        if (pendingSectionRef.current) {
          pendingSectionRef.current = null
        }
        
        // Wait for DOM to be ready
        setTimeout(() => {
          const element = document.getElementById(sectionId)
          if (element) {
            setActiveSection(sectionId)
            
            // Calculate scroll position
            const headerHeight = 64
            let elementTop = 0
            let currentEl: HTMLElement | null = element
            while (currentEl) {
              elementTop += currentEl.offsetTop
              currentEl = currentEl.offsetParent as HTMLElement | null
            }
            
            const targetScrollPosition = sectionId === 'hero' 
              ? 0 
              : Math.max(0, elementTop - headerHeight)
            
            // Scroll to target section
            const html = document.documentElement
            const originalScrollBehavior = html.style.scrollBehavior
            html.style.scrollBehavior = 'auto'
            
            window.scrollTo({
              top: targetScrollPosition,
              behavior: 'auto'
            })
            
            // Re-enable smooth scroll after a brief delay
            requestAnimationFrame(() => {
              html.style.scrollBehavior = originalScrollBehavior
            })
          }
        }, 150)
      }
    }
  }, [pathname])

  // Handle escape key and outside clicks to close menu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      window.addEventListener('resize', handleResize)

      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [isOpen])

  // Sync active section when menu opens - detect current section
  useEffect(() => {
    if (isOpen && pathname === '/') {
      const syncActiveSection = () => {
        // First priority: check URL hash
        const hash = window.location.hash
        if (hash) {
          const sectionId = hash.substring(1)
          if (navLinks.some(link => link.href === hash)) {
            setActiveSection(sectionId)
            return
          }
        }

        // Get current scroll position
        const scrollY = getScrollPosition()
        storedScrollYRef.current = scrollY

        // Detect section using absolute document positions
        const sections = navLinks.filter(link => link.href.startsWith('#')).map((link) => link.href.substring(1))
        const viewportHeight = window.innerHeight
        const detectionPoint = scrollY + (viewportHeight / 3)

        let detectedSection = ''
        for (const section of sections) {
          const element = document.getElementById(section)
          if (element) {
            // Get absolute position from document root
            let elementTop = 0
            let currentEl: HTMLElement | null = element
            while (currentEl) {
              elementTop += currentEl.offsetTop
              currentEl = currentEl.offsetParent as HTMLElement | null
            }

            const elementBottom = elementTop + element.offsetHeight

            if (detectionPoint >= elementTop && detectionPoint < elementBottom) {
              detectedSection = section
              break
            }
          }
        }

        // Fallback to hero if near top
        if (!detectedSection && scrollY < 100) {
          detectedSection = 'hero'
        }

        if (detectedSection) {
          setActiveSection(detectedSection)
        }
      }

      // Run immediately
      syncActiveSection()
    }
  }, [isOpen, pathname])

  // Enhanced scroll lock for mobile menu - comprehensive cross-platform solution
  useEffect(() => {
    const body = document.body
    const html = document.documentElement
    let scrollY = 0

    if (isOpen) {
      // Store current scroll position BEFORE fixing body
      scrollY = getScrollPosition()
      storedScrollYRef.current = scrollY

      // Store original styles to restore later
      const originalBodyStyle = {
        position: body.style.position,
        top: body.style.top,
        left: body.style.left,
        right: body.style.right,
        width: body.style.width,
        overflow: body.style.overflow,
        touchAction: body.style.touchAction,
        paddingRight: body.style.paddingRight,
      }

      const originalHtmlStyle = {
        overflow: html.style.overflow,
        overscrollBehavior: html.style.overscrollBehavior,
      }

      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

      // Apply comprehensive scroll lock
      body.style.position = 'fixed'
      body.style.top = `-${scrollY}px`
      body.style.left = '0'
      body.style.right = '0'
      body.style.width = '100%'
      body.style.overflow = 'hidden'

      // Prevent scrollbar layout shift
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`
      }

      // Prevent iOS bounce scrolling and Android overscroll
      body.style.touchAction = 'none'
      html.style.overflow = 'hidden'

      // Modern browsers overscroll behavior
      if ('overscrollBehavior' in html.style) {
        html.style.overscrollBehavior = 'contain'
      }

      // Additional iOS Safari fixes
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        body.style.height = '100%'
        // Use type assertion for webkit-specific property
        ;(body.style as any).webkitOverflowScrolling = 'touch'
      }

      return () => {
        // Restore all original styles
        Object.keys(originalBodyStyle).forEach(key => {
          body.style[key as keyof typeof originalBodyStyle] = originalBodyStyle[key as keyof typeof originalBodyStyle]
        })

        Object.keys(originalHtmlStyle).forEach(key => {
          html.style[key as keyof typeof originalHtmlStyle] = originalHtmlStyle[key as keyof typeof originalHtmlStyle]
        })

        // iOS specific cleanup
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
          body.style.height = ''
          ;(body.style as any).webkitOverflowScrolling = ''
        }

        // Restore scroll position
        // CRITICAL: Use 'auto' behavior to bypass global CSS scroll-behavior: smooth
        // This prevents an animated jump from Hero when menu closes
        // Always restore immediately to prevent a frame at scroll 0(flicker)
        // Temporarily disable smooth scroll globally to ensure instant restoration
        const originalScrollBehavior = html.style.scrollBehavior
        html.style.scrollBehavior = 'auto'

        // Restore immediately without requestAnimationFrame to prevent a frame at scroll 0
        window.scrollTo({ top: scrollY, behavior: 'auto' })

        // Re-enable smooth scroll after a small delay
        // We use a double RAF to ensure the 'auto' scroll has been processed
        if (typeof requestAnimationFrame !== 'undefined') {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              html.style.scrollBehavior = originalScrollBehavior
            })
          })
        } else {
          setTimeout(() => {
            html.style.scrollBehavior = originalScrollBehavior
          }, 50)
        }
      }
    }
  }, [isOpen])

  // Memoize animation variants for better performance
  const navVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0.01 : 0.5,
        ease: 'easeOut'
      }
    }
  }), [prefersReducedMotion])

  // Calculate dynamic background based on scroll progress
  const dynamicBackground = useMemo(() => {
    const baseOpacity = isDarkSection ? 0.98 : 0.9
    const blurAmount = 2 + scrollProgress * 10
    const bgOpacity = baseOpacity + scrollProgress * 0.05

    return {
      background: `linear-gradient(
        180deg,
        rgba(255, 255, 255, ${bgOpacity}) 0%,
        rgba(255, 255, 255, ${bgOpacity * 0.95}) 100%
      )`,
      backdropFilter: `blur(${blurAmount}px)`,
      WebkitBackdropFilter: `blur(${blurAmount}px)`,
    }
  }, [scrollProgress, isDarkSection])

  return (
    <motion.nav
      aria-label="Main Navigation"
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'fixed top-0 left-0 right-0 z-header border-b-2 transition-all duration-300',
        'transform-none opacity-100 visible',
        isDarkSection
          ? 'border-border shadow-2xl'
          : 'border-border shadow-lg'
      )}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        opacity: 1,
        visibility: 'visible',
        ...dynamicBackground,
        ...(isDarkSection ? {
          borderBottomColor: 'rgba(231, 226, 217, 0.9)'
        } : {}),
        ['--nav-accent' as string]: navAccent,
        willChange: 'background, backdrop-filter',
        transform: 'translateZ(0)',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
      } as React.CSSProperties}
    >
      {/* Moving beam glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        {!prefersReducedMotion && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 h-32 w-64 rounded-full blur-3xl opacity-60"
            style={{
              background: `radial-gradient(circle, var(--nav-accent) 0%, transparent 60%)`
            }}
            animate={{ x: ['-20%', '120%'] }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-16">
          <a
            href="/#hero"
            className="text-xl font-heading font-black transition-colors text-text hover:text-accent-yellow"
            aria-label="Home"
          >
            RMH
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const sectionId = link.href.startsWith('#') ? link.href.substring(1) : ''
              // Check if it's a hash link and active section matches
              const isHashActive = link.href.startsWith('#') && activeSection === sectionId
              // Check if it's a route link and pathname matches
              const isRouteActive = !link.href.startsWith('#') && pathname === link.href
              // Link is active if either condition is true
              const isActive = isHashActive || isRouteActive

              // If we're not on home page and link is a hash link, prepend '/' to navigate to home first
              const href = link.href.startsWith('#') && pathname !== '/'
                ? `/${link.href}`
                : link.href

              const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                // If navigating to resume page
                if (link.href === '/resume') {
                  // If we are on the home page, store current section
                  if (pathname === '/') {
                    const currentHash = window.location.hash || `#${activeSection || 'hero'}`
                    sessionStorage.setItem('previousSection', currentHash)
                  }

                  // If we are already on the resume page, prevent default to avoid reload(optional)
                  // or allow it to reload. Let's allow standard navigation behavior.
                  // But we must ensure we don't trigger the hash logic below.
                  return
                }

                // If navigating from another page to a hash link, ensure proper navigation
                if (link.href.startsWith('#') && pathname !== '/') {
                  e.preventDefault()
                  // Disable scroll restoration to prevent scroll to top
                  if ('scrollRestoration' in window.history) {
                    window.history.scrollRestoration = 'manual'
                  }
                  
                  const sectionId = link.href.substring(1)
                  // Store the target section to scroll to after navigation
                  pendingSectionRef.current = sectionId
                  
                  // Navigate to home page with hash - use the full path with hash
                  router.push(`/${link.href}`)
                } else if (link.href.startsWith('#')) {
                  // If already on home page, handle smooth scroll
                  e.preventDefault()
                  const sectionId = link.href.substring(1)
                  const element = document.getElementById(sectionId)
                  if (element) {
                    // Update active section immediately
                    setActiveSection(sectionId)

                    // Set manual navigation flag
                    isManualNavigationRef.current = true

                    // Update URL hash without triggering scroll
                    window.history.pushState(null, '', link.href)

                    // Special handling for hero section - scroll to top
                    if (sectionId === 'hero') {
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                      })
                    } else {
                      // Calculate scroll position with proper offset for other sections
                      const headerHeight = 64
                      const rect = element.getBoundingClientRect()
                      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
                      const elementTop = rect.top + scrollTop
                      const offsetPosition = Math.max(0, elementTop - headerHeight)

                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      })
                    }

                    // Re-enable scroll detection after scrolling completes
                    setTimeout(() => {
                      isManualNavigationRef.current = false
                    }, 1000)
                  }
                }
              }

              return (
                <a
                  key={link.href}
                  href={href}
                  className={cn(
                    'px-4 py-2 text-sm font-medium relative',
                    'transition-colors duration-160',
                    'min-h-[44px] min-w-[44px] flex items-center justify-center',
                    isActive
                      ? 'text-accent-yellow font-semibold'
                      : isDarkSection
                        ? 'text-text/90 hover:text-accent-yellow'
                        : 'text-muted hover:text-accent-yellow'
                  )}
                  onClick={handleClick}
                  aria-label={link.label}
                >
                  {link.label}
                  {/* Yellow underline for all active sections */}
                  {isActive && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, var(--color-accent-yellow), color-mix(in srgb, var(--color-accent-yellow) 30%, #fff))`
                      }}
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                        duration: 0.2
                      }}
                    />
                  )}
                </a>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center text-muted hover:text-accent-yellow"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay - solid dark background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed z-40 md:hidden"
              style={{
                top: '64px', // Start below the navbar (h-16 = 64px)
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(9px)',
                WebkitBackdropFilter: 'blur(9px)'
              }}
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile menu - solid overlay window */}
            <motion.div
              key="mobile-menu-overlay"
              initial={{ scaleY: 0, transformOrigin: 'top' }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{
                position: 'fixed',
                top: '64px',
                left: 0,
                right: 0,
                height: 'auto',
                zIndex: 99999,
                backgroundColor: 'var(--bg)',
                borderBottom: '1px solid var(--border)',
                borderBottomLeftRadius: '16px',
                borderBottomRightRadius: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                opacity: 1,
                visibility: 'visible',
                display: 'block',
                isolation: 'isolate'
              }}
              className="md:hidden pb-4"
            >
              <div className="flex flex-col gap-1 pt-2">
                {navLinks.map((link) => {
                  const sectionId = link.href.startsWith('#') ? link.href.substring(1) : ''
                  // Check if it's a hash link and active section matches
                  const isHashActive = link.href.startsWith('#') && activeSection === sectionId
                  // Check if it's a route link and pathname matches
                  const isRouteActive = !link.href.startsWith('#') && pathname === link.href
                  // Link is active if either condition is true
                  const isActive = isHashActive || isRouteActive

                  // If we're not on home page and link is a hash link, prepend '/' to navigate to home first
                  const href = link.href.startsWith('#') && pathname !== '/'
                    ? `/${link.href}`
                    : link.href

                  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                    // If navigating to resume page
                    if (link.href === '/resume') {
                      // If we are on the home page, store current section
                      if (pathname === '/') {
                        const currentHash = window.location.hash || `#${activeSection || 'hero'}`
                        sessionStorage.setItem('previousSection', currentHash)
                      }

                      // Close menu
                      setIsOpen(false)

                      // Allow standard navigation to proceed
                      return
                    }

                    e.preventDefault()

                    // If navigating from another page to a hash link, ensure proper navigation
                    if (link.href.startsWith('#') && pathname !== '/') {
                      // Disable scroll restoration to prevent scroll to top
                      if ('scrollRestoration' in window.history) {
                        window.history.scrollRestoration = 'manual'
                      }

                      const sectionId = link.href.substring(1)
                      // Store the target section to scroll to after navigation
                      pendingSectionRef.current = sectionId
                      
                      setIsOpen(false)
                      // Wait for menu to close and body to unlock before navigating
                      setTimeout(() => {
                        // Navigate to home page with hash - use the full path with hash
                        router.push(`/${link.href}`)
                      }, 100)
                      return
                    }

                    // If already on home page, handle smooth scroll
                    if (link.href.startsWith('#')) {
                      const sectionId = link.href.substring(1)
                      const element = document.getElementById(sectionId)

                      if (element) {
                        // Update active section immediately
                        setActiveSection(sectionId)

                        // Set flags
                        isManualNavigationRef.current = true
                        isNavigatingRef.current = true

                        // Close menu first - this will trigger scroll lock cleanup
                        // The cleanup will handle restoring to the current position synchronously
                        setIsOpen(false)

                        // Use a small timeout to ensure the body styles have been cleared
                        // and the browser has processed the layout change
                        setTimeout(() => {
                          // Calculate target position
                          let targetScrollPosition = 0
                          if (sectionId === 'hero') {
                            targetScrollPosition = 0
                          } else {
                            const headerHeight = 64
                            // Use offsetTop calculation which works regardless of viewport position
                            // This gives us absolute position from document top
                            let elementTop = 0
                            let currentEl: HTMLElement | null = element
                            while (currentEl) {
                              elementTop += currentEl.offsetTop
                              currentEl = currentEl.offsetParent as HTMLElement | null
                            }

                            targetScrollPosition = Math.max(0, elementTop - headerHeight)
                          }

                          // Update URL hash without triggering scroll
                          window.history.pushState(null, '', link.href)

                          // CRITICAL: Handle the scroll sequence manually
                          const html = document.documentElement
                          const originalScrollBehavior = html.style.scrollBehavior

                          // The cleanup has already restored us to the current position
                          // Now we just need to smooth scroll to the target

                          requestAnimationFrame(() => {
                            html.style.scrollBehavior = 'smooth'
                            window.scrollTo({
                              top: targetScrollPosition,
                              behavior: 'smooth'
                            })

                            // Cleanup
                            setTimeout(() => {
                              html.style.scrollBehavior = originalScrollBehavior
                              isManualNavigationRef.current = false
                              isNavigatingRef.current = false
                            }, 1000)
                          })
                        }, 50) // 50ms delay to allow DOM to settle after menu close
                      }
                    }
                  }

                  return (
                    <a
                      key={link.href}
                      href={href}
                      className={cn(
                        'px-4 py-3 text-sm font-medium rounded-md transition-colors duration-160 min-h-[44px]',
                        isActive
                          ? 'text-accent-yellow bg-accent-yellow/10 font-semibold'
                          : isDarkSection
                            ? 'text-text/90 hover:text-accent-yellow hover:bg-surface/50'
                            : 'text-muted hover:text-accent-yellow hover:bg-surface'
                      )}
                      onClick={handleClick}
                      aria-label={link.label}
                    >
                      {link.label}
                    </a>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
