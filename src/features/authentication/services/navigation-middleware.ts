/**
 * Navigation Middleware for F001 Authentication System
 * Handles pre-navigation authentication checks, token refresh, and error boundaries
 */

import type { Router, RouteLocationNormalized } from 'vue-router'
import { useAuth } from '@/features/authentication/composables/useAuth'
import { useOnboarding } from '@/features/onboarding/composables/useOnboarding'
import { getEnhancedGuardErrorMessage } from '@/features/authentication/services/route-guards'

/**
 * Authentication middleware configuration
 */
interface MiddlewareConfig {
  enableTokenRefresh: boolean
  enableSessionValidation: boolean
  enableActivityTracking: boolean
  sessionTimeoutMs: number
  tokenRefreshThresholdMs: number
}

const defaultConfig: MiddlewareConfig = {
  enableTokenRefresh: true,
  enableSessionValidation: true,
  enableActivityTracking: true,
  sessionTimeoutMs: 24 * 60 * 60 * 1000, // 24 hours
  tokenRefreshThresholdMs: 5 * 60 * 1000, // 5 minutes
}

/**
 * Install navigation middleware on router instance
 */
export const installNavigationMiddleware = (
  router: Router,
  config: Partial<MiddlewareConfig> = {}
): void => {
  const middlewareConfig = { ...defaultConfig, ...config }

  // Pre-navigation middleware
  router.beforeEach(async (to, from, next) => {
    try {
      // Skip middleware for certain routes
      if (shouldSkipMiddleware(to)) {
        return next()
      }

      // Run authentication checks
      await runPreNavigationChecks(to, from, middlewareConfig)

      // Update activity tracking
      if (middlewareConfig.enableActivityTracking) {
        updateActivityTracking(to)
      }

      next()
    } catch (error) {
      console.error('Navigation middleware error:', error)
      handleNavigationError(error, to, next)
    }
  })

  // Post-navigation middleware
  router.afterEach((to, from) => {
    try {
      // Update page title
      updatePageTitle(to)

      // Handle page transition UI
      handlePageTransition(to, from)

      // Track navigation for analytics
      trackNavigation(to, from)

      // Update user activity timestamp
      if (middlewareConfig.enableActivityTracking) {
        localStorage.setItem('last_activity', Date.now().toString())
      }
    } catch (error) {
      console.error('Post-navigation middleware error:', error)
    }
  })

  // Error handling middleware
  router.onError(error => {
    console.error('Router error middleware:', error)
    handleRouterError(error, router)
  })
}

/**
 * Check if middleware should be skipped for specific routes
 */
const shouldSkipMiddleware = (to: RouteLocationNormalized): boolean => {
  const skipRoutes = ['AuthCallback', 'Error', 'NotFound']

  return skipRoutes.includes(to.name as string) || to.meta?.skipAuth === true
}

/**
 * Run pre-navigation authentication checks
 */
const runPreNavigationChecks = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  config: MiddlewareConfig
): Promise<void> => {
  const { isAuthenticated, isLoading, checkAuth } = useAuth()

  // Skip checks for public routes
  if (!to.meta?.requiresAuth) {
    return
  }

  // Wait for auth initialization if needed
  if (isLoading.value) {
    await waitForAuthInitialization()
  }

  // Validate session if enabled
  if (config.enableSessionValidation) {
    await validateSession(config.sessionTimeoutMs)
  }

  // Check authentication status
  await checkAuth()

  if (!isAuthenticated.value) {
    throw new NavigationError('authentication_required', to.fullPath)
  }

  // Refresh token if needed
  if (config.enableTokenRefresh) {
    await refreshTokenIfNeeded(config.tokenRefreshThresholdMs)
  }
}

/**
 * Wait for authentication initialization
 */
