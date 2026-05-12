import pool from "@/lib/db";

export interface LiveSession {
  id: number;
  course_id: number;
  title: string;
  description: string | null;
  scheduled_at: Date;
  duration_min: number;
  meeting_url: string | null;
  notes: string | null;
  created_at: Date;
  course_title: string;
}

export async function getUpcomingSessions(
  studentId: number
): Promise<LiveSession[]> {
  const result = await pool.query<LiveSession>(
    `SELECT ls.id, ls.course_id, ls.title, ls.description, ls.scheduled_at,
            ls.duration_min, ls.meeting_url, ls.notes, ls.created_at,
            c.title AS course_title
     FROM live_sessions ls
     JOIN courses c ON c.id = ls.course_id
     JOIN enrollments e ON e.course_id = ls.course_id AND e.student_id = $1
     WHERE ls.scheduled_at >= NOW()
     ORDER BY ls.scheduled_at ASC`,
    [studentId]
  );
  return result.rows;
}

export async function getPastSessions(
  studentId: number
): Promise<LiveSession[]> {
  const result = await pool.query<LiveSession>(
    `SELECT ls.id, ls.course_id, ls.title, ls.description, ls.scheduled_at,
            ls.duration_min, ls.meeting_url, ls.notes, ls.created_at,
            c.title AS course_title
     FROM live_sessions ls
     JOIN courses c ON c.id = ls.course_id
     JOIN enrollments e ON e.course_id = ls.course_id AND e.student_id = $1
     WHERE ls.scheduled_at < NOW()
     ORDER BY ls.scheduled_at DESC
     LIMIT 20`,
    [studentId]
  );
  return result.rows;
}
