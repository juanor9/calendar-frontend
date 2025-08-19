import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, AuthState, Role, Permission, SecurityEvent } from '@/features/authentication/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(true)
  const error = ref<Error | null>(null)
  const token = ref<string | null>(null)

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

  const setError = (err: Error | null) => {
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
          ...(user.value['https://vana.app/user_metadata'] || {}),
          ...metadata,
        },
      }
      setUser(updatedUser)
    }
  }

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
      // API call will be handled by the component using backend endpoints
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
      // API call will be handled by the component using backend endpoints
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
      // Mock data for now - real implementation would fetch from backend
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
  }

  const clearProfileError = (): void => {
    profileError.value = null
  }

  const clearGdprError = (): void => {
    gdprError.value = null
  }

  // Get current state as plain object
  const getAuthState = (): AuthState => ({
    user: user.value,
    isAuthenticated: isAuthenticated.value,
    isLoading: isLoading.value,
    error: error.value,
    token: token.value,
  })

  return {
    // State
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

    // Computed
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
  }
})