const waitForAuthInitialization = (): Promise<void> => {
  return new Promise(resolve => {
    const { isLoading } = useAuth()

    if (!isLoading.value) {
      return resolve()
    }

    const checkLoading = () => {
      if (!isLoading.value) {
        resolve()
      } else {
        setTimeout(checkLoading, 100)
      }
    }

    // Start checking with timeout
    setTimeout(resolve, 5000) // 5 second timeout
    checkLoading()
  })
}

/**
 * Validate current session
 */
const validateSession = async (timeoutMs: number): Promise<void> => {
  const lastLogin = localStorage.getItem('last_login')
  const now = Date.now()

  if (lastLogin && now - parseInt(lastLogin) > timeoutMs) {
    // Clear expired session
    localStorage.removeItem('last_login')
    localStorage.removeItem('last_activity')
    sessionStorage.clear()

    throw new NavigationError('session_timeout', '')
  }
}

/**
 * Refresh authentication token if needed
 */
const refreshTokenIfNeeded = async (thresholdMs: number): Promise<void> => {
  try {
    const lastRefresh = localStorage.getItem('token_last_refresh')
    const now = Date.now()

    if (!lastRefresh || now - parseInt(lastRefresh) > thresholdMs) {
      const { isAuthenticated, checkAuth } = useAuth()

      if (isAuthenticated.value) {
        await checkAuth() // This will refresh the token silently
        localStorage.setItem('token_last_refresh', now.toString())
      }
    }
  } catch (error) {
    console.warn('Token refresh failed:', error)
    // Don't throw here to avoid blocking navigation
  }
}

/**
 * Update activity tracking
 */
const updateActivityTracking = (to: RouteLocationNormalized): void => {
  const now = Date.now()
  localStorage.setItem('last_activity', now.toString())

  // Track route visits for analytics
  const visitHistory = JSON.parse(localStorage.getItem('route_history') || '[]') as Array<{
    path: string
    timestamp: number
    title?: string
  }>

  visitHistory.push({
    path: to.fullPath,
    timestamp: now,
    title: to.meta?.title as string,
  })

  // Keep only last 50 visits
  const recentHistory = visitHistory.slice(-50)
  localStorage.setItem('route_history', JSON.stringify(recentHistory))
}

/**
 * Update page title
 */
const updatePageTitle = (to: RouteLocationNormalized): void => {
  const title = to.meta?.title as string
  if (title) {
    document.title = title
  }
}

/**
 * Handle page transition UI
 */
const handlePageTransition = (to: RouteLocationNormalized, from: RouteLocationNormalized): void => {
  const body = document.body

  // Remove loading states
  body.classList.remove('page-transitioning')

  // Smooth scroll to top on route change (except for hash navigation)
  if (to.path !== from.path && !to.hash) {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  // Add route-specific classes
  body.className = body.className.replace(/route-[a-zA-Z0-9-_]*/g, '')
  if (to.name) {
    body.classList.add(
      `route-${String(to.name)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')}`
    )
  }
}

/**
 * Track navigation for analytics
 */
const trackNavigation = (to: RouteLocationNormalized, from: RouteLocationNormalized): void => {
  if (import.meta.env.DEV) {
    console.log('Navigation tracked:', {
      from: from.fullPath,
      to: to.fullPath,
      meta: to.meta,
      timestamp: new Date().toISOString(),
    })
  }

  // Here you could integrate with analytics services like Google Analytics, Mixpanel, etc.
  // Example: gtag('event', 'page_view', { page_path: to.fullPath })
}

/**
 * Handle navigation errors
 */
const handleNavigationError = (
  error: unknown,
  to: RouteLocationNormalized,
  next: (location?: string | false | void | Error | import('vue-router').RouteLocationRaw) => void
): void => {
  console.error('Navigation error:', error)

  if (error instanceof NavigationError) {
    switch (error.reason) {
      case 'authentication_required':
        next({
          name: 'Login',
          query: {
            redirect: error.redirectPath,
            reason: error.reason,
          },
        })
        break

      case 'session_timeout':
        next({
          name: 'Login',
          query: {
            redirect: to.fullPath,
            reason: 'session_timeout',
            message: getEnhancedGuardErrorMessage('session_timeout'),
          },
        })
        break

      default:
        next({
          name: 'Error',
          query: {
            reason: error.reason,
            from: to.fullPath,
          },
        })
    }
  } else {
    next({
      name: 'Error',
      query: {
        reason: 'navigation_error',
        from: to.fullPath,
      },
    })
  }
}

/**
 * Handle router errors
 */
const handleRouterError = (error: Error, router: Router): void => {
  console.error('Router error:', error)

  // Handle specific error types
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    // Handle chunk load errors (common in production)
    const shouldReload = confirm(
      'The application has been updated. Please reload the page to get the latest version.'
    )
    if (shouldReload) {
      window.location.reload()
    }
  } else if (error.message.includes('Navigation cancelled')) {
    // Navigation was cancelled, this is usually fine
    return
  } else {
    // Other router errors
    router.push({
      name: 'Error',
      query: {
        message: error.message,
        from: router.currentRoute.value.fullPath,
        type: 'router_error',
      },
    })
  }
}

