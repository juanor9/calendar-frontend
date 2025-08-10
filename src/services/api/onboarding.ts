/**
 * Onboarding API Client
 * Handles all onboarding-related API calls
 */

import type {
  OnboardingState,
  OnboardingStep,
  UserPreferences,
  CalendarProvider,
  CalendarConnection,
  WorkStyle,
  WorkHours,
  MeetingPreferences,
} from '@/types/registration.types'

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const API_TIMEOUT = 15000 // 15 seconds for onboarding operations

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
}

class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Base API client with common functionality
 */
class BaseApiClient {
  private baseUrl: string
  private timeout: number

  constructor(baseUrl = API_BASE_URL, timeout = API_TIMEOUT) {
    this.baseUrl = baseUrl
    this.timeout = timeout
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    // Set up request with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: response.statusText,
        }))

        throw new ApiError(
          errorData.message || `HTTP ${response.status}`,
          errorData.code || 'HTTP_ERROR',
          response.status,
          errorData
        )
      }

      const data = await response.json()
      return data
    } catch (error) {
      clearTimeout(timeoutId)

      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 'TIMEOUT', 408)
      }

      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error',
        'NETWORK_ERROR',
        undefined,
        error
      )
    }
  }

  protected async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'GET',
      headers,
    })
  }

  protected async post<T>(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  protected async patch<T>(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  protected async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
      headers,
    })
  }
}

/**
 * Onboarding API Client
 */
