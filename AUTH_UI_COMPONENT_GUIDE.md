# VANA AUTH UI COMPONENTS GUIDE

# Implementation Guide for F001 Authentication Visual Design System

## Overview

This guide provides practical implementation instructions for the F001 authentication UI components, built on Vana's design system with specific extensions for trust-building and accessibility.

---

## QUICK START

### 1. Import Design System

```scss
// In your component SCSS files
@use '@/styles/tokens' as *;

// This includes all auth-specific tokens and components:
// - auth/auth-tokens
// - auth/auth-components
// - auth/security-dashboard
```

### 2. Basic Component Usage

```vue
<template>
  <!-- Auth Card Container -->
  <div class="auth-card auth-card--medium auth-card--security">
    <!-- Email Input with Auto-detection -->
    <div class="auth-field">
      <label class="auth-field__label">
        <span class="icon">✉️</span>
        Email registrado
        <span class="auth-field__required">*</span>
      </label>
      <div class="auth-field__input-wrapper">
        <input
          class="auth-input auth-input--medium"
          :class="{ 'auto-detected': emailDetected }"
          type="email"
          placeholder="usuario@ejemplo.com"
        />
      </div>
      <div class="auth-field__help">
        <span class="icon">ℹ️</span>
        Reconocemos tu email de sesiones anteriores
      </div>
    </div>

    <!-- Primary Action Button -->
    <button class="auth-button auth-button--primary auth-button--full-width">
      <span class="button-icon button-icon--left">📧</span>
      Enviar enlace de recuperación
      <div class="progress-text">(Llegará en 30 segundos)</div>
    </button>
  </div>
</template>
```

---

## COMPONENT REFERENCE

### AUTH CARD COMPONENT

#### Class Structure

```scss
.auth-card {
  // Size variants
  &--small      // 320px max-width, mobile padding
  &--medium     // 400px max-width, standard padding
  &--large      // 480px max-width, large padding

  // Visual variants
  &--elevated   // Enhanced shadow, backdrop blur
  &--security   // Indigo gradient background
  &--success    // Green accent background

  // Layout modifiers
  &--centered   // Auto-centered margins
  &--loading    // Loading state with skeleton
}
```

#### Usage Examples

```html
<!-- Password Recovery Card -->
<div class="auth-card auth-card--medium auth-card--security auth-card--centered">
  <!-- Content -->
</div>

<!-- Success Confirmation Card -->
<div class="auth-card auth-card--large auth-card--success">
  <!-- Content -->
</div>

<!-- Loading State -->
<div class="auth-card auth-card--medium auth-card--loading">
  <div class="auth-card__skeleton">
    <div class="skeleton-item skeleton-title"></div>
    <div class="skeleton-item skeleton-input"></div>
    <div class="skeleton-item skeleton-button"></div>
  </div>
</div>
```

### AUTH INPUT COMPONENT

#### Class Structure

```scss
.auth-field {
  &__label        // Form label with icon support
  &__required     // Required field indicator (*)
  &__input-wrapper // Container for input and suffix elements
  &__help         // Helper text container
  &__help--error  // Error state styling
}

.auth-input {
  // Size variants
  &--small        // 40px height, compact padding
  &--medium       // 56px height, standard padding
  &--large        // 64px height, spacious padding

  // State modifiers
  &--error        // Error border and focus state
  &--success      // Success border and background
  &--disabled     // Disabled appearance
  &.auto-detected // Email auto-detection state
}
```

#### Usage Examples

