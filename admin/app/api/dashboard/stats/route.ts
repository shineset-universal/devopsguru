import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import pool from "@/lib/db";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await pool.query<{
      total_students: string;
      active_courses: string;
      unread_messages: string;
      pending_homework: string;
    }>(
      `SELECT
         (SELECT COUNT(*) FROM students WHERE is_active = true)::text AS total_students,
         (SELECT COUNT(*) FROM courses WHERE is_active = true)::text AS active_courses,
         (SELECT COUNT(*) FROM messages WHERE sender = 'student' AND read_at IS NULL)::text AS unread_messages,
         (SELECT COUNT(*) FROM submissions WHERE grade IS NULL)::text AS pending_homework`
    );

    const row = result.rows[0];
    return NextResponse.json({
      totalStudents: parseInt(row.total_students, 10),
      activeCourses: parseInt(row.active_courses, 10),
      unreadMessages: parseInt(row.unread_messages, 10),
      pendingHomework: parseInt(row.pending_homework, 10),
    });
  } catch (error) {
    console.error("[GET /api/dashboard/stats]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
