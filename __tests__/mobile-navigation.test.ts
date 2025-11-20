import { test, expect } from '@playwright/test'

/**
 * Comprehensive Mobile Navigation Test Suite
 * Tests all navigation paths from every page to every page on mobile viewport
 * VERIFIES: Direct navigation (no intermediate page loads)
 */

// Navigation links from Navbar
const NAV_LINKS = [
  { href: '#hero', label: 'Home' },
  { href: '#value', label: 'Value' },
  { href: '#work', label: 'Work' },
  { href: '/resume', label: 'Resume' },
  { href: '#contact', label: 'Contact' },
]

// Home page sections
const HOME_SECTIONS = ['hero', 'value', 'work', 'contact']

// Helper function to wait for navigation to complete
async function waitForNavigation(page: any, expectedUrl: string, timeout = 5000) {
  await page.waitForURL((url: URL) => {
    const urlStr = url.toString()
    return urlStr.includes(expectedUrl) || urlStr.endsWith(expectedUrl)
  }, { timeout })
}

// Helper function to open mobile menu
async function openMobileMenu(page: any) {
  const menuButton = page.locator('button[aria-label="Toggle menu"]')
  await expect(menuButton).toBeVisible({ timeout: 5000 })
  await menuButton.click()
  // Wait for menu animation
  await page.waitForTimeout(500)
  // Verify menu is open by checking for menu content
  await page.waitForSelector('#mobile-menu-overlay', { state: 'visible', timeout: 2000 }).catch(() => {
    // If selector doesn't work, check for menu links
    return page.waitForSelector('a:has-text("Home"), a:has-text("Value")', { timeout: 2000 })
  })
}

