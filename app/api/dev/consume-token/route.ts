export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// Dev-only: marks a magic link token as used (simulates it being consumed by verify).
export async function POST(req: NextRequest): Promise<NextResponse> {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { token } = await req.json() as { token: string };
  if (!token) {
    return NextResponse.json({ error: "token required" }, { status: 400 });
  }

  const result = await pool.query<{ id: number; used: boolean; expires_at: Date }>(
    "SELECT id, used, expires_at FROM magic_links WHERE token = $1",
    [token]
  );

  const row = result.rows[0];
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (row.used || new Date() > row.expires_at) {
    return NextResponse.json({ already_consumed: true });
  }

  await pool.query("UPDATE magic_links SET used = true WHERE id = $1", [row.id]);
  return NextResponse.json({ consumed: true });
}
