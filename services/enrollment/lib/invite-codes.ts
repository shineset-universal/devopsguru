import type { PoolClient } from "pg";
import pool from "@/lib/db";

export interface InviteCode {
  id: number;
  code: string;
  course_id: number;
  max_uses: number | null;
  used_count: number;
  expires_at: Date | null;
}

export async function validateInviteCode(
  code: string
): Promise<InviteCode | null> {
  const result = await pool.query<InviteCode>(
    `SELECT id, code, course_id, max_uses, used_count, expires_at
     FROM invite_codes
     WHERE code = $1
       AND (expires_at IS NULL OR expires_at > NOW())
       AND (max_uses IS NULL OR used_count < max_uses)`,
    [code]
  );
  return result.rows[0] ?? null;
}

export async function enrollStudentAtomic(
  studentId: number,
  courseId: number,
  inviteCodeId: number
): Promise<void> {
  const client: PoolClient = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO enrollments (student_id, course_id, invite_code_id)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING`,
      [studentId, courseId, inviteCodeId]
    );
    await client.query(
      "UPDATE invite_codes SET used_count = used_count + 1 WHERE id = $1",
      [inviteCodeId]
    );
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
