import { NextResponse } from "next/server";
import { signToken, type JWTClaims } from "./jwt";

const SESSION_COOKIE = "session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function cookieOptions(): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax";
  maxAge: number;
  path: string;
} {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  };
}

export async function createSessionCookie(
  claims: Pick<JWTClaims, "sub" | "email" | "role" | "name">,
  res: NextResponse
): Promise<NextResponse> {
  const token = await signToken(claims);
  res.cookies.set(SESSION_COOKIE, token, cookieOptions());
  return res;
}

export function clearSessionCookie(res: NextResponse): NextResponse {
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
