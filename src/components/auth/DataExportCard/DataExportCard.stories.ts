import type { Meta, StoryObj } from '@storybook/vue3'
import DataExportCard from './DataExportCard.vue'

const meta: Meta<typeof DataExportCard> = {
  title: 'Auth/Components/DataExportCard',
  component: DataExportCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'GDPR data export interface component for F001 authentication flow. Provides comprehensive data export functionality with format selection, progress tracking, and download management.',
      },
    },
  },
  argTypes: {
    availableFormats: {
      control: 'object',
      description: 'Available export formats (JSON, CSV, PDF)',
    },
    maxExportsPerDay: {
      control: 'number',
      description: 'Maximum number of exports allowed per day',
    },
    currentExportsToday: {
      control: 'number',
      description: 'Number of exports already created today',
    },
    exportRetentionDays: {
      control: 'number',
      description: 'Number of days exports are retained before deletion',
    },
    showAdvancedOptions: {
      control: 'boolean',
      description: 'Show advanced export configuration options',
    },
    title: {
      control: 'text',
      description: 'Card title text',
    },
    subtitle: {
      control: 'text',
      description: 'Card subtitle/description text',
    },
    'onStart-export': {
      action: 'start-export',
      description: 'Emitted when export is started with format and categories',
    },
    'onDownload-export': {
      action: 'download-export',
      description: 'Emitted when export download is requested',
    },
    'onDelete-export': {
      action: 'delete-export',
      description: 'Emitted when export deletion is requested',
    },
    'onCancel-export': {
      action: 'cancel-export',
      description: 'Emitted when export cancellation is requested',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DataExportCard>

// Default state - ready to export
export const Default: Story = {
  args: {
    availableFormats: ['json', 'csv', 'pdf'],
    maxExportsPerDay: 3,
    currentExportsToday: 0,
    exportRetentionDays: 30,
    showAdvancedOptions: true,
    title: 'Export Your Data',
    subtitle: 'Download a copy of your personal data for your records.',
  },
}

// Limited exports remaining
export const LimitedExports: Story = {
  args: {
    availableFormats: ['json', 'csv', 'pdf'],
    maxExportsPerDay: 3,
    currentExportsToday: 2,
    exportRetentionDays: 30,
    showAdvancedOptions: true,
    title: 'Export Your Data',
    subtitle: 'Download a copy of your personal data for your records.',
  },
  parameters: {
    docs: {
      description: {
        story: 'State when user is approaching daily export limit - shows warning message',
      },
    },
  },
}

// Export limit reached
export const ExportLimitReached: Story = {
  args: {
    availableFormats: ['json', 'csv', 'pdf'],
    maxExportsPerDay: 3,
    currentExportsToday: 3,
    exportRetentionDays: 30,
    showAdvancedOptions: true,
    title: 'Export Your Data',
    subtitle: 'Download a copy of your personal data for your records.',
  },
  parameters: {
    docs: {
      description: {
        story: 'State when daily export limit is reached - export button is disabled',
      },
    },
  },
}

// Limited formats available
export const LimitedFormats: Story = {
  args: {
    availableFormats: ['json', 'csv'],
    maxExportsPerDay: 5,
    currentExportsToday: 1,
    exportRetentionDays: 14,
    showAdvancedOptions: true,
    title: 'Export Your Data',
    subtitle: 'Download a copy of your personal data for your records.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Configuration with limited export formats available',
      },
    },
  },
}

// Shorter retention period
export const ShortRetention: Story = {
  args: {
    availableFormats: ['json', 'csv', 'pdf'],
    maxExportsPerDay: 2,
    currentExportsToday: 0,
    exportRetentionDays: 7,
    showAdvancedOptions: true,
    title: 'Quick Data Export',
    subtitle: 'Get your data quickly with 7-day retention.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Configuration with shorter data retention period (7 days instead of 30)',
      },
    },
  },
}

// Basic configuration (no advanced options)
export const BasicConfiguration: Story = {
  args: {
    availableFormats: ['json', 'csv'],
    maxExportsPerDay: 3,
    currentExportsToday: 0,
    exportRetentionDays: 30,
    showAdvancedOptions: false,
    title: 'Download Your Data',
    subtitle: 'Simple data export in JSON or CSV format.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Simplified interface without advanced export options',
      },
    },
  },
}

