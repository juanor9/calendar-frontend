# ✅ ERROR PREVENTION CHECKLIST - MANDATORY FOR ALL SUBAGENTS

## ⚠️ **CRITICAL RULE: NO EXCEPTIONS**
Every subagent must complete this checklist before making ANY code changes. Failure to follow this checklist means the task is INCOMPLETE regardless of apparent functionality.

---

## 📋 **PRE-WORK CHECKLIST (MANDATORY)**

### **Before touching any code:**

#### **1. Component Understanding**
- [ ] **READ THE COMPLETE COMPONENT FILE** (not just the parts that seem relevant)
- [ ] **LIST ALL COMPOSABLES** used by the component (`useAuth`, `useRouter`, `useRoute`, etc.)
- [ ] **IDENTIFY ALL PROPS** and their types  
- [ ] **FIND ALL COMPUTED PROPERTIES** and their dependencies
- [ ] **LOCATE LIFECYCLE HOOKS** (`onMounted`, `onUnmounted`, etc.) and what they do
- [ ] **DOCUMENT COMPONENT DEPENDENCIES** in test file comments

#### **2. Existing Test Analysis**
- [ ] **READ EXISTING TEST FILES** for similar components
- [ ] **UNDERSTAND THE TESTING PATTERNS** already used in the codebase
- [ ] **IDENTIFY REUSABLE MOCK PATTERNS** from working tests
- [ ] **CHECK FOR SIMILAR COMPONENT TESTS** that can serve as templates

#### **3. Mock Strategy Planning**
- [ ] **LIST ALL METHODS** needed in each composable mock (check the source composable)
- [ ] **PLAN COMPLETE MOCKS** (not partial ones)
- [ ] **IDENTIFY RETURN VALUE TYPES** (refs vs primitives, promises vs sync)
- [ ] **PLAN ROUTE PARAMETER SETUP** if component uses `useRoute`

---

## 🛠️ **IMPLEMENTATION CHECKLIST (MANDATORY)**

### **While writing code:**

#### **1. Mock Creation**
- [ ] **ALL COMPOSABLE METHODS INCLUDED** in mocks (check against source composable)
- [ ] **CORRECT RETURN TYPES** used (`{ value: x }` for refs, promises for async methods)
- [ ] **REALISTIC MOCK VALUES** that match what component expects  
- [ ] **ERROR STATES INCLUDED** where applicable

#### **2. Component Rendering**
- [ ] **ROUTE PARAMETERS SET UP** before rendering if component uses `useRoute`
- [ ] **ALL REQUIRED PROPS PROVIDED** to component
- [ ] **PLUGINS REGISTERED** (router, pinia, etc.) in render options
- [ ] **LIFECYCLE AWAITING** (`nextTick`, `flushPromises`) after rendering

#### **3. Test Logic**
- [ ] **ASYNC/AWAIT PATTERNS** used correctly
- [ ] **TIMER HANDLING** with `vi.useFakeTimers()` and `vi.runAllTimersAsync()`
- [ ] **CLEANUP IN afterEach** (mocks, timers, etc.)
- [ ] **SPECIFIC ASSERTIONS** (not vague "should work" tests)

---

## ✅ **QUALITY VERIFICATION (MANDATORY)**

### **Before committing any changes:**

#### **1. Code Quality**
- [ ] **`npm run lint`** - ZERO errors allowed
- [ ] **`npm run typecheck`** - ZERO errors allowed
- [ ] **No console warnings** when tests run
- [ ] **No deprecated API usage** warnings

#### **2. Test Quality**
- [ ] **ALL NEW TESTS PASS** individually
- [ ] **ALL EXISTING TESTS STILL PASS** (no regressions)
- [ ] **TEST DESCRIPTIONS ARE CLEAR** and specific
- [ ] **TESTS ACTUALLY TEST THE INTENDED FUNCTIONALITY**

#### **3. Integration Verification**
- [ ] **COMPONENT RENDERS WITHOUT ERRORS** in test
- [ ] **EXPECTED ELEMENTS FOUND** in DOM queries
- [ ] **USER INTERACTIONS WORK** as expected
- [ ] **API CALLS/COMPOSABLE METHODS CALLED** with correct parameters

---

## 🔍 **COMPLETION CHECKLIST (MANDATORY)**

### **Before marking task as complete:**

#### **1. Final Validation**
- [ ] **Run full test suite**: `npm run test`
- [ ] **Build succeeds**: `npm run build`
- [ ] **No TypeScript errors**: `npm run typecheck`
- [ ] **No linting errors**: `npm run lint`

#### **2. Documentation**
- [ ] **Test file has clear component analysis comments**
- [ ] **Complex test logic is documented**
- [ ] **Mock strategies are explained if non-obvious**

#### **3. Self-Review**
- [ ] **Would this test pass code review?**
- [ ] **Are the mocks realistic and complete?**
- [ ] **Do the tests cover the important functionality?**
- [ ] **Is the code maintainable and readable?**

---

