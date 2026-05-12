import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getMessages, sendMessage } from "@/services/messages/lib/queries";

const postSchema = z.object({
  courseId: z.number().int().positive(),
  body: z.string().min(1).max(5000),
});

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courseId = parseInt(
      req.nextUrl.searchParams.get("courseId") ?? "",
      10
    );
    if (isNaN(courseId)) {
      return NextResponse.json({ error: "courseId required" }, { status: 400 });
    }

    const messages = await getMessages(courseId, parseInt(session.sub, 10));
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("[GET /api/messages]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = postSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const message = await sendMessage(
      parsed.data.courseId,
      parseInt(session.sub, 10),
      "student",
      parsed.data.body
    );

    return NextResponse.json({ message });
  } catch (error) {
    console.error("[POST /api/messages]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
