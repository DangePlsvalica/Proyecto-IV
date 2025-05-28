import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: {
        id: string;
        name: string;
        routes: string[];
      } | null;
    };
  }

  interface User {
    id: string;
    email: string;
    role?: {
      id: string;
      name: string;
      routes: string[];
    } | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    role?: {
      id: string;
      name: string;
      routes: string[];
    } | null;
  }
}