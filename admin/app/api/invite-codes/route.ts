import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import pool from "@/lib/db";

const createSchema = z.object({
  code: z.string().min(3).max(50),
  course_id: z.number().int().positive(),
  max_uses: z.number().int().positive().nullable().optional(),
  expires_at: z.string().datetime().nullable().optional(),
});

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT ic.id, ic.code, ic.course_id, ic.max_uses, ic.used_count,
              ic.expires_at, ic.created_at, c.title AS course_title
       FROM invite_codes ic
       JOIN courses c ON c.id = ic.course_id
       ORDER BY ic.created_at DESC`
    );
    return NextResponse.json({ inviteCodes: result.rows });
  } catch (error) {
    console.error("[GET /api/invite-codes]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = createSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { code, course_id, max_uses, expires_at } = parsed.data;
    const result = await pool.query(
      `INSERT INTO invite_codes (code, course_id, max_uses, expires_at)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [code, course_id, max_uses ?? null, expires_at ?? null]
    );
    return NextResponse.json({ inviteCode: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/invite-codes]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
