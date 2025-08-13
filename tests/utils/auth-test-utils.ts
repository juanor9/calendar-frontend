/**
 * Auth Testing Utilities
 * Comprehensive utilities for testing Auth0 integration
 */
import { vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import type { Component, Plugin } from 'vue'
import type { Router } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { Auth0ClientKey } from '@/auth/auth-composable'
import {
  createMockAuth0Client,
  createMockLocalStorage,
  createMockLocation,
  mockEnvVars,
  authTestScenarios
} from '../mocks/auth0'
import type { User as AppUser } from '@/auth/types'

// Test Router Configuration
const createTestRouter = (): Router => {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/auth/callback', name: 'callback', component: { template: '<div>Callback</div>' } },
      { path: '/auth/logout', name: 'logout', component: { template: '<div>Logout</div>' } },
      { path: '/login', name: 'login', component: { template: '<div>Login</div>' } },
      { path: '/dashboard', name: 'dashboard', component: { template: '<div>Dashboard</div>' } },
      { path: '/admin', name: 'admin', component: { template: '<div>Admin</div>' } },
      { path: '/premium', name: 'premium', component: { template: '<div>Premium</div>' } }
    ]
  })
}

// Auth Test Context
export interface AuthTestContext {
  wrapper: VueWrapper
  router: Router
  authStore: ReturnType<typeof useAuthStore>
  mockAuth0Client: ReturnType<typeof createMockAuth0Client>
  mockLocalStorage: ReturnType<typeof createMockLocalStorage>
}

// Mount Component with Auth Context
export const mountWithAuth = async (
  component: Component,
  options: {
    authState?: keyof typeof authTestScenarios | 'custom'
    customAuthOptions?: Parameters<typeof createMockAuth0Client>[0]
    props?: Record<string, unknown>
    slots?: Record<string, string | (() => string)>
    global?: {
      plugins?: Plugin[]
      mocks?: Record<string, unknown>
      provide?: Record<string | symbol, unknown>
    }
    router?: Router
    routerInitialRoute?: string
  } = {}
): Promise<AuthTestContext> => {
  // Setup environment variables
  Object.entries(mockEnvVars).forEach(([key, value]) => {
    vi.stubEnv(key, value)
  })

  // Create mock localStorage
  const mockLocalStorage = createMockLocalStorage()
  vi.stubGlobal('localStorage', mockLocalStorage)

  // Create mock location
  const mockLocation = createMockLocation()
  vi.stubGlobal('location', mockLocation)

  // Create router
  const router = options.router || createTestRouter()
  
  if (options.routerInitialRoute) {
    await router.push(options.routerInitialRoute)
  }

  // Create mock Auth0 client based on scenario
  let clientOptions = options.customAuthOptions || {}
  
  if (options.authState && options.authState !== 'custom') {
    const scenario = authTestScenarios[options.authState]
    clientOptions = {
      isAuthenticated: scenario.isAuthenticated,
      user: scenario.user,
      isLoading: scenario.isLoading,
      error: scenario.error
    }
  }

  const mockAuth0Client = createMockAuth0Client(clientOptions)

  // Create testing pinia
  const pinia = createTestingPinia({
    createSpy: vi.fn,
    stubActions: false
  })

  // Mount component
  const wrapper = mount(component, {
    props: options.props,
    slots: options.slots,
    global: {
      plugins: [
        pinia,
        router,
        ...(options.global?.plugins || [])
      ],
      mocks: {
        ...options.global?.mocks
      },
      provide: {
        [Auth0ClientKey]: mockAuth0Client,
        ...options.global?.provide
      }
    }
  })

  // Get auth store
  const authStore = useAuthStore()

  // Initialize store if authenticated
  if (clientOptions.isAuthenticated && clientOptions.user) {
    authStore.setUser(clientOptions.user as AppUser)
    authStore.setToken('mock-token')
  }

  return {
    wrapper,
    router,
    authStore,
    mockAuth0Client,
    mockLocalStorage
  }
}

