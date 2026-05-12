import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getCourseBySlug,
  getModulesWithLessons,
} from "@/services/courses/lib/queries";
import { getLessonProgress } from "@/services/courses/lib/progress";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const studentId = parseInt(session.sub, 10);

    const course = await getCourseBySlug(slug, studentId);
    if (!course) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const [modules, progress] = await Promise.all([
      getModulesWithLessons(course.id, studentId),
      getLessonProgress(studentId, course.id),
    ]);

    return NextResponse.json({ course, modules, progress });
  } catch (error) {
    console.error("[GET /api/courses/[slug]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
