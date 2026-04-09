/* Middleware — portal ve admin route'larini korur */
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = req.nextUrl.pathname.startsWith("/admin");

    if (isAdmin && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/portal", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/giris",
    },
  }
);

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*"],
};
