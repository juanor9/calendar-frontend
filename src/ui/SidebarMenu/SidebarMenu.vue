<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'

  // Props
  const props = withDefaults(
    defineProps<{
      collapsed?: boolean
      position?: 'left' | 'right'
      width?: 'narrow' | 'medium' | 'wide'
      variant?: 'default' | 'minimal' | 'bordered'
      showToggle?: boolean
      persistent?: boolean
      overlay?: boolean
    }>(),
    {
      collapsed: false,
      position: 'left',
      width: 'medium',
      variant: 'default',
      showToggle: true,
      persistent: true,
      overlay: false,
    }
  )

  // Emits
  const emit = defineEmits<{
    'update:collapsed': [value: boolean]
    toggle: [collapsed: boolean]
    'item-click': [item: MenuItem, event: MouseEvent]
  }>()

  // Types
  export interface MenuItem {
    id: string
    label: string
    icon?: string
    route?: string
    href?: string
    badge?: string | number
    children?: MenuItem[]
    disabled?: boolean
    divider?: boolean
    action?: () => void
  }

  // State
  const route = useRoute()
  const expandedItems = ref<Set<string>>(new Set())

  // Computed
  const isCollapsed = computed({
    get: () => props.collapsed,
    set: value => emit('update:collapsed', value),
  })

  const sidebarClasses = computed(() => [
    'sidebar-menu',
    `sidebar-menu--${props.position}`,
    `sidebar-menu--${props.width}`,
    `sidebar-menu--${props.variant}`,
    {
      'sidebar-menu--collapsed': isCollapsed.value,
      'sidebar-menu--persistent': props.persistent,
      'sidebar-menu--overlay': props.overlay,
    },
  ])

  // Methods
  const toggleSidebar = (): void => {
    const newValue = !isCollapsed.value
    isCollapsed.value = newValue
    emit('toggle', newValue)
  }

  const toggleItemExpanded = (itemId: string): void => {
    if (expandedItems.value.has(itemId)) {
      expandedItems.value.delete(itemId)
    } else {
      expandedItems.value.add(itemId)
    }
  }

  const _handleItemClick = (item: MenuItem, event: MouseEvent): void => {
    if (item.disabled) return

    emit('item-click', item, event)

    if (item.children && item.children.length > 0) {
      toggleItemExpanded(item.id)
    } else if (item.action) {
      item.action()
    }
  }

  const _isItemActive = (item: MenuItem): boolean => {
    if (item.route) {
      return route.path === item.route || route.path.startsWith(item.route + '/')
    }
    return false
  }

  const _isItemExpanded = (itemId: string): boolean => {
    return expandedItems.value.has(itemId)
  }
</script>

<template>
  <aside :class="sidebarClasses">
    <!-- Sidebar Header -->
    <div class="sidebar-menu__header">
      <slot name="header">
        <div class="sidebar-menu__brand">
          <img src="@/assets/images/vana-logo.png" alt="Vana Calendar" class="sidebar-menu__logo" />
          <span v-if="!isCollapsed" class="sidebar-menu__brand-text"> Vana Calendar </span>
        </div>
      </slot>

      <!-- Toggle Button -->
      <button
        v-if="props.showToggle"
        type="button"
        class="sidebar-menu__toggle"
        :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        @click="toggleSidebar"
      >
        <span
          :class="[
            'sidebar-menu__toggle-icon',
            { 'sidebar-menu__toggle-icon--collapsed': isCollapsed },
          ]"
        >
          <i class="fas fa-chevron-left"></i>
        </span>
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="sidebar-menu__nav">
      <slot name="menu" :collapsed="isCollapsed">
        <!-- Default menu items would go here -->
        <div class="sidebar-menu__section">
          <h3 v-if="!isCollapsed" class="sidebar-menu__section-title">Navigation</h3>

          <ul class="sidebar-menu__list">
            <li class="sidebar-menu__item">
              <RouterLink
                to="/dashboard"
                class="sidebar-menu__link"
                active-class="sidebar-menu__link--active"
              >
                <i class="fas fa-tachometer-alt sidebar-menu__icon"></i>
                <span v-if="!isCollapsed" class="sidebar-menu__label">Dashboard</span>
              </RouterLink>
            </li>

            <li class="sidebar-menu__item">
              <RouterLink
                to="/calendar"
                class="sidebar-menu__link"
                active-class="sidebar-menu__link--active"
              >
                <i class="fas fa-calendar sidebar-menu__icon"></i>
                <span v-if="!isCollapsed" class="sidebar-menu__label">Calendar</span>
              </RouterLink>
            </li>

            <li class="sidebar-menu__item">
              <RouterLink
                to="/tasks"
                class="sidebar-menu__link"
                active-class="sidebar-menu__link--active"
              >
                <i class="fas fa-tasks sidebar-menu__icon"></i>
                <span v-if="!isCollapsed" class="sidebar-menu__label">Tasks</span>
                <span v-if="!isCollapsed" class="sidebar-menu__badge">3</span>
              </RouterLink>
            </li>
          </ul>
        </div>
      </slot>
    </nav>

    <!-- Sidebar Footer -->
    <div class="sidebar-menu__footer">
      <slot name="footer" :collapsed="isCollapsed">
        <div class="sidebar-menu__user">
          <div class="sidebar-menu__user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div v-if="!isCollapsed" class="sidebar-menu__user-info">
            <span class="sidebar-menu__user-name">John Doe</span>
            <span class="sidebar-menu__user-email">john@example.com</span>
          </div>
        </div>
      </slot>
    </div>

    <!-- Overlay for mobile -->
    <div
      v-if="props.overlay && !isCollapsed"
      class="sidebar-menu__overlay"
      @click="toggleSidebar"
    ></div>
  </aside>
</template>

<style lang="scss" src="./SidebarMenu.scss"></style>
