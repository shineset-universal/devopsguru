// Thin wrappers around the app's JSON API, used from E2E tests.
// All requests go to BASE_URL (the running Next.js app in Docker).

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ADMIN = process.env.ADMIN_URL ?? "http://localhost:3001";

export async function apiPost<T = unknown>(
  path: string,
  body: unknown,
  cookie?: string
): Promise<{ status: number; body: T }> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(body),
    redirect: "manual",
  });
  const text = await res.text();
  let json: T;
  try { json = JSON.parse(text) as T; } catch { json = text as unknown as T; }
  return { status: res.status, body: json };
}

export async function apiGet<T = unknown>(
  path: string,
  cookie?: string
): Promise<{ status: number; body: T }> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { ...(cookie ? { Cookie: cookie } : {}) },
    redirect: "manual",
  });
  const text = await res.text();
  let json: T;
  try { json = JSON.parse(text) as T; } catch { json = text as unknown as T; }
  return { status: res.status, body: json };
}

export async function adminApiPost<T = unknown>(
  path: string,
  body: unknown,
  cookie: string
): Promise<{ status: number; body: T }> {
  const res = await fetch(`${ADMIN}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json: T;
  try { json = JSON.parse(text) as T; } catch { json = text as unknown as T; }
  return { status: res.status, body: json };
}

export async function adminApiGet<T = unknown>(
  path: string,
  cookie: string
): Promise<{ status: number; body: T }> {
  const res = await fetch(`${ADMIN}${path}`, {
    headers: { Cookie: cookie },
  });
  const text = await res.text();
  let json: T;
  try { json = JSON.parse(text) as T; } catch { json = text as unknown as T; }
  return { status: res.status, body: json };
}

// Get a session cookie directly for a student email (dev only — no magic link needed).
export async function getStudentSessionCookie(email: string): Promise<string> {
  const res = await fetch(
    `${BASE}/api/dev/session?email=${encodeURIComponent(email)}`
  );
  if (!res.ok) throw new Error(`No session for ${email}: ${res.status}`);
  const { cookie } = await res.json() as { cookie: string };
  return cookie;
}

// Get the latest magic link token for an email (dev helper endpoint).
export async function getMagicToken(email: string): Promise<string> {
  const res = await fetch(
    `${BASE}/api/dev/magic-token?email=${encodeURIComponent(email)}`
  );
  if (!res.ok) throw new Error(`No magic token for ${email}: ${res.status}`);
  const { token } = await res.json() as { token: string };
  return token;
}

// Clean all e2e_ prefixed test data. Pass inviteCode to also delete a test invite code.
export async function resetTestData(emailPrefix: string, inviteCode?: string): Promise<void> {
  await fetch(`${BASE}/api/dev/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailPrefix, inviteCode }),
  });
}

// Get a session cookie by visiting dev-login (student).
export async function getStudentCookie(): Promise<string> {
  const res = await fetch(`${BASE}/api/dev-login`, { redirect: "manual" });
  const setCookie = res.headers.get("set-cookie") ?? "";
  const match = setCookie.match(/session=[^;]+/);
  if (!match) throw new Error("dev-login did not set session cookie");
  return match[0];
}

// Get an admin session cookie.
export async function getAdminCookie(): Promise<string> {
  const res = await fetch(`${ADMIN}/api/dev-login`, { redirect: "manual" });
  const setCookie = res.headers.get("set-cookie") ?? "";
  const match = setCookie.match(/admin_session=[^;]+/);
  if (!match) throw new Error("admin dev-login did not set admin_session cookie");
  return match[0];
}
