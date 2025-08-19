<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'

  // Export status types
  type ExportStatus =
    | 'idle'
    | 'preparing'
    | 'processing'
    | 'ready'
    | 'downloading'
    | 'completed'
    | 'error'

  // Export format types
  type ExportFormat = 'json' | 'csv' | 'pdf'

  // Data category interface
  interface DataCategory {
    id: string
    label: string
    description: string
    size: string
    included: boolean
    sensitive?: boolean
  }

  // Export job interface
  interface ExportJob {
    id: string
    format: ExportFormat
    categories: string[]
    createdAt: Date
    expiresAt: Date
    status: ExportStatus
    downloadUrl?: string
    progress?: number
    error?: string
  }

  // Component props interface
  interface Props {
    availableFormats?: ExportFormat[]
    maxExportsPerDay?: number
    currentExportsToday?: number
    exportRetentionDays?: number
    showAdvancedOptions?: boolean
    title?: string
    subtitle?: string
  }

  // Component emits interface
  interface Emits {
    'start-export': [format: ExportFormat, categories: string[]]
    'download-export': [jobId: string]
    'delete-export': [jobId: string]
    'cancel-export': [jobId: string]
  }

  // Props with defaults
  const props = withDefaults(defineProps<Props>(), {
    availableFormats: () => ['json', 'csv', 'pdf'],
    maxExportsPerDay: 3,
    currentExportsToday: 0,
    exportRetentionDays: 30,
    showAdvancedOptions: true,
    title: 'Export Your Data',
    subtitle: 'Download a copy of your personal data for your records.',
  })

  // Emits definition
  const emit = defineEmits<Emits>()

  // Component state
  const selectedFormat = ref<ExportFormat>('json')
  const exportJobs = ref<ExportJob[]>([])
  const isExporting = ref<boolean>(false)
  const exportError = ref<string>('')

  // Available data categories
  const dataCategories = ref<DataCategory[]>([
    {
      id: 'profile',
      label: 'Profile Information',
      description: 'Name, email, profile settings',
      size: '< 1 MB',
      included: true,
    },
    {
      id: 'calendar',
      label: 'Calendar Data',
      description: 'Events, meetings, scheduling preferences',
      size: '~2 MB',
      included: true,
    },
    {
      id: 'contacts',
      label: 'Contacts',
      description: 'Contact information and relationships',
      size: '~500 KB',
      included: true,
    },
    {
      id: 'preferences',
      label: 'User Preferences',
      description: 'Settings, notifications, customizations',
      size: '< 100 KB',
      included: true,
    },
    {
      id: 'activity',
      label: 'Activity Logs',
      description: 'Login history, usage analytics',
      size: '~1 MB',
      included: false,
      sensitive: true,
    },
    {
      id: 'integrations',
      label: 'Third-party Integrations',
      description: 'Connected apps and services data',
      size: '~500 KB',
      included: false,
    },
  ])

  // Computed properties
  const canExport = computed((): boolean => {
    return (
      props.currentExportsToday < props.maxExportsPerDay &&
      !isExporting.value &&
      selectedCategories.value.length > 0
    )
  })

  const selectedCategories = computed((): DataCategory[] => {
    return dataCategories.value.filter(category => category.included)
  })

  const estimatedSize = computed((): string => {
    if (selectedCategories.value.length === 0) return '0 KB'

    // Simple size estimation logic
    const totalSizeKB = selectedCategories.value.reduce((total, category) => {
      const sizeStr = category.size
      if (sizeStr.includes('MB')) {
        return total + parseFloat(sizeStr) * 1024
      } else {
        return total + parseFloat(sizeStr)
      }
    }, 0)

    if (totalSizeKB < 1024) {
      return `${Math.round(totalSizeKB)} KB`
    } else {
      return `${(totalSizeKB / 1024).toFixed(1)} MB`
    }
  })

  const remainingExports = computed((): number => {
    return props.maxExportsPerDay - props.currentExportsToday
  })

  const activeExports = computed((): ExportJob[] => {
    return exportJobs.value.filter(job => ['preparing', 'processing'].includes(job.status))
  })

  const completedExports = computed((): ExportJob[] => {
    return exportJobs.value.filter(job => ['ready', 'completed'].includes(job.status))
  })

  // Format labels
  const formatLabels: Record<ExportFormat, string> = {
    json: 'JSON',
    csv: 'CSV (Spreadsheet)',
    pdf: 'PDF Document',
  }

  const formatDescriptions: Record<ExportFormat, string> = {
    json: 'Machine-readable format, ideal for developers',
    csv: 'Spreadsheet format, works with Excel and Google Sheets',
    pdf: 'Human-readable document format',
  }

  // Event handlers
  const handleStartExport = (): void => {
    if (!canExport.value) return

    exportError.value = ''
    isExporting.value = true

    const categoryIds = selectedCategories.value.map(cat => cat.id)
    emit('start-export', selectedFormat.value, categoryIds)

    // Simulate export creation
    const newExport: ExportJob = {
      id: `export-${Date.now()}`,
      format: selectedFormat.value,
      categories: categoryIds,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + props.exportRetentionDays * 24 * 60 * 60 * 1000),
      status: 'preparing',
      progress: 0,
    }

    exportJobs.value.unshift(newExport)
    simulateExportProgress(newExport.id)
  }

  const simulateExportProgress = (jobId: string): void => {
    const job = exportJobs.value.find(j => j.id === jobId)
    if (!job) return

    const updateProgress = () => {
      if (job.status === 'preparing') {
        job.progress = Math.min((job.progress || 0) + 10, 100)

        if (job.progress >= 100) {
          job.status = 'processing'
          job.progress = 0
        }
      } else if (job.status === 'processing') {
        job.progress = Math.min((job.progress || 0) + 5, 100)

        if (job.progress >= 100) {
          job.status = 'ready'
          job.downloadUrl = `#download-${jobId}`
          isExporting.value = false
          return
        }
      }

      setTimeout(updateProgress, 500)
    }

    setTimeout(updateProgress, 1000)
  }

  const handleDownload = (job: ExportJob): void => {
    if (job.status !== 'ready') return

    job.status = 'downloading'
    emit('download-export', job.id)

    // Simulate download completion
    setTimeout(() => {
      job.status = 'completed'
    }, 2000)
  }

  const handleDelete = (job: ExportJob): void => {
    emit('delete-export', job.id)
    exportJobs.value = exportJobs.value.filter(j => j.id !== job.id)
  }

  const handleCancel = (job: ExportJob): void => {
    emit('cancel-export', job.id)
    exportJobs.value = exportJobs.value.filter(j => j.id !== job.id)
    isExporting.value = false
  }

  const toggleCategory = (categoryId: string): void => {
    const category = dataCategories.value.find(cat => cat.id === categoryId)
    if (category) {
      category.included = !category.included
    }
  }

  const formatExpiryDate = (date: Date): string => {
    const diffMs = date.getTime() - Date.now()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays <= 0) return 'Expired'
    if (diffDays === 1) return 'Expires tomorrow'
    return `Expires in ${diffDays} days`
  }

  // Lifecycle hooks
  let progressInterval: number | undefined

  onMounted(() => {
    // Simulate some existing exports
    if (exportJobs.value.length === 0) {
      exportJobs.value.push({
        id: 'export-prev-1',
        format: 'json',
        categories: ['profile', 'calendar'],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        status: 'ready',
        downloadUrl: '#download-prev-1',
      })
    }
  })

  onUnmounted(() => {
    if (progressInterval) {
      clearInterval(progressInterval)
    }
  })
