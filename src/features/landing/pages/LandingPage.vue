<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              Transform Your Calendar Into a
              <span class="hero-title--accent">Productivity Engine</span>
            </h1>
            <p class="hero-description">
              Join 12,000+ professionals who've reclaimed their time with AI-powered calendar
              optimization. Get 4+ hours back weekly with intelligent scheduling.
            </p>
            <div class="hero-stats">
              <div class="stat-item">
                <div class="stat-value">4 hrs</div>
                <div class="stat-label">Saved weekly</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">12k+</div>
                <div class="stat-label">Happy users</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">85%</div>
                <div class="stat-label">More focused</div>
              </div>
            </div>
          </div>

          <div class="hero-visual">
            <!-- Interactive Calendar Demo -->
            <CalendarDemoWidget :show-transformation="true" class="calendar-demo" />
          </div>
        </div>

        <div class="hero-cta">
          <RegisterButton 
            size="large" 
            width="full" 
            class="hero-cta-button"
            :loading="isLoading"
            @click="handleRegisterClick(undefined, 'hero')"
          >
            <template #iconLeft>
              <CheckCircleIcon class="w-5 h-5" />
            </template>
            Start Your Free Trial
          </RegisterButton>
          <p class="hero-cta-subtitle">No credit card required • 30-day trial • Cancel anytime</p>
        </div>
      </div>
    </section>

    <!-- Social Proof Section -->
    <section class="social-proof-section">
      <div class="container">
        <h2 class="section-title">Trusted by professionals at</h2>
        <!-- Company Logos -->
        <div class="company-logos">
          <div class="logo-grid">
            <img src="/logos/stripe.svg" alt="Stripe" class="company-logo" />
            <img src="/logos/notion.svg" alt="Notion" class="company-logo" />
            <img src="/logos/figma.svg" alt="Figma" class="company-logo" />
            <img src="/logos/airbnb.svg" alt="Airbnb" class="company-logo" />
          </div>
        </div>

        <!-- Testimonials Grid -->
        <div class="testimonials-grid">
          <div
            v-for="testimonial in testimonials"
            :key="testimonial.id"
            class="testimonial-card"
          >
            <div class="testimonial-content">
              <div class="testimonial-rating">
                <span v-for="star in 5" :key="star" class="star">★</span>
              </div>
              <blockquote class="testimonial-text">{{ testimonial.content }}</blockquote>
              <div class="testimonial-author">
                <img :src="testimonial.avatar" :alt="testimonial.name" class="author-avatar" />
                <div class="author-info">
                  <div class="author-name">{{ testimonial.name }}</div>
                  <div class="author-title">{{ testimonial.role }} at {{ testimonial.company }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">Your Calendar, But Actually Intelligent</h2>
        <p class="section-subtitle">
          Stop playing Tetris with your schedule. Let AI optimize your time so you can focus on what
          matters.
        </p>

        <!-- Features Grid -->
        <div class="features-grid">
          <div
            v-for="feature in features"
            :key="feature.id"
            class="feature-card"
          >
            <div class="feature-icon">
              <div class="icon-placeholder" :data-icon="feature.icon">{{ getFeatureIcon(feature.icon) }}</div>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
            <div class="feature-highlight">{{ feature.highlight }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to transform your productivity?</h2>
          <p class="cta-subtitle">Join thousands who've already reclaimed their time</p>
          <!-- Error Display -->
          <div v-if="errorMessage" class="error-message" role="alert">
            {{ errorMessage }}
          </div>
          
          <RegisterButton 
            size="large" 
            class="cta-button"
            :loading="isLoading"
            @click="handleRegisterClick(undefined, 'cta')"
          > 
            Get Started Free 
          </RegisterButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { RegisterButton } from '@/shared/ui'
  import { useAuth } from '@/features/authentication/composables/useAuth'
  import CalendarDemoWidget from '@/features/landing/components/CalendarDemoWidget.vue'
  import { CheckCircleIcon } from '@/shared/icons'
  
  // Use authentication
  const { registerWithRedirect, isLoading, error, isAuthenticated } = useAuth()

  // Redirect authenticated users
  if (isAuthenticated.value) {
    window.location.href = '/dashboard'
  }

  // Handle registration button clicks
  const handleRegisterClick = async (email?: string, source = 'landing') => {
    try {
      await registerWithRedirect(email, source)
    } catch (err) {
      console.error('Registration failed:', err)
    }
  }

  // Demo data
  const testimonials = ref([
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Product Manager',
      company: 'Stripe',
      avatar: '/avatars/sarah.jpg',
      content: 'Vana gave me back 5 hours a week. I actually have time for strategic thinking now.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      role: 'Engineering Lead',
      company: 'Notion',
      avatar: '/avatars/marcus.jpg',
      content: 'The AI scheduling is scary good. It knows my work patterns better than I do.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Emily Watson',
      role: 'Design Director',
      company: 'Figma',
      avatar: '/avatars/emily.jpg',
      content: 'Finally, a calendar that works with me instead of against me. Game-changer.',
      rating: 5,
    },
  ])

  const features = ref([
    {
      id: 1,
      title: 'AI Time Optimization',
      description: 'Automatically finds the best times for focused work, meetings, and breaks',
      icon: 'brain',
      highlight: '4x more focus time',
    },
    {
      id: 2,
      title: 'Smart Meeting Scheduling',
      description: 'Intelligently groups meetings and protects your most productive hours',
      icon: 'calendar',
      highlight: '60% fewer interruptions',
    },
    {
      id: 3,
      title: 'Energy-Based Planning',
      description: 'Schedules demanding tasks when you have the most energy',
      icon: 'lightning',
      highlight: '2x better performance',
    },
  ])

  // Feature icon helper
  const getFeatureIcon = (iconType: string) => {
    const icons: Record<string, string> = {
      brain: '🧠',
      calendar: '📅',
      lightning: '⚡',
    }
    return icons[iconType] || '✨'
  }

  // Error message display
  const errorMessage = computed(() => {
    if (!error.value) return null
    return error.value.userMessage || error.value.message
  })
</script>

<script lang="ts">
  export default {
    name: 'LandingPage',
  }
</script>

<style lang="scss" scoped>
  @use '../../../styles/tokens' as *;
  @use './LandingPage';
</style>
