# VANA VISUAL DESIGN SPECIFICATIONS

## Complete UI Design System for Registration Flow

### Overview

This document outlines the comprehensive visual design system for Vana's user registration flow, optimized for conversion and trust-building among young professionals (25-35). The design system builds upon completed UX research and wireframes to create a cohesive, modern, and accessible visual experience.

---

## 🎨 DESIGN FOUNDATION

### Brand Colors - Vana Registration Identity

```scss
// Primary Colors
$vana-registration-primary: #6366f1; // Indigo - main CTA color
$vana-registration-primary-50: #eef2ff; // Ultra light backgrounds
$vana-registration-primary-100: #e0e7ff; // Light backgrounds
$vana-registration-primary-500: #6366f1; // Base color
$vana-registration-primary-600: #4f46e5; // Hover states
$vana-registration-primary-700: #4338ca; // Active states

// Success & Trust Building
$vana-registration-accent: #10b981; // Green for success states
$vana-registration-accent-50: #f0fdf4; // Success backgrounds
$vana-registration-accent-100: #dcfce7; // Light success states

// Supporting Colors
$vana-registration-warning: #f59e0b; // Amber for warnings
$vana-registration-progress: #06b6d4; // Cyan for progress indicators
$vana-registration-info: #3b82f6; // Blue for information

// Neutral Palette
$vana-gray-50: #f9fafb; // Page backgrounds
$vana-gray-100: #f3f4f6; // Card backgrounds
$vana-gray-200: #e5e7eb; // Borders
$vana-gray-500: #6b7280; // Secondary text
$vana-gray-800: #1f2937; // Primary text
```

### Typography Scale

```scss
// Font Families
$font-family-primary:
  'Manrope',
  -apple-system,
  sans-serif; // UI Text
$font-family-editorial: 'Petrona', georgia, serif; // Headlines
$font-family-ui:
  'Inter',
  -apple-system,
  sans-serif; // Interface

// Responsive Scale
$font-size-xl: 48px; // Hero headlines (Desktop)
$font-size-xl-mobile: 36px; // Hero headlines (Mobile)
$font-size-h1: 36px; // Page titles
$font-size-h1-mobile: 28px;
$font-size-h2: 28px; // Section titles
$font-size-h2-mobile: 24px;
$font-size-body-lg: 18px; // Large body text
$font-size-body: 16px; // Standard body text
$font-size-ui-lg: 16px; // Large interface text
$font-size-ui: 14px; // Standard interface text
```

### Spacing System (4px Grid)

```scss
$spacing-xs: 4px; // 4px - Micro spacing
$spacing-sm: 8px; // 8px - Small spacing
$spacing-md: 16px; // 16px - Standard spacing
$spacing-lg: 24px; // 24px - Large spacing
$spacing-xl: 32px; // 32px - Extra large spacing
$spacing-2xl: 48px; // 48px - Section spacing
$spacing-3xl: 64px; // 64px - Page spacing
$spacing-4xl: 96px; // 96px - Hero spacing
```

### Border Radius & Shadows

```scss
// Border Radius
$radius-sm: 4px; // Small elements
$radius-md: 8px; // Buttons, inputs
$radius-lg: 12px; // Cards, modals
$radius-xl: 16px; // Large cards
$radius-pill: 999px; // Pills, badges

// Shadows (Subtle & Professional)
$shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08); // Cards
$shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07); // Hover states
$shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.08); // Elevated elements
$shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.08); // Modals
$shadow-button-focus: 0 0 0 3px rgba(99, 102, 241, 0.12); // Focus states
```

---

## 📱 COMPONENT SPECIFICATIONS

### 1. RegisterButton Component

**File:** `/src/ui/RegisterButton/RegisterButton.vue`

**Visual Properties:**

```scss
// Primary CTA Button
background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
color: white;
min-height: 48px; // Touch-friendly
padding: 12px 32px;
border-radius: 12px;
font-weight: 600;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

// Hover State
&:hover {
  background: linear-gradient(135deg, #5b5fef 0%, #4338ca 100%);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.15);
  transform: translateY(-2px);
}

// Loading State
&--loading::after {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
```

**Variants:**

- `primary` - Main CTA with gradient
- `secondary` - White background with primary border
- `outline` - Transparent with primary border
- `ghost` - Minimal styling for secondary actions

### 2. Landing Page Hero Section

**File:** `/src/pages/LandingPage/LandingPage.vue`

**Key Visual Features:**

- **Background:** Subtle gradient from `$vana-gray-50` to `$vana-registration-primary-50`
- **Interactive Demo:** Calendar transformation widget with before/after states
- **Trust Indicators:** Social proof with user count and testimonials
- **CTA Prominence:** Large RegisterButton with enhanced shadow and hover effects

**Hero Stats Design:**

