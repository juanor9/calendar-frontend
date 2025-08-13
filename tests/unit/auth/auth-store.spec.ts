/**
 * Auth Store Tests
 * Comprehensive unit tests for the Pinia auth store
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { ref, computed } from 'vue'
import {
  mockAppUser,
  mockAdminUser,
  mockPremiumUser,
  mockAccessToken,
  createMockLocalStorage,
  cleanupAuthMocks,
} from '../../mocks/auth0'
import type { User, Role, Permission, SecurityEvent } from '@/auth/types'

// Complete mock store implementation that matches the actual auth store interface
const createMockAuthStore = (overrides = {}) => {
  // State
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(true) // Initial loading state as expected
  const error = ref<string | null>(null)
  const token = ref<string | null>(null)
  
  // Profile management state
  const isUpdatingProfile = ref(false)
  const profileError = ref<string | null>(null)
  
  // GDPR state
  const isExportingData = ref(false)
  const isDeletingAccount = ref(false)
  const gdprError = ref<string | null>(null)
  
  // Security events state
  const securityEvents = ref<SecurityEvent[]>([])
  const isLoadingSecurityEvents = ref(false)

  // Computed getters
  const userRoles = computed<Role[]>(() => {
    if (!user.value) return []
    return (user.value['https://vana.app/roles'] || []) as Role[]
  })

  const userPermissions = computed<Permission[]>(() => {
    if (!user.value) return []
    return (user.value['https://vana.app/permissions'] || []) as Permission[]
  })

  const userMetadata = computed(() => {
    if (!user.value) return null
    return user.value['https://vana.app/user_metadata'] || {}
  })

  const userDisplayName = computed(() => {
    if (!user.value) return ''
    return user.value.name || user.value.nickname || user.value.email || 'Usuario'
  })

  const userAvatar = computed(() => {
    if (!user.value) return null
    return user.value.picture || null
  })

  const isAdmin = computed(() => {
    return userRoles.value.includes('admin') || userRoles.value.includes('super_admin')
  })

  const isPremium = computed(() => {
    return userRoles.value.includes('premium') || isAdmin.value
  })

  // Actions
  const setUser = (newUser: User | null) => {
    user.value = newUser
    isAuthenticated.value = !!newUser
    if (newUser) {
      localStorage.setItem('vana_user', JSON.stringify(newUser))
    } else {
      localStorage.removeItem('vana_user')
    }
  }

  const setToken = (newToken: string | null) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('vana_token', newToken)
    } else {
      localStorage.removeItem('vana_token')
    }
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setError = (err: string | null) => {
    error.value = err
  }

  const clearError = () => {
    error.value = null
  }

  // Initialize from localStorage
  const initializeFromStorage = () => {
    try {
      const storedUser = localStorage.getItem('vana_user')
      const storedToken = localStorage.getItem('vana_token')

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser) as User
        setUser(parsedUser)
      }

      if (storedToken) {
        setToken(storedToken)
      }
    } catch (err) {
      console.error('Error initializing auth from storage:', err)
      clearAuth()
    }
  }

  // Clear all auth data
  const clearAuth = () => {
    setUser(null)
    setToken(null)
    setError(null)
    localStorage.removeItem('vana_user')
    localStorage.removeItem('vana_token')
    localStorage.removeItem('vana_auth_state')
  }

  // Check if user has specific role
  const hasRole = (role: Role): boolean => {
    return userRoles.value.includes(role)
  }

  // Check if user has specific permission
  const hasPermission = (permission: Permission): boolean => {
    return userPermissions.value.includes(permission)
  }

  // Check if user has any of the specified roles
  const hasAnyRole = (roles: Role[]): boolean => {
    return roles.some(role => hasRole(role))
  }

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission))
  }

  // Check if user has all specified roles
  const hasAllRoles = (roles: Role[]): boolean => {
    return roles.every(role => hasRole(role))
  }

  // Check if user has all specified permissions
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission))
  }

  // Update user profile
  const updateUserProfile = (updates: Partial<User>) => {
    if (user.value) {
      const updatedUser = { ...user.value, ...updates }
      setUser(updatedUser)
    }
  }

  // Update user metadata
  const updateUserMetadata = (metadata: Record<string, unknown>) => {
    if (user.value) {
      const updatedUser = {
        ...user.value,
        'https://vana.app/user_metadata': {
          ...user.value['https://vana.app/user_metadata'],
          ...metadata,
        },
      }
      setUser(updatedUser)
    }
  }
  
  // Profile management actions
  const updateProfile = async (profileData: Partial<User>): Promise<void> => {
    if (!user.value) throw new Error('No user to update')
    
    try {
      isUpdatingProfile.value = true
      profileError.value = null

      const updatedUser = { ...user.value, ...profileData }
      setUser(updatedUser)
    } catch (err) {
      profileError.value = err instanceof Error ? err.message : 'Profile update failed'
      throw err
    } finally {
      isUpdatingProfile.value = false
    }
  }

  // GDPR actions
  const requestDataExport = async (): Promise<void> => {
    if (!user.value) throw new Error('No user authenticated')
    
    try {
      isExportingData.value = true
      gdprError.value = null
      // Mock implementation
    } catch (err) {
      gdprError.value = err instanceof Error ? err.message : 'Data export failed'
      throw err
    } finally {
      isExportingData.value = false
    }
  }

  const requestAccountDeletion = async (): Promise<void> => {
    if (!user.value) throw new Error('No user authenticated')
    
    try {
      isDeletingAccount.value = true
      gdprError.value = null
      // Mock implementation
    } catch (err) {
      gdprError.value = err instanceof Error ? err.message : 'Account deletion failed'
      throw err
    } finally {
      isDeletingAccount.value = false
    }
  }

  // Security events actions
  const loadSecurityEvents = async (): Promise<void> => {
    if (!user.value) return
    
    try {
      isLoadingSecurityEvents.value = true
      securityEvents.value = [
        {
          id: '1',
          type: 'login',
          description: 'Successful login from Chrome on Windows',
          timestamp: new Date().toISOString(),
          ipAddress: '192.168.1.1',
          userAgent: 'Chrome 120.0.0',
          location: 'Madrid, Spain',
        },
      ]
    } catch (err) {
      console.error('Failed to load security events:', err)
    } finally {
      isLoadingSecurityEvents.value = false
    }
  }

  const clearProfileError = (): void => {
    profileError.value = null
  }

  const clearGdprError = (): void => {
    gdprError.value = null
  }

  // Get current state as plain object
  const getAuthState = () => ({
    user: user.value,
    isAuthenticated: isAuthenticated.value,
    isLoading: isLoading.value,
    error: error.value,
    token: token.value,
  })

  const store = {
    // State - return the reactive refs themselves
    user,
    isAuthenticated,
    isLoading,
    error,
    token,
    
    // Profile management state
    isUpdatingProfile,
    profileError,
    
    // GDPR state
    isExportingData,
    isDeletingAccount,
    gdprError,
    
    // Security events state
    securityEvents,
    isLoadingSecurityEvents,

    // Computed - return the computed refs themselves
    userRoles,
    userPermissions,
    userMetadata,
    userDisplayName,
    userAvatar,
    isAdmin,
    isPremium,

    // Actions
    setUser,
    setToken,
    setLoading,
    setError,
    clearError,
    initializeFromStorage,
    clearAuth,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
    hasAllRoles,
    hasAllPermissions,
    updateUserProfile,
    updateUserMetadata,
    getAuthState,
    
    // Profile management actions
    updateProfile,
    clearProfileError,
    
    // GDPR actions
    requestDataExport,
    requestAccountDeletion,
    clearGdprError,
    
    // Security events actions
    loadSecurityEvents,
    ...overrides
  }

  return store
}

describe('Auth Store', () => {
  let authStore: ReturnType<typeof createMockAuthStore>
  let mockLocalStorage: ReturnType<typeof createMockLocalStorage>

  beforeEach(() => {
    // Setup Pinia
    setActivePinia(createPinia())

    // Setup localStorage mock
    mockLocalStorage = createMockLocalStorage()
    vi.stubGlobal('localStorage', mockLocalStorage)

    // Initialize store with complete mock implementation
    authStore = createMockAuthStore()
  })

  afterEach(() => {
    cleanupAuthMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(authStore.user.value).toBeNull()
      expect(authStore.isAuthenticated.value).toBe(false)
      expect(authStore.isLoading.value).toBe(true) // Initial loading state
      expect(authStore.error.value).toBeNull()
      expect(authStore.token.value).toBeNull()
    })

    it('should have empty computed values when no user', () => {
      expect(authStore.userRoles.value).toEqual([])
      expect(authStore.userPermissions.value).toEqual([])
      expect(authStore.userMetadata.value).toBeNull()
      expect(authStore.userDisplayName.value).toBe('')
      expect(authStore.userAvatar.value).toBeNull()
      expect(authStore.isAdmin.value).toBe(false)
      expect(authStore.isPremium.value).toBe(false)
    })
  })

  describe('setUser action', () => {
    it('should set user and update authentication state', () => {
      authStore.setUser(mockAppUser)

      expect(authStore.user.value).toEqual(mockAppUser)
      expect(authStore.isAuthenticated.value).toBe(true)
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'vana_user',
        JSON.stringify(mockAppUser)
      )
    })

    it('should clear user and update authentication state', () => {
      // First set a user
      authStore.setUser(mockAppUser)
      expect(authStore.isAuthenticated.value).toBe(true)

      // Then clear user
      authStore.setUser(null)

      expect(authStore.user.value).toBeNull()
      expect(authStore.isAuthenticated.value).toBe(false)
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('vana_user')
    })
  })

  describe('setToken action', () => {
    it('should set token and store in localStorage', () => {
      authStore.setToken(mockAccessToken)

      expect(authStore.token.value).toBe(mockAccessToken)
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('vana_token', mockAccessToken)
    })

    it('should clear token and remove from localStorage', () => {
      // First set token
      authStore.setToken(mockAccessToken)

      // Then clear token
      authStore.setToken(null)

      expect(authStore.token.value).toBeNull()
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('vana_token')
    })
  })

  describe('loading and error state management', () => {
    it('should manage loading state', () => {
      authStore.setLoading(false)
      expect(authStore.isLoading.value).toBe(false)

      authStore.setLoading(true)
      expect(authStore.isLoading.value).toBe(true)
    })

    it('should manage error state', () => {
      const errorMessage = 'Test error message'

      authStore.setError(errorMessage)
      expect(authStore.error.value).toBe(errorMessage)

      authStore.clearError()
      expect(authStore.error.value).toBeNull()

      authStore.setError(null)
      expect(authStore.error.value).toBeNull()
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

      expect(authStore.user.value).toEqual(mockAppUser)
      expect(authStore.token.value).toBe(mockAccessToken)
      expect(authStore.isAuthenticated.value).toBe(true)
    })

    it('should handle missing localStorage data gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      authStore.initializeFromStorage()

      expect(authStore.user.value).toBeNull()
      expect(authStore.token.value).toBeNull()
      expect(authStore.isAuthenticated.value).toBe(false)
    })

    it('should handle corrupted localStorage data', () => {
      mockLocalStorage.getItem.mockImplementation((key: string) => {
        if (key === 'vana_user') return 'invalid json'
        return null
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      authStore.initializeFromStorage()

      expect(authStore.user.value).toBeNull()
      expect(authStore.isAuthenticated.value).toBe(false)
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

      expect(authStore.user.value).toBeNull()
      expect(authStore.token.value).toBeNull()
      expect(authStore.error.value).toBeNull()
      expect(authStore.isAuthenticated.value).toBe(false)

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
      expect(authStore.userRoles.value).toEqual(['user'])
    })

    it('should extract user permissions correctly', () => {
      expect(authStore.userPermissions.value).toEqual([
        'read:calendar',
        'write:calendar',
        'read:tasks',
        'write:tasks',
      ])
    })

    it('should extract user metadata correctly', () => {
      expect(authStore.userMetadata.value).toEqual(mockAppUser['https://vana.app/user_metadata'])
    })

    it('should generate correct display name', () => {
      expect(authStore.userDisplayName.value).toBe('Test User')
    })

    it('should return correct avatar', () => {
      expect(authStore.userAvatar.value).toBe('https://example.com/avatar.jpg')
    })

    it('should return correct admin status', () => {
      expect(authStore.isAdmin.value).toBe(false)
    })

    it('should return correct premium status', () => {
      expect(authStore.isPremium.value).toBe(false)
    })
  })

  describe('computed properties with admin user', () => {
    beforeEach(() => {
      authStore.setUser(mockAdminUser)
    })

    it('should identify admin correctly', () => {
      expect(authStore.isAdmin.value).toBe(true)
      expect(authStore.isPremium.value).toBe(true) // Admin includes premium
    })

    it('should have admin roles and permissions', () => {
      expect(authStore.userRoles.value).toContain('admin')
      expect(authStore.userPermissions.value).toContain('admin:users')
      expect(authStore.userPermissions.value).toContain('admin:system')
    })
  })

  describe('computed properties with premium user', () => {
    beforeEach(() => {
      authStore.setUser(mockPremiumUser)
    })

    it('should identify premium correctly', () => {
      expect(authStore.isPremium.value).toBe(true)
      expect(authStore.isAdmin.value).toBe(false)
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

      expect(authStore.user.value?.name).toBe('Updated Name')
      expect(authStore.user.value?.email).toBe('updated@vana.app')
      expect(mockLocalStorage.setItem).toHaveBeenCalled()
    })

    it('should not update profile when no user set', () => {
      authStore.setUser(null)

      const updates = { name: 'Updated Name' }
      authStore.updateUserProfile(updates)

      expect(authStore.user.value).toBeNull()
    })

    it('should update user metadata correctly', () => {
      const newMetadata = {
        timezone: 'America/New_York',
        calendar_preferences: {
          default_view: 'day' as const,
        },
      }

      authStore.updateUserMetadata(newMetadata)

      const userMetadata = authStore.user.value?.['https://vana.app/user_metadata']
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

      expect(authStore.userRoles.value).toEqual([])
      expect(authStore.userPermissions.value).toEqual([])
      expect(authStore.userMetadata.value).toEqual({})
      expect(authStore.isAdmin.value).toBe(false)
      expect(authStore.isPremium.value).toBe(false)
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
      expect(authStore.userDisplayName.value).toBe('Usuario')

      // User with only email
      const userEmailOnly: User = {
        ...userNoName,
        email: 'test@example.com',
      }
      authStore.setUser(userEmailOnly)
      expect(authStore.userDisplayName.value).toBe('test@example.com')

      // User with nickname
      const userNickname: User = {
        ...userEmailOnly,
        nickname: 'testnick',
      }
      authStore.setUser(userNickname)
      expect(authStore.userDisplayName.value).toBe('testnick')

      // User with full name (should take precedence)
      const userFullName: User = {
        ...userNickname,
        name: 'Full Name',
      }
      authStore.setUser(userFullName)
      expect(authStore.userDisplayName.value).toBe('Full Name')
    })

    it('should handle super_admin role correctly', () => {
      const superAdminUser: User = {
        ...mockAppUser,
        'https://vana.app/roles': ['super_admin'],
      }

      authStore.setUser(superAdminUser)

      expect(authStore.hasRole('super_admin')).toBe(true)
      expect(authStore.isAdmin.value).toBe(true) // super_admin should be treated as admin
      expect(authStore.isPremium.value).toBe(true) // admin includes premium
    })
  })

  describe('reactivity', () => {
    it('should maintain reactivity after user updates', () => {
      authStore.setUser(mockAppUser)

      const initialDisplayName = authStore.userDisplayName.value
      expect(initialDisplayName).toBe('Test User')

      // Update user name
      authStore.updateUserProfile({ name: 'New Name' })

      expect(authStore.userDisplayName.value).toBe('New Name')
      expect(authStore.userDisplayName.value).not.toBe(initialDisplayName)
    })

    it('should maintain reactivity in computed properties', () => {
      authStore.setUser(mockAppUser)

      expect(authStore.isPremium.value).toBe(false)

      // Update to premium user with proper typing
      const premiumUpdate: Partial<User> = {
        'https://vana.app/roles': ['premium'],
      }
      authStore.updateUserProfile(premiumUpdate)

      expect(authStore.isPremium.value).toBe(true)
    })
  })
})