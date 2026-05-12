export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth";

export async function POST(_req: NextRequest): Promise<NextResponse> {
  const res = NextResponse.json({ success: true });
  clearAdminSession(res);
  return res;
}
