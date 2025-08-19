// Authentication module exports

// Components
export { default as LoginButton } from './components/LoginButton/LoginButton.vue'
export { default as LogoutButton } from './components/LogoutButton/LogoutButton.vue'
export { default as UserProfile } from './components/UserProfile/UserProfile.vue'
export { default as AuthForm } from './components/AuthForm/AuthForm.vue'
export { default as AuthCallback } from './components/AuthCallback/AuthCallback.vue'

// Email Verification Components
export {
  VerificationStatus,
  VerificationProgress,
  VerificationActions,
  VerificationHelp,
  BackgroundAnimation
} from './components/email-verification'

// Composables
export { useAuth } from './composables/useAuth'
export { useAuthErrorHandler } from './composables/useAuthErrorHandler'
export { useEmailVerification } from './composables/useEmailVerification'
export { useVerificationTimer } from './composables/useVerificationTimer'
export { useVerificationAnimation } from './composables/useVerificationAnimation'

// Stores
export { useAuthStore } from './stores/auth'
export { useRegistrationStore } from './stores/registration'

// Services
export { auth0Plugin, isAuth0Configured } from './services/auth0-plugin'

// Types - Auth Types
export type { 
  LoginOptions, 
  AuthUser, 
  User, 
  AuthState, 
  AppState, 
  Role, 
  Permission, 
  SecurityEvent 
} from './types/auth.types'

// Types - Registration Types
export type { 
  RegistrationError, 
  RegistrationInitRequest,
  RegistrationState 
} from './types/registration.types'

// Types - Email Verification Types
export type {
  VerificationStatus as EmailVerificationStatus,
  VerificationStep,
  VerificationState,
  VerificationConfig
} from './types/email-verification.types'