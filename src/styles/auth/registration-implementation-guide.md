# Vana Registration Flow - Implementation Guide

## Quick Start for Frontend Developers

### 1. Import Structure

```scss
// In your Vue components
@use '@/styles/tokens' as *;

// Available tokens
$vana-registration-primary      // #6366f1 - Main brand color
$vana-registration-accent       // #10b981 - Success states
$vana-registration-progress     // #06b6d4 - Progress indicators
$auth-register-primary-hover    // Hover states
$auth-register-primary-active   // Active states
```

### 2. Component Usage Patterns

#### RegisterButton Component

```vue
<template>
  <RegisterButton
    :variant="'primary'"
    :size="'large'"
    :loading="isRegistering"
    :disabled="!isFormValid"
    @click="handleRegistration"
  >
    <template #icon-left>
      <UserPlusIcon />
    </template>
    Create Your Account
  </RegisterButton>
</template>

<style lang="scss" scoped>
  @use '@/styles/tokens' as *;

  .custom-register-override {
    // Custom styles if needed, inherits from RegisterButton.scss
    --register-button-bg: #{$vana-registration-primary};
  }
</style>
```

#### RegisterPage Layout

```vue
<template>
  <div class="register-page">
    <div class="register-page__container">
      <div class="register-page__card">
        <!-- Header Section -->
        <div class="register-page__header">
          <img src="/vana-logo.png" alt="Vana" class="register-page__logo" />
          <h1 class="register-page__title">Join thousands of professionals</h1>
          <p class="register-page__subtitle">
            Save 4+ hours weekly with AI-powered calendar optimization
          </p>
        </div>

        <!-- Value Props -->
        <div class="register-page__value-props">
          <div class="register-page__value-prop">
            <CheckCircleIcon class="register-page__value-icon" />
            <div class="register-page__value-text">
              <strong>Smart Time Blocking</strong>
              <span>AI automatically schedules focus time around meetings</span>
            </div>
          </div>
          <!-- More value props... -->
        </div>

        <!-- Actions -->
        <div class="register-page__actions">
          <RegisterButton
            variant="primary"
            size="large"
            full-width
            @click="initiateAuth0Registration"
          >
            Continue with Secure Login
          </RegisterButton>
          <p class="register-page__alternative">
            Already have an account?
            <RouterLink to="/login">Sign in here</RouterLink>
          </p>
        </div>

        <!-- Legal -->
        <div class="register-page__legal">
          <p class="register-page__terms">
            By continuing, you agree to our
            <a href="/terms">Terms of Service</a> and
            <a href="/privacy">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
```

### 3. Responsive Implementation

#### Mobile-First CSS Pattern

```scss
// Base styles (mobile)
.register-button {
  min-height: $auth-button-height-md; // 40px
  padding: $auth-spacing-sm $auth-spacing-md;
  font-size: $auth-text-sm;

  // Tablet and up
  @include tablet-up {
    min-height: $auth-button-height-lg; // 48px
    padding: $auth-spacing-md $auth-spacing-xl;
    font-size: $auth-text-md;
  }
}

// Container responsive pattern
.register-page__container {
  padding: $spacing-md;

  @include tablet-up {
    padding: $spacing-xl;
    max-width: 520px;
  }
}
```

### 4. Loading States Implementation

#### Button Loading State

```vue
<template>
  <RegisterButton :class="{ 'register-button--loading': isLoading }" :disabled="isLoading">
    {{ isLoading ? 'Creating Account...' : 'Create Account' }}
  </RegisterButton>
</template>

<script setup>
  const isLoading = ref(false)

  const handleRegistration = async () => {
    isLoading.value = true
    try {
      await registerUser()
    } finally {
      isLoading.value = false
    }
  }
</script>
```

#### Page Loading Overlay

```vue
<template>
  <div class="register-page" :class="{ 'register-page--loading': isPageLoading }">
    <!-- Page content -->
  </div>
</template>

<style lang="scss" scoped>
  .register-page--loading {
    pointer-events: none;

    .register-page__card {
      position: relative;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba($white, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: $auth-radius-xl;
        z-index: 10;
      }
    }
  }
</style>
```

## Email Verification Implementation

### Progress Timeline Component

```vue
<template>
  <div class="email-verification__timeline">
    <div
      v-for="(step, index) in timelineSteps"
      :key="step.id"
      class="email-verification__timeline-item"
    >
      <div
        class="email-verification__timeline-icon"
        :class="{
          'email-verification__timeline-icon--complete': step.status === 'complete',
          'email-verification__timeline-icon--current': step.status === 'current',
          'email-verification__timeline-icon--pending': step.status === 'pending',
        }"
      >
        <CheckIcon v-if="step.status === 'complete'" />
        <ClockIcon v-else-if="step.status === 'current'" />
        <CircleIcon v-else />
      </div>
      <div class="email-verification__timeline-content">
        <h4>{{ step.title }}</h4>
        <p>{{ step.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
  const timelineSteps = ref([
    {
      id: 'registration',
      title: 'Account Created',
      description: 'Your registration was successful',
      status: 'complete',
    },
    {
      id: 'email-sent',
      title: 'Verification Email Sent',
      description: 'Check your inbox for the verification link',
      status: 'current',
    },
    {
      id: 'verification',
      title: 'Email Verification',
      description: 'Click the link to verify your email',
      status: 'pending',
    },
  ])
</script>
```

