// E2E tests for authentication flow
import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage before each test
    await page.context().clearCookies()
    await page.evaluate(() => localStorage.clear())
  })

  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Try to access homepage without authentication
    await page.goto('/')
    
    // Should redirect to login page
    await expect(page).toHaveURL('/login')
    await expect(page.locator('h1')).toContainText('Login to Mouthship Kit')
  })

  test('should display login page with all options', async ({ page }) => {
    await page.goto('/login')
    
    // Check page title
    await expect(page.locator('h1')).toContainText('Login to Mouthship Kit')
    
    // Check login options
    await expect(page.locator('a[href="/login/github"]')).toBeVisible()
    await expect(page.locator('a[href="/login/google"]')).toBeVisible()
    
    // Check demo login button
    await expect(page.locator('a[href="/?auth=success"]')).toBeVisible()
    await expect(page.locator('text=🎭 Simulate Login')).toBeVisible()
  })

  test('should handle demo login flow', async ({ page }) => {
    await page.goto('/login')
    
    // Click demo login button
    await page.click('a[href="/?auth=success"]')
    
    // Should redirect to homepage with auth success
    await expect(page).toHaveURL('/?auth=success')
    
    // Check for success message
    await expect(page.locator('text=Successfully signed in!')).toBeVisible()
    
    // Check user information display
    await expect(page.locator('text=Demo User')).toBeVisible()
    await expect(page.locator('text=demo@example.com')).toBeVisible()
    
    // Check logout button
    await expect(page.locator('button:has-text("Logout")')).toBeVisible()
  })

  test('should display user profile after authentication', async ({ page }) => {
    // Go to authenticated homepage
    await page.goto('/?auth=success')
    
    // Check user avatar with initials
    await expect(page.locator('.w-12.h-12.rounded-full')).toContainText('DU')
    
    // Check user details
    await expect(page.locator('.font-semibold')).toContainText('Demo User')
    await expect(page.locator('.text-gray-600')).toContainText('demo@example.com')
  })

  test('should handle logout functionality', async ({ page }) => {
    // Start authenticated
    await page.goto('/?auth=success')
    
    // Mock logout API response
    await page.route('/api/logout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Logged out successfully',
          redirect: '/login'
        })
      })
    })
    
    // Click logout button
    await page.click('button:has-text("Logout")')
    
    // Should redirect to login with logout message
    await expect(page).toHaveURL('/login?logout=true')
    await expect(page.locator('text=You have been successfully logged out')).toBeVisible()
  })

  test('should handle authentication errors', async ({ page }) => {
    await page.goto('/login?error=access_denied')
    
    // Should display error message
    await expect(page.locator('text=Authentication failed: access_denied')).toBeVisible()
    
    // Should still show login options
    await expect(page.locator('a[href="/login/github"]')).toBeVisible()
    await expect(page.locator('a[href="/login/google"]')).toBeVisible()
  })

  test('should handle OAuth callback pages', async ({ page }) => {
    // Test GitHub OAuth page
    await page.goto('/login/github')
    await expect(page.locator('h1')).toContainText('Signing in with GitHub')
    await expect(page.locator('text=Continue with GitHub')).toBeVisible()
    
    // Test Google OAuth page
    await page.goto('/login/google')
    await expect(page.locator('h1')).toContainText('Signing in with Google')
    await expect(page.locator('text=Continue with Google')).toBeVisible()
  })

  test('should handle OAuth callback processing', async ({ page }) => {
    // Mock OAuth callback
    await page.goto('/login/callback?provider=github&code=mock-code&state=mock-state')
    
    // Should show processing message
    await expect(page.locator('text=Processing authentication...')).toBeVisible()
    await expect(page.locator('.animate-spin')).toBeVisible()
  })

  test('should handle OAuth callback errors', async ({ page }) => {
    await page.goto('/login/callback?error=invalid_request')
    
    // Should redirect to login with error
    await expect(page).toHaveURL('/login?error=invalid_request')
    await expect(page.locator('text=Authentication failed: invalid_request')).toBeVisible()
  })
})

