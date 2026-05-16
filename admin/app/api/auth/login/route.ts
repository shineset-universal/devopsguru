export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { createTotpPending } from "@/lib/auth";

const schema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

interface AdminUserRow {
  id: number;
  email: string;
  password_hash: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const result = await pool.query<AdminUserRow>(
      "SELECT id, email, password_hash FROM admin_users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    // Constant-time comparison even on missing user (dummy hash)
    const hashToCheck = user?.password_hash ?? "$2b$12$invalidhashinvalidhashinval";
    const valid = await bcrypt.compare(password, hashToCheck);

    if (!user || !valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const res = NextResponse.json({ step: "totp" });
    await createTotpPending(user.email, res);
    return res;
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
