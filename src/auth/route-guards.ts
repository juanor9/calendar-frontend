/**
 * Enhanced Route Guards for F001 Authentication System
 * Provides comprehensive authentication, permission, and flow-based routing protection
 */

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useOnboarding } from '@/composables/useOnboarding'

// Re-export existing basic guards for compatibility
export {
  authGuard,
  guestGuard,
  adminGuard,
  premiumGuard,
  createRoleGuard,
  createPermissionGuard,
  createCombinedGuard,
} from '@/auth/auth-guard'

/**
 * Enhanced authentication guard with onboarding flow protection
 */
export const enhancedAuthGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  try {
    const { isAuthenticated, isLoading, checkAuth } = useAuth()
    const { isOnboardingComplete, checkOnboardingStatus } = useOnboarding()

    // Wait for auth initialization if still loading
    if (isLoading.value) {
      await new Promise<void>(resolve => {
        const unwatch = watch(isLoading, loading => {
          if (!loading) {
            unwatch()
            resolve()
          }
        })

        // Timeout after 5 seconds
        setTimeout(() => {
          unwatch()
          resolve()
        }, 5000)
      })
    }

    // Double-check authentication status
    await checkAuth()

    if (!isAuthenticated.value) {
      next({
        name: 'Login',
        query: {
          redirect: to.fullPath,
          reason: 'authentication_required',
        },
      })
      return
    }

    // Check onboarding completion if required by route
    if (to.meta?.requiresCompletedOnboarding) {
      await checkOnboardingStatus()

      if (!isOnboardingComplete.value) {
        next({
          name: 'Onboarding',
          query: {
            redirect: to.fullPath,
            reason: 'onboarding_required',
          },
        })
        return
      }
    }

    // Check for incomplete onboarding routes (onboarding flow)
    if (to.meta?.requiresIncompleteOnboarding) {
      await checkOnboardingStatus()

      if (isOnboardingComplete.value) {
        next({
          name: 'Dashboard',
          query: {
            from: 'onboarding_complete',
          },
        })
        return
      }
    }

    next()
  } catch (error) {
    console.error('Enhanced auth guard error:', error)
    next({
      name: 'Login',
      query: {
        redirect: to.fullPath,
        reason: 'auth_error',
      },
    })
  }
}

/**
 * Email verification guard - requires authenticated user with verified email
 */
export const emailVerificationGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  try {
    const { isAuthenticated, user, checkAuth, checkEmailVerification } = useAuth()

    await checkAuth()

    if (!isAuthenticated.value) {
      next({
        name: 'Login',
        query: {
          redirect: to.fullPath,
          reason: 'authentication_required',
        },
      })
      return
    }

    if (!user.value?.email_verified) {
      // Check current verification status
      const isVerified = user.value?.sub ? await checkEmailVerification(user.value.sub) : false

      if (!isVerified) {
        next({
          name: 'EmailVerification',
          query: {
            email: user.value?.email || '',
            redirect: to.fullPath,
            reason: 'email_verification_required',
          },
        })
        return
      }
    }

    next()
  } catch (error) {
    console.error('Email verification guard error:', error)
    next({
      name: 'EmailVerification',
      query: {
        redirect: to.fullPath,
        reason: 'verification_error',
      },
    })
  }
}

/**
 * Onboarding flow guard - ensures user is in correct onboarding step
 */
export const onboardingFlowGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  try {
    const { isAuthenticated, checkAuth } = useAuth()
    const { currentStep, isOnboardingComplete, checkOnboardingStatus } = useOnboarding()

    await checkAuth()

    if (!isAuthenticated.value) {
      next({
        name: 'Login',
        query: {
          redirect: '/onboarding',
          reason: 'authentication_required',
        },
      })
      return
    }

    await checkOnboardingStatus()

    // If onboarding is complete, redirect to dashboard
    if (isOnboardingComplete.value) {
      next({
        name: 'Dashboard',
        query: {
          from: 'onboarding_complete',
        },
      })
      return
    }

    // Check if user is accessing the correct step
    const targetStep = to.meta?.step as string
    const allowedSteps = ['welcome', 'preferences', 'calendar_sync', 'ai_setup', 'tutorial']

    if (targetStep && allowedSteps.includes(targetStep)) {
      // Allow access to current step and any previous steps
      const currentStepIndex = allowedSteps.indexOf(currentStep.value)
      const targetStepIndex = allowedSteps.indexOf(targetStep)

      if (targetStepIndex <= currentStepIndex) {
        next()
        return
      }
    }

    // Redirect to current onboarding step
    const stepRouteMap: Record<string, string> = {
      welcome: 'OnboardingWelcome',
      preferences: 'OnboardingPreferences',
      calendar_sync: 'OnboardingCalendar',
      ai_setup: 'OnboardingAiSetup',
      tutorial: 'OnboardingTutorial',
    }

    next({
      name: stepRouteMap[currentStep.value] || 'OnboardingWelcome',
      query: {
        from: 'flow_redirect',
      },
    })
  } catch (error) {
    console.error('Onboarding flow guard error:', error)
    next({
      name: 'OnboardingWelcome',
      query: {
        reason: 'flow_error',
      },
    })
  }
}

