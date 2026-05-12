export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { submitHomework } from "@/services/homework/lib/queries";

const schema = z.object({
  content: z.string().min(1),
  fileUrl: z.string().url().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const assignmentId = parseInt(id, 10);
    if (isNaN(assignmentId)) {
      return NextResponse.json({ error: "Invalid assignment id" }, { status: 400 });
    }

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const submission = await submitHomework(
      assignmentId,
      parseInt(session.sub, 10),
      parsed.data.content,
      parsed.data.fileUrl
    );

    return NextResponse.json({ submission });
  } catch (error) {
    if (error instanceof Error && error.message === "ALREADY_GRADED") {
      return NextResponse.json(
        { error: "Submission is locked after grading" },
        { status: 409 }
      );
    }
    console.error("[POST /api/homework/[id]/submit]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
