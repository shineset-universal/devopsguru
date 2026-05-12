export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import pool from "@/lib/db";

const createSchema = z.object({
  name: z.string().min(2).max(150),
  email: z.string().email().max(255),
  phone: z.string().max(30).optional(),
});

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT s.id, s.name, s.email, s.phone, s.is_active, s.created_at,
              COUNT(e.id)::text AS enrollment_count
       FROM students s
       LEFT JOIN enrollments e ON e.student_id = s.id
       GROUP BY s.id
       ORDER BY s.created_at DESC`
    );

    return NextResponse.json({ students: result.rows });
  } catch (error) {
    console.error("[GET /api/students]", error);
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

    const { name, email, phone } = parsed.data;
    const result = await pool.query(
      "INSERT INTO students (name, email, phone) VALUES ($1, $2, $3) RETURNING *",
      [name, email, phone ?? null]
    );

    return NextResponse.json({ student: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/students]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
