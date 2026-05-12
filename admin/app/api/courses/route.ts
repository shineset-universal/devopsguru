export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import pool from "@/lib/db";

const createSchema = z.object({
  num: z.string().max(3),
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200),
  description: z.string().optional(),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "Capstone"]),
  weeks: z.string().max(50).optional(),
  accent_color: z.string().max(10).default("#00d4ff"),
  icon_key: z.string().max(30).default("linux"),
  is_capstone: z.boolean().default(false),
  sort_order: z.number().int().default(0),
});

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT c.*,
              COUNT(DISTINCT e.student_id)::text AS student_count,
              COUNT(DISTINCT m.id)::text AS module_count
       FROM courses c
       LEFT JOIN enrollments e ON e.course_id = c.id
       LEFT JOIN modules m ON m.course_id = c.id
       GROUP BY c.id
       ORDER BY c.sort_order`
    );
    return NextResponse.json({ courses: result.rows });
  } catch (error) {
    console.error("[GET /api/courses admin]", error);
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
      `INSERT INTO courses (num, title, slug, description, level, weeks,
                            accent_color, icon_key, is_capstone, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [d.num, d.title, d.slug, d.description ?? null, d.level, d.weeks ?? null,
       d.accent_color, d.icon_key, d.is_capstone, d.sort_order]
    );
    return NextResponse.json({ course: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/courses admin]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
