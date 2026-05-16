export const dynamic = "force-dynamic";

/**
 * One-time superuser setup endpoint.
 * Protected by ADMIN_SETUP_KEY env var.
 * Call once to create the admin account and get the TOTP QR code to scan.
 *
 * POST /api/setup
 * Headers: Authorization: Bearer <ADMIN_SETUP_KEY>
 * Body: { email: string, password: string }
 * Returns: { qrCode: string (data URI PNG), secret: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { generateSecret, generateURI } from "otplib";
import QRCode from "qrcode";
import pool from "@/lib/db";

const schema = z.object({
  email:    z.string().email(),
  password: z.string().min(12, "Password must be at least 12 characters"),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const authHeader = req.headers.get("authorization") ?? "";
    const setupKey   = process.env.ADMIN_SETUP_KEY;

    if (!setupKey) {
      return NextResponse.json({ error: "ADMIN_SETUP_KEY env var is not set" }, { status: 500 });
    }
    if (authHeader !== `Bearer ${setupKey}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await pool.query("SELECT id FROM admin_users LIMIT 1");
    if ((existing.rowCount ?? 0) > 0) {
      return NextResponse.json({ error: "Admin user already exists" }, { status: 409 });
    }

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const passwordHash = await bcrypt.hash(password, 12);
    const totpSecret   = generateSecret();

    await pool.query(
      "INSERT INTO admin_users (email, password_hash, totp_secret) VALUES ($1, $2, $3)",
      [email, passwordHash, totpSecret]
    );

    const otpauth = generateURI({ issuer: "DevOpsGuru Admin", label: email, secret: totpSecret });
    const qrCode  = await QRCode.toDataURL(otpauth);

    return NextResponse.json({
      success: true,
      qrCode,
      secret: totpSecret,
      message: "Scan the QR code with Google Authenticator. Keep the secret as a backup.",
    });
  } catch (error) {
    console.error("[POST /api/setup]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
