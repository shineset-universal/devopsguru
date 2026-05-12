import crypto from "crypto";
import { Resend } from "resend";
import pool from "@/lib/db";

// Lazy — Resend throws at construction if API key is missing, so never instantiate at module level
function getResend(): Resend {
  return new Resend(process.env.RESEND_API_KEY);
}

async function getMagicLinkExpiryMinutes(): Promise<number> {
  const result = await pool.query<{ value: string }>(
    "SELECT value FROM site_settings WHERE key = 'magic_link_expiry_minutes'"
  );
  return parseInt(result.rows[0]?.value ?? "15", 10);
}

export async function createMagicLink(
  email: string,
  role: "student" | "admin"
): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiryMinutes = await getMagicLinkExpiryMinutes();

  await pool.query(
    `INSERT INTO magic_links (email, token, role, expires_at)
     VALUES ($1, $2, $3, NOW() + ($4 || ' minutes')::INTERVAL)`,
    [email, token, role, String(expiryMinutes)]
  );

  return token;
}

export interface VerifiedLink {
  email: string;
  role: "student" | "admin";
}

export async function consumeMagicLink(
  token: string
): Promise<VerifiedLink | null> {
  const result = await pool.query<{
    id: number;
    email: string;
    role: string;
    expires_at: Date;
    used: boolean;
  }>("SELECT id, email, role, expires_at, used FROM magic_links WHERE token = $1", [
    token,
  ]);

  const row = result.rows[0];
  if (!row || row.used || new Date() > row.expires_at) return null;

  await pool.query("UPDATE magic_links SET used = true WHERE id = $1", [row.id]);

  return { email: row.email, role: row.role as "student" | "admin" };
}

export async function sendMagicLinkEmail(
  email: string,
  token: string,
  role: "student" | "admin"
): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const verifyUrl = `${baseUrl}/auth/verify?token=${token}`;
  const subject =
    role === "admin" ? "DevOpsGuru Admin Login" : "Your DevOpsGuru login link";

  await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "noreply@devopsguru.am",
    to: email,
    subject,
    html: `
      <p>Click the link below to log in. It expires in 15 minutes and can only be used once.</p>
      <p><a href="${verifyUrl}" style="color:#00d4ff">Log in to DevOpsGuru →</a></p>
      <p style="color:#888;font-size:12px">If you didn't request this, ignore this email.</p>
    `,
  });
}