### Resend Button with Countdown

```vue
<template>
  <button
    class="email-verification__resend-button"
    :disabled="countdown > 0"
    @click="resendVerificationEmail"
  >
    <template v-if="countdown > 0">
      Resend in <span class="countdown">{{ countdown }}s</span>
    </template>
    <template v-else> Resend Verification Email </template>
  </button>
</template>

<script setup>
  const countdown = ref(60)
  const isResending = ref(false)

  const resendVerificationEmail = async () => {
    if (countdown.value > 0) return

    isResending.value = true
    try {
      await authService.resendVerification()
      startCountdown()
    } finally {
      isResending.value = false
    }
  }

  const startCountdown = () => {
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  }
</script>
```

## Onboarding Flow Implementation

### Progress Header Component

```vue
<template>
  <div class="onboarding-flow__progress-header">
    <div class="onboarding-flow__progress-container">
      <div class="onboarding-flow__progress-bar">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="onboarding-flow__progress-step"
          :class="{
            'onboarding-flow__progress-step--complete': currentStep > index + 1,
            'onboarding-flow__progress-step--active': currentStep === index + 1,
            'onboarding-flow__progress-step--pending': currentStep < index + 1,
          }"
        >
          {{ step.status === 'complete' ? '' : index + 1 }}
        </div>
      </div>
      <div class="onboarding-flow__progress-labels">
        <span
          v-for="(step, index) in steps"
          :key="index"
          class="onboarding-flow__progress-label"
          :class="{
            'onboarding-flow__progress-label--complete': currentStep > index + 1,
            'onboarding-flow__progress-label--active': currentStep === index + 1,
          }"
        >
          {{ step.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    currentStep: {
      type: Number,
      default: 1,
    },
  })

  const steps = [
    { label: 'Welcome', status: 'pending' },
    { label: 'Preferences', status: 'pending' },
    { label: 'Integration', status: 'pending' },
  ]
</script>
```

### Step Container with Transitions

```vue
<template>
  <div class="onboarding-flow" :data-step="currentStep">
    <!-- Progress header -->
    <OnboardingProgressHeader :current-step="currentStep" />

    <!-- Step content with transitions -->
    <div class="onboarding-flow__content">
      <Transition name="step" mode="out-in">
        <WelcomeStep v-if="currentStep === 1" @next="goToNext" />
        <PreferencesStep v-else-if="currentStep === 2" @next="goToNext" @back="goToPrevious" />
        <IntegrationStep
          v-else-if="currentStep === 3"
          @complete="completeOnboarding"
          @back="goToPrevious"
        />
      </Transition>
    </div>
  </div>
</template>

<script setup>
  const currentStep = ref(1)

  const goToNext = () => {
    if (currentStep.value < 3) {
      currentStep.value++
    }
  }

  const goToPrevious = () => {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  const completeOnboarding = async () => {
    // Handle completion
    await router.push('/dashboard')
  }
</script>

<style lang="scss" scoped>
  // Step transition animations
  .step-enter-active,
  .step-leave-active {
    transition: all 0.3s ease-out;
  }

  .step-enter-from {
    opacity: 0;
    transform: translateX(30px);
  }

  .step-leave-to {
    opacity: 0;
    transform: translateX(-30px);
  }
</style>
```

### Preferences Step with Option Cards

