<!--
Welcome Step - First onboarding step
Introduces users to Vana and sets expectations
-->
<template>
  <div class="welcome-step">
    <div class="welcome-content">
      <!-- Hero Animation -->
      <div class="welcome-hero">
        <div class="hero-animation">
          <div class="floating-calendar">
            <CalendarDaysIcon class="w-16 h-16 text-blue-500" />
          </div>
          <div class="floating-sparkles">
            <SparklesIcon
              v-for="i in 3"
              :key="i"
              class="sparkle"
              :style="{
                animationDelay: `${i * 0.5}s`,
                left: `${20 + i * 25}%`,
                top: `${10 + i * 15}%`,
              }"
            />
          </div>
        </div>

        <h1 class="welcome-title">Welcome to <span class="brand-highlight">Vana</span>!</h1>

        <p class="welcome-subtitle">Let's set up your intelligent calendar in just a few steps</p>
      </div>

      <!-- Benefits Overview -->
      <div class="benefits-section">
        <h2 class="section-title">What you'll get:</h2>

        <div class="benefits-grid">
          <div
            v-for="(benefit, index) in benefits"
            :key="benefit.id"
            class="benefit-card"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="benefit-icon">
              <component :is="benefit.icon" class="w-6 h-6" />
            </div>
            <div class="benefit-content">
              <h3 class="benefit-title">{{ benefit.title }}</h3>
              <p class="benefit-description">{{ benefit.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Overview -->
      <div class="progress-overview">
        <h2 class="section-title">Setup Progress</h2>

        <div class="setup-steps">
          <div v-for="(step, index) in setupSteps" :key="step.id" class="setup-step">
            <div class="step-indicator">
              {{ index + 1 }}
            </div>
            <div class="step-content">
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-description">{{ step.description }}</p>
              <span class="step-duration">~{{ step.duration }}min</span>
            </div>
          </div>
        </div>

        <div class="total-time">
          <ClockIcon class="w-5 h-5" />
          <span>Total setup time: ~5 minutes</span>
        </div>
      </div>

      <!-- Privacy & Security -->
      <div class="privacy-section">
        <div class="privacy-badge">
          <ShieldCheckIcon class="w-6 h-6 text-green-500" />
          <div class="privacy-content">
            <h3 class="privacy-title">Your data is secure</h3>
            <p class="privacy-description">
              We use enterprise-grade encryption and never share your calendar data
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import {
    CalendarDaysIcon,
    SparklesIcon,
    ClockIcon,
    ShieldCheckIcon,
    BoltIcon,
    ChartBarIcon,
    UserGroupIcon,
  } from '@heroicons/vue/24/outline'

  interface StepData {
    welcomed?: boolean
    startedAt?: string
  }

  interface Props {
    stepData?: StepData
    isLoading?: boolean
    canProceed?: boolean
  }

  defineProps<Props>()

  const emit = defineEmits<{
    'step-complete': [data: StepData]
    'data-change': [data: StepData]
    'validation-change': [isValid: boolean]
  }>()

  // Benefits data
  const benefits = [
    {
      id: 1,
      icon: BoltIcon,
      title: 'Save 4+ hours weekly',
      description: 'Automatically optimize your schedule for maximum productivity',
    },
    {
      id: 2,
      icon: ChartBarIcon,
      title: 'AI-powered insights',
      description: 'Get intelligent suggestions to improve your time management',
    },
    {
      id: 3,
      icon: UserGroupIcon,
      title: 'Smart meeting clustering',
      description: 'Group related meetings and protect your focus time',
    },
  ]

  // Setup steps overview
  const setupSteps = [
    {
      id: 1,
      title: 'Work Preferences',
      description: 'Tell us about your work style and schedule',
      duration: 2,
    },
    {
      id: 2,
      title: 'Calendar Integration',
      description: 'Connect your existing calendars seamlessly',
      duration: 1,
    },
    {
      id: 3,
      title: 'AI Configuration',
      description: 'Customize your AI assistant preferences',
      duration: 2,
    },
  ]

  // Event handlers - unused functions removed

  // Lifecycle
  onMounted(() => {
    // Mark as ready to proceed immediately
    emit('validation-change', true)

    // Track welcome step view
    if (import.meta.env.DEV) {
      console.log('Welcome step viewed')
    }
  })
</script>

<style lang="scss" scoped>
  .welcome-step {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
  }

  .welcome-content {
    padding: 2rem;
  }

  /* Hero Section */

  .welcome-hero {
    margin-bottom: 3rem;
    position: relative;

    .hero-animation {
      position: relative;
      height: 120px;
      margin-bottom: 2rem;

      .floating-calendar {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        animation: float 3s ease-in-out infinite;
      }

      .floating-sparkles {
        position: absolute;
        width: 100%;
        height: 100%;

        .sparkle {
          position: absolute;
          width: 16px;
          height: 16px;
          color: #ffd700;
          animation: sparkle 2s ease-in-out infinite;
        }
      }
    }

    .welcome-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1a202c;
      margin-bottom: 1rem;
      line-height: 1.2;

      .brand-highlight {
        background: linear-gradient(135deg, #667eea, #764ba2);
        background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      @media (width <= 640px) {
        font-size: 2rem;
      }
    }

    .welcome-subtitle {
      font-size: 1.125rem;
      color: #718096;
      line-height: 1.6;
      max-width: 400px;
      margin: 0 auto;
    }
  }

  /* Benefits Section */

  .benefits-section {
    margin-bottom: 3rem;

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 2rem;
    }

    .benefits-grid {
      display: grid;
      gap: 1.5rem;

      @media (width >= 640px) {
        grid-template-columns: repeat(1, 1fr);
      }
    }

    .benefit-card {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem;
      background: white;
      border-radius: 1rem;
      border: 1px solid #e2e8f0;
      text-align: left;
      transition: all 0.3s ease;
      animation: slideInUp 0.6s ease forwards;
      opacity: 0%;
      transform: translateY(20px);

      &:hover {
        border-color: #667eea;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 15%);
      }

      .benefit-icon {
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }

      .benefit-content {

        .benefit-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .benefit-description {
          color: #718096;
          line-height: 1.5;
        }
      }
    }
  }

  /* Progress Overview */

  .progress-overview {
    margin-bottom: 3rem;

    .setup-steps {
      display: grid;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .setup-step {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f7fafc;
      border-radius: 0.75rem;
      text-align: left;

      .step-indicator {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        background: #e2e8f0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        color: #4a5568;
        font-size: 0.875rem;
      }

      .step-content {
        flex: 1;

        .step-title {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.25rem;
        }

        .step-description {
          color: #718096;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .step-duration {
          color: #a0aec0;
          font-size: 0.8rem;
        }
      }
    }

    .total-time {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: #667eea;
      font-weight: 500;
      font-size: 0.875rem;
    }
  }

  /* Privacy Section */

  .privacy-section {

    .privacy-badge {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f0fff4;
      border: 1px solid #9ae6b4;
      border-radius: 0.75rem;
      text-align: left;

      .privacy-content {

        .privacy-title {
          font-weight: 600;
          color: #22543d;
          margin-bottom: 0.25rem;
        }

        .privacy-description {
          color: #2f855a;
          font-size: 0.875rem;
        }
      }
    }
  }

  /* Animations */
  @keyframes float {

    0%,
    100% {
      transform: translate(-50%, -50%) translateY(0);
    }

    50% {
      transform: translate(-50%, -50%) translateY(-10px);
    }
  }

  @keyframes sparkle {

    0%,
    100% {
      opacity: 40%;
      transform: scale(0.8);
    }

    50% {
      opacity: 100%;
      transform: scale(1.2);
    }
  }

  @keyframes slideInUp {

    to {
      opacity: 100%;
      transform: translateY(0);
    }
  }

  /* Responsive Design */
  @media (width <= 640px) {

    .welcome-content {
      padding: 1rem;
    }

    .welcome-hero {
      margin-bottom: 2rem;

      .hero-animation {
        height: 80px;
      }
    }

    .benefits-section,
    .progress-overview {
      margin-bottom: 2rem;
    }

    .benefit-card {
      flex-direction: column;
      text-align: center;

      .benefit-content {
        text-align: center;
      }
    }
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {

    .welcome-title {
      color: #f7fafc;
    }

    .section-title {
      color: #e2e8f0;
    }

    .benefit-card {
      background: #2d3748;
      border-color: #4a5568;

      .benefit-title {
        color: #f7fafc;
      }

      .benefit-description {
        color: #a0aec0;
      }
    }

    .setup-step {
      background: #2d3748;

      .step-content {

        .step-title {
          color: #f7fafc;
        }
      }
    }
  }
</style>
