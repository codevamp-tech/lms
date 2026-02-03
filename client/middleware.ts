import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // --- MAINTENANCE MODE START ---
  if (request.nextUrl.pathname === "/maintenance") {
    return NextResponse.next();
  }

  // Allow next.js internals and static assets
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/static") ||
    request.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Redirect all other traffic to maintenance
  return NextResponse.redirect(new URL("/maintenance", request.url));
  // --- MAINTENANCE MODE END ---

  /*
  // RESTORE ORIGINAL LOGIC WHEN MAINTENANCE ENDS
  const token = request.cookies.get("token")?.value;
  const publicRoutes = ["/forgot-password", "/reset-password"];

  if (publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
  */
}

export const config = {
  matcher: "/:path*",
  /*
  matcher: [
    "/profile",
    "/my-learning",
    "/create-blog",
    "/favorites",
    "/cart",
    "/course/course-progress/:path*",
    "/admin/:path*",
  ],
  */
};
