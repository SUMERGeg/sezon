import { defineConfig } from "@playwright/test";

const basePath = (process.env.PAGES_BASE_PATH || "").replace(/\/$/, "");
export default defineConfig({
  testDir: "./tests/pages",
  fullyParallel: true,
  workers: 2,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: "list",
  use: { baseURL: `http://127.0.0.1:3002${basePath}/`, trace: "retain-on-failure" },
  projects: [
    { name: "mobile", use: { browserName: "chromium", viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 } },
    { name: "desktop", use: { browserName: "chromium", viewport: { width: 1440, height: 1000 } } },
  ],
  webServer: { command: "npm run preview:pages", url: `http://127.0.0.1:3002${basePath}/`, reuseExistingServer: false },
});
