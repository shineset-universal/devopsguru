import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { NextRequest, NextResponse } from "next/server";

export interface AdminSession {
  email: string;
  role: "admin";
}

const COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 7;

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function getAdminSession(
  req: NextRequest
): Promise<AdminSession | null> {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if ((payload as JWTPayload & { role?: string }).role !== "admin") return null;
    return payload as unknown as AdminSession;
  } catch {
    return null;
  }
}

export async function createAdminSession(
  email: string,
  res: NextResponse
): Promise<NextResponse> {
  const token = await new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
  return res;
}

export function clearAdminSession(res: NextResponse): NextResponse {
  res.cookies.delete(COOKIE);
  return res;
}
