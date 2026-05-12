import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import pool from "@/lib/db";

const schema = z.object({
  grade: z.number().int().min(0).max(100),
  feedback: z.string().max(5000).default(""),
});

async function triggerCertificateCheck(
  studentId: number,
  courseId: number
): Promise<void> {
  const passingGradeResult = await pool.query<{ value: string }>(
    "SELECT value FROM site_settings WHERE key = 'passing_grade'"
  );
  const passingGrade = parseInt(
    passingGradeResult.rows[0]?.value ?? "70",
    10
  );

  const lessonsResult = await pool.query<{ total: string; completed: string }>(
    `SELECT COUNT(l.id)::text AS total,
            COUNT(lp.lesson_id)::text AS completed
     FROM lessons l
     JOIN modules m ON m.id = l.module_id
     LEFT JOIN lesson_progress lp
       ON lp.lesson_id = l.id AND lp.student_id = $1
     WHERE m.course_id = $2 AND l.published = true`,
    [studentId, courseId]
  );
  const lRow = lessonsResult.rows[0];
  const totalLessons = parseInt(lRow.total, 10);
  if (totalLessons === 0 || parseInt(lRow.completed, 10) < totalLessons) return;

  const hwResult = await pool.query<{ total: string; passed: string }>(
    `SELECT COUNT(a.id)::text AS total,
            COUNT(CASE WHEN s.grade >= $3 THEN 1 END)::text AS passed
     FROM assignments a
     LEFT JOIN submissions s ON s.assignment_id = a.id AND s.student_id = $1
     WHERE a.course_id = $2 AND a.published = true`,
    [studentId, courseId, passingGrade]
  );
  const hRow = hwResult.rows[0];
  const totalHw = parseInt(hRow.total, 10);
  if (totalHw > 0 && parseInt(hRow.passed, 10) < totalHw) return;

  const existsResult = await pool.query<{ exists: boolean }>(
    "SELECT EXISTS(SELECT 1 FROM certificates WHERE student_id=$1 AND course_id=$2) AS exists",
    [studentId, courseId]
  );
  if (existsResult.rows[0].exists) return;

  // Issue cert synchronously via main app API (same Docker network)
  const appUrl = process.env.APP_INTERNAL_URL ?? "http://devopsguru-app:3000";
  await fetch(`${appUrl}/api/internal/issue-certificate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, courseId }),
  }).catch(console.error);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const submissionId = parseInt(id, 10);
    if (isNaN(submissionId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const result = await pool.query<{
      assignment_id: number;
      student_id: number;
    }>(
      `UPDATE submissions
       SET grade = $1, feedback = $2, graded_at = NOW()
       WHERE id = $3
       RETURNING assignment_id, student_id`,
      [parsed.data.grade, parsed.data.feedback, submissionId]
    );

    if (!result.rows[0]) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { assignment_id, student_id } = result.rows[0];
    const courseResult = await pool.query<{ course_id: number }>(
      "SELECT course_id FROM assignments WHERE id = $1",
      [assignment_id]
    );
    const courseId = courseResult.rows[0]?.course_id;
    if (courseId) {
      triggerCertificateCheck(student_id, courseId).catch(console.error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/homework/[id]/grade admin]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
