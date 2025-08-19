import { reactive, computed, watch } from 'vue'
import type { ValidationError, FormValidationResult } from '@/types/error.types'

// Email validation regex - more permissive than strict RFC
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Password strength levels
export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong'

export interface ValidationRule {
  name: string
  validator: (value: unknown) => boolean
  message: string
  severity: 'error' | 'warning'
}

export interface FieldValidation {
  value: unknown
  rules: ValidationRule[]
  errors: ValidationError[]
  warnings: string[]
  touched: boolean
  valid: boolean
}

export interface FormState {
  fields: Record<string, FieldValidation>
  isValid: boolean
  hasErrors: boolean
  hasWarnings: boolean
  isSubmitting: boolean
  submitAttempted: boolean
}

export const useFormValidation = () => {
  const formState = reactive<FormState>({
    fields: {},
    isValid: true,
    hasErrors: false,
    hasWarnings: false,
    isSubmitting: false,
    submitAttempted: false
  })

  // Debounced validation to reduce unnecessary checks
  const validationTimeouts = new Map<string, number>()

  // Common validation rules
  const commonRules = {
    required: (message = 'Este campo es obligatorio'): ValidationRule => ({
      name: 'required',
      validator: (value: unknown): boolean => {
        if (typeof value === 'string') return value.trim().length > 0
        return value != null && value !== ''
      },
      message,
      severity: 'error'
    }),

    email: (message = 'Ingresa un email válido'): ValidationRule => ({
      name: 'email',
      validator: (value: unknown): boolean => {
        if (typeof value !== 'string') return false
        return EMAIL_REGEX.test(value.trim())
      },
      message,
      severity: 'error'
    }),

    minLength: (min: number, message?: string): ValidationRule => ({
      name: 'minLength',
      validator: (value: unknown): boolean => {
        if (typeof value !== 'string') return false
        return value.length >= min
      },
      message: message || `Debe tener al menos ${min} caracteres`,
      severity: 'error'
    }),

    maxLength: (max: number, message?: string): ValidationRule => ({
      name: 'maxLength',
      validator: (value: unknown): boolean => {
        if (typeof value !== 'string') return false
        return value.length <= max
      },
      message: message || `No puede tener más de ${max} caracteres`,
      severity: 'error'
    }),

    pattern: (regex: RegExp, message: string): ValidationRule => ({
      name: 'pattern',
      validator: (value: unknown): boolean => {
        if (typeof value !== 'string') return false
        return regex.test(value)
      },
      message,
      severity: 'error'
    }),

    passwordStrength: (minStrength: PasswordStrength = 'fair'): ValidationRule => ({
      name: 'passwordStrength',
      validator: (value: unknown): boolean => {
        if (typeof value !== 'string') return false
        const strength = calculatePasswordStrength(value)
        const strengthOrder: PasswordStrength[] = ['weak', 'fair', 'good', 'strong']
        const currentIndex = strengthOrder.indexOf(strength)
        const minIndex = strengthOrder.indexOf(minStrength)
        return currentIndex >= minIndex
      },
      message: `La contraseña debe ser al menos ${minStrength === 'fair' ? 'regular' : minStrength}`,
      severity: 'error'
    }),

    confirmPassword: (originalField: string): ValidationRule => ({
      name: 'confirmPassword',
      validator: (value: unknown): boolean => {
        const originalValue = formState.fields[originalField]?.value
        return value === originalValue
      },
      message: 'Las contraseñas no coinciden',
      severity: 'error'
    }),

    // Warning rules
    commonEmail: (): ValidationRule => ({
      name: 'commonEmail',
      validator: (value: unknown): boolean => {
        if (typeof value !== 'string') return true
        const email = value.toLowerCase()
        const commonProviders = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com']
        return commonProviders.some(provider => email.includes(provider))
      },
      message: 'Considera usar tu email profesional para una mejor experiencia',
      severity: 'warning'
    })
  }

  // Password strength calculation
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) return 'weak'
    
    let score = 0
    
    // Length
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    
    // Character variety
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    
    // Common patterns (reduce score)
    if (/(.)\1{2,}/.test(password)) score -= 1 // Repeated characters
    if (/123|abc|qwe/i.test(password)) score -= 1 // Common sequences
    
    if (score <= 2) return 'weak'
    if (score <= 4) return 'fair'
    if (score <= 5) return 'good'
    return 'strong'
  }

  // Field registration and validation
  const registerField = (fieldName: string, rules: ValidationRule[] = [], initialValue: unknown = ''): void => {
    formState.fields[fieldName] = reactive({
      value: initialValue,
      rules,
      errors: [],
      warnings: [],
      touched: false,
      valid: true
    })

    // Watch for value changes and validate
    watch(
      () => formState.fields[fieldName].value,
      () => {
        if (formState.fields[fieldName].touched || formState.submitAttempted) {
          debouncedValidate(fieldName)
        }
      }
    )
  }

  const debouncedValidate = (fieldName: string, delay = 300): void => {
    if (validationTimeouts.has(fieldName)) {
      clearTimeout(validationTimeouts.get(fieldName))
    }

    const timeoutId = window.setTimeout(() => {
      validateField(fieldName)
      validationTimeouts.delete(fieldName)
    }, delay)

    validationTimeouts.set(fieldName, timeoutId)
  }

  const validateField = (fieldName: string): FormValidationResult => {
    const field = formState.fields[fieldName]
    if (!field) {
      return { isValid: true, errors: [], warnings: [] }
    }

    const errors: ValidationError[] = []
    const warnings: string[] = []

    field.rules.forEach(rule => {
      const isValid = rule.validator(field.value)
      
      if (!isValid) {
        if (rule.severity === 'error') {
          errors.push({
            type: 'validation',
            code: `${fieldName}_${rule.name}`,
            message: rule.message,
            field: fieldName,
            value: field.value,
            constraint: rule.name,
            timestamp: new Date().toISOString()
          })
        } else {
          warnings.push(rule.message)
        }
      }
    })

    // Update field state
    field.errors = errors
    field.warnings = warnings
    field.valid = errors.length === 0

    // Update form state
    updateFormState()

    return {
      isValid: field.valid,
      errors: field.errors,
      warnings: field.warnings
    }
  }

  const validateAllFields = (): FormValidationResult => {
    const allErrors: ValidationError[] = []
    const allWarnings: string[] = []

    Object.keys(formState.fields).forEach(fieldName => {
      const result = validateField(fieldName)
      allErrors.push(...result.errors)
      allWarnings.push(...result.warnings)
    })

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings
    }
  }

  const updateFormState = (): void => {
    const fieldValues = Object.values(formState.fields)
    formState.isValid = fieldValues.every(field => field.valid)
    formState.hasErrors = fieldValues.some(field => field.errors.length > 0)
    formState.hasWarnings = fieldValues.some(field => field.warnings.length > 0)
  }

  const setFieldValue = (fieldName: string, value: unknown): void => {
    const field = formState.fields[fieldName]
    if (field) {
      field.value = value
    }
  }

  const setFieldTouched = (fieldName: string, touched = true): void => {
    const field = formState.fields[fieldName]
    if (field) {
      field.touched = touched
      if (touched) {
        validateField(fieldName)
      }
    }
  }

  const clearFieldError = (fieldName: string): void => {
    const field = formState.fields[fieldName]
    if (field) {
      field.errors = []
      field.valid = true
      updateFormState()
    }
  }

  const resetForm = (): void => {
    Object.keys(formState.fields).forEach(fieldName => {
      const field = formState.fields[fieldName]
      field.value = ''
      field.errors = []
      field.warnings = []
      field.touched = false
      field.valid = true
    })
    
    formState.isSubmitting = false
    formState.submitAttempted = false
    updateFormState()
  }

  const setSubmitting = (submitting: boolean): void => {
    formState.isSubmitting = submitting
  }

  const setSubmitAttempted = (attempted = true): void => {
    formState.submitAttempted = attempted
  }

  // Helper for getting field display value
  const getFieldValue = (fieldName: string): unknown => {
    return formState.fields[fieldName]?.value ?? ''
  }

  const getFieldErrors = (fieldName: string): ValidationError[] => {
    return formState.fields[fieldName]?.errors ?? []
  }

  const getFieldWarnings = (fieldName: string): string[] => {
    return formState.fields[fieldName]?.warnings ?? []
  }

  const isFieldValid = (fieldName: string): boolean => {
    return formState.fields[fieldName]?.valid ?? true
  }

  const isFieldTouched = (fieldName: string): boolean => {
    return formState.fields[fieldName]?.touched ?? false
  }

  // Computed properties for UI binding
  const formErrors = computed((): ValidationError[] => {
    return Object.values(formState.fields).flatMap(field => field.errors)
  })

  const formWarnings = computed((): string[] => {
    return Object.values(formState.fields).flatMap(field => field.warnings)
  })

  const canSubmit = computed((): boolean => {
    return formState.isValid && !formState.isSubmitting
  })

  // Password strength reactive calculation
  const getPasswordStrength = (password: string): {
    strength: PasswordStrength
    score: number
    feedback: string[]
  } => {
    const strength = calculatePasswordStrength(password)
    const feedback: string[] = []
    
    if (password.length < 8) {
      feedback.push('Usa al menos 8 caracteres')
    }
    if (!/[A-Z]/.test(password)) {
      feedback.push('Incluye una mayúscula')
    }
    if (!/[a-z]/.test(password)) {
      feedback.push('Incluye una minúscula')
    }
    if (!/[0-9]/.test(password)) {
      feedback.push('Incluye un número')
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      feedback.push('Incluye un símbolo')
    }
    
    const strengthOrder: PasswordStrength[] = ['weak', 'fair', 'good', 'strong']
    const score = (strengthOrder.indexOf(strength) + 1) * 25
    
    return { strength, score, feedback }
  }

  return {
    // State
    formState,
    
    // Rules
    commonRules,
    
    // Methods
    registerField,
    validateField,
    validateAllFields,
    setFieldValue,
    setFieldTouched,
    clearFieldError,
    resetForm,
    setSubmitting,
    setSubmitAttempted,
    
    // Getters
    getFieldValue,
    getFieldErrors,
    getFieldWarnings,
    isFieldValid,
    isFieldTouched,
    
    // Computed
    formErrors,
    formWarnings,
    canSubmit,
    
    // Utilities
    calculatePasswordStrength,
    getPasswordStrength
  }
}