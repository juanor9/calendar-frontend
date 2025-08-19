import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { watch } from 'vue'
import { useAuth } from '../composables/useAuth'
import type { Role, Permission, GuardOptions } from './types'

// Auth guard that requires authentication
export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  try {
    const { isAuthenticated, isLoading, checkAuth } = useAuth()

    // Wait for auth initialization if still loading
    if (isLoading.value) {
      // Give it a moment to initialize
      await new Promise(resolve => {
        const unwatch = watch(isLoading, loading => {
          if (!loading) {
            unwatch()
            resolve(void 0)
          }
        })

        // Timeout after 5 seconds
        setTimeout(() => {
          unwatch()
          resolve(void 0)
        }, 5000)
      })
    }

    // Double-check authentication status
    await checkAuth()

    if (isAuthenticated.value) {
      next()
    } else {
      // Store intended URL for redirect after login
      const targetUrl = to.fullPath
      next({
        name: 'Login',
        query: {
          redirect: targetUrl,
          reason: 'authentication_required',
        },
      })
    }
  } catch (error) {
    console.error('Auth guard error:', error)
    next({
      name: 'Login',
      query: {
        redirect: to.fullPath,
        reason: 'auth_error',
      },
    })
  }
}

// Guest guard that redirects authenticated users
export const guestGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  try {
    const { isAuthenticated, isLoading, checkAuth } = useAuth()

    // Wait for auth initialization
    if (isLoading.value) {
      await new Promise(resolve => {
        const unwatch = watch(isLoading, loading => {
          if (!loading) {
            unwatch()
            resolve(void 0)
          }
        })

        setTimeout(() => {
          unwatch()
          resolve(void 0)
        }, 5000)
      })
    }

    await checkAuth()

    if (isAuthenticated.value) {
      // Redirect authenticated users to dashboard or specified route
      const redirectTo = (to.query.redirect as string) || '/'
      next(redirectTo)
    } else {
      next()
    }
  } catch (error) {
    console.error('Guest guard error:', error)
    next()
  }
}

// Role guard factory
export const createRoleGuard = (requiredRoles: Role[], options: GuardOptions = {}) => {
  return async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    try {
      const { isAuthenticated, hasAnyRole, checkAuth } = useAuth()

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

      if (hasAnyRole(requiredRoles)) {
        next()
      } else {
        next({
          name: options.redirectTo || 'Unauthorized',
          query: {
            reason: 'insufficient_role',
            required: requiredRoles.join(','),
          },
        })
      }
    } catch (error) {
      console.error('Role guard error:', error)
      next({
        name: 'Login',
        query: {
          redirect: to.fullPath,
          reason: 'auth_error',
        },
      })
    }
  }
}

// Permission guard factory
export const createPermissionGuard = (
  requiredPermissions: Permission[],
  options: GuardOptions = {}
) => {
  return async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    try {
      const { isAuthenticated, hasAnyPermission, checkAuth } = useAuth()

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

      if (hasAnyPermission(requiredPermissions)) {
        next()
      } else {
        next({
          name: options.redirectTo || 'Unauthorized',
          query: {
            reason: 'insufficient_permission',
            required: requiredPermissions.join(','),
          },
        })
      }
    } catch (error) {
      console.error('Permission guard error:', error)
      next({
        name: 'Login',
        query: {
          redirect: to.fullPath,
          reason: 'auth_error',
        },
      })
    }
  }
}

// Admin guard (convenience method)
export const adminGuard = createRoleGuard(['admin', 'super_admin'])

// Premium guard (convenience method)
export const premiumGuard = createRoleGuard(['premium', 'admin', 'super_admin'])

// Combined guard that checks both roles and permissions
export const createCombinedGuard = (
  roles: Role[] = [],
  permissions: Permission[] = [],
  options: GuardOptions = {}
) => {
  return async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    try {
      const { isAuthenticated, hasAnyRole, hasAnyPermission, checkAuth } = useAuth()

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

      const hasRequiredRole = roles.length === 0 || hasAnyRole(roles)
      const hasRequiredPermission = permissions.length === 0 || hasAnyPermission(permissions)

      if (hasRequiredRole && hasRequiredPermission) {
        next()
      } else {
        next({
          name: options.redirectTo || 'Unauthorized',
          query: {
            reason: 'insufficient_access',
            required_roles: roles.join(','),
            required_permissions: permissions.join(','),
          },
        })
      }
    } catch (error) {
      console.error('Combined guard error:', error)
      next({
        name: 'Login',
        query: {
          redirect: to.fullPath,
          reason: 'auth_error',
        },
      })
    }
  }
}

// Helper to get guard error messages
export const getGuardErrorMessage = (reason: string, required?: string): string => {
  switch (reason) {
    case 'authentication_required':
      return 'Debes iniciar sesión para acceder a esta página'
    case 'insufficient_role':
      return `No tienes los permisos necesarios. Roles requeridos: ${required}`
    case 'insufficient_permission':
      return `No tienes los permisos necesarios. Permisos requeridos: ${required}`
    case 'insufficient_access':
      return 'No tienes suficientes permisos para acceder a esta página'
    case 'auth_error':
      return 'Error de autenticación. Por favor intenta nuevamente'
    default:
      return 'Acceso denegado'
  }
}

// Watch helper function is imported at the top
