import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getCertificatesForStudent } from "@/services/certificates/lib/queries";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const certificates = await getCertificatesForStudent(
      parseInt(session.sub, 10)
    );
    return NextResponse.json({ certificates });
  } catch (error) {
    console.error("[GET /api/certificates]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