```html
<!-- Standard Email Input -->
<div class="auth-field">
  <label class="auth-field__label" for="email">
    <span class="icon">✉️</span>
    Email
    <span class="auth-field__required">*</span>
  </label>
  <div class="auth-field__input-wrapper">
    <input
      id="email"
      class="auth-input auth-input--medium"
      type="email"
      placeholder="tu@email.com"
      required
    />
  </div>
  <div class="auth-field__help">El email que usaste para registrarte</div>
</div>

<!-- Password Input with Strength -->
<div class="auth-field">
  <label class="auth-field__label" for="password">
    <span class="icon">🔒</span>
    Nueva contraseña
  </label>
  <div class="auth-field__input-wrapper">
    <input id="password" class="auth-input auth-input--medium" type="password" />
    <button class="password-toggle" type="button" aria-label="Mostrar contraseña">👁️</button>
  </div>

  <!-- Password Strength Indicator -->
  <div class="password-strength">
    <div class="strength-bar">
      <div class="strength-fill strength-fill--good"></div>
    </div>
    <div class="strength-label strong">Fuerte</div>
    <div class="requirements">
      <div class="requirement">
        <span class="check-icon met">✓</span>
        8+ caracteres
      </div>
      <div class="requirement">
        <span class="check-icon met">✓</span>
        Mayúscula
      </div>
      <div class="requirement">
        <span class="check-icon met">✓</span>
        Número
      </div>
      <div class="requirement">
        <span class="check-icon">○</span>
        Símbolo
      </div>
    </div>
  </div>
</div>

<!-- Error State -->
<div class="auth-field">
  <label class="auth-field__label" for="email-error">Email</label>
  <div class="auth-field__input-wrapper">
    <input
      id="email-error"
      class="auth-input auth-input--medium auth-input--error"
      type="email"
      aria-invalid="true"
    />
  </div>
  <div class="auth-field__help auth-field__help--error" role="alert">
    <span class="icon">⚠️</span>
    Por favor ingresa un email válido
  </div>
</div>
```

### AUTH BUTTON COMPONENT

#### Class Structure

```scss
.auth-button {
  // Style variants
  &--primary      // Gradient background, white text
  &--secondary    // White background, colored border
  &--ghost        // Transparent background
  &--outline      // Transparent background, colored border

  // Size variants
  &--small        // 32px height, compact padding
  &--medium       // 48px height, standard padding
  &--large        // 56px height, spacious padding

  // Width variants
  &--full-width   // 100% width

  // State modifiers
  &--loading      // Loading spinner, transparent text
  &:disabled      // Disabled appearance
}
```

#### Usage Examples

```html
<!-- Primary Action Button -->
<button class="auth-button auth-button--primary auth-button--full-width">
  <span class="button-icon button-icon--left">📧</span>
  Enviar enlace de recuperación
  <div class="progress-text">(30 segundos)</div>
</button>

<!-- Secondary Button -->
<button class="auth-button auth-button--secondary auth-button--medium">
  <span class="button-icon button-icon--left">🔄</span>
  Reenviar email
</button>

<!-- Ghost Button -->
<button class="auth-button auth-button--ghost auth-button--small">← Volver al login</button>

<!-- Loading State -->
<button class="auth-button auth-button--primary auth-button--loading" disabled>
  Enviando...
  <!-- Spinner appears automatically -->
</button>

<!-- Button Group -->
<div class="auth-button-group">
  <button class="auth-button auth-button--primary">Aceptar</button>
  <button class="auth-button auth-button--secondary">Cancelar</button>
</div>
```

### STATUS INDICATORS

#### Usage Examples

```html
<!-- Success Status -->
<div class="auth-status auth-status--success">
  <span class="status-icon">✅</span>
  Email de recuperación enviado exitosamente
</div>

<!-- Warning Status -->
<div class="auth-status auth-status--warning">
  <span class="status-icon">⚠️</span>
  El enlace expira en 14 minutos
</div>

<!-- Error Status -->
<div class="auth-status auth-status--error">
  <span class="status-icon">❌</span>
  No encontramos una cuenta con ese email
</div>

<!-- Info Status -->
<div class="auth-status auth-status--info">
  <span class="status-icon">ℹ️</span>
  Revisa tu carpeta de spam si no encuentras el email
</div>
```

### VERIFICATION STATUS CARD

#### Usage Examples

