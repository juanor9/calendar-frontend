/**
 * Complete Auth Store Mock - Following STORE_TESTING_PATTERNS.md
 * 
 * This provides a complete mock implementation of the auth store
 * that includes ALL methods and reactive properties required by tests
 * 
 * CRITICAL: Prevents "clearAuth is not a function" and similar errors
 */

import { vi } from 'vitest'
import { ref, computed } from 'vue'
import type { User, Role, Permission, SecurityEvent } from '@/features/authentication/types/auth.types'

export interface CompleteAuthStoreMock {
  // State (reactive refs)
  user: { value: User | null }
  isAuthenticated: { value: boolean }
  isLoading: { value: boolean }
  error: { value: Error | null }
  token: { value: string | null }
  
  // Profile management state
  isUpdatingProfile: { value: boolean }
  profileError: { value: string | null }
  
  // GDPR state
  isExportingData: { value: boolean }
  isDeletingAccount: { value: boolean }
  gdprError: { value: string | null }
  
  // Security events state  
  securityEvents: { value: SecurityEvent[] }
  isLoadingSecurityEvents: { value: boolean }

  // Computed properties (reactive computed)
  userRoles: { value: Role[] }
  userPermissions: { value: Permission[] }
  userMetadata: { value: Record<string, unknown> | null }
  userDisplayName: { value: string }
  userAvatar: { value: string | null }
  isAdmin: { value: boolean }
  isPremium: { value: boolean }

  // Actions - Core Methods (ALL methods from real store)
  setUser: ReturnType<typeof vi.fn>
  setToken: ReturnType<typeof vi.fn>
  setLoading: ReturnType<typeof vi.fn>
  setError: ReturnType<typeof vi.fn>
  clearError: ReturnType<typeof vi.fn>
  initializeFromStorage: ReturnType<typeof vi.fn>
  clearAuth: ReturnType<typeof vi.fn>
  
  // Role/Permission Methods
  hasRole: ReturnType<typeof vi.fn>
  hasPermission: ReturnType<typeof vi.fn>
  hasAnyRole: ReturnType<typeof vi.fn>
  hasAnyPermission: ReturnType<typeof vi.fn>
  hasAllRoles: ReturnType<typeof vi.fn>
  hasAllPermissions: ReturnType<typeof vi.fn>
  
  // Profile Management Methods
  updateUserProfile: ReturnType<typeof vi.fn>
  updateUserMetadata: ReturnType<typeof vi.fn>
  updateProfile: ReturnType<typeof vi.fn>
  clearProfileError: ReturnType<typeof vi.fn>
  
  // GDPR Methods
  requestDataExport: ReturnType<typeof vi.fn>
  requestAccountDeletion: ReturnType<typeof vi.fn>
  clearGdprError: ReturnType<typeof vi.fn>
  
  // Security Methods
  loadSecurityEvents: ReturnType<typeof vi.fn>
  
  // Utility Methods
  getAuthState: ReturnType<typeof vi.fn>
  
  // Pinia store methods
  $reset: ReturnType<typeof vi.fn>
  $patch: ReturnType<typeof vi.fn>
  $subscribe: ReturnType<typeof vi.fn>
  $dispose: ReturnType<typeof vi.fn>
}

