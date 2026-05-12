export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET ?? "dev-secret-please-change-in-production-32c"
  );

  const token = await new SignJWT({
    sub: "1",
    email: "aram@example.com",
    role: "student",
    name: "Aram Hakobyan",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const res = NextResponse.redirect(new URL("/dashboard", req.url));
  res.cookies.set("session", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return res;
}
