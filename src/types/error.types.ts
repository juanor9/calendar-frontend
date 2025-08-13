// Error handling types following TypeScript best practices
// Addresses common error pattern: Missing return types (30% of failures)

export interface BaseError {
  code: string
  message: string
  timestamp: string
  context?: Record<string, unknown>
}

export interface AuthError extends BaseError {
  type: 'auth'
  subType: 'login' | 'logout' | 'token_refresh' | 'callback' | 'session_timeout' | 'rate_limit'
  retryable: boolean
  recoveryAction?: ErrorRecoveryAction
}

export interface ValidationError extends BaseError {
  type: 'validation'
  field: string
  value: unknown
  constraint: string
}

export interface NetworkError extends BaseError {
  type: 'network'
  status?: number
  statusText?: string
  endpoint?: string
  method?: string
  retryable: boolean
  retryAfter?: number
}

export interface SystemError extends BaseError {
  type: 'system'
  source: 'auth0' | 'api' | 'local_storage' | 'browser' | 'unknown'
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export type AppError = AuthError | ValidationError | NetworkError | SystemError

export interface ErrorRecoveryAction {
  type: 'retry' | 'redirect' | 'refresh' | 'contact_support' | 'alternative_method'
  label: string
  handler: () => Promise<void> | void
  params?: Record<string, unknown>
}

export interface ErrorState {
  hasError: boolean
  error: AppError | null
  isRecovering: boolean
  recoveryAttempts: number
  maxRetryAttempts: number
}

export interface FormValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: string[]
}

export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: {
    componentStack: string
    errorBoundary: string
  } | null
}

// Toast notification types
export interface ErrorToast {
  id: string
  type: 'error' | 'warning' | 'info' | 'success'
  title: string
  message: string
  duration: number
  dismissible: boolean
  actions?: ErrorRecoveryAction[]
}

// Error logging types
export interface ErrorLogEntry {
  id: string
  error: AppError
  userAgent: string
  url: string
  userId?: string
  sessionId?: string
  additionalContext?: Record<string, unknown>
}

// Trust-building error message templates
export interface TrustBuildingErrorMessages {
  [key: string]: {
    title: string
    message: string
    tone: 'calm' | 'reassuring' | 'helpful' | 'understanding'
    recovery: string
    trustSignal?: string
  }
}