export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import pool from "@/lib/db";
import { consumeMagicLink } from "@/services/auth/lib/magic-link";
import { createSessionCookie } from "@/services/auth/lib/session";

const schema = z.object({ token: z.string().min(1) });

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const parsed = schema.safeParse({
      token: req.nextUrl.searchParams.get("token"),
    });
    if (!parsed.success) {
      return NextResponse.redirect(
        new URL("/auth/login?error=invalid", req.url)
      );
    }

    const link = await consumeMagicLink(parsed.data.token);
    if (!link) {
      return NextResponse.redirect(
        new URL("/auth/login?error=expired", req.url)
      );
    }

    let name = "Admin";
    let id = "0";

    if (link.role === "student") {
      const result = await pool.query<{
        id: number;
        name: string;
        is_active: boolean;
      }>("SELECT id, name, is_active FROM students WHERE email = $1", [
        link.email,
      ]);
      const student = result.rows[0];
      if (!student || !student.is_active) {
        return NextResponse.redirect(
          new URL("/auth/login?error=disabled", req.url)
        );
      }
      name = student.name;
      id = String(student.id);
    }

    const destination = link.role === "admin" ? "/admin/dashboard" : "/dashboard";
    const res = NextResponse.redirect(new URL(destination, req.url));
    await createSessionCookie({ sub: id, email: link.email, role: link.role, name }, res);

    return res;
  } catch (error) {
    console.error("[GET /api/auth/verify]", error);
    return NextResponse.redirect(new URL("/auth/login?error=server", req.url));
  }
}
