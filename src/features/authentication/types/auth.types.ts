// Authentication types
export interface LoginOptions {
  redirect_uri?: string
  appState?: Record<string, unknown>
}

export interface AuthUser {
  sub?: string
  name?: string
  email?: string
  picture?: string
  phone_number?: string
  zoneinfo?: string
  timezone?: string
  given_name?: string
  family_name?: string
  locale?: string
  nickname?: string
  calendar_preferences?: {
    default_view?: string
    time_format?: string
    start_of_week?: number
    start_hour?: number
    end_hour?: number
  }
  last_password_update?: Date | string
  mfa_enabled?: boolean
  beta_features?: boolean
  'https://vana.app/user_metadata'?: {
    timezone?: string
    calendar_preferences?: {
      default_view?: string
      time_format?: string
      start_of_week?: number
      start_hour?: number
      end_hour?: number
    }
    last_password_update?: Date | string
    beta_features?: string[]
    [key: string]: unknown
  }
  'https://vana.app/job_title'?: string
  'https://vana.app/company'?: string
  [key: string]: unknown
}

// User type alias
export type User = AuthUser

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: Error | null
  token: string | null
}

// AppState type alias
export type AppState = Record<string, unknown>

export interface RoleObject {
  id: string
  name: string
  permissions: string[]
}

export type Role = string | RoleObject

export interface PermissionObject {
  id: string
  name: string
  description?: string
}

export type Permission = string | PermissionObject

export interface SecurityEvent {
  id: string
  type: 'login' | 'logout' | 'password_change' | 'profile_update' | 'failed_login' | 'token_refresh' | string
  description?: string
  timestamp: Date | string
  userId?: string
  ipAddress?: string
  userAgent?: string
  location?: string
  metadata?: Record<string, unknown>
}