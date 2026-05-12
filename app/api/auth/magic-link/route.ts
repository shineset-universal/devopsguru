export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import pool from "@/lib/db";
import redis from "@/lib/redis";
import {
  createMagicLink,
  sendMagicLinkEmail,
} from "@/services/auth/lib/magic-link";

const schema = z.object({
  email: z.string().email(),
  role: z.enum(["student", "admin"]),
});

const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 60;

async function checkRateLimit(ip: string): Promise<boolean> {
  const key = `rate:magic-link:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, RATE_WINDOW_SECONDS);
  return count <= RATE_LIMIT;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const ip =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      "unknown";

    const allowed = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { email, role } = parsed.data;

    if (role === "admin") {
      if (email !== process.env.ADMIN_EMAIL) {
        // Silent — don't reveal if admin email is correct
        return NextResponse.json({ success: true });
      }
    } else {
      const result = await pool.query<{ is_active: boolean }>(
        "SELECT is_active FROM students WHERE email = $1",
        [email]
      );
      if (!result.rows[0] || !result.rows[0].is_active) {
        // Silent — don't reveal if student exists
        return NextResponse.json({ success: true });
      }
    }

    const token = await createMagicLink(email, role);
    // Best-effort — token is saved to DB even if email fails (e.g. placeholder key in dev)
    await sendMagicLinkEmail(email, token, role).catch((err) =>
      console.warn("[POST /api/auth/magic-link] email send failed:", err)
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/auth/magic-link]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
