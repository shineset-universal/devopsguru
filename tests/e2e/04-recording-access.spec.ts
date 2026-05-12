import { test, expect } from "@playwright/test";
import {
  resetTestData,
  apiPost,
  apiGet,
  getAdminCookie,
  getStudentSessionCookie,
} from "./helpers/api";

const PREFIX = "e2e_rec";
const ENROLLED_EMAIL = `${PREFIX}_enrolled@devopsguru.am`;
const UNENROLLED_EMAIL = `${PREFIX}_unenrolled@devopsguru.am`;
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ADMIN = process.env.ADMIN_URL ?? "http://localhost:3001";

let recordingId: number;
let enrolledCookie: string;
let unenrolledCookie: string;

test.beforeAll(async () => {
  await resetTestData(PREFIX);
  const adminCookie = await getAdminCookie();

  // Create a recording linked to course 1 (Linux Basics — seeded)
  const recRes = await fetch(`${ADMIN}/api/recordings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: adminCookie },
    body: JSON.stringify({
      course_id: 1,
      title: "E2E Recording",
      video_url: "https://res.cloudinary.com/test/video/e2e-test.mp4",
      published: true,
    }),
  });
  const recBody = await recRes.json() as { recording: { id: number } };
  recordingId = recBody.recording.id;

  // Enroll one student in course 1 (Linux Basics)
  await apiPost("/api/enroll", {
    name: "E2E Enrolled Student",
    email: ENROLLED_EMAIL,
    code: "LINUX2026",
  });
  enrolledCookie = await getStudentSessionCookie(ENROLLED_EMAIL);

  // Enroll a second student in course 5 — not course 1, so no access to its recordings
  await apiPost("/api/enroll", {
    name: "E2E Unenrolled Student",
    email: UNENROLLED_EMAIL,
    code: "DEVOPS2026",
  });
  unenrolledCookie = await getStudentSessionCookie(UNENROLLED_EMAIL);
});

test.afterAll(async () => {
  await resetTestData(PREFIX);
});

// Scenario 6a — enrolled student can access recording listing
test("enrolled student sees recordings list", async () => {
  const res = await apiGet<{ recordings: Array<{ id: number }> }>(
    "/api/recordings",
    enrolledCookie
  );
  expect(res.status).toBe(200);
  const ids = res.body.recordings.map((r) => r.id);
  expect(ids).toContain(recordingId);
});

// Scenario 6b — unenrolled student cannot access recording video
test("unenrolled student is blocked from recording video", async () => {
  const res = await fetch(
    `${BASE}/api/recordings/${recordingId}/video`,
    { headers: { Cookie: unenrolledCookie } }
  );
  expect(res.status).toBe(404);
});

// Scenario 6c — unauthenticated request is rejected
test("unauthenticated request to recordings returns 401", async () => {
  const res = await apiGet("/api/recordings");
  expect(res.status).toBe(401);
});
