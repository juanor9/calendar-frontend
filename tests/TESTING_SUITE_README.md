# Vana Registration Flow Testing Suite

## 🎯 Overview

Comprehensive testing suite for Vana's Vue 3 registration flow, covering all aspects from unit tests to end-to-end user journeys. This suite ensures >80% code coverage for critical registration components and validates accessibility, performance, and user experience requirements.

## 📋 Coverage Areas

### **1. Unit Tests (Vitest + Testing Library)**

#### **Core Composables**

- ✅ `useAuth.spec.ts` - Authentication and registration logic
- ✅ `useOnboarding.spec.ts` - Onboarding flow state management

#### **UI Components**

- ✅ `RegisterButton.spec.ts` - Button variants, states, and accessibility
- ✅ `LandingPage.spec.ts` - Hero content, CTAs, and demo interactions
- ✅ `EmailVerificationPage.spec.ts` - Email verification flow and states

### **2. Integration Tests**

- ✅ `registration-flow.spec.ts` - Complete user journey from landing to onboarding
- API integration error handling
- Store state management across components
- Router navigation flow testing

### **3. E2E Tests (Cypress)**

- ✅ `complete-registration-journey.cy.ts` - Real user workflows
- Error scenario handling
- Mobile responsive testing
- Cross-browser compatibility
- Performance validation

### **4. Accessibility Tests (axe-core)**

- ✅ `registration-accessibility.spec.ts` - WCAG 2.2 AA compliance
- Screen reader compatibility
- Keyboard navigation verification
- Color contrast validation
- High contrast mode support

### **5. Performance Tests**

- ✅ `registration-performance.spec.ts` - Core Web Vitals validation
- Load time performance
- Memory usage monitoring
- Long task detection
- Bundle size optimization

## 🚀 Quick Start

### Run All Registration Tests

```bash
npm run test:registration
```

### Run Specific Test Types

```bash
# Unit tests only
npm run test:registration:unit

# Integration tests
npm run test:registration:integration

# E2E tests
npm run test:registration:e2e

# Accessibility tests
npm run test:registration:a11y

# Performance tests
npm run test:registration:performance
```

### Watch Mode (Development)

```bash
npm run test:registration:watch
```

### CI/CD Pipeline

```bash
# Optimized for CI (parallel, no optional tests)
npm run test:registration:ci

# Quick validation (no coverage)
npm run test:registration:quick

# Full suite with reports
npm run test:registration:full
```

## 📊 Coverage Requirements

| Component Type    | Coverage Target | Current Status |
| ----------------- | --------------- | -------------- |
| Core Composables  | >85%            | ✅             |
| UI Components     | >80%            | ✅             |
| Page Components   | >80%            | ✅             |
| Integration Flows | >75%            | ✅             |

## 🏗️ Test Architecture

### **Directory Structure**

```
tests/
├── unit/                    # Unit tests (Vitest + Testing Library)
│   ├── composables/         # Composable logic tests
│   ├── components/          # Component behavior tests
│   └── pages/               # Page component tests
├── integration/             # Integration tests
├── e2e/                     # End-to-end tests (Cypress)
│   └── registration/        # Registration flow E2E tests
├── a11y/                    # Accessibility tests (axe-core)
├── performance/             # Performance tests
├── utils/                   # Testing utilities
│   └── performance-utils.ts # Performance monitoring helpers
└── scripts/                 # Test runners and utilities
    └── run-registration-tests.ts # Main test runner
```

### **Test Patterns**

#### **1. Component Testing Pattern**

```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup mocks and dependencies
  })

  describe('rendering', () => {
    it('renders with default props', () => {
      // Test basic rendering
    })
  })

  describe('user interactions', () => {
    it('handles click events', async () => {
      // Test user interactions
    })
  })

  describe('accessibility', () => {
    it('has no accessibility violations', async () => {
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
```

#### **2. Integration Testing Pattern**

```typescript
describe('Registration Flow Integration', () => {
  beforeEach(async () => {
    // Setup router, stores, and mocks
  })

  it('completes full registration flow', async () => {
    // Test complete user journey
    // 1. Landing page interaction
    // 2. Auth0 callback handling
    // 3. Email verification
    // 4. Onboarding completion
  })
})
```

#### **3. E2E Testing Pattern**

```typescript
describe('Complete Registration Journey', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/auth/register/initiate', {
      fixture: 'registration-success.json',
    }).as('initiateRegistration')
  })

  it('completes registration from landing to dashboard', () => {
    cy.visit('/')
    cy.get('[data-testid="register-button"]').click()
    cy.wait('@initiateRegistration')
    // ... continue flow
  })
})
```

## 🔧 Configuration

### **Vitest Configuration**

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        global: { branches: 80, functions: 80, lines: 80, statements: 80 },
        'src/ui/**': { branches: 85, functions: 85, lines: 85, statements: 85 },
      },
    },
  },
})
```

### **Cypress Configuration**

```typescript
// cypress.config.ts
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'tests/e2e/support/index.ts',
    specPattern: 'tests/e2e/**/*.cy.ts',
  },
})
```

## 🚨 CI/CD Integration

### **GitHub Actions Example**

```yaml
name: Registration Tests
on: [push, pull_request]

