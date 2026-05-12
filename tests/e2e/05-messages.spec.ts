import { test, expect } from "@playwright/test";
import {
  resetTestData,
  apiPost,
  apiGet,
  getAdminCookie,
  getStudentSessionCookie,
} from "./helpers/api";
import { injectCookie } from "./helpers/auth";

const PREFIX = "e2e_msg";
const EMAIL = `${PREFIX}_student@devopsguru.am`;
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ADMIN = process.env.ADMIN_URL ?? "http://localhost:3001";

let studentCookie: string;
let adminCookie: string;
const COURSE_ID = 1; // Linux Basics (seeded)

test.beforeAll(async () => {
  await resetTestData(PREFIX);
  adminCookie = await getAdminCookie();

  await apiPost("/api/enroll", {
    name: "E2E Message Student",
    email: EMAIL,
    code: "LINUX2026",
  });
  studentCookie = await getStudentSessionCookie(EMAIL);
});

test.afterAll(async () => {
  await resetTestData(PREFIX);
});

// Scenario 7 — student sends message → admin replies → student sees reply
test("student sends message and sees admin reply", async () => {
  const sendRes = await apiPost<{ message: { id: number } }>(
    "/api/messages",
    { courseId: COURSE_ID, body: "Hello, I need help with Linux basics." },
    studentCookie
  );
  expect(sendRes.status).toBe(200);

  // Get all message threads as admin
  const allRes = await fetch(`${ADMIN}/api/messages`, {
    headers: { Cookie: adminCookie },
  });
  const { threads } = await allRes.json() as {
    threads: Array<{ student_id: number; course_id: number }>;
  };
  const thread = threads.find((t) => t.course_id === COURSE_ID);
  expect(thread).toBeDefined();

  // Admin replies
  const replyRes = await fetch(`${ADMIN}/api/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: adminCookie },
    body: JSON.stringify({
      course_id: COURSE_ID,
      student_id: thread!.student_id,
      body: "Hi! Check the Linux Basics module for shell commands.",
    }),
  });
  expect(replyRes.status).toBe(200);

  // Student sees the reply
  const msgRes = await apiGet<{ messages: Array<{ sender: string; body: string }> }>(
    `/api/messages?courseId=${COURSE_ID}`,
    studentCookie
  );
  expect(msgRes.status).toBe(200);
  const instructorMsgs = msgRes.body.messages.filter((m) => m.sender === "instructor");
  expect(instructorMsgs.length).toBeGreaterThan(0);
  expect(instructorMsgs[0].body).toContain("Linux Basics");
});

// Scenario 7 UI — student sees messages page in portal
test("student sees messages page in portal", async ({ page }) => {
  await injectCookie(page, studentCookie);
  await page.goto(`/messages/${COURSE_ID}`);
  await expect(page.getByText(/message|chat|help/i).first()).toBeVisible({ timeout: 10_000 });
});
