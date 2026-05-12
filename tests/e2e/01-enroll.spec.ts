import { test, expect } from "@playwright/test";
import { getMagicToken, resetTestData, getStudentSessionCookie, apiGet } from "./helpers/api";
import { injectCookie } from "./helpers/auth";

const PREFIX = "e2e_enroll";
const EMAIL = `${PREFIX}_student@devopsguru.am`;
const BASE = process.env.BASE_URL ?? "http://localhost:3000";

test.beforeEach(async () => {
  await resetTestData(PREFIX);
});

test.afterAll(async () => {
  await resetTestData(PREFIX);
});

// Scenario 1 — valid invite code → enrolled → magic link → portal access
test("valid invite code enrolls student and grants portal access", async ({ page }) => {
  // Step 1: Submit enroll form in browser
  await page.goto("/enroll");
  await page.getByPlaceholder("Your full name").fill("E2E Enroll Student");
  await page.getByPlaceholder("you@example.com").fill(EMAIL);
  await page.getByPlaceholder("DEVOPS2026").fill("LINUX2026");
  await page.getByRole("button", { name: "Create my account" }).click();

  // Step 2: UI transitions to "Check your inbox"
  await expect(page.getByText("Check your inbox")).toBeVisible({ timeout: 15_000 });

  // Step 3: Magic link token was saved to DB — student can authenticate
  const token = await getMagicToken(EMAIL);
  expect(token).toBeTruthy();

  // Step 4: Inject session cookie and confirm portal is accessible
  const sessionCookie = await getStudentSessionCookie(EMAIL);
  await injectCookie(page, sessionCookie);
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText(/dashboard/i).first()).toBeVisible({ timeout: 8_000 });
});

// Scenario 2a — invalid invite code → error shown in UI
test("invalid invite code shows error", async ({ page }) => {
  await page.goto("/enroll");
  await page.getByPlaceholder("Your full name").fill("Bad Code Student");
  await page.getByPlaceholder("you@example.com").fill(`${PREFIX}_bad@devopsguru.am`);
  await page.getByPlaceholder("DEVOPS2026").fill("INVALIDCODE999");
  await page.getByRole("button", { name: "Create my account" }).click();

  await expect(page.getByText(/invalid|expired|not found/i)).toBeVisible({ timeout: 10_000 });
  await expect(page).toHaveURL(/\/enroll/);
});

// Scenario 2b — expired invite code is rejected at API level
test("expired invite code is rejected by the API", async () => {
  const res = await fetch(`${BASE}/api/enroll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Expired Test",
      email: `${PREFIX}_expired@devopsguru.am`,
      code: "EXPIREDCODE",
    }),
  });
  const body = await res.json() as { error: string };
  expect(res.status).toBe(400);
  expect(body.error).toMatch(/invalid|expired/i);
});
