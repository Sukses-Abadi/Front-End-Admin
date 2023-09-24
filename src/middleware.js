import { NextResponse } from "next/server";

export function middleware(request) {
  const authPaths = ["/login", "/register"];
  const isAuthPath = authPaths.includes(request.nextUrl.pathname);
  const adminAccessToken = request.cookies.get("adminAccessToken");
  const redirect =
    (isAuthPath && adminAccessToken) || (!isAuthPath && !adminAccessToken);

  return redirect
    ? NextResponse.redirect(new URL(isAuthPath ? "/" : "/login", request.url))
    : NextResponse.next();
}

// determines which path the middleware will implement
export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/shop-details",
    "/category",
    "/category/:path*",
    "/products/:path*",
    "/logout",
  ],
};
