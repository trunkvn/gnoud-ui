import { defineConfig, devices } from "@playwright/test";

// Its own port, so it never collides with (or hijacks) a dev server on :3000.
const PORT = 3199;

// Point the same suite at a deployed site instead: E2E_BASE_URL=https://example.com npm run e2e -w @gnoud-ui/docs
const remote = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: remote ?? `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      // Locally use the Chrome you already have; CI installs Playwright's Chromium.
      use: { ...devices["Desktop Chrome"], channel: process.env.CI ? undefined : "chrome" },
    },
  ],
  // Against a deployed site there is nothing to start.
  webServer: remote
    ? undefined
    : {
        // Tests run against the production build: `npm run build` first (turbo's e2e task does).
        command: `npx next start -p ${PORT}`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: false,
        timeout: 60_000,
      },
});
