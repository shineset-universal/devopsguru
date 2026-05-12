import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { createAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.redirect(new URL("/login?error=invalid", req.url));
    }

    const result = await pool.query<{
      id: number;
      email: string;
      role: string;
      expires_at: Date;
      used: boolean;
    }>(
      "SELECT id, email, role, expires_at, used FROM magic_links WHERE token = $1",
      [token]
    );

    const row = result.rows[0];
    if (!row || row.used || new Date() > row.expires_at || row.role !== "admin") {
      return NextResponse.redirect(new URL("/login?error=expired", req.url));
    }

    await pool.query("UPDATE magic_links SET used = true WHERE id = $1", [row.id]);

    const res = NextResponse.redirect(new URL("/dashboard", req.url));
    await createAdminSession(row.email, res);
    return res;
  } catch (error) {
    console.error("[GET /api/auth/verify admin]", error);
    return NextResponse.redirect(new URL("/login?error=server", req.url));
  }
}
