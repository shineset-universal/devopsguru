import pool from "@/lib/db";

export interface Message {
  id: number;
  course_id: number;
  student_id: number;
  sender: "student" | "instructor";
  body: string;
  created_at: Date;
  read_at: Date | null;
}

export async function getMessages(
  courseId: number,
  studentId: number
): Promise<Message[]> {
  const result = await pool.query<Message>(
    `SELECT id, course_id, student_id, sender, body, created_at, read_at
     FROM messages
     WHERE course_id = $1 AND student_id = $2
     ORDER BY created_at ASC`,
    [courseId, studentId]
  );

  // Mark unread instructor messages as read
  await pool.query(
    `UPDATE messages
     SET read_at = NOW()
     WHERE course_id = $1 AND student_id = $2
       AND sender = 'instructor' AND read_at IS NULL`,
    [courseId, studentId]
  );

  return result.rows;
}

export async function sendMessage(
  courseId: number,
  studentId: number,
  sender: "student" | "instructor",
  body: string
): Promise<Message> {
  const result = await pool.query<Message>(
    `INSERT INTO messages (course_id, student_id, sender, body)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [courseId, studentId, sender, body]
  );
  return result.rows[0];
}

export async function getUnreadCountForAdmin(): Promise<number> {
  const result = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count
     FROM messages
     WHERE sender = 'student' AND read_at IS NULL`
  );
  return parseInt(result.rows[0].count, 10);
}
