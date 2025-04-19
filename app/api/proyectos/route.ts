import { NextResponse } from 'next/server'; 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const proyectos = await prisma.proyecto.findMany();
    return NextResponse.json(proyectos);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching proyectos:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Error fetching proyectos:", error);
      return NextResponse.json({ error: "Error fetching proyectos" }, { status: 500 });
    }
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json(); // Captura los datos enviados en el cuerpo de la solicitud
    const nuevoProyecto = await prisma.proyecto.create({
      data: {
        ...data,
      },
    });
    console.log("Nuevo Proyecto creado:", nuevoProyecto);
    return NextResponse.json(nuevoProyecto, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creando Proyecto:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Error creando Proyecto:", error);
      return NextResponse.json({ error: "Error creating Proyecto" }, { status: 500 });
    }
  }
}






