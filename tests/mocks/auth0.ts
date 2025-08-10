/**
 * Auth0 Mocks for Testing
 * Provides comprehensive mocks for Auth0 SDK and related functionality
 */
import { vi, type MockedFunction } from 'vitest'
import type { User } from '@auth0/auth0-spa-js'
import type { User as AppUser, AuthState } from '@/auth/types'

// Mock Auth0 User Data
export const mockAuth0User: User = {
  sub: 'auth0|test123456789',
  name: 'Test User',
  given_name: 'Test',
  family_name: 'User',
  nickname: 'testuser',
  email: 'test@vana.app',
  email_verified: true,
  picture: 'https://example.com/avatar.jpg',
  updated_at: '2024-01-01T00:00:00.000Z',
}

// Mock App User with metadata
export const mockAppUser: AppUser = {
  ...mockAuth0User,
  'https://vana.app/roles': ['user'],
  'https://vana.app/permissions': ['read:calendar', 'write:calendar', 'read:tasks', 'write:tasks'],
  'https://vana.app/user_metadata': {
    timezone: 'UTC',
    calendar_preferences: {
      default_view: 'week',
      start_hour: 9,
      end_hour: 17,
      work_days: [1, 2, 3, 4, 5],
    },
    notification_preferences: {
      email_notifications: true,
      push_notifications: true,
      reminder_minutes: [15, 60],
    },
  },
}

// Mock Admin User
export const mockAdminUser: AppUser = {
  ...mockAuth0User,
  sub: 'auth0|admin123456789',
  name: 'Admin User',
  email: 'admin@vana.app',
  'https://vana.app/roles': ['admin'],
  'https://vana.app/permissions': [
    'read:calendar',
    'write:calendar',
    'delete:calendar',
    'read:tasks',
    'write:tasks',
    'delete:tasks',
    'admin:users',
    'admin:system',
  ],
  'https://vana.app/user_metadata': {
    timezone: 'UTC',
    calendar_preferences: {
      default_view: 'month',
      start_hour: 8,
      end_hour: 18,
      work_days: [1, 2, 3, 4, 5],
    },
  },
}

// Mock Premium User
export const mockPremiumUser: AppUser = {
  ...mockAuth0User,
  sub: 'auth0|premium123456789',
  name: 'Premium User',
  email: 'premium@vana.app',
  'https://vana.app/roles': ['premium'],
  'https://vana.app/permissions': ['read:calendar', 'write:calendar', 'read:tasks', 'write:tasks'],
}

// Mock Access Token
export const mockAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0MTIzNDU2Nzg5IiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.mock-token'

// Mock Auth0 Client
export const createMockAuth0Client = (
  options: {
    isAuthenticated?: boolean
    user?: User | null
    isLoading?: boolean
    error?: Error | null
    shouldThrow?: boolean
    tokenResponse?: string
  } = {}
) => {
  const {
    isAuthenticated = false,
    user = null,
    isLoading = false,
    error = null,
    shouldThrow = false,
    tokenResponse = mockAccessToken,
  } = options

  const mockClient = {
    // Reactive properties (refs)
    isLoading: { value: isLoading },
    isAuthenticated: { value: isAuthenticated },
    user: { value: user },
    error: { value: error },

    // Methods
    loginWithRedirect: vi.fn().mockImplementation(async (opts?: any) => {
      if (shouldThrow) {
        throw new Error('Login failed')
      }
      // Simulate redirect - in real app this wouldn't return
      return Promise.resolve()
    }),

    logout: vi.fn().mockImplementation(async (opts?: any) => {
      if (shouldThrow) {
        throw new Error('Logout failed')
      }
      return Promise.resolve()
    }),

    getAccessTokenSilently: vi.fn().mockImplementation(async (opts?: any) => {
      if (shouldThrow) {
        throw new Error('Token retrieval failed')
      }
      if (!isAuthenticated) {
        throw new Error('User not authenticated')
      }
      return Promise.resolve(tokenResponse)
    }),

    handleRedirectCallback: vi.fn().mockImplementation(async () => {
      if (shouldThrow) {
        throw new Error('Callback handling failed')
      }
      return Promise.resolve({
        appState: { targetUrl: '/' },
      })
    }),

    checkSession: vi.fn().mockImplementation(async () => {
      if (shouldThrow) {
        throw new Error('Session check failed')
      }
      return Promise.resolve()
    }),

    getUser: vi.fn().mockImplementation(async () => {
      if (shouldThrow) {
        throw new Error('Get user failed')
      }
      return Promise.resolve(user)
    }),

    getIdTokenClaims: vi.fn().mockImplementation(async () => {
      if (shouldThrow) {
        throw new Error('Get ID token failed')
      }
      return Promise.resolve({
        sub: user?.sub,
        aud: 'test-audience',
        exp: Date.now() / 1000 + 3600,
        iat: Date.now() / 1000,
        iss: 'https://test.auth0.com/',
      })
    }),
  }

  return mockClient
}

