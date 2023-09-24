import { NextResponse } from "next/server";

export function middleware(request) {
  const loginPath = ["/cms/login"];
  if (request.nextUrl.pathname === loginPath) {
    return NextResponse.next();
  } else {
    const accessToken = request.cookies.get("accessToken");

    if (!accessToken) {
      return NextResponse.redirect(new URL("/cms/login", request.url));
    } else {
      return NextResponse.next();
    }
  }
}

// determines which path the middleware will implement
export const config = {
  matcher: ["/products"],
};