/**
 * Enhanced guest guard with session cleanup
 */
export const enhancedGuestGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  try {
    const { isAuthenticated, isLoading, checkAuth } = useAuth()
    const { isOnboardingComplete, checkOnboardingStatus } = useOnboarding()

    // Wait for auth initialization
    if (isLoading.value) {
      await new Promise<void>(resolve => {
        const unwatch = watch(isLoading, loading => {
          if (!loading) {
            unwatch()
            resolve()
          }
        })

        setTimeout(() => {
          unwatch()
          resolve()
        }, 5000)
      })
    }

    await checkAuth()

    if (isAuthenticated.value) {
      // Check onboarding status to determine redirect
      await checkOnboardingStatus()

      const redirectTo = isOnboardingComplete.value ? '/dashboard' : '/onboarding'
      const redirectQuery = to.query.redirect as string

      next({
        path: redirectQuery || redirectTo,
        query: {
          from: 'guest_redirect',
        },
      })
    } else {
      next()
    }
  } catch (error) {
    console.error('Enhanced guest guard error:', error)
    next()
  }
}

/**
 * Security-sensitive route guard (for settings, security pages)
 */
export const securityRouteGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  try {
    const { isAuthenticated, user, checkAuth, checkEmailVerification } = useAuth()

    await checkAuth()

    if (!isAuthenticated.value) {
      next({
        name: 'Login',
        query: {
          redirect: to.fullPath,
          reason: 'authentication_required',
        },
      })
      return
    }

    // Ensure email is verified for security-sensitive routes
    if (!user.value?.email_verified) {
      const isVerified = user.value?.sub ? await checkEmailVerification(user.value.sub) : false

      if (!isVerified) {
        next({
          name: 'EmailVerification',
          query: {
            email: user.value?.email || '',
            redirect: to.fullPath,
            reason: 'security_verification_required',
          },
        })
        return
      }
    }

    // Check if session is recent enough (optional additional security)
    const sessionThreshold = 30 * 60 * 1000 // 30 minutes
    const lastActivity = localStorage.getItem('last_activity')
    const now = Date.now()

    if (lastActivity && now - parseInt(lastActivity) > sessionThreshold) {
      // Require re-authentication for security routes
      localStorage.setItem('security_redirect', to.fullPath)
      next({
        name: 'Login',
        query: {
          redirect: to.fullPath,
          reason: 'session_expired',
          security: 'true',
        },
      })
      return
    }

    // Update last activity
    localStorage.setItem('last_activity', now.toString())
    next()
  } catch (error) {
    console.error('Security route guard error:', error)
    next({
      name: 'Login',
      query: {
        redirect: to.fullPath,
        reason: 'security_error',
      },
    })
  }
}

/**
 * Multi-factor authentication guard (future enhancement)
 */
export const mfaGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  try {
    const { isAuthenticated, user, checkAuth } = useAuth()

    await checkAuth()

    if (!isAuthenticated.value) {
      next({
        name: 'Login',
        query: {
          redirect: to.fullPath,
          reason: 'authentication_required',
        },
      })
      return
    }

    // Check if route requires MFA
    if (to.meta?.requiresMfa) {
      const hasMfaEnabled = user.value?.['https://vana.app/user_metadata']?.mfa_enabled || false
      const mfaVerified = sessionStorage.getItem('mfa_verified') === 'true'

      if (hasMfaEnabled && !mfaVerified) {
        next({
          name: 'MfaVerification', // TODO: Create MFA verification page
          query: {
            redirect: to.fullPath,
            reason: 'mfa_required',
          },
        })
        return
      }
    }

    next()
  } catch (error) {
    console.error('MFA guard error:', error)
    next()
  }
}

