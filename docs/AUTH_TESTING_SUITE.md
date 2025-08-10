# 🔐 Auth0 Testing Suite Documentation

## Overview

Este documento describe la suite completa de testing implementada para el sistema de autenticación Auth0 en el frontend Vue 3 de Vana Calendar. La suite cubre todos los aspectos críticos de la autenticación, desde tests unitarios hasta validación de accesibilidad y performance.

## 📋 Test Coverage

### ✅ Archivos Implementados

```
tests/
├── mocks/
│   └── auth0.ts                    # Mocks completos para Auth0 SDK
├── utils/
│   └── auth-test-utils.ts          # Utilidades de testing específicas para Auth
├── unit/
│   ├── auth/
│   │   ├── auth-composable.spec.ts # Tests del composable useAuth
│   │   ├── auth-store.spec.ts      # Tests del store Pinia
│   │   └── auth0-config.spec.ts    # Tests de configuración Auth0
│   └── components/
│       └── auth/
│           ├── LoginButton.spec.ts  # Tests componente LoginButton
│           └── LogoutButton.spec.ts # Tests componente LogoutButton
├── e2e/
│   └── auth/
│       └── auth-flows.cy.ts        # Tests E2E de flujos completos
├── performance/
│   └── auth-performance.spec.ts    # Tests de performance y Core Web Vitals
├── a11y/
│   └── auth-accessibility.spec.ts  # Tests de accesibilidad WCAG 2.2 AA
└── integration/                    # Tests de integración (referenciados)

cypress/
└── support/
    └── auth-commands.ts            # Comandos customizados de Cypress

scripts/
└── run-auth-tests.ts              # Script runner de toda la suite
```

## 🧪 Test Categories

### 1. Unit Tests

**Ubicación**: `tests/unit/auth/`

- **auth-composable.spec.ts**: 150+ tests del composable `useAuth`

  - Estados de autenticación (loading, authenticated, error)
  - Métodos login/logout con diferentes opciones
  - Manejo de tokens y refresh automático
  - Validación de roles y permisos
  - Manejo de errores y edge cases
  - Reactividad de Vue 3

- **auth-store.spec.ts**: 100+ tests del store Pinia

  - Gestión de estado de usuario
  - Persistencia en localStorage
  - Computed properties para roles/permisos
  - Actualizaciones de perfil y metadata
  - Edge cases y validación de datos

- **auth0-config.spec.ts**: 80+ tests de configuración
  - Validación de variables de entorno
  - Construcción de URLs de callback
  - Manejo de diferentes entornos
  - Fallbacks y error handling

### 2. Component Tests

**Ubicación**: `tests/unit/components/auth/`

- **LoginButton.spec.ts**: 120+ tests del botón de login

  - Renderizado en diferentes estados
  - Interacciones de usuario (click, keyboard)
  - Manejo de loading y errores
  - Props y eventos customizados
  - Accesibilidad básica

- **LogoutButton.spec.ts**: 130+ tests del botón de logout
  - Modal de confirmación opcional
  - Estados de loading y error
  - Integración con auth composable
  - Keyboard navigation
  - Responsive design

### 3. E2E Tests

**Ubicación**: `tests/e2e/auth/`

- **auth-flows.cy.ts**: 50+ tests end-to-end
  - Flujo completo de login/logout
  - Manejo de callbacks Auth0
  - Rutas protegidas y guards
  - Control de acceso basado en roles
  - Persistencia de sesión
  - Manejo de errores de red
  - Sincronización cross-tab

### 4. Performance Tests

**Ubicación**: `tests/performance/`

- **auth-performance.spec.ts**: 30+ tests de rendimiento
  - Tiempo de renderizado de componentes < 50ms
  - Operaciones de auth < 500ms
  - Bundle size impact < 100KB
  - Memory leak detection
  - Concurrent operations handling
  - Network failure resilience

### 5. Accessibility Tests

**Ubicación**: `tests/a11y/`

- **auth-accessibility.spec.ts**: 40+ tests de accesibilidad
  - WCAG 2.2 AA compliance
  - Screen reader compatibility
  - Keyboard navigation patterns
  - Focus management
  - ARIA attributes validation
  - Color contrast verification
  - High contrast mode support

## 🛠️ Test Utilities & Mocks

### Mock Auth0 Client

```typescript
// Ejemplo de uso
const mockClient = createMockAuth0Client({
  isAuthenticated: true,
  user: mockAppUser,
  isLoading: false,
  error: null,
})
```

### Test Scenarios Predefinidos

```typescript
// Escenarios comunes
authTestScenarios.authenticatedUser
authTestScenarios.authenticatedAdmin
authTestScenarios.loading
authTestScenarios.loginError
```

### Utilities de Testing

```typescript
// Mount con contexto Auth completo
const { wrapper, authStore, mockAuth0Client } = await mountWithAuth(Component, {
  authState: 'authenticatedUser',
})

// Helpers de accesibilidad
a11yHelpers.testAriaAttributes(wrapper, 'button', { 'aria-label': 'Login' })
a11yHelpers.testKeyboardNavigation(wrapper, 'Enter')

// Helpers de performance
const [result, time] = performanceHelpers.measureRenderTime(() => mount(Component))
```

