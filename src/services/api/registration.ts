/**
 * Registration API Client
 * Handles all registration-related API calls
 */

import type {
  RegistrationInitRequest,
  RegistrationResponse,
  RegistrationStatus,
  UserResponse,
  CallbackRequest,
} from '@/types/registration.types'

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const API_TIMEOUT = 10000 // 10 seconds

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

      // Network or other errors
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
 * Registration API Client
 */
export class RegistrationAPI extends BaseApiClient {
  /**
   * Initiate the registration process
   */
  static async initiateRegistration(
    request: RegistrationInitRequest
  ): Promise<RegistrationResponse> {
    const client = new RegistrationAPI()

    try {
      const response = await client.post<ApiResponse<RegistrationResponse>>(
        '/auth/register/initiate',
        {
          email: request.email,
          returnUrl: request.returnUrl || window.location.origin + '/auth/callback',
          metadata: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            ...request.metadata,
          },
          source: request.source || 'landing',
          utm: request.utm,
        }
      )

      if (!response.success || !response.data) {
        throw new ApiError(
          response.error?.message || 'Registration initiation failed',
          response.error?.code || 'REGISTRATION_INIT_FAILED'
        )
      }

      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        'Failed to initiate registration',
        'REGISTRATION_INIT_FAILED',
        undefined,
        error
      )
    }
  }

  /**
   * Handle Auth0 callback after user registration
   */
  static async handleCallback(request: CallbackRequest): Promise<UserResponse> {
    const client = new RegistrationAPI()

    try {
      const response = await client.post<ApiResponse<UserResponse>>('/auth/register/callback', {
        code: request.code,
        state: request.state,
        timestamp: new Date().toISOString(),
      })

      if (!response.success || !response.data) {
        throw new ApiError(
          response.error?.message || 'Registration callback failed',
          response.error?.code || 'CALLBACK_FAILED'
        )
      }

      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        'Failed to handle registration callback',
        'CALLBACK_FAILED',
        undefined,
        error
      )
    }
  }

  /**
   * Get registration status for a user
   */
  static async getRegistrationStatus(auth0Id: string): Promise<RegistrationStatus> {
    const client = new RegistrationAPI()

    try {
      const response = await client.get<ApiResponse<RegistrationStatus>>(
        `/auth/register/status/${encodeURIComponent(auth0Id)}`
      )

      if (!response.success || !response.data) {
        throw new ApiError(
          response.error?.message || 'Failed to get registration status',
          response.error?.code || 'STATUS_CHECK_FAILED'
        )
      }

      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        'Failed to check registration status',
        'STATUS_CHECK_FAILED',
        undefined,
        error
      )
    }
  }

  /**
   * Resend email verification
   */
  static async resendVerification(email: string): Promise<void> {
    const client = new RegistrationAPI()

    try {
      const response = await client.post<ApiResponse<void>>('/auth/email/verify', {
        email,
        timestamp: new Date().toISOString(),
      })

      if (!response.success) {
        throw new ApiError(
          response.error?.message || 'Failed to resend verification email',
          response.error?.code || 'EMAIL_RESEND_FAILED'
        )
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        'Failed to resend verification email',
        'EMAIL_RESEND_FAILED',
        undefined,
        error
      )
    }
  }

  /**
   * Verify email token
   */
  static async verifyEmailToken(token: string): Promise<void> {
    const client = new RegistrationAPI()

    try {
      const response = await client.get<ApiResponse<void>>(
        `/auth/email/verify/${encodeURIComponent(token)}`
      )

      if (!response.success) {
        throw new ApiError(
          response.error?.message || 'Email verification failed',
          response.error?.code || 'EMAIL_VERIFICATION_FAILED'
        )
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        'Failed to verify email token',
        'EMAIL_VERIFICATION_FAILED',
        undefined,
        error
      )
    }
  }

  /**
   * Get user profile
   */
  static async getUserProfile(userId: string): Promise<UserResponse> {
    const client = new RegistrationAPI()

    try {
      const response = await client.get<ApiResponse<UserResponse>>(
        `/auth/user/${encodeURIComponent(userId)}`
      )

      if (!response.success || !response.data) {
        throw new ApiError(
          response.error?.message || 'Failed to get user profile',
          response.error?.code || 'USER_PROFILE_FAILED'
        )
      }

      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError('Failed to get user profile', 'USER_PROFILE_FAILED', undefined, error)
    }
  }

  /**
   * Update user preferences
   */
  static async updateUserPreferences(
    userId: string,
    preferences: Partial<Record<string, unknown>>
  ): Promise<void> {
    const client = new RegistrationAPI()

    try {
      const response = await client.patch<ApiResponse<void>>(
        `/auth/user/${encodeURIComponent(userId)}/preferences`,
        {
          preferences,
          timestamp: new Date().toISOString(),
        }
      )

      if (!response.success) {
        throw new ApiError(
          response.error?.message || 'Failed to update user preferences',
          response.error?.code || 'PREFERENCES_UPDATE_FAILED'
        )
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        'Failed to update user preferences',
        'PREFERENCES_UPDATE_FAILED',
        undefined,
        error
      )
    }
  }
}

// Export the API client class for direct use
export default RegistrationAPI
