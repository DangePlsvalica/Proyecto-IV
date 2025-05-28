import { NextResponse, NextRequest } from 'next/server'; 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Manejo del método GET (obtener usuarios)
export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching users:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Error fetching users:", error);
      return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
    }
  }
}

export async function DELETE(request: NextRequest) {
  const body = await request.json(); // Extrae el cuerpo de la solicitud
  const { id } = body; // Obtiene el ID del cuerpo

  console.log("Intentando eliminar el usuario con ID:", id); // Log para depuración

  if (!id) {
    console.error("ID del usuario no proporcionado");
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const deletedUser = await prisma.user.delete({
      where: { id },
    });
    return NextResponse.json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting user" }, { status: 500 });
  }
}


// Manejo del método PUT (actualizar rol de usuario)
export async function PUT(request: NextRequest) {
  const body = await request.json(); // Obtiene el cuerpo de la solicitud
  const { id, roleId } = body;

  console.log("Intentando actualizar el rol del usuario con ID:", id, "a rol:", roleId); // Log inicial

  if (!id || !roleId) {
    console.error("ID o rol no proporcionados"); // Log de error si faltan valores
    return NextResponse.json(
      { error: "User ID and role are required" },
      { status: 400 }
    );
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { roleId },
    });
    return NextResponse.json(updatedUser);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error al actualizar el rol del usuario:", error.message); // Log detallado del error
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error("Error desconocido al actualizar el rol del usuario"); // Log de error desconocido
    return NextResponse.json({ error: "Error updating user role" }, { status: 500 });
  }
}










