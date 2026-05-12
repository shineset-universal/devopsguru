export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import pool from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const codeId = parseInt(id, 10);
    if (isNaN(codeId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await pool.query("DELETE FROM invite_codes WHERE id = $1", [codeId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/invite-codes/[id]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
