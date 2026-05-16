export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import pool from "@/lib/db";

interface PublicVideo {
  id: number;
  youtube_id: string | null;
  video_url: string | null;
  title: string;
  description: string | null;
  duration: string | null;
  course: string | null;
  course_accent: string;
  icon_key: string;
  level: string;
  sort_order: number;
}

export async function GET(): Promise<NextResponse> {
  try {
    const result = await pool.query<PublicVideo>(
      "SELECT id, youtube_id, video_url, title, description, duration, course, course_accent, icon_key, level, sort_order FROM public_videos WHERE published = true ORDER BY sort_order ASC, id ASC"
    );
    return NextResponse.json({ videos: result.rows });
  } catch (error) {
    console.error("[GET /api/videos]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
