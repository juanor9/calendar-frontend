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
      <span v-if="required" class="form-field__required" aria-hidden="true">*</span>
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
      <div v-if="validating" class="form-field__icon form-field__icon--loading" aria-hidden="true">
        <div class="form-field__spinner" />
      </div>
    </div>

    <!-- Help text -->
    <div v-if="helpText" :id="`${fieldId}-help`" class="form-field__help">
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
      <div v-for="error in fieldErrors" :key="error.code" class="form-field__error-message">
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
      <div v-for="warning in fieldWarnings" :key="warning" class="form-field__warning-message">
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
  import { useFormValidation } from '@/composables/useFormValidation'
  import type { ValidationError } from '@/types/error.types'

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

<style lang="scss" scoped>
  .form-field {
    margin-bottom: var(--spacing-md);

    &--disabled {
      opacity: 60%;
      cursor: not-allowed;
    }

    &__label {
      display: block;

      @include design-token('typography', 'body-md');
      @include design-token('color', 'text-primary');

      font-weight: 500;
      margin-bottom: var(--spacing-xs);
      cursor: pointer;

      &--required {
        .form-field__required {
          color: var(--color-error-500);
          margin-left: var(--spacing-xs);
        }
      }
    }

    &__input-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    &__input {
      width: 100%;
      min-height: 48px; // Touch target
      padding: var(--spacing-sm) var(--spacing-md);
      border: 2px solid var(--color-border-secondary);
      border-radius: var(--border-radius-md);
      background: var(--color-background-primary);

      @include design-token('typography', 'body-md');
      @include design-token('color', 'text-primary');

      transition: all 0.2s ease;

      &::placeholder {
        @include design-token('color', 'text-tertiary');
      }

      &:focus {
        outline: none;
        border-color: var(--color-primary-500);
        box-shadow: 0 0 0 3px var(--color-primary-100);
      }

      &:disabled,
      &[readonly] {
        background: var(--color-background-secondary);
        cursor: not-allowed;
      }
    }

    // Field states

    &--error {
      .form-field__input {
        border-color: var(--color-error-500);

        &:focus {
          border-color: var(--color-error-500);
          box-shadow: 0 0 0 3px var(--color-error-100);
        }
      }
    }

    &--warning {
      .form-field__input {
        border-color: var(--color-warning-500);

        &:focus {
          border-color: var(--color-warning-500);
          box-shadow: 0 0 0 3px var(--color-warning-100);
        }
      }
    }

    &--success {
      .form-field__input {
        border-color: var(--color-success-500);

        &:focus {
          border-color: var(--color-success-500);
          box-shadow: 0 0 0 3px var(--color-success-100);
        }
      }
    }

    &__icon {
      position: absolute;
      right: var(--spacing-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      pointer-events: none;

      svg {
        width: 16px;
        height: 16px;
      }

      &--success {
        color: var(--color-success-600);
      }

      &--error {
        color: var(--color-error-600);
      }

      &--loading {
        color: var(--color-primary-600);
      }
    }

    &__spinner {
      width: 16px;
      height: 16px;
      border: 2px solid var(--color-primary-200);
      border-top: 2px solid var(--color-primary-600);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    &__help {
      margin-top: var(--spacing-xs);

      @include design-token('typography', 'body-sm');
      @include design-token('color', 'text-secondary');
    }

    &__error-messages,
    &__warning-messages {
      margin-top: var(--spacing-xs);
    }

    &__error-message,
    &__warning-message {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-xs);

      @include design-token('typography', 'body-sm');

      margin-bottom: var(--spacing-xs);

      &:last-child {
        margin-bottom: 0;
      }
    }

    &__error-message {
      @include design-token('color', 'error-600');

      .form-field__error-icon {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        margin-top: 1px; // Align with text
      }
    }

    &__warning-message {
      @include design-token('color', 'warning-600');

      .form-field__warning-icon {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        margin-top: 1px; // Align with text
      }
    }

    &__character-count {
      margin-top: var(--spacing-xs);
      text-align: right;

      @include design-token('typography', 'body-xs');
      @include design-token('color', 'text-tertiary');

      &--error {
        @include design-token('color', 'error-600');
      }
    }
  }

  // Animations
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  // Screen reader only class

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
