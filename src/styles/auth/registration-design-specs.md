# Vana Registration Flow - Visual Design Specifications

## Overview

Comprehensive design system for Vana's user registration and onboarding flow, optimized for young professionals seeking productivity solutions. The design emphasizes trust, modernity, and seamless user experience while maintaining the brand identity.

## Brand Foundation

### Primary Colors (Vana Registration)

```scss
$vana-registration-primary: #6366f1; // Indigo - Primary brand
$vana-registration-primary-light: #8b8cf5; // Light variant
$vana-registration-primary-dark: #4f46e5; // Dark variant
$vana-registration-accent: #10b981; // Success green
$vana-registration-warning: #f59e0b; // Warning amber
$vana-registration-progress: #06b6d4; // Progress cyan
```

### Typography Hierarchy

```scss
// Registration Pages
H1: 36px/28px mobile, Manrope Semibold, tight line-height
H2: 28px/24px mobile, Manrope Medium, tight line-height
H3: 24px/20px mobile, Manrope Medium, base line-height
Body: 16px/14px mobile, Manrope Regular, base line-height
UI Text: 14px, Inter Medium, base line-height
Caption: 12px, Manrope Light, base line-height
```

### Spacing System

- **Component Internal:** 16px (md), 24px (lg), 32px (xl)
- **Section Gaps:** 32px (2xl), 48px (3xl)
- **Container Padding:** 24px desktop, 16px mobile
- **Button Padding:** 12px vertical, 24px horizontal (large CTA)

### Border Radius

- **Cards:** 16px (xl)
- **Buttons:** 12px (lg)
- **Inputs:** 8px (md)
- **Progress Indicators:** 50% (circular)

## Component Specifications

### 1. RegisterButton Component

#### Base Specifications

