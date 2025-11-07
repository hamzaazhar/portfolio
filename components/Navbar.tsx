'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

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

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.filter(link => link.href.startsWith('#')).map((link) => link.href.substring(1))
      const scrollPosition = window.scrollY + 100

      let currentSection = ''
      let isDark = false

      const colorMap = {
        yellow: 'var(--color-accent-yellow)',
        purple: 'var(--color-accent-purple)',
        red: 'var(--color-accent-red)',
      }

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            currentSection = section
            // Check if section has dark variant - check class and computed styles
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

      setActiveSection(currentSection)
      setIsDarkSection(isDark)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav 
      className={cn(
        'fixed top-0 left-0 right-0 z-header backdrop-blur-xl border-b-2 transition-all duration-300',
        'transform-none opacity-100 visible',
        isDarkSection 
          ? 'bg-white/95 border-border shadow-2xl' 
          : 'bg-white/90 border-border shadow-lg'
      )}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        opacity: 1,
        visibility: 'visible',
        transform: 'none',
        ...(isDarkSection ? {
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderBottomColor: 'rgba(231, 226, 217, 0.9)'
        } : {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }),
        ['--nav-accent' as string]: navAccent,
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
                setIsOpen(false)
                
                // If navigating to resume page, store current section for back navigation
                if (link.href === '/resume' && pathname === '/') {
                  // Store current active section or hash
                  const currentHash = window.location.hash || `#${activeSection || 'hero'}`
                  sessionStorage.setItem('previousSection', currentHash)
                }
                
                // If navigating from another page to a hash link, ensure proper navigation
                if (link.href.startsWith('#') && pathname !== '/') {
                  e.preventDefault()
                  // Disable scroll restoration to prevent scroll to top
                  if ('scrollRestoration' in window.history) {
                    window.history.scrollRestoration = 'manual'
                  }
                  router.push(href)
                } else if (link.href.startsWith('#')) {
                  // If already on home page, handle smooth scroll
                  e.preventDefault()
                  const sectionId = link.href.substring(1)
                  const element = document.getElementById(sectionId)
                  if (element) {
                    const headerHeight = 64
                    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                    const offsetPosition = elementPosition - headerHeight
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    })
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

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden pb-4 border-t border-border"
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
                  setIsOpen(false)
                  
                  // If navigating to resume page, store current section for back navigation
                  if (link.href === '/resume' && pathname === '/') {
                    // Store current active section or hash
                    const currentHash = window.location.hash || `#${activeSection || 'hero'}`
                    sessionStorage.setItem('previousSection', currentHash)
                  }
                  
                  // If navigating from another page to a hash link, ensure proper navigation
                  if (link.href.startsWith('#') && pathname !== '/') {
                    e.preventDefault()
                    // Disable scroll restoration to prevent scroll to top
                    if ('scrollRestoration' in window.history) {
                      window.history.scrollRestoration = 'manual'
                    }
                    router.push(href)
                  } else if (link.href.startsWith('#')) {
                    // If already on home page, handle smooth scroll
                    e.preventDefault()
                    const sectionId = link.href.substring(1)
                    const element = document.getElementById(sectionId)
                    if (element) {
                      const headerHeight = 64
                      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                      const offsetPosition = elementPosition - headerHeight
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      })
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
                  >
                    {link.label}
                  </a>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}

