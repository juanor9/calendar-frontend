<!-- 
Landing Page Component
Main entry point for user registration with interactive demo
-->
<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              Transform Your Chaotic Calendar Into
              <span class="highlight">Productive Focus Time</span>
            </h1>

            <p class="hero-subtitle">
              AI-powered calendar optimization that saves you 4+ hours every week
            </p>

            <!-- Social Proof -->
            <div class="social-proof">
              <div class="user-count">
                <strong>{{ userCount.toLocaleString() }}</strong> professionals already saving time
              </div>
              <div class="company-logos">
                <img src="/logos/stripe.svg" alt="Stripe" />
                <img src="/logos/notion.svg" alt="Notion" />
                <img src="/logos/airbnb.svg" alt="Airbnb" />
                <img src="/logos/figma.svg" alt="Figma" />
              </div>
            </div>

            <!-- Primary CTA -->
            <div class="cta-section">
              <RegisterButton
                variant="primary"
                size="large"
                :loading="isRegistering"
                :disabled="isRegistering"
                class="hero-cta"
                @click="startRegistration"
              >
                <template #icon>
                  <CalendarIcon class="w-5 h-5" />
                </template>
                Start Organizing My Calendar
              </RegisterButton>

              <p class="cta-disclaimer">
                Free 14-day trial • No credit card required • 2-minute setup
              </p>
            </div>
          </div>

          <!-- Interactive Calendar Demo -->
          <div class="hero-demo">
            <CalendarDemoWidget
              :show-transformation="showDemo"
              :auto-play="true"
              @transformation-complete="onDemoComplete"
              @demo-restart="onDemoRestart"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Value Proposition Section -->
    <section class="value-props-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Why 12,000+ Professionals Choose Vana</h2>
          <p class="section-subtitle">Stop letting your calendar control your productivity</p>
        </div>

        <div class="value-props-grid">
          <ValuePropCard
            v-for="prop in valueProps"
            :key="prop.id"
            :icon="prop.icon"
            :title="prop.title"
            :description="prop.description"
            :stat="prop.stat"
            :features="prop.features"
          />
        </div>
      </div>
    </section>

    <!-- Features Showcase -->
    <section class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Intelligent Calendar Optimization</h2>
          <p class="section-subtitle">See how Vana transforms your daily schedule</p>
        </div>

        <div class="features-showcase">
          <FeatureShowcase
            v-for="(feature, index) in features"
            :key="feature.id"
            :feature="feature"
            :is-active="activeFeatureIndex === index"
            :index="index"
            @feature-select="setActiveFeature"
          />
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Loved by Professionals Worldwide</h2>
          <p class="section-subtitle">Join thousands who've reclaimed their time</p>
        </div>

        <TestimonialGrid :testimonials="testimonials" />

        <!-- Stats Row -->
        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-number">4.2</div>
            <div class="stat-label">Hours saved weekly</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">94%</div>
            <div class="stat-label">Satisfaction rate</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">12K+</div>
            <div class="stat-label">Active users</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">2M+</div>
            <div class="stat-label">Optimized meetings</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="final-cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to Save 4+ Hours Every Week?</h2>
          <p class="cta-subtitle">
            Join thousands of professionals who've transformed their productivity
          </p>

          <div class="cta-buttons">
            <RegisterButton
              variant="primary"
              size="large"
              :loading="isRegistering"
              :disabled="isRegistering"
              class="primary-cta"
              @click="startRegistration"
            >
              <template #icon>
                <RocketIcon class="w-5 h-5" />
              </template>
              Get Started Free
            </RegisterButton>

            <button class="secondary-cta" @click="showDemo = true">
              <PlayIcon class="w-5 h-5" />
              Watch Demo
            </button>
          </div>

          <div class="trust-signals">
            <div class="trust-item">
              <ShieldCheckIcon class="w-5 h-5" />
              <span>Enterprise-grade security</span>
            </div>
            <div class="trust-item">
              <ClockIcon class="w-5 h-5" />
              <span>Setup in under 2 minutes</span>
            </div>
            <div class="trust-item">
              <CurrencyDollarIcon class="w-5 h-5" />
              <span>14-day free trial</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useAuth } from '@/composables/useAuth'
  import {
    CalendarIcon,
    RocketLaunchIcon as RocketIcon,
    PlayIcon,
    ShieldCheckIcon,
    ClockIcon,
    CurrencyDollarIcon,
  } from '@heroicons/vue/24/outline'

  // Import components
  import RegisterButton from '@/shared/ui/RegisterButton/RegisterButton.vue'
  import CalendarDemoWidget from '@/features/landing/components/CalendarDemoWidget.vue'
  import ValuePropCard from '@/features/landing/components/ValuePropCard.vue'
  import FeatureShowcase from '@/features/landing/components/FeatureShowcase.vue'
  import TestimonialGrid from '@/features/landing/components/TestimonialGrid.vue'

  const { registerWithRedirect, isLoading: isRegistering } = useAuth()

  // Reactive state
  const showDemo = ref(false)
  const userCount = ref(12847)
  const activeFeatureIndex = ref(0)

  // Demo auto-cycle
  let demoInterval: number | null = null

  // Value propositions data
  const valueProps = ref([
    {
      id: 1,
      icon: 'clock',
      title: 'Save 4+ Hours Weekly',
      description: 'Eliminate context switching and optimize your schedule automatically',
      stat: '4.2 hrs',
      features: ['AI-powered scheduling', 'Automatic conflict resolution', 'Focus time protection'],
    },
    {
      id: 2,
      icon: 'brain',
      title: 'Smart AI Assistant',
      description: 'Learn your preferences and optimize meetings intelligently',
      stat: '94%',
      features: ['Pattern recognition', 'Preference learning', 'Intelligent suggestions'],
    },
    {
      id: 3,
      icon: 'integration',
      title: 'Seamless Integration',
      description: 'Works with Google Calendar, Outlook, and all major platforms',
      stat: '99.9%',
      features: ['Google Calendar sync', 'Microsoft Outlook support', 'Real-time updates'],
    },
  ])

  // Features showcase data
  const features = ref([
    {
      id: 1,
      title: 'Automatic Focus Time',
      description: 'AI identifies your peak productivity hours and blocks them for deep work',
      image: '/features/focus-time.png',
      benefits: [
        'Blocks 2-4 hour focused work sessions',
        'Learns your energy patterns',
        'Protects from meeting overload',
      ],
    },
    {
      id: 2,
      title: 'Smart Meeting Optimization',
      description:
        'Reduces meeting time by 30% through intelligent clustering and duration control',
      image: '/features/meeting-optimization.png',
      benefits: [
        'Clusters related meetings',
        'Suggests shorter durations',
        'Identifies unnecessary meetings',
      ],
    },
    {
      id: 3,
      title: 'Context-Aware Scheduling',
      description: 'Considers location, preparation time, and energy levels for optimal scheduling',
      image: '/features/context-scheduling.png',
      benefits: ['Travel time awareness', 'Preparation buffers', 'Energy-based scheduling'],
    },
  ])

  // Testimonials data
  const testimonials = ref([
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Product Manager',
      company: 'Stripe',
      avatar: '/avatars/sarah-chen.jpg',
      quote:
        'Vana gave me back 5 hours per week. I finally have time for strategic thinking instead of just reacting to meetings.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      role: 'Engineering Director',
      company: 'Notion',
      avatar: '/avatars/marcus-johnson.jpg',
      quote:
        'The AI learns your patterns incredibly well. After just one week, it was scheduling better than I could manually.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      role: 'Design Lead',
      company: 'Airbnb',
      avatar: '/avatars/elena-rodriguez.jpg',
      quote:
        'Game changer for creative work. The focus time protection alone is worth the entire subscription.',
      rating: 5,
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'VP of Sales',
      company: 'Figma',
      avatar: '/avatars/david-kim.jpg',
      quote: 'Reduced my meeting prep time by 40%. The context-aware scheduling is brilliant.',
      rating: 5,
    },
  ])

  /**
   * Event Handlers
   */

  const startRegistration = async () => {
    try {
      // Track analytics
      trackRegistrationStart('landing_hero')

      await registerWithRedirect('', 'landing_hero')
    } catch (error) {
      console.error('Registration failed:', error)
      // Show error toast/modal
    }
  }

  const onDemoComplete = () => {
    // Track demo completion
    trackDemoComplete()

    // Subtle CTA animation or highlight
    setTimeout(() => {
      const ctaButton = document.querySelector('.hero-cta')
      ctaButton?.classList.add('pulse-highlight')
      setTimeout(() => {
        ctaButton?.classList.remove('pulse-highlight')
      }, 2000)
    }, 500)
  }

  const onDemoRestart = () => {
    trackDemoRestart()
  }

  const setActiveFeature = (index: number) => {
    activeFeatureIndex.value = index
    trackFeatureView(features.value[index].title)
  }

  /**
   * Analytics Tracking
   */

  const trackRegistrationStart = (source: string) => {
    if (import.meta.env.DEV) {
      console.log('Registration started from:', source)
    }
    // Implement actual analytics tracking
  }

  const trackDemoComplete = () => {
    if (import.meta.env.DEV) {
      console.log('Demo completed')
    }
    // Implement actual analytics tracking
  }

  const trackDemoRestart = () => {
    if (import.meta.env.DEV) {
      console.log('Demo restarted')
    }
    // Implement actual analytics tracking
  }

  const trackFeatureView = (featureName: string) => {
    if (import.meta.env.DEV) {
      console.log('Feature viewed:', featureName)
    }
    // Implement actual analytics tracking
  }

  /**
   * Lifecycle
   */

  onMounted(() => {
    // Start demo animation after small delay
    setTimeout(() => {
      showDemo.value = true
    }, 1500)

    // Auto-cycle through features every 5 seconds
    demoInterval = window.setInterval(() => {
      activeFeatureIndex.value = (activeFeatureIndex.value + 1) % features.value.length
    }, 5000)

    // Track page view
    if (import.meta.env.DEV) {
      console.log('Landing page viewed')
    }
  })

  onUnmounted(() => {
    if (demoInterval) {
      clearInterval(demoInterval)
    }
  })

  // SEO Meta tags
  if (typeof document !== 'undefined') {
    document.title = 'Vana Calendar - Transform Your Chaotic Calendar Into Productive Focus Time'

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        "AI-powered calendar optimization that saves you 4+ hours every week. Join 12,000+ professionals who've transformed their productivity with Vana."
      )
    }
  }
