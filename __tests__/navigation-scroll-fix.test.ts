import { test, expect } from '@playwright/test'

/**
 * Comprehensive Navigation Scroll Fix Test Suite
 * Tests that navigation between sections does NOT restart from Hero section
 * Verifies all navigation paths: desktop nav, mobile menu, Hero CTAs
 */

// All sections on the page
const ALL_SECTIONS = ['hero', 'value', 'expertise', 'work', 'experience', 'education', 'certifications', 'contact']

// Navigation links from Navbar (only these are in nav)
const NAV_SECTIONS = ['hero', 'value', 'work', 'contact']

// Helper to get section element
async function getSectionElement(page: any, sectionId: string) {
  return page.locator(`#${sectionId}`)
}

// Helper to scroll to a section and wait for it to be visible
async function scrollToSection(page: any, sectionId: string, method: 'nav' | 'direct' = 'direct') {
  const element = await getSectionElement(page, sectionId)
  await element.scrollIntoViewIfNeeded()
  await page.waitForTimeout(500) // Wait for scroll to settle
}

// Helper to get current scroll position
async function getScrollPosition(page: any): Promise<number> {
  return await page.evaluate(() => {
    return window.pageYOffset || document.documentElement.scrollTop
  })
}

// Helper to get section's top position
async function getSectionTopPosition(page: any, sectionId: string): Promise<number> {
  return await page.evaluate((id: string) => {
    const element = document.getElementById(id)
    if (!element) return -1
    let top = 0
    let currentEl: HTMLElement | null = element
    while (currentEl) {
      top += currentEl.offsetTop
      currentEl = currentEl.offsetParent as HTMLElement | null
    }
    return top
  }, sectionId)
}

// Helper to check if we're at Hero section (within 100px of top)
async function isAtHeroSection(page: any): Promise<boolean> {
  const scrollPos = await getScrollPosition(page)
  return scrollPos < 100
}

// Helper to open mobile menu
async function openMobileMenu(page: any) {
  const menuButton = page.locator('button[aria-label="Toggle menu"]')
  if (await menuButton.isVisible({ timeout: 1000 }).catch(() => false)) {
    await menuButton.click()
    // Wait for menu animation to complete
    await page.waitForTimeout(500)
    // Verify menu is actually open by checking for overlay
    await page.waitForSelector('#mobile-menu-overlay', { state: 'visible', timeout: 2000 })
  }
}

// Helper to close mobile menu
async function closeMobileMenu(page: any) {
  const menuButton = page.locator('button[aria-label="Toggle menu"]')
  if (await menuButton.isVisible({ timeout: 1000 }).catch(() => false)) {
    await menuButton.click()
    await page.waitForTimeout(500)
  }
}

// Helper to navigate via desktop nav
async function navigateViaDesktopNav(page: any, targetSection: string) {
  // Desktop nav links are in a div with class containing "hidden md:flex"
  // We can target by aria-label which is set on all nav links
  const labelMap: Record<string, string> = {
    'hero': 'Home',
    'value': 'Value',
    'work': 'Work',
    'contact': 'Contact',
  }
  const label = labelMap[targetSection] || targetSection
  
  // Find desktop nav link by aria-label (more reliable than href filtering)
  const navLink = page.locator(`nav a[aria-label="${label}"][href="#${targetSection}"]`).first()
  await expect(navLink).toBeVisible({ timeout: 5000 })
  
  const scrollBefore = await getScrollPosition(page)
  await navLink.click()
  
  // Wait for navigation to complete (smooth scroll takes time)
  await page.waitForTimeout(1500)
  
  return scrollBefore
}

// Helper to navigate via mobile menu
async function navigateViaMobileMenu(page: any, targetSection: string) {
  await openMobileMenu(page)
  
  // Map section IDs to nav labels
  const labelMap: Record<string, string> = {
    'hero': 'Home',
    'value': 'Value',
    'work': 'Work',
    'contact': 'Contact',
  }
  
  const label = labelMap[targetSection] || targetSection
  
  // Scope to mobile menu overlay - mobile menu links are inside #mobile-menu-overlay
  const mobileMenuOverlay = page.locator('#mobile-menu-overlay')
  await expect(mobileMenuOverlay).toBeVisible({ timeout: 2000 })
  
  // Find link within mobile menu overlay
  const menuLink = mobileMenuOverlay.locator(`a[href="#${targetSection}"]`).filter({ hasText: label }).first()
  await expect(menuLink).toBeVisible({ timeout: 2000 })
  
  const scrollBefore = await getScrollPosition(page)
  await menuLink.click()
  
  // Wait for menu to close and scroll to complete
  await page.waitForTimeout(2000)
  
  return scrollBefore
}

// Helper to navigate via Hero CTA
async function navigateViaHeroCTA(page: any, ctaText: string) {
  // First scroll to hero
  await scrollToSection(page, 'hero')
  await page.waitForTimeout(500)
  
  const ctaButton = page.locator(`a:has-text("${ctaText}")`).first()
  await expect(ctaButton).toBeVisible({ timeout: 5000 })
  
  const scrollBefore = await getScrollPosition(page)
  await ctaButton.click()
  
  // Wait for scroll to complete
  await page.waitForTimeout(1500)
  
  return scrollBefore
}

