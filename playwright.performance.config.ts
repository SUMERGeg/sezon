import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

export default defineConfig({
  ...base,
  testDir: "./tests/performance",
  workers: 1,
  timeout: 60_000,
  projects: [{ name: "mobile-lab", use: { browserName: "chromium", viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 } }],
});
