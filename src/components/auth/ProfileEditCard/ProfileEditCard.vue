<script setup lang="ts">
  import { ref, computed, reactive } from 'vue'

  // User profile interface
  interface UserProfile {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    timezone: string
    language: string
    jobTitle: string
    company: string
  }

  // Component props interface
  interface Props {
    profile: UserProfile
    loading?: boolean
    readonly?: boolean
    showAdvanced?: boolean
    title?: string
  }

  // Component emits interface
  interface Emits {
    save: [profile: UserProfile]
    cancel: []
    'update:profile': [profile: UserProfile]
  }

  // Props with defaults
  const props = withDefaults(defineProps<Props>(), {
    loading: false,
    readonly: false,
    showAdvanced: false,
    title: 'Edit Profile',
  })

  // Emits definition
  const emit = defineEmits<Emits>()

  // Form state
  const formData = reactive<UserProfile>({ ...props.profile })
  const errors = ref<Partial<Record<keyof UserProfile, string>>>({})
  const isDirty = ref<boolean>(false)

  // Available options
  const timezones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
  ]

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'it', label: 'Italiano' },
    { value: 'pt', label: 'Português' },
    { value: 'ja', label: '日本語' },
    { value: 'zh', label: '中文' },
  ]

  // Computed properties
  const isFormValid = computed((): boolean => {
    return (
      formData.firstName.trim().length > 0 &&
      formData.lastName.trim().length > 0 &&
      isValidEmail(formData.email) &&
      Object.keys(errors.value).length === 0
    )
  })

  const hasChanges = computed((): boolean => {
    return JSON.stringify(formData) !== JSON.stringify(props.profile)
  })

  // Validation functions
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isValidPhoneNumber = (phone: string): boolean => {
    if (!phone) return true // Optional field
    const phoneRegex = /^[+]?[\s\-()0-9]{10,}$/
    return phoneRegex.test(phone)
  }

  // Validation methods
  const validateField = (field: keyof UserProfile): void => {
    const value = formData[field]

    switch (field) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          errors.value[field] = `${field === 'firstName' ? 'First' : 'Last'} name is required`
        } else {
          delete errors.value[field]
        }
        break

      case 'email':
        if (!value.trim()) {
          errors.value[field] = 'Email is required'
        } else if (!isValidEmail(value)) {
          errors.value[field] = 'Please enter a valid email address'
        } else {
          delete errors.value[field]
        }
        break

      case 'phoneNumber':
        if (value && !isValidPhoneNumber(value)) {
          errors.value[field] = 'Please enter a valid phone number'
        } else {
          delete errors.value[field]
        }
        break

      default:
        delete errors.value[field]
    }
  }

  // Event handlers
  const handleFieldChange = (field: keyof UserProfile): void => {
    isDirty.value = true
    validateField(field)

    // Emit profile update for real-time sync
    emit('update:profile', { ...formData })
  }

  const handleSave = (): void => {
    if (!isFormValid.value || props.loading) {
      return
    }

    // Validate all fields before saving
    Object.keys(formData).forEach(key => {
      validateField(key as keyof UserProfile)
    })

    if (Object.keys(errors.value).length === 0) {
      emit('save', { ...formData })
    }
  }

  const handleCancel = (): void => {
    // Reset form to original values
    Object.assign(formData, props.profile)
    errors.value = {}
    isDirty.value = false

    emit('cancel')
  }

  const handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      handleSave()
    }

    if (event.key === 'Escape') {
      handleCancel()
    }
  }
</script>

