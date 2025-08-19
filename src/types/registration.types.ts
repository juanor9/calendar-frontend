/**
 * Registration Flow Type Definitions
 * Complete type system for user registration and onboarding
 */

// ============================================================================
// Auth Types
// ============================================================================

// Import types for local use and re-export
import type { User as AuthUser, AppState as AuthAppState } from '@/features/authentication/types/auth.types'

// Re-export for external use
export type { User } from '@/features/authentication/types/auth.types'
export type { AppState } from '@/features/authentication/types/auth.types'

export interface LoginOptions {
  audience?: string
  scope?: string
  connection?: string
  prompt?: string
  login_hint?: string
  ui_locales?: string
  redirect_uri?: string
  response_type?: string
  response_mode?: string
  appState?: AuthAppState
}

export type Role = import('@/features/authentication/types/auth.types').Role

export type Permission = import('@/features/authentication/types/auth.types').Permission

export type RegistrationStatus =
  | 'idle'
  | 'redirecting'
  | 'processing'
  | 'verifying'
  | 'completed'
  | 'error'
  | 'emailVerified'

export interface UserResponse {
  success: boolean
  user?: AuthUser
  error?: string
}

export interface RegistrationStatusResponse {
  completed: boolean
  emailVerified: boolean
  status: RegistrationStatus
}

export interface CallbackRequest {
  code: string
  state: string
  error?: string
  error_description?: string
}

// ============================================================================
// Onboarding Extended Types
// ============================================================================

export interface OnboardingError {
  code: string
  message: string
  userMessage?: string
  type: 'network' | 'validation' | 'auth' | 'unknown' | 'onboarding'
  retryable: boolean
  field?: string
  timestamp?: number
}

export interface WorkPreferences {
  [key: string]: unknown
  workStyle: WorkStyle
  workHours: WorkHours
  focusTime: FocusTimePreferences
  meetingPreferences: MeetingPreferences
}

export interface CalendarIntegration {
  [key: string]: unknown
  provider: CalendarProvider
  accountEmail: string
  calendars: Calendar[]
  syncSettings: CalendarSyncSettings
  credentials?: {
    accessToken?: string
    refreshToken?: string
    expiresAt?: Date
  }
}

export type CalendarProvider = 'google' | 'microsoft' | 'apple' | 'caldav'

export type WorkStyle = 'focused' | 'collaborative' | 'flexible' | 'structured'

export interface WorkHours {
  start: string // HH:mm format
  end: string // HH:mm format
  days: number[] // 0-6 where 0 is Sunday
  timezone: string
  flexibleBreaks: boolean
}

export interface MeetingPreferences {
  defaultDuration: number // minutes
  bufferTime: number // minutes
  autoDeclineConflicts: boolean
  requireDescription: boolean
  allowBackToBack: boolean
  maxDailyMeetings?: number
  preferredTimeSlots: string[] // HH:mm format
}

export interface FocusTimePreferences {
  minimumBlockSize: number // minutes
  preferredHours: string[] // HH:mm format
  allowInterruptions: boolean
  breakFrequency: number // minutes
  deepWorkBlocks: boolean
}

export type AIOptimizationLevel = 'conservative' | 'balanced' | 'aggressive'

export interface CalendarSyncSettings {
  syncDirection: 'pull' | 'push' | 'both'
  conflictResolution: 'local' | 'remote' | 'newest' | 'manual'
  syncInterval: number // minutes
  excludePrivate: boolean
}

// ============================================================================
// Registration Types
// ============================================================================

export interface RegistrationInitRequest {
  email: string
  returnUrl?: string
  metadata?: Record<string, unknown>
  source?: 'landing' | 'trial' | 'invite' | 'organic'
  utm?: {
    source?: string
    medium?: string
    campaign?: string
    term?: string
    content?: string
  }
}

export interface RegistrationState {
  status: 'idle' | 'redirecting' | 'processing' | 'verifying' | 'completed' | 'error'
  step: RegistrationStep
  email?: string
  source?: string
  startedAt?: Date
  completedAt?: Date
  error?: RegistrationError
  retryCount: number
  sessionId?: string
}

export type RegistrationStep =
  | 'initial'
  | 'auth0_redirect'
  | 'auth0_form'
  | 'email_verification'
  | 'profile_creation'
  | 'onboarding'
  | 'completed'

export interface RegistrationError {
  code: string
  type: 'network' | 'auth0' | 'backend' | 'validation' | 'unknown'
  message: string
  userMessage: string
  retryable: boolean
  retryAfter?: number
  details?: Record<string, unknown>
  errorId?: string
}

// ============================================================================
// Auth0 Webhook Types
// ============================================================================

