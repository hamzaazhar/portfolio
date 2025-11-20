# Navigation Scroll Fix Test Suite

This test suite verifies that navigation between sections does NOT restart from the Hero section, which was the bug we fixed.

## Test Coverage

The test suite covers:

1. **Desktop Navigation** - Tests navigation via desktop navbar links
2. **Mobile Menu Navigation** - Tests navigation via mobile hamburger menu
3. **Hero CTAs** - Tests "See Case Studies" and "Discuss Your Environment" buttons
4. **Comprehensive Matrix** - Tests all section-to-section combinations
5. **Edge Cases** - Tests rapid navigation and middle-of-page scenarios

## Running the Tests

### Prerequisites

1. Ensure the development server is running (or it will start automatically)
2. Install Playwright if not already installed:
   ```bash
   npm install -D @playwright/test
   npx playwright install
   ```

### Run All Navigation Tests

```bash
npx playwright test navigation-scroll-fix
```

### Run Specific Test Suites

```bash
# Desktop navigation tests only
npx playwright test navigation-scroll-fix -g "Desktop"

# Mobile menu tests only
npx playwright test navigation-scroll-fix -g "Mobile Menu"

# Hero CTA tests only
npx playwright test navigation-scroll-fix -g "Hero CTAs"

# Comprehensive matrix test
npx playwright test navigation-scroll-fix -g "Comprehensive Matrix"
```

### Run with UI Mode (Interactive)

```bash
npx playwright test navigation-scroll-fix --ui
```

### Run in Debug Mode

```bash
npx playwright test navigation-scroll-fix --debug
```

## What the Tests Verify

Each test verifies:

1. **No Hero Jump**: When navigating from a section past Hero (like Contact or Work), the scroll position should NOT jump to Hero first
2. **Correct Destination**: The scroll should end at the correct target section
3. **Smooth Navigation**: Navigation should work smoothly without intermediate jumps

## Test Structure

- **Desktop Tests**: Test navigation using desktop navbar (1920x1080 viewport)
- **Mobile Tests**: Test navigation using mobile hamburger menu (375x667 viewport)
- **Hero CTA Tests**: Test the two CTA buttons in the hero section
- **Matrix Tests**: Test all combinations of section-to-section navigation
- **Edge Case Tests**: Test rapid navigation and edge scenarios

## Expected Results

All tests should pass, confirming that:
- ✅ Navigation from Contact → Work does NOT jump to Hero first
- ✅ Navigation from Work → Value does NOT jump to Hero first
- ✅ Navigation from Value → Contact does NOT jump to Hero first
- ✅ All other section-to-section navigation paths work correctly
- ✅ Hero CTAs navigate correctly to their target sections

## Troubleshooting

If tests fail:

1. **Check server is running**: Ensure `npm run dev` is running on port 3000
2. **Check viewport**: Some tests require specific viewport sizes
3. **Increase timeouts**: If tests are flaky, increase wait times in the test file
4. **Check console**: Look for JavaScript errors in the browser console

## Test Output

The tests will output:
- ✓ for passing tests
- ✗ for failing tests
- Console logs showing navigation paths tested in the comprehensive matrix

