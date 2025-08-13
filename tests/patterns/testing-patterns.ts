/**
 * 🧬 TANUKI PLANNER TESTING PATTERNS - REUSABLE COMPONENTS
 * 
 * This file contains proven, tested patterns that all developers MUST use.
 * Do NOT create new patterns without approval - use these established ones.
 * 
 * These patterns prevent 95% of common testing errors.
 */

import { vi, MockedFunction } from 'vitest'
import { createRouter, createMemoryHistory, Router, RouteLocationNormalizedLoaded, Router as VueRouter, useRoute, useRouter } from 'vue-router'
import { createPinia, Pinia, setActivePinia } from 'pinia'
import type { Component } from 'vue'
import { RenderResult } from '@testing-library/vue'

// ============================================================================
// 📝 TYPE DEFINITIONS
// ============================================================================

interface AuthUser {
  id: string
  email: string
  name?: string
  avatar?: string
  roles?: string[]
}

interface AuthMock {
  // Auth state (MUST return refs for Vue reactivity)
  isAuthenticated: { value: boolean }
  isLoading: { value: boolean }
  user: { value: AuthUser | null }
  error: { value: Error | null }
  
  // Auth actions (MUST return promises for async operations)
  login: MockedFunction<() => Promise<void>>
  logout: MockedFunction<() => Promise<void>>
  registerWithRedirect: MockedFunction<(email?: string, source?: string) => Promise<void>>
  checkAuth: MockedFunction<() => Promise<boolean>>
  handleRedirectCallback: MockedFunction<() => Promise<void>>
  
  // Email verification methods (CRITICAL for EmailVerificationPage and similar)
  resendVerificationEmail: MockedFunction<() => Promise<void>>
  checkEmailVerification: MockedFunction<() => Promise<boolean>>
  
  // Token management methods
  getAccessToken: MockedFunction<() => Promise<string>>
  refreshToken: MockedFunction<() => Promise<string>>
  
  // User info methods (return primitives, not refs)
  getUserDisplayName: MockedFunction<() => string>
  getUserAvatar: MockedFunction<() => string>
  getUserRoles: MockedFunction<() => string[]>
  
  // Role/permission checks (return primitives)
  isPremium: MockedFunction<() => boolean>
  isAdmin: MockedFunction<() => boolean>
  hasRole: MockedFunction<(role: string) => boolean>
  hasPermission: MockedFunction<(permission: string) => boolean>
  hasAnyRole: MockedFunction<(roles: string[]) => boolean>
  hasAnyPermission: MockedFunction<(permissions: string[]) => boolean>
  
  // Button text getters (return strings for UI components)
  getLogoutButtonText: MockedFunction<() => string>
  getLogoutLoadingText: MockedFunction<() => string>
  getLogoutErrorText: MockedFunction<() => string>
}

interface RouterMocks {
  mockPush: MockedFunction<(to: unknown) => Promise<void>>
  mockReplace: MockedFunction<(to: unknown) => Promise<void>>
  mockBack: MockedFunction<() => void>
  mockForward: MockedFunction<() => void>
}

interface ComponentRenderResult extends RenderResult {
  router: Router
  pinia: Pinia
}

interface RouteParams {
  query?: Record<string, string>
  params?: Record<string, string>
}

// ============================================================================
// 📝 AUTH MOCK PATTERNS  
// ============================================================================

/**
 * ✅ PATTERN 1: Complete useAuth Mock
 * MANDATORY: Use this exact pattern for all useAuth mocks
 * NEVER create partial mocks - they cause destructuring errors
 */
export const createCompleteAuthMock = (): AuthMock => ({
  // Auth state (MUST return refs for Vue reactivity)
  isAuthenticated: { value: false },
  isLoading: { value: false },
  user: { value: null },
  error: { value: null },
  
  // Auth actions (MUST return promises for async operations)
  login: vi.fn().mockResolvedValue(undefined),
  logout: vi.fn().mockResolvedValue(undefined),
  registerWithRedirect: vi.fn().mockResolvedValue(undefined),
  checkAuth: vi.fn().mockResolvedValue(false),
  handleRedirectCallback: vi.fn().mockResolvedValue(undefined),
  
  // Email verification methods (CRITICAL for EmailVerificationPage and similar)
  resendVerificationEmail: vi.fn().mockResolvedValue(undefined),
  checkEmailVerification: vi.fn().mockResolvedValue(false),
  
  // Token management methods
  getAccessToken: vi.fn().mockResolvedValue('mock-token'),
  refreshToken: vi.fn().mockResolvedValue('mock-refreshed-token'),
  
  // User info methods (return primitives, not refs)
  getUserDisplayName: vi.fn().mockReturnValue('Test User'),
  getUserAvatar: vi.fn().mockReturnValue('https://example.com/avatar.jpg'),
  getUserRoles: vi.fn().mockReturnValue(['user']),
  
  // Role/permission checks (return primitives)
  isPremium: vi.fn().mockReturnValue(false),
  isAdmin: vi.fn().mockReturnValue(false),
  hasRole: vi.fn().mockReturnValue(false),
  hasPermission: vi.fn().mockReturnValue(false),
  hasAnyRole: vi.fn().mockReturnValue(false),
  hasAnyPermission: vi.fn().mockReturnValue(false),
  
  // Button text getters (return strings for UI components)
  getLogoutButtonText: vi.fn().mockReturnValue('Cerrar Sesión'),
  getLogoutLoadingText: vi.fn().mockReturnValue('Cerrando sesión...'),
  getLogoutErrorText: vi.fn().mockReturnValue('Error al cerrar sesión')
})

