<template>
  <div
    class="form-field"
    :class="{
      'form-field--error': hasError,
      'form-field--warning': hasWarning,
      'form-field--success': isValid && isTouched,
      'form-field--disabled': disabled,
    }"
  >
    <!-- Label -->
    <label
      v-if="label"
      :for="fieldId"
      class="form-field__label"
      :class="{ 'form-field__label--required': required }"
    >
      {{ label }}
      <span
        v-if="required"
        class="form-field__required"
        aria-hidden="true"
      >*</span>
    </label>

    <!-- Input container -->
    <div class="form-field__input-container">
      <!-- Input field -->
      <component
        :is="inputComponent"
        :id="fieldId"
        v-model="fieldValue"
        class="form-field__input"
        :class="inputClass"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :aria-invalid="hasError"
        :aria-describedby="ariaDescribedBy"
        v-bind="$attrs"
        @blur="handleBlur"
        @focus="handleFocus"
        @input="handleInput"
      />

      <!-- Success icon -->
      <div
        v-if="showSuccessIcon && isValid && isTouched"
        class="form-field__icon form-field__icon--success"
        aria-hidden="true"
      >
        <CheckIcon />
      </div>

      <!-- Error icon -->
      <div
        v-else-if="showErrorIcon && hasError"
        class="form-field__icon form-field__icon--error"
        aria-hidden="true"
      >
        <ExclamationCircleIcon />
      </div>

      <!-- Loading spinner -->
      <div
        v-if="validating"
        class="form-field__icon form-field__icon--loading"
        aria-hidden="true"
      >
        <div class="form-field__spinner" />
      </div>
    </div>

    <!-- Help text -->
    <div
      v-if="helpText"
      :id="`${fieldId}-help`"
      class="form-field__help"
    >
      {{ helpText }}
    </div>

    <!-- Error messages -->
    <div
      v-if="hasError"
      :id="`${fieldId}-error`"
      class="form-field__error-messages"
      role="alert"
      aria-live="polite"
    >
      <div
        v-for="error in fieldErrors"
        :key="error.code"
        class="form-field__error-message"
      >
        <ExclamationCircleIcon class="form-field__error-icon" />
        <span>{{ error.message }}</span>
      </div>
    </div>

    <!-- Warning messages -->
    <div
      v-if="hasWarning && showWarnings"
      :id="`${fieldId}-warning`"
      class="form-field__warning-messages"
      aria-live="polite"
    >
      <div
        v-for="warning in fieldWarnings"
        :key="warning"
        class="form-field__warning-message"
      >
        <ExclamationTriangleIcon class="form-field__warning-icon" />
        <span>{{ warning }}</span>
      </div>
    </div>

    <!-- Character count -->
    <div
      v-if="showCharacterCount && maxLength"
      class="form-field__character-count"
      :class="{ 'form-field__character-count--error': characterCountError }"
    >
      {{ characterCount }} / {{ maxLength }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import {
  CheckIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'
import { useFormValidation } from '@/shared/composables/useFormValidation'
import type { ValidationError } from '@/shared/types/error.types'

interface Props {
  name: string
  label?: string
  type?: string
  placeholder?: string
  helpText?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  autocomplete?: string
  maxLength?: number
  showSuccessIcon?: boolean
  showErrorIcon?: boolean
  showWarnings?: boolean
  showCharacterCount?: boolean
  validating?: boolean
  inputComponent?: string
  inputClass?: string
  // Validation rules will be passed separately
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  label: undefined,
  placeholder: undefined,
  helpText: undefined,
  required: false,
  disabled: false,
  readonly: false,
  autocomplete: undefined,
  maxLength: undefined,
  showSuccessIcon: true,
  showErrorIcon: true,
  showWarnings: true,
  showCharacterCount: false,
  validating: false,
  inputComponent: 'input',
  inputClass: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  input: [event: Event]
}>()

// Form validation composable
const {
  getFieldValue,
  getFieldErrors,
  getFieldWarnings,
  isFieldValid,
  isFieldTouched,
  setFieldValue,
  setFieldTouched,
} = useFormValidation()

// Local state
const fieldId = computed((): string => `field-${props.name}`)
const isFocused = ref(false)

// Two-way binding with form validation
const fieldValue = computed({
  get: (): string => {
    const value = getFieldValue(props.name)
    return typeof value === 'string' ? value : ''
  },
  set: (value: string): void => {
    setFieldValue(props.name, value)
    emit('update:modelValue', value)
  },
})

// Field state computed properties
const fieldErrors = computed((): ValidationError[] => getFieldErrors(props.name))
const fieldWarnings = computed((): string[] => getFieldWarnings(props.name))
const isValid = computed((): boolean => isFieldValid(props.name))
const isTouched = computed((): boolean => isFieldTouched(props.name))

const hasError = computed((): boolean => fieldErrors.value.length > 0)
const hasWarning = computed((): boolean => fieldWarnings.value.length > 0)

// Character count
const characterCount = computed((): number => fieldValue.value.length)
const characterCountError = computed((): boolean => {
  return props.maxLength ? characterCount.value > props.maxLength : false
})

// Accessibility
const ariaDescribedBy = computed((): string => {
  const descriptions: string[] = []

  if (props.helpText) descriptions.push(`${fieldId.value}-help`)
  if (hasError.value) descriptions.push(`${fieldId.value}-error`)
  if (hasWarning.value && props.showWarnings) descriptions.push(`${fieldId.value}-warning`)

  return descriptions.join(' ')
})

// Event handlers with explicit return types
const handleInput = (event: Event): void => {
  emit('input', event)
}

const handleFocus = (event: FocusEvent): void => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent): void => {
  isFocused.value = false
  setFieldTouched(props.name, true)
  emit('blur', event)
}

// Watch for validation state changes and announce to screen readers
watch([hasError, fieldErrors], ([newHasError, newErrors], [oldHasError]) => {
  if (!oldHasError && newHasError) {
    // New error appeared - announce it
    nextTick(() => {
      const errorMessage = newErrors[0]?.message || 'Error de validación'
      const announcement = document.createElement('div')
      announcement.setAttribute('aria-live', 'assertive')
      announcement.setAttribute('class', 'sr-only')
      announcement.textContent = `Error en ${props.label || props.name}: ${errorMessage}`

      document.body.appendChild(announcement)

      setTimeout(() => {
        document.body.removeChild(announcement)
      }, 1000)
    })
  }
})
</script>

<style lang="scss" src="./FormField.scss" scoped>

</style>