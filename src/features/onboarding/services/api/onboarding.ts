// Placeholder onboarding API service
// TODO: Implement actual API calls

import type { OnboardingState } from '@/features/authentication/types/registration.types'

export class OnboardingAPI {
  static async getStatus(): Promise<OnboardingState> {
    throw new Error('OnboardingAPI not implemented yet')
  }
  
  static async updateStep(): Promise<void> {
    throw new Error('OnboardingAPI not implemented yet')
  }
  
  static async complete(): Promise<void> {
    throw new Error('OnboardingAPI not implemented yet')
  }

  static async getOnboardingState(_userId: string): Promise<OnboardingState> {
    throw new Error('OnboardingAPI not implemented yet')
  }

  static async completeStep(_stepId: string, _stepData: unknown, _metadata: unknown): Promise<void> {
    throw new Error('OnboardingAPI not implemented yet')
  }

  static async skipStep(_stepId: string, _reason: string): Promise<void> {
    throw new Error('OnboardingAPI not implemented yet')
  }

  static async completeOnboarding(_finalData: unknown, _metadata: unknown): Promise<void> {
    throw new Error('OnboardingAPI not implemented yet')
  }

  static async connectCalendar(_provider: string, _credentials: unknown, _preferences: unknown): Promise<{ calendars: Record<string, unknown>[] }> {
    throw new Error('OnboardingAPI not implemented yet')
  }

  static async disconnectCalendar(_provider: string, _calendarId: string): Promise<void> {
    throw new Error('OnboardingAPI not implemented yet')
  }

  static async triggerInitialSync(_provider: string): Promise<void> {
    throw new Error('OnboardingAPI not implemented yet')
  }

  static async saveProgress(_stepData: unknown, _metadata: unknown): Promise<void> {
    throw new Error('OnboardingAPI not implemented yet')
  }

  static async loadProgress(_userId: string): Promise<{ wizard?: unknown; preferences?: unknown; calendarIntegration?: unknown } | null> {
    throw new Error('OnboardingAPI not implemented yet')
  }
}