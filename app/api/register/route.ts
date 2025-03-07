import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    console.log("Email recibido:", email); // Log para depuración
    console.log("Contraseña recibida:", password); // Log para depuración

    // Verificar que todos los campos sean proporcionados
    if (!email || !password ) {
      return new Response("Todos los campos son obligatorios", { status: 400 });
    }

    // Validación de formato de correo electrónico
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return new Response("El correo electrónico no es válido", { status: 400 });
    }

    // Verificar si el correo electrónico ya está registrado
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    console.log("Usuario encontrado:", existingUser); // Log para depuración

    if (existingUser) {
      return new Response("El correo electrónico ya está registrado", { status: 400 });
    }

    // Cifrar la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario en la base de datos
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });

    // Responder con el usuario recién creado
    return new Response(JSON.stringify(user), { status: 201 });

  } catch (error) {
    // Manejo de errores generales
    console.error("Error durante el registro:", error);
    return new Response("Hubo un error al procesar tu solicitud", { status: 500 });
  }
}
