import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAssignmentsForStudent } from "@/services/homework/lib/queries";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assignments = await getAssignmentsForStudent(parseInt(session.sub, 10));
    return NextResponse.json({ assignments });
  } catch (error) {
    console.error("[GET /api/homework]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
