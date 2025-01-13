import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Optionally, verify token here if necessary
  return NextResponse.next();
}

// Define the routes where the middleware should apply
export const config = {
  matcher: ["/profile", "/my-learning", "/admin/:path*"], // Add routes that need protection
};
