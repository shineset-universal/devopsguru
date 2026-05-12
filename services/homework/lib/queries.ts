import pool from "@/lib/db";

export interface Assignment {
  id: number;
  course_id: number;
  lesson_id: number | null;
  title: string;
  description: string | null;
  due_date: Date | null;
  max_score: number;
  published: boolean;
  created_at: Date;
  course_title: string;
  submission: Submission | null;
}

export interface Submission {
  id: number;
  assignment_id: number;
  student_id: number;
  content: string | null;
  file_url: string | null;
  submitted_at: Date;
  grade: number | null;
  feedback: string | null;
  graded_at: Date | null;
}

export async function getAssignmentsForStudent(
  studentId: number
): Promise<Assignment[]> {
  const result = await pool.query<
    Omit<Assignment, "submission"> & {
      sub_id: number | null;
      sub_content: string | null;
      sub_file_url: string | null;
      sub_submitted_at: Date | null;
      sub_grade: number | null;
      sub_feedback: string | null;
      sub_graded_at: Date | null;
    }
  >(
    `SELECT a.id, a.course_id, a.lesson_id, a.title, a.description,
            a.due_date, a.max_score, a.published, a.created_at,
            c.title AS course_title,
            s.id       AS sub_id,
            s.content  AS sub_content,
            s.file_url AS sub_file_url,
            s.submitted_at AS sub_submitted_at,
            s.grade    AS sub_grade,
            s.feedback AS sub_feedback,
            s.graded_at AS sub_graded_at
     FROM assignments a
     JOIN courses c ON c.id = a.course_id
     JOIN enrollments e ON e.course_id = a.course_id AND e.student_id = $1
     LEFT JOIN submissions s ON s.assignment_id = a.id AND s.student_id = $1
     WHERE a.published = true
     ORDER BY a.due_date ASC NULLS LAST`,
    [studentId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    course_id: row.course_id,
    lesson_id: row.lesson_id,
    title: row.title,
    description: row.description,
    due_date: row.due_date,
    max_score: row.max_score,
    published: row.published,
    created_at: row.created_at,
    course_title: row.course_title,
    submission: row.sub_id
      ? {
          id: row.sub_id,
          assignment_id: row.id,
          student_id: studentId,
          content: row.sub_content,
          file_url: row.sub_file_url,
          submitted_at: row.sub_submitted_at!,
          grade: row.sub_grade,
          feedback: row.sub_feedback,
          graded_at: row.sub_graded_at,
        }
      : null,
  }));
}

export async function getAssignmentById(
  assignmentId: number,
  studentId: number
): Promise<Assignment | null> {
  const rows = await getAssignmentsForStudent(studentId);
  return rows.find((a) => a.id === assignmentId) ?? null;
}

export async function submitHomework(
  assignmentId: number,
  studentId: number,
  content: string,
  fileUrl?: string
): Promise<Submission> {
  // Only allow submission if not yet graded
  const existing = await pool.query<{ graded_at: Date | null }>(
    "SELECT graded_at FROM submissions WHERE assignment_id = $1 AND student_id = $2",
    [assignmentId, studentId]
  );
  if (existing.rows[0]?.graded_at) {
    throw new Error("ALREADY_GRADED");
  }

  const result = await pool.query<Submission>(
    `INSERT INTO submissions (assignment_id, student_id, content, file_url)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (assignment_id, student_id)
     DO UPDATE SET content = EXCLUDED.content,
                   file_url = EXCLUDED.file_url,
                   submitted_at = NOW()
     RETURNING *`,
    [assignmentId, studentId, content, fileUrl ?? null]
  );
  return result.rows[0];
}
