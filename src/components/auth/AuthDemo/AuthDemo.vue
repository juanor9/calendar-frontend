<template>
  <div class="auth-demo">
    <div class="auth-demo__container">
      <h2 class="auth-demo__title">Demostración de Autenticación Auth0</h2>

      <!-- Auth Status -->
      <div class="auth-demo__section">
        <h3>Estado de Autenticación</h3>
        <div class="auth-demo__status">
          <div class="auth-demo__status-item">
            <strong>Autenticado:</strong>
            <span :class="isAuthenticated ? 'text-success' : 'text-error'">
              {{ isAuthenticated ? 'Sí' : 'No' }}
            </span>
          </div>
          <div class="auth-demo__status-item">
            <strong>Cargando:</strong>
            <span :class="isLoading ? 'text-warning' : 'text-success'">
              {{ isLoading ? 'Sí' : 'No' }}
            </span>
          </div>
          <div v-if="error" class="auth-demo__status-item">
            <strong>Error:</strong>
            <span class="text-error">{{ error?.message || error || 'Error desconocido' }}</span>
          </div>
        </div>
      </div>

      <!-- User Info -->
      <div v-if="isAuthenticated && user" class="auth-demo__section">
        <h3>Información del Usuario</h3>
        <div class="auth-demo__user-info">
          <div class="auth-demo__user-avatar">
            <img
              v-if="getUserAvatar()"
              :src="getUserAvatar() || ''"
              :alt="getUserDisplayName()"
              class="auth-demo__avatar-image"
            />
            <div v-else class="auth-demo__avatar-fallback">
              {{ getUserDisplayName().charAt(0).toUpperCase() }}
            </div>
          </div>
          <div class="auth-demo__user-details">
            <div><strong>Nombre:</strong> {{ getUserDisplayName() }}</div>
            <div v-if="user.email"><strong>Email:</strong> {{ user.email }}</div>
            <div v-if="user.sub"><strong>ID:</strong> {{ user.sub }}</div>
            <div v-if="getUserRoles().length > 0">
              <strong>Roles:</strong> {{ getUserRoles().join(', ') }}
            </div>
            <div v-if="getUserPermissions().length > 0">
              <strong>Permisos:</strong> {{ getUserPermissions().join(', ') }}
            </div>
            <div><strong>Admin:</strong> {{ isAdmin() ? 'Sí' : 'No' }}</div>
            <div><strong>Premium:</strong> {{ isPremium() ? 'Sí' : 'No' }}</div>
          </div>
        </div>
      </div>

      <!-- Auth Actions -->
      <div class="auth-demo__section">
        <h3>Acciones de Autenticación</h3>
        <div class="auth-demo__actions">
          <LoginButton
            v-if="!isAuthenticated"
            variant="primary"
            text="Iniciar Sesión Demo"
            :show-error="false"
            @login-start="onLoginStart"
            @login-success="onLoginSuccess"
            @login-error="onLoginError"
          />

          <LogoutButton
            v-if="isAuthenticated"
            variant="secondary"
            text="Cerrar Sesión Demo"
            :show-confirmation="true"
            :show-error="false"
            @logout-start="onLogoutStart"
            @logout-success="onLogoutSuccess"
            @logout-error="onLogoutError"
          />

          <BaseButton
            v-if="isAuthenticated"
            variant="outline"
            :loading="refreshingToken"
            @click="refreshToken"
          >
            Actualizar Token
          </BaseButton>

          <BaseButton variant="ghost" @click="clearErrors"> Limpiar Errores </BaseButton>
        </div>
      </div>

      <!-- Permission Tests -->
      <div v-if="isAuthenticated" class="auth-demo__section">
        <h3>Pruebas de Permisos</h3>
        <div class="auth-demo__permissions">
          <div class="auth-demo__permission-test">
            <strong>read:calendar:</strong>
            <span :class="hasPermission('read:calendar') ? 'text-success' : 'text-error'">
              {{ hasPermission('read:calendar') ? 'Permitido' : 'Denegado' }}
            </span>
          </div>
          <div class="auth-demo__permission-test">
            <strong>write:calendar:</strong>
            <span :class="hasPermission('write:calendar') ? 'text-success' : 'text-error'">
              {{ hasPermission('write:calendar') ? 'Permitido' : 'Denegado' }}
            </span>
          </div>
          <div class="auth-demo__permission-test">
            <strong>admin:users:</strong>
            <span :class="hasPermission('admin:users') ? 'text-success' : 'text-error'">
              {{ hasPermission('admin:users') ? 'Permitido' : 'Denegado' }}
            </span>
          </div>
          <div class="auth-demo__permission-test">
            <strong>admin:system:</strong>
            <span :class="hasPermission('admin:system') ? 'text-success' : 'text-error'">
              {{ hasPermission('admin:system') ? 'Permitido' : 'Denegado' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Role Tests -->
      <div v-if="isAuthenticated" class="auth-demo__section">
        <h3>Pruebas de Roles</h3>
        <div class="auth-demo__roles">
          <div class="auth-demo__role-test">
            <strong>user:</strong>
            <span :class="hasRole('user') ? 'text-success' : 'text-error'">
              {{ hasRole('user') ? 'Sí' : 'No' }}
            </span>
          </div>
          <div class="auth-demo__role-test">
            <strong>premium:</strong>
            <span :class="hasRole('premium') ? 'text-success' : 'text-error'">
              {{ hasRole('premium') ? 'Sí' : 'No' }}
            </span>
          </div>
          <div class="auth-demo__role-test">
            <strong>admin:</strong>
            <span :class="hasRole('admin') ? 'text-success' : 'text-error'">
              {{ hasRole('admin') ? 'Sí' : 'No' }}
            </span>
          </div>
          <div class="auth-demo__role-test">
            <strong>super_admin:</strong>
            <span :class="hasRole('super_admin') ? 'text-success' : 'text-error'">
              {{ hasRole('super_admin') ? 'Sí' : 'No' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Raw User Data -->
      <div v-if="isAuthenticated && user" class="auth-demo__section">
        <details class="auth-demo__details">
          <summary>Datos Completos del Usuario (JSON)</summary>
          <pre class="auth-demo__json">{{ JSON.stringify(user, null, 2) }}</pre>
        </details>
      </div>

      <!-- Auth Store State -->
      <div class="auth-demo__section">
        <details class="auth-demo__details">
          <summary>Estado del Store de Auth</summary>
          <pre class="auth-demo__json">{{ JSON.stringify(authStore.getAuthState(), null, 2) }}</pre>
        </details>
      </div>

      <!-- Apollo Integration Test -->
      <div v-if="isAuthenticated" class="auth-demo__section">
        <h3>Prueba de Integración Apollo</h3>
        <div class="auth-demo__apollo">
          <BaseButton variant="outline" :loading="testingGraphQL" @click="testGraphQLQuery">
            Probar Query GraphQL
          </BaseButton>

          <div v-if="graphQLResult" class="auth-demo__graphql-result">
            <strong>Resultado:</strong>
            <pre>{{ JSON.stringify(graphQLResult, null, 2) }}</pre>
          </div>

          <div v-if="graphQLError" class="auth-demo__graphql-error">
            <strong>Error:</strong>
            <pre>{{ graphQLError }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useAuth } from '@/auth/auth-composable'
  import { useAuthStore } from '@/store/auth'
  import LoginButton from './LoginButton.vue'
  import LogoutButton from './LogoutButton.vue'
  import BaseButton from '@/ui/BaseButton/BaseButton.vue'

  // Auth
  const {
    isAuthenticated,
    isLoading,
    user,
    error,
    hasPermission,
    hasRole,
    getUserDisplayName,
    getUserAvatar,
    getUserRoles,
    getUserPermissions,
    isAdmin,
    isPremium,
    getAccessToken,
  } = useAuth()

  const authStore = useAuthStore()

  // Local state
  const refreshingToken = ref(false)
  const testingGraphQL = ref(false)
  const graphQLResult = ref(null)
  const graphQLError = ref('')

  // Methods
  const onLoginStart = () => {
    console.log('Login started')
  }

  const onLoginSuccess = () => {
    console.log('Login successful')
  }

  const onLoginError = (error: Error) => {
    console.error('Login error:', error)
  }

  const onLogoutStart = () => {
    console.log('Logout started')
  }

  const onLogoutSuccess = () => {
    console.log('Logout successful')
  }

  const onLogoutError = (error: Error) => {
    console.error('Logout error:', error)
  }

  const refreshToken = async () => {
    refreshingToken.value = true
    try {
      const token = await getAccessToken()
      console.log('Token refreshed:', token)
    } catch (err) {
      console.error('Token refresh error:', err)
    } finally {
      refreshingToken.value = false
    }
  }

  const clearErrors = () => {
    authStore.clearError()
    graphQLError.value = ''
  }

  const testGraphQLQuery = async () => {
    testingGraphQL.value = true
    graphQLResult.value = null
    graphQLError.value = ''

    try {
      // This is a mock test - replace with actual GraphQL query when available
      const token = await getAccessToken()

      // Simulate GraphQL request
      const response = await fetch(import.meta.env.VITE_GRAPHQL_ENDPOINT || '/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
          query TestAuth {
            me {
              id
              email
              name
            }
          }
        `,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        graphQLResult.value = data
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (err) {
      graphQLError.value = err instanceof Error ? err.message : 'Unknown error'
      console.error('GraphQL test error:', err)
    } finally {
      testingGraphQL.value = false
    }
  }
</script>

<style lang="scss" src="./AuthDemo.scss" scoped />
