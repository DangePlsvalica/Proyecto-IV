import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      role?: string; // Añadir el campo `role` al usuario de la sesión
    } & DefaultSession["user"];
  }

  interface User {
    role?: string; // Añadir el campo `role` al usuario
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string; // Añadir el campo `role` al token JWT
  }
}

