import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import pool from "@/lib/db";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT s.id, s.assignment_id, s.student_id, s.content, s.file_url,
              s.submitted_at, s.grade, s.feedback, s.graded_at,
              a.title AS assignment_title, a.max_score,
              c.title AS course_title,
              st.name AS student_name
       FROM submissions s
       JOIN assignments a ON a.id = s.assignment_id
       JOIN courses c ON c.id = a.course_id
       JOIN students st ON st.id = s.student_id
       ORDER BY s.submitted_at DESC`
    );
    return NextResponse.json({ submissions: result.rows });
  } catch (error) {
    console.error("[GET /api/homework admin]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