export class OnboardingAPI extends BaseApiClient {
  /**
   * Get onboarding state for a user
   */
  static async getOnboardingState(userId: string): Promise<OnboardingState | null> {
    const client = new OnboardingAPI()

    try {
      const response = await client.get<ApiResponse<OnboardingState>>(
        `/auth/onboarding/${encodeURIComponent(userId)}`
      )

      if (!response.success) {
        // If onboarding doesn't exist yet, return null instead of throwing
        if (response.error?.code === 'ONBOARDING_NOT_FOUND') {
          return null
        }

        throw new ApiError(
          response.error?.message || 'Failed to get onboarding state',
          response.error?.code || 'ONBOARDING_STATE_FAILED'
        )
      }

      return response.data || null
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        'Failed to get onboarding state',
        'ONBOARDING_STATE_FAILED',
        undefined,
        error
      )
    }
  }

  /**
   * Update onboarding step
   */
  static async updateStep(
    userId: string,
    step: OnboardingStep,
    action: 'start' | 'complete' | 'skip',
    data?: unknown
  ): Promise<void> {
    const client = new OnboardingAPI()

    try {
      const response = await client.post<ApiResponse<void>>(
        `/auth/onboarding/${encodeURIComponent(userId)}/step`,
        {
          step,
          action,
          data,
          timestamp: new Date().toISOString(),
        }
      )

      if (!response.success) {
        throw new ApiError(
          response.error?.message || 'Failed to update onboarding step',
          response.error?.code || 'STEP_UPDATE_FAILED'
        )
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError('Failed to update onboarding step', 'STEP_UPDATE_FAILED', undefined, error)
    }
  }

  /**
   * Complete a specific onboarding step
   */
  static async completeStep(
    userId: string,
    step: OnboardingStep,
    stepData?: unknown
  ): Promise<void> {
    return this.updateStep(userId, step, 'complete', stepData)
  }

  /**
   * Skip a specific onboarding step
   */
  static async skipStep(userId: string, step: OnboardingStep): Promise<void> {
    return this.updateStep(userId, step, 'skip')
  }

  /**
   * Complete entire onboarding process
   */
  static async completeOnboarding(
    userId: string,
    finalData: {
      preferences?: unknown
      calendarIntegration?: unknown
      stepData?: Record<string, unknown>
    }
  ): Promise<void> {
    const client = new OnboardingAPI()

    try {
      const response = await client.post<ApiResponse<void>>(
        `/auth/onboarding/${encodeURIComponent(userId)}/complete`,
        {
          ...finalData,
          completedAt: new Date().toISOString(),
        }
      )

      if (!response.success) {
        throw new ApiError(
          response.error?.message || 'Failed to complete onboarding',
          response.error?.code || 'ONBOARDING_COMPLETION_FAILED'
        )
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        'Failed to complete onboarding',
        'ONBOARDING_COMPLETION_FAILED',
        undefined,
        error
      )
    }
  }

  /**
   * Save onboarding progress
   */
  static async saveProgress(userId: string, progressData: unknown): Promise<void> {
    const client = new OnboardingAPI()

    try {
      const response = await client.patch<ApiResponse<void>>(
        `/auth/onboarding/${encodeURIComponent(userId)}/progress`,
        {
          ...progressData,
          lastSavedAt: new Date().toISOString(),
        }
      )

      if (!response.success) {
        throw new ApiError(
          response.error?.message || 'Failed to save onboarding progress',
          response.error?.code || 'PROGRESS_SAVE_FAILED'
        )
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        'Failed to save onboarding progress',
        'PROGRESS_SAVE_FAILED',
        undefined,
        error
      )
    }
  }

  /**
   * Load saved onboarding progress
   */
  static async loadProgress(userId: string): Promise<unknown> {
    const client = new OnboardingAPI()

    try {
      const response = await client.get<ApiResponse<unknown>>(
        `/auth/onboarding/${encodeURIComponent(userId)}/progress`
      )

      if (!response.success) {
        // If no progress found, return null instead of throwing
        if (response.error?.code === 'PROGRESS_NOT_FOUND') {
          return null
        }

        throw new ApiError(
          response.error?.message || 'Failed to load onboarding progress',
          response.error?.code || 'PROGRESS_LOAD_FAILED'
        )
      }

      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        'Failed to load onboarding progress',
        'PROGRESS_LOAD_FAILED',
        undefined,
        error
      )
    }
  }

  /**
   * Update user preferences
   */
  static async updatePreferences(
    userId: string,
    preferences: Partial<UserPreferences>
  ): Promise<void> {
    const client = new OnboardingAPI()

    try {
      const response = await client.patch<ApiResponse<void>>(
        `/auth/user/${encodeURIComponent(userId)}/preferences`,
        {
          preferences,
          updatedAt: new Date().toISOString(),
        }
      )

      if (!response.success) {
        throw new ApiError(
          response.error?.message || 'Failed to update preferences',
          response.error?.code || 'PREFERENCES_UPDATE_FAILED'
        )
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        'Failed to update preferences',
        'PREFERENCES_UPDATE_FAILED',
        undefined,
        error
      )
    }
  }

  /**
   * Connect calendar integration
   */
  static async connectCalendar(
    userId: string,
    provider: CalendarProvider,
    credentials: Record<string, unknown>
  ): Promise<CalendarConnection> {
    const client = new OnboardingAPI()

    try {
      const response = await client.post<ApiResponse<CalendarConnection>>(`/auth/calendar/setup`, {
        userId,
        provider,
        credentials,
        connectedAt: new Date().toISOString(),
      })

      if (!response.success || !response.data) {
        throw new ApiError(
          response.error?.message || 'Failed to connect calendar',
          response.error?.code || 'CALENDAR_CONNECTION_FAILED'
        )
      }

      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        'Failed to connect calendar',
        'CALENDAR_CONNECTION_FAILED',
        undefined,
        error
      )
    }
  }

  /**
   * Disconnect calendar integration
   */
  static async disconnectCalendar(userId: string, provider: CalendarProvider): Promise<void> {
    const client = new OnboardingAPI()

    try {
      const response = await client.delete<ApiResponse<void>>(
        `/auth/calendar/setup?userId=${encodeURIComponent(userId)}&provider=${provider}`
      )

      if (!response.success) {
        throw new ApiError(
          response.error?.message || 'Failed to disconnect calendar',
          response.error?.code || 'CALENDAR_DISCONNECTION_FAILED'
        )
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        'Failed to disconnect calendar',
        'CALENDAR_DISCONNECTION_FAILED',
        undefined,
        error
      )
    }
  }

  /**
   * Trigger initial calendar sync
   */
  static async triggerInitialSync(userId: string): Promise<void> {
    const client = new OnboardingAPI()

    try {
      const response = await client.post<ApiResponse<void>>(`/auth/calendar/sync/initial`, {
        userId,
        triggeredAt: new Date().toISOString(),
      })

      if (!response.success) {
        throw new ApiError(
          response.error?.message || 'Failed to trigger initial sync',
          response.error?.code || 'INITIAL_SYNC_FAILED'
        )
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError('Failed to trigger initial sync', 'INITIAL_SYNC_FAILED', undefined, error)
    }
  }

  /**
   * Update work style preferences
   */
  static async updateWorkStyle(userId: string, workStyle: WorkStyle): Promise<void> {
    return this.updatePreferences(userId, { workStyle } as Partial<UserPreferences>)
  }

  /**
   * Update work hours preferences
   */
  static async updateWorkHours(userId: string, workHours: WorkHours): Promise<void> {
    return this.updatePreferences(userId, { workHours } as Partial<UserPreferences>)
  }

  /**
   * Update meeting preferences
   */
  static async updateMeetingPreferences(
    userId: string,
    meetingPreferences: MeetingPreferences
  ): Promise<void> {
    return this.updatePreferences(userId, { meetingPreferences } as Partial<UserPreferences>)
  }

  /**
   * Batch update multiple preference types
   */
  static async updateMultiplePreferences(
    userId: string,
    preferences: {
      workStyle?: WorkStyle
      workHours?: WorkHours
      meetingPreferences?: MeetingPreferences
      [key: string]: unknown
    }
  ): Promise<void> {
    return this.updatePreferences(userId, preferences)
  }
}

// Export the API client class for direct use
export default OnboardingAPI
