# 🧬 PATRONES OBLIGATORIOS PARA SUBAGENTES VANA

## ⚠️ **REGLA CRÍTICA: NO EXCEPTIONS**

Cualquier subagente que no siga estos patrones está fallando en su responsabilidad principal. Estos patrones son OBLIGATORIOS, no sugerencias.

---

## 🧪 **TESTING PATTERNS - CHECKLIST OBLIGATORIO**

### **PRE-TEST ANALYSIS (MANDATORY)**

```javascript
/**
 * MANDATORY COMPONENT ANALYSIS BEFORE WRITING ANY TEST
 *
 * 1. READ THE COMPLETE COMPONENT FILE FIRST
 * 2. IDENTIFY ALL DEPENDENCIES
 * 3. PLAN COMPLETE MOCKS
 * 4. VERIFY LIFECYCLE REQUIREMENTS
 */

// ✅ TEMPLATE: Complete component analysis
/*
COMPONENT: EmailVerificationPage.vue
DEPENDENCIES FOUND:
- useAuth: resendVerificationEmail, checkEmailVerification
- useRouter: push, replace  
- useRoute: query.email, query.auth0Id
- Lifecycle: onMounted sets intervals, onUnmounted cleans up
- Computed: email depends on route.query.email
*/
```

### **MOCK PATTERNS - USE ALWAYS**

#### **✅ CORRECT: Complete Composable Mock**

```javascript
// PATTERN 1: Complete useAuth mock
const createCompleteAuthMock = () => ({
  // Auth state (return refs for reactivity)
  isAuthenticated: { value: false },
  isLoading: { value: false },
  user: { value: null },
  error: { value: null },

  // Auth actions (return promises)
  login: vi.fn().mockResolvedValue(undefined),
  logout: vi.fn().mockResolvedValue(undefined),
  registerWithRedirect: vi.fn().mockResolvedValue(undefined),
  checkAuth: vi.fn().mockResolvedValue(false),

  // Email verification methods (CRITICAL for EmailVerificationPage)
  resendVerificationEmail: vi.fn().mockResolvedValue(undefined),
  checkEmailVerification: vi.fn().mockResolvedValue(false),

  // Token methods
  getAccessToken: vi.fn().mockResolvedValue('mock-token'),
  refreshToken: vi.fn().mockResolvedValue('mock-refreshed-token'),

  // User info methods
  getUserDisplayName: vi.fn().mockReturnValue('Test User'),
  getUserAvatar: vi.fn().mockReturnValue('https://example.com/avatar.jpg'),
  getUserRoles: vi.fn().mockReturnValue(['user']),

  // Role/permission checks (return primitives, not refs)
  isPremium: vi.fn().mockReturnValue(false),
  isAdmin: vi.fn().mockReturnValue(false),
  hasRole: vi.fn().mockReturnValue(false),
  hasPermission: vi.fn().mockReturnValue(false),
})

// PATTERN 2: Complete Router Mock
const mockRouterWithParams = (query = {}, params = {}) => {
  const mockPush = vi.fn()
  const mockReplace = vi.fn()

  // Mock useRoute
  vi.mocked(useRoute).mockReturnValue({
    params,
    query,
    path: '/current/path',
    meta: {},
    name: 'CurrentRoute',
    fullPath: `/current/path?${new URLSearchParams(query).toString()}`,
    hash: '',
    matched: [],
    redirectedFrom: undefined,
  })

  // Mock useRouter
  vi.mocked(useRouter).mockReturnValue({
    push: mockPush,
    replace: mockReplace,
    back: vi.fn(),
    forward: vi.fn(),
  })

  return { mockPush, mockReplace }
}
```

#### **❌ PROHIBITED: Partial Mocks**

```javascript
// ❌ NEVER DO THIS - Incomplete mock will cause destructuring errors
const badMock = {
  login: vi.fn(),
  // Missing: resendVerificationEmail, checkEmailVerification, etc.
}

// ❌ NEVER DO THIS - Wrong return types
const badMock2 = {
  isAuthenticated: false, // Should be { value: false }
  login: vi.fn().mockReturnValue(true), // Should be mockResolvedValue
}
```

---

## 🔄 **COMPONENT LIFECYCLE PATTERNS**

### **✅ CORRECT: Proper Lifecycle Testing**

```javascript
// PATTERN 3: Component lifecycle with timers
const testComponentWithLifecycle = async () => {
  // 1. Setup mocks BEFORE rendering
  const mockAuth = createCompleteAuthMock()
  vi.mocked(useAuth).mockReturnValue(mockAuth)

  // 2. Render component
  const { unmount } = render(Component, {
    global: { plugins: [router, pinia] },
  })

  // 3. Wait for lifecycle to complete
  await nextTick()
  await flushPromises()

  // 4. For timer-based tests
  await vi.runAllTimersAsync() // Let onMounted complete

  // 5. Verify expected calls
  expect(mockAuth.checkEmailVerification).toHaveBeenCalledWith('expectedParam')

  // 6. Clean up
  unmount()
}
```

### **❌ PROHIBITED: Incomplete Lifecycle Handling**