// Mock Auth State
export const createMockAuthState = (overrides: Partial<AuthState> = {}): AuthState => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
  ...overrides,
})

// Mock Local Storage
export const createMockLocalStorage = () => {
  const storage = new Map<string, string>()

  return {
    getItem: vi.fn((key: string) => storage.get(key) || null),
    setItem: vi.fn((key: string, value: string) => storage.set(key, value)),
    removeItem: vi.fn((key: string) => storage.delete(key)),
    clear: vi.fn(() => storage.clear()),
    length: 0,
    key: vi.fn(() => null),
  }
}

// Mock Window Location
export const createMockLocation = (overrides: Partial<Location> = {}) => ({
  href: 'http://localhost:5173',
  protocol: 'http:',
  host: 'localhost:5173',
  hostname: 'localhost',
  port: '5173',
  origin: 'http://localhost:5173',
  pathname: '/',
  search: '',
  hash: '',
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
  ...overrides,
})

// Mock Environment Variables
export const mockEnvVars = {
  VITE_AUTH0_DOMAIN: 'test.auth0.com',
  VITE_AUTH0_CLIENT_ID: 'test-client-id',
  VITE_AUTH0_AUDIENCE: 'https://api.vana.app',
  VITE_APP_URL: 'http://localhost:5173',
}

// Mock Errors
export const createAuthError = (message: string, code?: string) => {
  const error = new Error(message)
  if (code) {
    ;(error as any).code = code
  }
  return error
}

// Common test scenarios
export const authTestScenarios = {
  unauthenticated: {
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null,
  },
  authenticatedUser: {
    isAuthenticated: true,
    user: mockAppUser,
    isLoading: false,
    error: null,
  },
  authenticatedAdmin: {
    isAuthenticated: true,
    user: mockAdminUser,
    isLoading: false,
    error: null,
  },
  authenticatedPremium: {
    isAuthenticated: true,
    user: mockPremiumUser,
    isLoading: false,
    error: null,
  },
  loading: {
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  },
  loginError: {
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: createAuthError('Login failed'),
  },
  tokenError: {
    isAuthenticated: true,
    user: mockAppUser,
    isLoading: false,
    error: createAuthError('Token refresh failed'),
  },
}

// Mock Router
export const createMockRouter = () => ({
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  go: vi.fn(),
  currentRoute: { value: { path: '/', name: 'home', params: {}, query: {} } },
  beforeEach: vi.fn(),
  afterEach: vi.fn(),
})

// Mock Apollo Client
export const createMockApolloClient = () => ({
  query: vi.fn(),
  mutate: vi.fn(),
  subscribe: vi.fn(),
  watchQuery: vi.fn(),
  readQuery: vi.fn(),
  writeQuery: vi.fn(),
  resetStore: vi.fn(),
  clearStore: vi.fn(),
  cache: {
    evict: vi.fn(),
    gc: vi.fn(),
    reset: vi.fn(),
  },
  link: {
    request: vi.fn(),
  },
})

// Test Utilities
export const waitForAuthState = (
  client: any,
  expectedState: 'authenticated' | 'unauthenticated'
) => {
  return new Promise<void>(resolve => {
    const checkState = () => {
      const isAuth = client.isAuthenticated.value
      if (
        (expectedState === 'authenticated' && isAuth) ||
        (expectedState === 'unauthenticated' && !isAuth)
      ) {
        resolve()
      } else {
        setTimeout(checkState, 10)
      }
    }
    checkState()
  })
}

// Mock Console methods for testing
export const mockConsole = () => ({
  log: vi.spyOn(console, 'log').mockImplementation(() => {}),
  error: vi.spyOn(console, 'error').mockImplementation(() => {}),
  warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
  info: vi.spyOn(console, 'info').mockImplementation(() => {}),
})

// Cleanup function
export const cleanupAuthMocks = () => {
  vi.clearAllMocks()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
}
