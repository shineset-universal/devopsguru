export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getCertificateById } from "@/services/certificates/lib/queries";

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
    const certificateId = parseInt(id, 10);
    if (isNaN(certificateId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const certificate = await getCertificateById(
      certificateId,
      parseInt(session.sub, 10)
    );
    if (!certificate) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!certificate.cert_url) {
      return NextResponse.json({ error: "Certificate not yet generated" }, { status: 404 });
    }

    return NextResponse.redirect(certificate.cert_url, { status: 302 });
  } catch (error) {
    console.error("[GET /api/certificates/[id]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
