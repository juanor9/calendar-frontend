<script setup lang="ts">
  import { computed } from 'vue'

  // Security status type
  type SecurityLevel = 'excellent' | 'good' | 'fair' | 'poor'

  // Security metric interface
  interface SecurityMetric {
    id: string
    label: string
    description: string
    status: 'secure' | 'warning' | 'danger' | 'info'
    value?: string
    lastUpdated?: Date
    actionRequired?: boolean
    actionText?: string
  }

  // Component props interface
  interface Props {
    passwordLastChanged?: Date
    twoFactorEnabled?: boolean
    lastLoginDate?: Date
    loginAttempts?: number
    suspiciousActivity?: boolean
    sessionCount?: number
    dataDownloads?: number
    accountAge?: number
    emailVerified?: boolean
    phoneVerified?: boolean
    showActions?: boolean
    compact?: boolean
  }

  // Component emits interface
  interface Emits {
    'enable-2fa': []
    'change-password': []
    'review-sessions': []
    'view-activity': []
    'update-recovery': []
    'export-data': []
  }

  // Props with defaults
  const props = withDefaults(defineProps<Props>(), {
    passwordLastChanged: undefined,
    twoFactorEnabled: false,
    lastLoginDate: undefined,
    loginAttempts: 0,
    suspiciousActivity: false,
    sessionCount: 1,
    dataDownloads: 0,
    accountAge: 0,
    emailVerified: true,
    phoneVerified: false,
    showActions: true,
    compact: false,
  })

  // Emits definition
  const emit = defineEmits<Emits>()

  // Computed security score and metrics
  const securityScore = computed((): number => {
    let score = 0
    const maxScore = 100

    // Password strength (25 points)
    if (props.passwordLastChanged) {
      const daysSinceChange = Math.floor(
        (Date.now() - props.passwordLastChanged.getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysSinceChange < 90) {
        score += 25
      } else if (daysSinceChange < 180) {
        score += 15
      } else {
        score += 5
      }
    }

    // Two-factor authentication (30 points)
    if (props.twoFactorEnabled) {
      score += 30
    }

    // Account verification (20 points)
    if (props.emailVerified) score += 15
    if (props.phoneVerified) score += 5

    // Security hygiene (25 points)
    if (props.loginAttempts < 3) score += 10
    if (!props.suspiciousActivity) score += 10
    if (props.sessionCount <= 3) score += 5

    return Math.min(score, maxScore)
  })

  const securityLevel = computed((): SecurityLevel => {
    const score = securityScore.value

    if (score >= 85) return 'excellent'
    if (score >= 70) return 'good'
    if (score >= 50) return 'fair'
    return 'poor'
  })

  const securityColor = computed((): string => {
    switch (securityLevel.value) {
      case 'excellent':
        return 'safe'
      case 'good':
        return 'info'
      case 'fair':
        return 'warning'
      case 'poor':
        return 'danger'
      default:
        return 'info'
    }
  })

  const securityText = computed((): string => {
    switch (securityLevel.value) {
      case 'excellent':
        return 'Excellent'
      case 'good':
        return 'Good'
      case 'fair':
        return 'Fair'
      case 'poor':
        return 'Needs Attention'
      default:
        return 'Unknown'
    }
  })

  // Security metrics
  const securityMetrics = computed((): SecurityMetric[] => {
    const metrics: SecurityMetric[] = []

    // Password security
    if (props.passwordLastChanged) {
      const daysSinceChange = Math.floor(
        (Date.now() - props.passwordLastChanged.getTime()) / (1000 * 60 * 60 * 24)
      )

      metrics.push({
        id: 'password',
        label: 'Password Security',
        description: `Last changed ${daysSinceChange} days ago`,
        status: daysSinceChange < 90 ? 'secure' : daysSinceChange < 180 ? 'warning' : 'danger',
        value: daysSinceChange < 90 ? 'Recent' : daysSinceChange < 180 ? 'Aging' : 'Old',
        lastUpdated: props.passwordLastChanged,
        actionRequired: daysSinceChange > 180,
        actionText: 'Update Password',
      })
    }

    // Two-factor authentication
    metrics.push({
      id: '2fa',
      label: 'Two-Factor Authentication',
      description: props.twoFactorEnabled ? 'Protecting your account' : 'Add extra security',
      status: props.twoFactorEnabled ? 'secure' : 'warning',
      value: props.twoFactorEnabled ? 'Enabled' : 'Disabled',
      actionRequired: !props.twoFactorEnabled,
      actionText: 'Enable 2FA',
    })

    // Account verification
    const verificationStatus =
      props.emailVerified && props.phoneVerified
        ? 'secure'
        : props.emailVerified
          ? 'info'
          : 'warning'
    const verificationValue =
      props.emailVerified && props.phoneVerified
        ? 'Fully Verified'
        : props.emailVerified
          ? 'Email Only'
          : 'Not Verified'

    metrics.push({
      id: 'verification',
      label: 'Account Verification',
      description: 'Email and phone verification status',
      status: verificationStatus,
      value: verificationValue,
      actionRequired: !props.emailVerified || !props.phoneVerified,
      actionText: 'Complete Verification',
    })

    // Recent activity
    if (props.lastLoginDate) {
      const hoursAgo = Math.floor((Date.now() - props.lastLoginDate.getTime()) / (1000 * 60 * 60))

      metrics.push({
        id: 'activity',
        label: 'Recent Activity',
        description: `Last login ${hoursAgo < 24 ? hoursAgo + 'h' : Math.floor(hoursAgo / 24) + 'd'} ago`,
        status: hoursAgo > 168 ? 'warning' : 'secure', // Warning if > 1 week
        value: hoursAgo < 24 ? 'Today' : hoursAgo < 168 ? 'This Week' : 'Inactive',
        lastUpdated: props.lastLoginDate,
      })
    }

    // Suspicious activity
    if (props.suspiciousActivity || props.loginAttempts > 3) {
      metrics.push({
        id: 'threats',
        label: 'Security Alerts',
        description: 'Recent failed login attempts detected',
        status: 'danger',
        value: `${props.loginAttempts} Failed Attempts`,
        actionRequired: true,
        actionText: 'Review Activity',
      })
    }

    return metrics
  })

  const priorityActions = computed(() => {
    return securityMetrics.value.filter(metric => metric.actionRequired).slice(0, 3) // Show top 3 priority actions
  })

  // Format date helper
  const formatDate = (date?: Date): string => {
    if (!date) return 'Never'

    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`

    return date.toLocaleDateString()
  }

  // Event handlers
  const handleAction = (actionType: string): void => {
    switch (actionType) {
      case 'enable-2fa':
        emit('enable-2fa')
        break
      case 'change-password':
        emit('change-password')
        break
      case 'review-sessions':
        emit('review-sessions')
        break
      case 'view-activity':
        emit('view-activity')
        break
      case 'update-recovery':
        emit('update-recovery')
        break
      case 'export-data':
        emit('export-data')
        break
    }
  }

  // Component classes
  const cardClasses = computed(() => {
    return [
      'security-dashboard-card',
      {
        'security-dashboard-card--compact': props.compact,
      },
    ]
  })

  const scoreClasses = computed(() => {
    return [
      'security-dashboard-card__score',
      `security-dashboard-card__score--${securityColor.value}`,
    ]
  })
</script>

<template>
  <div :class="cardClasses">
    <!-- Header with Security Score -->
    <div class="security-dashboard-card__header">
      <div class="security-dashboard-card__title-section">
        <h2 class="security-dashboard-card__title">Security Dashboard</h2>
        <p v-if="!props.compact" class="security-dashboard-card__subtitle">
          Your account security status and recommendations
        </p>
      </div>

      <div :class="scoreClasses">
        <div class="security-dashboard-card__score-circle">
          <svg
            class="security-dashboard-card__score-ring"
            viewBox="0 0 42 42"
            width="80"
            height="80"
          >
            <circle
              class="security-dashboard-card__score-bg"
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
            />
            <circle
              class="security-dashboard-card__score-progress"
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              :stroke-dasharray="`${securityScore} ${100 - securityScore}`"
              stroke-dashoffset="25"
              transform="rotate(-90 21 21)"
            />
          </svg>

          <div class="security-dashboard-card__score-content">
            <span class="security-dashboard-card__score-number">
              {{ securityScore }}
            </span>
            <span class="security-dashboard-card__score-label">
              {{ securityText }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Security Metrics -->
    <div class="security-dashboard-card__metrics">
      <div
        v-for="metric in securityMetrics"
        :key="metric.id"
        class="security-dashboard-card__metric"
        :class="`security-dashboard-card__metric--${metric.status}`"
      >
        <div class="security-dashboard-card__metric-content">
          <div class="security-dashboard-card__metric-header">
            <h3 class="security-dashboard-card__metric-title">
              {{ metric.label }}
            </h3>

            <span
              class="security-dashboard-card__metric-status"
              :class="`security-dashboard-card__metric-status--${metric.status}`"
            >
              {{ metric.value }}
            </span>
          </div>

          <p v-if="!props.compact" class="security-dashboard-card__metric-description">
            {{ metric.description }}
          </p>
        </div>

        <div
          class="security-dashboard-card__metric-indicator"
          :class="`security-dashboard-card__metric-indicator--${metric.status}`"
          :aria-label="`Status: ${metric.status}`"
        />
      </div>
    </div>

    <!-- Priority Actions -->
    <div
      v-if="props.showActions && priorityActions.length > 0"
      class="security-dashboard-card__actions"
    >
      <h3 class="security-dashboard-card__actions-title">Recommended Actions</h3>

      <div class="security-dashboard-card__action-list">
        <button
          v-for="action in priorityActions"
          :key="action.id"
          class="security-dashboard-card__action-button"
          :class="`security-dashboard-card__action-button--${action.status}`"
          @click="
            handleAction(
              action.id === '2fa'
                ? 'enable-2fa'
                : action.id === 'password'
                  ? 'change-password'
                  : action.id === 'threats'
                    ? 'view-activity'
                    : 'update-recovery'
            )
          "
        >
          <span class="security-dashboard-card__action-text">
            {{ action.actionText }}
          </span>

          <span class="security-dashboard-card__action-arrow" aria-hidden="true"> → </span>
        </button>
      </div>
    </div>

    <!-- Quick Stats (Compact Mode) -->
    <div v-if="props.compact" class="security-dashboard-card__stats">
      <div class="security-dashboard-card__stat">
        <span class="security-dashboard-card__stat-label">Sessions</span>
        <span class="security-dashboard-card__stat-value">{{ props.sessionCount }}</span>
      </div>

      <div class="security-dashboard-card__stat">
        <span class="security-dashboard-card__stat-label">Last Login</span>
        <span class="security-dashboard-card__stat-value">{{
          formatDate(props.lastLoginDate)
        }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./SecurityDashboardCard.scss"></style>
