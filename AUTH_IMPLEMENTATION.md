# Implementación de Auth0 en Vana Calendar Frontend

## Resumen

Este documento describe la implementación completa de la integración Auth0 en el frontend de Vana Calendar, incluyendo autenticación, autorización y manejo de estados.

## Estructura Implementada

```
src/
├── auth/                          # Core auth functionality
│   ├── index.ts                   # Main exports
│   ├── types.ts                   # TypeScript interfaces
│   ├── auth0-config.ts           # Auth0 configuration
│   ├── auth0-plugin.ts           # Vue plugin for Auth0
│   ├── auth-composable.ts        # useAuth() composable
│   └── auth-guard.ts             # Router guards
├── components/auth/               # Auth UI components
│   ├── LoginButton.vue
│   ├── LogoutButton.vue
│   ├── UserProfile.vue
│   ├── AuthCallback.vue
│   └── AuthDemo.vue              # Development testing
├── pages/AuthPages/              # Auth pages
│   ├── LoginPage.vue
│   ├── LogoutPage.vue
│   └── AuthDemoPage.vue          # Development testing
├── store/
│   └── auth.ts                   # Pinia store for auth state
└── utils/
    ├── apollo-client.ts          # Apollo client with auth
    └── apollo-auth.ts            # Apollo auth links
```

## Funcionalidades Implementadas

### 1. Autenticación Core

- ✅ Login con Auth0 (Authorization Code + PKCE)
- ✅ Logout con cleanup completo
- ✅ Refresh automático de tokens
- ✅ Manejo de callbacks de Auth0
- ✅ Persistencia de sesión en localStorage

### 2. Autorización

- ✅ Roles: `user`, `premium`, `admin`, `super_admin`
- ✅ Permisos granulares: `read:calendar`, `write:calendar`, etc.
- ✅ Guards de router para rutas protegidas
- ✅ Verificación de permisos en componentes

### 3. Estado de Autenticación

- ✅ Store Pinia reactivo
- ✅ Composable `useAuth()` con API completa
- ✅ Estados de loading y error
- ✅ Sincronización entre Auth0 y store local

### 4. Integración con GraphQL

- ✅ Headers JWT automáticos en queries
- ✅ Manejo de errores 401/403
- ✅ Refresh automático en fallos de auth
- ✅ Cleanup de cache en logout

### 5. Componentes UI

- ✅ `LoginButton` - Botón de inicio de sesión
- ✅ `LogoutButton` - Botón de cierre con confirmación
- ✅ `UserProfile` - Dropdown de usuario con avatar
- ✅ `AuthCallback` - Página de procesamiento de callback

### 6. Rutas y Navegación

- ✅ Guards de autenticación
- ✅ Guards de autorización (roles/permisos)
- ✅ Redirects inteligentes post-login
- ✅ Manejo de errores de navegación

## Configuración Requerida

### Variables de Entorno

```bash
# .env.local
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-spa-client-id
VITE_AUTH0_AUDIENCE=https://your-api.com
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:8000
VITE_GRAPHQL_ENDPOINT=http://localhost:8000/graphql
```

### Auth0 Application Configuration

```json
{
  "name": "Vana Calendar SPA",
  "application_type": "spa",
  "token_endpoint_auth_method": "none",
  "callbacks": ["http://localhost:5173/auth/callback", "https://your-domain.com/auth/callback"],
  "logout_urls": ["http://localhost:5173/auth/logout", "https://your-domain.com/auth/logout"],
  "web_origins": ["http://localhost:5173", "https://your-domain.com"],
  "cors": ["http://localhost:5173", "https://your-domain.com"],
  "grants": ["authorization_code", "refresh_token"]
}
```

## Uso de la API

### Composable useAuth()

```typescript
import { useAuth } from '@/auth'

const {
  // Estados
  isAuthenticated,
  isLoading,
  user,
  error,

  // Métodos
  login,
  logout,
  getAccessToken,

  // Autorización
  hasRole,
  hasPermission,
  isAdmin,
  isPremium,

  // Utilidades
  getUserDisplayName,
  getUserAvatar,
} = useAuth()
```

### Router Guards

```typescript
import { authGuard, adminGuard, createRoleGuard } from '@/auth'

// Ruta que requiere autenticación
{
  path: '/dashboard',
  component: Dashboard,
  beforeEnter: authGuard
}

// Ruta que requiere rol admin
{
  path: '/admin',
  component: AdminPanel,
  beforeEnter: adminGuard
}

// Ruta con roles específicos
{
  path: '/premium',
  component: Premium,
  beforeEnter: createRoleGuard(['premium', 'admin'])
}
```

### Componentes

```vue
<template>
  <!-- Login automático -->
  <LoginButton variant="primary" text="Iniciar Sesión" @login-success="handleLogin" />

  <!-- Profile con dropdown -->
  <UserProfile :show-name="true" :show-status="true" size="md" />

  <!-- Logout con confirmación -->
  <LogoutButton :show-confirmation="true" @logout-success="handleLogout" />
</template>
```

### GraphQL con Auth

```typescript
import { useQuery } from '@vue/apollo-composable'

// Los tokens JWT se agregan automáticamente
const { result, error } = useQuery(GET_USER_CALENDAR)
```

## Testing y Desarrollo

### Página de Demo

Visita `/auth/demo` para ver:

- Estado actual de autenticación
- Información del usuario
- Pruebas de permisos y roles
- Test de integración con GraphQL
- Datos completos del usuario

### Auth Store Debug

```typescript
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
console.log(authStore.getAuthState())
```

### Logs de Desarrollo

La implementación incluye logs detallados en desarrollo:

- Estado de configuración Auth0
- Cambios de ruta con metadata
- Errores de autenticación
- Tiempo de inicialización de la app

## Seguridad

### Implementada

- ✅ PKCE para SPAs
- ✅ Refresh tokens seguros
- ✅ Validación de URLs de redirect
- ✅ Cleanup completo en logout
- ✅ Validación de tokens en Apollo
- ✅ Headers CORS apropiados

### Consideraciones

- Los tokens se almacenan en localStorage (estándar para SPAs)
- Los refresh tokens tienen expiración
- Las URLs de callback son validadas por Auth0
- Los permisos se verifican tanto en frontend como backend

## Troubleshooting

### Errores Comunes

1. **"Auth0 configuration is invalid"**

   - Verificar variables de entorno
   - Revisar configuración de la aplicación Auth0

2. **"Failed to fetch dynamically imported module"**

   - Error de chunks en producción
   - La página se recarga automáticamente

3. **401/403 en GraphQL**

   - Verificar audience en Auth0
   - Confirmar permisos del usuario

4. **Callback loop infinito**
   - Verificar URLs de callback en Auth0
   - Revisar guards de router

### Debug Mode

```typescript
// Activar logs detallados
localStorage.setItem('auth_debug', 'true')

// Ver estado completo
console.log(useAuthStore().getAuthState())
```

## Próximos Pasos

Para completar la implementación:

1. ✅ Implementación base completa
2. 🔄 Crear páginas específicas (Profile, Settings, Admin)
3. 🔄 Implementar GraphQL schemas y queries
4. 🔄 Testing automatizado
5. 🔄 Optimizaciones de performance
6. 🔄 Analytics y métricas de auth

## Conclusión

La implementación de Auth0 está completa y lista para usar. Incluye todas las funcionalidades necesarias para una aplicación moderna con autenticación y autorización robustas.

La arquitectura es escalable, maintener y sigue las mejores prácticas de Vue 3, TypeScript y Auth0.