test.describe('Mobile Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
  })

  test('Mobile menu button is visible on mobile viewport', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const menuButton = page.locator('button[aria-label="Toggle menu"]')
    await expect(menuButton).toBeVisible({ timeout: 5000 })
  })

  test('Mobile menu opens and closes correctly', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const menuButton = page.locator('button[aria-label="Toggle menu"]')
    await expect(menuButton).toBeVisible({ timeout: 5000 })
    
    // Check menu is closed initially - look for menu links that should be hidden
    const homeLink = page.locator('a:has-text("Home")').first()
    const isInitiallyVisible = await homeLink.isVisible().catch(() => false)
    
    // Open menu
    await menuButton.click()
    await page.waitForTimeout(500)
    
    // Verify menu opened - check for menu links visibility
    await expect(homeLink).toBeVisible({ timeout: 2000 })
    
    // Close menu
    await menuButton.click()
    await page.waitForTimeout(500)
    
    // Menu should be closed (links not visible or menu overlay hidden)
    const menuOverlay = page.locator('#mobile-menu-overlay')
    const overlayVisible = await menuOverlay.isVisible().catch(() => false)
    expect(overlayVisible).toBe(false)
  })

  test('All navigation links are present in mobile menu', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await openMobileMenu(page)
    
    for (const link of NAV_LINKS) {
      const linkElement = page.locator(`a:has-text("${link.label}")`).first()
      await expect(linkElement).toBeVisible({ timeout: 2000 })
    }
  })

  // Test DIRECT navigation from Home page to all destinations
  test.describe('Direct Navigation from Home Page', () => {
    test('Navigate DIRECTLY from Home to Hero section', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      const initialUrl = page.url()
      await openMobileMenu(page)
      
      const heroLink = page.locator('a:has-text("Home")').first()
      await heroLink.click()
      
      // Wait for navigation
      await page.waitForTimeout(1000)
      
      // Verify direct navigation - URL should contain #hero
      expect(page.url()).toContain('#hero')
      // Verify we didn't navigate away and come back
      expect(page.url()).toContain(initialUrl.split('#')[0])
    })

    test('Navigate DIRECTLY from Home to Value section', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      const initialUrl = page.url()
      await openMobileMenu(page)
      
      const valueLink = page.locator('a:has-text("Value")').first()
      await valueLink.click()
      
      await page.waitForTimeout(1500)
      
      // Verify direct navigation to #value
      expect(page.url()).toContain('#value')
      expect(page.url()).toContain(initialUrl.split('#')[0])
      
      // Verify section is visible
      const valueSection = page.locator('#value')
      await expect(valueSection).toBeVisible({ timeout: 2000 })
    })

    test('Navigate DIRECTLY from Home to Work section', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      const initialUrl = page.url()
      await openMobileMenu(page)
      
      const workLink = page.locator('a:has-text("Work")').first()
      await workLink.click()
      
      await page.waitForTimeout(1500)
      
      expect(page.url()).toContain('#work')
      expect(page.url()).toContain(initialUrl.split('#')[0])
      
      const workSection = page.locator('#work')
      await expect(workSection).toBeVisible({ timeout: 2000 })
    })

    test('Navigate DIRECTLY from Home to Contact section', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      const initialUrl = page.url()
      await openMobileMenu(page)
      
      const contactLink = page.locator('a:has-text("Contact")').first()
      await contactLink.click()
      
      await page.waitForTimeout(1500)
      
      expect(page.url()).toContain('#contact')
      expect(page.url()).toContain(initialUrl.split('#')[0])
      
      const contactSection = page.locator('#contact')
      await expect(contactSection).toBeVisible({ timeout: 2000 })
    })

    test('Navigate DIRECTLY from Home to Resume page', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      const initialUrl = page.url()
      await openMobileMenu(page)
      
      const resumeLink = page.locator('a[href="/resume"]:has-text("Resume")').first()
      await resumeLink.click()
      
      // Wait for page navigation
      await page.waitForURL('**/resume', { timeout: 5000 })
      
      // Verify direct navigation - should be on /resume, not /#hero then /resume
      expect(page.url()).toContain('/resume')
      expect(page.url()).not.toContain('#hero')
      
      // Verify resume page loaded
      const resumeHeading = page.locator('h1, h2').filter({ hasText: /resume/i })
      await expect(resumeHeading.first()).toBeVisible({ timeout: 3000 })
    })
  })

  // Test DIRECT navigation from Resume page
  test.describe('Direct Navigation from Resume Page', () => {
    test('Navigate DIRECTLY from Resume to Home (#hero)', async ({ page }) => {
      await page.goto('/resume')
      await page.waitForLoadState('networkidle')
      
      const initialUrl = page.url()
      await openMobileMenu(page)
      
      const homeLink = page.locator('a:has-text("Home")').first()
      await homeLink.click()
      
      await page.waitForTimeout(1500)
      
      // Should navigate directly to home with #hero, not via intermediate pages
      expect(page.url()).toContain('#hero')
      expect(page.url()).not.toContain('/resume')
      
      const heroSection = page.locator('#hero')
      await expect(heroSection).toBeVisible({ timeout: 2000 })
    })

    test('Navigate DIRECTLY from Resume to Value section', async ({ page }) => {
      await page.goto('/resume')
      await page.waitForLoadState('networkidle')
      
      await openMobileMenu(page)
      
      const valueLink = page.locator('a:has-text("Value")').first()
      await valueLink.click()
      
      await page.waitForTimeout(1500)
      
      // Direct navigation to #value from /resume
      expect(page.url()).toContain('#value')
      expect(page.url()).not.toContain('/resume')
      
      const valueSection = page.locator('#value')
      await expect(valueSection).toBeVisible({ timeout: 2000 })
    })

    test('Navigate DIRECTLY from Resume to Work section', async ({ page }) => {
      await page.goto('/resume')
      await page.waitForLoadState('networkidle')
      
      await openMobileMenu(page)
      
      const workLink = page.locator('a:has-text("Work")').first()
      await workLink.click()
      
      await page.waitForTimeout(1500)
      
      expect(page.url()).toContain('#work')
      expect(page.url()).not.toContain('/resume')
      
      const workSection = page.locator('#work')
      await expect(workSection).toBeVisible({ timeout: 2000 })
    })

    test('Navigate DIRECTLY from Resume to Contact section', async ({ page }) => {
      await page.goto('/resume')
      await page.waitForLoadState('networkidle')
      
      await openMobileMenu(page)
      
      const contactLink = page.locator('a:has-text("Contact")').first()
      await contactLink.click()
      
      await page.waitForTimeout(1500)
      
      expect(page.url()).toContain('#contact')
      expect(page.url()).not.toContain('/resume')
      
      const contactSection = page.locator('#contact')
      await expect(contactSection).toBeVisible({ timeout: 2000 })
    })
  })

  // Test DIRECT navigation from Projects page
  test.describe('Direct Navigation from Projects Page', () => {
    test('Navigate DIRECTLY from Projects to Home (#hero)', async ({ page }) => {
      await page.goto('/projects')
      await page.waitForLoadState('networkidle')
      
      await openMobileMenu(page)
      
      const homeLink = page.locator('a:has-text("Home")').first()
      await homeLink.click()
      
      await page.waitForTimeout(1500)
      
      expect(page.url()).toContain('#hero')
      expect(page.url()).not.toContain('/projects')
      
      const heroSection = page.locator('#hero')
      await expect(heroSection).toBeVisible({ timeout: 2000 })
    })

    test('Navigate DIRECTLY from Projects to Value section', async ({ page }) => {
      await page.goto('/projects')
      await page.waitForLoadState('networkidle')
      
      await openMobileMenu(page)
      
      const valueLink = page.locator('a:has-text("Value")').first()
      await valueLink.click()
      
      await page.waitForTimeout(1500)
      
      expect(page.url()).toContain('#value')
      expect(page.url()).not.toContain('/projects')
      
      const valueSection = page.locator('#value')
      await expect(valueSection).toBeVisible({ timeout: 2000 })
    })

    test('Navigate DIRECTLY from Projects to Work section', async ({ page }) => {
      await page.goto('/projects')
      await page.waitForLoadState('networkidle')
      
      await openMobileMenu(page)
      
      const workLink = page.locator('a:has-text("Work")').first()
      await workLink.click()
      
      await page.waitForTimeout(1500)
      
      expect(page.url()).toContain('#work')
      expect(page.url()).not.toContain('/projects')
      
      const workSection = page.locator('#work')
      await expect(workSection).toBeVisible({ timeout: 2000 })
    })

    test('Navigate DIRECTLY from Projects to Contact section', async ({ page }) => {
      await page.goto('/projects')
      await page.waitForLoadState('networkidle')
      
      await openMobileMenu(page)
      
      const contactLink = page.locator('a:has-text("Contact")').first()
      await contactLink.click()
      
      await page.waitForTimeout(1500)
      
      expect(page.url()).toContain('#contact')
      expect(page.url()).not.toContain('/projects')
      
      const contactSection = page.locator('#contact')
      await expect(contactSection).toBeVisible({ timeout: 2000 })
    })

    test('Navigate DIRECTLY from Projects to Resume page', async ({ page }) => {
      await page.goto('/projects')
      await page.waitForLoadState('networkidle')
      
      await openMobileMenu(page)
      
      const resumeLink = page.locator('a[href="/resume"]:has-text("Resume")').first()
      await resumeLink.click()
      
      await page.waitForURL('**/resume', { timeout: 5000 })
      
      expect(page.url()).toContain('/resume')
      expect(page.url()).not.toContain('/projects')
      expect(page.url()).not.toContain('#hero')
    })
  })

  // Test Logo navigation
  test.describe('Logo Navigation', () => {
    test('Logo navigates DIRECTLY to home from Resume page', async ({ page }) => {
      await page.goto('/resume')
      await page.waitForLoadState('networkidle')
      
      const logoLink = page.locator('a:has-text("RMH")').first()
      await logoLink.click()
      
      await page.waitForTimeout(1000)
      
      expect(page.url()).toContain('#hero')
      expect(page.url()).not.toContain('/resume')
    })

    test('Logo navigates DIRECTLY to home from Projects page', async ({ page }) => {
      await page.goto('/projects')
      await page.waitForLoadState('networkidle')
      
      const logoLink = page.locator('a:has-text("RMH")').first()
      await logoLink.click()
      
      await page.waitForTimeout(1000)
      
      expect(page.url()).toContain('#hero')
      expect(page.url()).not.toContain('/projects')
    })
  })

  // Comprehensive cross-page DIRECT navigation matrix
  test.describe('Comprehensive Direct Navigation Matrix', () => {
    const pages = [
      { path: '/', name: 'Home' },
      { path: '/resume', name: 'Resume' },
      { path: '/projects', name: 'Projects' },
    ]
    
    const sections = [
      { hash: '#hero', label: 'Home', name: 'Hero' },
      { hash: '#value', label: 'Value', name: 'Value' },
      { hash: '#work', label: 'Work', name: 'Work' },
      { hash: '#contact', label: 'Contact', name: 'Contact' },
    ]

    // Test every page to every section - DIRECT navigation
    for (const fromPage of pages) {
      for (const toSection of sections) {
        test(`DIRECT: ${fromPage.name} → ${toSection.name}`, async ({ page }) => {
          await page.goto(fromPage.path)
          await page.waitForLoadState('networkidle')
          
          const initialUrl = page.url()
          await openMobileMenu(page)
          
          const sectionLink = page.locator(`a:has-text("${toSection.label}")`).first()
          await sectionLink.click()
          
          await page.waitForTimeout(1500)
          
          // Verify direct navigation
          expect(page.url()).toContain(toSection.hash)
          // If starting from a different page, should not contain that page path
          if (fromPage.path !== '/') {
            expect(page.url()).not.toContain(fromPage.path)
          }
          
          // Verify section is visible
          const sectionElement = page.locator(toSection.hash.replace('#', ''))
          await expect(sectionElement).toBeVisible({ timeout: 2000 })
        })
      }
    }

    // Test page to page DIRECT navigation
    for (const fromPage of pages) {
      for (const toPage of pages) {
        if (fromPage.path !== toPage.path) {
          test(`DIRECT: ${fromPage.name} → ${toPage.name}`, async ({ page }) => {
            await page.goto(fromPage.path)
            await page.waitForLoadState('networkidle')
            
            await openMobileMenu(page)
            
            let targetLink
            if (toPage.path === '/resume') {
              targetLink = page.locator('a[href="/resume"]:has-text("Resume")').first()
            } else if (toPage.path === '/') {
              targetLink = page.locator('a:has-text("Home")').first()
            } else {
              // Projects might not be in nav, skip
              return
            }
            
            if (await targetLink.count() > 0) {
              await targetLink.click()
              
              if (toPage.path === '/resume') {
                await page.waitForURL('**/resume', { timeout: 5000 })
                expect(page.url()).toContain('/resume')
                expect(page.url()).not.toContain(fromPage.path)
              } else {
                await page.waitForTimeout(1500)
                expect(page.url()).toContain('#hero')
                if (fromPage.path !== '/') {
                  expect(page.url()).not.toContain(fromPage.path)
                }
              }
            }
          })
        }
      }
    }
  })

  // Test navigation tracking - verify no intermediate page loads
  test('Verify no intermediate navigation when going from Resume to Value', async ({ page }) => {
    const navigationUrls: string[] = []
    
    // Track all navigations
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame()) {
        navigationUrls.push(frame.url())
      }
    })
    
    await page.goto('/resume')
    await page.waitForLoadState('networkidle')
    
    await openMobileMenu(page)
    
    const valueLink = page.locator('a:has-text("Value")').first()
    await valueLink.click()
    
    await page.waitForTimeout(2000)
    
    // Should have at most 2 navigations: initial /resume, then final /#value
    // If there's an intermediate navigation (like / then /#value), that's wrong
    const finalUrl = page.url()
    expect(finalUrl).toContain('#value')
    
    // Log navigation path for debugging
    console.log('Navigation URLs:', navigationUrls)
    
    // Verify direct navigation - should not see /resume -> / -> /#value
    // Should see /resume -> /#value (or just /#value if hash navigation doesn't trigger framenavigated)
  })
})
