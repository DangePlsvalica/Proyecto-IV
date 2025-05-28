import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, routes } = await req.json();

    if (!name || !routes || !Array.isArray(routes) || routes.length === 0) {
      return new Response("Nombre y rutas son obligatorios", { status: 400 });
    }

    // Verificar si el rol ya existe
    const existingRole = await prisma.role.findUnique({ where: { name } });
    if (existingRole) {
      return new Response("El nombre del rol ya existe", { status: 400 });
    }

    const newRole = await prisma.role.create({
      data: {
        name,
        routes,
      },
    });

    return new Response(JSON.stringify(newRole), { status: 201 });

  } catch (error) {
    console.error("Error al crear el rol:", error);
    return new Response("Error al crear el rol", { status: 500 });
  }
}

export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return new Response(JSON.stringify(roles), { status: 200 });
  } catch (error) {
    console.error("Error al obtener roles:", error);
    return new Response("Error al obtener roles", { status: 500 });
  }
}