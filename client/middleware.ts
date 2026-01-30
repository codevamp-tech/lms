import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const publicRoutes = ["/forgot-password", "/reset-password"];

  if (
    publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    return NextResponse.next();
  }
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/profile",
    "/my-learning",
    "/create-blog",
    "/favorites",
    "/cart",
    "/course/course-progress/:path*",
    "/admin/:path*",
  ],
};
