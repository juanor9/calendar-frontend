<script setup lang="ts">
  import { computed } from 'vue'
  import { useFormValidation } from '@/shared/composables/useFormValidation'

  // Component props interface
  interface Props {
    password: string
    showScore?: boolean
    showDetails?: boolean
    compact?: boolean
  }

  // Props with defaults
  const props = withDefaults(defineProps<Props>(), {
    password: '',
    showScore: true,
    showDetails: true,
    compact: false,
  })

  // Use form validation composable for consistent password strength calculation
  const { getPasswordStrength } = useFormValidation()

  // Password strength data
  const passwordStrengthData = computed(() => getPasswordStrength(props.password))

  const strengthScore = computed((): number => passwordStrengthData.value.score)

  const strengthLevel = computed(() => passwordStrengthData.value.strength)

  const strengthText = computed((): string => {
    switch (strengthLevel.value) {
      case 'weak':
        return 'Débil'
      case 'fair':
        return 'Regular'
      case 'good':
        return 'Buena'
      case 'strong':
        return 'Fuerte'
      default:
        return ''
    }
  })

  const strengthColor = computed((): string => {
    switch (strengthLevel.value) {
      case 'weak':
        return 'danger'
      case 'fair':
        return 'warning'
      case 'good':
        return 'info'
      case 'strong':
        return 'safe'
      default:
        return 'neutral'
    }
  })

  // Password criteria checks with Spanish text
  const criteria = computed(() => {
    const password = props.password

    return {
      length: {
        met: password.length >= 8,
        text: 'Al menos 8 caracteres',
      },
      lowercase: {
        met: /[a-z]/.test(password),
        text: 'Una letra minúscula',
      },
      uppercase: {
        met: /[A-Z]/.test(password),
        text: 'Una letra mayúscula',
      },
      number: {
        met: /[0-9]/.test(password),
        text: 'Un número',
      },
      special: {
        met: /[^A-Za-z0-9]/.test(password),
        text: 'Un carácter especial',
      },
    }
  })

  const progressClasses = computed(() => {
    return {
      'password-strength__progress': true,
      [`password-strength__progress--${strengthColor.value}`]: true,
      'password-strength__progress--compact': props.compact,
    }
  })

  const indicatorClasses = computed(() => {
    return {
      'password-strength': true,
      'password-strength--compact': props.compact,
    }
  })

  // Trust-building feedback messages
  const trustBuildingFeedback = computed((): string => {
    const feedback = passwordStrengthData.value.feedback

    if (feedback.length === 0 && strengthLevel.value === 'strong') {
      return '¡Excelente! Tu contraseña está bien protegida.'
    }

    if (feedback.length > 0) {
      return `Para mayor seguridad: ${feedback[0]}`
    }

    return ''
  })
</script>

<template>
  <div :class="indicatorClasses">
    <!-- Progress bar and score -->
    <div class="password-strength__header">
      <div class="password-strength__progress-container">
        <div
          :class="progressClasses"
          role="progressbar"
          :aria-valuenow="strengthScore"
          :aria-valuemin="0"
          :aria-valuemax="100"
          :aria-label="`Password strength: ${strengthText}`"
        >
          <div class="password-strength__progress-fill" :style="{ width: `${strengthScore}%` }" />
        </div>
      </div>

      <div
        v-if="props.showScore && props.password"
        class="password-strength__score"
        :class="`password-strength__score--${strengthColor}`"
      >
        {{ strengthText }}
      </div>
    </div>

    <!-- Detailed criteria (only show when details enabled and password exists) -->
    <div
      v-if="props.showDetails && props.password && !props.compact"
      class="password-strength__criteria"
    >
      <ul class="password-strength__criteria-list" role="list" aria-label="Password requirements">
        <li
          v-for="(criterion, key) in criteria"
          :key="key"
          class="password-strength__criterion"
          :class="{
            'password-strength__criterion--met': criterion.met,
            'password-strength__criterion--unmet': !criterion.met,
          }"
        >
          <span class="password-strength__criterion-icon" :aria-hidden="true">
            {{ criterion.met ? '✓' : '○' }}
          </span>

          <span class="password-strength__criterion-text">
            {{ criterion.text }}
          </span>

          <span class="sr-only">
            {{ criterion.met ? 'Met' : 'Not met' }}
          </span>
        </li>
      </ul>
    </div>

    <!-- Compact criteria (show only unmet when compact mode) -->
    <div
      v-if="props.showDetails && props.password && props.compact"
      class="password-strength__compact-hints"
    >
      <div v-if="Object.values(criteria).some(c => !c.met)" class="password-strength__hint">
        <span class="password-strength__hint-text">
          Falta:
          {{
            Object.values(criteria)
              .filter(c => !c.met)
              .map(c => c.text.toLowerCase())
              .join(', ')
          }}
        </span>
      </div>
    </div>

    <!-- Trust-building feedback -->
    <div v-if="trustBuildingFeedback && props.password" class="password-strength__feedback">
      <span class="password-strength__feedback-text">
        {{ trustBuildingFeedback }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" src="./PasswordStrengthIndicator.scss"></style>
