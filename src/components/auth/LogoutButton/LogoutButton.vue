<template>
  <BaseButton
    :variant="variant"
    :size="size"
    :disabled="isLoading"
    :loading="isLoading"
    :class="[
      'logout-button',
      {
        'logout-button--loading': isLoading,
        'logout-button--error': hasError,
      },
    ]"
    @click="handleLogout"
  >
    <template #icon>
      <component
        :is="iconComponent"
        :class="['logout-button__icon', { 'animate-spin': isLoading }]"
      />
    </template>

    <template #default>
      {{ buttonText }}
    </template>
  </BaseButton>

  <!-- Confirmation Modal -->
  <BaseModal
    v-if="showConfirmation && showConfirmModal"
    :model-value="showConfirmModal"
    title="Confirmar Cierre de Sesión"
    @close="showConfirmModal = false"
    @confirm="confirmLogout"
    @cancel="showConfirmModal = false"
  >
    <p class="logout-button__confirm-text">¿Estás seguro de que deseas cerrar sesión?</p>

    <template #actions>
      <BaseButton variant="ghost" @click="showConfirmModal = false"> Cancelar </BaseButton>
      <BaseButton variant="primary" :loading="isLoadingState" @click="confirmLogout">
        Cerrar Sesión
      </BaseButton>
    </template>
  </BaseModal>

  <!-- Error message -->
  <div v-if="hasError && showError" class="logout-button__error" role="alert" aria-live="polite">
    {{ errorMessage }}
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowLeftOnRectangleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import BaseButton from '@/ui/BaseButton/BaseButton.vue'
import BaseModal from '@/ui/BaseModal/BaseModal.vue'
import { useAuth } from '@/auth/auth-composable'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  text?: string
  returnToUrl?: string
  showConfirmation?: boolean
  showError?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'ghost',
  size: 'medium',
  text: 'Cerrar Sesión',
  returnToUrl: undefined,
  showConfirmation: false,
  showError: true,
})

interface Emits {
  logoutStart: []
  logoutSuccess: []
  logoutError: [error: Error]
}

const emit = defineEmits<Emits>()

const { logout, isLoading, error } = useAuth()
const localLoading = ref(false)
const showConfirmModal = ref(false)

const hasError = computed(() => !!error.value)
const errorMessage = computed(() => error.value?.message || 'Error al cerrar sesión')
const isLoadingState = computed(() => isLoading.value || localLoading.value)

const buttonText = computed(() => {
  return isLoadingState.value ? 'Cerrando sesión...' : props.text
})

const iconComponent = computed(() => {
  return hasError.value ? ExclamationTriangleIcon : ArrowLeftOnRectangleIcon
})

const handleLogout = () => {
  if (props.showConfirmation) {
    showConfirmModal.value = true
  } else {
    performLogout()
  }
}

const confirmLogout = () => {
  showConfirmModal.value = false
  performLogout()
}

const performLogout = async () => {
  try {
    localLoading.value = true
    emit('logoutStart')
    await logout(props.returnToUrl)
    emit('logoutSuccess')
  } catch (err) {
    console.error('Logout failed:', err)
    const error = err instanceof Error ? err : new Error('Logout failed')
    emit('logoutError', error)
  } finally {
    localLoading.value = false
  }
}
</script>

<style lang="scss" src="./LogoutButton.scss" scoped />