test.describe('Navigation Scroll Fix - Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000) // Wait for initial animations
  })

  test('Desktop nav: Navigate from Contact to Work without Hero jump', async ({ page }) => {
    // Start at contact section
    await scrollToSection(page, 'contact')
    await page.waitForTimeout(500)
    
    const contactScrollPos = await getScrollPosition(page)
    expect(contactScrollPos).toBeGreaterThan(500) // Should be well past hero
    
    // Navigate to work via desktop nav
    const scrollBefore = await navigateViaDesktopNav(page, 'work')
    
    // Verify we didn't jump to Hero
    const scrollAfter = await getScrollPosition(page)
    const atHero = await isAtHeroSection(page)
    
    expect(atHero).toBe(false)
    expect(scrollAfter).toBeGreaterThan(500) // Should still be past hero
    expect(Math.abs(scrollAfter - scrollBefore)).toBeGreaterThan(100) // Should have scrolled
  })

  test('Desktop nav: Navigate from Work to Value without Hero jump', async ({ page }) => {
    await scrollToSection(page, 'work')
    await page.waitForTimeout(500)
    
    const scrollBefore = await navigateViaDesktopNav(page, 'value')
    
    const scrollAfter = await getScrollPosition(page)
    const atHero = await isAtHeroSection(page)
    
    expect(atHero).toBe(false)
    expect(scrollAfter).toBeGreaterThan(200)
  })

  test('Desktop nav: Navigate from Value to Contact without Hero jump', async ({ page }) => {
    await scrollToSection(page, 'value')
    await page.waitForTimeout(500)
    
    const scrollBefore = await navigateViaDesktopNav(page, 'contact')
    
    const scrollAfter = await getScrollPosition(page)
    const atHero = await isAtHeroSection(page)
    
    expect(atHero).toBe(false)
    expect(scrollAfter).toBeGreaterThan(scrollBefore) // Should scroll down
  })

  test('Desktop nav: All section-to-section navigation paths', async ({ page }) => {
    const testPaths = [
      { from: 'contact', to: 'work' },
      { from: 'work', to: 'value' },
      { from: 'value', to: 'contact' },
      { from: 'contact', to: 'value' },
      { from: 'work', to: 'contact' },
      { from: 'value', to: 'work' },
    ]

    for (const path of testPaths) {
      // Navigate to starting section
      await scrollToSection(page, path.from)
      await page.waitForTimeout(500)
      
      const scrollBefore = await getScrollPosition(page)
      const atHeroBefore = await isAtHeroSection(page)
      
      // Navigate to target
      await navigateViaDesktopNav(page, path.to)
      
      const scrollAfter = await getScrollPosition(page)
      const atHeroAfter = await isAtHeroSection(page)
      
      // If we started past hero, we should not jump to hero
      if (!atHeroBefore) {
        expect(atHeroAfter).toBe(false)
      }
      
      // Verify we actually navigated (scroll position changed)
      expect(Math.abs(scrollAfter - scrollBefore)).toBeGreaterThan(50)
    }
  })
})

test.describe('Navigation Scroll Fix - Mobile Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
  })

  test('Mobile menu: Navigate from Contact to Work without Hero jump', async ({ page }) => {
    // Start at contact section
    await scrollToSection(page, 'contact')
    await page.waitForTimeout(500)
    
    const contactScrollPos = await getScrollPosition(page)
    expect(contactScrollPos).toBeGreaterThan(500)
    
    // Navigate via mobile menu
    const scrollBefore = await navigateViaMobileMenu(page, 'work')
    
    // Verify we didn't jump to Hero
    const scrollAfter = await getScrollPosition(page)
    const atHero = await isAtHeroSection(page)
    
    expect(atHero).toBe(false)
    expect(scrollAfter).toBeGreaterThan(500)
  })

  test('Mobile menu: Navigate from Work to Value without Hero jump', async ({ page }) => {
    await scrollToSection(page, 'work')
    await page.waitForTimeout(500)
    
    const scrollBefore = await navigateViaMobileMenu(page, 'value')
    
    const scrollAfter = await getScrollPosition(page)
    const atHero = await isAtHeroSection(page)
    
    expect(atHero).toBe(false)
    expect(scrollAfter).toBeGreaterThan(200)
  })

  test('Mobile menu: Navigate from Value to Contact without Hero jump', async ({ page }) => {
    await scrollToSection(page, 'value')
    await page.waitForTimeout(500)
    
    const scrollBefore = await navigateViaMobileMenu(page, 'contact')
    
    const scrollAfter = await getScrollPosition(page)
    const atHero = await isAtHeroSection(page)
    
    expect(atHero).toBe(false)
    expect(scrollAfter).toBeGreaterThan(scrollBefore)
  })

  test('Mobile menu: All section-to-section navigation paths', async ({ page }) => {
    const testPaths = [
      { from: 'contact', to: 'work' },
      { from: 'work', to: 'value' },
      { from: 'value', to: 'contact' },
      { from: 'contact', to: 'value' },
      { from: 'work', to: 'contact' },
      { from: 'value', to: 'work' },
    ]

    for (const path of testPaths) {
      // Navigate to starting section
      await scrollToSection(page, path.from)
      await page.waitForTimeout(500)
      
      const scrollBefore = await getScrollPosition(page)
      const atHeroBefore = await isAtHeroSection(page)
      
      // Navigate to target via mobile menu
      await navigateViaMobileMenu(page, path.to)
      
      const scrollAfter = await getScrollPosition(page)
      const atHeroAfter = await isAtHeroSection(page)
      
      // If we started past hero, we should not jump to hero
      if (!atHeroBefore) {
        expect(atHeroAfter).toBe(false)
      }
      
      // Verify we actually navigated
      expect(Math.abs(scrollAfter - scrollBefore)).toBeGreaterThan(50)
    }
  })
})