export const createCompleteAuthStoreMock = (): CompleteAuthStoreMock => {
  // Create reactive state
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
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

  // Create reactive computed properties
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

  // Create the complete mock object
  const mockStore: CompleteAuthStoreMock = {
    // Reactive state
    user,
    isAuthenticated,
    isLoading,
    error,
    token,
    isUpdatingProfile,
    profileError,
    isExportingData,
    isDeletingAccount,
    gdprError,
    securityEvents,
    isLoadingSecurityEvents,
    
    // Reactive computed properties
    userRoles,
    userPermissions,
    userMetadata,
    userDisplayName,
    userAvatar,
    isAdmin,
    isPremium,

    // Actions - Core Methods with proper implementations
    setUser: vi.fn().mockImplementation((newUser: User | null) => {
      user.value = newUser
      isAuthenticated.value = !!newUser
      if (newUser) {
        localStorage?.setItem('vana_user', JSON.stringify(newUser))
      } else {
        localStorage?.removeItem('vana_user')
      }
    }),

    setToken: vi.fn().mockImplementation((newToken: string | null) => {
      token.value = newToken
      if (newToken) {
        localStorage?.setItem('vana_token', newToken)
      } else {
        localStorage?.removeItem('vana_token')
      }
    }),

    setLoading: vi.fn().mockImplementation((loading: boolean) => {
      isLoading.value = loading
    }),

    setError: vi.fn().mockImplementation((err: Error | null) => {
      error.value = err
    }),

    clearError: vi.fn().mockImplementation(() => {
      error.value = null
    }),

    initializeFromStorage: vi.fn().mockImplementation(() => {
      // Mock implementation - in real tests, this might populate from localStorage
    }),

    // CRITICAL: The clearAuth method that was missing
    clearAuth: vi.fn().mockImplementation(() => {
      user.value = null
      token.value = null
      error.value = null
      isAuthenticated.value = false
      localStorage?.removeItem('vana_user')
      localStorage?.removeItem('vana_token')
      localStorage?.removeItem('vana_auth_state')
    }),

    // Role/Permission Methods with realistic implementations
    hasRole: vi.fn().mockImplementation((role: Role): boolean => {
      return userRoles.value.includes(role)
    }),

    hasPermission: vi.fn().mockImplementation((permission: Permission): boolean => {
      return userPermissions.value.includes(permission)
    }),

    hasAnyRole: vi.fn().mockImplementation((roles: Role[]): boolean => {
      return roles.some(role => mockStore.hasRole(role))
    }),

    hasAnyPermission: vi.fn().mockImplementation((permissions: Permission[]): boolean => {
      return permissions.some(permission => mockStore.hasPermission(permission))
    }),

    hasAllRoles: vi.fn().mockImplementation((roles: Role[]): boolean => {
      return roles.every(role => mockStore.hasRole(role))
    }),

    hasAllPermissions: vi.fn().mockImplementation((permissions: Permission[]): boolean => {
      return permissions.every(permission => mockStore.hasPermission(permission))
    }),

    // Profile Management Methods
    updateUserProfile: vi.fn().mockImplementation((updates: Partial<User>) => {
      if (user.value) {
        const updatedUser = { ...user.value, ...updates }
        mockStore.setUser(updatedUser)
      }
    }),

    updateUserMetadata: vi.fn().mockImplementation((metadata: Record<string, unknown>) => {
      if (user.value) {
        const updatedUser = {
          ...user.value,
          'https://vana.app/user_metadata': {
            ...(user.value['https://vana.app/user_metadata'] || {}),
            ...metadata,
          },
        }
        mockStore.setUser(updatedUser)
      }
    }),

    updateProfile: vi.fn().mockImplementation(async (profileData: Partial<User>): Promise<void> => {
      if (!user.value) throw new Error('No user to update')
      
      try {
        isUpdatingProfile.value = true
        profileError.value = null
        const updatedUser = { ...user.value, ...profileData }
        mockStore.setUser(updatedUser)
      } catch (err) {
        profileError.value = err instanceof Error ? err.message : 'Profile update failed'
        throw err
      } finally {
        isUpdatingProfile.value = false
      }
    }),

    clearProfileError: vi.fn().mockImplementation(() => {
      profileError.value = null
    }),

    // GDPR Methods
    requestDataExport: vi.fn().mockImplementation(async (): Promise<void> => {
      if (!user.value) throw new Error('No user authenticated')
      
      try {
        isExportingData.value = true
        gdprError.value = null
        // Mock API call would happen here
      } catch (err) {
        gdprError.value = err instanceof Error ? err.message : 'Data export failed'
        throw err
      } finally {
        isExportingData.value = false
      }
    }),

    requestAccountDeletion: vi.fn().mockImplementation(async (): Promise<void> => {
      if (!user.value) throw new Error('No user authenticated')
      
      try {
        isDeletingAccount.value = true
        gdprError.value = null
        // Mock API call would happen here
      } catch (err) {
        gdprError.value = err instanceof Error ? err.message : 'Account deletion failed'
        throw err
      } finally {
        isDeletingAccount.value = false
      }
    }),

    clearGdprError: vi.fn().mockImplementation(() => {
      gdprError.value = null
    }),

    // Security Methods
    loadSecurityEvents: vi.fn().mockImplementation(async (): Promise<void> => {
      if (!user.value) return
      
      try {
        isLoadingSecurityEvents.value = true
        // Mock security events
        securityEvents.value = [
          {
            id: '1',
            type: 'login',
            description: 'Successful login from Chrome on Windows',
            timestamp: new Date(),
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
    }),

    // Utility Methods
    getAuthState: vi.fn().mockImplementation(() => ({
      user: user.value,
      isAuthenticated: isAuthenticated.value,
      isLoading: isLoading.value,
      error: error.value,
      token: token.value,
    })),

    // Pinia store methods
    $reset: vi.fn().mockImplementation(() => {
      user.value = null
      isAuthenticated.value = false
      isLoading.value = false
      error.value = null
      token.value = null
      profileError.value = null
      isUpdatingProfile.value = false
      isExportingData.value = false
      isDeletingAccount.value = false
      gdprError.value = null
      securityEvents.value = []
      isLoadingSecurityEvents.value = false
    }),

    $patch: vi.fn(),
    $subscribe: vi.fn(),
    $dispose: vi.fn(),
  }

  return mockStore
}

/**
 * Enhanced auth composable mock that includes ALL methods from useAuth
 * This prevents "method is not a function" errors in component tests
 */
export interface CompleteAuthComposableMock {
  // Reactive state
  isAuthenticated: { value: boolean }
  isLoading: { value: boolean }
  user: { value: User | null }
  error: { value: Error | null }
  registrationState: { value: { status: string; step: string; error: string | null } }
  registrationProgress: { value: number }
  canRetryRegistration: { value: boolean }
  isExportingData: { value: boolean }
  isDeletingAccount: { value: boolean }
  gdprError: { value: string | null }
  securityEvents: { value: SecurityEvent[] }
  isLoadingSecurityEvents: { value: boolean }

  // Core Auth methods
  checkAuth: ReturnType<typeof vi.fn>
  login: ReturnType<typeof vi.fn>
  loginWithRedirect: ReturnType<typeof vi.fn>
  registerWithRedirect: ReturnType<typeof vi.fn>
  logout: ReturnType<typeof vi.fn>
  
  // Registration methods
  initiateRegistration: ReturnType<typeof vi.fn>
  handleRegistrationCallback: ReturnType<typeof vi.fn>
  checkRegistrationStatus: ReturnType<typeof vi.fn>
  retryRegistration: ReturnType<typeof vi.fn>
  
  // Email verification methods
  resendVerificationEmail: ReturnType<typeof vi.fn>
  checkEmailVerification: ReturnType<typeof vi.fn>
  
  // Permission/Role methods
  hasRole: ReturnType<typeof vi.fn>
  hasPermission: ReturnType<typeof vi.fn>
  hasAnyRole: ReturnType<typeof vi.fn>
  hasAnyPermission: ReturnType<typeof vi.fn>
  hasAllRoles: ReturnType<typeof vi.fn>
  hasAllPermissions: ReturnType<typeof vi.fn>
  
  // Utility methods
  getUserDisplayName: ReturnType<typeof vi.fn>
  getUserAvatar: ReturnType<typeof vi.fn>
  getUserRoles: ReturnType<typeof vi.fn>
  getUserPermissions: ReturnType<typeof vi.fn>
  getUserMetadata: ReturnType<typeof vi.fn>
  isAdmin: ReturnType<typeof vi.fn>
  isPremium: ReturnType<typeof vi.fn>
  getAccessToken: ReturnType<typeof vi.fn>
  refreshToken: ReturnType<typeof vi.fn>
  
  // Profile management
  updateProfile: ReturnType<typeof vi.fn>
  clearProfileError: ReturnType<typeof vi.fn>
  
  // GDPR methods
  requestDataExport: ReturnType<typeof vi.fn>
  requestAccountDeletion: ReturnType<typeof vi.fn>
  clearGdprError: ReturnType<typeof vi.fn>
  
  // Security methods
  loadSecurityEvents: ReturnType<typeof vi.fn>
  
  // Store access
  authStore: CompleteAuthStoreMock
}

export const createCompleteAuthComposableMock = (): CompleteAuthComposableMock => {
  const authStoreMock = createCompleteAuthStoreMock()
  
  return {
    // Reactive state - delegate to store
    isAuthenticated: authStoreMock.isAuthenticated,
    isLoading: authStoreMock.isLoading,
    user: authStoreMock.user,
    error: authStoreMock.error,
    registrationState: ref({ status: 'idle', step: 'email', error: null }),
    registrationProgress: ref(0),
    canRetryRegistration: ref(true),
    isExportingData: authStoreMock.isExportingData,
    isDeletingAccount: authStoreMock.isDeletingAccount,
    gdprError: authStoreMock.gdprError,
    securityEvents: authStoreMock.securityEvents,
    isLoadingSecurityEvents: authStoreMock.isLoadingSecurityEvents,

    // Core Auth methods
    checkAuth: vi.fn().mockResolvedValue(undefined),
    login: vi.fn().mockResolvedValue(undefined),
    loginWithRedirect: vi.fn().mockResolvedValue(undefined),
    registerWithRedirect: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn().mockImplementation(async (_returnTo?: string) => {
      // Call the store's clearAuth method to ensure consistency
      authStoreMock.clearAuth()
    }),
    
    // Registration methods
    initiateRegistration: vi.fn().mockResolvedValue({ success: true, auth0Id: 'test-id' }),
    handleRegistrationCallback: vi.fn().mockResolvedValue(undefined),
    checkRegistrationStatus: vi.fn().mockResolvedValue({ status: 'completed' }),
    retryRegistration: vi.fn().mockResolvedValue(undefined),
    
    // Email verification methods  
    resendVerificationEmail: vi.fn().mockResolvedValue(undefined),
    checkEmailVerification: vi.fn().mockResolvedValue(false),
    
    // Permission/Role methods - delegate to store
    hasRole: authStoreMock.hasRole,
    hasPermission: authStoreMock.hasPermission,
    hasAnyRole: authStoreMock.hasAnyRole,
    hasAnyPermission: authStoreMock.hasAnyPermission,
    hasAllRoles: authStoreMock.hasAllRoles,
    hasAllPermissions: authStoreMock.hasAllPermissions,
    
    // Utility methods
    getUserDisplayName: vi.fn().mockReturnValue('Test User'),
    getUserAvatar: vi.fn().mockReturnValue('https://example.com/avatar.jpg'),
    getUserRoles: vi.fn().mockReturnValue(['user']),
    getUserPermissions: vi.fn().mockReturnValue(['read:calendar']),
    getUserMetadata: vi.fn().mockReturnValue({}),
    isAdmin: vi.fn().mockReturnValue(false),
    isPremium: vi.fn().mockReturnValue(false),
    getAccessToken: vi.fn().mockResolvedValue('mock-token'),
    refreshToken: vi.fn().mockResolvedValue('mock-refreshed-token'),
    
    // Profile management - delegate to store
    updateProfile: authStoreMock.updateProfile,
    clearProfileError: authStoreMock.clearProfileError,
    
    // GDPR methods - delegate to store
    requestDataExport: authStoreMock.requestDataExport,
    requestAccountDeletion: authStoreMock.requestAccountDeletion,
    clearGdprError: authStoreMock.clearGdprError,
    
    // Security methods - delegate to store
    loadSecurityEvents: authStoreMock.loadSecurityEvents,
    
    // Store access
    authStore: authStoreMock,
  }
}