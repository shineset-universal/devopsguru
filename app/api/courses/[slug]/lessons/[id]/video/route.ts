import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getLessonById } from "@/services/courses/lib/queries";

// Returns a redirect to the Cloudinary video URL — never exposes the URL in HTML.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const lessonId = parseInt(id, 10);
    if (isNaN(lessonId)) {
      return NextResponse.json({ error: "Invalid lesson id" }, { status: 400 });
    }

    const lesson = await getLessonById(lessonId, parseInt(session.sub, 10));
    if (!lesson) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (!lesson.video_url) {
      return NextResponse.json({ error: "No video available" }, { status: 404 });
    }

    return NextResponse.redirect(lesson.video_url, { status: 302 });
  } catch (error) {
    console.error("[GET /api/courses/[slug]/lessons/[id]/video]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
