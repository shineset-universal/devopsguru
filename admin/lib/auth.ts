import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { NextRequest, NextResponse } from "next/server";

export interface AdminSession {
  email: string;
  role: "admin";
}

const SESSION_COOKIE  = "admin_session";
const PENDING_COOKIE  = "totp_pending";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;   // 7 days
const PENDING_MAX_AGE = 60 * 5;              // 5 minutes

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function getAdminSession(req: NextRequest): Promise<AdminSession | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if ((payload as JWTPayload & { role?: string }).role !== "admin") return null;
    return payload as unknown as AdminSession;
  } catch {
    return null;
  }
}

export async function createAdminSession(email: string, res: NextResponse): Promise<NextResponse> {
  const token = await new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return res;
}

export function clearAdminSession(res: NextResponse): NextResponse {
  res.cookies.delete(SESSION_COOKIE);
  return res;
}

// ── TOTP pending (short-lived — issued after password check, before TOTP) ──

export async function createTotpPending(email: string, res: NextResponse): Promise<NextResponse> {
  const token = await new SignJWT({ email, purpose: "totp_pending" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(getSecret());

  res.cookies.set(PENDING_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: PENDING_MAX_AGE,
    path: "/",
  });
  return res;
}

export async function getTotpPendingEmail(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get(PENDING_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const p = payload as JWTPayload & { purpose?: string; email?: string };
    if (p.purpose !== "totp_pending" || !p.email) return null;
    return p.email;
  } catch {
    return null;
  }
}

export function clearTotpPending(res: NextResponse): NextResponse {
  res.cookies.delete(PENDING_COOKIE);
  return res;
}