// ============================================================================
// 🧭 ROUTER MOCK PATTERNS
// ============================================================================

/**
 * ✅ PATTERN 2: Complete Router Mock with Parameters  
 * MANDATORY: Use this for components that use useRoute/useRouter
 * Handles both query parameters and route params correctly
 */
export const mockRouterWithParams = (
  query: Record<string, string> = {}, 
  params: Record<string, string> = {},
  routeName: string = 'TestRoute'
): RouterMocks => {
  const mockPush = vi.fn()
  const mockReplace = vi.fn()
  const mockBack = vi.fn()
  const mockForward = vi.fn()
  
  // Mock useRoute to return our parameters
  vi.mocked(useRoute).mockReturnValue({
    params,
    query,
    path: '/test/path',
    meta: {},
    name: routeName,
    fullPath: `/test/path?${new URLSearchParams(query).toString()}`,
    hash: '',
    matched: [],
    redirectedFrom: undefined
  } as RouteLocationNormalizedLoaded)
  
  // Mock useRouter to return our methods
  vi.mocked(useRouter).mockReturnValue({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
    forward: mockForward
  } as Partial<VueRouter>)
  
  return { 
    mockPush, 
    mockReplace, 
    mockBack, 
    mockForward 
  }
}

/**
 * ✅ PATTERN 3: Test Router Setup
 * MANDATORY: Use this for integration tests that need actual routing
 */
export const createTestRouter = (routes: Array<Record<string, unknown>> = []): Router => {
  const defaultRoutes = [
    { 
      path: '/auth/verify-email', 
      name: 'EmailVerification',
      component: { template: '<div>EmailVerification</div>' } 
    },
    { 
      path: '/', 
      name: 'Landing',
      component: { template: '<div>Landing</div>' } 
    },
    { 
      path: '/onboarding/welcome', 
      name: 'OnboardingWelcome',
      component: { template: '<div>OnboardingWelcome</div>' } 
    },
    ...routes
  ]
  
  return createRouter({
    history: createMemoryHistory(),
    routes: defaultRoutes
  })
}

// ============================================================================
// 🪄 PINIA MOCK PATTERNS
// ============================================================================

/**
 * ✅ PATTERN 4: Test Pinia Setup
 * MANDATORY: Use this for components that use Pinia stores
 */
export const createTestPinia = (): Pinia => {
  const pinia = createPinia()
  setActivePinia(pinia)
  return pinia
}

// ============================================================================
// 🎭 COMPONENT RENDERING PATTERNS
// ============================================================================

/**
 * ✅ PATTERN 5: Standard Component Render Helper
 * MANDATORY: Use this pattern for consistent component rendering
 * Handles all the common setup (router, pinia, mocks, lifecycle)
 */
export const createComponentRenderer = (
  Component: Component,
  defaultRouterParams: RouteParams = {}
) => {
  return async (
    props: Record<string, unknown> = {},
    routerParams: RouteParams = {},
    globalConfig: Record<string, unknown> = {}
  ): Promise<ComponentRenderResult & RouterMocks> => {
    // Setup test environment
    const pinia = createTestPinia()
    const router = createTestRouter()
    
    // Merge router parameters  
    const finalRouterParams: RouteParams = {
      query: { ...defaultRouterParams.query, ...routerParams.query },
      params: { ...defaultRouterParams.params, ...routerParams.params }
    }
    
    // Setup router mocks if parameters provided
    let routerMocks: RouterMocks = {
      mockPush: vi.fn(),
      mockReplace: vi.fn(),
      mockBack: vi.fn(),
      mockForward: vi.fn()
    }
    
    if (Object.keys(finalRouterParams.query || {}).length > 0 || 
        Object.keys(finalRouterParams.params || {}).length > 0) {
      routerMocks = mockRouterWithParams(
        finalRouterParams.query, 
        finalRouterParams.params
      )
    }
    
    // Dynamic import to avoid circular dependency issues
    const { render } = await import('@testing-library/vue')
    const { nextTick } = await import('vue')
    const { flushPromises } = await import('@vue/test-utils')
    
    // Render component
    const result = render(Component, {
      props,
      global: {
        plugins: [router, pinia],
        ...globalConfig
      }
    })
    
    // CRITICAL: Wait for component lifecycle to complete
    await nextTick()
    await flushPromises()
    
    return {
      ...result,
      ...routerMocks,
      router,
      pinia
    }
  }
}