test.describe('Authenticated User Features', () => {
  test.beforeEach(async ({ page }) => {
    // Start authenticated for each test
    await page.goto('/?auth=success')
  })

  test('should display tRPC API response', async ({ page }) => {
    // Mock tRPC API response
    await page.route('/api/trpc/hello.protected', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: 'Hello from tRPC in Astro!',
            method: 'GET',
            source: 'astro-server',
            timestamp: new Date().toISOString()
          },
          error: null
        })
      })
    })
    
    // Reload page to trigger API call
    await page.reload()
    
    // Check API response display
    await expect(page.locator('text=tRPC API Response')).toBeVisible()
    await expect(page.locator('text=Hello from tRPC in Astro!')).toBeVisible()
    await expect(page.locator('text=Source: astro-server')).toBeVisible()
  })

  test('should handle theme switching', async ({ page }) => {
    // Check theme switcher is present
    await expect(page.locator('select')).toBeVisible()
    
    // Get initial theme
    const initialTheme = await page.locator('select').inputValue()
    expect(initialTheme).toBe('system')
    
    // Change theme to dark
    await page.selectOption('select', 'dark')
    
    // Check theme was changed
    const newTheme = await page.locator('select').inputValue()
    expect(newTheme).toBe('dark')
    
    // Check localStorage was updated
    const savedTheme = await page.evaluate(() => localStorage.getItem('theme'))
    expect(savedTheme).toBe('dark')
  })

  test('should handle toast notifications', async ({ page }) => {
    // Click show toast button
    await page.click('button:has-text("Show Toast")')
    
    // Check toast appears
    await expect(page.locator('.fixed.top-4.right-4')).toBeVisible()
    await expect(page.locator('text=Hello, World!')).toBeVisible()
    await expect(page.locator('text=This is a toast message')).toBeVisible()
    
    // Check close button
    await expect(page.locator('button[aria-label="Close"]')).toBeVisible()
    
    // Test manual close
    await page.click('button[aria-label="Close"]')
    await expect(page.locator('.fixed.top-4.right-4')).not.toBeVisible()
  })

  test('should handle file upload', async ({ page }) => {
    // Mock file upload API
    await page.route('/api/uploadthing', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              name: 'test.jpg',
              size: 1024,
              url: '/uploads/test.jpg',
              uploadedAt: new Date().toISOString()
            }
          },
          error: null
        })
      })
    })
    
    // Check upload component is present
    await expect(page.locator('text=Choose files to upload')).toBeVisible()
    await expect(page.locator('input[type="file"]')).toBeVisible()
    await expect(page.locator('button:has-text("Upload Files")')).toBeVisible()
    
    // Select a file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('test.jpg')
    
    // Click upload button
    await page.click('button:has-text("Upload Files")')
    
    // Check progress indicator appears
    await expect(page.locator('#upload-progress')).toBeVisible()
    await expect(page.locator('text=Uploading...')).toBeVisible()
    
    // Wait for upload completion
    await expect(page.locator('#upload-results')).toBeVisible()
    await expect(page.locator('text=test.jpg')).toBeVisible()
  })
})

test.describe('Error Pages', () => {
  test('should display error page correctly', async ({ page }) => {
    await page.goto('/error')
    
    await expect(page.locator('h1')).toContainText('Error 500')
    await expect(page.locator('text=An unexpected error occurred')).toBeVisible()
    await expect(page.locator('text=Go Home')).toBeVisible()
    await expect(page.locator('text=Go Back')).toBeVisible()
  })

  test('should display blocked page correctly', async ({ page }) => {
    await page.goto('/blocked')
    
    await expect(page.locator('h1')).toContainText('Access Blocked')
    await expect(page.locator('text=Your access has been temporarily blocked')).toBeVisible()
    await expect(page.locator('text=Rate Limit Exceeded')).toBeVisible()
    await expect(page.locator('text=Return to Home')).toBeVisible()
  })
})

test.describe('Responsive Design', () => {
  const devices = [
    { name: 'Desktop', width: 1200, height: 800 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 667 }
  ]

  devices.forEach(({ name, width, height }) => {
    test(`should display correctly on ${name}`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/?auth=success')
      
      // Check main layout is responsive
      await expect(page.locator('main')).toBeVisible()
      
      // Check user profile layout
      await expect(page.locator('.flex.items-center')).toBeVisible()
      
      // Check buttons are accessible
      await expect(page.locator('button:has-text("Logout")')).toBeVisible()
      await expect(page.locator('button:has-text("Show Toast")')).toBeVisible()
      
      // Check content fits viewport
      const bodyBox = await page.locator('body').boundingBox()
      expect(bodyBox?.width).toBeLessThanOrEqual(width)
    })
  })
})
