# 📊 COMPONENT ANALYSIS TEMPLATE - MANDATORY PRE-TEST

## ⚠️ **USAGE INSTRUCTIONS**
Every subagent must complete this analysis BEFORE writing any test. Copy this template to your test file as comments, fill it out completely, then implement the tests based on this analysis.

---

## 🎯 **COMPONENT ANALYSIS**

### **Basic Information**
- **Component Path**: \_\_\_\_\_\_\_\_\_\_\_
- **Component Name**: \_\_\_\_\_\_\_\_\_\_\_
- **Responsible Agent**: \_\_\_\_\_\_\_\_\_\_\_
- **Date**: \_\_\_\_\_\_\_\_\_\_\_

---

## 🔍 **DEPENDENCY ANALYSIS**

### **1. Composables Used**
Analyze the `<script setup>` section and list ALL composables:

#### **useAuth**
- [ ] Used: Yes/No
- **Methods needed in mock**:
  - [ ] `login` - returns: \_\_\_\_\_\_\_\_\_\_\_
  - [ ] `logout` - returns: \_\_\_\_\_\_\_\_\_\_\_
  - [ ] `resendVerificationEmail` - returns: \_\_\_\_\_\_\_\_\_\_\_
  - [ ] `checkEmailVerification` - returns: \_\_\_\_\_\_\_\_\_\_\_
  - [ ] Other: \_\_\_\_\_\_\_\_\_\_\_
- **State properties needed**:
  - [ ] `isAuthenticated` - type: ref/primitive
  - [ ] `user` - type: ref/primitive
  - [ ] `isLoading` - type: ref/primitive
  - [ ] Other: \_\_\_\_\_\_\_\_\_\_\_

#### **useRouter**
- [ ] Used: Yes/No
- **Methods needed**:
  - [ ] `push` - parameters: \_\_\_\_\_\_\_\_\_\_\_
  - [ ] `replace` - parameters: \_\_\_\_\_\_\_\_\_\_\_
  - [ ] Other: \_\_\_\_\_\_\_\_\_\_\_

#### **useRoute**
- [ ] Used: Yes/No
- **Properties accessed**:
  - [ ] `query.email` - expected value: \_\_\_\_\_\_\_\_\_\_\_
  - [ ] `query.auth0Id` - expected value: \_\_\_\_\_\_\_\_\_\_\_
  - [ ] `params.id` - expected value: \_\_\_\_\_\_\_\_\_\_\_
  - [ ] Other: \_\_\_\_\_\_\_\_\_\_\_

#### **Other Composables**
- **Name**: \_\_\_\_\_\_\_\_\_\_\_
  - **Methods**: \_\_\_\_\_\_\_\_\_\_\_
  - **State**: \_\_\_\_\_\_\_\_\_\_\_

---

## 📝 **COMPONENT STRUCTURE ANALYSIS**

### **2. Props Analysis**
```typescript
// List all props with their types and default values
interface Props {
  propName: string     // required/optional, default: ___
  // Add all props here
}
```

### **3. Computed Properties**
Analyze each computed property and its dependencies:

- **`computedName`**:
  - **Depends on**: \_\_\_\_\_\_\_\_\_\_\_ (route.query, props, composable state)
  - **Return type**: \_\_\_\_\_\_\_\_\_\_\_
  - **Used in template**: Yes/No
  - **Critical for functionality**: Yes/No

### **4. Reactive State**
List all `ref()` and `reactive()` variables:

- **`stateName`**: 
  - **Initial value**: \_\_\_\_\_\_\_\_\_\_\_
  - **Type**: \_\_\_\_\_\_\_\_\_\_\_
  - **Modified by**: \_\_\_\_\_\_\_\_\_\_\_ (which functions)

---

## 🔄 **LIFECYCLE ANALYSIS**

### **5. Lifecycle Hooks**

#### **onMounted**
- [ ] Present: Yes/No
- **Actions performed**:
  - [ ] Sets up intervals: \_\_\_\_\_\_\_\_\_\_\_
  - [ ] Makes API calls: \_\_\_\_\_\_\_\_\_\_\_
  - [ ] Validates parameters: \_\_\_\_\_\_\_\_\_\_\_
  - [ ] Redirects: \_\_\_\_\_\_\_\_\_\_\_
  - [ ] Other: \_\_\_\_\_\_\_\_\_\_\_

#### **onUnmounted**
- [ ] Present: Yes/No
- **Cleanup performed**:
  - [ ] Clear intervals: \_\_\_\_\_\_\_\_\_\_\_
  - [ ] Cancel requests: \_\_\_\_\_\_\_\_\_\_\_
  - [ ] Other: \_\_\_\_\_\_\_\_\_\_\_

#### **watch/watchEffect**
- **Watched value**: \_\_\_\_\_\_\_\_\_\_\_
- **Callback action**: \_\_\_\_\_\_\_\_\_\_\_
- **Immediate**: Yes/No

---

## 🎨 **UI/TEMPLATE ANALYSIS**

### **6. Template Structure**
Key elements and their conditions:

- **Main heading**: 
  - **Selector**: `h1`, `[role="heading"]`, etc.
  - **Expected text**: \_\_\_\_\_\_\_\_\_\_\_