```html
<!-- Email Sent Confirmation -->
<div class="auth-verification-status success">
  <div class="status-icon">✅</div>
  <h2>Email enviado</h2>
  <p>Revisa tu bandeja de entrada</p>

  <div class="countdown-timer">
    <span class="timer-icon">⏱️</span>
    El enlace expira en: <strong>14:47</strong>
  </div>

  <div class="verification-actions">
    <button class="auth-button auth-button--secondary">
      🔄 Reenviar email
      <div class="progress-text">(disponible en 27 segundos)</div>
    </button>
  </div>
</div>

<!-- Pending Verification -->
<div class="auth-verification-status pending">
  <div class="status-icon">📧</div>
  <h2>Verifica tu email</h2>
  <p>Haz clic en el enlace que te enviamos</p>

  <div class="verification-help">
    <h4>¿No recibiste el email?</h4>
    <ul>
      <li>• Revisa tu carpeta de spam</li>
      <li>• Asegúrate que el email es correcto</li>
      <li>• Espera 30 segundos más</li>
    </ul>
  </div>
</div>
```

---

## SECURITY DASHBOARD COMPONENTS

### SECURITY SCORE CARD

#### Usage Example

```html
<div class="security-score-card">
  <div class="score-header">
    <h3 class="title">Puntuación de Seguridad</h3>
    <button class="info-icon" aria-label="Más información">ℹ️</button>
  </div>

  <div class="score-display">
    <div class="score-circle">
      <svg viewBox="0 0 120 120">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#6366f1" />
            <stop offset="100%" stop-color="#10b981" />
          </linearGradient>
        </defs>
        <circle class="background" cx="60" cy="60" r="45" />
        <circle
          class="progress"
          cx="60"
          cy="60"
          r="45"
          stroke-dasharray="226 283"
          stroke-dashoffset="0"
        />
      </svg>
      <div class="score-number">85</div>
      <div class="score-label">PUNTOS</div>
    </div>

    <div class="score-status excellent">Excelente seguridad</div>
    <div class="score-description">
      Tu cuenta está bien protegida con autenticación de dos factores activada
    </div>
  </div>

  <div class="improvement-hint">
    <div class="hint-icon">💡</div>
    <div class="hint-text">Activa las notificaciones de seguridad para obtener +5 puntos</div>
    <div class="hint-action">
      <button class="action-button">Activar ahora</button>
    </div>
  </div>
</div>
```

### ACTIVE SESSIONS LIST

#### Usage Example

```html
<div class="sessions-list">
  <!-- Current Session -->
  <div class="session-item current-session">
    <div class="device-icon desktop">💻</div>
    <div class="session-info">
      <div class="session-location">
        <span class="location-flag">🇲🇽</span>
        Ciudad de México, México
      </div>
      <div class="session-details">
        <div class="detail-item">
          <span class="detail-icon">🌐</span>
          Chrome en Windows
        </div>
        <div class="detail-item">
          <span class="detail-icon">📍</span>
          IP: 189.149.xxx.xxx
        </div>
      </div>
      <div class="last-activity recent">Activo ahora</div>
    </div>
    <div class="session-actions">
      <!-- Current session - no revoke button -->
    </div>
  </div>

  <!-- Other Session -->
  <div class="session-item">
    <div class="device-icon mobile">📱</div>
    <div class="session-info">
      <div class="session-location">
        <span class="location-flag">🇲🇽</span>
        Guadalajara, México
      </div>
      <div class="session-details">
        <div class="detail-item">
          <span class="detail-icon">🌐</span>
          Safari en iPhone
        </div>
        <div class="detail-item">
          <span class="detail-icon">⏰</span>
          Hace 2 horas
        </div>
      </div>
      <div class="last-activity">Última actividad: hace 2 horas</div>
    </div>
    <div class="session-actions">
      <button class="revoke-button">Cerrar sesión</button>
    </div>
  </div>
</div>
```

### SECURITY METRICS GRID

#### Usage Example

