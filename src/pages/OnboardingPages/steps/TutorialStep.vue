<!--
Tutorial Step - Interactive product tour
Shows key features and how to use the application
-->
<template>
  <div class="tutorial-step">
    <div class="step-content">
      <div class="step-header">
        <h1 class="step-title">Quick Tour</h1>
        <p class="step-subtitle">
          Let's show you the key features to get you started
        </p>
      </div>
      
      <!-- Tutorial Progress -->
      <div class="tutorial-progress">
        <div class="progress-bar">
          <div 
            class="progress-fill"
            :style="{ width: `${(currentTutorialStep / tutorialSteps.length) * 100}%` }"
          ></div>
        </div>
        <span class="progress-text">
          {{ currentTutorialStep }} of {{ tutorialSteps.length }}
        </span>
      </div>
      
      <!-- Tutorial Content -->
      <div class="tutorial-content">
        <div class="tutorial-step-card">
          <div class="step-image">
            <img 
              :src="currentStep.image"
              :alt="currentStep.title"
              loading="lazy"
            />
          </div>
          
          <div class="step-info">
            <h3 class="step-title">{{ currentStep.title }}</h3>
            <p class="step-description">{{ currentStep.description }}</p>
            
            <ul v-if="currentStep.keyPoints" class="key-points">
              <li v-for="point in currentStep.keyPoints" :key="point">
                <CheckIcon class="w-4 h-4 text-green-500" />
                {{ point }}
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Tutorial Navigation -->
        <div class="tutorial-navigation">
          <button
            v-if="currentTutorialStep > 1"
            class="nav-button secondary"
            :disabled="isLoading"
            @click="previousStep"
          >
            <ChevronLeftIcon class="w-4 h-4" />
            Previous
          </button>
          
          <div class="spacer"></div>
          
          <button
            v-if="currentTutorialStep < tutorialSteps.length"
            class="nav-button primary"
            :disabled="isLoading"
            @click="nextStep"
          >
            Next
            <ChevronRightIcon class="w-4 h-4" />
          </button>
          
          <button
            v-else
            class="nav-button primary"
            :loading="isLoading"
            @click="completeTutorial"
          >
            Get Started
            <RocketLaunchIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <!-- Skip Option -->
      <div class="skip-section">
        <button 
          class="skip-button"
          :disabled="isLoading"
          @click="skipTutorial"
        >
          Skip tutorial
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  RocketLaunchIcon
} from '@heroicons/vue/24/outline'

interface StepData {
  completed?: boolean
  stepsViewed?: number
  completedAt?: string
}

interface Props {
  stepData?: StepData
  isLoading?: boolean
  canProceed?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'step-complete': [data: StepData]
  'step-skip': []
  'data-change': [data: StepData]
  'validation-change': [isValid: boolean]
}>()

const tutorialSteps = [
  {
    id: 1,
    title: 'Smart Calendar Overview',
    description: 'See all your events, meetings, and focus blocks in one intelligent view.',
    image: '/tutorial/calendar-overview.png',
    keyPoints: [
      'Color-coded events by type',
      'AI-optimized focus blocks',
      'Conflict detection and resolution'
    ]
  },
  {
    id: 2,
    title: 'AI-Powered Optimization',
    description: 'Your AI assistant continuously improves your schedule in the background.',
    image: '/tutorial/ai-optimization.png',
    keyPoints: [
      'Automatic meeting clustering',
      'Focus time protection',
      'Smart conflict resolution'
    ]
  },
  {
    id: 3,
    title: 'Insights & Analytics',
    description: 'Track your productivity patterns and get personalized recommendations.',
    image: '/tutorial/insights.png',
    keyPoints: [
      'Weekly productivity reports',
      'Meeting efficiency metrics',
      'Time-saving suggestions'
    ]
  },
  {
    id: 4,
    title: 'Mobile & Integrations',
    description: 'Access Vana anywhere and sync with all your existing tools.',
    image: '/tutorial/integrations.png',
    keyPoints: [
      'Mobile app with full features',
      'Calendar sync across devices',
      'Slack and Teams integration'
    ]
  }
]

const currentTutorialStep = ref(1)

const currentStep = computed(() => 
  tutorialSteps.find(step => step.id === currentTutorialStep.value) || tutorialSteps[0]
)

const nextStep = () => {
  if (currentTutorialStep.value < tutorialSteps.length) {
    currentTutorialStep.value++
  }
}

const previousStep = () => {
  if (currentTutorialStep.value > 1) {
    currentTutorialStep.value--
  }
}

const completeTutorial = () => {
  emit('step-complete', {
    completed: true,
    stepsViewed: currentTutorialStep.value,
    completedAt: new Date().toISOString()
  })
}

const skipTutorial = () => {
  emit('step-skip')
}

onMounted(() => {
  // Tutorial is always valid since it's optional
  emit('validation-change', true)
  
  if (import.meta.env.DEV) {
    console.log('Tutorial step mounted')
  }
})
</script>

<style lang="scss" scoped>
.tutorial-step {
  max-width: 800px;
  margin: 0 auto;
}

.step-content {
  padding: 2rem;
}

.step-header {
  text-align: center;
  margin-bottom: 2rem;
  
  .step-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 0.75rem;
  }
  
  .step-subtitle {
    font-size: 1.125rem;
    color: #718096;
    line-height: 1.6;
  }
}

.tutorial-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  
  .progress-bar {
    flex: 1;
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      border-radius: 4px;
      transition: width 0.3s ease;
    }
  }
  
  .progress-text {
    font-size: 0.875rem;
    color: #718096;
    font-weight: 500;
    min-width: fit-content;
  }
}

.tutorial-step-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 10%);
  overflow: hidden;
  margin-bottom: 2rem;
  
  .step-image {
    width: 100%;
    height: 300px;
    background: #f7fafc;
    display: flex;
    align-items: center;
    justify-content: center;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .step-info {
    padding: 2rem;
    
    .step-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a202c;
      margin-bottom: 0.75rem;
    }
    
    .step-description {
      color: #718096;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    
    .key-points {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 0.75rem;
      
      li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #4a5568;
        font-size: 0.875rem;
      }
    }
  }
}

.tutorial-navigation {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  
  .spacer {
    flex: 1;
  }
  
  .nav-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    
    &.primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      
      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 40%);
      }
    }
    
    &.secondary {
      background: white;
      color: #4a5568;
      border: 1px solid #e2e8f0;
      
      &:hover:not(:disabled) {
        background: #f7fafc;
        border-color: #cbd5e0;
      }
    }
    
    &:disabled {
      opacity: 60%;
      cursor: not-allowed;
      transform: none !important;
    }
  }
}

.skip-section {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  
  .skip-button {
    color: #718096;
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: underline;
    font-size: 0.875rem;
    
    &:hover:not(:disabled) {
      color: #4a5568;
    }
    
    &:disabled {
      opacity: 50%;
      cursor: not-allowed;
    }
  }
}

@media (width <= 640px) {

  .step-content {
    padding: 1rem;
  }
  
  .tutorial-step-card {

    .step-image {
      height: 200px;
    }
    
    .step-info {
      padding: 1.5rem;
    }
  }
  
  .tutorial-navigation {
    flex-direction: column-reverse;
    
    .nav-button {
      width: 100%;
      justify-content: center;
    }
    
    .spacer {
      display: none;
    }
  }
}
</style>