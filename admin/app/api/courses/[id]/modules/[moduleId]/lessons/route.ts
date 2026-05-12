export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import pool from "@/lib/db";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().optional(),
  video_url: z.string().url().optional(),
  duration_min: z.number().int().positive().optional(),
  sort_order: z.number().int().default(0),
  published: z.boolean().default(false),
});

const updateSchema = createSchema.partial();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { moduleId } = await params;
    const result = await pool.query(
      "SELECT * FROM lessons WHERE module_id = $1 ORDER BY sort_order",
      [parseInt(moduleId, 10)]
    );
    return NextResponse.json({ lessons: result.rows });
  } catch (error) {
    console.error("[GET /api/courses/[id]/modules/[moduleId]/lessons admin]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { moduleId } = await params;
    const parsed = createSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const d = parsed.data;
    const result = await pool.query(
      `INSERT INTO lessons (module_id, title, content, video_url, duration_min, sort_order, published)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [parseInt(moduleId, 10), d.title, d.content ?? null,
       d.video_url ?? null, d.duration_min ?? null, d.sort_order, d.published]
    );
    return NextResponse.json({ lesson: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/courses/[id]/modules/[moduleId]/lessons admin]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lessonId = req.nextUrl.searchParams.get("lessonId");
    if (!lessonId) {
      return NextResponse.json({ error: "lessonId required" }, { status: 400 });
    }

    const parsed = updateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const d = parsed.data;
    const result = await pool.query(
      `UPDATE lessons
       SET title        = COALESCE($1, title),
           content      = COALESCE($2, content),
           video_url    = COALESCE($3, video_url),
           duration_min = COALESCE($4, duration_min),
           sort_order   = COALESCE($5, sort_order),
           published    = COALESCE($6, published)
       WHERE id = $7
       RETURNING *`,
      [d.title ?? null, d.content ?? null, d.video_url ?? null,
       d.duration_min ?? null, d.sort_order ?? null, d.published ?? null,
       parseInt(lessonId, 10)]
    );
    if (!result.rows[0]) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ lesson: result.rows[0] });
  } catch (error) {
    console.error("[PATCH /api/courses/[id]/modules/[moduleId]/lessons admin]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
