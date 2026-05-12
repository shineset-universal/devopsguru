import { test, expect } from "@playwright/test";
import {
  resetTestData,
  apiPost,
  apiGet,
  getAdminCookie,
  getStudentSessionCookie,
} from "./helpers/api";

const PREFIX = "e2e_admin";
const STUDENT_EMAIL = `${PREFIX}_newstudent@devopsguru.am`;
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ADMIN = process.env.ADMIN_URL ?? "http://localhost:3001";

let adminCookie: string;
let newCourseId: number;
let newCourseSlug: string;

test.beforeAll(async () => {
  await resetTestData(PREFIX);
  adminCookie = await getAdminCookie();
});

test.afterAll(async () => {
  await resetTestData(PREFIX);
  if (newCourseId) {
    await fetch(`${ADMIN}/api/courses/${newCourseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ is_active: false }),
    });
  }
});

// Scenario 8 — Admin creates course → invite code → student enrolls
test("admin creates course, generates invite code, student enrolls successfully", async ({ page }) => {
  // Step 1: Admin creates a new course via API
  newCourseSlug = `e2e-admin-course-${Date.now()}`;
  const courseRes = await fetch(`${ADMIN}/api/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: adminCookie },
    body: JSON.stringify({
      num: "E2",
      title: "E2E Admin Created Course",
      slug: newCourseSlug,
      level: "Beginner",
      accent_color: "#00d4ff",
      icon_key: "linux",
      sort_order: 98,
    }),
  });
  expect(courseRes.status).toBe(201);
  const courseBody = await courseRes.json() as { course: { id: number } };
  newCourseId = courseBody.course.id;

  // Step 2: Admin creates an invite code for the new course
  const inviteCode = `E2EADMIN${Date.now().toString().slice(-6)}`;
  const inviteRes = await fetch(`${ADMIN}/api/invite-codes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: adminCookie },
    body: JSON.stringify({
      code: inviteCode,
      course_id: newCourseId,
      max_uses: 5,
    }),
  });
  expect(inviteRes.status).toBe(201);

  // Step 3: Student uses the invite code to enroll
  const enrollRes = await apiPost<{ success: boolean }>("/api/enroll", {
    name: "E2E Admin Flow Student",
    email: STUDENT_EMAIL,
    code: inviteCode,
  });
  expect(enrollRes.status).toBe(200);
  expect(enrollRes.body.success).toBe(true);

  // Step 4: Student can access the portal with their session
  const sessionCookie = await getStudentSessionCookie(STUDENT_EMAIL);
  const coursesRes = await apiGet<{ courses: unknown[] }>("/api/courses", sessionCookie);
  expect(coursesRes.status).toBe(200);

  // Step 5: Admin can see the student in the students list
  const studentsRes = await fetch(`${ADMIN}/api/students`, {
    headers: { Cookie: adminCookie },
  });
  const { students } = await studentsRes.json() as {
    students: Array<{ email: string }>;
  };
  const found = students.some((s) => s.email === STUDENT_EMAIL);
  expect(found).toBe(true);
});

// Admin can view and update dashboard stats
test("admin dashboard stats returns correct shape", async () => {
  const res = await fetch(`${ADMIN}/api/dashboard/stats`, {
    headers: { Cookie: adminCookie },
  });
  expect(res.status).toBe(200);
  const body = await res.json() as {
    totalStudents: number;
    activeCourses: number;
    unreadMessages: number;
    pendingHomework: number;
  };
  expect(typeof body.totalStudents).toBe("number");
  expect(typeof body.activeCourses).toBe("number");
  expect(typeof body.unreadMessages).toBe("number");
  expect(typeof body.pendingHomework).toBe("number");
  expect(body.activeCourses).toBeGreaterThan(0); // seed has 9 courses
});

// Admin can list and create invite codes
test("admin can list all invite codes", async () => {
  const res = await fetch(`${ADMIN}/api/invite-codes`, {
    headers: { Cookie: adminCookie },
  });
  expect(res.status).toBe(200);
  const { inviteCodes } = await res.json() as { inviteCodes: unknown[] };
  expect(Array.isArray(inviteCodes)).toBe(true);
  expect(inviteCodes.length).toBeGreaterThan(0);
});

// Unauthenticated admin API request is rejected
test("unauthenticated admin API request returns 401", async () => {
  const res = await fetch(`${ADMIN}/api/students`);
  expect(res.status).toBe(401);
});