export interface UserCreationWebhook {
  event_id: string
  event_type: 'user.created'
  user_id: string
  email: string
  email_verified: boolean
  name?: string
  picture?: string
  user_metadata?: Record<string, unknown>
  app_metadata?: Record<string, unknown>
  created_at: string
  connection?: string
  client_id?: string
}

export interface EmailVerificationWebhook {
  event_id: string
  event_type: 'email.verified'
  user_id: string
  email: string
  verified_at: string
}

export interface UserUpdateWebhook {
  event_id: string
  event_type: 'user.updated'
  user_id: string
  changes: {
    email?: { old: string; new: string }
    name?: { old: string; new: string }
    picture?: { old: string; new: string }
    user_metadata?: { old: unknown; new: unknown }
    app_metadata?: { old: unknown; new: unknown }
  }
  updated_at: string
  updated_by: string
}

// ============================================================================
// Onboarding Types
// ============================================================================

export interface OnboardingState {
  userId: string
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped'
  currentStep: OnboardingStep
  completedSteps: OnboardingStep[]
  skippedSteps: OnboardingStep[]
  stepData: Record<string, unknown>
  preferences: UserPreferences
  calendarConnections: CalendarConnection[]
  startedAt?: Date
  completedAt?: Date
  lastActivityAt?: Date
  abTestVariant?: string
  abandonmentCount: number
  completionPercentage: number
  analyticsEvents: OnboardingAnalyticsEvent[]
}

export type OnboardingStep = 'welcome' | 'preferences' | 'calendar_sync' | 'ai_setup' | 'tutorial'

export interface OnboardingStepConfig {
  id: OnboardingStep
  title: string
  description: string
  icon: string
  required: boolean
  estimatedTime: number // in seconds
  component: string // Component name to render
  validationRules?: ValidationRule[]
  analyticsProperties?: Record<string, unknown>
}

export interface OnboardingProgress {
  currentStep: number
  totalSteps: number
  percentageComplete: number
  estimatedTimeRemaining: number // in seconds
  canSkip: boolean
  canGoBack: boolean
}

// ============================================================================
// User Preferences Types
// ============================================================================

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: string
  timezone: string
  dateFormat: string
  timeFormat: '12h' | '24h'
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6
  notifications: NotificationPreferences
  calendar: CalendarPreferences
  ai: AIPreferences
  privacy: PrivacyPreferences
}

export interface NotificationPreferences {
  email: {
    enabled: boolean
    frequency: 'immediate' | 'daily' | 'weekly'
    types: {
      taskReminders: boolean
      eventReminders: boolean
      optimizationSuggestions: boolean
      weeklyReport: boolean
      systemUpdates: boolean
    }
  }
  push: {
    enabled: boolean
    types: {
      taskDue: boolean
      eventStarting: boolean
      conflictDetected: boolean
    }
  }
  inApp: {
    enabled: boolean
    showBadge: boolean
  }
}

export interface CalendarPreferences {
  defaultView: 'day' | 'week' | 'month' | 'agenda'
  defaultCalendar?: string
  workingHours: {
    enabled: boolean
    start: string // HH:mm format
    end: string // HH:mm format
    days: number[] // 0-6 where 0 is Sunday
  }
  eventDefaults: {
    duration: number // in minutes
    reminderMinutes: number
    color?: string
    showAs: 'free' | 'busy' | 'tentative'
  }
  syncSettings: {
    autoSync: boolean
    syncInterval: number // in minutes
    syncPastDays: number
    syncFutureDays: number
  }
}

export interface AIPreferences {
  enabled: boolean
  optimizationLevel: 'conservative' | 'balanced' | 'aggressive'
  autoReorganize: boolean
  suggestionFrequency: 'realtime' | 'daily' | 'weekly' | 'manual'
  protectedTimes: ProtectedTime[]
  focusPreferences: {
    preferredFocusHours: string[] // HH:mm format
    minimumFocusBlockMinutes: number
    breakBetweenFocusMinutes: number
  }
  taskPrioritization: {
    factors: {
      deadline: number // weight 0-100
      importance: number
      effort: number
      dependencies: number
    }
  }
}

export interface ProtectedTime {
  id: string
  name: string
  type: 'recurring' | 'one-time'
  start: string // HH:mm or ISO date
  end: string // HH:mm or ISO date
  days?: number[] // For recurring, 0-6 where 0 is Sunday
  reason?: string
}

export interface PrivacyPreferences {
  shareAnalytics: boolean
  allowAISuggestions: boolean
  dataRetentionDays: number
  exportFormat: 'json' | 'csv' | 'ical'
}

// ============================================================================
// Calendar Integration Types
// ============================================================================

