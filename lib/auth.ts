import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

export interface SessionPayload {
  sub: string;
  email: string;
  role: "student" | "admin";
  name: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function getSession(
  req: NextRequest
): Promise<SessionPayload | null> {
  const token = req.cookies.get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
