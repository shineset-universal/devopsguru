import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// Dev-only: removes all data for emails matching the given prefix.
// Used by E2E tests to clean up between runs.
export async function POST(req: NextRequest): Promise<NextResponse> {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json() as { emailPrefix: string; inviteCode?: string };
  const { emailPrefix, inviteCode } = body;
  if (!emailPrefix || !emailPrefix.startsWith("e2e_")) {
    return NextResponse.json({ error: "emailPrefix must start with e2e_" }, { status: 400 });
  }

  // Delete a specific test invite code if requested
  if (inviteCode) {
    await pool.query("DELETE FROM invite_codes WHERE code = $1", [inviteCode]);
  }

  // Delete in FK-safe order
  await pool.query(
    `DELETE FROM certificates WHERE student_id IN (SELECT id FROM students WHERE email LIKE $1)`,
    [`${emailPrefix}%`]
  );
  await pool.query(
    `DELETE FROM submissions WHERE student_id IN (SELECT id FROM students WHERE email LIKE $1)`,
    [`${emailPrefix}%`]
  );
  await pool.query(
    `DELETE FROM lesson_progress WHERE student_id IN (SELECT id FROM students WHERE email LIKE $1)`,
    [`${emailPrefix}%`]
  );
  await pool.query(
    `DELETE FROM messages WHERE student_id IN (SELECT id FROM students WHERE email LIKE $1)`,
    [`${emailPrefix}%`]
  );
  await pool.query(
    `DELETE FROM enrollments WHERE student_id IN (SELECT id FROM students WHERE email LIKE $1)`,
    [`${emailPrefix}%`]
  );
  await pool.query(
    `DELETE FROM magic_links WHERE email LIKE $1`,
    [`${emailPrefix}%`]
  );
  await pool.query(
    `DELETE FROM students WHERE email LIKE $1`,
    [`${emailPrefix}%`]
  );

  // Reset seed invite codes so repeated test runs don't exhaust max_uses
  await pool.query(
    `UPDATE invite_codes SET used_count = 0 WHERE code IN ('LINUX2026','DEVOPS2026')`
  );

  return NextResponse.json({ success: true });
}