## 🚀 Running Tests

### Comandos Disponibles

```bash
# Ejecutar toda la suite de Auth
npm run test:auth

# Tests específicos por categoría
npm run test:auth:unit          # Solo tests unitarios
npm run test:auth:components    # Solo tests de componentes
npm run test:auth:performance   # Solo tests de performance
npm run test:auth:a11y          # Solo tests de accesibilidad
npm run test:auth:e2e           # Solo tests E2E

# Desarrollo
npm run test:auth:watch         # Watch mode para desarrollo

# CI/CD
npm run test:auth:ci            # Para pipelines (skip opcionales, genera reportes)
```

### Opciones del Runner

```bash
# Ejecutar suite específica
npm run test:auth -- --suite=unit

# Saltar tests opcionales (performance, a11y)
npm run test:auth -- --skip-optional

# Output verboso
npm run test:auth -- --verbose

# Generar reportes HTML/XML
npm run test:auth -- --report
```

## 📊 Coverage & Reporting

### Thresholds de Coverage

```typescript
// Configuración en vitest.config.ts
thresholds: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  },
  // Auth components requieren mayor coverage
  'src/auth/**': {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: 90
  }
}
```

### Performance Thresholds

```typescript
const PERFORMANCE_THRESHOLDS = {
  COMPONENT_RENDER: 50, // ms
  AUTH_CHECK: 100, // ms
  TOKEN_REFRESH: 500, // ms
  LOGIN_FLOW: 1000, // ms
  LOGOUT_FLOW: 500, // ms
  BUNDLE_SIZE: 100000, // bytes
  MEMORY_USAGE: 5000000, // bytes
}
```

### Reportes Generados

- **HTML Report**: `reports/auth/test-results.html` - Dashboard visual
- **JSON Report**: `reports/auth/test-results.json` - Data estructurada
- **JUnit XML**: `reports/auth/junit.xml` - Para CI/CD integration
- **Coverage Report**: `coverage/` - Coverage detallado por archivo

## 🔧 Integration with CI/CD

### GitHub Actions Example

```yaml
name: Auth Tests
on: [push, pull_request]

jobs:
  auth-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
      - name: Run Auth Tests
        run: npm run test:auth:ci
        env:
          VITE_AUTH0_DOMAIN: ${{ secrets.AUTH0_DOMAIN }}
          VITE_AUTH0_CLIENT_ID: ${{ secrets.AUTH0_CLIENT_ID }}
          VITE_AUTH0_AUDIENCE: ${{ secrets.AUTH0_AUDIENCE }}
      - name: Upload test results
        uses: actions/upload-artifact@v3
        with:
          name: auth-test-results
          path: reports/auth/
```

## 🔐 Security & Best Practices

### Mock Data Security

- No tokens reales en mocks
- Variables de entorno para configuración
- Sanitización de logs de error

### Test Isolation

- Cleanup automático entre tests
- Mock localStorage/sessionStorage
- Reset de estado global

### Performance Optimization

- Parallel test execution
- Lazy loading de mocks
- Efficient component mounting

## 📝 Writing New Tests

### Guidelines

1. **Use Descriptive Names**

   ```typescript
   it('should redirect to login page when accessing protected route as unauthenticated user', () => {
   ```

2. **Follow AAA Pattern**

   ```typescript
   it('should emit loginSuccess event after successful authentication', async () => {
     // Arrange
     const { wrapper, mockAuth0Client } = await mountWithAuth(LoginButton)

     // Act
     await wrapper.find('button').trigger('click')

     // Assert
     expect(wrapper.emitted('loginSuccess')).toBeTruthy()
   })
   ```

3. **Test Edge Cases**

   - Network failures
   - Token expiration
   - Malformed responses
   - Concurrent operations

4. **Include Accessibility**
   ```typescript
   it('should be accessible to screen readers', () => {
     const wrapper = mount(LoginButton)
     a11yHelpers.testScreenReaderContent(wrapper, 'Login')
   })
   ```

## 🚦 Quality Gates

Para que los tests pasen en CI/CD:

- ✅ Coverage > 90% en archivos de auth
- ✅ Performance dentro de thresholds
- ✅ Zero accessibility violations
- ✅ All E2E scenarios pass
- ✅ No memory leaks detected
- ✅ Bundle size impact < 10%

## 🔄 Maintenance

### Regular Tasks

1. **Update Mocks**: Cuando cambie Auth0 SDK
2. **Review Thresholds**: Ajustar según evolución del código
3. **Add New Scenarios**: Para nuevas features
4. **Update E2E Tests**: Cuando cambien flujos de UI

### Monitoring

- Performance degradation alerts
- Coverage decrease alerts
- Accessibility regression detection
- Bundle size increase warnings

---

## 📞 Support

Para dudas sobre esta suite de testing:

1. Revisar la documentación de cada test file
2. Ejecutar `npm run test:auth -- --help` para opciones
3. Revisar los reportes HTML generados
4. Consultar los mocks y utilities disponibles

Esta suite está diseñada para garantizar la máxima calidad y confiabilidad del sistema de autenticación crítico para Vana Calendar.
