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

          // Buscar el usuario en la base de datos
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          // Verificar si el usuario existe y tiene la contraseña cifrada
          if (!user || !user.hashedPassword) return null;

          // Comparar la contraseña ingresada con la almacenada en la base de datos
          const isValid = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          );

          if (isValid) {
            return {
              ...user,
              role: user.role,
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
        token.role = user.role; // Asigna el campo `role` al token
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role; // Asigna el campo `role` al objeto `session.user`
      }
      return session;
    },
  },
  session: {
    strategy: "jwt", // Usar JWT para la gestión de sesiones
  },
  secret: process.env.NEXTAUTH_SECRET, // Clave secreta para firmar el JWT
};

const handler = NextAuth(authOptions);

// Exportar el handler para manejar GET y POST
export { handler as GET, handler as POST };
