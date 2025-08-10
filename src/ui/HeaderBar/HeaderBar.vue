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
          v-if="isPremium()"
          to="/premium"
          class="header-bar__nav-link"
          active-class="header-bar__nav-link--active"
        >
          Premium
        </RouterLink>
        <RouterLink
          v-if="isAdmin()"
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
  </header>
</template>

<script setup lang="ts">
  import { useAuth } from '@/auth/auth-composable'
  import UserProfile from '@/components/auth/UserProfile/UserProfile.vue'
  import LoginButton from '@/components/auth/LoginButton/LoginButton.vue'

  // Auth
  const { isAuthenticated, isPremium, isAdmin } = useAuth()
</script>

<style scoped src="./HeaderBar.scss" />
