# 🏪 STORE TESTING PATTERNS - MANDATORY EXTENSION

## ⚠️ **NUEVA REGLA CRÍTICA - AGREGADA A PATRONES EXISTENTES**

**ADDITION TO EXISTING PATTERNS: Los agentes DEBEN leer primero COMMON_PATTERNS.md y luego aplicar estos patrones adicionales para stores.**

---

## 📊 **STORE-SPECIFIC TESTING PATTERNS**

### **🚨 CRITICAL ERROR PATTERNS IDENTIFIED - MUST AVOID:**

#### **❌ ERROR PATTERN 1: Incomplete Store Mocks**
```javascript
// ❌ NEVER DO THIS - Partial store mock
const mockStore = {
  user: null,
  isAuthenticated: false
  // Missing computed properties, methods, etc.
}
```

#### **❌ ERROR PATTERN 2: Direct Store Testing**
```javascript
// ❌ NEVER DO THIS - Testing real store without proper setup
import { useAuthStore } from '@/store/auth'
const store = useAuthStore() // Will fail - no proper mock
```

#### **❌ ERROR PATTERN 3: Missing Reactive Properties**
```javascript
// ❌ NEVER DO THIS - Non-reactive mock properties
const mockStore = {
  userRoles: [], // Should be computed/reactive
  isAuthenticated: false // Should be reactive
}
```

---

## ✅ **MANDATORY STORE TESTING PATTERN**

### **PATTERN: Complete Store Mock Strategy**

```javascript
import { vi, beforeEach, describe, it, expect } from 'vitest'
import { ref, computed } from 'vue'

// MANDATORY: Mock the entire store module
const mockStoreInstance = vi.fn()
vi.mock('@/store/auth', () => ({
  useAuthStore: mockStoreInstance
}))

describe('Auth Store Tests', () => {
  let mockStore: any

  beforeEach(() => {
    // STEP 1: Create complete reactive mock
    mockStore = {
      // STATE: Use refs for reactivity
      user: ref(null),
      token: ref(null),
      isLoading: ref(false),
      error: ref(null),

      // COMPUTED: Create proper computed properties
      isAuthenticated: computed(() => !!mockStore.user.value),
      userRoles: computed(() => mockStore.user.value?.['https://vana.app/roles'] || []),
      userPermissions: computed(() => mockStore.user.value?.['https://vana.app/permissions'] || []),
      userDisplayName: computed(() => {
        if (!mockStore.user.value) return 'Usuario'
        return mockStore.user.value.name || mockStore.user.value.nickname || 'Usuario'
      }),
      userAvatar: computed(() => mockStore.user.value?.picture || '/default-avatar.jpg'),
      isAdmin: computed(() => mockStore.userRoles.value.includes('admin')),
      isPremium: computed(() => mockStore.userRoles.value.includes('premium')),

      // ACTIONS: Implement all store methods
      setUser: vi.fn().mockImplementation((user) => {
        mockStore.user.value = user
      }),
      setToken: vi.fn().mockImplementation((token) => {
        mockStore.token.value = token
      }),
      clearAuth: vi.fn().mockImplementation(() => {
        mockStore.user.value = null
        mockStore.token.value = null
        mockStore.error.value = null
      }),
      setLoading: vi.fn().mockImplementation((loading) => {
        mockStore.isLoading.value = loading
      }),
      setError: vi.fn().mockImplementation((error) => {
        mockStore.error.value = error
      }),

      // ROLE/PERMISSION METHODS: Complete interface
      hasRole: vi.fn().mockImplementation((role) => {
        return mockStore.userRoles.value.includes(role)
      }),
      hasAnyRole: vi.fn().mockImplementation((roles) => {
        return roles.some(role => mockStore.userRoles.value.includes(role))
      }),
      hasAllRoles: vi.fn().mockImplementation((roles) => {
        return roles.every(role => mockStore.userRoles.value.includes(role))
      }),
      hasPermission: vi.fn().mockImplementation((permission) => {
        return mockStore.userPermissions.value.includes(permission)
      }),
      hasAnyPermission: vi.fn().mockImplementation((permissions) => {
        return permissions.some(permission => mockStore.userPermissions.value.includes(permission))
      }),
      hasAllPermissions: vi.fn().mockImplementation((permissions) => {
        return permissions.every(permission => mockStore.userPermissions.value.includes(permission))
      }),

      // PROFILE METHODS: Complete implementation
      updateUserProfile: vi.fn().mockImplementation((profileData) => {
        if (mockStore.user.value) {
          mockStore.user.value = { ...mockStore.user.value, ...profileData }
        }
      }),
      updateUserMetadata: vi.fn().mockImplementation((metadata) => {
        if (mockStore.user.value) {
          mockStore.user.value['https://vana.app/user_metadata'] = {
            ...mockStore.user.value['https://vana.app/user_metadata'],
            ...metadata
          }
        }
      }),

      // UTILITY METHODS: Complete interface
      getAuthState: vi.fn().mockImplementation(() => ({
        user: mockStore.user.value,
        token: mockStore.token.value,
        isAuthenticated: mockStore.isAuthenticated.value,
        isLoading: mockStore.isLoading.value,
        error: mockStore.error.value
      })),
      initializeFromStorage: vi.fn().mockResolvedValue(undefined)
    }

    // STEP 2: Setup mock return
    mockStoreInstance.mockReturnValue(mockStore)

    // STEP 3: Mock localStorage
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    } as any

    // STEP 4: Clear all mocks
    vi.clearAllMocks()
  })

  // TESTS: Follow established patterns...
})
```

