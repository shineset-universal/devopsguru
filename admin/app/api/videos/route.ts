export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import pool from "@/lib/db";

const createSchema = z.object({
  title:         z.string().min(1).max(200),
  description:   z.string().optional(),
  youtube_id:    z.string().max(30).optional(),
  video_url:     z.string().url().optional(),
  duration:      z.string().max(20).optional(),
  course:        z.string().max(100).optional(),
  course_accent: z.string().max(10).optional(),
  icon_key:      z.string().max(30).optional(),
  level:         z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  sort_order:    z.number().int().optional(),
  published:     z.boolean().optional(),
});

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await pool.query(
      "SELECT * FROM public_videos ORDER BY sort_order ASC, created_at DESC"
    );
    return NextResponse.json({ videos: result.rows });
  } catch (error) {
    console.error("[GET /api/videos admin]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = createSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    const d = parsed.data;
    if (!d.youtube_id && !d.video_url) {
      return NextResponse.json({ error: "Provide either a YouTube ID or a video URL" }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO public_videos
         (title, description, youtube_id, video_url, duration, course, course_accent, icon_key, level, sort_order, published)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        d.title,
        d.description ?? null,
        d.youtube_id  ?? null,
        d.video_url   ?? null,
        d.duration    ?? null,
        d.course      ?? null,
        d.course_accent ?? "#00d4ff",
        d.icon_key    ?? "linux",
        d.level       ?? "Beginner",
        d.sort_order  ?? 0,
        d.published   ?? false,
      ]
    );
    return NextResponse.json({ video: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/videos admin]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
