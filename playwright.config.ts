import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  retries: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.BOOKER_BASE_URL || "https://restful-booker.herokuapp.com",
    extraHTTPHeaders: { "Content-Type": "application/json" }
  }
});
