<!--
Authentication Callback Page
Handles Auth0 callback after login/registration
-->
<template>
  <div class="auth-callback-page">
    <div class="callback-container">
      <div class="callback-content">
        <!-- Loading Animation -->
        <div class="loading-animation">
          <div class="spinner">
            <div class="spinner-ring"></div>
            <div class="spinner-center">
              <CalendarDaysIcon class="w-12 h-12 text-blue-500" />
            </div>
          </div>
        </div>
        
        <!-- Status Message -->
        <h1 class="callback-title">{{ statusTitle }}</h1>
        <p class="callback-message">{{ statusMessage }}</p>
        
        <!-- Progress Dots -->
        <div class="progress-dots">
          <div 
            v-for="i in 3"
            :key="i"
            class="dot"
            :class="{ 'active': currentStep >= i }"
          ></div>
        </div>
        
        <!-- Error Handling -->
        <div v-if="error" class="error-section">
          <div class="error-content">
            <ExclamationTriangleIcon class="w-6 h-6 text-red-500" />
            <h3 class="error-title">Authentication Error</h3>
            <p class="error-message">{{ error.message }}</p>
            
            <div class="error-actions">
              <button class="retry-button" @click="retryAuthentication">
                Try Again
              </button>
              <router-link to="/" class="home-link">
                Go Home
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Background Animation -->
    <div class="background-animation">
      <div class="floating-shapes">
        <div 
          v-for="i in 6" 
          :key="i" 
          class="shape"
          :style="{ 
            animationDelay: `${i * 0.7}s`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { 
  CalendarDaysIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const { handleRegistrationCallback, user } = useAuth()

// Reactive state
const currentStep = ref(1)
const error = ref<Error | null>(null)

// Status messages
const statusMessages = [
  { title: 'Authenticating...', message: 'Verifying your credentials' },
  { title: 'Setting up account...', message: 'Creating your profile' },
  { title: 'Almost ready...', message: 'Finalizing setup' }
]

const statusTitle = ref(statusMessages[0].title)
const statusMessage = ref(statusMessages[0].message)

let progressInterval: number | null = null

/**
 * Handle the authentication callback
 */
const processCallback = async () => {
  try {
    const code = route.query.code as string
    const state = route.query.state as string
    
    if (!code || !state) {
      throw new Error('Missing required authentication parameters')
    }
    
    // Start progress animation
    startProgressAnimation()
    
    // Handle the registration callback
    await handleRegistrationCallback(code, state)
    
    // Check if we need to go to email verification or onboarding
    if (user.value) {
      if (!user.value.email_verified) {
        // Redirect to email verification
        router.push({
          name: 'EmailVerification',
          query: {
            email: user.value.email,
            auth0Id: user.value.sub
          }
        })
      } else {
        // Check if onboarding is completed
        // For now, always redirect to onboarding
        router.push({ name: 'OnboardingWelcome' })
      }
    } else {
      throw new Error('User authentication failed')
    }
    
  } catch (err) {
    console.error('Callback processing failed:', err)
    error.value = err
    stopProgressAnimation()
    
    // Track error for analytics
    if (import.meta.env.DEV) {
      console.error('Auth callback error:', err)
    }
  }
}

/**
 * Start progress animation
 */
const startProgressAnimation = () => {
  progressInterval = window.setInterval(() => {
    if (currentStep.value < statusMessages.length) {
      currentStep.value++
      const messageIndex = currentStep.value - 1
      if (statusMessages[messageIndex]) {
        statusTitle.value = statusMessages[messageIndex].title
        statusMessage.value = statusMessages[messageIndex].message
      }
    }
  }, 1500)
}

/**
 * Stop progress animation
 */
const stopProgressAnimation = () => {
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
}

/**
 * Retry authentication
 */
const retryAuthentication = () => {
  error.value = null
  currentStep.value = 1
  statusTitle.value = statusMessages[0].title
  statusMessage.value = statusMessages[0].message
  processCallback()
}

/**
 * Lifecycle
 */
onMounted(() => {
  // Small delay to show the loading state
  setTimeout(() => {
    processCallback()
  }, 500)
  
  // Track callback page view
  if (import.meta.env.DEV) {
    console.log('Auth callback page loaded', {
      query: route.query,
      hasCode: !!route.query.code,
      hasState: !!route.query.state
    })
  }
})

onUnmounted(() => {
  stopProgressAnimation()
})
</script>

<style lang="scss" scoped>
.auth-callback-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.callback-container {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  position: relative;
  z-index: 2;
}

.callback-content {
  background: white;
  border-radius: 1.5rem;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 25%);
  
  @media (width <= 640px) {
    padding: 2rem 1.5rem;
  }
}

/* Loading Animation */

.loading-animation {
  margin-bottom: 2rem;
  
  .spinner {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto;
    
    .spinner-ring {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 3px solid rgba(102, 126, 234, 20%);
      border-top: 3px solid #667eea;
      border-radius: 50%;
      animation: spin 1.5s linear infinite;
    }
    
    .spinner-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: pulse 2s ease-in-out infinite;
    }
  }
}

/* Status Messages */

.callback-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.75rem;
}

.callback-message {
  color: #718096;
  margin-bottom: 2rem;
  line-height: 1.5;
}

/* Progress Dots */

.progress-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #e2e8f0;
    transition: all 0.3s ease;
    
    &.active {
      background: #667eea;
      transform: scale(1.2);
    }
  }
}

/* Error Section */

.error-section {

  .error-content {
    padding: 1.5rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.75rem;
    
    .error-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-size: 1.125rem;
      font-weight: 600;
      color: #dc2626;
      margin-bottom: 0.75rem;
    }
    
    .error-message {
      color: #991b1b;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }
    
    .error-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      
      .retry-button {
        padding: 0.5rem 1rem;
        background: #dc2626;
        color: white;
        border: none;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:hover {
          background: #b91c1c;
        }
      }
      
      .home-link {
        padding: 0.5rem 1rem;
        color: #4b5563;
        text-decoration: none;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        transition: all 0.2s ease;
        
        &:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }
      }
    }
  }
}

/* Background Animation */

.background-animation {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  
  .floating-shapes {
    width: 100%;
    height: 100%;
    
    .shape {
      position: absolute;
      width: 20px;
      height: 20px;
      background: rgba(255, 255, 255, 10%);
      border-radius: 50%;
      animation: float 8s ease-in-out infinite;
      
      &:nth-child(2n) {
        animation-direction: reverse;
        border-radius: 20% 80% 80% 20%;
      }
      
      &:nth-child(3n) {
        width: 15px;
        height: 15px;
        animation-duration: 12s;
      }
    }
  }
}

/* Animations */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {

  0%, 100% { 
    opacity: 70%;
    transform: translate(-50%, -50%) scale(1);
  }

  50% { 
    opacity: 100%;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

@keyframes float {

  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 50%;
  }

  50% {
    transform: translateY(-50px) rotate(180deg);
    opacity: 20%;
  }
}

/* Responsive Design */
@media (width <= 640px) {

  .callback-container {
    padding: 1rem;
  }
  
  .error-actions {
    flex-direction: column;
    
    .retry-button,
    .home-link {
      width: 100%;
      text-align: center;
    }
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {

  .spinner-ring {
    animation: none;
  }
  
  .spinner-center {
    animation: none;
  }
  
  .floating-shapes .shape {
    animation: none;
    opacity: 30%;
  }
}
</style>