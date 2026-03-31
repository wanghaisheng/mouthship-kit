// Test setup file for Vitest
import { vi } from 'vitest'

// Mock Astro global
global.Astro = {
  url: new URL('http://localhost:4321'),
  redirect: vi.fn(),
}

// Mock fetch for API tests
global.fetch = vi.fn()

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock console methods for cleaner test output
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}
