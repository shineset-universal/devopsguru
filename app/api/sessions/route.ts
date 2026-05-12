export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getUpcomingSessions,
  getPastSessions,
} from "@/services/sessions/lib/queries";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentId = parseInt(session.sub, 10);
    const [upcoming, past] = await Promise.all([
      getUpcomingSessions(studentId),
      getPastSessions(studentId),
    ]);

    return NextResponse.json({ upcoming, past });
  } catch (error) {
    console.error("[GET /api/sessions]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