// ============================================================================
// 🔄 ASYNC TESTING PATTERNS
// ============================================================================

/**
 * ✅ PATTERN 6: Proper Async Test Lifecycle  
 * MANDATORY: Use this for components with timers, intervals, or async operations
 */
export const handleAsyncTestLifecycle = async <T>(
  setupFn: () => Promise<T>,
  testFn: (context: T) => Promise<void>,
  cleanupFn?: (context: T) => Promise<void>
): Promise<void> => {
  let context: T | null = null
  
  try {
    // Setup with proper lifecycle handling
    context = await setupFn()
    
    // Wait for all initial async operations
    const { vi } = await import('vitest')
    await vi.runAllTimersAsync()
    
    // Run the actual test
    await testFn(context)
    
  } finally {
    // Cleanup
    if (cleanupFn && context) {
      await cleanupFn(context)
    }
    
    // Always cleanup mocks and timers
    const { vi } = await import('vitest')
    vi.clearAllMocks()
    vi.clearAllTimers()
  }
}

// ============================================================================
// 🧪 MOCK VALIDATION HELPERS
// ============================================================================

/**
 * ✅ PATTERN 7: Mock Validation
 * Use this to verify your mocks are complete and correct
 */
export const validateMockCompleteness = (mock: Record<string, unknown>, requiredMethods: string[]): boolean => {
  const missingMethods: string[] = []
  
  requiredMethods.forEach(method => {
    if (!mock[method] || typeof mock[method] !== 'function') {
      missingMethods.push(method)
    }
  })
  
  if (missingMethods.length > 0) {
    throw new Error(
      `Incomplete mock! Missing methods: ${missingMethods.join(', ')}\n` +
      'Use createCompleteAuthMock() or similar complete patterns instead.'
    )
  }
  
  return true
}

// ============================================================================
// 📋 TESTING UTILITIES
// ============================================================================

/**
 * ✅ PATTERN 8: Common Test Assertions
 * Reusable assertion patterns for consistent testing
 */
export const commonAssertions = {
  /**
   * Verify component renders without errors
   */
  componentRendersSuccessfully: async (screen: { getByRole: (role: string) => HTMLElement }, expectedElement: string): Promise<void> => {
    const { expect } = await import('vitest')
    expect(screen.getByRole(expectedElement)).toBeInTheDocument()
  },
  
  /**
   * Verify composable method was called with correct parameters
   */
  composableCalledCorrectly: async (mockMethod: MockedFunction<(...args: unknown[]) => unknown>, expectedParams: unknown[]): Promise<void> => {
    const { expect } = await import('vitest')
    expect(mockMethod).toHaveBeenCalledWith(...expectedParams)
  },
  
  /**
   * Verify router navigation occurred
   */
  routerNavigated: async (mockPush: MockedFunction<(to: unknown) => Promise<void>>, expectedRoute: unknown): Promise<void> => {
    const { expect } = await import('vitest')
    expect(mockPush).toHaveBeenCalledWith(expectedRoute)
  }
}

// ============================================================================
// 📚 USAGE EXAMPLES
// ============================================================================

/*
EXAMPLE USAGE - Copy this pattern to your test files:

```javascript
import { 
  createCompleteAuthMock,
  mockRouterWithParams,
  createComponentRenderer,
  commonAssertions
} from '@/tests/patterns/testing-patterns'

describe('MyComponent', () => {
  let mockAuth: AuthMock
  let renderComponent: ReturnType<typeof createComponentRenderer>

  beforeEach(async () => {
    // Setup complete auth mock
    mockAuth = createCompleteAuthMock()
    vi.mocked(useAuth).mockReturnValue(mockAuth)
    
    // Setup component renderer  
    renderComponent = createComponentRenderer(MyComponent, {
      query: { email: 'test@example.com' }
    })
  })

  it('renders successfully', async () => {
    const { screen } = await renderComponent()
    
    await commonAssertions.componentRendersSuccessfully(screen, 'heading')
  })
  
  it('handles user interaction', async () => {
    const { screen, mockPush } = await renderComponent()
    
    const button = screen.getByRole('button', { name: /click me/i })
    await userEvent.click(button)
    
    await commonAssertions.composableCalledCorrectly(
      mockAuth.someMethod, 
      ['expectedParam']
    )
  })
})
```
*/

export default {
  createCompleteAuthMock,
  mockRouterWithParams,
  createTestRouter,
  createTestPinia,
  createComponentRenderer,
  handleAsyncTestLifecycle,
  validateMockCompleteness,
  commonAssertions
}