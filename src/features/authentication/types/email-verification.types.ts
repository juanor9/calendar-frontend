/**
 * Email Verification Types
 * Common types used across email verification components
 */

export type VerificationStatus = 'pending' | 'verified' | 'expired' | 'error'

export interface VerificationStep {
  id: number
  label: string
}

export interface VerificationState {
  status: VerificationStatus
  isResending: boolean
  isChecking: boolean
  canResend: boolean
  timeUntilResend: number
  currentStepIndex: number
}

export interface VerificationConfig {
  checkInterval: number
  resendCooldown: number
  maxRetries: number
}