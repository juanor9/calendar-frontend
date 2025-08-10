<template>
  <div class="progress-steps">
    <div class="progress-steps__container">
      <div class="progress-steps__track">
        <div class="progress-steps__progress" :style="{ width: progressPercentage + '%' }" />
      </div>

      <div class="progress-steps__steps">
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          :class="['progress-steps__step', `progress-steps__step--${getStepStatus(step, index)}`]"
        >
          <div class="progress-steps__step-icon">
            <CheckIcon v-if="getStepStatus(step, index) === 'completed'" />
            <span v-else class="progress-steps__step-number">{{ step.id }}</span>
          </div>
          <div class="progress-steps__step-content">
            <div class="progress-steps__step-title">{{ step.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import CheckIcon from '@/components/icons/CheckIcon.vue'

  export interface Step {
    id: number
    title: string
    status?: 'pending' | 'current' | 'completed'
  }

  export interface Props {
    currentStep: number
    totalSteps: number
    steps: Step[]
  }

  const props = defineProps<Props>()

  const progressPercentage = computed(() => {
    return ((props.currentStep - 1) / (props.totalSteps - 1)) * 100
  })

  const getStepStatus = (step: Step, index: number): string => {
    if (step.status) return step.status

    if (index < props.currentStep - 1) return 'completed'
    if (index === props.currentStep - 1) return 'current'
    return 'pending'
  }
</script>

<script lang="ts">
  export default {
    name: 'ProgressSteps',
  }
</script>

<style lang="scss" scoped>
  .progress-steps {
    width: 100%;

    &__container {
      position: relative;
      padding: 1rem 0;
    }

    &__track {
      position: absolute;
      top: 2rem;
      left: 2rem;
      right: 2rem;
      height: 2px;
      background-color: #e5e7eb;
      border-radius: 1px;
    }

    &__progress {
      height: 100%;
      background-color: #3b82f6;
      border-radius: 1px;
      transition: width 0.3s ease;
    }

    &__steps {
      display: flex;
      justify-content: space-between;
      position: relative;
      z-index: 10;
    }

    &__step {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      flex: 1;
      max-width: 200px;

      &--pending {

        .progress-steps__step-icon {
          background-color: #f3f4f6;
          color: #9ca3af;
          border-color: #e5e7eb;
        }

        .progress-steps__step-title {
          color: #9ca3af;
        }
      }

      &--current {

        .progress-steps__step-icon {
          background-color: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .progress-steps__step-title {
          color: #1f2937;
          font-weight: 600;
        }
      }

      &--completed {

        .progress-steps__step-icon {
          background-color: #10b981;
          color: white;
          border-color: #10b981;
        }

        .progress-steps__step-title {
          color: #1f2937;
        }
      }
    }

    &__step-icon {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      border: 2px solid;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5rem;
      transition: all 0.3s ease;
    }

    &__step-number {
      font-size: 0.875rem;
      font-weight: 600;
    }

    &__step-content {
      flex: 1;
    }

    &__step-title {
      font-size: 0.875rem;
      line-height: 1.25;
      transition: color 0.3s ease;
    }
  }

  @media (width <= 640px) {

    .progress-steps {

      &__step {
        max-width: none;
      }

      &__step-title {
        font-size: 0.75rem;
      }

      &__step-icon {
        width: 1.5rem;
        height: 1.5rem;
      }

      &__step-number {
        font-size: 0.75rem;
      }
    }
  }
</style>
