<template>
  <div class="profile-edit-form">
    <div class="auth-card auth-card--large auth-card--centered">
      <!-- Form Header -->
      <div class="profile-edit-header">
        <div class="header-icon">
          <UserIcon class="icon" />
        </div>
        <h2 class="title">Editar perfil</h2>
        <p class="subtitle">Actualiza tu información personal y preferencias de cuenta.</p>
      </div>

      <form class="profile-form" @submit.prevent="handleSubmit">
        <!-- Personal Information Section -->
        <div class="form-section">
          <h3 class="section-title">Información personal</h3>

          <!-- Profile Picture -->
          <div class="profile-picture-section">
            <div class="current-avatar">
              <img
                v-if="currentAvatar"
                :src="currentAvatar"
                :alt="`Foto de perfil de ${form.name || 'usuario'}`"
                class="avatar-image"
              />
              <div v-else class="avatar-fallback">
                {{ avatarInitials }}
              </div>
            </div>
            <div class="avatar-controls">
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden-input"
                @change="handleFileSelect"
              />
              <button
                type="button"
                class="auth-button auth-button--secondary auth-button--small"
                :disabled="uploadingAvatar"
                @click="fileInput?.click()"
              >
                <template v-if="uploadingAvatar"> Subiendo... </template>
                <template v-else>
                  <CameraIcon class="button-icon button-icon--left" />
                  Cambiar foto
                </template>
              </button>
              <button
                v-if="currentAvatar"
                type="button"
                class="auth-button auth-button--ghost auth-button--small"
                :disabled="uploadingAvatar"
                @click="removeAvatar"
              >
                Eliminar
              </button>
            </div>
          </div>

          <!-- Name Field -->
          <div class="auth-field">
            <label for="name" class="auth-field__label">
              <UserIcon class="icon" />
              Nombre completo
              <span class="auth-field__required">*</span>
            </label>
            <div class="auth-field__input-wrapper">
              <input
                id="name"
                v-model="form.name"
                class="auth-input auth-input--medium"
                :class="{ 'auth-input--error': errors.name }"
                type="text"
                placeholder="Tu nombre completo"
                :disabled="isLoading"
                :aria-invalid="!!errors.name"
                :aria-describedby="errors.name ? 'name-error' : 'name-help'"
                required
                @blur="validateName"
              />
            </div>
            <div
              v-if="errors.name"
              id="name-error"
              class="auth-field__help auth-field__help--error"
              role="alert"
            >
              <ExclamationCircleIcon class="icon" />
              {{ errors.name }}
            </div>
            <div v-else id="name-help" class="auth-field__help">
              <UserIcon class="icon" />
              Como apareces en Vana Calendar
            </div>
          </div>

          <!-- Email Field (Read-only) -->
          <div class="auth-field">
            <label for="email" class="auth-field__label">
              <MailIcon class="icon" />
              Correo electrónico
            </label>
            <div class="auth-field__input-wrapper">
              <input
                id="email"
                :value="form.email"
                class="auth-input auth-input--medium auth-input--disabled"
                type="email"
                disabled
                readonly
              />
            </div>
            <div class="auth-field__help">
              <CheckCircleIcon class="icon" />
              Tu email está verificado y no se puede cambiar
            </div>
          </div>

          <!-- Phone Field -->
          <div class="auth-field">
            <label for="phone" class="auth-field__label">
              <PhoneIcon class="icon" />
              Teléfono
            </label>
            <div class="auth-field__input-wrapper">
              <input
                id="phone"
                v-model="form.phone"
                class="auth-input auth-input--medium"
                :class="{ 'auth-input--error': errors.phone }"
                type="tel"
                placeholder="+52 55 1234 5678"
                :disabled="isLoading"
                :aria-invalid="!!errors.phone"
                :aria-describedby="errors.phone ? 'phone-error' : 'phone-help'"
                @blur="validatePhone"
              />
            </div>
            <div
              v-if="errors.phone"
              id="phone-error"
              class="auth-field__help auth-field__help--error"
              role="alert"
            >
              <ExclamationCircleIcon class="icon" />
              {{ errors.phone }}
            </div>
            <div v-else id="phone-help" class="auth-field__help">
              <PhoneIcon class="icon" />
              Para recuperación de cuenta y notificaciones de seguridad
            </div>
          </div>
        </div>

        <!-- Preferences Section -->
        <div class="form-section">
          <h3 class="section-title">Preferencias</h3>

          <!-- Timezone -->
          <div class="auth-field">
            <label for="timezone" class="auth-field__label">
              <ClockIcon class="icon" />
              Zona horaria
            </label>
            <div class="auth-field__input-wrapper">
              <select
                id="timezone"
                v-model="form.timezone"
                class="auth-input auth-input--medium"
                :disabled="isLoading"
              >
                <option value="">Selecciona tu zona horaria</option>
                <option v-for="tz in timezones" :key="tz.value" :value="tz.value">
                  {{ tz.label }}
                </option>
              </select>
            </div>
            <div class="auth-field__help">
              <ClockIcon class="icon" />
              Usado para mostrar eventos en tu horario local
            </div>
          </div>

          <!-- Calendar Preferences -->
          <div class="preferences-group">
            <h4 class="group-title">Vista por defecto del calendario</h4>
            <div class="radio-group">
              <label class="radio-option">
                <input
                  v-model="form.defaultCalendarView"
                  type="radio"
                  value="week"
                  name="calendar-view"
                  :disabled="isLoading"
                />
                <span class="radio-label">Vista semanal</span>
              </label>
              <label class="radio-option">
                <input
                  v-model="form.defaultCalendarView"
                  type="radio"
                  value="month"
                  name="calendar-view"
                  :disabled="isLoading"
                />
                <span class="radio-label">Vista mensual</span>
              </label>
              <label class="radio-option">
                <input
                  v-model="form.defaultCalendarView"
                  type="radio"
                  value="day"
                  name="calendar-view"
                  :disabled="isLoading"
                />
                <span class="radio-label">Vista diaria</span>
              </label>
            </div>
          </div>

          <!-- Working Hours -->
          <div class="preferences-group">
            <h4 class="group-title">Horario de trabajo</h4>
            <div class="time-range">
              <div class="time-field">
                <label for="start-hour" class="time-label">Inicio</label>
                <select
                  id="start-hour"
                  v-model="form.startHour"
                  class="auth-input auth-input--small"
                  :disabled="isLoading"
                >
                  <option v-for="hour in 24" :key="hour - 1" :value="hour - 1">
                    {{ String(hour - 1).padStart(2, '0') }}:00
                  </option>
                </select>
              </div>
              <div class="time-field">
                <label for="end-hour" class="time-label">Fin</label>
                <select
                  id="end-hour"
                  v-model="form.endHour"
                  class="auth-input auth-input--small"
                  :disabled="isLoading"
                >
                  <option v-for="hour in 24" :key="hour - 1" :value="hour - 1">
                    {{ String(hour - 1).padStart(2, '0') }}:00
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button
            type="button"
            class="auth-button auth-button--ghost"
            :disabled="isLoading"
            @click="handleCancel"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="auth-button auth-button--primary"
            :class="{ 'auth-button--loading': isLoading }"
            :disabled="isLoading || !hasChanges || !isFormValid"
          >
            <CheckCircleIcon v-if="!isLoading" class="button-icon button-icon--left" />
            <span v-if="!isLoading">{{ hasChanges ? 'Guardar cambios' : 'Sin cambios' }}</span>
          </button>
        </div>
      </form>

      <!-- Success/Error Messages -->
      <div v-if="successMessage" class="auth-status auth-status--success" role="status">
        <CheckCircleIcon class="status-icon" />
        {{ successMessage }}
      </div>

      <div v-if="error" class="auth-status auth-status--error" role="alert">
        <ExclamationCircleIcon class="status-icon" />
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import {
    UserIcon,
    PhoneIcon,
    ClockIcon,
    CameraIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
  } from '@heroicons/vue/24/outline'
  import MailIcon from '@/components/icons/MailIcon.vue'
  import { useAuthStore } from '@/features/authentication/stores/auth'
  import type { User } from '@/features/authentication/types/auth.types'

  // Props & Emits
  interface Props {
    initialData?: Partial<User>
    showCancel?: boolean
  }

  interface Emits {
    (e: 'success', data: Partial<User>): void
    (e: 'cancel'): void
    (e: 'error', error: string): void
  }

  const props = withDefaults(defineProps<Props>(), {
    initialData: undefined,
    showCancel: true,
  })

  const emit = defineEmits<Emits>()

  // Composables
  const authStore = useAuthStore()

  // Form state
  const form = ref({
    name: '',
    email: '',
    phone: '',
    timezone: 'America/Mexico_City',
    defaultCalendarView: 'week' as 'week' | 'month' | 'day',
    startHour: 9,
    endHour: 18,
  })

  const originalForm = ref({ ...form.value })
  const isLoading = ref(false)
  const uploadingAvatar = ref(false)
  const successMessage = ref<string | null>(null)
  const error = ref<string | null>(null)
  const fileInput = ref<HTMLInputElement>()

  // Validation errors
  const errors = ref({
    name: '',
    phone: '',
  })

  // Current avatar
  const currentAvatar = ref<string | null>(null)

  // Timezone options
  const timezones = [
    { value: 'America/Mexico_City', label: 'Ciudad de México (GMT-6)' },
    { value: 'America/Tijuana', label: 'Tijuana (GMT-8)' },
    { value: 'America/New_York', label: 'Nueva York (GMT-5)' },
    { value: 'America/Los_Angeles', label: 'Los Ángeles (GMT-8)' },
    { value: 'Europe/Madrid', label: 'Madrid (GMT+1)' },
    { value: 'Europe/London', label: 'Londres (GMT+0)' },
    { value: 'Asia/Tokyo', label: 'Tokio (GMT+9)' },
  ]

  // Computed properties
  const hasChanges = computed((): boolean => {
    return JSON.stringify(form.value) !== JSON.stringify(originalForm.value)
  })

  const isFormValid = computed((): boolean => {
    return form.value.name.trim() !== '' && !errors.value.name && !errors.value.phone
  })

  const avatarInitials = computed((): string => {
    const name = form.value.name
    if (!name) return 'U'

    const nameParts = name.split(' ')
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  })

  // Methods
  const validateName = (): void => {
    if (!form.value.name.trim()) {
      errors.value.name = 'El nombre es requerido'
    } else if (form.value.name.trim().length < 2) {
      errors.value.name = 'El nombre debe tener al menos 2 caracteres'
    } else {
      errors.value.name = ''
    }
  }

  const validatePhone = (): void => {
    const phoneRegex = /^[+]?[0-9\s\-()]+$/
    if (form.value.phone && !phoneRegex.test(form.value.phone)) {
      errors.value.phone = 'Formato de teléfono inválido'
    } else {
      errors.value.phone = ''
    }
  }

  const handleFileSelect = async (event: Event): Promise<void> => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      error.value = 'Por favor selecciona una imagen válida'
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      error.value = 'La imagen debe ser menor a 5MB'
      return
    }

    try {
      uploadingAvatar.value = true
      error.value = null

      // Create preview
      const reader = new FileReader()
      reader.onload = e => {
        currentAvatar.value = e.target?.result as string
      }
      reader.readAsDataURL(file)

      // TODO: Upload to backend
      // const formData = new FormData()
      // formData.append('avatar', file)
      // const response = await fetch('/v1/auth/profile/avatar', {
      //   method: 'POST',
      //   body: formData
      // })

      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate upload
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al subir la imagen'
      currentAvatar.value = null
    } finally {
      uploadingAvatar.value = false
    }
  }

  const removeAvatar = async (): Promise<void> => {
    try {
      uploadingAvatar.value = true

      // TODO: Remove from backend
      // await fetch('/v1/auth/profile/avatar', { method: 'DELETE' })

      currentAvatar.value = null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar la imagen'
    } finally {
      uploadingAvatar.value = false
    }
  }

  const handleSubmit = async (): Promise<void> => {
    try {
      error.value = null
      successMessage.value = null

      // Validate form
      validateName()
      validatePhone()

      if (!isFormValid.value) return

      isLoading.value = true

      // Prepare update data
      const updateData = {
        name: form.value.name,
        phone_number: form.value.phone || undefined,
        zoneinfo: form.value.timezone,
        'https://vana.app/user_metadata': {
          timezone: form.value.timezone,
          calendar_preferences: {
            default_view: form.value.defaultCalendarView,
            start_hour: form.value.startHour,
            end_hour: form.value.endHour,
          },
        },
      }

      // TODO: Call backend API
      // const response = await fetch('/v1/auth/profile', {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updateData)
      // })
      // if (!response.ok) throw new Error('Update failed')

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Update store
      await authStore.updateProfile(updateData)

      // Update original form to reflect saved state
      originalForm.value = { ...form.value }

      successMessage.value = 'Perfil actualizado correctamente'

      // Clear success message after 3 seconds
      setTimeout(() => {
        successMessage.value = null
      }, 3000)

      emit('success', updateData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el perfil'
      error.value = errorMessage
      emit('error', errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  const handleCancel = (): void => {
    // Reset form to original values
    form.value = { ...originalForm.value }
    currentAvatar.value = authStore.userAvatar
    error.value = null
    successMessage.value = null

    // Clear validation errors
    errors.value = {
      name: '',
      phone: '',
    }

    emit('cancel')
  }

  // Initialize form with user data
  const initializeForm = (): void => {
    const user = authStore.user
    if (user) {
      const metadata = user['https://vana.app/user_metadata']

      form.value = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone_number || '',
        timezone: user.zoneinfo || metadata?.timezone || 'America/Mexico_City',
        defaultCalendarView: (metadata?.calendar_preferences?.default_view as 'week' | 'month' | 'day') || 'week',
        startHour: metadata?.calendar_preferences?.start_hour || 9,
        endHour: metadata?.calendar_preferences?.end_hour || 18,
      }

      originalForm.value = { ...form.value }
      currentAvatar.value = user.picture || null
    }

    // If initial data provided via props, merge it
    if (props.initialData) {
      form.value = { ...form.value, ...props.initialData }
    }
  }

  // Watch for auth store changes
  watch(() => authStore.user, initializeForm, { immediate: true })

  // Clear messages when form changes
  watch(
    form,
    () => {
      error.value = null
      successMessage.value = null
    },
    { deep: true }
  )

  // Lifecycle
  onMounted((): void => {
    initializeForm()
  })
</script>

<style lang="scss" scoped>
  @use '@/styles/tokens' as *;
  @use '@/styles/globals/mixins' as *;
  @use '@/styles/auth/auth-components' as *;

  .profile-edit-form {
    padding: 20px;
  }

  // Form Header

  .profile-edit-header {
    text-align: center;
    margin-bottom: 32px;

    .header-icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border-radius: 50%;
      margin: 0 auto 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;

      .icon {
        width: 28px;
        height: 28px;
      }
    }

    .title {
      font-size: 24px;
      font-weight: 600;
      color: #312e81;
      margin-bottom: 8px;
    }

    .subtitle {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.5;
    }
  }

  // Profile Picture Section

  .profile-picture-section {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 24px;
    padding: 20px;
    background: rgba(99, 102, 241, 5%);
    border: 1px solid rgba(99, 102, 241, 10%);
    border-radius: 12px;

    .current-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 10%);

      .avatar-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .avatar-fallback {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: 600;
      }
    }

    .avatar-controls {
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1;

      .hidden-input {
        display: none;
      }

      @include mobile-only {
        flex-flow: row wrap;
      }
    }
  }

  // Form Sections

  .form-section {
    margin-bottom: 32px;
    padding-bottom: 32px;
    border-bottom: 1px solid rgba(99, 102, 241, 10%);

    &:last-of-type {
      border-bottom: none;
      margin-bottom: 0;
    }
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #312e81;
    margin-bottom: 20px;
    padding-bottom: 8px;
    border-bottom: 2px solid #6366f1;
    display: inline-block;
  }

  // Preferences

  .preferences-group {
    margin-bottom: 24px;
  }

  .group-title {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 12px;
  }

  .radio-group {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;

    @include mobile-only {
      flex-direction: column;
      gap: 8px;
    }
  }

  .radio-option {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
      border-color: #6366f1;
      background: rgba(99, 102, 241, 5%);
    }

    input[type='radio'] {
      margin: 0;
      accent-color: #6366f1;
    }

    .radio-label {
      font-size: 14px;
      color: #374151;
      font-weight: 500;
    }
  }

  // Time Range

  .time-range {
    display: flex;
    gap: 16px;
    align-items: end;

    @include mobile-only {
      flex-direction: column;
      align-items: stretch;
    }
  }

  .time-field {
    flex: 1;

    .time-label {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: #6b7280;
      margin-bottom: 4px;
    }
  }

  // Form Actions

  .form-actions {
    display: flex;
    gap: 16px;
    justify-content: flex-end;
    padding-top: 24px;
    border-top: 1px solid rgba(99, 102, 241, 10%);

    @include mobile-only {
      flex-direction: column;

      .auth-button {
        width: 100%;
        justify-content: center;
      }
    }
  }
</style>
