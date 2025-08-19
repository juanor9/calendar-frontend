<template>
  <FormField
    v-model="emailValue"
    name="email"
    type="email"
    :label="label"
    :placeholder="placeholder"
    :help-text="helpText"
    :required="required"
    :disabled="disabled"
    autocomplete="email"
    :validating="validating"
    @blur="handleBlur"
    @focus="handleFocus"
    @input="handleInput"
  />
</template>

<script setup lang="ts">
  import { computed, onMounted, watch } from 'vue'
  import FormField from './FormField.vue'
  import { useFormValidation } from '@/shared/composables/useFormValidation'

  interface Props {
    modelValue?: string
    label?: string
    placeholder?: string
    helpText?: string
    required?: boolean
    disabled?: boolean
    validating?: boolean
    // Validation options
    allowCommonProviders?: boolean
    requireBusinessEmail?: boolean
    suggestCorrections?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    label: 'Email',
    placeholder: 'tu@email.com',
    helpText: undefined,
    required: true,
    disabled: false,
    validating: false,
    allowCommonProviders: true,
    requireBusinessEmail: false,
    suggestCorrections: true,
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string]
    blur: [event: FocusEvent]
    focus: [event: FocusEvent]
    input: [event: Event]
    suggestion: [suggestion: string]
  }>()

  const { registerField, commonRules, getFieldValue, setFieldValue } = useFormValidation()

  // Email validation rules
  const emailRules = computed(() => {
    const rules = []

    if (props.required) {
      rules.push(commonRules.required('Ingresa tu email'))
    }

    rules.push(commonRules.email('Ingresa un email válido'))

    if (!props.allowCommonProviders) {
      rules.push(commonRules.commonEmail())
    }

    if (props.requireBusinessEmail) {
      rules.push({
        name: 'businessEmail',
        validator: (value: unknown): boolean => {
          if (typeof value !== 'string') return false
          const email = value.toLowerCase()
          const personalProviders = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com']
          return !personalProviders.some(provider => email.includes(provider))
        },
        message: 'Por favor usa tu email profesional',
        severity: 'warning' as const,
      })
    }

    return rules
  })

  // Two-way binding
  const emailValue = computed({
    get: (): string => {
      const value = getFieldValue('email')
      return typeof value === 'string' ? value : props.modelValue
    },
    set: (value: string): void => {
      setFieldValue('email', value)
      emit('update:modelValue', value)
    },
  })

  // Common email typo corrections
  const emailSuggestions: Record<string, string> = {
    'gmail.co': 'gmail.com',
    'gmail.cm': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmial.com': 'gmail.com',
    'gmail.om': 'gmail.com',
    'hotmial.com': 'hotmail.com',
    'hotmai.com': 'hotmail.com',
    'hotmal.com': 'hotmail.com',
    'yahooo.com': 'yahoo.com',
    'yahoo.co': 'yahoo.com',
    'outlok.com': 'outlook.com',
    'outlook.co': 'outlook.com',
  }

  const checkForTypos = (email: string): void => {
    if (!props.suggestCorrections || !email.includes('@')) return

    const [localPart, domain] = email.split('@')
    const suggestedDomain = emailSuggestions[domain?.toLowerCase()]

    if (suggestedDomain) {
      const suggestion = `${localPart}@${suggestedDomain}`
      emit('suggestion', suggestion)
    }
  }

  // Event handlers with explicit return types
  const handleBlur = (event: FocusEvent): void => {
    const email = emailValue.value
    if (email) {
      checkForTypos(email)
    }
    emit('blur', event)
  }

  const handleFocus = (event: FocusEvent): void => {
    emit('focus', event)
  }

  const handleInput = (event: Event): void => {
    emit('input', event)
  }

  // Register field on mount
  onMounted(() => {
    registerField('email', emailRules.value, props.modelValue)
  })

  // Update rules when props change
  watch(emailRules, newRules => {
    registerField('email', newRules, emailValue.value)
  })
</script>

<style lang="scss" src="./FormField.scss" scoped>
  // Styles inherited from FormField
</style>
