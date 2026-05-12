export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import pool from "@/lib/db";

const createSchema = z.object({
  course_id: z.number().int().positive(),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  scheduled_at: z.string().datetime(),
  duration_min: z.number().int().positive().default(90),
  meeting_url: z.string().url().optional(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT ls.*, c.title AS course_title
       FROM live_sessions ls
       JOIN courses c ON c.id = ls.course_id
       ORDER BY ls.scheduled_at DESC`
    );
    return NextResponse.json({ sessions: result.rows });
  } catch (error) {
    console.error("[GET /api/sessions admin]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = createSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const d = parsed.data;
    const result = await pool.query(
      `INSERT INTO live_sessions (course_id, title, description, scheduled_at, duration_min, meeting_url, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [d.course_id, d.title, d.description ?? null, d.scheduled_at,
       d.duration_min, d.meeting_url ?? null, d.notes ?? null]
    );
    return NextResponse.json({ session: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/sessions admin]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