// Custom content and labels
export const CustomLabels: Story = {
  args: {
    availableFormats: ['json', 'pdf'],
    maxExportsPerDay: 1,
    currentExportsToday: 0,
    exportRetentionDays: 90,
    showAdvancedOptions: true,
    title: '📄 Data Archive Request',
    subtitle:
      'Create a comprehensive archive of your account data for backup or migration purposes.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom branding with different title, subtitle, and configuration',
      },
    },
  },
}

// Enterprise configuration
export const EnterpriseConfiguration: Story = {
  args: {
    availableFormats: ['json', 'csv', 'pdf'],
    maxExportsPerDay: 10,
    currentExportsToday: 2,
    exportRetentionDays: 180,
    showAdvancedOptions: true,
    title: 'Enterprise Data Export',
    subtitle: 'Export your organization data with extended retention and higher limits.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Enterprise configuration with higher limits and longer retention',
      },
    },
  },
}

// Mobile responsive view
export const MobileView: Story = {
  args: {
    availableFormats: ['json', 'csv', 'pdf'],
    maxExportsPerDay: 3,
    currentExportsToday: 1,
    exportRetentionDays: 30,
    showAdvancedOptions: true,
    title: 'Export Your Data',
    subtitle: 'Download a copy of your personal data for your records.',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-responsive view with stacked layout and touch-friendly controls',
      },
    },
  },
}

// Interactive demo with simulated progress
export const InteractiveDemo: Story = {
  render: () => ({
    components: { DataExportCard },
    data() {
      return {
        currentExports: 1,
        isExporting: false,
      }
    },
    methods: {
      handleStartExport(format: string, categories: string[]) {
        console.log('Starting export:', { format, categories })
        this.isExporting = true
        this.currentExports += 1

        // Simulate completion
        setTimeout(() => {
          this.isExporting = false
          alert(`Export started successfully! Format: ${format}, Categories: ${categories.length}`)
        }, 2000)
      },

      handleDownloadExport(jobId: string) {
        console.log('Downloading export:', jobId)
        alert(`Download started for export: ${jobId}`)
      },

      handleDeleteExport(jobId: string) {
        console.log('Deleting export:', jobId)
        alert(`Export deleted: ${jobId}`)
      },

      handleCancelExport(jobId: string) {
        console.log('Cancelling export:', jobId)
        this.isExporting = false
        alert(`Export cancelled: ${jobId}`)
      },
    },
    template: `
      <div style="max-width: 700px;">
        <DataExportCard
          :availableFormats="['json', 'csv', 'pdf']"
          :maxExportsPerDay="3"
          :currentExportsToday="currentExports"
          :exportRetentionDays="30"
          :showAdvancedOptions="true"
          @start-export="handleStartExport"
          @download-export="handleDownloadExport" 
          @delete-export="handleDeleteExport"
          @cancel-export="handleCancelExport"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo with real export simulation, progress tracking, and event handling',
      },
    },
  },
}

// All export states visualization
export const ExportStatesComparison: Story = {
  render: () => ({
    components: { DataExportCard },
    template: `
      <div style="display: grid; gap: 24px; max-width: 1400px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px;">
          <div>
            <h4 style="text-align: center; margin-bottom: 16px;">Fresh Account (No Limits)</h4>
            <div style="transform: scale(0.8); transform-origin: top;">
              <DataExportCard
                :availableFormats="['json', 'csv', 'pdf']"
                :maxExportsPerDay="3"
                :currentExportsToday="0"
                :exportRetentionDays="30"
                :showAdvancedOptions="false"
                title="New Account Export"
                subtitle="Start your first export"
              />
            </div>
          </div>
          
          <div>
            <h4 style="text-align: center; margin-bottom: 16px;">Approaching Limit</h4>
            <div style="transform: scale(0.8); transform-origin: top;">
              <DataExportCard
                :availableFormats="['json', 'csv', 'pdf']"
                :maxExportsPerDay="3"
                :currentExportsToday="2"
                :exportRetentionDays="30"
                :showAdvancedOptions="false"
                title="Limited Exports"
                subtitle="1 export remaining today"
              />
            </div>
          </div>
          
          <div>
            <h4 style="text-align: center; margin-bottom: 16px;">Limit Reached</h4>
            <div style="transform: scale(0.8); transform-origin: top;">
              <DataExportCard
                :availableFormats="['json', 'csv', 'pdf']"
                :maxExportsPerDay="3"
                :currentExportsToday="3"
                :exportRetentionDays="30"
                :showAdvancedOptions="false"
                title="Export Limit Reached"
                subtitle="Try again tomorrow"
              />
            </div>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Visual comparison of different export limit states from fresh to limited',
      },
    },
  },
}
