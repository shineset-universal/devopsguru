export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getEnrolledRecordings } from "@/services/recordings/lib/queries";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recordings = await getEnrolledRecordings(parseInt(session.sub, 10));
    return NextResponse.json({ recordings });
  } catch (error) {
    console.error("[GET /api/recordings]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
