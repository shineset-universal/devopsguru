export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verify } from "otplib";
import pool from "@/lib/db";
import { getTotpPendingEmail, clearTotpPending, createAdminSession } from "@/lib/auth";

const schema = z.object({
  code: z.string().length(6).regex(/^\d{6}$/),
});

interface AdminUserRow {
  email: string;
  totp_secret: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const email = await getTotpPendingEmail(req);
    if (!email) {
      return NextResponse.json({ error: "Session expired — please log in again" }, { status: 401 });
    }

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Enter a 6-digit code" }, { status: 400 });
    }

    const result = await pool.query<AdminUserRow>(
      "SELECT email, totp_secret FROM admin_users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];
    if (!user) {
      return NextResponse.json({ error: "Account not found" }, { status: 401 });
    }

    const outcome = await verify({
      secret:   user.totp_secret,
      token:    parsed.data.code,
      strategy: "totp",
    });

    if (!outcome.valid) {
      return NextResponse.json({ error: "Invalid code — check your authenticator app" }, { status: 401 });
    }

    const res = NextResponse.json({ success: true });
    clearTotpPending(res);
    await createAdminSession(user.email, res);
    return res;
  } catch (error) {
    console.error("[POST /api/auth/verify-totp]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
