import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("🔐 Session:", session);
    console.log("🆔 Session user id:", session?.user?.id);

    if (!session || !session.user?.id) {
      console.log("❌ No autenticado");
      return Response.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    console.log("📥 Request body:", body);
    console.log("🔑 Current password:", currentPassword);
    console.log("🆕 New password:", newPassword);

    if (!currentPassword || !newPassword || newPassword.length < 8) {
      console.log("⚠️ Contraseña inválida");
      return Response.json(
        { error: "La contraseña nueva debe tener al menos 8 caracteres" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    console.log("👤 User from DB:", user);
    console.log("🔒 Hashed password in DB:", user?.hashedPassword);

    if (!user || !user.hashedPassword) {
      console.log("❌ Usuario no válido");
      return Response.json({ error: "Usuario no válido" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.hashedPassword);
    console.log("✅ ¿La contraseña actual es válida?:", isValid);

    if (!isValid) {
      console.log("❌ La contraseña actual es incorrecta");
      return Response.json(
        { error: "La contraseña actual es incorrecta" },
        { status: 403 }
      );
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("🔐 Nueva contraseña hasheada:", newHashedPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword: newHashedPassword },
    });

    console.log("✅ Contraseña actualizada correctamente");
    return Response.json({ message: "Contraseña actualizada correctamente" }, { status: 200 });
  } catch (error) {
    console.error("💥 Error al cambiar la contraseña:", error);
    return Response.json({ error: "Error del servidor" }, { status: 500 });
  }
}
