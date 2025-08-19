<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { BaseCard, HeaderBar } from '@/shared/ui'
import { UserProfile } from '@/features/authentication'
import { useAuth } from '@/features/authentication/composables/useAuth'
import { CalendarIcon, ClockIcon, UserIcon } from '@heroicons/vue/24/outline'

// Composables
const { isAuthenticated, user, isLoading } = useAuth()
const router = useRouter()

// Computed
const userDisplayName = computed(() => {
  if (!user.value) return 'Usuario'
  return user.value.name || user.value.email || 'Usuario'
})

// Quick actions for dashboard
const quickActions = [
  {
    id: 'calendar',
    title: 'Ver Calendario',
    description: 'Accede a tu calendario inteligente',
    icon: CalendarIcon,
    route: '/app/calendar',
    color: 'primary'
  },
  {
    id: 'profile',
    title: 'Mi Perfil',
    description: 'Gestiona tu información personal',
    icon: UserIcon,
    route: '/app/profile',
    color: 'secondary'
  },
  {
    id: 'settings',
    title: 'Configuración',
    description: 'Personaliza tu experiencia',
    icon: ClockIcon,
    route: '/app/settings',
    color: 'accent'
  }
]

// Methods
const navigateToRoute = (route: string) => {
  router.push(route)
}

// Lifecycle
onMounted(() => {
  // If user is not authenticated, redirect to landing
  if (!isAuthenticated.value && !isLoading.value) {
    router.push('/')
  }
})
</script>

<template>
  <div class="homepage">
    <!-- Header with user profile -->
    <HeaderBar class="homepage__header">
      <template #title>
        Dashboard
      </template>
      <template #actions>
        <UserProfile 
          :show-name="true"
          :show-email="false"
          :show-status="true"
          size="medium"
        />
      </template>
    </HeaderBar>

    <!-- Main content -->
    <main class="homepage__main">
      <!-- Welcome section -->
      <section class="homepage__welcome">
        <div class="homepage__welcome-content">
          <h1 class="homepage__welcome-title">
            ¡Hola, {{ userDisplayName }}! 👋
          </h1>
          <p class="homepage__welcome-subtitle">
            Bienvenido a tu calendario inteligente. Aquí puedes gestionar tu tiempo de manera eficiente.
          </p>
        </div>
      </section>

      <!-- Quick actions grid -->
      <section class="homepage__quick-actions">
        <h2 class="homepage__section-title">Acciones rápidas</h2>
        <div class="homepage__actions-grid">
          <BaseCard
            v-for="action in quickActions"
            :key="action.id"
            class="homepage__action-card"
            hoverable
            @click="navigateToRoute(action.route)"
          >
            <div class="homepage__action-content">
              <div class="homepage__action-icon">
                <component 
                  :is="action.icon" 
                  :class="`homepage__action-icon--${action.color}`"
                />
              </div>
              <div class="homepage__action-info">
                <h3 class="homepage__action-title">{{ action.title }}</h3>
                <p class="homepage__action-description">{{ action.description }}</p>
              </div>
            </div>
          </BaseCard>
        </div>
      </section>

      <!-- Recent activity placeholder -->
      <section class="homepage__recent-activity">
        <h2 class="homepage__section-title">Actividad reciente</h2>
        <BaseCard class="homepage__activity-card">
          <div class="homepage__activity-placeholder">
            <ClockIcon class="homepage__activity-icon" />
            <h3>Próximamente</h3>
            <p>Aquí verás tu actividad reciente y próximos eventos.</p>
          </div>
        </BaseCard>
      </section>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.homepage {
  min-height: 100vh;
  background-color: var(--color-surface);

  &__header {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: var(--color-background);
    border-bottom: 1px solid var(--color-border);
  }

  &__main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__welcome {
    text-align: center;
    padding: 2rem 0;

    &-content {
      max-width: 600px;
      margin: 0 auto;
    }

    &-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin-bottom: 0.5rem;

      @media (width <= 768px) {
        font-size: 2rem;
      }
    }

    &-subtitle {
      font-size: 1.125rem;
      color: var(--color-text-secondary);
      line-height: 1.6;
    }
  }

  &__section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 1rem;
  }

  &__actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  &__action-card {
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 12%);
    }
  }

  &__action-content {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
  }

  &__action-icon {
    width: 48px;
    height: 48px;
    padding: 12px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;

    &--primary {
      background-color: var(--color-primary-light);
      color: var(--color-primary);
    }

    &--secondary {
      background-color: var(--color-secondary-light);
      color: var(--color-secondary);
    }

    &--accent {
      background-color: var(--color-accent-light);
      color: var(--color-accent);
    }
  }

  &__action-info {
    flex: 1;
  }

  &__action-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 0.25rem;
  }

  &__action-description {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
  }

  &__activity-card {
    padding: 2rem;
  }

  &__activity-placeholder {
    text-align: center;
    color: var(--color-text-secondary);
  }

  &__activity-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 1rem;
    opacity: 60%;
  }
}
</style>
