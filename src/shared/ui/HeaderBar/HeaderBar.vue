<template>
  <header class="header-bar">
    <nav class="header-bar__nav">
      <!-- Logo and Brand -->
      <div class="header-bar__brand">
        <img alt="Vana Calendar" class="header-bar__logo" src="@/assets/images/vana-logo.png" />
        <RouterLink to="/" class="header-bar__brand-text"> Vana Calendar </RouterLink>
      </div>

      <!-- Navigation Links (authenticated users) -->
      <div v-if="isAuthenticated" class="header-bar__nav-links">
        <RouterLink
          to="/calendar"
          class="header-bar__nav-link"
          active-class="header-bar__nav-link--active"
        >
          Calendario
        </RouterLink>
        <RouterLink
          to="/tasks"
          class="header-bar__nav-link"
          active-class="header-bar__nav-link--active"
        >
          Tareas
        </RouterLink>
        <RouterLink
          v-if="isPremium"
          to="/premium"
          class="header-bar__nav-link"
          active-class="header-bar__nav-link--active"
        >
          Premium
        </RouterLink>
        <RouterLink
          v-if="isAdmin"
          to="/admin"
          class="header-bar__nav-link"
          active-class="header-bar__nav-link--active"
        >
          Admin
        </RouterLink>
      </div>

      <!-- Public navigation (non-authenticated) -->
      <div v-else class="header-bar__nav-links">
        <RouterLink to="/" class="header-bar__nav-link" active-class="header-bar__nav-link--active">
          Inicio
        </RouterLink>
        <RouterLink
          to="/about"
          class="header-bar__nav-link"
          active-class="header-bar__nav-link--active"
        >
          Acerca de
        </RouterLink>
      </div>

      <!-- Mobile Navigation Toggle -->
      <div class="header-bar__mobile-toggle">
        <BaseButton
          :icon-only="true"
          :left-icon="mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'"
          variant="ghost"
          size="small"
          :aria-label="mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'"
          @click="toggleMobileMenu"
        />
      </div>

      <!-- User section -->
      <div class="header-bar__user">
        <!-- Authenticated user -->
        <UserProfile
          v-if="isAuthenticated"
          :show-name="true"
          :show-status="true"
          size="medium"
          class="header-bar__user-profile"
        />

        <!-- Login button for non-authenticated -->
        <LoginButton
          v-else
          variant="outline"
          size="small"
          text="Iniciar Sesión"
          class="header-bar__login-button"
        />
      </div>
    </nav>

    <!-- Mobile Menu Overlay -->
    <div
      :class="['header-bar__mobile-menu', { 'header-bar__mobile-menu--open': mobileMenuOpen }]"
      @click="closeMobileMenu"
    >
      <BaseButton
        :icon-only="true"
        left-icon="fas fa-times"
        variant="ghost"
        size="medium"
        aria-label="Cerrar menú móvil"
        class="header-bar__mobile-menu-close"
        @click="closeMobileMenu"
      />

      <!-- Mobile Navigation Links -->
      <div v-if="isAuthenticated">
        <RouterLink
          to="/calendar"
          class="header-bar__nav-link"
          active-class="header-bar__nav-link--active"
          @click="closeMobileMenu"
        >
          Calendario
        </RouterLink>
        <RouterLink
          to="/tasks"
          class="header-bar__nav-link"
          active-class="header-bar__nav-link--active"
          @click="closeMobileMenu"
        >
          Tareas
        </RouterLink>
        <RouterLink
          v-if="isPremium"
          to="/premium"
          class="header-bar__nav-link"
          active-class="header-bar__nav-link--active"
          @click="closeMobileMenu"
        >
          Premium
        </RouterLink>
        <RouterLink
          v-if="isAdmin"
          to="/admin"
          class="header-bar__nav-link"
          active-class="header-bar__nav-link--active"
          @click="closeMobileMenu"
        >
          Admin
        </RouterLink>
      </div>

      <div v-else>
        <RouterLink
          to="/"
          class="header-bar__nav-link"
          active-class="header-bar__nav-link--active"
          @click="closeMobileMenu"
        >
          Inicio
        </RouterLink>
        <RouterLink
          to="/about"
          class="header-bar__nav-link"
          active-class="header-bar__nav-link--active"
          @click="closeMobileMenu"
        >
          Acerca de
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useAuth } from '@/features/authentication/composables/useAuth'
  import UserProfile from '@/features/authentication/components/UserProfile/UserProfile.vue'
  import LoginButton from '@/features/authentication/components/LoginButton/LoginButton.vue'
  import BaseButton from '@/shared/ui/BaseButton/BaseButton.vue'

  // Props (available for future use)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const props = withDefaults(
    defineProps<{
      sticky?: boolean
      showMobileMenu?: boolean
    }>(),
    {
      sticky: true,
      showMobileMenu: true,
    }
  )

  // Auth
  const { isAuthenticated, isPremium, isAdmin } = useAuth()

  // Mobile menu state
  const mobileMenuOpen = ref(false)

  // Methods
  const toggleMobileMenu = (): void => {
    mobileMenuOpen.value = !mobileMenuOpen.value

    // Prevent body scroll when menu is open
    if (mobileMenuOpen.value) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }

  const closeMobileMenu = (): void => {
    mobileMenuOpen.value = false
    document.body.style.overflow = ''
  }
</script>

<style scoped src="./HeaderBar.scss" />
