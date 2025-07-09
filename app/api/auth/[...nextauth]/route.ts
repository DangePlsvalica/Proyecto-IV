import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient(); // En producción se crea una instancia normal
} else {
  // En desarrollo o test, se utiliza una instancia global para evitar múltiples conexiones
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "correo@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.hashedPassword) return null;

          const isValid = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          );

          if (isValid) {
            return {
              id: user.id,
              email: user.email,
              name: user.email, // opcional
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error durante la autenticación:", error);
          return null;
        }
      },
    }),
  ],
    callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { role: true },
        });

        if (dbUser?.role) {
          token.role = {
            id: dbUser.role.id,
            name: dbUser.role.name,
            routes: dbUser.role.routes,
          };
        } else {
          token.role = null;
        }

        token.id = dbUser?.id;
        token.email = dbUser?.email;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id!;
      session.user.email = token.email!;
      session.user.role = token.role ?? null;

      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, authOptions };