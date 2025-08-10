/**
 * Test runner script for complete registration flow testing
 * Executes unit, integration, e2e, accessibility, and performance tests
 */

import { execSync, spawn } from 'child_process'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import chalk from 'chalk'

interface TestSuite {
  name: string
  command: string
  timeout: number
  required: boolean
  parallel?: boolean
}

interface TestResults {
  suite: string
  passed: boolean
  duration: number
  coverage?: number
  details?: any
}

const TEST_SUITES: TestSuite[] = [
  {
    name: 'Unit Tests - Composables',
    command: 'vitest run tests/unit/composables --coverage --reporter=json --reporter=verbose',
    timeout: 60000,
    required: true,
    parallel: true,
  },
  {
    name: 'Unit Tests - Components',
    command: 'vitest run tests/unit/components --coverage --reporter=json --reporter=verbose',
    timeout: 60000,
    required: true,
    parallel: true,
  },
  {
    name: 'Unit Tests - Pages',
    command: 'vitest run tests/unit/pages --coverage --reporter=json --reporter=verbose',
    timeout: 90000,
    required: true,
    parallel: true,
  },
  {
    name: 'Integration Tests',
    command: 'vitest run tests/integration --coverage --reporter=json --reporter=verbose',
    timeout: 120000,
    required: true,
    parallel: false,
  },
  {
    name: 'Accessibility Tests',
    command: 'vitest run tests/a11y --reporter=json --reporter=verbose',
    timeout: 90000,
    required: true,
    parallel: true,
  },
  {
    name: 'Performance Tests',
    command: 'vitest run tests/performance --reporter=json --reporter=verbose',
    timeout: 120000,
    required: false, // Optional for CI speed
    parallel: true,
  },
  {
    name: 'E2E Tests - Registration Flow',
    command: 'cypress run --spec "tests/e2e/registration/**/*.cy.ts" --reporter json',
    timeout: 300000,
    required: true,
    parallel: false,
  },
]

class TestRunner {
  private results: TestResults[] = []
  private startTime = Date.now()
  private options: {
    parallel: boolean
    skipOptional: boolean
    report: boolean
    bail: boolean
    coverage: boolean
    verbose: boolean
  }

  constructor(args: string[] = []) {
    this.options = {
      parallel: !args.includes('--no-parallel'),
      skipOptional: args.includes('--skip-optional'),
      report: args.includes('--report'),
      bail: args.includes('--bail'),
      coverage: !args.includes('--no-coverage'),
      verbose: args.includes('--verbose'),
    }
  }

  async run(): Promise<boolean> {
    console.log(chalk.blue.bold('\n🧪 Vana Registration Flow Test Suite\n'))
    console.log(chalk.gray('Running comprehensive tests for registration flow...\n'))

    try {
      // Check prerequisites
      await this.checkPrerequisites()

      // Get test suites to run
      const suitesToRun = this.getSuitesToRun()

      console.log(chalk.cyan(`Running ${suitesToRun.length} test suites...\n`))

      // Run tests
      if (this.options.parallel) {
        await this.runTestsInParallel(suitesToRun)
      } else {
        await this.runTestsSequentially(suitesToRun)
      }

      // Generate reports
      await this.generateReports()

      // Check results
      const success = this.checkResults()

      console.log(this.generateSummary())

      return success
    } catch (error) {
      console.error(chalk.red.bold('Test runner failed:'), error)
      return false
    }
  }

  private async checkPrerequisites(): Promise<void> {
    console.log(chalk.yellow('Checking prerequisites...'))

    // Check if node_modules exists
    if (!existsSync('node_modules')) {
      throw new Error('node_modules not found. Please run npm install.')
    }

    // Check if test dependencies are available
    const requiredDeps = ['vitest', '@vitest/coverage-v8', 'cypress', '@testing-library/vue']
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies }

    for (const dep of requiredDeps) {
      if (!allDeps[dep]) {
        throw new Error(`Missing required dependency: ${dep}`)
      }
    }

    // Check test files exist
    const testFiles = [
      'tests/unit/composables/useAuth.spec.ts',
      'tests/unit/components/RegisterButton.spec.ts',
      'tests/unit/pages/LandingPage.spec.ts',
    ]

    for (const file of testFiles) {
      if (!existsSync(file)) {
        console.warn(chalk.yellow(`Warning: Test file not found: ${file}`))
      }
    }

