import pool from "@/lib/db";
import { checkAndIssueCertificate } from "@/services/certificates/lib/generator";

export async function gradeSubmission(
  submissionId: number,
  grade: number,
  feedback: string
): Promise<void> {
  const result = await pool.query<{
    assignment_id: number;
    student_id: number;
  }>(
    `UPDATE submissions
     SET grade = $1, feedback = $2, graded_at = NOW()
     WHERE id = $3
     RETURNING assignment_id, student_id`,
    [grade, feedback, submissionId]
  );

  const row = result.rows[0];
  if (!row) return;

  // Find which course this assignment belongs to, then check cert eligibility
  const courseResult = await pool.query<{ course_id: number }>(
    "SELECT course_id FROM assignments WHERE id = $1",
    [row.assignment_id]
  );
  const courseId = courseResult.rows[0]?.course_id;
  if (courseId) {
    await checkAndIssueCertificate(row.student_id, courseId);
  }
}