test.describe('Navigation Scroll Fix - Hero CTAs', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
  })

  test('Hero CTA "See Case Studies" navigates to Work section', async ({ page }) => {
    await scrollToSection(page, 'hero')
    await page.waitForTimeout(500)
    
    await navigateViaHeroCTA(page, 'See Case Studies')
    
    const scrollAfter = await getScrollPosition(page)
    const workSectionTop = await getSectionTopPosition(page, 'work')
    const headerHeight = 64
    
    // Should be near work section (within 200px accounting for header)
    expect(Math.abs(scrollAfter - (workSectionTop - headerHeight))).toBeLessThan(200)
  })

  test('Hero CTA "Discuss Your Environment" navigates to Contact section', async ({ page }) => {
    await scrollToSection(page, 'hero')
    await page.waitForTimeout(500)
    
    await navigateViaHeroCTA(page, 'Discuss Your Environment')
    
    const scrollAfter = await getScrollPosition(page)
    const contactSectionTop = await getSectionTopPosition(page, 'contact')
    const headerHeight = 64
    
    // Should be near contact section
    expect(Math.abs(scrollAfter - (contactSectionTop - headerHeight))).toBeLessThan(200)
  })
})

test.describe('Navigation Scroll Fix - Comprehensive Matrix', () => {
  test('Test all navigation combinations from all sections', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Test matrix: from each nav section to each nav section
    for (const fromSection of NAV_SECTIONS) {
      for (const toSection of NAV_SECTIONS) {
        if (fromSection === toSection) continue // Skip same section
        
        // Navigate to starting section
        await scrollToSection(page, fromSection)
        await page.waitForTimeout(500)
        
        const scrollBefore = await getScrollPosition(page)
        const atHeroBefore = await isAtHeroSection(page)
        
        // Navigate to target
        await navigateViaDesktopNav(page, toSection)
        
        const scrollAfter = await getScrollPosition(page)
        const atHeroAfter = await isAtHeroSection(page)
        
        // If we started past hero, we should not jump to hero
        if (!atHeroBefore && toSection !== 'hero') {
          expect(atHeroAfter).toBe(false)
        }
        
        // Log for debugging
        console.log(`✓ ${fromSection} → ${toSection}: ${atHeroBefore ? 'started at hero' : 'started past hero'} → ${atHeroAfter ? 'ended at hero' : 'ended past hero'}`)
      }
    }
  })
})

test.describe('Navigation Scroll Fix - Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
  })

  test('Navigate from middle of page (between sections) to Work', async ({ page }) => {
    // Scroll to middle of page
    await page.evaluate(() => {
      window.scrollTo({ top: 2000, behavior: 'auto' })
    })
    await page.waitForTimeout(500)
    
    const scrollBefore = await getScrollPosition(page)
    expect(scrollBefore).toBeGreaterThan(1000)
    
    await navigateViaDesktopNav(page, 'work')
    
    const scrollAfter = await getScrollPosition(page)
    const atHero = await isAtHeroSection(page)
    
    expect(atHero).toBe(false)
    expect(scrollAfter).toBeGreaterThan(500)
  })

  test('Rapid navigation: Contact → Work → Value → Contact', async ({ page }) => {
    await scrollToSection(page, 'contact')
    await page.waitForTimeout(300)
    
    await navigateViaDesktopNav(page, 'work')
    await page.waitForTimeout(300)
    
    const atHero1 = await isAtHeroSection(page)
    expect(atHero1).toBe(false)
    
    await navigateViaDesktopNav(page, 'value')
    await page.waitForTimeout(300)
    
    const atHero2 = await isAtHeroSection(page)
    expect(atHero2).toBe(false)
    
    await navigateViaDesktopNav(page, 'contact')
    await page.waitForTimeout(300)
    
    const atHero3 = await isAtHeroSection(page)
    expect(atHero3).toBe(false)
  })
})

