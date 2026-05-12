export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import pool from "@/lib/db";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  sort_order: z.number().int().default(0),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const result = await pool.query(
      `SELECT m.id, m.course_id, m.title, m.sort_order,
              COUNT(l.id)::text AS lesson_count
       FROM modules m
       LEFT JOIN lessons l ON l.module_id = m.id
       WHERE m.course_id = $1
       GROUP BY m.id
       ORDER BY m.sort_order`,
      [parseInt(id, 10)]
    );
    return NextResponse.json({ modules: result.rows });
  } catch (error) {
    console.error("[GET /api/courses/[id]/modules admin]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const parsed = createSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const result = await pool.query(
      "INSERT INTO modules (course_id, title, sort_order) VALUES ($1, $2, $3) RETURNING *",
      [parseInt(id, 10), parsed.data.title, parsed.data.sort_order]
    );
    return NextResponse.json({ module: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/courses/[id]/modules admin]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
