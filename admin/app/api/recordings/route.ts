export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import pool from "@/lib/db";

const createSchema = z.object({
  course_id: z.number().int().positive(),
  lesson_id: z.number().int().positive().nullable().optional(),
  title: z.string().min(1).max(200),
  video_url: z.string().url(),
  recorded_at: z.string().datetime().optional(),
  duration_min: z.number().int().positive().optional(),
  published: z.boolean().default(false),
});

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT r.*, c.title AS course_title
       FROM recordings r
       JOIN courses c ON c.id = r.course_id
       ORDER BY r.recorded_at DESC NULLS LAST`
    );
    return NextResponse.json({ recordings: result.rows });
  } catch (error) {
    console.error("[GET /api/recordings admin]", error);
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
      `INSERT INTO recordings (course_id, lesson_id, title, video_url, recorded_at, duration_min, published)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [d.course_id, d.lesson_id ?? null, d.title, d.video_url,
       d.recorded_at ?? null, d.duration_min ?? null, d.published]
    );
    return NextResponse.json({ recording: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/recordings admin]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
