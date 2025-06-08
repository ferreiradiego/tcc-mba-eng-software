import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value || "";
  const sessionToken =
    request.headers.get("authorization")?.replace("Bearer ", "") || "";

  if (request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.next();
  }
  // Protege rotas do dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // Permite se houver token no cookie ou header
    if (token || sessionToken) {
      return NextResponse.next();
    }
    // Redireciona para login se não autenticado
    return NextResponse.redirect(new URL("/auth", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
