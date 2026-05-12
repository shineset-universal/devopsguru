export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import pool from "@/lib/db";

const updateSchema = z.object({
  name: z.string().min(2).max(150).optional(),
  phone: z.string().max(30).optional(),
  is_active: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const studentId = parseInt(id, 10);
    if (isNaN(studentId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const parsed = updateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { name, phone, is_active } = parsed.data;
    const result = await pool.query(
      `UPDATE students
       SET name      = COALESCE($1, name),
           phone     = COALESCE($2, phone),
           is_active = COALESCE($3, is_active),
           updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [name ?? null, phone ?? null, is_active ?? null, studentId]
    );

    if (!result.rows[0]) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ student: result.rows[0] });
  } catch (error) {
    console.error("[PATCH /api/students/[id]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
