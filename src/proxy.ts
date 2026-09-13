import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, readSessionToken } from "@/lib/auth/session";

/**
 * Next 16 renamed `middleware` to `proxy`. This only checks that a validly
 * signed session cookie exists — the database lookup and the real authorization
 * happen in the admin layout and inside every Server Action.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const session = readSessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  const forward = () => {
    const headers = new Headers(request.headers);
    headers.set("x-admin-path", pathname);
    return NextResponse.next({ request: { headers } });
  };

  if (pathname === "/admin/login") {
    if (session) return NextResponse.redirect(new URL("/admin", request.url));
    return forward();
  }

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    const target = `${pathname}${search}`;
    if (target !== "/admin") loginUrl.searchParams.set("next", target);
    return NextResponse.redirect(loginUrl);
  }

  return forward();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
