# VANA AUTH DESIGN SPECIFICATIONS

## Sistema de diseño visual completo para componentes de autenticación

### OVERVIEW

Este documento define las especificaciones visuales completas para todos los componentes de autenticación de Vana Calendar, siguiendo los principios de diseño establecidos y las mejores prácticas de UI/UX.

---

## 1. COLOR SYSTEM ESPECÍFICO AUTH

### Primary Auth Colors

```scss
// Login/Auth Actions
Primary: #4fa5d8 (Vana Brand Blue)
Primary Hover: #3d8bb5 (8% darker)
Primary Active: #2f7299 (12% darker)
Primary Focus: rgba(79, 165, 216, 0.2) (20% opacity)

// Secondary Actions
Secondary: #ffecb3 (Accent Happy)
Secondary Hover: #e8d4a0 (8% darker)
Secondary Active: #d4c088 (12% darker)
```

### State Colors

```scss
// Success States
Success: #22c55e
Success Light: #4ade80
Success Background: #f0fdf4

// Warning States (Token expiry, etc.)
Warning: #f59e0b
Warning Light: #fbbf24
Warning Background: #fffbeb

// Error States
Error: #ef4444
Error Light: #f87171
Error Background: #fef2f2

// Loading States
Loading: #4fa5d8 (Vana Primary)
Loading Light: #6bb8e0
Loading Background: rgba(79, 165, 216, 0.05)
```

### Avatar & Profile Colors

```scss
// Avatar System
Avatar Background: #4fa5d8 (Vana Primary)
Avatar Fallback: #94a3b8 (Neutral gray)
Avatar Border: #ffffff

// Status Indicators
Online: #22c55e (Green pulse effect)
Away: #f59e0b (Amber)
Busy: #ef4444 (Red)
Offline: #6b7280 (Gray)
```

---

## 2. TYPOGRAPHY SPECIFICATIONS

### Auth Component Typography

```scss
// Page Titles (LoginPage, etc.)
Auth Title: Petrona, 24px, Bold (700), -0.02em letter-spacing
Auth Subtitle: Inter, 16px, Regular (400), 1.5 line-height

// Button Text
Button Large: Inter, 16px, Semibold (600), 1.25 line-height
Button Medium: Inter, 14px, Medium (500), 1.25 line-height
Button Small: Inter, 12px, Regular (400), 1.25 line-height

// User Profile Text
User Name: Inter, 14px, Semibold (600), 1.3 line-height
User Email: Inter, 12px, Regular (400), 1.2 line-height
User Role: Inter, 12px, Medium (500), 1.2 line-height

// Dropdown Items
Dropdown Item: Inter, 14px, Regular (400), 1.4 line-height
Dropdown Header: Inter, 14px, Semibold (600), 1.4 line-height

// Messages & Feedback
Message Text: Inter, 14px, Medium (500), 1.4 line-height
Helper Text: Inter, 12px, Regular (400), 1.5 line-height
Legal Text: Inter, 11px, Regular (400), 1.5 line-height
```

---

## 3. COMPONENT SPECIFICATIONS

### 3.1 LoginButton Component

#### Variants & States

```scss
// Primary Variant
Background: linear-gradient(135deg, #4fa5d8 0%, #3d8bb5 100%)
Text: #ffffff
Height: 48px (large), 40px (medium), 32px (small)
Padding: 0 24px (large), 0 16px (medium), 0 12px (small)
Border Radius: 8px
Box Shadow: 0 1px 3px rgba(29, 29, 31, 0.08)

// Hover State
Background: linear-gradient(135deg, #3d8bb5 0%, #2f7299 100%)
Transform: translateY(-1px)
Box Shadow: 0 4px 12px rgba(79, 165, 216, 0.15)

// Active State
Transform: translateY(0)
Background: linear-gradient(135deg, #2f7299 0%, #1e5f7d 100%)

// Loading State
Color: transparent
Spinner: 16px diameter, 2px width, white color
Animation: 0.8s linear infinite spin

// Error State
Background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%)
Border: 1px solid #ef4444
```

#### Micro-interactions

- Hover: Subtle lift with shadow enhancement (150ms ease-out)
- Active: Quick press down (75ms ease-in)
- Loading: Smooth spinner with text fade (200ms)
- Focus: 2px outline with brand color, 2px offset

### 3.2 UserProfile Component

#### Avatar Specifications

