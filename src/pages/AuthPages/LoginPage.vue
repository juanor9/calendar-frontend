<template>
  <div class="login-page">
    <div class="login-page__container">
      <!-- Logo and branding -->
      <div class="login-page__header">
        <img
          src="@/assets/images/vana-logo.png"
          alt="Vana Calendar"
          class="login-page__logo"
        />
        <h1 class="login-page__title">Vana Calendar</h1>
        <p class="login-page__subtitle">
          Tu calendario inteligente para una planificación perfecta
        </p>
      </div>
      
      <!-- Login form -->
      <div class="login-page__form">
        <!-- Error/Info messages -->
        <div
          v-if="loginMessage"
          :class="[
            'login-page__message',
            `login-page__message--${loginMessage.type}`
          ]"
          role="alert"
          aria-live="polite"
        >
          <component :is="messageIcon" class="login-page__message-icon" />
          {{ loginMessage.text }}
        </div>
        
        <!-- Login button -->
        <LoginButton
          variant="primary"
          size="large"
          text="Iniciar Sesión con Auth0"
          :redirect-uri="redirectUri"
          :app-state="appState"
          :show-error="false"
          class="login-page__login-button"
          @login-start="onLoginStart"
          @login-success="onLoginSuccess"
          @login-error="onLoginError"
        />
        
        <!-- Features preview -->
        <div class="login-page__features">
          <h3 class="login-page__features-title">
            ¿Por qué elegir Vana Calendar?
          </h3>
          <ul class="login-page__features-list">
            <li class="login-page__feature">
              <CalendarDaysIcon class="login-page__feature-icon" />
              <span>Planificación inteligente automática</span>
            </li>
            <li class="login-page__feature">
              <ClockIcon class="login-page__feature-icon" />
              <span>Optimización de tiempo con IA</span>
            </li>
            <li class="login-page__feature">
              <BellIcon class="login-page__feature-icon" />
              <span>Recordatorios personalizados</span>
            </li>
            <li class="login-page__feature">
              <DevicePhoneMobileIcon class="login-page__feature-icon" />
              <span>Sincronización multi-dispositivo</span>
            </li>
          </ul>
        </div>
        
        <!-- Privacy and terms -->
        <div class="login-page__legal">
          <p class="login-page__legal-text">
            Al continuar, aceptas nuestros
            <a href="/terms" target="_blank" class="login-page__legal-link">
              Términos de Servicio
            </a>
            y
            <a href="/privacy" target="_blank" class="login-page__legal-link">
              Política de Privacidad
            </a>
          </p>
        </div>
      </div>
    </div>
    
    <!-- Background decoration -->
    <div class="login-page__background">
      <div class="login-page__background-shape login-page__background-shape--1" />
      <div class="login-page__background-shape login-page__background-shape--2" />
      <div class="login-page__background-shape login-page__background-shape--3" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { 
  CalendarDaysIcon,
  ClockIcon,
  BellIcon,
  DevicePhoneMobileIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'
import LoginButton from '@/components/auth/LoginButton.vue'
import { useAuth } from '@/auth/auth-composable'

// Router
const route = useRoute()

// Auth
const { isAuthenticated } = useAuth()

// Local state
interface Message {
  type: 'info' | 'warning' | 'success' | 'error'
  text: string
}

const loginMessage = ref<Message | null>(null)

// Computed
const redirectUri = computed(() => {
  const baseUrl = window.location.origin
  return `${baseUrl}/auth/callback`
})

const appState = computed(() => {
  const redirect = route.query.redirect as string
  const targetUrl = redirect || '/'
  
  return {
    targetUrl
  }
})

const messageIcon = computed(() => {
  if (!loginMessage.value) return null
  
  switch (loginMessage.value.type) {
    case 'info':
      return InformationCircleIcon
    case 'warning':
      return ExclamationTriangleIcon
    case 'success':
      return CheckCircleIcon
    case 'error':
      return ExclamationTriangleIcon
    default:
      return InformationCircleIcon
  }
})

// Methods
const getMessageFromQuery = () => {
  const reason = route.query.reason as string
  
  const messageMap: Record<string, Message> = {
    'authentication_required': {
      type: 'info',
      text: 'Debes iniciar sesión para acceder a esa página.'
    },
    'session_expired': {
      type: 'warning',
      text: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.'
    },
    'unauthorized': {
      type: 'warning',
      text: 'No tienes permisos para acceder a esa página.'
    },
    'token_expired': {
      type: 'warning',
      text: 'Tu token de acceso ha expirado. Por favor inicia sesión nuevamente.'
    },
    'auth_error': {
      type: 'error',
      text: 'Ocurrió un error durante la autenticación. Por favor intenta nuevamente.'
    },
    'callback_error': {
      type: 'error',
      text: 'Error en el proceso de autenticación. Por favor intenta iniciar sesión nuevamente.'
    },
    'logout_success': {
      type: 'success',
      text: 'Has cerrado sesión correctamente.'
    }
  }
  
  if (reason && messageMap[reason]) {
    loginMessage.value = messageMap[reason]
  }
}

const onLoginStart = () => {
  loginMessage.value = {
    type: 'info',
    text: 'Redirigiendo a Auth0...'
  }
}

const onLoginSuccess = () => {
  loginMessage.value = {
    type: 'success',
    text: 'Inicio de sesión exitoso. Redirigiendo...'
  }
}

const onLoginError = (error: Error) => {
  loginMessage.value = {
    type: 'error',
    text: `Error al iniciar sesión: ${error.message}`
  }
}

// Lifecycle
onMounted(() => {
  // Get message from query parameters
  getMessageFromQuery()
  
  // If user is already authenticated, show info
  if (isAuthenticated.value) {
    loginMessage.value = {
      type: 'info',
      text: 'Ya has iniciado sesión. Serás redirigido a tu calendario.'
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/auth/auth-tokens';

.login-page {
  // Full viewport hero layout con gradiente Vana
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $auth-spacing-lg;
  background: linear-gradient(135deg, $auth-page-bg-start 0%, $auth-page-bg-end 100%);
  overflow: hidden;
  
  // Efectos de glassmorphism y backdrop

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 30% 20%, rgba($brandPrimary, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, rgba($accentHappy, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }
  
  &__container {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 28rem;
    background: white;
    border-radius: var(--radius-2xl);
    box-shadow: var(--shadow-2xl);
    padding: 2.5rem;
  }
  
  &__header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  &__logo {
    width: 4rem;
    height: 4rem;
    margin: 0 auto 1rem;
    object-fit: contain;
  }
  
  &__title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin: 0 0 0.5rem;
    line-height: 1.25;
  }
  
  &__subtitle {
    font-size: 1rem;
    color: var(--color-text-secondary);
    margin: 0;
    line-height: 1.5;
  }
  
  &__form {
    // Removed unsupported space-y property
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  &__message {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: var(--radius-lg);
    font-size: 0.875rem;
    line-height: 1.5;
    margin-bottom: 1.5rem;
    
    &--info {
      background-color: var(--color-blue-50);
      border: 1px solid var(--color-blue-200);
      color: var(--color-blue-700);
    }
    
    &--warning {
      background-color: var(--color-warning-50);
      border: 1px solid var(--color-warning-200);
      color: var(--color-warning-700);
    }
    
    &--success {
      background-color: var(--color-success-50);
      border: 1px solid var(--color-success-200);
      color: var(--color-success-700);
    }
    
    &--error {
      background-color: var(--color-error-50);
      border: 1px solid var(--color-error-200);
      color: var(--color-error-700);
    }
  }
  
  &__message-icon {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
  
  &__login-button {
    width: 100%;
    margin-bottom: 2rem;
  }
  
  &__features {
    margin-bottom: 2rem;
  }
  
  &__features-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0 0 1rem;
    line-height: 1.25;
    text-align: center;
  }
  
  &__features-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  &__feature {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
    margin-bottom: 0.75rem;
  }
  
  &__feature-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--color-primary-500);
    flex-shrink: 0;
  }
  
  &__legal {
    text-align: center;
  }
  
  &__legal-text {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    margin: 0;
    line-height: 1.5;
  }
  
  &__legal-link {
    color: var(--color-primary-600);
    text-decoration: underline;
    
    &:hover {
      color: var(--color-primary-700);
    }
  }
  
  &__background {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }
  
  &__background-shape {
    position: absolute;
    border-radius: 50%;
    background: rgba(var(--color-primary-500-rgb), 0.1);
    animation: float 6s ease-in-out infinite;
    
    &--1 {
      width: 20rem;
      height: 20rem;
      top: -10rem;
      right: -10rem;
      animation-delay: 0s;
    }
    
    &--2 {
      width: 16rem;
      height: 16rem;
      bottom: -8rem;
      left: -8rem;
      animation-delay: -2s;
    }
    
    &--3 {
      width: 12rem;
      height: 12rem;
      top: 50%;
      left: -6rem;
      animation-delay: -4s;
    }
  }
}

@keyframes float {

  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }
}

// Dark mode support
@media (prefers-color-scheme: dark) {

  .login-page {
    background: linear-gradient(135deg, var(--color-gray-900) 0%, var(--color-gray-800) 100%);
    
    &__container {
      background: var(--color-gray-900);
      border: 1px solid var(--color-gray-700);
    }
    
    &__message {

      &--info {
        background-color: var(--color-blue-900);
        border-color: var(--color-blue-700);
        color: var(--color-blue-200);
      }
      
      &--warning {
        background-color: var(--color-warning-900);
        border-color: var(--color-warning-700);
        color: var(--color-warning-200);
      }
      
      &--success {
        background-color: var(--color-success-900);
        border-color: var(--color-success-700);
        color: var(--color-success-200);
      }
      
      &--error {
        background-color: var(--color-error-900);
        border-color: var(--color-error-700);
        color: var(--color-error-200);
      }
    }
  }
}

// Responsive design
@media (width <= 640px) {

  .login-page {
    padding: 0.5rem;
    
    &__container {
      padding: 2rem 1.5rem;
    }
    
    &__title {
      font-size: 1.75rem;
    }
    
    &__features-title {
      font-size: 1rem;
    }
  }
}
</style>