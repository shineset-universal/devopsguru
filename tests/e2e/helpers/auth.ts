import { type Page } from "@playwright/test";
import { getMagicToken } from "./api";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ADMIN = process.env.ADMIN_URL ?? "http://localhost:3001";

// Inject a `name=value` cookie string into the browser context.
export async function injectCookie(page: Page, cookieStr: string): Promise<void> {
  const eqIdx = cookieStr.indexOf("=");
  const name = cookieStr.slice(0, eqIdx);
  const value = cookieStr.slice(eqIdx + 1);
  await page.context().addCookies([{
    name,
    value,
    domain: new URL(BASE).hostname,
    path: "/",
    httpOnly: true,
    secure: false,
  }]);
}

// Log in via magic link flow: POST magic-link, get token from DB, visit verify URL.
export async function loginViaMagicLink(
  page: Page,
  email: string,
  role: "student" | "admin" = "student"
): Promise<void> {
  const url = role === "admin" ? `${ADMIN}/api/auth/magic-link` : `${BASE}/api/auth/magic-link`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, role }),
  });
  const token = await getMagicToken(email);
  await page.goto(`${BASE}/auth/verify?token=${token}`);
}

// Navigate dev-login shortcut.
export async function devLoginStudent(page: Page): Promise<void> {
  await page.goto(`${BASE}/api/dev-login`);
}

export async function devLoginAdmin(page: Page): Promise<void> {
  await page.goto(`${ADMIN}/api/dev-login`);
}