/**
 * Custom navigation error class
 */
class NavigationError extends Error {
  constructor(
    public reason: string,
    public redirectPath: string,
    message?: string
  ) {
    super(message || `Navigation error: ${reason}`)
    this.name = 'NavigationError'
  }
}

/**
 * Middleware for handling authentication redirects after login
 */
export const handleAuthRedirect = (router: Router): void => {
  // Handle stored redirects after authentication
  const storedRedirect = localStorage.getItem('auth_redirect')
  const securityRedirect = localStorage.getItem('security_redirect')

  if (storedRedirect) {
    localStorage.removeItem('auth_redirect')
    router.push(storedRedirect)
    return
  }

  if (securityRedirect) {
    localStorage.removeItem('security_redirect')
    router.push(securityRedirect)
    return
  }

  // Check onboarding status for default redirect
  const { isOnboardingComplete } = useOnboarding()
  const defaultPath = isOnboardingComplete.value ? '/dashboard' : '/onboarding'
  router.push(defaultPath)
}

/**
 * Clear navigation-related storage on logout
 */
export const clearNavigationStorage = (): void => {
  const keysToRemove = [
    'auth_redirect',
    'security_redirect',
    'last_activity',
    'last_login',
    'token_last_refresh',
    'route_history',
    'mfa_verified',
  ]

  keysToRemove.forEach(key => {
    localStorage.removeItem(key)
  })

  sessionStorage.clear()
}

/**
 * Store current route for post-auth redirect
 */
export const storeAuthRedirect = (path: string): void => {
  // Don't store certain paths
  const skipPaths = ['/auth/login', '/auth/logout', '/auth/callback', '/']

  if (!skipPaths.includes(path) && !path.startsWith('/auth/')) {
    localStorage.setItem('auth_redirect', path)
  }
}

/**
 * Check if user needs to update their password
 */
export const checkPasswordUpdateRequired = async (): Promise<boolean> => {
  try {
    const { user } = useAuth()

    if (!user.value) return false

    const lastPasswordUpdate = user.value?.['https://vana.app/user_metadata']?.last_password_update

    if (!lastPasswordUpdate) return true // Never set password

    // Check if password is older than 90 days
    const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000
    return new Date(lastPasswordUpdate).getTime() < ninetyDaysAgo
  } catch (error) {
    console.error('Password check error:', error)
    return false
  }
}

/**
 * Utility to get current user session info
 */
export const getSessionInfo = (): {
  isActive: boolean
  lastActivity: number | null
  sessionDuration: number | null
} => {
  const lastActivity = localStorage.getItem('last_activity')
  const lastLogin = localStorage.getItem('last_login')

  return {
    isActive: !!lastActivity,
    lastActivity: lastActivity ? parseInt(lastActivity) : null,
    sessionDuration:
      lastLogin && lastActivity ? parseInt(lastActivity) - parseInt(lastLogin) : null,
  }
}