```scss
// Size Variants
Small: 32px × 32px
Medium: 40px × 40px (default)
Large: 48px × 48px

// Visual Properties
Border: 2px solid #ffffff
Border Radius: 50%
Box Shadow: 0 2px 8px rgba(29, 29, 31, 0.08)
Background: linear-gradient(135deg, #4fa5d8 0%, #3d8bb5 100%)

// Hover Effect
Transform: scale(1.05)
Box Shadow: 0 4px 16px rgba(29, 29, 31, 0.12)
Transition: 150ms ease-out
```

#### Status Indicator

```scss
// Dimensions
Small Avatar: 8px diameter
Medium Avatar: 10px diameter
Large Avatar: 12px diameter

// Position
Bottom: -2px
Right: -2px
Border: 2px solid #ffffff

// Online State
Background: #22c55e
Box Shadow: 0 0 0 2px rgba(34, 197, 94, 0.3)
Animation: Pulse effect (2s ease-in-out infinite)

// Other States
Away: #f59e0b with subtle glow
Busy: #ef4444 with subtle glow
Offline: #6b7280 (no glow)
```

#### Dropdown Menu

```scss
// Container
Min Width: 240px
Max Width: 320px
Background: rgba(255, 255, 255, 0.95)
Backdrop Filter: blur(12px)
Border: 1px solid rgba(29, 29, 31, 0.12)
Border Radius: 12px
Box Shadow: 0 10px 25px rgba(29, 29, 31, 0.08), 0 4px 10px rgba(29, 29, 31, 0.04)

// Header Section
Padding: 16px
Background: linear-gradient(135deg, rgba(79, 165, 216, 0.03) 0%, rgba(79, 165, 216, 0.08) 100%)
Border Bottom: 1px solid rgba(29, 29, 31, 0.08)

// Menu Items
Height: 44px (touch-friendly)
Padding: 12px 16px
Gap: 12px between icon and text
Hover Background: rgba(79, 165, 216, 0.05)
Icon Size: 18px × 18px
```

### 3.3 LoginPage Layout

#### Container Specifications

```scss
// Main Container
Max Width: 480px
Background: rgba(255, 255, 255, 0.95)
Backdrop Filter: blur(20px)
Border: 1px solid rgba(255, 255, 255, 0.2)
Border Radius: 16px
Padding: 32px
Box Shadow: 0 25px 50px rgba(29, 29, 31, 0.1)

// Responsive Behavior
Mobile (≤768px): Full width with 16px margin, 24px padding
Tablet (769px-1024px): Centered with max 90vw width
Desktop (≥1025px): Fixed 480px width
```

#### Background System

```scss
// Main Gradient
Background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)

// Decorative Shapes
Shape 1: 400px circle, blue radial gradient, top-right, blur(80px)
Shape 2: 300px circle, yellow radial gradient, bottom-left, blur(80px)
Shape 3: 250px circle, peach radial gradient, center-left, blur(80px)
Animation: Slow float effect (8s ease-in-out infinite)
```

#### Content Sections

```scss
// Header Section
Logo: 72px × 72px, border-radius 8px, hover scale(1.05)
Title: 24px Petrona Bold, gradient text effect
Subtitle: 16px Inter Regular, max-width 320px, centered

// Form Section
Gap: 16px between elements
Message padding: 16px with left border accent
Feature list: Grid layout with 12px gaps

// Footer Section
Border top: 1px solid rgba(29, 29, 31, 0.06)
Padding top: 12px
Legal links: Underline on hover with brand color
```

---

## 4. ANIMATION & TRANSITIONS

### Timing & Easing

```scss
// Standard Timings
Fast: 150ms ease-out (micro-interactions)
Base: 200ms ease-in-out (state changes)
Slow: 300ms ease-in-out (large movements)

// Custom Easings
Smooth: cubic-bezier(0.4, 0, 0.2, 1)
Bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### Specific Animations

```scss
// Button Interactions
Hover Lift: translateY(-1px) + shadow enhancement
Active Press: translateY(0) + scale(0.98)
Loading Spin: 360deg rotation, 0.8s linear infinite

// Avatar Effects
Hover Scale: scale(1.05), 150ms ease-out
Status Pulse: glow expansion, 2s ease-in-out infinite

// Dropdown Entrance
Slide In: translateY(-8px) + scale(0.95) to scale(1)
Duration: 200ms ease-out

// Page Entrance
Card Slide: translateY(32px) + scale(0.95) to scale(1)
Duration: 600ms ease-out with stagger
```

---

## 5. RESPONSIVE SPECIFICATIONS

### Breakpoints

```scss
Mobile: 320px - 768px
Tablet: 769px - 1024px
Desktop: 1025px - 1440px
Large Desktop: 1441px+
```

### Mobile Adaptations

```scss
// Touch Targets
Minimum: 44px height for all interactive elements
Button padding increased: 0 16px minimum
Dropdown full-width on mobile with 16px margins

