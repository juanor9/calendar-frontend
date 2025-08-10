// Auth exports - main entry point for authentication
export { auth0Plugin, createAuth0Plugin, isAuth0Configured } from './auth0-plugin'
export { auth0Config, createAuth0Config, validateAuth0Config } from './auth0-config'
export { useAuth, Auth0ClientKey } from './auth-composable'
export {
  authGuard,
  guestGuard,
  adminGuard,
  premiumGuard,
  createRoleGuard,
  createPermissionGuard,
  createCombinedGuard,
  getGuardErrorMessage,
} from './auth-guard'
export type {
  User,
  AuthState,
  LoginOptions,
  AuthConfig,
  Permission,
  Role,
  RouteGuardContext,
  GuardOptions,
} from './types'

// Apollo auth integration
export {
  createAuthLink,
  createErrorLink,
  createTokenRefreshLink,
  createCombinedAuthLink,
  isAuthError,
  getErrorMessage,
} from '../utils/apollo-auth'