## 🚨 **COMMON ERROR PREVENTION**

### **Red Flags (STOP and fix immediately):**

#### **❌ Mock-Related Errors**
```
"Cannot destructure property 'methodName' of '...' as it is undefined"
→ CAUSE: Incomplete mock missing required methods
→ FIX: Add all methods from source composable to mock
```

#### **❌ Route-Related Errors**
```
"Cannot find element with text: expectedValue"
→ CAUSE: Component computed property depends on route.query but test doesn't set it
→ FIX: Mock useRoute with required query parameters
```

#### **❌ Lifecycle-Related Errors**
```
"Expected spy to be called with arguments but was not called"
→ CAUSE: Test doesn't wait for component lifecycle to complete
→ FIX: Add nextTick() and flushPromises() after rendering
```

#### **❌ Timer-Related Errors**
```
"Aborting after running 10000 timers, assuming an infinite loop"
→ CAUSE: Fake timers not properly managed
→ FIX: Proper cleanup in afterEach, correct timer advancement
```

#### **❌ Reactivity-Related Errors**
```
Component doesn't update when mock values change
→ CAUSE: Mock returns primitive values instead of refs
→ FIX: Use { value: x } for reactive mock properties
```

---

## 📊 **QUALITY METRICS**

### **Your tests should achieve:**
- **Pass Rate**: 100% (no flaky tests)
- **Coverage**: >80% of component code
- **Performance**: <5 seconds per test file
- **Reliability**: Pass consistently across multiple runs

### **Performance Standards:**
- **Component Analysis**: <10 minutes
- **Mock Creation**: <15 minutes  
- **Test Implementation**: <30 minutes per test
- **Quality Verification**: <5 minutes

---

## 🎯 **SUCCESS CRITERIA**

### **A task is ONLY complete when:**
1. ✅ **All checklist items completed**
2. ✅ **All quality gates pass**
3. ✅ **No new errors introduced**
4. ✅ **Component functionality verified**
5. ✅ **Code ready for production**

### **If ANY item fails:**
- 🛑 **Task is INCOMPLETE**
- 🔄 **Must fix issues before proceeding**
- 📋 **Must re-run complete checklist**

---

## 🏪 **STORE TESTING CHECKLIST - NUEVA ADICIÓN CRÍTICA**

### **MANDATORY for ALL store-related tests:**

#### **Store Pre-Analysis (REQUIRED):**
- [ ] **Read STORE_TESTING_PATTERNS.md completely** before touching any store test
- [ ] **Identify ALL store interface** (state, computed, actions, methods)
- [ ] **Map external dependencies** (localStorage, APIs, services)
- [ ] **Plan complete mock strategy** (no partial store mocks allowed)

#### **Store Mock Implementation (REQUIRED):**
- [ ] **Create COMPLETE store interface mock** (all properties and methods)
- [ ] **Use proper Vue reactivity** (`ref()` for state, `computed()` for derived)
- [ ] **Mock ALL external dependencies** (localStorage, sessionStorage, etc.)
- [ ] **Implement realistic method behavior** (methods must update state)
- [ ] **Test computed properties** work correctly with state changes

#### **Store-Specific Quality Gates:**
- [ ] **No "undefined" property errors** (`userRoles`, `userPermissions`, etc.)
- [ ] **No "is not a function" errors** (`hasRole`, `hasPermission`, etc.)
- [ ] **State updates work** (`setUser`, `clearAuth` actually update state)
- [ ] **Computed properties reactive** (update when underlying state changes)
- [ ] **External integrations work** (localStorage calls succeed)

---

## ⚡ **EMERGENCY PROCEDURES**

### **If you encounter unexpected errors:**

#### **1. Systematic Debugging**
- [ ] Check COMMON_PATTERNS.md for similar issues
- [ ] **NEW: Check STORE_TESTING_PATTERNS.md** for store-specific solutions
- [ ] Review component source for missed dependencies  
- [ ] Verify all mocks match actual composable APIs
- [ ] **NEW: Verify store mock completeness** against real store interface
- [ ] Confirm async/timing patterns are correct
- [ ] **NEW: Check reactivity setup** for store computed properties

#### **2. Store-Specific Debugging**
- [ ] **Verify ALL store methods exist** in mock (check for typos)
- [ ] **Confirm reactive setup** (`ref()`, `computed()` used correctly)
- [ ] **Test external mocks** (localStorage, API calls)
- [ ] **Validate state updates** (actions actually change state)

#### **3. Escalation Path**
- [ ] Document the specific error and context
- [ ] Include component analysis and attempted solutions
- [ ] **NEW: Include store interface analysis** if store-related
- [ ] Ask for guidance rather than guessing
- [ ] Update prevention documentation with lessons learned

---

**REMEMBER: Following this checklist prevents 95% of testing errors. The extra 10 minutes of upfront planning saves hours of debugging later.**

**NEW CRITICAL RULE: Store tests require COMPLETE interface mocks - no exceptions. Partial store mocks cause 90% of store test failures.**