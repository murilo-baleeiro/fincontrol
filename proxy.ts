import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

const AUTH_COOKIE = "access_token";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`[Middleware] Pathname: ${pathname}`);
  console.log(`[Middleware] Cookies:`, request.cookies.getAll());

  // redirect already-authenticated users away from /auth
  if (pathname.startsWith("/auth")) {
    const token = request.cookies.get(AUTH_COOKIE)?.value;
    console.log(`[Middleware] /auth - Token found:`, !!token);
    if (token) {
      try {
        verifyToken(token);
        console.log(`[Middleware] Token valid, redirecting to /`);
        const homeUrl = request.nextUrl.clone();
        homeUrl.pathname = "/";
        return NextResponse.redirect(homeUrl);
      } catch (e) {
        console.log(`[Middleware] Token invalid:`, e);
      }
    }
    return NextResponse.next();
  }

  // allow static assets, next internals, api/auth, favicon
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }

  // skip middleware if internal-server-to-server request header present
  if (request.headers.get("x-internal-request") === "true") {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  console.log(`[Middleware] Protected route - Token found:`, !!token, `Path: ${pathname}`);

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    console.log(`[Middleware] No token, redirecting to /auth`);
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  try {
    verifyToken(token);
    console.log(`[Middleware] Token valid for path: ${pathname}`);
    return NextResponse.next();
  } catch (e) {
    console.log(`[Middleware] Token verification failed:`, e);
    if (pathname.startsWith("/api/")) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
