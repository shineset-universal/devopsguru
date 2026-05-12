export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import pool from "@/lib/db";

const updateSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string(),
});

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await pool.query(
      "SELECT key, value, updated_at FROM site_settings ORDER BY key"
    );
    return NextResponse.json({ settings: result.rows });
  } catch (error) {
    console.error("[GET /api/settings admin]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = updateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { key, value } = parsed.data;
    await pool.query(
      `INSERT INTO site_settings (key, value, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [key, value]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PUT /api/settings admin]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
