<!--
Value Proposition Card Component
Displays key value propositions on landing page
-->
<template>
  <div class="value-prop-card">
    <div class="card-icon">
      <component :is="iconComponent" class="w-8 h-8" />
    </div>

    <div class="card-content">
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-description">{{ description }}</p>

      <div v-if="stat" class="card-stat">
        <span class="stat-value">{{ stat }}</span>
        <span class="stat-label">improvement</span>
      </div>

      <ul v-if="features?.length" class="feature-list">
        <li v-for="feature in features" :key="feature" class="feature-item">
          <CheckIcon class="w-4 h-4 text-green-500" />
          {{ feature }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { ClockIcon, SparklesIcon, PuzzlePieceIcon, CheckIcon } from '@heroicons/vue/24/outline'

  interface Props {
    icon: string
    title: string
    description: string
    stat?: string
    features?: string[]
  }

  const props = defineProps<Props>()

  const iconComponent = computed(() => {
    switch (props.icon) {
      case 'clock':
        return ClockIcon
      case 'brain':
        return SparklesIcon
      case 'integration':
        return PuzzlePieceIcon
      default:
        return SparklesIcon
    }
  })
</script>

<style lang="scss" scoped>
  .value-prop-card {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 10%);
    transition: all 0.3s ease;
    height: 100%;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 10%);
    }
  }

  .card-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-bottom: 1.5rem;
  }

  .card-content {

    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a202c;
      margin-bottom: 0.75rem;
    }

    .card-description {
      color: #718096;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .card-stat {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      margin-bottom: 1rem;

      .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: #667eea;
      }

      .stat-label {
        font-size: 0.875rem;
        color: #a0aec0;
      }
    }

    .feature-list {
      list-style: none;
      padding: 0;
      margin: 0;

      .feature-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: #4a5568;
        margin-bottom: 0.5rem;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
</style>