- **Minimum Height:** 48px (touch-friendly)
- **Font Weight:** 600 (semibold)
- **Background:** Linear gradient (135deg, #6366f1 → #4f46e5)
- **Shadow:** Subtle elevation (0 1px 3px rgba(0,0,0,8%))
- **Transform on Hover:** translateY(-2px)

#### State Variations

```scss
// Default State
background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
color: #ffffff;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

// Hover State
background: linear-gradient(135deg, #5a5ae7 0%, #4338ca 100%);
transform: translateY(-2px);
box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);

// Active State
background-color: #4338ca;
transform: translateY(-1px);

// Loading State
color: transparent;
&::after {
  spinner:
    20px white border,
    2px width,
    0.8s linear infinite;
}

// Disabled State
background: #d1d5db;
color: #6b7280;
cursor: not-allowed;
```

#### Size Variants

```scss
// Small: 40px height, 12px+16px padding
// Medium: 48px height, 16px+24px padding (default)
// Large: 56px height, 20px+32px padding
```

### 2. RegisterPage Component

#### Layout Structure

- **Container:** Max-width 520px, centered
- **Card:** White background, 16px border-radius, elevated shadow
- **Gradient Background:** 135deg from #f0f0ff to #e8e8ff
- **Pattern Overlay:** Subtle radial dots for texture

#### Content Sections

```scss
// Header Section
.register-page__logo: 64px circular, center-aligned
.register-page__title: H1 typography, primary text color
.register-page__subtitle: Body text, secondary color

// Value Propositions
.register-page__value-prop: Flex layout, 24px icon + text
.register-page__value-icon: 24px, success green color
.register-page__value-text: Strong title + descriptive text

// Social Proof
.register-page__social-proof: Light background, left border accent
.register-page__testimonial: Italic text, quote styling
.register-page__testimonial-author: Bold, attribution format

// Trust Indicators
.register-page__trust-indicators: Flex, centered, security icons
Items: "256-bit encryption", "GDPR compliant", "SOC2 certified"

// Call-to-Action
.register-page__cta-button: Full-width RegisterButton (large)
.register-page__alternative: Small text, login link

// Legal Section
.register-page__terms: Small text, link styling for T&C
```

#### Responsive Behavior

```scss
// Mobile (<640px)
- Single column layout
- Reduced padding (16px vs 24px)
- Smaller logo (56px vs 64px)
- Smaller typography scales

// Tablet (640px-1024px)
- Same as desktop with adjusted spacing

// Desktop (>1024px)
- Full specifications as designed
- Generous whitespace
```

### 3. EmailVerificationPage Component

#### Status Indicators

```scss
// Pending State
.email-verification__status-icon--pending {
  background: rgba(#f59e0b, 0.1);
  color: #f59e0b;
  // Pulsing ring animation
  &::after { pulse-ring animation, 2s infinite }
}

// Verified State
.email-verification__status-icon--verified {
  background: rgba(#10b981, 0.1);
  color: #10b981;
}

// Expired/Error State
.email-verification__status-icon--expired {
  background: rgba(#ef4444, 0.1);
  color: #ef4444;
}
```

#### Progress Timeline

```scss
// Timeline Structure
.email-verification__timeline-item: Flex, icon + content
.email-verification__timeline-icon: 24px circular indicator
.email-verification__timeline-content: Title + description

// Icon States
.timeline-icon--complete: Green background, white checkmark
.timeline-icon--current: Warning color, pulsing animation
.timeline-icon--pending: Light gray, inactive state
```

#### Interactive Elements

```scss
// Resend Button
.email-verification__resend-button {
  border: 2px solid #6366f1;
  background: transparent;
  color: #6366f1;
  min-height: 40px;

  &:hover {
    background: rgba(#6366f1, 0.05);
    border-color: #4f46e5;
  }

  &:disabled {
    opacity: 0.6;
    // Show countdown timer in button text
  }
}
```

### 4. OnboardingFlow Component

#### Progress Header

```scss
// Progress Bar Structure
.onboarding-flow__progress-bar {
  position: relative;
  // Background line: light gray, 2px height
  // Active line: brand primary, animated width
  // Steps: 40px circular indicators
}

// Step States
.progress-step--pending: Light gray background
.progress-step--active: Brand primary, shadow ring
.progress-step--complete: Success green, checkmark icon
```

#### Step Layout

```scss
// Step Container
.onboarding-flow__step {
  max-width: 600px;
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: card elevation;

  // Entrance animation
  animation: stepEnter 0.4s ease-out;
}

// Step Header
.onboarding-flow__step-icon: 72px gradient circle, white icon
.onboarding-flow__step-title: H2 typography
.onboarding-flow__step-subtitle: Body text, secondary color
```

#### Form Elements

```scss
// Option Cards (Preferences Selection)
.onboarding-flow__option-card {
  border: 2px solid light gray;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease-out;

  &:hover {
    border-color: rgba(brand-primary, 0.5);
    background: rgba(brand-primary, 0.02);
  }

  &--selected {
    border-color: brand-primary;
    background: rgba(brand-primary, 0.05);
  }
}

// Time Picker Component
.onboarding-flow__time-picker {
  flex layout, bordered container;
  // "From" and "To" select dropdowns
  // Mobile: stack vertically
}
```

#### Navigation Actions

```scss
// Action Footer
.onboarding-flow__actions {
  justify-content: space-between;
  gap: 16px;
  margin-top: 32px;

  // Mobile: stack, reverse order (Next on top)
}

// Back Button
.onboarding-flow__back-button {
  color: secondary text;
  hover: primary text + light background;
}

// Next Button
.onboarding-flow__next-button {
  RegisterButton component (medium size);
  min-width: 140px;
}

// Skip Option
.onboarding-flow__skip-button {
  small text, tertiary color;
  center-aligned;
}
```

## Accessibility Specifications

### Color Contrast (WCAG 2.2 AA)

- **Primary text:** 4.5:1 minimum ratio
- **Secondary text:** 4.5:1 minimum ratio
- **Interactive elements:** 3:1 minimum ratio
- **Focus indicators:** Visible outline, 2px solid

### Keyboard Navigation

- **Tab order:** Logical, visible focus indicators
- **Skip links:** Available for complex layouts
- **Form navigation:** Enter key progression
- **Modal trapping:** Focus contained within modals

### Screen Reader Support

- **Semantic HTML:** Proper heading hierarchy
- **ARIA labels:** Complex interactions described
- **Progress announcements:** Step changes announced
- **Error states:** Clear error messaging

### Motion Preferences

```scss
@media (prefers-reduced-motion: reduce) {
  // Disable all animations and transforms
  .register-button:hover {
    transform: none;
  }
  .onboarding-flow__step {
    animation: none;
  }
  // Loading spinners remain but slower
}
```

## Dark Mode Support

### Color Adaptations

```scss
@media (prefers-color-scheme: dark) {
  // Backgrounds
  --registration-bg: #001b2e;
  --card-bg: #1e293b;

  // Text
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.8);
  --text-tertiary: rgba(255, 255, 255, 0.6);

  // Brand colors remain same (good contrast)
  --vana-registration-primary: #6366f1;

  // Borders
  --border-primary: rgba(255, 255, 255, 0.12);
  --border-secondary: rgba(255, 255, 255, 0.08);
}
```

### Component Adjustments

- **Cards:** Darker background with stronger shadows
- **Inputs:** Dark background, light borders
- **Secondary buttons:** Light border, dark background
- **Text:** Adjusted opacity levels for hierarchy

## Mobile-First Responsive Design

### Breakpoints

```scss
$mobile: 0-639px      // Single column, larger touch targets
$tablet: 640-1023px   // Adapted layouts, some columns
$desktop: 1024px+     // Full layouts, hover states
```

### Touch Targets

- **Minimum size:** 44px x 44px
- **Comfortable spacing:** 8px between interactive elements
- **Button padding:** Generous for easy tapping
- **Form fields:** Large enough for accurate input

### Layout Adaptations

- **Mobile:** Single column, stacked elements, larger typography
- **Tablet:** Two-column grids where appropriate, balanced spacing
- **Desktop:** Multi-column layouts, hover interactions, smaller relative sizes

## Performance Considerations

### Loading States

- **Button loading:** Spinner animation, disabled interaction
- **Page transitions:** Skeleton layouts, progressive content loading
- **Image optimization:** WebP format, responsive sizes
- **Animation performance:** CSS transforms, GPU acceleration

### Bundle Size

- **Component CSS:** Tree-shaken, only used styles
- **Icon fonts:** SVG sprites for registration icons
- **Image assets:** Optimized, multiple densities
- **JavaScript:** Code splitting by flow step

## Implementation Notes for Developers

### SCSS Architecture

```scss
// File structure
src/styles/auth/_auth-tokens.scss       // Extended with registration tokens
src/ui/RegisterButton/RegisterButton.scss    // Component styles
src/ui/RegisterPage/RegisterPage.scss        // Page layout
src/ui/EmailVerificationPage/EmailVerificationPage.scss
src/ui/OnboardingFlow/OnboardingFlow.scss

// Usage pattern
@use '../../../styles/tokens' as *;  // Import all design tokens
@include auth-button-base;        // Use existing mixins
```

### Vue 3 Integration

```vue
<!-- Component usage -->
<RegisterButton variant="primary" size="large" :loading="isLoading" @click="handleRegister">
  Create Your Account
</RegisterButton>

<!-- Style scoping -->
<style lang="scss" scoped>
  @use '@/styles/tokens' as *;
  // Component-specific overrides
</style>
```

### CSS Custom Properties

```css
/* Runtime theming support */
:root {
  --vana-registration-primary: #6366f1;
  --vana-registration-accent: #10b981;
  /* ... other registration tokens */
}

/* Component usage */
.register-button {
  background: var(--vana-registration-primary);
}
```

This comprehensive design system ensures consistent, accessible, and conversion-optimized user registration experience across all devices while maintaining Vana's professional brand identity.
