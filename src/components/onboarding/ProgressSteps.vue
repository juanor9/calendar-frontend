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

<style lang="scss" src="./ProgressSteps.scss"></style>
