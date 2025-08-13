<template>
  <div class="privacy-controls-page">
    <div class="privacy-container">
      <!-- Header -->
      <header class="privacy-header">
        <div class="privacy-header__content">
          <button 
            aria-label="Volver"
            class="back-button"
            @click="handleBack"
          >
            <ArrowLeftIcon class="back-button__icon" />
          </button>
          <div class="privacy-header__text">
            <h1 class="privacy-header__title">
              Control de Privacidad
            </h1>
            <p class="privacy-header__subtitle">
              Gestiona tus datos y configuraciones de privacidad
            </p>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="privacy-content">
        <!-- Data Overview Section -->
        <section class="privacy-section">
          <div class="section-header">
            <h2 class="section-header__title">
              Resumen de Datos
            </h2>
            <p class="section-header__description">
              Revisa qué datos tenemos almacenados sobre ti
            </p>
          </div>

          <div class="data-overview-grid">
            <div class="data-card">
              <div class="data-card__icon">
                <MailIcon />
              </div>
              <div class="data-card__content">
                <h3 class="data-card__title">Personal Information</h3>
                <p class="data-card__description">
                  Email, name, profile picture, and preferences
                </p>
                <span class="data-card__count">{{ dataStats.personalInfo }} items</span>
              </div>
            </div>

            <div class="data-card">
              <div class="data-card__icon">
                <ClockIcon />
              </div>
              <div class="data-card__content">
                <h3 class="data-card__title">Calendar Data</h3>
                <p class="data-card__description">
                  Events, schedules, and calendar integrations
                </p>
                <span class="data-card__count">{{ dataStats.calendarData }} events</span>
              </div>
            </div>

            <div class="data-card">
              <div class="data-card__icon">
                <ShieldIcon />
              </div>
              <div class="data-card__content">
                <h3 class="data-card__title">Security Logs</h3>
                <p class="data-card__description">
                  Login history and security events
                </p>
                <span class="data-card__count">{{ dataStats.securityLogs }} entries</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Privacy Controls Section -->
        <section class="privacy-section">
          <div class="section-header">
            <h2 class="section-header__title">
              Controles de Privacidad
            </h2>
            <p class="section-header__description">
              Configura cómo se utilizan tus datos
            </p>
          </div>

          <div class="privacy-controls">
            <!-- Data Processing Consent -->
            <div class="control-group">
              <div class="control-header">
                <h3 class="control-header__title">Data Processing</h3>
                <p class="control-header__description">
                  Control how we process your personal data
                </p>
              </div>
              
              <div class="control-options">
                <label class="control-option">
                  <input
                    v-model="privacySettings.dataProcessing"
                    type="checkbox"
                    class="control-option__checkbox"
                  />
                  <div class="control-option__content">
                    <span class="control-option__label">Essential data processing</span>
                    <span class="control-option__description">
                      Required for app functionality (cannot be disabled)
                    </span>
                  </div>
                  <div class="control-option__status">Required</div>
                </label>

                <label class="control-option">
                  <input
                    v-model="privacySettings.analyticsConsent"
                    type="checkbox"
                    class="control-option__checkbox"
                  />
                  <div class="control-option__content">
                    <span class="control-option__label">Analytics and insights</span>
                    <span class="control-option__description">
                      Help us improve the app with anonymous usage data
                    </span>
                  </div>
                  <div class="control-option__toggle"></div>
                </label>

                <label class="control-option">
                  <input
                    v-model="privacySettings.marketingConsent"
                    type="checkbox"
                    class="control-option__checkbox"
                  />
                  <div class="control-option__content">
                    <span class="control-option__label">Marketing communications</span>
                    <span class="control-option__description">
                      Receive product updates and feature announcements
                    </span>
                  </div>
                  <div class="control-option__toggle"></div>
                </label>
              </div>
            </div>

            <!-- Data Sharing -->
            <div class="control-group">
              <div class="control-header">
                <h3 class="control-header__title">Data Sharing</h3>
                <p class="control-header__description">
                  Manage third-party integrations and data sharing
                </p>
              </div>
              
              <div class="control-options">
                <label class="control-option">
                  <input
                    v-model="privacySettings.calendarIntegration"
                    type="checkbox"
                    class="control-option__checkbox"
                  />
                  <div class="control-option__content">
                    <span class="control-option__label">Calendar integrations</span>
                    <span class="control-option__description">
                      Share calendar data with connected services
                    </span>
                  </div>
                  <div class="control-option__toggle"></div>
                </label>

                <label class="control-option">
                  <input
                    v-model="privacySettings.aiInsights"
                    type="checkbox"
                    class="control-option__checkbox"
                  />
                  <div class="control-option__content">
                    <span class="control-option__label">AI-powered insights</span>
                    <span class="control-option__description">
                      Use AI to provide scheduling suggestions and insights
                    </span>
                  </div>
                  <div class="control-option__toggle"></div>
                </label>
              </div>
            </div>
          </div>
        </section>

        <!-- Data Export Section -->
        <section class="privacy-section">
          <DataExportCard
            :is-loading="isExportingData"
            :error="gdprError"
            @export="handleDataExport"
            @clear-error="clearGdprError"
          />
        </section>

        <!-- Account Deletion Section -->
        <section class="privacy-section">
          <div class="danger-zone">
            <div class="danger-zone__header">
              <div class="danger-zone__icon">
                <ExclamationCircleIcon />
              </div>
              <div class="danger-zone__content">
                <h2 class="danger-zone__title">
                  Eliminación de Cuenta
                </h2>
                <p class="danger-zone__description">
                  Elimina permanentemente tu cuenta y todos los datos
                </p>
              </div>
            </div>
            <button
              class="danger-button"
              @click="showDeleteConfirmation = true"
            >
              Eliminar mi cuenta
            </button>
          </div>
        </section>
      </main>

      <!-- Save Settings Button -->
      <div class="privacy-actions">
        <button
          class="save-button"
          :disabled="isSavingSettings"
          @click="handleSaveSettings"
        >
          <CheckCircleIcon v-if="!isSavingSettings" class="save-button__icon" />
          <span v-if="!isSavingSettings">Save Privacy Settings</span>
          <div v-if="isSavingSettings" class="loading-spinner"></div>
          <span v-if="isSavingSettings">Saving...</span>
        </button>
      </div>
    </div>

    <!-- Account Deletion Modal -->
    <BaseModal
      v-if="showDeleteConfirmation"
      title="Confirmar eliminación de cuenta"
      :model-value="showDeleteConfirmation"
      @update:model-value="showDeleteConfirmation = $event"
    >
      <div class="deletion-modal">
        <div class="deletion-modal__content">
          <div class="warning-icon">
            <ExclamationCircleIcon />
          </div>
          <p class="deletion-modal__message">
            Esta acción no se puede deshacer.
          </p>
          <div class="deletion-modal__input">
            <label for="delete-confirmation">
              Para confirmar, escribe \"ELIMINAR\":
            </label>
            <input
              id="delete-confirmation"
              v-model="deleteConfirmationText"
              type="text"
              placeholder="Escribe ELIMINAR"
              class="confirmation-input"
            />
          </div>
        </div>
        <div class="deletion-modal__actions">
          <button
            class="cancel-button"
            @click="showDeleteConfirmation = false"
          >
            Cancelar
          </button>
          <button
            class="danger-button"
            :disabled="!canConfirmDeletion || isDeletingAccount"
            @click="handleAccountDeletion"
          >
            <span v-if="isDeletingAccount" class="loading-spinner"></span>
            {{ isDeletingAccount ? 'Procesando...' : 'Confirmar eliminación' }}
          </button>
        </div>
      </div>
    </BaseModal>

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
import { useAuth } from '@/composables/useAuth'
import DataExportCard from '@/components/auth/DataExportCard/DataExportCard.vue'
import BaseModal from '@/ui/BaseModal/BaseModal.vue'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon.vue'
import ExclamationCircleIcon from '@/components/icons/ExclamationCircleIcon.vue'
import CheckCircleIcon from '@/components/icons/CheckCircleIcon.vue'
import MailIcon from '@/components/icons/MailIcon.vue'
import ClockIcon from '@/components/icons/ClockIcon.vue'
import ShieldIcon from '@/components/icons/ShieldIcon.vue'

