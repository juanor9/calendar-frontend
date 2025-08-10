/**
 * Auth Store Tests
 * Comprehensive unit tests for the Pinia auth store
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/store/auth'
import {
  mockAppUser,
  mockAdminUser,
  mockPremiumUser,
  mockAccessToken,
  createMockLocalStorage,
  cleanupAuthMocks,
} from '../../mocks/auth0'
import type { User, Role, Permission } from '@/auth/types'

describe('Auth Store', () => {
  let authStore: ReturnType<typeof useAuthStore>
  let mockLocalStorage: ReturnType<typeof createMockLocalStorage>

  beforeEach(() => {
    // Setup Pinia
    setActivePinia(createPinia())

    // Setup localStorage mock
    mockLocalStorage = createMockLocalStorage()
    vi.stubGlobal('localStorage', mockLocalStorage)

    // Initialize store
    authStore = useAuthStore()
  })

  afterEach(() => {
    cleanupAuthMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(authStore.user).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
      expect(authStore.isLoading).toBe(true) // Initial loading state
      expect(authStore.error).toBeNull()
      expect(authStore.token).toBeNull()
    })

    it('should have empty computed values when no user', () => {
      expect(authStore.userRoles).toEqual([])
      expect(authStore.userPermissions).toEqual([])
      expect(authStore.userMetadata).toBeNull()
      expect(authStore.userDisplayName).toBe('')
      expect(authStore.userAvatar).toBeNull()
      expect(authStore.isAdmin).toBe(false)
      expect(authStore.isPremium).toBe(false)
    })
  })

  describe('setUser action', () => {
    it('should set user and update authentication state', () => {
      authStore.setUser(mockAppUser)

      expect(authStore.user).toEqual(mockAppUser)
      expect(authStore.isAuthenticated).toBe(true)
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'vana_user',
        JSON.stringify(mockAppUser)
      )
    })

    it('should clear user and update authentication state', () => {
      // First set a user
      authStore.setUser(mockAppUser)
      expect(authStore.isAuthenticated).toBe(true)

      // Then clear user
      authStore.setUser(null)

      expect(authStore.user).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('vana_user')
    })
  })

  describe('setToken action', () => {
    it('should set token and store in localStorage', () => {
      authStore.setToken(mockAccessToken)

      expect(authStore.token).toBe(mockAccessToken)
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('vana_token', mockAccessToken)
    })

    it('should clear token and remove from localStorage', () => {
      // First set token
      authStore.setToken(mockAccessToken)

      // Then clear token
      authStore.setToken(null)

      expect(authStore.token).toBeNull()
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('vana_token')
    })
  })

  describe('loading and error state management', () => {
    it('should manage loading state', () => {
      authStore.setLoading(false)
      expect(authStore.isLoading).toBe(false)

      authStore.setLoading(true)
      expect(authStore.isLoading).toBe(true)
    })

    it('should manage error state', () => {
      const errorMessage = 'Test error message'

      authStore.setError(errorMessage)
      expect(authStore.error).toBe(errorMessage)

      authStore.clearError()
      expect(authStore.error).toBeNull()

      authStore.setError(null)
      expect(authStore.error).toBeNull()
    })
  })

  describe('initializeFromStorage', () => {
    it('should initialize user and token from localStorage', () => {
      const storedUser = JSON.stringify(mockAppUser)
      mockLocalStorage.getItem.mockImplementation((key: string) => {
        if (key === 'vana_user') return storedUser
        if (key === 'vana_token') return mockAccessToken
        return null
      })

      authStore.initializeFromStorage()

      expect(authStore.user).toEqual(mockAppUser)
      expect(authStore.token).toBe(mockAccessToken)
      expect(authStore.isAuthenticated).toBe(true)
    })

    it('should handle missing localStorage data gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      authStore.initializeFromStorage()

      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
    })

    it('should handle corrupted localStorage data', () => {
      mockLocalStorage.getItem.mockImplementation((key: string) => {
        if (key === 'vana_user') return 'invalid json'
        return null
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      authStore.initializeFromStorage()

      expect(authStore.user).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
      expect(consoleSpy).toHaveBeenCalled()
    })
  })

  describe('clearAuth', () => {
    it('should clear all auth data', () => {
      // Set up authenticated state
      authStore.setUser(mockAppUser)
      authStore.setToken(mockAccessToken)
      authStore.setError('Some error')

      authStore.clearAuth()

      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.error).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('vana_user')
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('vana_token')
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('vana_auth_state')
    })
  })

  describe('computed properties with regular user', () => {
    beforeEach(() => {
      authStore.setUser(mockAppUser)
    })

    it('should extract user roles correctly', () => {
      expect(authStore.userRoles).toEqual(['user'])
    })

    it('should extract user permissions correctly', () => {
      expect(authStore.userPermissions).toEqual([
        'read:calendar',
        'write:calendar',
        'read:tasks',
        'write:tasks',
      ])
    })

    it('should extract user metadata correctly', () => {
      expect(authStore.userMetadata).toEqual(mockAppUser['https://vana.app/user_metadata'])
    })

    it('should generate correct display name', () => {
      expect(authStore.userDisplayName).toBe('Test User')
    })

    it('should return correct avatar', () => {
      expect(authStore.userAvatar).toBe('https://example.com/avatar.jpg')
    })

    it('should return correct admin status', () => {
      expect(authStore.isAdmin).toBe(false)
    })

    it('should return correct premium status', () => {
      expect(authStore.isPremium).toBe(false)
    })
  })

  describe('computed properties with admin user', () => {
    beforeEach(() => {
      authStore.setUser(mockAdminUser)
    })

    it('should identify admin correctly', () => {
      expect(authStore.isAdmin).toBe(true)
      expect(authStore.isPremium).toBe(true) // Admin includes premium
    })

    it('should have admin roles and permissions', () => {
      expect(authStore.userRoles).toContain('admin')
      expect(authStore.userPermissions).toContain('admin:users')
      expect(authStore.userPermissions).toContain('admin:system')
    })
  })

  describe('computed properties with premium user', () => {
    beforeEach(() => {
      authStore.setUser(mockPremiumUser)
    })

    it('should identify premium correctly', () => {
      expect(authStore.isPremium).toBe(true)
      expect(authStore.isAdmin).toBe(false)
    })
  })

  describe('role checking methods', () => {
    beforeEach(() => {
      authStore.setUser(mockAdminUser)
    })

    it('should check single role correctly', () => {
      expect(authStore.hasRole('admin')).toBe(true)
      expect(authStore.hasRole('user')).toBe(false)
      expect(authStore.hasRole('premium')).toBe(false)
    })

    it('should check any role correctly', () => {
      expect(authStore.hasAnyRole(['admin', 'user'])).toBe(true)
      expect(authStore.hasAnyRole(['user', 'premium'])).toBe(false)
      expect(authStore.hasAnyRole([])).toBe(false)
    })

    it('should check all roles correctly', () => {
      expect(authStore.hasAllRoles(['admin'])).toBe(true)
      expect(authStore.hasAllRoles(['admin', 'user'])).toBe(false)
      expect(authStore.hasAllRoles([])).toBe(true) // Edge case: empty array
    })
  })

  describe('permission checking methods', () => {
    beforeEach(() => {
      authStore.setUser(mockAdminUser)
    })

    it('should check single permission correctly', () => {
      expect(authStore.hasPermission('admin:users')).toBe(true)
      expect(authStore.hasPermission('read:calendar')).toBe(true)
      expect(authStore.hasPermission('nonexistent:permission')).toBe(false)
    })

    it('should check any permission correctly', () => {
      expect(authStore.hasAnyPermission(['admin:users', 'read:calendar'])).toBe(true)
      expect(authStore.hasAnyPermission(['nonexistent:permission'])).toBe(false)
      expect(authStore.hasAnyPermission([])).toBe(false)
    })

    it('should check all permissions correctly', () => {
      expect(authStore.hasAllPermissions(['admin:users', 'admin:system'])).toBe(true)
      expect(authStore.hasAllPermissions(['admin:users', 'nonexistent:permission'])).toBe(false)
      expect(authStore.hasAllPermissions([])).toBe(true) // Edge case: empty array
    })
  })

  describe('user profile updates', () => {
    beforeEach(() => {
      authStore.setUser(mockAppUser)
    })

    it('should update user profile correctly', () => {
      const updates = { name: 'Updated Name', email: 'updated@vana.app' }

      authStore.updateUserProfile(updates)

      expect(authStore.user?.name).toBe('Updated Name')
      expect(authStore.user?.email).toBe('updated@vana.app')
      expect(mockLocalStorage.setItem).toHaveBeenCalled()
    })

    it('should not update profile when no user set', () => {
      authStore.setUser(null)

      const updates = { name: 'Updated Name' }
      authStore.updateUserProfile(updates)

      expect(authStore.user).toBeNull()
    })

    it('should update user metadata correctly', () => {
      const newMetadata = {
        timezone: 'America/New_York',
        calendar_preferences: {
          default_view: 'day' as const,
        },
      }

      authStore.updateUserMetadata(newMetadata)

      const userMetadata = authStore.user?.['https://vana.app/user_metadata']
      expect(userMetadata?.timezone).toBe('America/New_York')
      expect(userMetadata?.calendar_preferences?.default_view).toBe('day')
      // Should preserve existing metadata
      expect(userMetadata?.notification_preferences).toBeDefined()
    })
  })

  describe('getAuthState method', () => {
    it('should return current state as plain object', () => {
      authStore.setUser(mockAppUser)
      authStore.setToken(mockAccessToken)
      authStore.setError('Test error')
      authStore.setLoading(true)

      const state = authStore.getAuthState()

      expect(state).toEqual({
        user: mockAppUser,
        isAuthenticated: true,
        isLoading: true,
        error: 'Test error',
        token: mockAccessToken,
      })
    })
  })

  describe('edge cases and fallbacks', () => {
    it('should handle user without metadata gracefully', () => {
      const userWithoutMetadata = { ...mockAppUser }
      delete userWithoutMetadata['https://vana.app/user_metadata']
      delete userWithoutMetadata['https://vana.app/roles']
      delete userWithoutMetadata['https://vana.app/permissions']

      authStore.setUser(userWithoutMetadata)

      expect(authStore.userRoles).toEqual([])
      expect(authStore.userPermissions).toEqual([])
      expect(authStore.userMetadata).toEqual({})
      expect(authStore.isAdmin).toBe(false)
      expect(authStore.isPremium).toBe(false)
    })

    it('should handle display name fallbacks correctly', () => {
      // User with no name fields
      const userNoName: User = {
        ...mockAppUser,
        name: undefined,
        nickname: undefined,
        email: undefined,
      }
      authStore.setUser(userNoName)
      expect(authStore.userDisplayName).toBe('Usuario')

      // User with only email
      const userEmailOnly: User = {
        ...userNoName,
        email: 'test@example.com',
      }
      authStore.setUser(userEmailOnly)
      expect(authStore.userDisplayName).toBe('test@example.com')

      // User with nickname
      const userNickname: User = {
        ...userEmailOnly,
        nickname: 'testnick',
      }
      authStore.setUser(userNickname)
      expect(authStore.userDisplayName).toBe('testnick')

      // User with full name (should take precedence)
      const userFullName: User = {
        ...userNickname,
        name: 'Full Name',
      }
      authStore.setUser(userFullName)
      expect(authStore.userDisplayName).toBe('Full Name')
    })

    it('should handle super_admin role correctly', () => {
      const superAdminUser: User = {
        ...mockAppUser,
        'https://vana.app/roles': ['super_admin'],
      }

      authStore.setUser(superAdminUser)

      expect(authStore.hasRole('super_admin')).toBe(true)
      expect(authStore.isAdmin).toBe(true) // super_admin should be treated as admin
      expect(authStore.isPremium).toBe(true) // admin includes premium
    })
  })

  describe('reactivity', () => {
    it('should maintain reactivity after user updates', () => {
      authStore.setUser(mockAppUser)

      const initialDisplayName = authStore.userDisplayName
      expect(initialDisplayName).toBe('Test User')

      // Update user name
      authStore.updateUserProfile({ name: 'New Name' })

      expect(authStore.userDisplayName).toBe('New Name')
      expect(authStore.userDisplayName).not.toBe(initialDisplayName)
    })

    it('should maintain reactivity in computed properties', () => {
      authStore.setUser(mockAppUser)

      expect(authStore.isPremium).toBe(false)

      // Update to premium user
      const premiumUpdate = {
        'https://vana.app/roles': ['premium'],
      }
      authStore.updateUserProfile(premiumUpdate as any)

      expect(authStore.isPremium).toBe(true)
    })
  })
})
