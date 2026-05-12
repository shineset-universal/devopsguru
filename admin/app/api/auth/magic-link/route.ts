export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { Resend } from "resend";
import pool from "@/lib/db";

function getResend(): Resend { return new Resend(process.env.RESEND_API_KEY); }
const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { email } = parsed.data;

    // Silent if not admin email — never reveal
    if (email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ success: true });
    }

    const token = crypto.randomBytes(32).toString("hex");
    await pool.query(
      `INSERT INTO magic_links (email, token, role, expires_at)
       VALUES ($1, $2, 'admin', NOW() + INTERVAL '15 minutes')`,
      [email, token]
    );

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const verifyUrl = `${baseUrl}/auth/verify?token=${token}`;

    await getResend().emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "noreply@devopsguru.am",
      to: email,
      subject: "DevOpsGuru Admin Login",
      html: `<p><a href="${verifyUrl}">Log in to Admin →</a></p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/auth/magic-link admin]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