/**
 * Feature flag guard - checks if user has access to beta features
 */
export const featureFlagGuard = (featureFlag: string) => {
  return async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ): Promise<void> => {
    try {
      const { isAuthenticated, user, hasRole, checkAuth } = useAuth()

      await checkAuth()

      if (!isAuthenticated.value) {
        next({
          name: 'Login',
          query: {
            redirect: to.fullPath,
            reason: 'authentication_required',
          },
        })
        return
      }

      // Check feature flag access (admin/premium users get beta access)
      const hasFeatureAccess =
        hasRole('admin') ||
        hasRole('super_admin') ||
        hasRole('premium') ||
        user.value?.['https://vana.app/user_metadata']?.beta_features?.includes(featureFlag)

      if (!hasFeatureAccess) {
        next({
          name: 'Unauthorized',
          query: {
            reason: 'feature_not_available',
            feature: featureFlag,
          },
        })
        return
      }

      next()
    } catch (error) {
      console.error('Feature flag guard error:', error)
      next({
        name: 'Unauthorized',
        query: {
          reason: 'feature_error',
          feature: featureFlag,
        },
      })
    }
  }
}

/**
 * Session timeout guard - checks for session validity
 */
export const sessionTimeoutGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  try {
    const { isAuthenticated, checkAuth } = useAuth()

    // Check session timeout (24 hours)
    const sessionTimeout = 24 * 60 * 60 * 1000 // 24 hours
    const lastLogin = localStorage.getItem('last_login')
    const now = Date.now()

    if (lastLogin && now - parseInt(lastLogin) > sessionTimeout) {
      // Clear session and require re-authentication
      localStorage.removeItem('last_login')
      localStorage.removeItem('last_activity')

      next({
        name: 'Login',
        query: {
          redirect: to.fullPath,
          reason: 'session_timeout',
        },
      })
      return
    }

    // If we have a fresh session, proceed with normal auth check
    await checkAuth()

    if (!isAuthenticated.value) {
      next({
        name: 'Login',
        query: {
          redirect: to.fullPath,
          reason: 'authentication_required',
        },
      })
      return
    }

    next()
  } catch (error) {
    console.error('Session timeout guard error:', error)
    next({
      name: 'Login',
      query: {
        redirect: to.fullPath,
        reason: 'session_error',
      },
    })
  }
}

/**
 * Guard composition utility - combines multiple guards
 */
export const composeGuards = (
  ...guards: Array<
    (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => Promise<void>
  >
) => {
  return async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ): Promise<void> => {
    try {
      // Execute guards sequentially - simplified approach to avoid TypeScript issues
      for (const guard of guards) {
        await guard(to, from, next)
      }
    } catch (error) {
      console.error('Guard composition error:', error)
      next('/auth/login') // Default fallback
    }
  }
}

/**
 * Get user-friendly error messages for guard failures
 */
export const getEnhancedGuardErrorMessage = (
  reason: string,
  context?: Record<string, string>
): string => {
  switch (reason) {
    case 'authentication_required':
      return 'You must be logged in to access this page'
    case 'email_verification_required':
      return 'Please verify your email address to continue'
    case 'onboarding_required':
      return 'Complete your account setup to access this feature'
    case 'security_verification_required':
      return 'Additional verification required for security settings'
    case 'session_expired':
      return 'Your session has expired. Please log in again'
    case 'session_timeout':
      return 'Your session has timed out for security. Please log in again'
    case 'mfa_required':
      return 'Multi-factor authentication required'
    case 'feature_not_available':
      return `This feature is not available for your account type${context?.feature ? ': ' + context.feature : ''}`
    case 'insufficient_role':
      return `Insufficient permissions. Required roles: ${context?.required || 'admin'}`
    case 'insufficient_permission':
      return `Insufficient permissions. Required permissions: ${context?.required || 'admin access'}`
    case 'insufficient_access':
      return 'You do not have sufficient permissions to access this page'
    case 'auth_error':
    case 'verification_error':
    case 'flow_error':
    case 'security_error':
    case 'session_error':
    case 'feature_error':
    case 'guard_composition_error':
      return 'Authentication error occurred. Please try logging in again'
    default:
      return 'Access denied'
  }
}