    console.log(chalk.green('✓ Prerequisites check passed\n'))
  }

  private getSuitesToRun(): TestSuite[] {
    let suites = [...TEST_SUITES]

    if (this.options.skipOptional) {
      suites = suites.filter(suite => suite.required)
    }

    if (this.options.verbose) {
      console.log(chalk.gray('Test suites to run:'))
      suites.forEach(suite => {
        console.log(chalk.gray(`  - ${suite.name} ${suite.required ? '(required)' : '(optional)'}`))
      })
      console.log()
    }

    return suites
  }

  private async runTestsSequentially(suites: TestSuite[]): Promise<void> {
    for (const suite of suites) {
      await this.runTestSuite(suite)

      if (this.options.bail && !this.results[this.results.length - 1]?.passed) {
        console.log(chalk.red('Bailing out due to test failure'))
        break
      }
    }
  }

  private async runTestsInParallel(suites: TestSuite[]): Promise<void> {
    // Separate parallel and sequential suites
    const parallelSuites = suites.filter(s => s.parallel !== false)
    const sequentialSuites = suites.filter(s => s.parallel === false)

    // Run parallel suites
    if (parallelSuites.length > 0) {
      console.log(chalk.cyan(`Running ${parallelSuites.length} suites in parallel...\n`))

      const promises = parallelSuites.map(suite => this.runTestSuite(suite))
      await Promise.allSettled(promises)
    }

    // Run sequential suites
    for (const suite of sequentialSuites) {
      await this.runTestSuite(suite)
    }
  }

  private async runTestSuite(suite: TestSuite): Promise<void> {
    console.log(chalk.blue(`Running: ${suite.name}`))

    const startTime = Date.now()
    let passed = false
    let details: any = {}

    try {
      // Modify command for coverage if needed
      let command = suite.command
      if (!this.options.coverage && command.includes('--coverage')) {
        command = command.replace('--coverage', '')
      }

      // Execute test command
      const result = await this.executeCommand(command, suite.timeout)

      passed = result.code === 0

      // Parse JSON output if available
      if (command.includes('--reporter=json') || command.includes('--reporter json')) {
        try {
          const jsonOutput = this.extractJsonFromOutput(result.stdout)
          if (jsonOutput) {
            details = JSON.parse(jsonOutput)
          }
        } catch (e) {
          // JSON parsing failed, use raw output
          details = { stdout: result.stdout, stderr: result.stderr }
        }
      }

      const duration = Date.now() - startTime

      this.results.push({
        suite: suite.name,
        passed,
        duration,
        coverage: this.extractCoveragePercent(result.stdout),
        details,
      })

      const statusIcon = passed ? '✅' : '❌'
      const durationText = `${duration}ms`

      console.log(chalk.gray(`${statusIcon} ${suite.name} (${durationText})`))

      if (!passed && this.options.verbose) {
        console.log(chalk.red('Error output:'))
        console.log(chalk.gray(result.stderr.slice(0, 500)))
      }
    } catch (error) {
      const duration = Date.now() - startTime

      this.results.push({
        suite: suite.name,
        passed: false,
        duration,
        details: { error: error instanceof Error ? error.message : String(error) },
      })

      console.log(chalk.red(`❌ ${suite.name} (${duration}ms) - ERROR`))
      if (this.options.verbose) {
        console.log(chalk.red(error instanceof Error ? error.message : String(error)))
      }
    }

    console.log()
  }

  private async executeCommand(
    command: string,
    timeout: number
  ): Promise<{
    code: number
    stdout: string
    stderr: string
  }> {
    return new Promise((resolve, reject) => {
      const [cmd, ...args] = command.split(' ')
      const child = spawn(cmd, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true,
        timeout,
      })

      let stdout = ''
      let stderr = ''

      child.stdout?.on('data', data => {
        stdout += data.toString()
        if (this.options.verbose) {
          process.stdout.write(data)
        }
      })

      child.stderr?.on('data', data => {
        stderr += data.toString()
        if (this.options.verbose) {
          process.stderr.write(data)
        }
      })

      child.on('close', code => {
        resolve({ code: code || 0, stdout, stderr })
      })

      child.on('error', reject)

      // Handle timeout
      setTimeout(() => {
        child.kill('SIGKILL')
        reject(new Error(`Command timed out after ${timeout}ms`))
      }, timeout)
    })
  }

  private extractJsonFromOutput(output: string): string | null {
    // Look for JSON in output (vitest and cypress both output JSON)
    const jsonMatch = output.match(/\{[\s\S]*\}/)
    return jsonMatch ? jsonMatch[0] : null
  }

  private extractCoveragePercent(output: string): number | undefined {
    // Extract coverage percentage from output
    const coverageMatch = output.match(/All files[^|]*\|\s*(\d+(?:\.\d+)?)\s*\|/)
    return coverageMatch ? parseFloat(coverageMatch[1]) : undefined
  }

  private checkResults(): boolean {
    const requiredResults = this.results.filter(
      r => TEST_SUITES.find(s => s.name === r.suite)?.required
    )

    return requiredResults.every(r => r.passed)
  }

  private async generateReports(): Promise<void> {
    if (!this.options.report) return

    console.log(chalk.yellow('Generating test reports...\n'))

    // Merge coverage reports
    if (this.options.coverage) {
      await this.mergeCoverageReports()
    }

    // Generate HTML report
    await this.generateHtmlReport()

    // Generate JUnit XML for CI
    await this.generateJunitReport()

    console.log(chalk.green('✓ Reports generated\n'))
  }

  private async mergeCoverageReports(): Promise<void> {
    try {
      // This would merge multiple coverage reports from different test suites
      // For now, we'll just copy the latest coverage report
      const coverageFiles = ['coverage/coverage-final.json']

      if (coverageFiles.some(file => existsSync(file))) {
        console.log(chalk.gray('Coverage reports available in ./coverage/'))
      }
    } catch (error) {
      console.warn(chalk.yellow('Could not merge coverage reports:'), error)
    }
  }

  private async generateHtmlReport(): Promise<void> {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Vana Registration Flow Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
    .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .suite { margin-bottom: 20px; }
    .passed { color: #28a745; }
    .failed { color: #dc3545; }
    .duration { color: #6c757d; font-size: 0.9em; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f8f9fa; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Vana Registration Flow Test Report</h1>
    <p>Generated: ${new Date().toLocaleString()}</p>
    <p>Total Duration: ${Date.now() - this.startTime}ms</p>
  </div>

  <div class="summary">
    <h2>Summary</h2>
    <p>
      <strong>Total Suites:</strong> ${this.results.length} |
      <strong class="passed">Passed:</strong> ${this.results.filter(r => r.passed).length} |
      <strong class="failed">Failed:</strong> ${this.results.filter(r => !r.passed).length}
    </p>
    <p>
      <strong>Average Coverage:</strong> 
      ${
        this.results.filter(r => r.coverage).length > 0
          ? Math.round(
              this.results.filter(r => r.coverage).reduce((sum, r) => sum + (r.coverage || 0), 0) /
                this.results.filter(r => r.coverage).length
            ) + '%'
          : 'N/A'
      }
    </p>
  </div>

  <h2>Test Results</h2>
  <table>
    <thead>
      <tr>
        <th>Test Suite</th>
        <th>Status</th>
        <th>Duration</th>
        <th>Coverage</th>
      </tr>
    </thead>
    <tbody>
      ${this.results
        .map(
          result => `
        <tr>
          <td>${result.suite}</td>
          <td class="${result.passed ? 'passed' : 'failed'}">
            ${result.passed ? '✅ PASSED' : '❌ FAILED'}
          </td>
          <td class="duration">${result.duration}ms</td>
          <td>${result.coverage ? result.coverage.toFixed(1) + '%' : 'N/A'}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>
</body>
</html>
    `.trim()

    writeFileSync('test-report.html', html)
    console.log(chalk.gray('HTML report: ./test-report.html'))
  }

  private async generateJunitReport(): Promise<void> {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<testsuites 
  tests="${this.results.length}" 
  failures="${this.results.filter(r => !r.passed).length}"
  time="${(Date.now() - this.startTime) / 1000}"
  name="Vana Registration Flow Tests"
>
  ${this.results
    .map(
      result => `
    <testsuite 
      name="${result.suite.replace(/[<>&"']/g, '')}" 
      tests="1" 
      failures="${result.passed ? 0 : 1}"
      time="${result.duration / 1000}"
    >
      <testcase name="${result.suite.replace(/[<>&"']/g, '')}" time="${result.duration / 1000}">
        ${!result.passed ? `<failure message="Test suite failed">${JSON.stringify(result.details).replace(/[<>&"']/g, '')}</failure>` : ''}
      </testcase>
    </testsuite>
  `
    )
    .join('')}
</testsuites>`.trim()

    writeFileSync('junit.xml', xml)
    console.log(chalk.gray('JUnit report: ./junit.xml'))
  }

  private generateSummary(): string {
    const total = this.results.length
    const passed = this.results.filter(r => r.passed).length
    const failed = total - passed
    const totalDuration = Date.now() - this.startTime

    const success = this.checkResults()

    let summary = `
${chalk.blue.bold('Test Summary')}
${chalk.blue('='.repeat(50))}

Total Suites: ${total}
${chalk.green(`Passed: ${passed}`)}
${chalk.red(`Failed: ${failed}`)}
Total Duration: ${totalDuration}ms

Coverage:
${
  this.results
    .filter(r => r.coverage)
    .map(r => `  ${r.suite}: ${r.coverage?.toFixed(1)}%`)
    .join('\n') || '  No coverage data available'
}

${
  success
    ? chalk.green.bold('🎉 All required tests passed!')
    : chalk.red.bold('❌ Some required tests failed')
}

Failed Suites:
${
  this.results
    .filter(r => !r.passed)
    .map(r => `  - ${r.suite}`)
    .join('\n') || '  None'
}
`

    if (this.options.report) {
      summary += `\nReports generated:
  - HTML: ./test-report.html
  - JUnit: ./junit.xml
  - Coverage: ./coverage/index.html`
    }

    return summary
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2)
  const runner = new TestRunner(args)

  runner
    .run()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
    .catch(error => {
      console.error(chalk.red.bold('Test runner crashed:'), error)
      process.exit(1)
    })
}

export default TestRunner
