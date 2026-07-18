import { defineConfig, devices } from "@playwright/test";

// architecture.md §9 test #5: build + start + critical paths. Requires
// DATABASE_URL (calculator/contact/admin tests fail without one — see
// README "Local development"). Assumes an already-seeded OWNER user via
// SEED_OWNER_EMAIL/SEED_OWNER_PASSWORD for the admin login test.
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Optional escape hatch: some sandboxed environments pre-install a
        // Chromium revision that doesn't match what this pinned
        // @playwright/test version expects to download. Set
        // PLAYWRIGHT_CHROMIUM_PATH to point at it explicitly instead of
        // running `playwright install`. Unset by default — normal CI/dev
        // environments should just `npx playwright install` and rely on
        // Playwright's own resolution.
        ...(process.env.PLAYWRIGHT_CHROMIUM_PATH
          ? { launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH } }
          : {}),
      },
    },
  ],
});
