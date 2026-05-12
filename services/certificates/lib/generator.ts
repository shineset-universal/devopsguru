import pool from "@/lib/db";
import { insertCertificate } from "./queries";

async function getPassingGrade(): Promise<number> {
  const result = await pool.query<{ value: string }>(
    "SELECT value FROM site_settings WHERE key = 'passing_grade'"
  );
  return parseInt(result.rows[0]?.value ?? "70", 10);
}

async function allLessonsComplete(
  studentId: number,
  courseId: number
): Promise<boolean> {
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
  const total = parseInt(row.total, 10);
  if (total === 0) return false;
  return parseInt(row.completed, 10) === total;
}

async function allAssignmentsPassed(
  studentId: number,
  courseId: number,
  passingGrade: number
): Promise<boolean> {
  const result = await pool.query<{ total: string; passed: string }>(
    `SELECT
       COUNT(a.id)::text AS total,
       COUNT(CASE WHEN s.grade >= $3 THEN 1 END)::text AS passed
     FROM assignments a
     LEFT JOIN submissions s ON s.assignment_id = a.id AND s.student_id = $1
     WHERE a.course_id = $2 AND a.published = true`,
    [studentId, courseId, passingGrade]
  );
  const row = result.rows[0];
  const total = parseInt(row.total, 10);
  if (total === 0) return true; // no assignments = no blocker
  return parseInt(row.passed, 10) === total;
}

async function certificateAlreadyExists(
  studentId: number,
  courseId: number
): Promise<boolean> {
  const result = await pool.query<{ exists: boolean }>(
    "SELECT EXISTS(SELECT 1 FROM certificates WHERE student_id = $1 AND course_id = $2) AS exists",
    [studentId, courseId]
  );
  return result.rows[0].exists;
}

async function generateAndUploadCertificate(
  studentId: number,
  courseId: number
): Promise<string | null> {
  try {
    const { generateCertificatePdf } = await import("./pdf");
    const { uploadCertificate } = await import("./upload");
    const pdfBuffer = await generateCertificatePdf(studentId, courseId);
    return await uploadCertificate(pdfBuffer, studentId, courseId);
  } catch (err) {
    // In dev/test, Cloudinary creds may be placeholder — cert row is still inserted with null URL
    console.warn("[cert] PDF gen/upload failed, inserting cert with null URL:", err);
    return null;
  }
}

export async function checkAndIssueCertificate(
  studentId: number,
  courseId: number
): Promise<void> {
  const passingGrade = await getPassingGrade();

  const [lessonsOk, assignmentsOk, alreadyIssued] = await Promise.all([
    allLessonsComplete(studentId, courseId),
    allAssignmentsPassed(studentId, courseId, passingGrade),
    certificateAlreadyExists(studentId, courseId),
  ]);

  if (!lessonsOk || !assignmentsOk || alreadyIssued) return;

  const certUrl = await generateAndUploadCertificate(studentId, courseId);
  await insertCertificate(studentId, courseId, certUrl);
}