```vue
<template>
  <div class="onboarding-flow__step">
    <div class="onboarding-flow__step-header">
      <div class="onboarding-flow__step-icon">
        <SettingsIcon />
      </div>
      <h2 class="onboarding-flow__step-title">Set Your Preferences</h2>
      <p class="onboarding-flow__step-subtitle">
        Help us optimize your calendar for maximum productivity
      </p>
    </div>

    <div class="onboarding-flow__step-content">
      <!-- Work Hours -->
      <div class="onboarding-flow__form-group">
        <label class="onboarding-flow__form-label">Work Hours</label>
        <p class="onboarding-flow__form-description">
          When are you typically available for meetings?
        </p>
        <div class="onboarding-flow__time-picker">
          <div class="onboarding-flow__time-group">
            <label for="start-time">From</label>
            <select id="start-time" v-model="preferences.startTime">
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <!-- More options -->
            </select>
          </div>
          <div class="onboarding-flow__time-group">
            <label for="end-time">To</label>
            <select id="end-time" v-model="preferences.endTime">
              <option value="17:00">5:00 PM</option>
              <option value="18:00">6:00 PM</option>
              <!-- More options -->
            </select>
          </div>
        </div>
      </div>

      <!-- Focus Time Preferences -->
      <div class="onboarding-flow__form-group">
        <label class="onboarding-flow__form-label">Focus Time Blocks</label>
        <p class="onboarding-flow__form-description">
          How long do you prefer uninterrupted work sessions?
        </p>
        <div class="onboarding-flow__options-grid">
          <div
            v-for="option in focusTimeOptions"
            :key="option.value"
            class="onboarding-flow__option-card"
            :class="{
              'onboarding-flow__option-card--selected': preferences.focusTime === option.value,
            }"
            @click="preferences.focusTime = option.value"
          >
            <div class="onboarding-flow__option-icon">
              <ClockIcon />
            </div>
            <h3 class="onboarding-flow__option-title">{{ option.title }}</h3>
            <p class="onboarding-flow__option-description">{{ option.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="onboarding-flow__actions">
      <button class="onboarding-flow__back-button" @click="$emit('back')">Back</button>
      <RegisterButton
        class="onboarding-flow__next-button"
        variant="primary"
        size="medium"
        @click="handleNext"
      >
        Continue
      </RegisterButton>
    </div>
  </div>
</template>

<script setup>
  const emit = defineEmits(['next', 'back'])

  const preferences = reactive({
    startTime: '09:00',
    endTime: '17:00',
    focusTime: '90',
    meetingBuffer: '15',
  })

  const focusTimeOptions = [
    {
      value: '60',
      title: '1 Hour',
      description: 'Good for shorter focused tasks',
    },
    {
      value: '90',
      title: '90 Minutes',
      description: 'Optimal for deep work sessions',
    },
    {
      value: '120',
      title: '2 Hours',
      description: 'Extended focus for complex projects',
    },
  ]

  const handleNext = () => {
    // Save preferences
    emit('next', preferences)
  }
</script>
```

## Accessibility Implementation

### Focus Management

```vue
<script setup>
  import { nextTick } from 'vue'

  const stepContainer = ref(null)

  // Focus management on step changes
  watch(currentStep, async () => {
    await nextTick()
    // Focus first interactive element in new step
    const firstFocusable = stepContainer.value?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    firstFocusable?.focus()
  })

  // Trap focus in modal states
  const trapFocus = event => {
    const focusableElements = container.value.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstFocusable = focusableElements[0]
    const lastFocusable = focusableElements[focusableElements.length - 1]

    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === firstFocusable) {
        lastFocusable.focus()
        event.preventDefault()
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        firstFocusable.focus()
        event.preventDefault()
      }
    }
  }
</script>
```

### Screen Reader Support

```vue
<template>
  <div class="onboarding-flow" :aria-label="`Step ${currentStep} of 3: ${stepTitle}`" role="region">
    <!-- Progress header with ARIA -->
    <div
      class="onboarding-flow__progress-header"
      role="progressbar"
      :aria-valuenow="currentStep"
      aria-valuemin="1"
      aria-valuemax="3"
      :aria-valuetext="`Step ${currentStep} of 3`"
    >
      <!-- Progress content -->
    </div>

    <!-- Step content with live region -->
    <div class="onboarding-flow__content" role="main" aria-live="polite">
      <!-- Step components -->
    </div>
  </div>
</template>

<script setup>
  const stepTitles = {
    1: 'Welcome to Vana',
    2: 'Set Your Preferences',
    3: 'Connect Your Calendar',
  }

  const stepTitle = computed(() => stepTitles[currentStep.value])
</script>
```

## Performance Optimization

### Lazy Loading Components

```typescript
// router/index.ts
const routes = [
  {
    path: '/register',
    component: () => import('@/pages/RegisterPage.vue'),
  },
  {
    path: '/verify-email',
    component: () => import('@/pages/EmailVerificationPage.vue'),
  },
  {
    path: '/onboarding',
    component: () => import('@/pages/OnboardingFlow.vue'),
  },
]
```

### Image Optimization

```vue
<template>
  <!-- Logo with multiple formats -->
  <picture class="register-page__logo">
    <source srcset="/vana-logo.webp" type="image/webp" />
    <source srcset="/vana-logo.avif" type="image/avif" />
    <img src="/vana-logo.png" alt="Vana" loading="lazy" decoding="async" />
  </picture>
</template>
```

### CSS Critical Path

```vue
<!-- In App.vue or layout -->
<style>
  /* Critical CSS for registration flow */
  @use '@/styles/auth/critical-registration.scss';
</style>
```

## Testing Patterns

### Component Testing

```typescript
// RegisterButton.spec.ts
import { mount } from '@vue/test-utils'
import RegisterButton from '@/ui/RegisterButton/RegisterButton.vue'

describe('RegisterButton', () => {
  it('applies loading state correctly', async () => {
    const wrapper = mount(RegisterButton, {
      props: { loading: true },
    })

    expect(wrapper.classes()).toContain('register-button--loading')
    expect(wrapper.find('.register-button').attributes('disabled')).toBeDefined()
  })

  it('handles click events when not disabled', async () => {
    const wrapper = mount(RegisterButton)

    await wrapper.find('.register-button').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

### Accessibility Testing

```typescript
// a11y.spec.ts
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Registration Flow Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(RegisterPage)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

This implementation guide provides concrete code patterns and examples for implementing the Vana registration flow components with proper accessibility, performance, and testing considerations.
