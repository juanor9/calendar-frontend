<template>
  <div 
    class="error-toast"
    :class="[
      `error-toast--${toast.type}`,
      { 'error-toast--dismissible': toast.dismissible }
    ]"
    role="alert"
    :aria-live="toast.type === 'error' ? 'assertive' : 'polite'"
  >
    <div class="error-toast__content">
      <!-- Icon -->
      <div class="error-toast__icon">
        <CheckCircleIcon v-if="toast.type === 'success'" />
        <ExclamationCircleIcon v-else-if="toast.type === 'error'" />
        <ExclamationTriangleIcon v-else-if="toast.type === 'warning'" />
        <InfoIcon v-else />
      </div>

      <!-- Text content -->
      <div class="error-toast__text">
        <h4 class="error-toast__title">{{ toast.title }}</h4>
        <p class="error-toast__message">{{ toast.message }}</p>
      </div>

      <!-- Dismiss button -->
      <button
        v-if="toast.dismissible"
        class="error-toast__dismiss"
        type="button"
        aria-label="Cerrar notificación"
        @click="handleDismiss"
      >
        <XMarkIcon />
      </button>
    </div>

    <!-- Action buttons -->
    <div v-if="toast.actions && toast.actions.length > 0" class="error-toast__actions">
      <BaseButton
        v-for="action in toast.actions"
        :key="action.type"
        :variant="action.type === 'retry' ? 'primary' : 'outline'"
        size="small"
        @click="handleAction(action)"
      >
        {{ action.label }}
      </BaseButton>
    </div>

    <!-- Auto-dismiss progress bar -->
    <div 
      v-if="toast.duration > 0" 
      class="error-toast__progress"
      :style="{ animationDuration: `${toast.duration}ms` }"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import BaseButton from '@/shared/ui/BaseButton/BaseButton.vue'
import InfoIcon from '@/shared/icons/InfoIcon.vue'
import type { ErrorToast, ErrorRecoveryAction } from '@/shared/types/error.types'

interface Props {
  toast: ErrorToast
}

const props = defineProps<Props>()

const emit = defineEmits<{
  dismiss: [toastId: string]
  action: [action: ErrorRecoveryAction]
}>()

let dismissTimer: number | null = null

// Methods with explicit return types
const handleDismiss = (): void => {
  emit('dismiss', props.toast.id)
}

const handleAction = (action: ErrorRecoveryAction): void => {
  emit('action', action)
  // Optionally dismiss after action
  if (action.type !== 'contact_support') {
    handleDismiss()
  }
}

const startDismissTimer = (): void => {
  if (props.toast.duration > 0) {
    dismissTimer = window.setTimeout(() => {
      handleDismiss()
    }, props.toast.duration)
  }
}

const clearDismissTimer = (): void => {
  if (dismissTimer) {
    clearTimeout(dismissTimer)
    dismissTimer = null
  }
}

// Lifecycle
onMounted(() => {
  startDismissTimer()
})

onBeforeUnmount(() => {
  clearDismissTimer()
})
</script>

<style lang="scss" scoped>
.error-toast {
  background: var(--color-background-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-md);
  position: relative;
  border: 1px solid var(--color-border-secondary);
  max-width: 400px;
  min-width: 300px;
  
  // Animation
  transform: translateX(100%);
  animation: slide-in 0.3s ease-out forwards;

  @media (width <= 640px) {
    min-width: auto;
    max-width: none;
  }

  // Toast type variants

  &--success {
    border-left: 4px solid var(--color-success-500);
    
    .error-toast__icon {
      color: var(--color-success-600);
    }
  }

  &--error {
    border-left: 4px solid var(--color-error-500);
    
    .error-toast__icon {
      color: var(--color-error-600);
    }
  }

  &--warning {
    border-left: 4px solid var(--color-warning-500);
    
    .error-toast__icon {
      color: var(--color-warning-600);
    }
  }

  &--info {
    border-left: 4px solid var(--color-primary-500);
    
    .error-toast__icon {
      color: var(--color-primary-600);
    }
  }

  &__content {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  &__icon {
    flex-shrink: 0;
    margin-top: 2px; // Align with text
    
    svg {
      width: 20px;
      height: 20px;
    }
  }

  &__text {
    flex-grow: 1;
    min-width: 0; // Allow text to wrap
  }

  &__title {
    // @include design-token('typography', 'body-md');
    // @include design-token('color', 'text-primary');

    font-weight: 600;
    margin: 0 0 var(--spacing-xs) 0;
  }

  &__message {
    // @include design-token('typography', 'body-sm');
    // @include design-token('color', 'text-secondary');

    margin: 0;
    line-height: 1.5;
  }

  &__dismiss {
    flex-shrink: 0;
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--spacing-xs);
    margin: -#{var(--spacing-xs)};
    border-radius: var(--border-radius-sm);
    color: var(--color-text-tertiary);
    transition: all 0.2s ease;

    &:hover {
      background: var(--color-background-hover);
      color: var(--color-text-secondary);
    }

    &:focus {
      outline: 2px solid var(--color-primary-500);
      outline-offset: 2px;
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }

  &__actions {
    margin-top: var(--spacing-md);
    display: flex;
    gap: var(--spacing-sm);
    justify-content: flex-end;

    @media (width <= 640px) {
      flex-direction: column;
    }
  }

  &__progress {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--color-primary-500);
    border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
    opacity: 30%;
    animation: progress-bar linear forwards;
    transform-origin: left;
  }
}

// Animations
@keyframes slide-in {

  from {
    transform: translateX(100%);
    opacity: 0%;
  }

  to {
    transform: translateX(0);
    opacity: 100%;
  }
}

@keyframes progress-bar {

  from {
    transform: scaleX(1);
  }

  to {
    transform: scaleX(0);
  }
}

// Hover pause animation

.error-toast:hover .error-toast__progress {
  animation-play-state: paused;
}

// Focus styles for accessibility

.error-toast:focus-within {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
</style>