<template>
  <div class="logout-page">
    <div class="logout-page__container">
      <!-- Logo -->
      <div class="logout-page__header">
        <img src="@/assets/images/vana-logo.png" alt="Vana Calendar" class="logout-page__logo" />
        <h1 class="logout-page__title">Hasta pronto</h1>
      </div>

      <!-- Content -->
      <div class="logout-page__content">
        <div class="logout-page__success-icon">
          <CheckCircleIcon />
        </div>

        <p class="logout-page__message">Has cerrado sesión exitosamente de Vana Calendar.</p>

        <p class="logout-page__submessage">
          Gracias por usar nuestro calendario inteligente. Esperamos verte pronto de vuelta.
        </p>

        <!-- Actions -->
        <div class="logout-page__actions">
          <BaseButton
            variant="primary"
            size="large"
            class="logout-page__login-again"
            @click="goToLogin"
          >
            Iniciar Sesión Nuevamente
          </BaseButton>

          <BaseButton
            variant="outline"
            size="medium"
            class="logout-page__go-home"
            @click="goToHome"
          >
            Ir al Inicio
          </BaseButton>
        </div>

        <!-- Quick stats or features -->
        <div class="logout-page__stats">
          <h3 class="logout-page__stats-title">Mientras estuviste ausente</h3>
          <div class="logout-page__stats-grid">
            <div class="logout-page__stat">
              <div class="logout-page__stat-icon">
                <CalendarDaysIcon />
              </div>
              <div class="logout-page__stat-content">
                <div class="logout-page__stat-number">{{ daysAway }}</div>
                <div class="logout-page__stat-label">días sin planificar</div>
              </div>
            </div>

            <div class="logout-page__stat">
              <div class="logout-page__stat-icon">
                <ClockIcon />
              </div>
              <div class="logout-page__stat-content">
                <div class="logout-page__stat-number">{{ hoursOptimized }}</div>
                <div class="logout-page__stat-label">horas optimizadas</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer links -->
        <div class="logout-page__footer">
          <a href="/about" class="logout-page__footer-link"> Sobre Vana Calendar </a>
          <a href="/help" class="logout-page__footer-link"> Centro de Ayuda </a>
          <a href="/contact" class="logout-page__footer-link"> Contacto </a>
        </div>
      </div>
    </div>

    <!-- Background decoration -->
    <div class="logout-page__background">
      <div class="logout-page__background-shape logout-page__background-shape--1" />
      <div class="logout-page__background-shape logout-page__background-shape--2" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { CheckCircleIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/vue/24/outline'
  import BaseButton from '@/shared/ui/BaseButton/BaseButton.vue'
  import { useAuthStore } from '@/features/authentication/stores/auth'

  // Router
  const router = useRouter()

  // Auth store
  const authStore = useAuthStore()

  // Computed
  const daysAway = computed(() => {
    // This could be calculated based on actual data
    // For now, showing a placeholder
    return Math.floor(Math.random() * 7) + 1
  })

  const hoursOptimized = computed(() => {
    // This could be calculated based on actual usage
    return Math.floor(Math.random() * 20) + 5
  })

  // Methods
  const goToLogin = () => {
    router.push({
      name: 'Login',
      query: {
        reason: 'logout_return',
      },
    })
  }

  const goToHome = () => {
    router.push('/')
  }

  // Clear any remaining auth state
  onMounted(() => {
    authStore.clearAuth()

    // Clear any stored auth data
    localStorage.removeItem('vana_auth_state')
    localStorage.removeItem('vana_user')
    localStorage.removeItem('vana_token')
    sessionStorage.clear()

    // Optional: Clear Auth0 session storage as well
    const auth0Keys = Object.keys(localStorage).filter(key => key.startsWith('@@auth0spajs@@'))
    auth0Keys.forEach(key => {
      localStorage.removeItem(key)
    })
  })
</script>

<style lang="scss" scoped>
  .logout-page {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: linear-gradient(135deg, var(--color-success-50) 0%, var(--color-success-100) 100%);
    overflow: hidden;

    &__container {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 32rem;
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
      width: 3.5rem;
      height: 3.5rem;
      margin: 0 auto 1rem;
      object-fit: contain;
    }

    &__title {
      font-size: 1.875rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0;
      line-height: 1.25;
    }

    &__content {
      text-align: center;
    }

    &__success-icon {
      width: 4rem;
      height: 4rem;
      margin: 0 auto 1.5rem;
      color: var(--color-success-500);

      svg {
        width: 100%;
        height: 100%;
      }
    }

    &__message {
      font-size: 1.125rem;
      font-weight: 500;
      color: var(--color-text-primary);
      margin: 0 0 0.75rem;
      line-height: 1.5;
    }

    &__submessage {
      font-size: 1rem;
      color: var(--color-text-secondary);
      margin: 0 0 2rem;
      line-height: 1.5;
    }

    &__actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      align-items: center;
      margin-bottom: 2rem;
    }

    &__login-again {
      width: 100%;
      max-width: 20rem;
    }

    &__go-home {
      width: auto;
    }

    &__stats {
      margin-bottom: 2rem;
    }

    &__stats-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 1rem;
      line-height: 1.25;
    }

    &__stats-grid {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
    }

    &__stat {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background-color: var(--color-gray-50);
      border-radius: var(--radius-lg);
      min-width: 0;
    }

    &__stat-icon {
      width: 2rem;
      height: 2rem;
      color: var(--color-primary-500);
      flex-shrink: 0;

      svg {
        width: 100%;
        height: 100%;
      }
    }

    &__stat-content {
      text-align: left;
    }

    &__stat-number {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-text-primary);
      line-height: 1.25;
    }

    &__stat-label {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      line-height: 1.25;
    }

    &__footer {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--color-gray-200);
    }

    &__footer-link {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      text-decoration: none;

      &:hover {
        color: var(--color-primary-600);
        text-decoration: underline;
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
      background: rgba(var(--color-success-500-rgb), 0.1);
      animation: float 8s ease-in-out infinite;

      &--1 {
        width: 18rem;
        height: 18rem;
        top: -9rem;
        right: -9rem;
        animation-delay: 0s;
      }

      &--2 {
        width: 14rem;
        height: 14rem;
        bottom: -7rem;
        left: -7rem;
        animation-delay: -4s;
      }
    }
  }

  @keyframes float {

    0%,
    100% {
      transform: translateY(0) rotate(0deg);
    }

    50% {
      transform: translateY(-15px) rotate(5deg);
    }
  }

  // Dark mode support
  @media (prefers-color-scheme: dark) {

    .logout-page {
      background: linear-gradient(135deg, var(--color-gray-900) 0%, var(--color-gray-800) 100%);

      &__container {
        background: var(--color-gray-900);
        border: 1px solid var(--color-gray-700);
      }

      &__stat {
        background-color: var(--color-gray-800);
      }

      &__footer {
        border-color: var(--color-gray-700);
      }
    }
  }

  // Responsive design
  @media (width <= 640px) {

    .logout-page {
      padding: 0.5rem;

      &__container {
        padding: 2rem 1.5rem;
      }

      &__title {
        font-size: 1.5rem;
      }

      &__actions {
        gap: 1rem;
      }

      &__stats-grid {
        flex-direction: column;
        gap: 1rem;
      }

      &__footer {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  }
</style>
