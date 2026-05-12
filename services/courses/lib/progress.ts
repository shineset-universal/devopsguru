import pool from "@/lib/db";
import { checkAndIssueCertificate } from "@/services/certificates/lib/generator";

export async function markLessonComplete(
  studentId: number,
  lessonId: number
): Promise<void> {
  await pool.query(
    `INSERT INTO lesson_progress (student_id, lesson_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [studentId, lessonId]
  );
}

export async function getLessonProgress(
  studentId: number,
  courseId: number
): Promise<{ total: number; completed: number }> {
  const result = await pool.query<{ total: string; completed: string }>(
    `SELECT
       COUNT(l.id)::text AS total,
       COUNT(lp.lesson_id)::text AS completed
     FROM lessons l
     JOIN modules m ON m.id = l.module_id
     LEFT JOIN lesson_progress lp
       ON lp.lesson_id = l.id AND lp.student_id = $1
     WHERE m.course_id = $2 AND l.published = true`,
    [studentId, courseId]
  );
  const row = result.rows[0];
  return {
    total: parseInt(row.total, 10),
    completed: parseInt(row.completed, 10),
  };
}

export async function markLessonCompleteAndCheckCert(
  studentId: number,
  lessonId: number,
  courseId: number
): Promise<void> {
  await markLessonComplete(studentId, lessonId);
  await checkAndIssueCertificate(studentId, courseId);
}
