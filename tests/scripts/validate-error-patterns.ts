/**
 * Error Pattern Validation Script
 * Runs comprehensive tests for all critical error patterns identified
 *
 * This script validates that all the common frontend errors are properly tested
 * and prevented through our comprehensive testing suite.
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'

// Simple color functions instead of chalk
const colors = {
  red: (text: string) => `\x1b[31m${text}\x1b[0m`,
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
  blue: (text: string) => `\x1b[34m${text}\x1b[0m`,
  bold: (text: string) => `\x1b[1m${text}\x1b[0m`,
  gray: (text: string) => `\x1b[90m${text}\x1b[0m`,
}

interface TestCategory {
  name: string
  description: string
  testFiles: string[]
  criticalPatterns: string[]
}

const ERROR_PATTERN_TESTS: TestCategory[] = [
  {
    name: 'Auth0 Token Handling',
    description: 'Tests for Auth0 token type handling (string vs GetTokenSilentlyVerboseResponse)',
    testFiles: [
      'tests/unit/auth/auth0-token-handling.spec.ts',
      'tests/unit/auth/auth0-config.spec.ts',
      'tests/unit/auth/auth-composable.spec.ts',
    ],
    criticalPatterns: [
      'GetTokenSilentlyVerboseResponse',
      "typeof token === 'string'",
      'token.access_token',
      'auth0Client.getAccessTokenSilently',
    ],
  },
  {
    name: 'Vue Composition API useAttrs',
    description: 'Tests for proper useAttrs usage and clickable logic detection',
    testFiles: [
      'tests/unit/components/BaseBadge.spec.ts',
      'tests/unit/components/BaseInputText.spec.ts',
    ],
    criticalPatterns: ['useAttrs', 'attrs.onClick', 'attrs.onMousedown', 'badge--clickable'],
  },
  {
    name: 'Event Handler Types',
    description: 'Tests for proper event type handling and conversion',
    testFiles: ['tests/unit/components/event-handler-types.spec.ts'],
    criticalPatterns: ['MouseEvent', 'KeyboardEvent', 'FocusEvent', 'event type conversion'],
  },
  {
    name: 'Asset Loading Validation',
    description: 'Tests for proper asset path handling (@/assets/ vs absolute paths)',
    testFiles: ['tests/unit/assets/asset-loading.spec.ts'],
    criticalPatterns: ['@/assets/', 'asset path validation', '/src/assets/', 'Failed to resolve'],
  },
  {
    name: 'Web Vitals Integration',
    description: 'Tests for web-vitals library import and usage',
    testFiles: ['tests/performance/web-vitals-integration.spec.ts'],
    criticalPatterns: ['onLCP', 'onFCP', 'onCLS', 'onTTFB', 'onINP', 'Metric interface'],
  },
  {
    name: 'TypeScript Generic Types',
    description: 'Tests for proper generic type handling',
    testFiles: ['tests/unit/types/typescript-generics.spec.ts'],
    criticalPatterns: ['RenderOptions', 'generic constraints', 'type safety', 'ExtractProps'],
  },
  {
    name: 'Storybook Stories Validation',
    description: 'Tests for proper Storybook story variant usage',
    testFiles: ['tests/unit/storybook/stories-validation.spec.ts'],
    criticalPatterns: [
      'VALID_.*_VARIANTS',
      'story.args.variant',
      'component variants',
      'story validation',
    ],
  },
]

class ErrorPatternValidator {
  private results: { category: string; passed: number; failed: number; missing: string[] }[] = []

  async validateAllPatterns(): Promise<void> {
    console.log(colors.blue(colors.bold('\n🧪 Validating Critical Error Pattern Tests\n')))

    for (const category of ERROR_PATTERN_TESTS) {
      await this.validateCategory(category)
    }

    this.printSummary()
  }

  private async validateCategory(category: TestCategory): Promise<void> {
    console.log(colors.yellow(`\n📋 ${category.name}`))
    console.log(colors.gray(`   ${category.description}\n`))

    const missingFiles: string[] = []
    let passed = 0
    let failed = 0

    for (const testFile of category.testFiles) {
      const exists = existsSync(testFile)

      if (!exists) {
        missingFiles.push(testFile)
        console.log(chalk.red(`   ❌ Missing: ${testFile}`))
        failed++
        continue
      }

      try {
        // Run the specific test file
        execSync(`npm run test -- "${testFile}" --reporter=verbose`, {
          stdio: 'pipe',
          timeout: 30000,
        })
        console.log(chalk.green(`   ✅ Passed: ${testFile}`))
        passed++
      } catch (error) {
        console.log(chalk.red(`   ❌ Failed: ${testFile}`))
        console.log(chalk.red(`      Error: ${error.message?.split('\n')[0] || 'Unknown error'}`))
        failed++
      }
    }

    this.results.push({
      category: category.name,
      passed,
      failed,
      missing: missingFiles,
    })
  }

  private printSummary(): void {
    console.log(chalk.blue.bold('\n📊 VALIDATION SUMMARY\n'))

    let totalPassed = 0
    let totalFailed = 0
    let totalMissing = 0

    this.results.forEach(result => {
      totalPassed += result.passed
      totalFailed += result.failed
      totalMissing += result.missing.length

      const status =
        result.failed === 0 && result.missing.length === 0
          ? chalk.green('✅ PASS')
          : chalk.red('❌ FAIL')

      console.log(`${status} ${result.category}`)
      console.log(`     Passed: ${chalk.green(result.passed)}`)
      console.log(`     Failed: ${chalk.red(result.failed)}`)
      if (result.missing.length > 0) {
        console.log(`     Missing: ${chalk.yellow(result.missing.length)}`)
      }
      console.log('')
    })

    console.log(chalk.blue('='.repeat(50)))
    console.log(chalk.green(`Total Passed: ${totalPassed}`))
    console.log(chalk.red(`Total Failed: ${totalFailed}`))
    console.log(chalk.yellow(`Total Missing: ${totalMissing}`))

    if (totalFailed === 0 && totalMissing === 0) {
      console.log(chalk.green.bold('\n🎉 All critical error patterns are properly tested!'))
    } else {
      console.log(chalk.red.bold('\n⚠️  Some critical error patterns need attention!'))

      if (totalMissing > 0) {
        console.log(chalk.yellow('\nMissing test files need to be created.'))
      }

      if (totalFailed > 0) {
        console.log(chalk.red('\nFailing tests need to be fixed.'))
      }
    }
  }
}

// Additional utility functions
export const validateSpecificPattern = async (patternName: string): Promise<void> => {
  const pattern = ERROR_PATTERN_TESTS.find(p =>
    p.name.toLowerCase().includes(patternName.toLowerCase())
  )

  if (!pattern) {
    console.log(chalk.red(`Pattern "${patternName}" not found`))
    return
  }

  const validator = new ErrorPatternValidator()
  await validator.validateCategory(pattern)
}

export const listAllPatterns = (): void => {
  console.log(chalk.blue.bold('\n📋 Available Error Pattern Tests:\n'))

  ERROR_PATTERN_TESTS.forEach((pattern, index) => {
    console.log(`${chalk.yellow(index + 1)}. ${chalk.bold(pattern.name)}`)
    console.log(`   ${chalk.gray(pattern.description)}`)
    console.log(`   Files: ${pattern.testFiles.length}`)
    console.log('')
  })
}

export const runCriticalTests = async (): Promise<void> => {
  console.log(chalk.blue.bold('\n🚨 Running Critical Error Pattern Tests\n'))

  try {
    // Run all tests in the error pattern categories
    const criticalTestPaths = ERROR_PATTERN_TESTS.flatMap(category => category.testFiles).join(' ')

    execSync(`npm run test -- ${criticalTestPaths} --reporter=verbose --coverage`, {
      stdio: 'inherit',
    })

    console.log(chalk.green.bold('\n✅ All critical tests passed!'))
  } catch (error) {
    console.log(chalk.red.bold('\n❌ Some critical tests failed!'))
    console.log(chalk.red(error.message))
    process.exit(1)
  }
}

// Main execution
const isMainModule = import.meta.url === `file://${process.argv[1]}`

if (isMainModule) {
  const validator = new ErrorPatternValidator()

  const command = process.argv[2]

  switch (command) {
    case 'validate':
      validator.validateAllPatterns().catch(console.error)
      break
    case 'pattern':
      const patternName = process.argv[3]
      if (!patternName) {
        console.log(chalk.red('Please specify a pattern name'))
        break
      }
      validateSpecificPattern(patternName).catch(console.error)
      break
    case 'list':
      listAllPatterns()
      break
    case 'critical':
      runCriticalTests().catch(console.error)
      break
    default:
      console.log(chalk.blue.bold('Error Pattern Validation Tool\n'))
      console.log('Commands:')
      console.log('  validate  - Validate all error patterns')
      console.log('  pattern <name> - Validate specific pattern')
      console.log('  list      - List all available patterns')
      console.log('  critical  - Run all critical tests')
      break
  }
}