```html
<div class="security-metrics">
  <div class="metric-card positive">
    <div class="metric-icon">🛡️</div>
    <div class="metric-value">100%</div>
    <div class="metric-label">Protección</div>
  </div>

  <div class="metric-card positive">
    <div class="metric-icon">🔐</div>
    <div class="metric-value">2FA</div>
    <div class="metric-label">Autenticación</div>
  </div>

  <div class="metric-card warning">
    <div class="metric-icon">📱</div>
    <div class="metric-value">3</div>
    <div class="metric-label">Dispositivos</div>
  </div>

  <div class="metric-card positive">
    <div class="metric-icon">🔄</div>
    <div class="metric-value">5d</div>
    <div class="metric-label">Última act.</div>
  </div>
</div>
```

### TWO-FACTOR AUTHENTICATION SETUP

#### Usage Example

```html
<div class="two-factor-setup">
  <div class="setup-steps">
    <!-- Step 1: Completed -->
    <div class="step completed">
      <div class="step-number">✓</div>
      <div class="step-content">
        <div class="step-title">Descargar aplicación</div>
        <div class="step-description">Google Authenticator o Authy instalado</div>
      </div>
    </div>

    <!-- Step 2: Current -->
    <div class="step current">
      <div class="step-number">2</div>
      <div class="step-content">
        <div class="step-title">Escanear código QR</div>
        <div class="step-description">Usa tu app de autenticación para escanear este código</div>

        <div class="qr-code-container">
          <div class="qr-code">[QR Code would render here]</div>
          <div class="manual-code">
            ¿No puedes escanear? Ingresa manualmente:
            <code>JBSWY3DPEHPK3PXP</code>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 3: Pending -->
    <div class="step">
      <div class="step-number">3</div>
      <div class="step-content">
        <div class="step-title">Verificar código</div>
        <div class="step-description">Ingresa el código de 6 dígitos de tu app</div>
      </div>
    </div>
  </div>

  <!-- Verification Input -->
  <div class="verification-input">
    <input type="text" maxlength="1" pattern="[0-9]" />
    <input type="text" maxlength="1" pattern="[0-9]" />
    <input type="text" maxlength="1" pattern="[0-9]" />
    <input type="text" maxlength="1" pattern="[0-9]" />
    <input type="text" maxlength="1" pattern="[0-9]" />
    <input type="text" maxlength="1" pattern="[0-9]" />
  </div>

  <button class="auth-button auth-button--primary auth-button--full-width" disabled>
    Verificar y activar 2FA
  </button>
</div>
```

---

## RESPONSIVE BEHAVIOR

### Mobile-First Classes

```scss
// Components automatically adapt, but you can override:
@include mobile-only {
  .auth-card {
    margin: 16px;
    padding: 20px;
  }

  .auth-button {
    width: 100%;
    min-height: 48px; // Touch-friendly
  }
}

@include tablet-up {
  .auth-layout {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 40px;
  }
}

@include laptop-up {
  .auth-layout {
    grid-template-columns: 1fr 480px;
    gap: 80px;
  }
}
```

### Touch Optimization

```scss
// All interactive elements meet 48px minimum
.auth-button,
.auth-input,
.clickable-element {
  min-height: 48px;
  touch-action: manipulation; // Prevents zoom on double-tap
}
```

---

## ACCESSIBILITY IMPLEMENTATION

### Screen Reader Support

```html
<!-- Always include proper ARIA labels -->
<div class="auth-field" role="group" aria-labelledby="email-label">
  <label id="email-label" for="email-input">Email</label>
  <input
    id="email-input"
    aria-describedby="email-help email-error"
    aria-invalid="false"
    aria-required="true"
  />
  <div id="email-help" class="auth-field__help">El email que usaste para registrarte</div>
  <div id="email-error" role="alert" aria-live="polite">
    <!-- Error messages appear here -->
  </div>
</div>

<!-- Progress indicators -->
<div
  class="progress-steps"
  role="progressbar"
  aria-valuenow="2"
  aria-valuemin="1"
  aria-valuemax="3"
  aria-label="Paso 2 de 3: Verificación de email"
></div>

<!-- Status announcements -->
<div role="status" aria-live="polite" class="sr-only">
  Email de recuperación enviado exitosamente
</div>
```

