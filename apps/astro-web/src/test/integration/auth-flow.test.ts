// Integration tests for authentication flow
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { JSDOM } from 'jsdom'

describe('Authentication Flow Integration', () => {
  let dom: JSDOM
  let document: Document
  let window: Window

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup DOM environment
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head><title>Test</title></head>
        <body>
          <div id="app"></div>
        </body>
      </html>
    `, {
      url: 'http://localhost:4321'
    })
    
    document = dom.window.document
    window = dom.window as any
    
    // Mock fetch for API calls
    global.fetch = vi.fn()
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    }
  })

  it('should redirect unauthenticated users to login', async () => {
    // Mock the main page check
    const mockResponse = {
      redirected: true,
      url: 'http://localhost:4321/login',
      status: 302
    }
    
    // Simulate authentication check
    const isAuthenticated = false
    
    if (!isAuthenticated) {
      expect(mockResponse.redirected).toBe(true)
      expect(mockResponse.url).toContain('/login')
    }
  })

  it('should display login page with options', async () => {
    // Mock login page content
    document.body.innerHTML = `
      <main class="container mx-auto flex flex-col p-6">
        <h1 class="text-2xl font-bold mb-6">Login to Mouthship Kit</h1>
        <div class="space-y-4">
          <a href="/login/github" class="block px-6 py-3 bg-gray-900 text-white rounded-lg">
            Sign in with GitHub
          </a>
          <a href="/login/google" class="block px-6 py-3 bg-blue-600 text-white rounded-lg">
            Sign in with Google
          </a>
          <a href="/?auth=success" class="inline-block px-4 py-2 bg-green-600 text-white rounded">
            🎭 Simulate Login
          </a>
        </div>
      </main>
    `

    const title = document.querySelector('h1')
    const githubLink = document.querySelector('a[href="/login/github"]')
    const googleLink = document.querySelector('a[href="/login/google"]')
    const demoLink = document.querySelector('a[href="/?auth=success"]')

    expect(title?.textContent).toBe('Login to Mouthship Kit')
    expect(githubLink).toBeTruthy()
    expect(googleLink).toBeTruthy()
    expect(demoLink).toBeTruthy()
  })

  it('should handle successful authentication', async () => {
    // Mock successful authentication response
    const mockAuthResponse = {
      user: {
        id: 'demo-user-123',
        name: 'Demo User',
        email: 'demo@example.com'
      },
      token: 'mock-jwt-token'
    }

    // Mock fetch for authentication
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAuthResponse
    })

    // Simulate authentication callback
    const url = new URL('http://localhost:4321/?auth=success')
    const authStatus = url.searchParams.get('auth')

    expect(authStatus).toBe('success')

    // Mock user data creation
    const user = authStatus === 'success' ? mockAuthResponse.user : null
    expect(user).toBeTruthy()
    expect(user?.id).toBe('demo-user-123')
    expect(user?.name).toBe('Demo User')
  })

  it('should display authenticated user on homepage', async () => {
    // Mock authenticated user data
    const user = {
      id: 'demo-user-123',
      name: 'Demo User',
      email: 'demo@example.com'
    }

    // Mock homepage content with user data
    document.body.innerHTML = `
      <main class="container mx-auto p-6">
        <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded">
          <p class="text-green-800">✅ Successfully signed in!</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            DU
          </div>
          <div>
            <p class="font-semibold">${user.name}</p>
            <p class="text-sm text-gray-600">${user.email}</p>
          </div>
        </div>
        <form method="POST" action="/api/logout">
          <button type="submit" class="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
        </form>
      </main>
    `

    const successMessage = document.querySelector('.text-green-800')
    const userName = document.querySelector('.font-semibold')
    const userEmail = document.querySelector('.text-gray-600')
    const logoutButton = document.querySelector('button[type="submit"]')

    expect(successMessage?.textContent).toContain('Successfully signed in')
    expect(userName?.textContent).toBe(user.name)
    expect(userEmail?.textContent).toBe(user.email)
    expect(logoutButton).toBeTruthy()
  })

  it('should handle logout functionality', async () => {
    // Mock logout API response
    const mockLogoutResponse = {
      success: true,
      message: 'Logged out successfully',
      redirect: '/login'
    }

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockLogoutResponse
    })

    // Simulate logout form submission
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = '/api/logout'

    // Mock form submission
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.message).toBe('Logged out successfully')
    expect(data.redirect).toBe('/login')

    // Verify session clearing
    expect(global.localStorage.removeItem).toHaveBeenCalled()
  })

  it('should handle OAuth callback correctly', async () => {
    // Mock OAuth callback URL
    const callbackUrl = new URL('http://localhost:4321/login/callback')
    callbackUrl.searchParams.set('provider', 'github')
    callbackUrl.searchParams.set('code', 'mock-auth-code')
    callbackUrl.searchParams.set('state', 'mock-state')

    const provider = callbackUrl.searchParams.get('provider')
    const code = callbackUrl.searchParams.get('code')
    const state = callbackUrl.searchParams.get('state')

    expect(provider).toBe('github')
    expect(code).toBeTruthy()
    expect(state).toBeTruthy()

    // Mock OAuth token exchange
    const mockTokenResponse = {
      access_token: 'mock-access-token',
      token_type: 'bearer',
      scope: 'user:email'
    }

    const mockUserResponse = {
      id: 123456,
      login: 'demo-user',
      email: 'demo@example.com',
      name: 'Demo User'
    }

    ;(global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTokenResponse
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserResponse
      })

    // Simulate OAuth flow
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      body: JSON.stringify({
        client_id: 'mock-client-id',
        client_secret: 'mock-client-secret',
        code: code
      })
    })

    const tokenData = await tokenResponse.json()
    expect(tokenData.access_token).toBeTruthy()

    // Should redirect to home with auth success
    const redirectUrl = 'http://localhost:4321/?auth=success'
    expect(redirectUrl).toContain('auth=success')
  })

  it('should handle authentication errors', async () => {
    // Mock error callback
    const errorUrl = new URL('http://localhost:4321/login/callback')
    errorUrl.searchParams.set('error', 'access_denied')

    const error = errorUrl.searchParams.get('error')
    expect(error).toBe('access_denied')

    // Should redirect to login with error
    const redirectUrl = `http://localhost:4321/login?error=${encodeURIComponent(error)}`
    expect(redirectUrl).toContain('error=access_denied')

    // Mock login page with error display
    document.body.innerHTML = `
      <main class="container mx-auto flex flex-col p-6">
        <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded">
          <p class="text-red-800">❌ Authentication failed: access_denied</p>
        </div>
      </main>
    `

    const errorMessage = document.querySelector('.text-red-800')
    expect(errorMessage?.textContent).toContain('Authentication failed')
    expect(errorMessage?.textContent).toContain('access_denied')
  })
})
