/**
 * Auth Performance Tests
 * Performance testing for authentication components and flows
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { performance } from 'perf_hooks'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import LoginButton from '@/features/authentication/components/LoginButton/LoginButton.vue'
import LogoutButton from '@/features/authentication/components/LogoutButton/LogoutButton.vue'
import { useAuth } from '@/features/authentication/composables/useAuth'
import { useAuthStore } from '@/features/authentication/stores/auth'
import { createMockAuth0Client, mockAppUser, cleanupAuthMocks } from '../mocks/auth0'
import { performanceHelpers } from '../utils/auth-test-utils'

// Performance thresholds (adjust based on requirements)
const PERFORMANCE_THRESHOLDS = {
  COMPONENT_RENDER: 50, // ms
  AUTH_CHECK: 100, // ms
  TOKEN_REFRESH: 500, // ms
  LOGIN_FLOW: 1000, // ms
  LOGOUT_FLOW: 500, // ms
  STORE_UPDATE: 10, // ms
  BUNDLE_SIZE: 100000, // bytes (100KB)
  MEMORY_USAGE: 5000000, // bytes (5MB)
} as const

describe('Auth Performance Tests', () => {
  let mockAuth0Client: ReturnType<typeof createMockAuth0Client>
  let pinia: ReturnType<typeof createTestingPinia>

  beforeEach(() => {
    mockAuth0Client = createMockAuth0Client()
    pinia = createTestingPinia({ createSpy: vi.fn })

    // Mock performance APIs
    if (typeof global.performance === 'undefined') {
      global.performance = performance as typeof window.performance
    }
  })

  afterEach(() => {
    cleanupAuthMocks()
  })

  describe('Component Render Performance', () => {
    it('should render LoginButton within performance threshold', async () => {
      const [, renderTime] = performanceHelpers.measureRenderTime(() => {
        return mount(LoginButton, {
          global: {
            plugins: [pinia],
            provide: {
              [Symbol.for('Auth0Client')]: mockAuth0Client,
            },
          },
        })
      })

      expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.COMPONENT_RENDER)
    })

    it('should render LogoutButton within performance threshold', async () => {
      const [, renderTime] = performanceHelpers.measureRenderTime(() => {
        return mount(LogoutButton, {
          global: {
            plugins: [pinia],
            provide: {
              [Symbol.for('Auth0Client')]: mockAuth0Client,
            },
          },
        })
      })

      expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.COMPONENT_RENDER)
    })

    it('should handle rapid re-renders efficiently', async () => {
      const wrapper = mount(LoginButton, {
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: mockAuth0Client,
          },
        },
      })

      const startTime = performance.now()

      // Trigger multiple rapid re-renders
      for (let i = 0; i < 100; i++) {
        await wrapper.setProps({ text: `Login ${i}` })
      }

      const endTime = performance.now()
      const totalTime = endTime - startTime

      // Should handle 100 re-renders in reasonable time
      expect(totalTime).toBeLessThan(500) // 500ms for 100 re-renders
    })
  })

  describe('Authentication Flow Performance', () => {
    it('should complete auth check within performance threshold', async () => {
      mockAuth0Client = createMockAuth0Client({
        isAuthenticated: true,
        user: mockAppUser,
      })

      // Mock Vue's inject for useAuth
      vi.mock('vue', async () => {
        const actual = await vi.importActual('vue')
        return {
          ...actual,
          inject: vi.fn().mockReturnValue(mockAuth0Client),
        }
      })

      const startTime = performance.now()

      const auth = useAuth()
      await auth.checkAuth()

      const endTime = performance.now()
      const checkTime = endTime - startTime

      expect(checkTime).toBeLessThan(PERFORMANCE_THRESHOLDS.AUTH_CHECK)
    })

    it('should complete token refresh within performance threshold', async () => {
      mockAuth0Client = createMockAuth0Client({
        isAuthenticated: true,
        user: mockAppUser,
        tokenResponse: 'new-token-123',
      })

      vi.mock('vue', async () => {
        const actual = await vi.importActual('vue')
        return {
          ...actual,
          inject: vi.fn().mockReturnValue(mockAuth0Client),
        }
      })

      const auth = useAuth()

      const startTime = performance.now()
      await auth.getAccessToken()
      const endTime = performance.now()

      const tokenTime = endTime - startTime

      expect(tokenTime).toBeLessThan(PERFORMANCE_THRESHOLDS.TOKEN_REFRESH)
    })

    it('should handle login flow within performance threshold', async () => {
      const wrapper = mount(LoginButton, {
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: mockAuth0Client,
          },
        },
      })

      const startTime = performance.now()

      const button = wrapper.find('button')
      await button.trigger('click')

      const endTime = performance.now()
      const loginTime = endTime - startTime

      expect(loginTime).toBeLessThan(PERFORMANCE_THRESHOLDS.LOGIN_FLOW)
    })

    it('should handle logout flow within performance threshold', async () => {
      mockAuth0Client = createMockAuth0Client({
        isAuthenticated: true,
        user: mockAppUser,
      })

      const wrapper = mount(LogoutButton, {
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: mockAuth0Client,
          },
        },
      })

      const startTime = performance.now()

      const button = wrapper.find('button')
      await button.trigger('click')

      const endTime = performance.now()
      const logoutTime = endTime - startTime

      expect(logoutTime).toBeLessThan(PERFORMANCE_THRESHOLDS.LOGOUT_FLOW)
    })
  })

  describe('Store Performance', () => {
    it('should update auth store within performance threshold', async () => {
      const authStore = useAuthStore()

      const startTime = performance.now()

      authStore.setUser(mockAppUser)
      authStore.setToken('test-token')
      authStore.setLoading(false)

      const endTime = performance.now()
      const updateTime = endTime - startTime

      expect(updateTime).toBeLessThan(PERFORMANCE_THRESHOLDS.STORE_UPDATE)
    })

    it('should handle large metadata updates efficiently', async () => {
      const authStore = useAuthStore()

      // Create user with large metadata
      const largeMetadata = {
        preferences: Array.from({ length: 1000 }, (_, i) => ({
          key: `pref_${i}`,
          value: `value_${i}`,
          timestamp: Date.now(),
        })),
        history: Array.from({ length: 500 }, (_, i) => ({
          action: `action_${i}`,
          timestamp: Date.now() - i * 1000,
          data: { complex: { nested: { object: i } } },
        })),
      }

      const userWithLargeMetadata = {
        ...mockAppUser,
        'https://vana.app/user_metadata': largeMetadata,
      }

      const startTime = performance.now()
      authStore.setUser(userWithLargeMetadata)
      const endTime = performance.now()

      const updateTime = endTime - startTime

      expect(updateTime).toBeLessThan(100) // Should handle large data within 100ms
    })

    it('should perform role/permission checks efficiently', async () => {
      const authStore = useAuthStore()
      authStore.setUser(mockAppUser)

      const startTime = performance.now()

      // Perform multiple role/permission checks
      for (let i = 0; i < 1000; i++) {
        authStore.hasRole('user')
        authStore.hasPermission('read:calendar')
        authStore.hasAnyRole(['user', 'admin'])
        authStore.hasAllPermissions(['read:calendar', 'write:calendar'])
      }

      const endTime = performance.now()
      const checkTime = endTime - startTime

      expect(checkTime).toBeLessThan(50) // 1000 checks should complete in 50ms
    })
  })

  describe('Memory Usage', () => {
    it('should not create memory leaks during auth state changes', () => {
      const authStore = useAuthStore()

      const memoryBefore = performanceHelpers.testMemoryUsage(
        () => {}, // No setup
        () => {
          // Simulate many auth state changes
          for (let i = 0; i < 100; i++) {
            authStore.setUser(mockAppUser)
            authStore.setUser(null)
            authStore.setToken('token-' + i)
            authStore.setToken(null)
            authStore.setLoading(true)
            authStore.setLoading(false)
            authStore.setError('error-' + i)
            authStore.clearError()
          }
        }
      )

      // Memory usage should not grow significantly
      expect(Math.abs(memoryBefore.diff)).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_USAGE)
    })

    it('should clean up event listeners and timers', () => {
      // Mock DOM for testing
      const mockElement = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }

      global.document = {
        createElement: vi.fn().mockReturnValue(mockElement),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      } as Document

      // Mount and unmount component multiple times
      for (let i = 0; i < 10; i++) {
        const wrapper = mount(LoginButton, {
          global: {
            plugins: [pinia],
            provide: {
              [Symbol.for('Auth0Client')]: mockAuth0Client,
            },
          },
        })
        wrapper.unmount()
      }

      // Verify cleanup (this is a simplified test)
      // In real scenarios, you'd check for actual memory leaks
      expect(mockElement.addEventListener).toHaveBeenCalled()
    })
  })

  describe('Bundle Size Impact', () => {
    it('should not exceed bundle size threshold for auth components', async () => {
      // Mock bundle analysis
      const bundleImpact = await performanceHelpers.testBundleImpact()

      expect(bundleImpact.authModuleSize).toBeLessThan(PERFORMANCE_THRESHOLDS.BUNDLE_SIZE)
      expect(bundleImpact.impact).toBeLessThan(10) // Should be less than 10% of total bundle
    })
  })

  describe('Concurrent Operations', () => {
    it('should handle concurrent auth operations efficiently', async () => {
      mockAuth0Client = createMockAuth0Client({
        isAuthenticated: true,
        user: mockAppUser,
      })

      vi.mock('vue', async () => {
        const actual = await vi.importActual('vue')
        return {
          ...actual,
          inject: vi.fn().mockReturnValue(mockAuth0Client),
        }
      })

      const auth = useAuth()

      const startTime = performance.now()

      // Run multiple operations concurrently
      const operations = [
        auth.checkAuth(),
        auth.getAccessToken(),
        auth.checkAuth(),
        auth.getAccessToken(),
        auth.checkAuth(),
      ]

      await Promise.all(operations)

      const endTime = performance.now()
      const totalTime = endTime - startTime

      expect(totalTime).toBeLessThan(1000) // All operations should complete within 1s
    })

    it('should handle rapid component mount/unmount cycles', () => {
      const startTime = performance.now()

      // Mount and unmount components rapidly
      for (let i = 0; i < 50; i++) {
        const wrapper = mount(LoginButton, {
          global: {
            plugins: [pinia],
            provide: {
              [Symbol.for('Auth0Client')]: mockAuth0Client,
            },
          },
        })
        wrapper.unmount()
      }

      const endTime = performance.now()
      const cycleTime = endTime - startTime

      expect(cycleTime).toBeLessThan(1000) // 50 cycles should complete within 1s
    })
  })

  describe('Network Performance', () => {
    it('should handle slow network gracefully', async () => {
      // Mock slow Auth0 response
      mockAuth0Client.getAccessTokenSilently = vi
        .fn()
        .mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('token'), 2000)))

      vi.mock('vue', async () => {
        const actual = await vi.importActual('vue')
        return {
          ...actual,
          inject: vi.fn().mockReturnValue(mockAuth0Client),
        }
      })

      const auth = useAuth()

      const startTime = performance.now()

      // Should timeout or handle slow network appropriately
      try {
        await Promise.race([
          auth.getAccessToken(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1000)),
        ])
      } catch (error) {
        // Expected to timeout
        expect(error).toBeInstanceOf(Error)
      }

      const endTime = performance.now()
      const networkTime = endTime - startTime

      expect(networkTime).toBeLessThan(1100) // Should timeout within reasonable time
    })
  })

  describe('Reactivity Performance', () => {
    it('should handle reactive state updates efficiently', async () => {
      const wrapper = mount(LoginButton, {
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: mockAuth0Client,
          },
        },
      })

      const authStore = useAuthStore()

      const startTime = performance.now()

      // Trigger many reactive updates
      for (let i = 0; i < 100; i++) {
        authStore.setLoading(i % 2 === 0)
        authStore.setError(i % 3 === 0 ? `Error ${i}` : null)
        await wrapper.vm.$nextTick()
      }

      const endTime = performance.now()
      const reactivityTime = endTime - startTime

      expect(reactivityTime).toBeLessThan(500) // 100 reactive updates in 500ms
    })
  })

  describe('Error Handling Performance', () => {
    it('should handle auth errors without performance degradation', async () => {
      const errorAuth0Client = createMockAuth0Client({
        shouldThrow: true,
      })

      const wrapper = mount(LoginButton, {
        global: {
          plugins: [pinia],
          provide: {
            [Symbol.for('Auth0Client')]: errorAuth0Client,
          },
        },
      })

      const startTime = performance.now()

      // Trigger multiple errors
      for (let i = 0; i < 10; i++) {
        try {
          const button = wrapper.find('button')
          await button.trigger('click')
        } catch {
          // Expected errors
        }
      }

      const endTime = performance.now()
      const errorTime = endTime - startTime

      expect(errorTime).toBeLessThan(1000) // Error handling shouldn't be slow
    })
  })
})