</script>

<style lang="scss" scoped>
  .landing-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  /* Hero Section */

  .hero-section {
    padding: 6rem 0 8rem;
    color: white;

    .hero-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;

      @media (width <= 768px) {
        grid-template-columns: 1fr;
        gap: 3rem;
        text-align: center;
      }
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      line-height: 1.1;
      margin-bottom: 1.5rem;

      @media (width <= 768px) {
        font-size: 2.5rem;
      }

      .highlight {
        background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .hero-subtitle {
      font-size: 1.25rem;
      opacity: 90%;
      margin-bottom: 2rem;
      line-height: 1.6;
    }
  }

  .social-proof {
    margin-bottom: 2.5rem;

    .user-count {
      font-size: 0.9rem;
      margin-bottom: 1rem;
      opacity: 80%;

      strong {
        color: #ffd89b;
        font-weight: 600;
      }
    }

    .company-logos {
      display: flex;
      gap: 1.5rem;
      align-items: center;

      @media (width <= 768px) {
        justify-content: center;
      }

      img {
        height: 24px;
        opacity: 70%;
        filter: brightness(0) invert(1);
        transition: opacity 0.2s ease;

        &:hover {
          opacity: 100%;
        }
      }
    }
  }

  .cta-section {

    .hero-cta {
      margin-bottom: 1rem;

      &.pulse-highlight {
        animation: pulse-highlight 2s ease-in-out;
      }
    }

    .cta-disclaimer {
      font-size: 0.85rem;
      opacity: 70%;
    }
  }

  @keyframes pulse-highlight {

    0%,
    100% {
      box-shadow: 0 0 0 0 rgba(255, 216, 155, 40%);
    }

    50% {
      box-shadow: 0 0 0 20px rgba(255, 216, 155, 0%);
    }
  }

  /* Value Props Section */

  .value-props-section {
    padding: 6rem 0;
    background: white;
  }

  .section-header {
    text-align: center;
    margin-bottom: 4rem;

    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #1a202c;
    }

    .section-subtitle {
      font-size: 1.1rem;
      color: #718096;
    }
  }

  .value-props-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  /* Features Section */

  .features-section {
    padding: 6rem 0;
    background: #f7fafc;
  }

  .features-showcase {
    max-width: 800px;
    margin: 0 auto;
  }

  /* Testimonials Section */

  .testimonials-section {
    padding: 6rem 0;
    background: white;
  }

  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    margin-top: 4rem;

    @media (width <= 768px) {
      grid-template-columns: repeat(2, 1fr);
    }

    .stat-item {
      text-align: center;

      .stat-number {
        font-size: 2.5rem;
        font-weight: 700;
        color: #667eea;
      }

      .stat-label {
        font-size: 0.9rem;
        color: #718096;
        margin-top: 0.5rem;
      }
    }
  }

  /* Final CTA Section */

  .final-cta-section {
    padding: 6rem 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    .cta-content {
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .cta-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;

      @media (width <= 768px) {
        font-size: 2rem;
      }
    }

    .cta-subtitle {
      font-size: 1.1rem;
      opacity: 90%;
      margin-bottom: 2.5rem;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 2rem;

      @media (width <= 768px) {
        flex-direction: column;
        align-items: center;
      }

      .secondary-cta {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: rgba(255, 255, 255, 10%);
        border: 1px solid rgba(255, 255, 255, 20%);
        border-radius: 0.5rem;
        color: white;
        text-decoration: none;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(255, 255, 255, 20%);
        }
      }
    }

    .trust-signals {
      display: flex;
      gap: 2rem;
      justify-content: center;
      font-size: 0.9rem;
      opacity: 80%;

      @media (width <= 768px) {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      .trust-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    }
  }
</style>
