const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    headless: true,
    baseURL: process.env.BASE_URL,
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    testIdAttribute: 'data-test',
    viewport: { width: 1280, height: 720 },
    browserName: 'chromium',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...require('@playwright/test').devices['Desktop Chrome'] },
    },
  ],
});
