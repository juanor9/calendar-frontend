<template>
  <div class="account-settings-page">
    <div class="settings-container">
      <!-- Header -->
      <header class="settings-header">
        <div class="settings-header__content">
          <button 
            class="back-button"
            aria-label="Volver"
            @click="handleBack"
          >
            <ArrowLeftIcon class="back-button__icon" />
          </button>
          <h1 class="settings-header__title">
            Configuración de Cuenta
          </h1>
        </div>
      </header>

      <!-- Settings Tabs -->
      <nav class="settings-tabs" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['settings-tab', { 'settings-tab--active': activeTab === tab.id }]"
          :aria-selected="activeTab === tab.id"
          role="tab"
          @click="activeTab = tab.id"
        >
          <component :is="tab.icon" class="settings-tab__icon" />
          <span class="settings-tab__label">{{ tab.label }}</span>
        </button>
      </nav>

      <!-- Settings Content -->
      <main class="settings-content">
        <!-- Profile Settings -->
        <section
          v-show="activeTab === 'profile'"
          class="settings-section"
          role="tabpanel"
          aria-labelledby="profile-tab"
        >
          <ProfileEditCard
            :profile="{
              firstName: user?.given_name || '',
              lastName: user?.family_name || '',
              email: user?.email || '',
              phoneNumber: user?.phone_number || '',
              timezone: user?.zoneinfo || 'UTC',
              language: user?.locale || 'es',
              jobTitle: user?.['https://vana.app/job_title'] || '',
              company: user?.['https://vana.app/company'] || ''
            }"
            :loading="isLoading"
            @save="handleProfileUpdate"
          />
        </section>

        <!-- Security Settings -->
        <section
          v-show="activeTab === 'security'"
          class="settings-section"
          role="tabpanel"
          aria-labelledby="security-tab"
        >
          <SecurityDashboardCard
            :security-events="securityEvents"
            :is-loading="isLoadingSecurityEvents"
            @load-events="loadSecurityEvents"
          />
        </section>

        <!-- Privacy & Data -->
        <section
          v-show="activeTab === 'privacy'"
          class="settings-section"
          role="tabpanel"
          aria-labelledby="privacy-tab"
        >
          <div class="privacy-section">
            <div class="privacy-section__header">
              <h2 class="privacy-section__title">
                Privacidad y Datos
              </h2>
              <p class="privacy-section__description">
                Controla cómo se usan tus datos personales
              </p>
            </div>

            <!-- Data Export -->
            <DataExportCard
              :is-loading="isExportingData"
              :error="gdprError"
              @export="handleDataExport"
              @clear-error="clearGdprError"
            />

            <!-- Account Deletion -->
            <div class="danger-zone">
              <h3 class="danger-zone__title">
                Eliminar Cuenta
              </h3>
              <p class="danger-zone__description">
                Elimina permanentemente tu cuenta y todos los datos asociados
              </p>
              <button
                class="danger-button"
                @click="showDeleteConfirmation = true"
              >
                Eliminar mi cuenta
              </button>
            </div>
          </div>
        </section>
      </main>
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
            <ExclamationTriangleIcon />
          </div>
          <p class="deletion-modal__message">
            Esta acción no se puede deshacer. Se eliminarán permanentemente tu cuenta y todos los datos asociados.
          </p>
          <div class="deletion-modal__input">
            <label for="delete-confirmation">
              Para confirmar, escribe \"ELIMINAR\" en el campo:
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
            {{ isDeletingAccount ? 'Procesando...' : 'Eliminar cuenta' }}
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
import ProfileEditCard from '@/components/auth/ProfileEditCard/ProfileEditCard.vue'
import SecurityDashboardCard from '@/components/auth/SecurityDashboardCard/SecurityDashboardCard.vue'
import DataExportCard from '@/components/auth/DataExportCard/DataExportCard.vue'
import BaseModal from '@/ui/BaseModal/BaseModal.vue'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon.vue'
import ExclamationTriangleIcon from '@/components/icons/ExclamationTriangleIcon.vue'
import CheckCircleIcon from '@/components/icons/CheckCircleIcon.vue'
import UserIcon from '@/components/icons/UserIcon.vue'
import ShieldIcon from '@/components/icons/ShieldIcon.vue'
import LockIcon from '@/components/icons/LockIcon.vue'
import type { User } from '@/auth/types'

// Router and composables
const router = useRouter()
const {
  user,
  isLoading,
  isExportingData,
  isDeletingAccount,
  gdprError,
  securityEvents,
  isLoadingSecurityEvents,
  updateProfile,
  requestDataExport,
  requestAccountDeletion,
  clearGdprError,
  loadSecurityEvents,
} = useAuth()

// Component state
const activeTab = ref<'profile' | 'security' | 'privacy'>('profile')
const showDeleteConfirmation = ref(false)
const deleteConfirmationText = ref('')
const successMessage = ref('')

// Tab configuration
const tabs = [
  {
    id: 'profile',
    label: 'auth.accountSettings.tabs.profile',
    icon: UserIcon,
  },
  {
    id: 'security',
    label: 'auth.accountSettings.tabs.security',
    icon: ShieldIcon,
  },
  {
    id: 'privacy',
    label: 'auth.accountSettings.tabs.privacy',
    icon: LockIcon,
  },
] as const

// Computed properties
const canConfirmDeletion = computed((): boolean => {
  return deleteConfirmationText.value.toLowerCase() === 'delete my account'
})

// Methods
const handleBack = (): void => {
  router.back()
}

const handleProfileUpdate = async (profileData: Partial<User>): Promise<void> => {
  try {
    await updateProfile(profileData)
    showSuccessMessage('Profile updated successfully')
  } catch (error) {
    console.error('Profile update failed:', error)
  }
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

const showSuccessMessage = (message: string): void => {
  successMessage.value = message
  setTimeout(() => {
    successMessage.value = ''
  }, 5000)
}

// Lifecycle
onMounted(async () => {
  // Load security events for the security tab
  try {
    await loadSecurityEvents()
  } catch (error) {
    console.error('Failed to load security events:', error)
  }
})
</script>

<style src="./AccountSettingsPage.scss" scoped></style>