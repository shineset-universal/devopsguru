export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getRecordingVideoUrl } from "@/services/recordings/lib/queries";

// Enrollment-gated proxy — never exposes raw Cloudinary URL in HTML.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const recordingId = parseInt(id, 10);
    if (isNaN(recordingId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const videoUrl = await getRecordingVideoUrl(
      recordingId,
      parseInt(session.sub, 10)
    );
    if (!videoUrl) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.redirect(videoUrl, { status: 302 });
  } catch (error) {
    console.error("[GET /api/recordings/[id]/video]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
