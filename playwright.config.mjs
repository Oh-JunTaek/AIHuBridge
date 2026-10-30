import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://127.0.0.1:5293/AIHuBridge/',
    browserName: 'chromium',
    ...(process.env.PLAYWRIGHT_CHROME === '1' ? { channel: 'chrome' } : {}),
    reducedMotion: 'reduce',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 5'], defaultBrowserType: 'chromium' } },
  ],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 5293 --strictPort',
    url: 'http://127.0.0.1:5293/AIHuBridge/',
    reuseExistingServer: false,
    timeout: 30000,
  },
});