<template>
  <div class="profile-edit-card">
    <div class="profile-edit-card__header">
      <h2 class="profile-edit-card__title">
        {{ props.title }}
      </h2>

      <div
        v-if="hasChanges && !props.readonly"
        class="profile-edit-card__status"
        aria-live="polite"
      >
        <span class="profile-edit-card__status-indicator"> Unsaved changes </span>
      </div>
    </div>

    <form class="profile-edit-card__form" @submit.prevent="handleSave" @keydown="handleKeydown">
      <!-- Basic Information -->
      <div class="profile-edit-card__section">
        <h3 class="profile-edit-card__section-title">Basic Information</h3>

        <div class="profile-edit-card__field-group">
          <div class="profile-edit-card__field">
            <label for="firstName" class="profile-edit-card__label"> First Name * </label>

            <input
              id="firstName"
              v-model="formData.firstName"
              type="text"
              class="profile-edit-card__input"
              :class="{
                'profile-edit-card__input--error': errors.firstName,
              }"
              :readonly="props.readonly"
              :disabled="props.loading"
              :aria-describedby="errors.firstName ? 'firstName-error' : undefined"
              :aria-invalid="!!errors.firstName"
              autocomplete="given-name"
              @input="handleFieldChange('firstName')"
            />

            <div
              v-if="errors.firstName"
              id="firstName-error"
              class="profile-edit-card__error"
              role="alert"
            >
              {{ errors.firstName }}
            </div>
          </div>

          <div class="profile-edit-card__field">
            <label for="lastName" class="profile-edit-card__label"> Last Name * </label>

            <input
              id="lastName"
              v-model="formData.lastName"
              type="text"
              class="profile-edit-card__input"
              :class="{
                'profile-edit-card__input--error': errors.lastName,
              }"
              :readonly="props.readonly"
              :disabled="props.loading"
              :aria-describedby="errors.lastName ? 'lastName-error' : undefined"
              :aria-invalid="!!errors.lastName"
              autocomplete="family-name"
              @input="handleFieldChange('lastName')"
            />

            <div
              v-if="errors.lastName"
              id="lastName-error"
              class="profile-edit-card__error"
              role="alert"
            >
              {{ errors.lastName }}
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="profile-edit-card__section">
        <h3 class="profile-edit-card__section-title">Contact Information</h3>

        <div class="profile-edit-card__field">
          <label for="email" class="profile-edit-card__label"> Email Address * </label>

          <input
            id="email"
            v-model="formData.email"
            type="email"
            class="profile-edit-card__input"
            :class="{
              'profile-edit-card__input--error': errors.email,
            }"
            :readonly="props.readonly"
            :disabled="props.loading"
            :aria-describedby="errors.email ? 'email-error' : undefined"
            :aria-invalid="!!errors.email"
            autocomplete="email"
            @input="handleFieldChange('email')"
          />

          <div v-if="errors.email" id="email-error" class="profile-edit-card__error" role="alert">
            {{ errors.email }}
          </div>
        </div>

        <div class="profile-edit-card__field">
          <label for="phoneNumber" class="profile-edit-card__label"> Phone Number </label>

          <input
            id="phoneNumber"
            v-model="formData.phoneNumber"
            type="tel"
            class="profile-edit-card__input"
            :class="{
              'profile-edit-card__input--error': errors.phoneNumber,
            }"
            :readonly="props.readonly"
            :disabled="props.loading"
            :aria-describedby="errors.phoneNumber ? 'phoneNumber-error' : undefined"
            :aria-invalid="!!errors.phoneNumber"
            autocomplete="tel"
            placeholder="(555) 123-4567"
            @input="handleFieldChange('phoneNumber')"
          />

          <div
            v-if="errors.phoneNumber"
            id="phoneNumber-error"
            class="profile-edit-card__error"
            role="alert"
          >
            {{ errors.phoneNumber }}
          </div>
        </div>
      </div>

      <!-- Advanced Settings -->
      <div v-if="props.showAdvanced" class="profile-edit-card__section">
        <h3 class="profile-edit-card__section-title">Preferences</h3>

        <div class="profile-edit-card__field-group">
          <div class="profile-edit-card__field">
            <label for="timezone" class="profile-edit-card__label"> Timezone </label>

            <select
              id="timezone"
              v-model="formData.timezone"
              class="profile-edit-card__select"
              :disabled="props.readonly || props.loading"
              @change="handleFieldChange('timezone')"
            >
              <option value="">Select timezone</option>
              <option v-for="timezone in timezones" :key="timezone.value" :value="timezone.value">
                {{ timezone.label }}
              </option>
            </select>
          </div>

          <div class="profile-edit-card__field">
            <label for="language" class="profile-edit-card__label"> Language </label>

            <select
              id="language"
              v-model="formData.language"
              class="profile-edit-card__select"
              :disabled="props.readonly || props.loading"
              @change="handleFieldChange('language')"
            >
              <option value="">Select language</option>
              <option v-for="language in languages" :key="language.value" :value="language.value">
                {{ language.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="profile-edit-card__field-group">
          <div class="profile-edit-card__field">
            <label for="jobTitle" class="profile-edit-card__label"> Job Title </label>

            <input
              id="jobTitle"
              v-model="formData.jobTitle"
              type="text"
              class="profile-edit-card__input"
              :readonly="props.readonly"
              :disabled="props.loading"
              autocomplete="organization-title"
              placeholder="e.g. Software Engineer"
              @input="handleFieldChange('jobTitle')"
            />
          </div>

          <div class="profile-edit-card__field">
            <label for="company" class="profile-edit-card__label"> Company </label>

            <input
              id="company"
              v-model="formData.company"
              type="text"
              class="profile-edit-card__input"
              :readonly="props.readonly"
              :disabled="props.loading"
              autocomplete="organization"
              placeholder="e.g. Acme Inc."
              @input="handleFieldChange('company')"
            />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="!props.readonly" class="profile-edit-card__actions">
        <button
          type="button"
          class="profile-edit-card__cancel-button"
          :disabled="props.loading"
          @click="handleCancel"
        >
          Cancel
        </button>

        <button
          type="submit"
          class="profile-edit-card__save-button"
          :class="{
            'profile-edit-card__save-button--disabled': !isFormValid || props.loading,
            'profile-edit-card__save-button--loading': props.loading,
          }"
          :disabled="!isFormValid || props.loading"
          :aria-busy="props.loading"
        >
          <span v-if="!props.loading"> Save Changes </span>
          <span v-else> Saving... </span>

          <div v-if="props.loading" class="profile-edit-card__spinner" aria-hidden="true" />
        </button>
      </div>
    </form>

    <!-- Keyboard shortcuts hint -->
    <div v-if="!props.readonly" class="profile-edit-card__hints">
      <p class="profile-edit-card__hint">
        <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to save, <kbd>Esc</kbd> to cancel
      </p>
    </div>
  </div>
</template>

<style lang="scss" src="./ProfileEditCard.scss"></style>
