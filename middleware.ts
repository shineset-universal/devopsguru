import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PROTECTED = [
  "/dashboard",
  "/courses",
  "/recordings",
  "/homework",
  "/sessions",
  "/messages",
  "/certificates",
];

function isProtected(pathname: string): boolean {
  return PROTECTED.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  if (!isProtected(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("session")?.value;

  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET ?? "dev-secret-change-in-production"
    );
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("from", pathname);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete("session");
    return res;
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/courses/:path*",
    "/recordings/:path*",
    "/homework/:path*",
    "/sessions/:path*",
    "/messages/:path*",
    "/certificates/:path*",
  ],
};
