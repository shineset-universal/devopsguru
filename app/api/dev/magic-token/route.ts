import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// Dev-only: returns the latest valid magic link token for an email.
// Used by E2E tests to bypass email delivery.
export async function GET(req: NextRequest): Promise<NextResponse> {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }

  const result = await pool.query<{ token: string }>(
    `SELECT token FROM magic_links
     WHERE email = $1 AND used = false AND expires_at > NOW()
     ORDER BY created_at DESC
     LIMIT 1`,
    [email]
  );

  if (!result.rows[0]) {
    return NextResponse.json({ error: "No valid token found" }, { status: 404 });
  }

  return NextResponse.json({ token: result.rows[0].token });
}