```scss
.stat-value {
  font-size: 28px;
  color: $vana-registration-primary;
  font-weight: 700;
}

.stat-label {
  font-size: 12px;
  color: $vana-gray-500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### 3. Calendar Demo Widget

**File:** `/src/components/landing/CalendarDemoWidget.vue`

**Transformation Visual:**

- **Before State:** Fragmented schedule with stress indicators
- **After State:** Optimized blocks with focus time highlighted
- **Color Coding:**
  - Focus blocks: `$vana-registration-accent-100` (light green)
  - Meetings: `$vana-registration-primary-100` (light indigo)
  - Breaks: `$vana-gray-100` (light gray)

**Interactive Toggle:**

```scss
.demo-toggle {
  background: white;
  border: 2px solid $vana-registration-primary-200;
  border-radius: 999px; // Pill shape
  padding: 8px 24px;

  &--active {
    background: $vana-registration-primary;
    color: white;
  }
}
```

### 4. Email Verification Page

**File:** `/src/ui/EmailVerificationPage/EmailVerificationPage.vue`

**Visual States:**

- **Pending:** Pulsing animation with amber color
- **Success:** Green checkmark with celebration animation
- **Expired:** Red warning with clear resolution path
- **Resent:** Blue info state with countdown timer

**Status Icon Animation:**

```scss
.verification-icon--pending::after {
  content: '';
  position: absolute;
  border: 2px solid rgba($vana-registration-warning, 0.3);
  border-radius: 50%;
  animation: pulse-ring 2s ease-in-out infinite;
}
```

**Progress Steps Integration:**

```scss
.progress-steps {
  background: rgba(white, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
```

### 5. Onboarding Wizard

**File:** `/src/components/onboarding/OnboardingWizard.vue`

**Multi-Step Navigation:**

- **Progress Header:** Sticky progress indicator with backdrop blur
- **Step Transitions:** Smooth slide-in animations between steps
- **Action Layout:** Responsive button layout (back/continue)

**Success State Design:**

```scss
.success-icon {
  width: 80px;
  height: 80px;
  color: $vana-registration-accent;
  animation: successPulse 2s ease-in-out infinite;
}

.success-stats {
  display: flex;
  gap: 48px;

  .stat-value {
    font-size: 28px;
    color: $vana-registration-accent;
    font-weight: 700;
  }
}
```

### 6. Work Style Picker

**File:** `/src/components/onboarding/WorkStylePicker.vue`

**Interactive Cards:**

```scss
.style-card {
  background: white;
  border: 2px solid $vana-gray-200;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s ease;

  &:hover {
    border-color: $vana-registration-primary-300;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  }

  &--selected {
    border-color: $vana-registration-primary;
    background: $vana-registration-primary-50;

    .style-icon {
      background: $vana-registration-primary;
      color: white;
    }
  }
}
```

**Schedule Preview Visualization:**

```scss
.time-blocks {
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;

  .time-block--focus {
    background: $vana-registration-accent;
  }
  .time-block--meeting {
    background: $vana-registration-primary;
  }
  .time-block--break {
    background: $vana-gray-300;
  }
}
```

---

## 🎬 ANIMATIONS & MICRO-INTERACTIONS

### Transition Timing

```scss
$transition-duration-fast: 0.15s; // Quick feedback
$transition-duration-base: 0.2s; // Standard transitions
$transition-duration-slow: 0.3s; // Complex animations
$transition-easing-smooth: cubic-bezier(0.4, 0, 0.2, 1); // Material Design
```

### Key Animations

1. **Button Hover:** `translateY(-2px)` with enhanced shadow
2. **Card Selection:** Scale and border color transition
3. **Loading States:** Spinner with smooth rotation
4. **Page Transitions:** `slideInUp` for content changes
5. **Success States:** Pulsing animation for celebration

### Micro-Interaction Examples

```scss
// Button Press Feedback
.register-button:active {
  transform: translateY(-1px);
  transition-duration: 0.1s;
}

// Card Hover Preview
.style-card:hover .time-block {
  animation: shimmer 1.5s ease-in-out infinite;
}

// Focus Ring (Accessibility)
.focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
}
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints

```scss
$mobile: 320px; // Small phones
$mobile-large: 480px; // Large phones
$tablet: 768px; // Tablets
$desktop: 1024px; // Desktops
$desktop-large: 1280px; // Large screens
```

### Mobile Optimizations

1. **Touch Targets:** Minimum 48px height for all interactive elements
2. **Typography:** Scaled font sizes for readability
3. **Layout:** Single-column layouts with full-width buttons
4. **Spacing:** Reduced spacing on smaller screens
5. **Navigation:** Simplified navigation with clear back/forward actions

### Layout Patterns

```scss
// Mobile-First Grid
.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## ♿ ACCESSIBILITY SPECIFICATIONS

### Color Contrast Compliance

All color combinations meet **WCAG 2.2 AA** standards:

- **Text on backgrounds:** 4.5:1 minimum ratio
- **Interactive elements:** 3:1 minimum ratio
- **Focus indicators:** High contrast with 3px outline

### Focus Management

```scss
@mixin focus-visible {
  &:focus:not(:focus-visible) {
    outline: none;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
    border-radius: 4px;
  }
}
```

### Screen Reader Support

- **Semantic HTML:** Proper heading hierarchy and landmarks
- **ARIA Labels:** Descriptive labels for complex interactions
- **Live Regions:** Status announcements for dynamic content
- **Skip Links:** Navigation shortcuts for keyboard users

### Reduced Motion Support

```scss
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .calendar-demo,
  .success-icon {
    animation: none;
  }
}
```

---

## 🌙 DARK MODE SPECIFICATIONS

### Color Adaptations

```scss
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0f172a; // Dark navy background
    --surface: #1e293b; // Card backgrounds
    --text-primary: #f8fafc; // High contrast text
    --text-secondary: #cbd5e1; // Secondary text
    --border: #334155; // Subtle borders
  }

  // Registration colors remain consistent for brand recognition
  --vana-registration-primary: #6366f1; // Same indigo
  --vana-registration-accent: #10b981; // Same green
}
```

### Component Adaptations

- **Cards:** Dark background with subtle borders
- **Buttons:** Primary colors maintained, secondary adapted
- **Text:** High contrast white on dark backgrounds
- **Shadows:** Darker shadows with reduced opacity

---

## 🚀 PERFORMANCE OPTIMIZATIONS

### CSS Architecture

- **Component Scoping:** SCSS modules prevent style conflicts
- **Design Tokens:** Centralized variables for consistency
- **Utility Classes:** Reusable spacing and typography classes
- **Critical CSS:** Above-fold styles inlined for fast loading

### Animation Performance

```scss
// GPU Acceleration
.animated-element {
  will-change: transform;
  transform: translateZ(0);
}

