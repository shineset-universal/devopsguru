import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/services/auth/lib/session";

export async function POST(_req: NextRequest): Promise<NextResponse> {
  const res = NextResponse.json({ success: true });
  clearSessionCookie(res);
  return res;
}