// Router and composables
const router = useRouter()
const {
  isExportingData,
  isDeletingAccount,
  gdprError,
  requestDataExport,
  requestAccountDeletion,
  clearGdprError,
} = useAuth()

// Component state
const showDeleteConfirmation = ref(false)
const deleteConfirmationText = ref('')
const successMessage = ref('')
const isSavingSettings = ref(false)

// Privacy settings state
const privacySettings = ref({
  dataProcessing: true, // Required, cannot be disabled
  analyticsConsent: true,
  marketingConsent: false,
  calendarIntegration: true,
  aiInsights: true,
})

// Mock data statistics
const dataStats = ref({
  personalInfo: 8,
  calendarData: 142,
  securityLogs: 23,
})

// Computed properties
const canConfirmDeletion = computed((): boolean => {
  return deleteConfirmationText.value.toLowerCase() === 'delete my account'
})

// Methods
const handleBack = (): void => {
  router.back()
}

const handleDataExport = async (): Promise<void> => {
  try {
    await requestDataExport()
    showSuccessMessage('Data export has been requested. You will receive a download link shortly.')
  } catch (error) {
    console.error('Data export failed:', error)
  }
}

const handleAccountDeletion = async (): Promise<void> => {
  if (!canConfirmDeletion.value) return

  try {
    await requestAccountDeletion()
    showSuccessMessage('Account deletion has been initiated. You will be logged out shortly.')
    
    // Close modal and redirect after a delay
    showDeleteConfirmation.value = false
    setTimeout(() => {
      router.push('/')
    }, 2000)
  } catch (error) {
    console.error('Account deletion failed:', error)
  }
}

const handleSaveSettings = async (): Promise<void> => {
  try {
    isSavingSettings.value = true
    
    // Simulate API call to save privacy settings
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    showSuccessMessage('Privacy settings have been updated successfully.')
  } catch (error) {
    console.error('Failed to save privacy settings:', error)
    showSuccessMessage('Failed to save settings. Please try again.')
  } finally {
    isSavingSettings.value = false
  }
}

const showSuccessMessage = (message: string): void => {
  successMessage.value = message
  setTimeout(() => {
    successMessage.value = ''
  }, 5000)
}

// Lifecycle
onMounted(async () => {
  // Load user's current privacy settings
  try {
    // In a real app, this would fetch from backend
    // For now, we'll use default settings
  } catch (error) {
    console.error('Failed to load privacy settings:', error)
  }
})
</script>

<style src="./PrivacyControlsPage.scss" scoped></style>