// Efficient Transitions
.smooth-transition {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Image Optimization

- **SVG Icons:** Scalable vector graphics for all interface icons
- **WebP Format:** Modern image format with fallbacks
- **Lazy Loading:** Progressive loading for performance
- **Responsive Images:** Optimized sizes for different viewports

---

## 📋 IMPLEMENTATION CHECKLIST

### ✅ Completed Components

- [x] **RegisterButton** - All variants with proper states
- [x] **Landing Page** - Hero section with demo widget
- [x] **Calendar Demo Widget** - Interactive transformation
- [x] **Email Verification** - All states with animations
- [x] **Onboarding Wizard** - Multi-step with progress
- [x] **Work Style Picker** - Interactive cards with preview

### 🔄 Integration Requirements

- [ ] **Auth0 Customization** - Apply Vana branding to login forms
- [ ] **Icon Library** - Complete SVG icon set implementation
- [ ] **Animation Library** - Advanced micro-interactions
- [ ] **Testing Suite** - Visual regression tests
- [ ] **Design System Documentation** - Storybook integration

### 📊 Conversion Optimizations

1. **Trust Indicators:** Social proof and security badges
2. **Progress Feedback:** Clear step indicators and completion
3. **Error Prevention:** Inline validation and helpful messaging
4. **Mobile Experience:** Touch-optimized interface design
5. **Loading States:** Smooth transitions during API calls

---

## 🎯 SUCCESS METRICS

### Key Performance Indicators

- **Conversion Rate:** Registration completion percentage
- **Time to Complete:** Average onboarding duration
- **User Satisfaction:** Post-registration survey scores
- **Accessibility Score:** WCAG compliance percentage
- **Performance Score:** Core Web Vitals metrics

### A/B Testing Opportunities

1. **CTA Button Colors** - Test different primary colors
2. **Form Layout** - Single vs. multi-step comparison
3. **Social Proof** - Different testimonial formats
4. **Progress Indicators** - Linear vs. circular progress
5. **Mobile Layout** - Bottom navigation vs. inline actions

---

## 📞 TECHNICAL SUPPORT

### Browser Support

- **Modern Browsers:** Chrome 88+, Firefox 85+, Safari 14+
- **Legacy Support:** IE11 with polyfills and graceful degradation
- **Mobile Browsers:** iOS Safari 14+, Chrome Mobile 88+

### Implementation Notes

- **CSS Custom Properties:** Used for dynamic theming
- **PostCSS Processing:** Automatic vendor prefixing
- **SCSS Modules:** Component-scoped styling
- **TypeScript Integration:** Full type safety for Vue components

---

This comprehensive visual design specification provides everything needed to implement Vana's registration flow with pixel-perfect accuracy, optimized conversion rates, and excellent user experience across all devices and accessibility requirements.

**File Locations:**

- Landing Page: `/src/pages/LandingPage/LandingPage.vue`
- Email Verification: `/src/ui/EmailVerificationPage/EmailVerificationPage.vue`
- Onboarding Wizard: `/src/components/onboarding/OnboardingWizard.vue`
- Work Style Picker: `/src/components/onboarding/WorkStylePicker.vue`
- Calendar Demo: `/src/components/landing/CalendarDemoWidget.vue`
- Register Button: `/src/ui/RegisterButton/RegisterButton.vue`
- Design Tokens: `/src/styles/auth/_auth-tokens.scss`