jobs:
  test-registration:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run registration tests
        run: npm run test:registration:ci

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## 📈 Performance Budgets

### **Load Time Budgets**

- Landing Page: <2 seconds
- Email Verification: <1 second
- Component Render: <100ms

### **Core Web Vitals Targets**

- **LCP** (Largest Contentful Paint): <2.5s
- **FID** (First Input Delay): <100ms
- **CLS** (Cumulative Layout Shift): <0.1
- **FCP** (First Contentful Paint): <1.8s

### **Bundle Size Limits**

- Initial Bundle: <250KB gzipped
- Registration Components: <50KB gzipped
- Async Chunks: <100KB gzipped each

## ♿ Accessibility Standards

### **WCAG 2.2 AA Compliance**

- ✅ Color contrast ratio >4.5:1
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ Focus management
- ✅ Semantic HTML structure

### **Testing Tools**

- **axe-core**: Automated accessibility testing
- **@testing-library/user-event**: User-centric interaction testing
- **vitest-axe**: Accessibility assertions in unit tests

## 🐛 Debugging Tests

### **Common Issues**

#### **1. Async Operations**

```typescript
// ❌ Bad
const button = getByRole('button')
fireEvent.click(button)
expect(mockFn).toHaveBeenCalled()

// ✅ Good
const button = getByRole('button')
await user.click(button)
await waitFor(() => {
  expect(mockFn).toHaveBeenCalled()
})
```

#### **2. Component Mocking**

```typescript
// Mock heavy components for performance
vi.mock('@/components/HeavyComponent.vue', () => ({
  default: {
    name: 'MockHeavyComponent',
    template: '<div data-testid="heavy-component">Mocked</div>',
  },
}))
```

#### **3. Router Testing**

```typescript
// Setup router with required routes
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: LandingPage },
    { path: '/auth/callback', component: CallbackPage },
  ],
})
```

### **Debug Commands**

```bash
# Run single test file
npm run test -- tests/unit/composables/useAuth.spec.ts

# Run with debug output
npm run test -- --reporter=verbose

# Run with coverage details
npm run coverage

# Debug E2E tests
npx cypress open
```

## 📝 Test Reports

### **Coverage Reports**

- **HTML**: `./coverage/index.html`
- **LCOV**: `./coverage/lcov.info`
- **JSON**: `./coverage/coverage-final.json`

### **Test Results**

- **HTML Report**: `./test-report.html`
- **JUnit XML**: `./junit.xml`
- **JSON Results**: `./test-results.json`

### **Performance Reports**

- **Lighthouse**: `./lighthouse-report.html`
- **Bundle Analysis**: `./bundle-report.html`
- **Web Vitals**: Console output during tests

## 🤝 Contributing to Tests

### **Adding New Tests**

#### **1. Unit Test**

```typescript
// tests/unit/components/NewComponent.spec.ts
import { render, screen } from '@testing-library/vue'
import NewComponent from '@/components/NewComponent.vue'

describe('NewComponent', () => {
  it('renders correctly', () => {
    render(NewComponent)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

#### **2. Integration Test**

```typescript
// tests/integration/new-flow.spec.ts
describe('New Flow Integration', () => {
  it('completes new flow', async () => {
    // Setup router and stores
    // Test complete flow
  })
})
```

#### **3. E2E Test**

```typescript
// tests/e2e/new-feature.cy.ts
describe('New Feature E2E', () => {
  it('works end-to-end', () => {
    cy.visit('/feature')
    cy.get('[data-testid="trigger"]').click()
    cy.get('[data-testid="result"]').should('be.visible')
  })
})
```

### **Best Practices**

1. **Test Behavior, Not Implementation**

   - Focus on user interactions and outcomes
   - Avoid testing internal component state
   - Use data-testid for stable selectors

2. **Keep Tests Fast**

   - Mock external dependencies
   - Use fake timers for time-based tests
   - Minimize DOM queries

3. **Make Tests Readable**

   - Use descriptive test names
   - Follow AAA pattern (Arrange, Act, Assert)
   - Group related tests with describe blocks

4. **Ensure Test Isolation**
   - Clean up after each test
   - Reset mocks and timers
   - Use fresh component instances

## 🔄 Maintenance

### **Regular Tasks**

- Update snapshots: `npm run test -- --update-snapshots`
- Check coverage gaps: `npm run coverage -- --reporter=html`
- Performance regression testing: `npm run test:registration:performance`
- Accessibility audit: `npm run test:registration:a11y`

### **Dependencies Updates**

```bash
# Update testing dependencies
npm update @testing-library/vue @testing-library/user-event vitest cypress

# Check for security issues
npm audit

# Update mocks when dependencies change
npm run test -- --clearCache
```

---

## 📞 Support

For questions about testing:

1. Check existing test examples in the codebase
2. Review testing documentation
3. Open an issue with [TEST] prefix
4. Contact the frontend testing team

**Happy Testing! 🧪**
