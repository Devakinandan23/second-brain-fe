import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Token is stored client-side in localStorage — cannot read it in proxy.
  // Auth enforcement is done client-side in the dashboard layout.
  // This proxy only handles the root redirect.
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
