import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, verifySession } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const routePath = pathname;

  if (routePath.startsWith("/api/health")) {
    return NextResponse.next();
  }

  const sessionValid = await verifySession(request.cookies.get(AUTH_COOKIE)?.value);

  if (routePath === "/" && sessionValid) {
    return NextResponse.redirect(new URL("/ferramentas", request.url));
  }

  if (routePath.startsWith("/login")) {
    if (sessionValid) {
      return NextResponse.redirect(new URL("/ferramentas", request.url));
    }
    return NextResponse.next();
  }

  if (!sessionValid) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = `?next=${encodeURIComponent(`${routePath}${search}`)}`;
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png|api/health).*)",],
};
