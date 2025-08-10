<!--
AI Setup Step - Configure AI assistant preferences
Sets up AI optimization levels and preferences
-->
<template>
  <div class="ai-setup-step">
    <div class="step-content">
      <div class="step-header">
        <h1 class="step-title">Configure Your AI Assistant</h1>
        <p class="step-subtitle">
          Customize how Vana optimizes your calendar and suggests improvements
        </p>
      </div>

      <!-- AI Optimization Level -->
      <div class="section">
        <h2 class="section-title">AI Optimization Level</h2>

        <div class="optimization-levels">
          <div
            v-for="level in optimizationLevels"
            :key="level.id"
            class="level-card"
            :class="{
              selected: selectedLevel === level.id,
              disabled: isLoading,
            }"
            @click="selectLevel(level.id)"
          >
            <div class="level-header">
              <component :is="level.icon" class="w-6 h-6" />
              <h3 class="level-title">{{ level.title }}</h3>
            </div>
            <p class="level-description">{{ level.description }}</p>
            <ul class="level-features">
              <li v-for="feature in level.features" :key="feature">
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- AI Preferences -->
      <div class="section">
        <h2 class="section-title">AI Preferences</h2>

        <div class="preferences-list">
          <label v-for="preference in aiPreferences" :key="preference.id" class="preference-item">
            <input
              v-model="preference.enabled"
              type="checkbox"
              :disabled="isLoading"
              class="preference-checkbox"
            />
            <div class="preference-content">
              <h4 class="preference-title">{{ preference.title }}</h4>
              <p class="preference-description">{{ preference.description }}</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue'
  import { SparklesIcon, BoltIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'

  interface StepData {
    optimizationLevel?: string
    preferences?: Record<string, boolean>
  }

  interface Props {
    stepData?: StepData
    isLoading?: boolean
    canProceed?: boolean
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    'step-complete': [data: StepData]
    'data-change': [data: StepData]
    'validation-change': [isValid: boolean]
  }>()

  const optimizationLevels = [
    {
      id: 'conservative',
      title: 'Conservative',
      description: 'Gentle suggestions with manual approval',
      icon: ShieldCheckIcon,
      features: [
        'Manual approval for all changes',
        'Gentle scheduling suggestions',
        'Preserves existing patterns',
      ],
    },
    {
      id: 'balanced',
      title: 'Balanced',
      description: 'Smart automation with user control',
      icon: SparklesIcon,
      features: [
        'Automatic minor adjustments',
        'Smart meeting clustering',
        'Focus time protection',
      ],
    },
    {
      id: 'aggressive',
      title: 'Aggressive',
      description: 'Maximum optimization and automation',
      icon: BoltIcon,
      features: [
        'Automatic schedule optimization',
        'Proactive conflict resolution',
        'Maximum efficiency gains',
      ],
    },
  ]

  const selectedLevel = ref('balanced')

  const aiPreferences = ref([
    {
      id: 'auto_reschedule',
      title: 'Automatic rescheduling',
      description: 'Allow AI to automatically reschedule conflicting meetings',
      enabled: true,
    },
    {
      id: 'focus_protection',
      title: 'Focus time protection',
      description: 'Protect dedicated focus blocks from meeting requests',
      enabled: true,
    },
    {
      id: 'travel_time',
      title: 'Travel time calculation',
      description: 'Automatically add buffer time for meetings with travel',
      enabled: true,
    },
    {
      id: 'meeting_insights',
      title: 'Meeting insights',
      description: 'Receive weekly reports on meeting patterns and suggestions',
      enabled: false,
    },
  ])

  const isValid = computed(() => selectedLevel.value !== '')

  const formData = computed(() => ({
    optimizationLevel: selectedLevel.value,
    preferences: aiPreferences.value.reduce(
      (acc, pref) => {
        acc[pref.id] = pref.enabled
        return acc
      },
      {} as Record<string, boolean>
    ),
  }))

  const selectLevel = (levelId: string) => {
    if (props.isLoading) return
    selectedLevel.value = levelId
  }

  // Watch for changes
  watch(
    [selectedLevel, aiPreferences],
    () => {
      emit('data-change', formData.value)
    },
    { deep: true }
  )

  watch(isValid, valid => {
    emit('validation-change', valid)
  })

  onMounted(() => {
    if (props.stepData) {
      selectedLevel.value = props.stepData.optimizationLevel || 'balanced'
      if (props.stepData?.preferences) {
        aiPreferences.value.forEach(pref => {
          if (props.stepData?.preferences?.[pref.id] !== undefined) {
            pref.enabled = props.stepData.preferences[pref.id]
          }
        })
      }
    }

    emit('validation-change', isValid.value)
  })
</script>

<style lang="scss" scoped>
  .ai-setup-step {
    max-width: 700px;
    margin: 0 auto;
  }

  .step-content {
    padding: 2rem;
  }

  .step-header {
    text-align: center;
    margin-bottom: 3rem;

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

  .section {
    margin-bottom: 3rem;

    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 1.5rem;
    }
  }

  .optimization-levels {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .level-card {
    padding: 1.5rem;
    border: 2px solid #e2e8f0;
    border-radius: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    background: white;

    &:hover:not(.disabled) {
      border-color: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 15%);
    }

    &.selected {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 5%), rgba(118, 75, 162, 5%));
    }

    &.disabled {
      opacity: 60%;
      cursor: not-allowed;
    }

    .level-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
      color: #667eea;

      .level-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1a202c;
      }
    }

    .level-description {
      color: #718096;
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .level-features {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        color: #4a5568;
        font-size: 0.875rem;
        margin-bottom: 0.25rem;
        position: relative;
        padding-left: 1rem;

        &::before {
          content: '•';
          color: #667eea;
          position: absolute;
          left: 0;
        }
      }
    }
  }

  .preferences-list {
    display: grid;
    gap: 1rem;
  }

  .preference-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
    background: #f7fafc;
    border-radius: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #edf2f7;
    }

    .preference-checkbox {
      width: 18px;
      height: 18px;
      margin-top: 0.125rem;
      accent-color: #667eea;
      cursor: pointer;
    }

    .preference-content {
      flex: 1;

      .preference-title {
        font-size: 1rem;
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 0.25rem;
      }

      .preference-description {
        color: #718096;
        font-size: 0.875rem;
        line-height: 1.5;
      }
    }
  }

  @media (width <= 640px) {

    .optimization-levels {
      grid-template-columns: 1fr;
    }

    .step-content {
      padding: 1rem;
    }
  }
</style>
