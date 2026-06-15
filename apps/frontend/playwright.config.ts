import { defineConfig, devices } from '@playwright/test';

/**
 * Real full-stack e2e: Playwright boots the Angular dev server and the Spring Boot
 * backend, then drives the login flow against the real API.
 * Postgres must be up first (the `make test-e2e` target brings it up).
 */
export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  workers: 1,
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4200',
    headless: false,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm start',
      url: 'http://localhost:4200',
      timeout: 120_000,
      reuseExistingServer: true,
    },
    {
      command: './mvnw spring-boot:run',
      cwd: '../backend',
      url: 'http://localhost:8080/health',
      timeout: 120_000,
      reuseExistingServer: true,
    },
  ],
});
