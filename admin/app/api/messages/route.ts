import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import pool from "@/lib/db";

const replySchema = z.object({
  course_id: z.number().int().positive(),
  student_id: z.number().int().positive(),
  body: z.string().min(1).max(5000),
});

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If courseId + studentId params provided, fetch thread; else fetch all unread
    const courseId = req.nextUrl.searchParams.get("courseId");
    const studentId = req.nextUrl.searchParams.get("studentId");

    if (courseId && studentId) {
      const result = await pool.query(
        `SELECT m.*, s.name AS student_name, c.title AS course_title
         FROM messages m
         JOIN students s ON s.id = m.student_id
         JOIN courses c ON c.id = m.course_id
         WHERE m.course_id = $1 AND m.student_id = $2
         ORDER BY m.created_at ASC`,
        [parseInt(courseId, 10), parseInt(studentId, 10)]
      );
      // Mark student messages as read
      await pool.query(
        `UPDATE messages SET read_at = NOW()
         WHERE course_id = $1 AND student_id = $2
           AND sender = 'student' AND read_at IS NULL`,
        [parseInt(courseId, 10), parseInt(studentId, 10)]
      );
      return NextResponse.json({ messages: result.rows });
    }

    // All threads summary
    const result = await pool.query(
      `SELECT DISTINCT ON (m.course_id, m.student_id)
              m.id, m.course_id, m.student_id, m.sender, m.body, m.created_at, m.read_at,
              s.name AS student_name, c.title AS course_title,
              (SELECT COUNT(*) FROM messages
               WHERE course_id = m.course_id AND student_id = m.student_id
                 AND sender = 'student' AND read_at IS NULL)::text AS unread_count
       FROM messages m
       JOIN students s ON s.id = m.student_id
       JOIN courses c ON c.id = m.course_id
       ORDER BY m.course_id, m.student_id, m.created_at DESC`
    );
    return NextResponse.json({ threads: result.rows });
  } catch (error) {
    console.error("[GET /api/messages admin]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = replySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { course_id, student_id, body } = parsed.data;
    const result = await pool.query(
      `INSERT INTO messages (course_id, student_id, sender, body)
       VALUES ($1, $2, 'instructor', $3)
       RETURNING *`,
      [course_id, student_id, body]
    );
    return NextResponse.json({ message: result.rows[0] });
  } catch (error) {
    console.error("[POST /api/messages admin]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