---

## 🔧 **STORE TESTING CHECKLIST - MANDATORY**

### **Pre-Implementation:**
- [ ] **Identify ALL store properties** (state, computed, actions)
- [ ] **Map ALL dependencies** (localStorage, external APIs)
- [ ] **Plan reactive mock structure** (refs for state, computed for derived)
- [ ] **List ALL methods** that tests will call

### **Implementation:**
- [ ] **Create COMPLETE mock interface** (no missing methods/properties)
- [ ] **Use proper Vue reactivity** (`ref()`, `computed()`)
- [ ] **Mock ALL external dependencies** (localStorage, sessionStorage, APIs)
- [ ] **Implement realistic method behavior** (actual state updates)

### **Validation:**
- [ ] **All computed properties work** (return expected values)
- [ ] **All actions update state** correctly
- [ ] **All method calls succeed** (no "is not a function" errors)
- [ ] **Reactivity works** (computed properties update when state changes)

---

## 🚨 **STORE ERROR PREVENTION RULES**

### **RULE 1: Complete Interface Implementation**
```javascript
// ✅ MANDATORY: Every property/method in real store MUST exist in mock
const storeInterface = [
  'user', 'token', 'isLoading', 'error',
  'isAuthenticated', 'userRoles', 'userPermissions',
  'setUser', 'clearAuth', 'hasRole', 'hasPermission'
  // ... ALL others must be included
]
```

### **RULE 2: Proper Reactivity Setup**
```javascript
// ✅ MANDATORY: Use Vue reactivity for store state
import { ref, computed } from 'vue'
const state = ref(initialValue)
const derived = computed(() => processState(state.value))
```

### **RULE 3: External Dependencies Mock**
```javascript
// ✅ MANDATORY: Mock ALL external dependencies
vi.mock('localStorage', () => ({ /* complete mock */ }))
vi.mock('@/services/api/auth', () => ({ /* complete mock */ }))
```

### **RULE 4: Realistic Method Implementation**
```javascript
// ✅ MANDATORY: Methods must actually update state
setUser: vi.fn().mockImplementation((user) => {
  mockStore.user.value = user  // Actually update the mock state
})
```

---

## 📋 **STORE-SPECIFIC QUALITY GATES**

### **MANDATORY CHECKS:**
- [ ] **No "undefined" errors** for any store property
- [ ] **No "is not a function"** errors for any store method  
- [ ] **All computed properties** return expected types
- [ ] **State updates** trigger reactivity correctly
- [ ] **External dependencies** are properly mocked
- [ ] **localStorage interactions** work as expected

### **SUCCESS CRITERIA:**
- **100% test pass rate** for store functionality
- **No console errors** during test execution
- **Proper type checking** (no TypeScript errors)
- **Realistic behavior** (store acts like real implementation)

---

## 🎯 **INTEGRATION WITH EXISTING PATTERNS**

**Este documento EXTIENDE los patrones existentes en COMMON_PATTERNS.md:**
1. **Sigue todos los patrones de mock** establecidos
2. **Aplica reglas de lifecycle** para stores
3. **Usa patrones de async/await** para acciones asíncronas  
4. **Mantiene reglas de cleanup** en afterEach

**Los agentes DEBEN leer ambos documentos completamente antes de empezar cualquier test de store.**