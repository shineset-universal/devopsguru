export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getCourseBySlug } from "@/services/courses/lib/queries";
import { markLessonCompleteAndCheckCert } from "@/services/courses/lib/progress";

const schema = z.object({ lessonId: z.number().int().positive() });

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, id } = await params;
    const parsed = schema.safeParse({ lessonId: parseInt(id, 10) });
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid lesson id" }, { status: 400 });
    }

    const studentId = parseInt(session.sub, 10);
    const course = await getCourseBySlug(slug, studentId);
    if (!course) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await markLessonCompleteAndCheckCert(
      studentId,
      parsed.data.lessonId,
      course.id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/courses/[slug]/lessons/[id]/progress]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