</script>

<template>
  <div class="data-export-card">
    <!-- Header -->
    <div class="data-export-card__header">
      <h2 class="data-export-card__title">
        {{ props.title }}
      </h2>
      <p class="data-export-card__subtitle">
        {{ props.subtitle }}
      </p>

      <div v-if="remainingExports <= 1" class="data-export-card__limit-warning" role="alert">
        ⚠️ {{ remainingExports }} export{{ remainingExports === 1 ? '' : 's' }} remaining today
      </div>
    </div>

    <!-- Export Configuration -->
    <div class="data-export-card__config">
      <h3 class="data-export-card__section-title">Choose Export Format</h3>

      <div class="data-export-card__format-options">
        <label
          v-for="format in props.availableFormats"
          :key="format"
          class="data-export-card__format-option"
          :class="{
            'data-export-card__format-option--selected': selectedFormat === format,
            'data-export-card__format-option--disabled': !canExport && selectedFormat !== format,
          }"
        >
          <input
            v-model="selectedFormat"
            type="radio"
            :value="format"
            :disabled="!canExport && selectedFormat !== format"
            class="data-export-card__format-radio"
          />

          <div class="data-export-card__format-content">
            <div class="data-export-card__format-header">
              <span class="data-export-card__format-name">
                {{ formatLabels[format] }}
              </span>
            </div>

            <p class="data-export-card__format-description">
              {{ formatDescriptions[format] }}
            </p>
          </div>
        </label>
      </div>
    </div>

    <!-- Data Categories -->
    <div class="data-export-card__categories">
      <h3 class="data-export-card__section-title">Select Data to Export</h3>

      <div class="data-export-card__category-list">
        <label
          v-for="category in dataCategories"
          :key="category.id"
          class="data-export-card__category"
          :class="{
            'data-export-card__category--sensitive': category.sensitive,
            'data-export-card__category--disabled': !canExport && !category.included,
          }"
        >
          <input
            v-model="category.included"
            type="checkbox"
            :disabled="!canExport && !category.included"
            class="data-export-card__category-checkbox"
            @change="toggleCategory(category.id)"
          />

          <div class="data-export-card__category-content">
            <div class="data-export-card__category-header">
              <span class="data-export-card__category-name">
                {{ category.label }}
                <span
                  v-if="category.sensitive"
                  class="data-export-card__sensitive-badge"
                  title="Contains sensitive information"
                >
                  🔒
                </span>
              </span>

              <span class="data-export-card__category-size">
                {{ category.size }}
              </span>
            </div>

            <p class="data-export-card__category-description">
              {{ category.description }}
            </p>
          </div>
        </label>
      </div>

      <div class="data-export-card__summary">
        <p class="data-export-card__selected-count">
          {{ selectedCategories.length }} of {{ dataCategories.length }} categories selected
        </p>
        <p class="data-export-card__estimated-size">Estimated size: {{ estimatedSize }}</p>
      </div>
    </div>

    <!-- Export Button -->
    <div class="data-export-card__actions">
      <button
        type="button"
        class="data-export-card__export-button"
        :class="{
          'data-export-card__export-button--disabled': !canExport,
          'data-export-card__export-button--loading': isExporting,
        }"
        :disabled="!canExport"
        :aria-busy="isExporting"
        @click="handleStartExport"
      >
        <span v-if="!isExporting"> Start Export </span>
        <span v-else> Preparing Export... </span>

        <div v-if="isExporting" class="data-export-card__spinner" aria-hidden="true" />
      </button>

      <p v-if="exportError" class="data-export-card__error" role="alert">
        {{ exportError }}
      </p>
    </div>

    <!-- Export Jobs -->
    <div v-if="exportJobs.length > 0" class="data-export-card__jobs">
      <!-- Active Exports -->
      <div v-if="activeExports.length > 0" class="data-export-card__job-section">
        <h3 class="data-export-card__section-title">Export in Progress</h3>

        <div
          v-for="job in activeExports"
          :key="job.id"
          class="data-export-card__job"
          :class="`data-export-card__job--${job.status}`"
        >
          <div class="data-export-card__job-header">
            <span class="data-export-card__job-format">
              {{ formatLabels[job.format] }}
            </span>
            <span class="data-export-card__job-status">
              {{ job.status === 'preparing' ? 'Preparing' : 'Processing' }}
            </span>
          </div>

          <div class="data-export-card__job-progress">
            <div
              class="data-export-card__progress-bar"
              role="progressbar"
              :aria-valuenow="job.progress"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                class="data-export-card__progress-fill"
                :style="{ width: `${job.progress || 0}%` }"
              />
            </div>
            <span class="data-export-card__progress-text"> {{ job.progress || 0 }}% </span>
          </div>

          <button type="button" class="data-export-card__job-cancel" @click="handleCancel(job)">
            Cancel
          </button>
        </div>
      </div>

      <!-- Completed Exports -->
      <div v-if="completedExports.length > 0" class="data-export-card__job-section">
        <h3 class="data-export-card__section-title">Available Downloads</h3>

        <div
          v-for="job in completedExports"
          :key="job.id"
          class="data-export-card__job"
          :class="`data-export-card__job--${job.status}`"
        >
          <div class="data-export-card__job-header">
            <span class="data-export-card__job-format">
              {{ formatLabels[job.format] }}
            </span>
            <span class="data-export-card__job-date">
              {{ job.createdAt.toLocaleDateString() }}
            </span>
          </div>

          <p class="data-export-card__job-expiry">
            {{ formatExpiryDate(job.expiresAt) }}
          </p>

          <div class="data-export-card__job-actions">
            <button
              v-if="job.status === 'ready'"
              type="button"
              class="data-export-card__job-download"
              @click="handleDownload(job)"
            >
              Download
            </button>

            <span v-if="job.status === 'downloading'" class="data-export-card__job-downloading">
              Downloading...
            </span>

            <span v-if="job.status === 'completed'" class="data-export-card__job-completed">
              ✓ Downloaded
            </span>

            <button type="button" class="data-export-card__job-delete" @click="handleDelete(job)">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Privacy Notice -->
    <div class="data-export-card__notice">
      <p class="data-export-card__notice-text">
        🔒 Your exported data will be securely encrypted and automatically deleted after
        {{ props.exportRetentionDays }} days. Downloads are limited to
        {{ props.maxExportsPerDay }} per day for security purposes.
      </p>
    </div>
  </div>
</template>

<style lang="scss" src="./DataExportCard.scss"></style>
