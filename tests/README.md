# Comprehensive Frontend Testing Suite for Vana

This testing suite implements comprehensive patterns to prevent the most common frontend errors found in Vue 3 applications. It addresses critical error patterns that frequently cause issues in production.

## 🎯 Critical Error Patterns Addressed

### 1. **Auth0 Token Handling** (`tests/unit/auth/auth0-token-handling.spec.ts`)

**Problem:** Auth0 SDK can return tokens as either `string` or `GetTokenSilentlyVerboseResponse` objects, causing runtime type errors.

**Tests Include:**

- String token validation and handling
- `GetTokenSilentlyVerboseResponse` object handling
- Mixed token type scenarios
- Token storage and retrieval patterns
- Concurrent token request handling

**Critical Patterns Tested:**

```typescript
// String token handling
const token = await auth0Client.getAccessTokenSilently()
const extractedToken = typeof token === 'string' ? token : token.access_token

// Verbose response handling
interface TokenResponse extends GetTokenSilentlyVerboseResponse {
  access_token: string
  expires_in: number
}
```

### 2. **Vue Composition API useAttrs** (`tests/unit/components/BaseBadge.spec.ts`)

**Problem:** Incorrect usage of `useAttrs()` for detecting clickable elements and accessing component attributes.

**Tests Include:**

- Proper `useAttrs()` integration
- Clickable logic based on `attrs.onClick` and `attrs.onMousedown`
- Dynamic attribute handling
- Conditional clickability detection

**Critical Patterns Tested:**

```typescript
// Correct useAttrs usage
const attrs = useAttrs()
const isClickable = !!(attrs.onClick || attrs.onMousedown)

// Class computation based on attrs
const badgeClasses = computed(() => ({
  'badge--clickable': !!(attrs.onClick || attrs.onMousedown),
}))
```

### 3. **Event Handler Types** (`tests/unit/components/event-handler-types.spec.ts`)

**Problem:** Incorrect event type handling and conversion between keyboard and mouse events.

**Tests Include:**

- Mouse event type validation
- Keyboard to mouse event conversion
- Focus event handling
- Event type checking utilities
- Safe event handling patterns

**Critical Patterns Tested:**

```typescript
// Event type conversion
const convertKeyboardToMouse = (keyEvent: KeyboardEvent): MouseEvent => {
  if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
    return new MouseEvent('click', { bubbles: true })
  }
  throw new Error('Cannot convert')
}

// Event type guards
const isMouseEvent = (event: Event): event is MouseEvent => event instanceof MouseEvent
```

### 4. **Asset Loading Validation** (`tests/unit/assets/asset-loading.spec.ts`)

**Problem:** Incorrect asset paths using absolute URLs instead of `@/assets/` aliases.

**Tests Include:**

- Asset path validation (`@/assets/` vs `/public/`)
- Dynamic asset loading
- Missing asset handling
- Responsive image patterns
- Asset preloading validation

**Critical Patterns Tested:**

```typescript
// Correct asset paths
const logoSrc = '@/assets/images/vana-logo.png' // ✅ Correct
const wrongSrc = '/vana-logo.png' // ❌ Wrong

// Asset path validation
const isValidAssetPath = (path: string) => /^@\/assets\/.*\.(png|jpg|svg)$/.test(path)
```

### 5. **Web Vitals Integration** (`tests/performance/web-vitals-integration.spec.ts`)

**Problem:** Incorrect import and usage of web-vitals library functions.

**Tests Include:**

- Web vitals function imports (`onLCP`, `onFCP`, etc.)
- `Metric` interface usage
- Performance monitoring setup
- Error handling for missing web-vitals
- Real-world analytics integration

**Critical Patterns Tested:**

```typescript
// Correct web-vitals usage
import { onLCP, onFCP, onCLS, type Metric } from 'web-vitals'

const handleMetric = (metric: Metric) => {
  console.log(`${metric.name}: ${metric.value}`)
}

onLCP(handleMetric)
onFCP(handleMetric)
```

### 6. **TypeScript Generic Types** (`tests/unit/types/typescript-generics.spec.ts`)

**Problem:** Incorrect usage of generic types, especially with `RenderOptions` and component props.

**Tests Include:**

- `RenderOptions<T>` with component-specific props
- Generic utility functions
- Type constraint validation
- Conditional generic types
- Component prop extraction patterns

**Critical Patterns Tested:**

```typescript
// Correct RenderOptions usage
interface ButtonRenderOptions extends RenderOptions<typeof BaseButton> {
  customTestId?: string
}

// Generic constraint patterns
type ExtractProps<T> = T extends { $props: infer P } ? P : never
```

### 7. **Storybook Stories Validation** (`tests/unit/storybook/stories-validation.spec.ts`)

**Problem:** Using invalid component variants in Storybook stories.

**Tests Include:**

- Story variant validation against component definitions
- Multi-component variant consistency
- Story configuration validation
- Interactive story patterns
- Accessibility story configuration

**Critical Patterns Tested:**

```typescript
// Correct story variant usage
const VALID_BUTTON_VARIANTS = ['primary', 'secondary', 'outline'] as const

export const Primary = {
  args: {
    variant: 'primary', // Must be from VALID_BUTTON_VARIANTS
    label: 'Primary Button',
  },
}
```

## 🚀 Running the Tests

### Individual Test Categories

```bash
# Auth0 token handling tests
npm run test:token-handling

# Event handler type tests
npm run test:event-types

# Asset loading validation
npm run test:asset-loading

# Web vitals integration
npm run test:web-vitals

# TypeScript generics
npm run test:typescript-generics

# Storybook validation
npm run test:storybook-validation
```

### Pattern Management

```bash
# List all error patterns
npm run test:patterns:list

# Validate all patterns
npm run test:patterns

# Run critical tests only
npm run test:patterns:critical
```

## 🔧 Configuration

### Vitest Setup (`tests/setup/vitest-setup.ts`)

The setup includes critical mocks for:

- **Auth0 SDK**: Prevents actual Auth0 calls in tests
- **Web-vitals**: Mocks performance monitoring functions
- **Asset imports**: Handles `@/assets/` path resolution
- **Vue Router**: Mocks router functionality
- **Apollo Client**: Mocks GraphQL operations

### Coverage Thresholds (`vitest.config.ts`)

- Global coverage: 80% (branches, functions, lines, statements)
- UI components: 85% (higher standard for critical components)

## 📊 Testing Best Practices Implemented

1. **User-centric Testing**: Tests focus on actual user interactions
2. **Type Safety**: Comprehensive TypeScript type validation
3. **Error Boundary Testing**: Handles edge cases and error scenarios
4. **Performance Validation**: Tests for Core Web Vitals compliance
5. **Accessibility Testing**: Uses axe-core for a11y validation
6. **Real-world Scenarios**: Tests mimic production usage patterns

## 🎯 Integration with CI/CD

These tests are designed to:

- Run in automated pipelines with consistent results
- Provide meaningful error messages for debugging
- Maintain high performance (fast execution)
- Scale with the application as it grows

## 📝 Adding New Error Pattern Tests

When adding new error pattern tests:

1. Create the test file in the appropriate category
2. Update `tests/scripts/list-patterns.ts` with the new pattern
3. Add npm script in `package.json`
4. Follow the established naming convention: `test:<pattern-name>`
5. Include both positive and negative test cases
6. Add accessibility and performance considerations where relevant

This comprehensive testing suite ensures that the Vana frontend application maintains high quality and reliability by preventing the most common categories of frontend errors.