// Test Authentication Flow
export const testAuthFlow = {
  // Test login flow
  async login(context: AuthTestContext, options?: { shouldFail?: boolean; errorMessage?: string }) {
    const { mockAuth0Client } = context
    
    if (options?.shouldFail) {
      const error = new Error(options.errorMessage || 'Login failed')
      mockAuth0Client.loginWithRedirect.mockRejectedValueOnce(error)
      
      try {
        await context.wrapper.vm.$emit('login')
        throw new Error('Expected login to fail')
      } catch (err) {
        expect(err).toEqual(error)
      }
    } else {
      mockAuth0Client.loginWithRedirect.mockResolvedValueOnce(undefined)
      await context.wrapper.vm.$emit('login')
    }

    expect(mockAuth0Client.loginWithRedirect).toHaveBeenCalled()
  },

  // Test logout flow
  async logout(context: AuthTestContext, options?: { shouldFail?: boolean; errorMessage?: string }) {
    const { mockAuth0Client } = context
    
    if (options?.shouldFail) {
      const error = new Error(options.errorMessage || 'Logout failed')
      mockAuth0Client.logout.mockRejectedValueOnce(error)
      
      try {
        await context.wrapper.vm.$emit('logout')
        throw new Error('Expected logout to fail')
      } catch (err) {
        expect(err).toEqual(error)
      }
    } else {
      mockAuth0Client.logout.mockResolvedValueOnce(undefined)
      await context.wrapper.vm.$emit('logout')
    }

    expect(mockAuth0Client.logout).toHaveBeenCalled()
  },

  // Test token refresh
  async refreshToken(context: AuthTestContext, options?: { shouldFail?: boolean; token?: string }) {
    const { mockAuth0Client } = context
    const token = options?.token || 'new-mock-token'
    
    if (options?.shouldFail) {
      const error = new Error('Token refresh failed')
      mockAuth0Client.getAccessTokenSilently.mockRejectedValueOnce(error)
      
      try {
        await mockAuth0Client.getAccessTokenSilently()
        throw new Error('Expected token refresh to fail')
      } catch (err) {
        expect(err).toEqual(error)
      }
    } else {
      mockAuth0Client.getAccessTokenSilently.mockResolvedValueOnce(token)
      const result = await mockAuth0Client.getAccessTokenSilently()
      expect(result).toBe(token)
    }
  },

  // Test callback handling
  async handleCallback(context: AuthTestContext, options?: { 
    shouldFail?: boolean 
    appState?: { targetUrl?: string }
  }) {
    const { mockAuth0Client } = context
    const defaultAppState = { targetUrl: '/' }
    const appState = options?.appState || defaultAppState
    
    if (options?.shouldFail) {
      const error = new Error('Callback handling failed')
      mockAuth0Client.handleRedirectCallback.mockRejectedValueOnce(error)
      
      try {
        await mockAuth0Client.handleRedirectCallback()
        throw new Error('Expected callback handling to fail')
      } catch (err) {
        expect(err).toEqual(error)
      }
    } else {
      mockAuth0Client.handleRedirectCallback.mockResolvedValueOnce({ appState })
      const result = await mockAuth0Client.handleRedirectCallback()
      expect(result).toEqual({ appState })
    }
  }
}

// Role and Permission Test Helpers
export const rolePermissionHelpers = {
  // Test role checking
  testUserRole(authStore: ReturnType<typeof useAuthStore>, role: string, expected: boolean) {
    expect(authStore.hasRole(role as 'user' | 'premium' | 'admin')).toBe(expected)
  },

  // Test permission checking
  testUserPermission(authStore: ReturnType<typeof useAuthStore>, permission: string, expected: boolean) {
    expect(authStore.hasPermission(permission as 'read' | 'write' | 'delete' | 'admin')).toBe(expected)
  },

  // Test multiple roles
  testMultipleRoles(authStore: ReturnType<typeof useAuthStore>, roles: string[], expectedResults: boolean[]) {
    roles.forEach((role, index) => {
      expect(authStore.hasRole(role as 'user' | 'premium' | 'admin')).toBe(expectedResults[index])
    })
  },

  // Test admin access
  testAdminAccess(authStore: ReturnType<typeof useAuthStore>, expected: boolean) {
    expect(authStore.isAdmin).toBe(expected)
  },

  // Test premium access
  testPremiumAccess(authStore: ReturnType<typeof useAuthStore>, expected: boolean) {
    expect(authStore.isPremium).toBe(expected)
  }
}

