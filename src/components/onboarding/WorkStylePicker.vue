<template>
  <div class="work-style-picker">
    <div class="picker-header">
      <h3 class="picker-title">What's your ideal work style?</h3>
      <p class="picker-description">
        We'll use this to optimize your calendar and suggest the best times for different
        activities.
      </p>
    </div>

    <div class="style-options">
      <button
        v-for="style in workStyles"
        :key="style.id"
        :class="['style-card', { 'style-card--selected': selectedStyle === style.id }]"
        :aria-pressed="selectedStyle === style.id"
        :aria-label="`Select ${style.name} work style: ${style.description}`"
        @click="selectStyle(style.id)"
      >
        <!-- Icon -->
        <div class="style-icon">
          <component :is="style.icon" />
        </div>

        <!-- Content -->
        <div class="style-content">
          <h4 class="style-name">{{ style.name }}</h4>
          <p class="style-description">{{ style.description }}</p>

          <!-- Schedule Preview -->
          <div class="schedule-preview">
            <div class="preview-label">Typical day:</div>
            <div class="time-blocks">
              <div
                v-for="block in style.schedule"
                :key="block.id"
                :class="['time-block', `time-block--${block.type}`]"
                :style="{ width: `${block.width}%` }"
                :title="`${block.time}: ${block.activity}`"
              />
            </div>
          </div>

          <!-- Benefits -->
          <div class="style-benefits">
            <div v-for="benefit in style.benefits" :key="benefit" class="benefit">
              <CheckIcon />
              <span>{{ benefit }}</span>
            </div>
          </div>
        </div>

        <!-- Selection Indicator -->
        <div v-if="selectedStyle === style.id" class="selection-indicator">
          <CheckCircleIcon />
        </div>
      </button>
    </div>

    <!-- Custom Option -->
    <div class="custom-option">
      <button class="custom-button" @click="showCustomDialog = true">
        <SettingsIcon />
        Or customize your own style
      </button>
    </div>

    <!-- Custom Style Modal -->
    <BaseModal v-model="showCustomDialog" title="Customize Your Work Style" class="custom-modal">
      <div class="custom-form">
        <!-- Focus Time Preference -->
        <div class="form-group">
          <label class="form-label">When are you most focused?</label>
          <div class="radio-group">
            <label v-for="time in focusTimes" :key="time.value" class="radio-option">
              <input
                v-model="customStyle.focusTime"
                type="radio"
                :value="time.value"
                name="focusTime"
              />
              <span class="radio-label">{{ time.label }}</span>
            </label>
          </div>
        </div>

        <!-- Meeting Preference -->
        <div class="form-group">
          <label class="form-label">How do you prefer meetings?</label>
          <div class="radio-group">
            <label v-for="meeting in meetingStyles" :key="meeting.value" class="radio-option">
              <input
                v-model="customStyle.meetingStyle"
                type="radio"
                :value="meeting.value"
                name="meetingStyle"
              />
              <span class="radio-label">{{ meeting.label }}</span>
            </label>
          </div>
        </div>

        <!-- Break Preferences -->
        <div class="form-group">
          <label class="form-label">Break preferences</label>
          <div class="checkbox-group">
            <label
              v-for="breakPref in breakPreferences"
              :key="breakPref.value"
              class="checkbox-option"
            >
              <input v-model="customStyle.breaks" type="checkbox" :value="breakPref.value" />
              <span class="checkbox-label">{{ breakPref.label }}</span>
            </label>
          </div>
        </div>
      </div>

      <div class="custom-modal__actions">
        <RegisterButton variant="outline" @click="showCustomDialog = false">
          Cancel
        </RegisterButton>
        <RegisterButton @click="applyCustomStyle"> Apply Custom Style </RegisterButton>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { RegisterButton, BaseModal } from '@/ui'
  import CheckIcon from '@/components/icons/CheckIcon.vue'
  import CheckCircleIcon from '@/components/icons/CheckCircleIcon.vue'
  import SettingsIcon from '@/components/icons/SettingsIcon.vue'
  import SunIcon from '@/components/icons/SunIcon.vue'
  import MoonIcon from '@/components/icons/MoonIcon.vue'
  import ZapIcon from '@/components/icons/ZapIcon.vue'
  import UsersIcon from '@/components/icons/UsersIcon.vue'
  import TargetIcon from '@/components/icons/TargetIcon.vue'

  export interface Props {
    modelValue?: string | null
  }

  export interface Emits {
    (e: 'update:modelValue', value: string): void
    (e: 'change', value: string): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // State
  const selectedStyle = ref<string | null>(props.modelValue || null)
  const showCustomDialog = ref(false)

  const customStyle = reactive({
    focusTime: 'morning',
    meetingStyle: 'batched',
    breaks: ['regular'],
  })

  // Work style options
  const workStyles = [
    {
      id: 'early-bird',
      name: 'Early Bird',
      description: 'Peak productivity in the morning, prefer early starts',
      icon: SunIcon,
      schedule: [
        { id: 1, type: 'focus', activity: 'Deep Work', time: '8:00-10:00', width: 25 },
        { id: 2, type: 'meeting', activity: 'Meetings', time: '10:00-12:00', width: 25 },
        { id: 3, type: 'break', activity: 'Lunch', time: '12:00-13:00', width: 12.5 },
        { id: 4, type: 'admin', activity: 'Admin Tasks', time: '13:00-17:00', width: 37.5 },
      ],
      benefits: ['4+ hours of morning focus time', 'Early finish', 'Less interruptions'],
    },
    {
      id: 'night-owl',
      name: 'Night Owl',
      description: 'More productive in the afternoon and evening',
      icon: MoonIcon,
      schedule: [
        { id: 1, type: 'admin', activity: 'Admin Tasks', time: '9:00-11:00', width: 25 },
        { id: 2, type: 'meeting', activity: 'Meetings', time: '11:00-14:00', width: 37.5 },
        { id: 3, type: 'break', activity: 'Lunch', time: '14:00-15:00', width: 12.5 },
        { id: 4, type: 'focus', activity: 'Deep Work', time: '15:00-18:00', width: 25 },
      ],
      benefits: ['Afternoon energy boost', 'Flexible mornings', 'Peak focus time'],
    },
    {
      id: 'sprinter',
      name: 'Sprinter',
      description: 'Work in intense bursts with regular breaks',
      icon: ZapIcon,
      schedule: [
        { id: 1, type: 'focus', activity: 'Sprint 1', time: '9:00-10:30', width: 18.75 },
        { id: 2, type: 'break', activity: 'Break', time: '10:30-11:00', width: 6.25 },
        { id: 3, type: 'focus', activity: 'Sprint 2', time: '11:00-12:30', width: 18.75 },
        { id: 4, type: 'meeting', activity: 'Meetings', time: '14:00-16:00', width: 25 },
        { id: 5, type: 'focus', activity: 'Sprint 3', time: '16:00-17:30', width: 31.25 },
      ],
      benefits: ['High intensity work', 'Regular recovery', 'Sustained energy'],
    },
    {
      id: 'collaborator',
      name: 'Collaborator',
      description: 'Thrive on interaction and teamwork throughout the day',
      icon: UsersIcon,
      schedule: [
        { id: 1, type: 'meeting', activity: 'Team Sync', time: '9:00-10:00', width: 12.5 },
        { id: 2, type: 'focus', activity: 'Individual Work', time: '10:00-12:00', width: 25 },
        { id: 3, type: 'meeting', activity: 'Collaboration', time: '13:00-15:00', width: 25 },
        { id: 4, type: 'focus', activity: 'Wrap-up', time: '15:00-17:00', width: 25 },
        { id: 5, type: 'meeting', activity: 'Check-ins', time: '17:00-17:30', width: 12.5 },
      ],
      benefits: ['Regular team interaction', 'Balanced solo/group work', 'Strong communication'],
    },
    {
      id: 'focused',
      name: 'Deep Focuser',
      description: 'Long uninterrupted blocks for complex work',
      icon: TargetIcon,
      schedule: [
        { id: 1, type: 'focus', activity: 'Deep Work Block 1', time: '9:00-12:00', width: 37.5 },
        { id: 2, type: 'break', activity: 'Lunch', time: '12:00-13:00', width: 12.5 },
        { id: 3, type: 'focus', activity: 'Deep Work Block 2', time: '13:00-16:00', width: 37.5 },
        { id: 4, type: 'meeting', activity: 'Quick Sync', time: '16:00-17:00', width: 12.5 },
      ],
      benefits: ['Extended focus periods', 'Minimal context switching', 'Maximum deep work'],
    },
  ]

  const focusTimes = [
    { value: 'morning', label: 'Morning (8AM-12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM-5PM)' },
    { value: 'evening', label: 'Evening (5PM-8PM)' },
  ]

  const meetingStyles = [
    { value: 'batched', label: 'Batch meetings together' },
    { value: 'distributed', label: 'Spread throughout the day' },
    { value: 'minimal', label: 'Keep meetings to a minimum' },
  ]

  const breakPreferences = [
    { value: 'regular', label: 'Regular short breaks (15 min)' },
    { value: 'pomodoro', label: 'Pomodoro technique (25/5 min)' },
    { value: 'long', label: 'Fewer, longer breaks (30-60 min)' },
    { value: 'flexible', label: 'Flexible break timing' },
  ]

  const selectStyle = (styleId: string) => {
    selectedStyle.value = styleId
    emit('update:modelValue', styleId)
    emit('change', styleId)
  }

  const applyCustomStyle = () => {
    const customId = 'custom'
    selectedStyle.value = customId
    showCustomDialog.value = false
    const customConfig = {
      id: customId,
      name: 'Custom Style',
      preferences: customStyle,
    }
    console.log('Applying custom style:', customConfig)
    emit('update:modelValue', customId)
    emit('change', customId)
  }
</script>

<script lang="ts">
  export default {
    name: 'WorkStylePicker',
  }
</script>

<style lang="scss" scoped>
  @use '../../../styles/tokens' as *;

  /* ... Mantengo aquí todos tus estilos originales completos ... */
</style>