```javascript
// ❌ NEVER DO THIS - No lifecycle waiting
render(Component)
expect(mockFunction).toHaveBeenCalled() // Will fail - too early

// ❌ NEVER DO THIS - Wrong timer handling
vi.advanceTimersByTime(1000)
// Missing: await vi.runAllTimersAsync()
```

---

## 🎯 **ERROR PATTERNS TO AVOID**

### **1. Route Parameter Errors**

```javascript
// ❌ WRONG: Component uses useRoute() but test doesn't mock it
const { mockPush } = mockRouterWithParams()
// Missing: query parameters that component expects

// ✅ CORRECT: Mock route with expected parameters
const { mockPush } = mockRouterWithParams({
  email: 'test@example.com',
  auth0Id: 'auth0|123456789',
})
```

### **2. Composable Method Errors**

```javascript
// ❌ WRONG: Mock missing methods that component destructures
const { resendVerificationEmail } = useAuth()
// Error: Cannot destructure property 'resendVerificationEmail' of undefined

// ✅ CORRECT: Include ALL methods in mock
const mockAuth = createCompleteAuthMock()
// Now resendVerificationEmail exists and is properly mocked
```

### **3. Reactivity Errors**

```javascript
// ❌ WRONG: Non-reactive mock values
isAuthenticated: false // Component expects { value: false }

// ✅ CORRECT: Reactive mock values
isAuthenticated: {
  value: false
} // Vue ref structure
```

---

## 📋 **MANDATORY TEST STRUCTURE**

### **✅ CORRECT: Complete Test File Structure**

```javascript
/**
 * MANDATORY HEADER: Document what this test covers
 * Component: ComponentName.vue
 * Purpose: Test [specific functionality]
 * Dependencies: [list all composables, props, etc.]
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { flushPromises } from '@vue/test-utils'

// Component under test
import ComponentName from '@/path/to/ComponentName.vue'

// MANDATORY: Mock ALL composables used by component
vi.mock('@/composables/useAuth', () => ({
  useAuth: vi.fn(() => createCompleteAuthMock())
}))

describe('ComponentName', () => {
  let mockAuth: any
  let router: any
  let pinia: any

  beforeEach(async () => {
    // MANDATORY: Setup test environment
    pinia = createPinia()
    setActivePinia(pinia)

    router = createRouter({
      history: createMemoryHistory(),
      routes: [/* required routes */]
    })

    // MANDATORY: Setup fresh mocks
    mockAuth = createCompleteAuthMock()
    vi.mocked(useAuth).mockReturnValue(mockAuth)

    // MANDATORY: Setup fake timers if component uses timers
    vi.useFakeTimers()
  })

  afterEach(() => {
    // MANDATORY: Cleanup
    vi.clearAllMocks()
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  // MANDATORY: Helper for consistent component rendering
  const renderComponent = async (props = {}, routeParams = {}) => {
    // Setup route if needed
    if (Object.keys(routeParams).length > 0) {
      mockRouterWithParams(routeParams.query, routeParams.params)
    }

    const result = render(ComponentName, {
      props,
      global: {
        plugins: [router, pinia]
      }
    })

    // MANDATORY: Wait for component lifecycle
    await nextTick()
    await flushPromises()

    return result
  }

  describe('Component rendering', () => {
    it('renders correctly with required props', async () => {
      await renderComponent({ /* required props */ })

      // Test basic rendering
      expect(screen.getByRole('heading')).toBeInTheDocument()
    })
  })

  describe('Component functionality', () => {
    it('handles user interactions correctly', async () => {
      await renderComponent()

      // Test specific functionality
      // Use proper async/await patterns
      // Verify expected calls with correct parameters
    })
  })
})
```

---

## 🚨 **QUALITY GATES - NON-NEGOTIABLE**

### **Before ANY commit:**

```bash
# MANDATORY: All must pass
npm run lint          # 0 errors allowed
npm run typecheck     # 0 errors allowed
npm run test          # 100% pass rate required
npm run build         # Must succeed
```

### **Before marking task complete:**

```javascript
// MANDATORY: Test that your changes work
const verifyQuality = async () => {
  // 1. All new tests pass individually
  await runSpecificTests()

  // 2. No existing tests broken
  await runAllTests()

  // 3. No TypeScript errors
  await runTypeCheck()

  // 4. Component actually works as expected
  await manuallyVerifyComponent()
}
```

---

## ⚡ **QUICK REFERENCE CARD**

### **For Every Test File:**

1. ✅ Read component source completely
2. ✅ Document all dependencies in comments
3. ✅ Create complete mocks (not partial)
4. ✅ Handle component lifecycle properly
5. ✅ Use consistent test structure
6. ✅ Verify quality gates pass

### **Red Flags (Stop and Fix):**

- ❌ "Cannot destructure property" errors
- ❌ Tests pass individually but fail together
- ❌ TypeScript errors in test files
- ❌ Mocks that don't match real composable API
- ❌ Tests that don't wait for async operations

### **Emergency Checklist:**

If tests are failing mysteriously:

1. Check mock completeness
2. Verify async/await patterns
3. Confirm route parameter setup
4. Validate component lifecycle handling
5. Review timer and interval cleanup

---

**REMEMBER: Your job is to create production-ready, maintainable tests that work reliably. These patterns ensure that every test you write follows enterprise-grade standards.**