export interface CalendarConnection {
  id: string
  provider: 'google' | 'microsoft' | 'apple' | 'caldav'
  accountEmail: string
  accountName?: string
  connectedAt: Date
  lastSyncAt?: Date
  syncStatus: 'syncing' | 'synced' | 'error' | 'paused'
  syncError?: string
  calendars: Calendar[]
  permissions: CalendarPermission[]
  settings: CalendarConnectionSettings
}

export interface Calendar {
  [key: string]: unknown
  id: string
  connectionId: string
  name: string
  color?: string
  isPrimary: boolean
  isSelected: boolean
  isReadOnly: boolean
  timeZone?: string
  description?: string
  eventCount?: number
}

export interface CalendarPermission {
  scope: string
  granted: boolean
  required: boolean
}

export interface CalendarConnectionSettings {
  syncEnabled: boolean
  syncDirection: 'pull' | 'push' | 'both'
  conflictResolution: 'local' | 'remote' | 'newest' | 'manual'
  excludePrivate: boolean
  excludeDeclined: boolean
  categoriesFilter?: string[]
}

// ============================================================================
// Analytics Event Types
// ============================================================================

export interface OnboardingAnalyticsEvent {
  eventId: string
  userId: string
  sessionId: string
  timestamp: Date
  eventType: OnboardingEventType
  properties: Record<string, unknown>
  context: AnalyticsContext
}

export type OnboardingEventType =
  | 'onboarding_started'
  | 'onboarding_step_viewed'
  | 'onboarding_step_completed'
  | 'onboarding_step_skipped'
  | 'onboarding_abandoned'
  | 'onboarding_completed'
  | 'preference_changed'
  | 'calendar_connected'
  | 'calendar_connection_failed'
  | 'tutorial_started'
  | 'tutorial_completed'

export interface AnalyticsContext {
  userAgent: string
  platform: string
  screenResolution: string
  referrer?: string
  utm?: Record<string, string>
  abTests?: Record<string, string>
  sessionDuration?: number
}

// ============================================================================
// Validation Types
// ============================================================================

export interface ValidationRule {
  field: string
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom'
  value?: unknown
  message: string
  validator?: (value: unknown) => boolean
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

export interface ValidationError {
  field: string
  rule: string
  message: string
  value?: unknown
}

// ============================================================================
// Error Recovery Types
// ============================================================================

export interface RecoveryStrategy {
  action: RecoveryAction
  message: string
  userMessage?: string
  autoRecover: boolean
  retryAfter?: number
  retryCount?: number
  maxRetries?: number
  fallbackStrategy?: RecoveryStrategy
}

export type RecoveryAction =
  | 'retry_immediate'
  | 'retry_with_backoff'
  | 'redirect_to_login'
  | 'show_requirements'
  | 'delay_retry'
  | 'check_connection'
  | 'contact_support'
  | 'queue_for_later'
  | 'use_fallback'
  | 'manual_intervention'

export interface ErrorRecoveryState {
  attempts: number
  lastAttemptAt?: Date
  nextRetryAt?: Date
  strategy: RecoveryStrategy
  recovered: boolean
  finalError?: RegistrationError
}

// ============================================================================
// State Management Types
// ============================================================================

export interface RegistrationStore {
  // State
  registrationState: RegistrationState
  onboardingState: OnboardingState
  userPreferences: UserPreferences
  calendarConnections: CalendarConnection[]

  // UI State
  isLoading: boolean
  loadingMessage?: string
  error?: RegistrationError
  recoveryState?: ErrorRecoveryState

  // Actions
  initRegistration: (request: RegistrationInitRequest) => Promise<void>
  processCallback: (code: string, state: string) => Promise<void>
  updateOnboardingStep: (step: OnboardingStep, action: 'complete' | 'skip') => Promise<void>
  savePreferences: (preferences: Partial<UserPreferences>) => Promise<void>
  connectCalendar: (provider: string, authCode: string) => Promise<CalendarConnection>
  completeOnboarding: () => Promise<void>
  retryFailedOperation: () => Promise<void>
  reset: () => void
}

// ============================================================================
// API Response Types
// ============================================================================

export interface RegistrationResponse {
  success: boolean
  userId?: string
  sessionId?: string
  nextStep?: RegistrationStep
  error?: RegistrationError
}

export interface OnboardingStatusResponse {
  status: OnboardingState
  nextSteps: OnboardingStepConfig[]
  completionEstimate: number // in minutes
}

export interface PreferencesSaveResponse {
  success: boolean
  preferences: UserPreferences
  validationErrors?: ValidationError[]
}

export interface CalendarConnectionResponse {
  success: boolean
  connection?: CalendarConnection
  error?: {
    code: string
    message: string
    retryable: boolean
  }
}
