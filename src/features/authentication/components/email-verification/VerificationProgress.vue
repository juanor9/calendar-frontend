<!--
Verification Progress Steps Component
Displays progress steps with animations
-->
<template>
  <div class="verification-progress">
    <div class="progress-steps">
      <div 
        v-for="(step, index) in steps" 
        :key="step.id"
        class="step"
        :class="getStepClass(index)"
      >
        <div class="step-circle">
          <CheckCircleIcon 
            v-if="index < currentStepIndex" 
            class="w-4 h-4 text-green-500"
          />
          <div 
            v-else-if="index === currentStepIndex"
            class="loading-spinner"
          ></div>
          <span v-else class="step-number">{{ index + 1 }}</span>
        </div>
        <div class="step-label">{{ step.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/outline'

export interface VerificationStep {
  id: number
  label: string
}

interface Props {
  currentStepIndex: number
  steps?: VerificationStep[]
}

const props = withDefaults(defineProps<Props>(), {
  steps: () => [
    { id: 1, label: 'Email sent' },
    { id: 2, label: 'Check your inbox' },
    { id: 3, label: 'Click verify link' },
    { id: 4, label: 'Account activated' }
  ]
})

/**
 * Step Management
 */
const getStepClass = (index: number) => ({
  'completed': index < props.currentStepIndex,
  'current': index === props.currentStepIndex,
  'pending': index > props.currentStepIndex
})
</script>

<style lang="scss" scoped>
.verification-progress {
  margin-bottom: 2.5rem;
}

.progress-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 0.75rem;
  
  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    
    &.completed {

      .step-circle {
        background: #48bb78;
        color: white;
        border-color: #48bb78;
      }
      
      .step-label {
        color: #48bb78;
        font-weight: 600;
      }
    }
    
    &.current {

      .step-circle {
        background: #667eea;
        color: white;
        border-color: #667eea;
      }
      
      .step-label {
        color: #667eea;
        font-weight: 600;
      }
    }
    
    &.pending {

      .step-circle {
        background: #e2e8f0;
        color: #a0aec0;
        border-color: #e2e8f0;
      }
      
      .step-label {
        color: #a0aec0;
      }
    }
  }
  
  .step-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .step-label {
    font-size: 0.75rem;
    text-align: center;
    transition: all 0.3s ease;
  }
  
  .loading-spinner {
    width: 12px;
    height: 12px;
    border: 2px solid rgba(255, 255, 255, 30%);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>