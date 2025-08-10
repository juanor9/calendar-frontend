import type { User as Auth0User } from '@auth0/auth0-spa-js'

// Auth0 User extended with custom metadata
export interface User extends Auth0User {
  // Standard Auth0 fields
  sub: string
  name?: string
  given_name?: string
  family_name?: string
  middle_name?: string
  nickname?: string
  preferred_username?: string
  profile?: string
  picture?: string
  website?: string
  email?: string
  email_verified?: boolean
  gender?: string
  birthdate?: string
  zoneinfo?: string
  locale?: string
  phone_number?: string
  phone_number_verified?: boolean
  address?: string
  updated_at?: string

  // Additional custom fields for registration compatibility
  id?: string
  created_at?: string

  // Custom app metadata
  'https://vana.app/roles'?: string[]
  'https://vana.app/permissions'?: string[]
  'https://vana.app/user_metadata'?: {
    timezone?: string
    calendar_preferences?: {
      default_view?: 'week' | 'month' | 'day'
      start_hour?: number
      end_hour?: number
      work_days?: number[]
    }
    notification_preferences?: {
      email_notifications?: boolean
      push_notifications?: boolean
      reminder_minutes?: number[]
    }
  }
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  token: string | null
}

// App State for Auth0 callbacks
export interface AppState {
  targetUrl?: string
  action?: string
  email?: string
  source?: string
}

export interface LoginOptions {
  redirect_uri?: string
  appState?: AppState
}

export interface AuthConfig {
  domain: string
  clientId: string
  audience: string
  redirectUri: string
  logoutUrl: string
  scope: string
  useRefreshTokens: boolean
  cacheLocation: 'memory' | 'localstorage'
}

export type Permission =
  | 'read:calendar'
  | 'write:calendar'
  | 'delete:calendar'
  | 'read:tasks'
  | 'write:tasks'
  | 'delete:tasks'
  | 'admin:users'
  | 'admin:system'

export type Role = 'user' | 'premium' | 'admin' | 'super_admin'

// Router guard types
export interface RouteGuardContext {
  to: import('vue-router').RouteLocationNormalized
  from: import('vue-router').RouteLocationNormalized
  next: import('vue-router').NavigationGuardNext
}

export interface GuardOptions {
  requiredRoles?: Role[]
  requiredPermissions?: Permission[]
  redirectTo?: string
}