// Typography Scaling
Page titles: Reduced by 4px on mobile
Button text: Minimum 14px for readability
Helper text: Minimum 12px with increased line-height

// Layout Changes
LoginPage: Stack layout, reduced padding
UserProfile: Hide text labels, show only avatar
Dropdown: Full-width with simplified layout
```

---

## 6. ACCESSIBILITY SPECIFICATIONS

### Color Contrast

```scss
// WCAG 2.2 AA Compliance
Text on background: Minimum 4.5:1 ratio
Large text: Minimum 3:1 ratio
Interactive elements: Minimum 3:1 ratio for non-text

// High Contrast Mode
Borders: Minimum 2px width
Focus indicators: 2px solid outline, 2px offset
Background: Solid colors instead of gradients
```

### Focus Management

```scss
// Focus Indicators
Outline: 2px solid brand color
Offset: 2px for clear separation
Border Radius: 2px for clean appearance
Transition: 150ms ease-out for smooth appearance

// Focus Flow
Login flow: Logo → Login button → Legal links
Dropdown: Trigger → Menu items → Close on escape
Modal dialogs: Trap focus within modal
```

### Screen Reader Support

```scss
// Semantic Structure
Headings: Proper h1-h6 hierarchy
Landmarks: main, navigation, complementary
Labels: aria-label for icon buttons
States: aria-expanded, aria-pressed for interactive elements

// Live Regions
Messages: role="alert" with aria-live="polite"
Loading states: aria-busy="true"
Status changes: aria-live="polite" announcements
```

---

## 7. DARK MODE SPECIFICATIONS

### Color Adaptations

```scss
// Background Colors
Main Background: #001b2e (Vana Dark Surface)
Card Background: #1e293b (Elevated Surface)
Dropdown Background: #0f172a (Deep Background)

// Text Colors
Primary Text: #ffffff
Secondary Text: rgba(255, 255, 255, 0.7)
Tertiary Text: rgba(255, 255, 255, 0.6)

// Interactive Elements
Brand Primary: #6bb8e0 (Lighter for contrast)
Border Colors: rgba(255, 255, 255, 0.12)
Hover States: rgba(107, 184, 224, 0.1)
```

### Component Adaptations

```scss
// Buttons maintain brand identity
Primary buttons: Keep brand gradient with enhanced contrast
Secondary buttons: Transparent with light borders
Focus states: Lighter brand color for visibility

// Avatar & Profile
Status indicators: Brighter colors for visibility
Dropdown shadows: Deeper, more pronounced
Background blur: Enhanced for glass effect
```

---

## 8. IMPLEMENTATION GUIDELINES

### CSS Architecture

```scss
// BEM Methodology
.component {
}
.component__element {
}
.component--modifier {
}
.component__element--modifier {
}

// SCSS Structure
@import 'auth/auth-tokens';
@include auth-button-base;
@include auth-avatar('md');
@include auth-dropdown-base;
```

### Performance Considerations

```scss
// Optimizations
will-change: transform (for animated elements)
contain: layout style (for isolated components)
transform: translateZ(0) (for GPU acceleration)
Avoid expensive properties in animations (box-shadow, border-radius)
```

### Browser Support

```scss
// Fallbacks
backdrop-filter: Fallback to solid background
Custom properties: Fallback values provided
Grid layouts: Flexbox fallbacks for older browsers
Focus-visible: :focus fallback for unsupported browsers
```

---

## 9. TESTING SPECIFICATIONS

### Visual Regression Tests

- All component states across breakpoints
- Dark/light mode variations
- High contrast mode compatibility
- Focus state visibility

### Accessibility Tests

- Keyboard navigation flow
- Screen reader compatibility
- Color contrast validation
- Touch target size verification

### Cross-browser Testing

- Chrome/Edge (Chromium)
- Firefox
- Safari (WebKit)
- Mobile browsers (iOS Safari, Android Chrome)

---

## 10. MAINTENANCE & UPDATES

### Design Token Updates

- All colors defined in `_auth-tokens.scss`
- Typography scales in design system
- Spacing system based on 4px grid
- Regular audit of contrast ratios

### Component Evolution

- Version control for design changes
- Backward compatibility considerations
- Performance impact assessment
- Accessibility compliance verification

---

This specification ensures consistent, accessible, and professionally designed auth components that align with Vana's brand identity while providing excellent user experience across all devices and contexts.
