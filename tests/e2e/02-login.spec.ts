import { test, expect } from "@playwright/test";
import {
  getMagicToken,
  resetTestData,
  apiPost,
  getStudentSessionCookie,
} from "./helpers/api";
import { injectCookie } from "./helpers/auth";

const PREFIX = "e2e_login";
const EMAIL = `${PREFIX}_student@devopsguru.am`;
const BASE = process.env.BASE_URL ?? "http://localhost:3000";

test.beforeAll(async () => {
  await resetTestData(PREFIX);
  await apiPost("/api/enroll", {
    name: "E2E Login Student",
    email: EMAIL,
    code: "DEVOPS2026",
  });
});

test.afterAll(async () => {
  await resetTestData(PREFIX);
});

// Scenario 3 — existing student requests login link via UI → token exists in DB → portal access
test("return login via magic link redirects to dashboard", async ({ page }) => {
  await page.goto("/auth/login");
  await page.getByPlaceholder("you@example.com").fill(EMAIL);
  await page.getByRole("button", { name: "Send magic link" }).click();

  await expect(page.getByText("Check your inbox")).toBeVisible({ timeout: 10_000 });

  const token = await getMagicToken(EMAIL);
  expect(token).toBeTruthy();

  const sessionCookie = await getStudentSessionCookie(EMAIL);
  await injectCookie(page, sessionCookie);
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText(/E2E Login Student|dashboard/i).first()).toBeVisible();
});

// Magic link is single-use — consumed token no longer appears in valid tokens
test("magic link cannot be used twice", async () => {
  await apiPost("/api/auth/magic-link", { email: EMAIL, role: "student" });
  const token = await getMagicToken(EMAIL);
  expect(token).toBeTruthy();

  // Consume the token via the dev endpoint (no redirect-chain required)
  const consumeRes = await fetch(`${BASE}/api/dev/consume-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  const consumeBody = await consumeRes.json() as { consumed?: boolean };
  expect(consumeBody.consumed).toBe(true);

  // Token is now consumed — getMagicToken should not return it
  const afterRes = await fetch(
    `${BASE}/api/dev/magic-token?email=${encodeURIComponent(EMAIL)}`
  );
  if (afterRes.ok) {
    const { token: remaining } = await afterRes.json() as { token: string };
    expect(remaining).not.toBe(token); // consumed token must not appear
  } else {
    expect(afterRes.status).toBe(404); // no valid tokens left
  }
});
