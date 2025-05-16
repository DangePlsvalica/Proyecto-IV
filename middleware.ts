import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
  const token = await getToken({ req });

  // Definir las rutas que requieren autenticación
  const protectedRoutes = [
    "/admin-user", 
    "/comunas", 
    "/consejos-comunales", 
    "/gestor-de-proyectos", 
    "/register",
    "/vehiculos"];

  // Si la ruta es protegida y el usuario no tiene sesión, redirigir al login
  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Aplica el middleware a las rutas que quieres proteger
export const config = {
  matcher: [
    "/admin-user/:path*",
    "/comunas/:path*", 
    "/consejos-comunales/:path*",
    "/gestor-de-proyectos/:path*", 
    "/register/:path*", 
    "/vehiculos/:path*"
    ],
};
