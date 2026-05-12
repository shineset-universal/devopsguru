import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkAndIssueCertificate } from "@/services/certificates/lib/generator";

const schema = z.object({
  studentId: z.number().int().positive(),
  courseId: z.number().int().positive(),
});

// Internal-only endpoint: called by the admin app on the Docker network.
// Never expose this to the public internet via Nginx.
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    await checkAndIssueCertificate(parsed.data.studentId, parsed.data.courseId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/internal/issue-certificate]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
