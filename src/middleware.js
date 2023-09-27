import { NextResponse } from "next/server";

export function middleware(request) {
  const authPaths = ["/login", "/register"];
  const isAuthPath = authPaths.includes(request.nextUrl.pathname);
  const accessToken = request.cookies.get("accessToken");
  const redirect = (isAuthPath && accessToken) || (!isAuthPath && !accessToken);

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
    "/logout",
  ],
};
