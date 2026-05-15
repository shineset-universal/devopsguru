import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

function reqLog(req: NextRequest, action: string): void {
  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "unknown";
  console.log(
    `[ADMIN] ${new Date().toISOString()} ${req.method} ${req.nextUrl.pathname} ip=${ip} → ${action}`
  );
}

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/login")) {
    reqLog(req, "pass (login page)");
    return NextResponse.next();
  }

  const token = req.cookies.get("admin_session")?.value;

  if (!token) {
    reqLog(req, "redirect:login (no session)");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET ?? "dev-secret-change-in-production"
    );
    await jwtVerify(token, secret);
    reqLog(req, "authorized");
    return NextResponse.next();
  } catch {
    reqLog(req, "redirect:login (invalid token)");
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("admin_session");
    return res;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
