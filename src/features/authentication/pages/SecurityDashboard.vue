<template>
  <div class="security-dashboard-page">
    <div class="security-container">
      <!-- Header -->
      <header class="security-header">
        <div class="security-header__content">
          <button 
            aria-label="Volver"
            class="back-button"
            @click="handleBack"
          >
            <ArrowLeftIcon class="back-button__icon" />
          </button>
          <div class="security-header__text">
            <h1 class="security-header__title">
              Panel de Seguridad
            </h1>
            <p class="security-header__subtitle">
              Controla y mejora la seguridad de tu cuenta
            </p>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="security-content">
        <!-- Security Score Section -->
        <section class="security-section">
          <div class="section-header">
            <h2 class="section-header__title">
              Puntuación de Seguridad
            </h2>
            <p class="section-header__description">
              Tu cuenta está bien protegida
            </p>
          </div>

          <div class="security-score-card">
            <div class="security-score">
              <div class="score-circle">
                <svg class="score-circle__svg" viewBox="0 0 120 120">
                  <circle
                    class="score-circle__track"
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="8"
                  />
                  <circle
                    class="score-circle__progress"
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="8"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="scoreOffset"
                    stroke-linecap="round"
                  />
                </svg>
                <div class="score-content">
                  <div class="score-number">{{ securityScore }}</div>
                  <div class="score-label">{{ securityScoreLabel }}</div>
                </div>
              </div>
              
              <div class="score-details">
                <h3 class="score-details__title">Security Status</h3>
                <p class="score-details__description">
                  {{ securityScoreDescription }}
                </p>
                <div v-if="securityRecommendations.length > 0" class="score-improvements">
                  <h4>Recommended improvements:</h4>
                  <ul>
                    <li v-for="rec in securityRecommendations" :key="rec">
                      {{ rec }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Two-Factor Authentication Section -->
        <section class="security-section">
          <div class="section-header">
            <h2 class="section-header__title">
              Autenticación en Dos Pasos
            </h2>
            <p class="section-header__description">
              Agrega una capa extra de seguridad
            </p>
          </div>

          <div class="twofa-card">
            <div class="twofa-status">
              <div class="twofa-status__icon" :class="{ 'enabled': twoFactorEnabled }">
                <ShieldIcon v-if="twoFactorEnabled" />
                <ExclamationCircleIcon v-else />
              </div>
              <div class="twofa-status__content">
                <h3 class="twofa-status__title">
                  {{ twoFactorEnabled ? 'Two-Factor Authentication Enabled' : 'Enable Two-Factor Authentication' }}
                </h3>
                <p class="twofa-status__description">
                  {{ twoFactorEnabled 
                    ? 'Your account is protected with two-factor authentication' 
                    : 'Add an extra layer of security to your account' }}
                </p>
              </div>
              <button
                :disabled="isTogglingTwoFactor"
                class="twofa-toggle-button"
                :class="{ 'enabled': twoFactorEnabled }"
                @click="handleTwoFactorToggle"
              >
                <span v-if="!isTogglingTwoFactor">
                  {{ twoFactorEnabled ? 'Disable' : 'Enable' }}
                </span>
                <div v-if="isTogglingTwoFactor" class="loading-spinner"></div>
                <span v-if="isTogglingTwoFactor">{{ twoFactorEnabled ? 'Disabling...' : 'Setting up...' }}</span>
              </button>
            </div>

            <div v-if="showTwoFactorSetup" class="twofa-setup">
              <div class="setup-steps">
                <div class="setup-step" :class="{ active: currentSetupStep >= 1 }">
                  <div class="step-number">1</div>
                  <div class="step-content">
                    <h4>Install an authenticator app</h4>
                    <p>Download Google Authenticator, Authy, or similar app</p>
                  </div>
                </div>
                
                <div class="setup-step" :class="{ active: currentSetupStep >= 2 }">
                  <div class="step-number">2</div>
                  <div class="step-content">
                    <h4>Scan QR code</h4>
                    <div class="qr-code-container">
                      <div class="qr-code-placeholder">
                        <div class="qr-pattern"></div>
                        <p>QR Code placeholder</p>
                        <small>Secret key: {{ secretKey }}</small>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="setup-step" :class="{ active: currentSetupStep >= 3 }">
                  <div class="step-number">3</div>
                  <div class="step-content">
                    <h4>Enter verification code</h4>
                    <div class="verification-input">
                      <input
                        v-model="verificationCode"
                        type="text"
                        placeholder="Enter 6-digit code"
                        maxlength="6"
                        class="code-input"
                      />
                      <button
                        class="verify-button"
                        :disabled="verificationCode.length !== 6"
                        @click="handleVerifyCode"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="setup-actions">
                <button class="cancel-setup-button" @click="cancelTwoFactorSetup">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Active Sessions Section -->
        <section class="security-section">
          <div class="section-header">
            <h2 class="section-header__title">
              Sesiones Activas
            </h2>
            <p class="section-header__description">
              Controla dónde tienes la sesión iniciada
            </p>
          </div>

          <div class="sessions-list">
            <div
              v-for="session in activeSessions"
              :key="session.id"
              class="session-item"
              :class="{ current: session.isCurrent }"
            >
              <div class="session-device">
                <div class="session-device__icon">
                  <ClockIcon />
                </div>
                <div class="session-device__info">
                  <h4 class="session-device__name">{{ session.deviceName }}</h4>
                  <p class="session-device__details">
                    {{ session.browser }} • {{ session.os }} • {{ session.location }}
                  </p>
                  <p class="session-device__time">
                    {{ session.isCurrent ? 'Current session' : `Last active: ${session.lastActive}` }}
                  </p>
                </div>
              </div>
              <div class="session-actions">
                <span v-if="session.isCurrent" class="current-badge">Current</span>
                <button
                  v-else
                  class="revoke-button"
                  @click="handleRevokeSession(session.id)"
                >
                  Revoke
                </button>
              </div>
            </div>
          </div>

          <div class="sessions-actions">
            <button
              :disabled="isRevokingAllSessions"
              class="revoke-all-button"
              @click="handleRevokeAllSessions"
            >
              <span v-if="!isRevokingAllSessions">Revoke all other sessions</span>
              <div v-if="isRevokingAllSessions" class="loading-spinner"></div>
              <span v-if="isRevokingAllSessions">Revoking...</span>
            </button>
          </div>
        </section>

        <!-- Security Events Section -->
        <section class="security-section">
          <SecurityDashboardCard
            :security-events="securityEvents"
            :is-loading="isLoadingSecurityEvents"
            @load-events="loadSecurityEvents"
          />
        </section>

        <!-- Password Management Section -->
        <section class="security-section">
          <div class="section-header">
            <h2 class="section-header__title">
              Contraseña
            </h2>
            <p class="section-header__description">
              Cambia tu contraseña regularmente
            </p>
          </div>

          <div class="password-card">
            <div class="password-info">
              <div class="password-strength">
                <h4>Password Strength</h4>
                <div class="strength-indicator">
                  <div class="strength-bar">
                    <div class="strength-fill" :style="{ width: `${passwordStrength}%` }"></div>
                  </div>
                  <span class="strength-label">{{ passwordStrengthLabel }}</span>
                </div>
              </div>
              <div class="password-updated">
                <p>Last updated: {{ lastPasswordUpdate }}</p>
              </div>
            </div>
            <button class="change-password-button" @click="handleChangePassword">
              Change Password
            </button>
          </div>
        </section>
      </main>
    </div>

    <!-- Success Messages -->
    <div
      v-if="successMessage"
      class="success-toast"
      role="alert"
      aria-live="polite"
    >
      <CheckCircleIcon class="success-toast__icon" />
      <span class="success-toast__message">{{ successMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/features/authentication/composables/useAuth'
import SecurityDashboardCard from '@/features/authentication/components/SecurityDashboardCard/SecurityDashboardCard.vue'
import ArrowLeftIcon from '@/shared/icons/ArrowLeftIcon.vue'
import ExclamationCircleIcon from '@/shared/icons/ExclamationCircleIcon.vue'
import CheckCircleIcon from '@/shared/icons/CheckCircleIcon.vue'
import ClockIcon from '@/shared/icons/ClockIcon.vue'
import ShieldIcon from '@/shared/icons/ShieldIcon.vue'

// Router and composables
const router = useRouter()
const {
  securityEvents,
  isLoadingSecurityEvents,
  loadSecurityEvents,
} = useAuth()

// Component state
const successMessage = ref('')
const securityScore = ref(85)
const twoFactorEnabled = ref(false)
const isTogglingTwoFactor = ref(false)
const showTwoFactorSetup = ref(false)
const currentSetupStep = ref(1)
const verificationCode = ref('')
const secretKey = ref('JBSWY3DPEHPK3PXP')
const passwordStrength = ref(75)
const lastPasswordUpdate = ref('2 months ago')
const isRevokingAllSessions = ref(false)

// Mock data for active sessions
const activeSessions = ref([
  {
    id: '1',
    deviceName: 'Chrome on Windows',
    browser: 'Chrome 120.0.0',
    os: 'Windows 11',
    location: 'Madrid, Spain',
    lastActive: '2 minutes ago',
    isCurrent: true,
  },
  {
    id: '2',
    deviceName: 'Safari on iPhone',
    browser: 'Safari 17.0',
    os: 'iOS 17.2',
    location: 'Madrid, Spain',
    lastActive: '2 hours ago',
    isCurrent: false,
  },
  {
    id: '3',
    deviceName: 'Firefox on Mac',
    browser: 'Firefox 120.0',
    os: 'macOS Sonoma',
    location: 'Barcelona, Spain',
    lastActive: '1 day ago',
    isCurrent: false,
  },
])

// Computed properties
const circumference = computed(() => 2 * Math.PI * 50)

const scoreOffset = computed(() => {
  const progress = securityScore.value / 100
  return circumference.value * (1 - progress)
})

const securityScoreLabel = computed(() => {
  if (securityScore.value >= 90) return 'Excellent'
  if (securityScore.value >= 75) return 'Good'
  if (securityScore.value >= 50) return 'Fair'
  return 'Poor'
})

const securityScoreDescription = computed(() => {
  if (securityScore.value >= 90) return 'Your account security is excellent. Keep up the good work!'
  if (securityScore.value >= 75) return 'Your account security is good, but there are some improvements you can make.'
  if (securityScore.value >= 50) return 'Your account security needs improvement. Consider enabling additional security features.'
  return 'Your account security is poor. Please take immediate action to secure your account.'
})

const securityRecommendations = computed(() => {
  const recommendations = []
  if (!twoFactorEnabled.value) {
    recommendations.push('Enable two-factor authentication')
  }
  if (passwordStrength.value < 80) {
    recommendations.push('Update to a stronger password')
  }
  if (activeSessions.value.filter(s => !s.isCurrent).length > 2) {
    recommendations.push('Review and revoke unused sessions')
  }
  return recommendations
})

const passwordStrengthLabel = computed(() => {
  if (passwordStrength.value >= 90) return 'Very Strong'
  if (passwordStrength.value >= 75) return 'Strong'
  if (passwordStrength.value >= 50) return 'Medium'
  return 'Weak'
})

// Methods
const handleBack = (): void => {
  router.back()
}

const handleTwoFactorToggle = (): void => {
  if (twoFactorEnabled.value) {
    handleDisableTwoFactor()
  } else {
    handleEnableTwoFactor()
  }
}

const handleEnableTwoFactor = (): void => {
  showTwoFactorSetup.value = true
  currentSetupStep.value = 1
}

const handleDisableTwoFactor = async (): Promise<void> => {
  try {
    isTogglingTwoFactor.value = true
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    twoFactorEnabled.value = false
    securityScore.value = Math.max(securityScore.value - 15, 0)
    showSuccessMessage('Two-factor authentication has been disabled.')
  } catch (error) {
    console.error('Failed to disable 2FA:', error)
  } finally {
    isTogglingTwoFactor.value = false
  }
}

const handleVerifyCode = async (): Promise<void> => {
  if (verificationCode.value.length !== 6) return

  try {
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    twoFactorEnabled.value = true
    showTwoFactorSetup.value = false
    securityScore.value = Math.min(securityScore.value + 15, 100)
    showSuccessMessage('Two-factor authentication has been enabled successfully!')
  } catch (error) {
    console.error('Failed to verify code:', error)
  }
}

const cancelTwoFactorSetup = (): void => {
  showTwoFactorSetup.value = false
  currentSetupStep.value = 1
  verificationCode.value = ''
}

const handleRevokeSession = async (sessionId: string): Promise<void> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = activeSessions.value.findIndex(s => s.id === sessionId)
    if (index !== -1) {
      activeSessions.value.splice(index, 1)
      showSuccessMessage('Session has been revoked.')
    }
  } catch (error) {
    console.error('Failed to revoke session:', error)
  }
}

const handleRevokeAllSessions = async (): Promise<void> => {
  try {
    isRevokingAllSessions.value = true
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    activeSessions.value = activeSessions.value.filter(s => s.isCurrent)
    showSuccessMessage('All other sessions have been revoked.')
  } catch (error) {
    console.error('Failed to revoke all sessions:', error)
  } finally {
    isRevokingAllSessions.value = false
  }
}

const handleChangePassword = (): void => {
  router.push('/auth/change-password')
}

const showSuccessMessage = (message: string): void => {
  successMessage.value = message
  setTimeout(() => {
    successMessage.value = ''
  }, 5000)
}

// Lifecycle
onMounted(async () => {
  try {
    await loadSecurityEvents()
  } catch (error) {
    console.error('Failed to load security events:', error)
  }
})
</script>

<style src="./SecurityDashboard.scss" scoped></style>