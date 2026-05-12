import pool from "@/lib/db";

export interface Recording {
  id: number;
  course_id: number;
  lesson_id: number | null;
  title: string;
  recorded_at: Date | null;
  duration_min: number | null;
  published: boolean;
  created_at: Date;
  course_title: string;
}

export async function getEnrolledRecordings(
  studentId: number
): Promise<Recording[]> {
  const result = await pool.query<Recording>(
    `SELECT r.id, r.course_id, r.lesson_id, r.title, r.recorded_at,
            r.duration_min, r.published, r.created_at, c.title AS course_title
     FROM recordings r
     JOIN courses c ON c.id = r.course_id
     JOIN enrollments e ON e.course_id = r.course_id AND e.student_id = $1
     WHERE r.published = true
     ORDER BY r.recorded_at DESC NULLS LAST`,
    [studentId]
  );
  return result.rows;
}

export async function getRecordingVideoUrl(
  recordingId: number,
  studentId: number
): Promise<string | null> {
  const result = await pool.query<{ video_url: string }>(
    `SELECT r.video_url
     FROM recordings r
     JOIN enrollments e ON e.course_id = r.course_id AND e.student_id = $2
     WHERE r.id = $1 AND r.published = true`,
    [recordingId, studentId]
  );
  return result.rows[0]?.video_url ?? null;
}
