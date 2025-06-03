import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = [
  "/admin-user",
  "/admin-role",
  "/personas",
  "/comunas",
  "/consejos-comunales",
  "/gestor-de-proyectos",
  "/register",
  "/vehiculos",
];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Solo actuar si la ruta está protegida
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // token.role debe ser un objeto con routes[]
    const userRoutes = (token.role && typeof token.role !== "string" && token.role.routes) || [];

    // Comprobar si la ruta está permitida para este rol
    const isAllowed = userRoutes.some((route: string) => pathname.startsWith(route));

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/consejos-comunales", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin-user/:path*",
    "/admin-role/:path*",
    "/personas/:path*",
    "/comunas/:path*",
    "/consejos-comunales/:path*",
    "/gestor-de-proyectos/:path*",
    "/register/:path*",
    "/vehiculos/:path*",
  ],
};