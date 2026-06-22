import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Optimistic check: does a session cookie exist? (no DB call — fast).
  // Authoritative validation happens server-side in the page via getSession().
  const sessionCookie =
    request.cookies.get("better-auth.session_token") ??
    request.cookies.get("__Secure-better-auth.session_token");

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // Narrow matcher: only /favorites — never touches static assets.
  matcher: "/favorites/:path*",
};
