import { NextRequest, NextResponse } from "next/server";
import { createAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const res = NextResponse.redirect(new URL("/dashboard", req.url));
  await createAdminSession(process.env.ADMIN_EMAIL ?? "sarmen@devopsguru.am", res);
  return res;
}
