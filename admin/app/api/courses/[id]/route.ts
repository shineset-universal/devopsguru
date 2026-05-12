export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import pool from "@/lib/db";

const updateSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  description: z.string().optional(),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "Capstone"]).optional(),
  weeks: z.string().max(50).optional(),
  accent_color: z.string().max(10).optional(),
  icon_key: z.string().max(30).optional(),
  is_active: z.boolean().optional(),
  sort_order: z.number().int().optional(),
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
      "SELECT * FROM courses WHERE id = $1",
      [parseInt(id, 10)]
    );
    if (!result.rows[0]) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ course: result.rows[0] });
  } catch (error) {
    console.error("[GET /api/courses/[id] admin]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const parsed = updateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const d = parsed.data;
    const result = await pool.query(
      `UPDATE courses
       SET title       = COALESCE($1, title),
           description = COALESCE($2, description),
           level       = COALESCE($3, level),
           weeks       = COALESCE($4, weeks),
           accent_color = COALESCE($5, accent_color),
           icon_key    = COALESCE($6, icon_key),
           is_active   = COALESCE($7, is_active),
           sort_order  = COALESCE($8, sort_order)
       WHERE id = $9
       RETURNING *`,
      [d.title ?? null, d.description ?? null, d.level ?? null, d.weeks ?? null,
       d.accent_color ?? null, d.icon_key ?? null, d.is_active ?? null,
       d.sort_order ?? null, parseInt(id, 10)]
    );
    if (!result.rows[0]) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ course: result.rows[0] });
  } catch (error) {
    console.error("[PATCH /api/courses/[id] admin]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