- **Conditional elements**:
  - **Element**: \_\_\_\_\_\_\_\_\_\_\_
  - **Condition**: `v-if="___"`
  - **Depends on**: \_\_\_\_\_\_\_\_\_\_\_

- **Interactive elements**:
  - **Button/Link**: \_\_\_\_\_\_\_\_\_\_\_
  - **Event**: `@click="___"`
  - **Expected behavior**: \_\_\_\_\_\_\_\_\_\_\_

### **7. Dynamic Content**
Content that changes based on state:

- **Text interpolation**: `{{ variableName }}`
  - **Variable source**: \_\_\_\_\_\_\_\_\_\_\_
  - **Expected value in test**: \_\_\_\_\_\_\_\_\_\_\_

---

## ⚙️ **BEHAVIOR ANALYSIS**

### **8. User Interactions**
Map out all possible user actions:

- **Action**: Click "Resend Email" button
  - **Triggers**: \_\_\_\_\_\_\_\_\_\_\_ function
  - **Calls**: \_\_\_\_\_\_\_\_\_\_\_ composable method
  - **With parameters**: \_\_\_\_\_\_\_\_\_\_\_
  - **Expected result**: \_\_\_\_\_\_\_\_\_\_\_

### **9. Async Operations**
Identify all async behavior:

- **Operation**: \_\_\_\_\_\_\_\_\_\_\_
  - **Trigger**: \_\_\_\_\_\_\_\_\_\_\_
  - **Duration/timing**: \_\_\_\_\_\_\_\_\_\_\_
  - **Success handling**: \_\_\_\_\_\_\_\_\_\_\_
  - **Error handling**: \_\_\_\_\_\_\_\_\_\_\_

### **10. Timer/Interval Usage**
- **Timer type**: `setInterval`, `setTimeout`
- **Purpose**: \_\_\_\_\_\_\_\_\_\_\_
- **Interval**: \_\_\_\_\_\_\_\_\_\_\_
- **Cleanup**: \_\_\_\_\_\_\_\_\_\_\_

---

## 🧪 **TEST STRATEGY**

### **11. Mock Requirements**
Based on analysis above:

```javascript
// Required mocks checklist:
const requiredMocks = {
  useAuth: {
    // List ALL methods identified above
    methods: ['login', 'resendVerificationEmail', /*...*/],
    state: ['isAuthenticated', 'user', /*...*/]
  },
  
  useRouter: {
    methods: ['push', /*...*/]
  },
  
  useRoute: {
    query: { email: 'test@example.com', /*...*/ },
    params: { /*...*/ }
  }
  
  // Add other mocks as needed
}
```

### **12. Test Scenarios**
Based on component behavior:

#### **Happy Path Tests**:
- [ ] Component renders with valid props/parameters
- [ ] User interactions work correctly
- [ ] Async operations complete successfully
- [ ] State updates trigger UI changes

#### **Edge Case Tests**:
- [ ] Missing/invalid parameters
- [ ] API failures
- [ ] Network timeouts  
- [ ] Invalid user input

#### **Lifecycle Tests**:
- [ ] onMounted behavior
- [ ] Timer/interval setup and cleanup
- [ ] Component unmounting

---

## ✅ **VALIDATION CHECKLIST**

### **13. Analysis Completeness**
Before implementing tests, verify:

- [ ] **All composables identified** and analyzed
- [ ] **All computed properties** dependencies mapped
- [ ] **All user interactions** documented
- [ ] **All async operations** identified
- [ ] **Mock strategy** is complete
- [ ] **Test scenarios** cover main functionality

### **14. Risk Assessment**
Identify potential problem areas:

- **High Risk Areas**:
  - [ ] Complex timing dependencies
  - [ ] Multiple async operations
  - [ ] Deep component hierarchies
  - [ ] External API dependencies

- **Mitigation Strategy**: \_\_\_\_\_\_\_\_\_\_\_

---

## 🎯 **IMPLEMENTATION PLAN**

### **15. Test Implementation Order**
1. **Setup Phase**: Create mocks based on analysis
2. **Basic Rendering**: Verify component renders without errors
3. **Props/Parameters**: Test with various input combinations
4. **User Interactions**: Test button clicks, form submissions, etc.
5. **Async Behavior**: Test API calls, timers, etc.
6. **Edge Cases**: Test error scenarios
7. **Cleanup**: Verify proper resource cleanup

### **16. Expected Timeline**
- **Analysis completion**: \_\_\_\_\_\_\_\_\_\_\_ minutes
- **Mock setup**: \_\_\_\_\_\_\_\_\_\_\_ minutes
- **Test implementation**: \_\_\_\_\_\_\_\_\_\_\_ minutes
- **Quality verification**: \_\_\_\_\_\_\_\_\_\_\_ minutes

---

## 📋 **SIGN-OFF**

### **Analysis Completed By**: \_\_\_\_\_\_\_\_\_\_\_
### **Date**: \_\_\_\_\_\_\_\_\_\_\_
### **Review Status**: [ ] Complete [ ] Needs Revision

---

**💡 TIPS:**
- Take time to thoroughly understand the component before coding
- When in doubt, check similar working components for patterns
- Document assumptions and decisions for future reference
- Update this analysis if you discover new dependencies while testing

**⚠️ REMEMBER:** A thorough analysis prevents 90% of testing issues. Invest time here to save hours later!