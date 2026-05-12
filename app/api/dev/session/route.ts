export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { signToken } from "@/services/auth/lib/jwt";

// Dev-only: returns a valid session cookie for any active student email.
// Lets E2E tests authenticate without going through magic link → verify flow.
export async function GET(req: NextRequest): Promise<NextResponse> {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }

  const result = await pool.query<{ id: number; name: string; is_active: boolean }>(
    "SELECT id, name, is_active FROM students WHERE email = $1",
    [email]
  );
  const student = result.rows[0];
  if (!student || !student.is_active) {
    return NextResponse.json({ error: "Student not found or inactive" }, { status: 404 });
  }

  const token = await signToken({
    sub: String(student.id),
    email,
    role: "student",
    name: student.name,
  });

  return NextResponse.json({ cookie: `session=${token}` });
}