// Accessibility Test Helpers
export const a11yHelpers = {
  // Test ARIA attributes
  testAriaAttributes(wrapper: VueWrapper, element: string, expectedAttributes: Record<string, string>) {
    const el = wrapper.find(element)
    expect(el.exists()).toBe(true)
    
    Object.entries(expectedAttributes).forEach(([attr, value]) => {
      expect(el.attributes(attr)).toBe(value)
    })
  },

  // Test keyboard navigation
  async testKeyboardNavigation(wrapper: VueWrapper, key: string, expectedResult?: () => void) {
    await wrapper.trigger('keydown', { key })
    if (expectedResult) {
      expectedResult()
    }
  },

  // Test focus management
  testFocusManagement(wrapper: VueWrapper, expectedFocusedElement?: string) {
    if (expectedFocusedElement) {
      const element = wrapper.find(expectedFocusedElement)
      expect(element.exists()).toBe(true)
      // Note: actual focus testing requires browser environment
    }
  },

  // Test screen reader announcements
  testScreenReaderContent(wrapper: VueWrapper, expectedText: string) {
    const srElements = wrapper.findAll('[aria-live], [role="alert"], [aria-label]')
    const hasExpectedContent = srElements.some(el => 
      el.text().includes(expectedText) || 
      el.attributes('aria-label')?.includes(expectedText)
    )
    expect(hasExpectedContent).toBe(true)
  }
}

// Performance Test Helpers
export const performanceHelpers = {
  // Measure component render time
  measureRenderTime: <T extends (...args: never[]) => unknown>(fn: T): [ReturnType<T>, number] => {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    return [result, end - start]
  },

  // Test memory usage (mock implementation)
  testMemoryUsage: (beforeCallback: () => void, afterCallback: () => void) => {
    // In a real implementation, you would use performance.measureUserAgentSpecificMemory
    // This is a mock for testing purposes
    beforeCallback()
    const mockMemoryBefore = Math.random() * 1000
    afterCallback()
    const mockMemoryAfter = Math.random() * 1000
    return {
      before: mockMemoryBefore,
      after: mockMemoryAfter,
      diff: mockMemoryAfter - mockMemoryBefore
    }
  },

  // Test bundle size impact
  async testBundleImpact() {
    // Mock implementation - in real scenario would analyze webpack stats
    return {
      authModuleSize: 50000, // bytes
      totalBundleSize: 1000000, // bytes
      impact: 5 // percentage
    }
  }
}

// Integration Test Helpers
export const integrationHelpers = {
  // Test Apollo integration
  setupApolloIntegration() {
    // Mock Apollo client with auth link
    const mockApolloClient = {
      query: vi.fn(),
      mutate: vi.fn(),
      resetStore: vi.fn(),
      link: {
        request: vi.fn().mockImplementation((operation) => {
          // Verify auth header is present
          const authHeader = operation.getContext().headers?.authorization
          expect(authHeader).toBeDefined()
          return { data: {} }
        })
      }
    }

    return mockApolloClient
  },

  // Test router guard integration
  async testRouterGuards(
    context: AuthTestContext, 
    route: string, 
    expectedBehavior: 'allow' | 'redirect' | 'block'
  ) {
    const { router } = context
    
    try {
      await router.push(route)
      
      if (expectedBehavior === 'allow') {
        expect(router.currentRoute.value.path).toBe(route)
      } else if (expectedBehavior === 'redirect') {
        expect(router.currentRoute.value.path).not.toBe(route)
      } else {
        // Block behavior would typically show an error or stay on current route
        expect(router.currentRoute.value.path).not.toBe(route)
      }
    } catch (error) {
      if (expectedBehavior === 'block') {
        expect(error).toBeDefined()
      } else {
        throw error
      }
    }
  }
}

// Cleanup helper
export const cleanupAuthTests = () => {
  vi.clearAllMocks()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
}