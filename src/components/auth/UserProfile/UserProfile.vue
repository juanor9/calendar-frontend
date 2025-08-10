<template>
  <div v-if="isAuthenticated" class="user-profile">
    <!-- User Avatar and Dropdown -->
    <div ref="dropdownRef" class="user-profile__wrapper">
      <button
        class="user-profile__trigger"
        :class="{ 'user-profile__trigger--active': isDropdownOpen }"
        :aria-expanded="isDropdownOpen"
        aria-haspopup="true"
        :aria-label="`Perfil de usuario: ${userDisplayName}`"
        @click="toggleDropdown"
      >
        <!-- Avatar -->
        <div class="user-profile__avatar">
          <img
            v-if="userAvatar"
            :src="userAvatar"
            :alt="`Avatar de ${userDisplayName}`"
            class="user-profile__avatar-image"
            loading="lazy"
            @error="onImageError"
          />
          <div v-else class="user-profile__avatar-fallback">
            {{ avatarInitials }}
          </div>

          <!-- Status indicator -->
          <div
            v-if="showStatus"
            :class="['user-profile__status', `user-profile__status--${userStatus}`]"
            :title="statusText"
          />
        </div>

        <!-- User info (optional) -->
        <div v-if="showName" class="user-profile__info">
          <div class="user-profile__name">{{ userDisplayName }}</div>
          <div v-if="showEmail && user?.email" class="user-profile__email">
            {{ user.email }}
          </div>
          <div v-if="showRole && primaryRole" class="user-profile__role">
            {{ formatRole(primaryRole) }}
          </div>
        </div>

        <!-- Dropdown icon -->
        <ChevronDownIcon
          class="user-profile__chevron"
          :class="{ 'user-profile__chevron--rotated': isDropdownOpen }"
        />
      </button>

      <!-- Dropdown Menu -->
      <Transition
        name="dropdown"
        enter-active-class="transition ease-out duration-200"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div v-if="isDropdownOpen" class="user-profile__dropdown" role="menu" @click.stop>
          <!-- User info in dropdown -->
          <div class="user-profile__dropdown-header">
            <div class="user-profile__dropdown-name">{{ userDisplayName }}</div>
            <div v-if="user?.email" class="user-profile__dropdown-email">
              {{ user.email }}
            </div>
          </div>

          <!-- Menu items -->
          <div class="user-profile__dropdown-menu">
            <router-link
              v-for="item in menuItems"
              :key="item.label"
              :to="item.to"
              class="user-profile__dropdown-item"
              role="menuitem"
              @click="closeDropdown"
            >
              <component :is="item.icon" class="user-profile__dropdown-icon" />
              {{ item.label }}
            </router-link>

            <!-- Custom menu items slot -->
            <slot name="menu-items" :close-dropdown="closeDropdown" />

            <!-- Divider -->
            <div class="user-profile__dropdown-divider" />

            <!-- Logout button -->
            <LogoutButton
              variant="ghost"
              size="small"
              text="Cerrar Sesión"
              :show-confirmation="true"
              :show-error="false"
              class="user-profile__logout"
              @logout-success="closeDropdown"
            />
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
  import {
    ChevronDownIcon,
    UserIcon,
    Cog6ToothIcon,
    BellIcon,
    QuestionMarkCircleIcon,
  } from '@heroicons/vue/24/outline'
  import { useAuth } from '@/auth/auth-composable'
  import LogoutButton from './LogoutButton.vue'

  // Props
  interface MenuItem {
    label: string
    to: string
    icon: typeof UserIcon
  }

  interface Props {
    showName?: boolean
    showEmail?: boolean
    showRole?: boolean
    showStatus?: boolean
    size?: 'small' | 'medium' | 'large'
    menuItems?: MenuItem[]
  }

  withDefaults(defineProps<Props>(), {
    showName: false,
    showEmail: false,
    showRole: false,
    showStatus: false,
    size: 'medium',
    menuItems: () => [
      { label: 'Mi Perfil', to: '/profile', icon: UserIcon },
      { label: 'Configuración', to: '/settings', icon: Cog6ToothIcon },
      { label: 'Notificaciones', to: '/notifications', icon: BellIcon },
      { label: 'Ayuda', to: '/help', icon: QuestionMarkCircleIcon },
    ],
  })

  // Auth composable
  const { isAuthenticated, user, getUserDisplayName, getUserAvatar, getUserRoles } = useAuth()

  // Local state
  const isDropdownOpen = ref(false)
  const dropdownRef = ref<HTMLElement>()
  const imageError = ref(false)

  // Computed
  const userDisplayName = computed(() => getUserDisplayName())
  const userAvatar = computed(() => (imageError.value ? null : getUserAvatar()))
  const userRoles = computed(() => getUserRoles())

  const avatarInitials = computed(() => {
    const name = userDisplayName.value
    if (!name) return 'U'

    const nameParts = name.split(' ')
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  })

  const primaryRole = computed(() => {
    const roles = userRoles.value
    if (roles.includes('super_admin')) return 'super_admin'
    if (roles.includes('admin')) return 'admin'
    if (roles.includes('premium')) return 'premium'
    return 'user'
  })

  const userStatus = computed(() => {
    // This could be enhanced to show actual user status
    return 'online'
  })

  const statusText = computed(() => {
    switch (userStatus.value) {
      case 'online':
        return 'En línea'
      case 'away':
        return 'Ausente'
      case 'busy':
        return 'Ocupado'
      case 'offline':
        return 'Sin conexión'
      default:
        return 'Estado desconocido'
    }
  })

  // Methods
  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value
  }

  const closeDropdown = () => {
    isDropdownOpen.value = false
  }

  const onImageError = () => {
    imageError.value = true
  }

  const formatRole = (role: string) => {
    const roleMap: Record<string, string> = {
      user: 'Usuario',
      premium: 'Premium',
      admin: 'Administrador',
      super_admin: 'Super Administrador',
    }
    return roleMap[role] || role
  }

  // Click outside handler
  const handleClickOutside = (event: Event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
      closeDropdown()
    }
  }

  // Lifecycle
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })
</script>

<style lang="scss" src="./UserProfile.scss" scoped />