### Keyboard Navigation

```scss
// Focus indicators are built-in
.auth-button:focus-visible,
.auth-input:focus-visible {
  outline: 3px solid var(--auth-trust-primary);
  outline-offset: 2px;
}

// Skip links for complex flows
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--auth-trust-primary);
  color: white;
  padding: 8px;
  text-decoration: none;

  &:focus {
    top: 6px;
  }
}
```

---

## PERFORMANCE OPTIMIZATIONS

### Loading States

```html
<!-- Use skeleton screens for better perceived performance -->
<div class="auth-card auth-card--loading">
  <div class="auth-skeleton">
    <div class="skeleton-item skeleton-title"></div>
    <div class="skeleton-item skeleton-input"></div>
    <div class="skeleton-item skeleton-input"></div>
    <div class="skeleton-item skeleton-button"></div>
  </div>
</div>
```

### Image Optimization

```html
<!-- Progressive image loading -->
<img
  class="auth-illustration loading"
  src="low-quality.jpg"
  data-src="high-quality.webp"
  alt="Security illustration"
  onload="this.classList.add('loaded')"
/>

<!-- Avatar fallbacks -->
<div class="user-avatar" data-initials="JD">
  <img src="avatar.jpg" alt="Juan Díaz" onerror="this.style.display='none'" />
</div>
```

---

## DARK MODE SUPPORT

### Automatic Dark Mode

```scss
// Components automatically adapt to dark mode
@media (prefers-color-scheme: dark) {
  .auth-card {
    background: linear-gradient(135deg, #{$vana-gray-800}, #{$vana-gray-900});
    border-color: rgba(255, 255, 255, 0.1);
  }
}
```

### Manual Dark Mode Toggle

```html
<html data-theme="dark">
  <!-- All components will use dark mode styles -->
</html>
```

```scss
:root[data-theme='dark'] {
  --auth-bg-primary: #{$vana-gray-900};
  --auth-text-primary: white;
  // Other dark mode variables
}
```

---

## IMPLEMENTATION CHECKLIST

### Before Starting

- [ ] Import design system tokens
- [ ] Review existing component patterns
- [ ] Test with screen readers
- [ ] Verify color contrast ratios
- [ ] Check mobile responsiveness

### During Development

- [ ] Use semantic HTML elements
- [ ] Include proper ARIA labels
- [ ] Test keyboard navigation
- [ ] Implement loading states
- [ ] Add error boundaries

### Before Deploy

- [ ] Run accessibility audit
- [ ] Test on mobile devices
- [ ] Verify dark mode support
- [ ] Check performance metrics
- [ ] Validate with target users

---

## TROUBLESHOOTING

### Common Issues

#### Icons not displaying

```scss
// Ensure you're using the icon system properly
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
}
```

#### Button not touch-friendly

```scss
// Ensure minimum 48px touch target
.auth-button {
  min-height: 48px;
  min-width: 48px;
}
```

#### Focus indicators not visible

```scss
// Always include focus-visible
.interactive-element:focus-visible {
  outline: 3px solid var(--auth-trust-primary);
  outline-offset: 2px;
}
```

#### Colors not meeting contrast requirements

```scss
// Use verified color combinations
.text-on-background {
  color: var(--auth-trust-primary-900); // 8.2:1 contrast
  background: white;
}
```

---

## SUPPORT

For questions about implementation:

1. Check existing component examples in `/src/ui/`
2. Review Storybook stories for usage patterns
3. Test with accessibility tools (axe-core)
4. Validate with design specifications

Remember: These components prioritize accessibility, performance, and trust-building to support Vana's goal of helping users save 4 hours per week through seamless, secure access to their productivity tools.
