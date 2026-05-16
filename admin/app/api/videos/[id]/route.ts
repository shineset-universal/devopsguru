export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import pool from "@/lib/db";

const patchSchema = z.object({
  title:         z.string().min(1).max(200).optional(),
  description:   z.string().optional(),
  youtube_id:    z.string().max(30).nullable().optional(),
  video_url:     z.string().url().nullable().optional(),
  duration:      z.string().max(20).optional(),
  course:        z.string().max(100).optional(),
  course_accent: z.string().max(10).optional(),
  icon_key:      z.string().max(30).optional(),
  level:         z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  sort_order:    z.number().int().optional(),
  published:     z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const parsed = patchSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    const d = parsed.data;
    const fields: string[]  = [];
    const values: unknown[] = [];
    let   idx               = 1;

    const add = (col: string, val: unknown): void => {
      fields.push(`${col} = $${idx++}`);
      values.push(val);
    };

    if (d.title         !== undefined) add("title",         d.title);
    if (d.description   !== undefined) add("description",   d.description);
    if (d.youtube_id    !== undefined) add("youtube_id",    d.youtube_id);
    if (d.video_url     !== undefined) add("video_url",     d.video_url);
    if (d.duration      !== undefined) add("duration",      d.duration);
    if (d.course        !== undefined) add("course",        d.course);
    if (d.course_accent !== undefined) add("course_accent", d.course_accent);
    if (d.icon_key      !== undefined) add("icon_key",      d.icon_key);
    if (d.level         !== undefined) add("level",         d.level);
    if (d.sort_order    !== undefined) add("sort_order",    d.sort_order);
    if (d.published     !== undefined) add("published",     d.published);

    if (fields.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE public_videos SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
      values
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }
    return NextResponse.json({ video: result.rows[0] });
  } catch (error) {
    console.error("[PATCH /api/videos/:id admin]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const result = await pool.query(
      "DELETE FROM public_videos WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/videos/:id admin]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
