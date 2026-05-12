import { test, expect } from "@playwright/test";
import {
  resetTestData,
  apiPost,
  apiGet,
  getAdminCookie,
  getStudentSessionCookie,
} from "./helpers/api";
import { injectCookie } from "./helpers/auth";

const PREFIX = "e2e_hwcert";
const EMAIL = `${PREFIX}_student@devopsguru.am`;
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ADMIN = process.env.ADMIN_URL ?? "http://localhost:3001";

let adminCookie: string;
let courseId: number;
let courseSlug: string;
let lessonId: number;
let assignmentId: number;
let studentSessionCookie: string; // the enrolled student's session

test.beforeAll(async () => {
  await resetTestData(PREFIX, `${PREFIX.toUpperCase()}CODE`);
  adminCookie = await getAdminCookie();

  // Create a dedicated E2E course
  courseSlug = `e2e-test-course-${Date.now()}`;
  const courseRes = await fetch(`${ADMIN}/api/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: adminCookie },
    body: JSON.stringify({
      num: "E1",
      title: "E2E Test Course",
      slug: courseSlug,
      level: "Beginner",
      accent_color: "#00d4ff",
      icon_key: "linux",
      sort_order: 99,
    }),
  });
  const courseBody = await courseRes.json() as { course: { id: number } };
  courseId = courseBody.course.id;

  // Create invite code for that course
  const inviteCode = `${PREFIX.toUpperCase()}CODE`;
  await fetch(`${ADMIN}/api/invite-codes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: adminCookie },
    body: JSON.stringify({ code: inviteCode, course_id: courseId, max_uses: 10 }),
  });

  // Create module + published lesson
  const modRes = await fetch(`${ADMIN}/api/courses/${courseId}/modules`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: adminCookie },
    body: JSON.stringify({ title: "Module 1", sort_order: 1 }),
  });
  const modBody = await modRes.json() as { module: { id: number } };
  const moduleId = modBody.module.id;

  const lessonRes = await fetch(
    `${ADMIN}/api/courses/${courseId}/modules/${moduleId}/lessons`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ title: "Lesson 1", published: true, sort_order: 1 }),
    }
  );
  lessonId = (await lessonRes.json() as { lesson: { id: number } }).lesson.id;

  // Create published assignment for this course
  const assignRes = await fetch(`${BASE}/api/dev/create-assignment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      courseId,
      lessonId,
      title: "E2E Assignment 1",
      maxScore: 100,
      published: true,
    }),
  });
  assignmentId = (await assignRes.json() as { id: number }).id;

  // Enroll the E2E student, then get their session cookie via dev endpoint
  await apiPost("/api/enroll", {
    name: "E2E HW Cert Student",
    email: EMAIL,
    code: inviteCode,
  });
  studentSessionCookie = await getStudentSessionCookie(EMAIL);
});

test.afterAll(async () => {
  await resetTestData(PREFIX);
  if (courseId) {
    await fetch(`${ADMIN}/api/courses/${courseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ is_active: false }),
    });
  }
});

async function loginAs(page: import("@playwright/test").Page): Promise<void> {
  await injectCookie(page, studentSessionCookie);
}

// Scenario 5 — submit homework via UI → admin grades → student sees grade
test("student submits homework and sees grade after admin grades it", async ({ page }) => {
  await loginAs(page);

  await page.goto("/homework");
  await expect(page.getByText("E2E Assignment 1")).toBeVisible({ timeout: 10_000 });
  await page.getByText("E2E Assignment 1").click();

  await page.getByPlaceholder("Write your solution here...").fill("My E2E homework answer");
  await page.getByRole("button", { name: "Submit assignment" }).click();

  await expect(page.getByText(/submitted|awaiting review/i)).toBeVisible({ timeout: 10_000 });

  // Admin grades
  const submissionsRes = await fetch(`${ADMIN}/api/homework`, {
    headers: { Cookie: adminCookie },
  });
  const { submissions } = await submissionsRes.json() as {
    submissions: Array<{ id: number; assignment_id: number }>;
  };
  const submission = submissions.find((s) => s.assignment_id === assignmentId);
  expect(submission).toBeDefined();

  await fetch(`${ADMIN}/api/homework/${submission!.id}/grade`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: adminCookie },
    body: JSON.stringify({ grade: 90, feedback: "Excellent work!" }),
  });

  await page.reload();
  await expect(page.getByText(/90|excellent/i).first()).toBeVisible({ timeout: 10_000 });
});

// Scenario 4 — all lessons done + all assignments passed → certificate issued
test("completing all lessons and passing homework issues a certificate", async ({ page }) => {
  // Complete the lesson via API using the enrolled student's session
  await apiPost(
    `/api/courses/${courseSlug}/lessons/${lessonId}/progress`,
    {},
    studentSessionCookie
  );

  // Check certificate via API
  const certsRes = await apiGet<{ certificates: Array<{ course_id: number }> }>(
    "/api/certificates",
    studentSessionCookie
  );
  expect(certsRes.status).toBe(200);
  const issued = certsRes.body.certificates.some((c) => c.course_id === courseId);
  expect(issued).toBe(true);

  // Also verify it shows in the UI
  await loginAs(page);
  await page.goto("/certificates");
  await expect(page.getByText(/E2E Test Course|certificate/i).first()).toBeVisible({
    timeout: 10_000,
  });
});
