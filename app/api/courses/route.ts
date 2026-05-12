import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getEnrolledCourses } from "@/services/courses/lib/queries";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courses = await getEnrolledCourses(parseInt(session.sub, 10));
    return NextResponse.json({ courses });
  } catch (error) {
    console.error("[GET /api/courses]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
