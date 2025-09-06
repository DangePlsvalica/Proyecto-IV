import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: lista de proyectos con relaciones
export async function GET() {
  try {
    const proyectos = await prisma.proyecto.findMany({
      include: {
        consejoComunal: {
          include: {
            parroquiaRelation: true,
            comuna: true,
          },
        },
      },
    });
    return NextResponse.json(proyectos);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching proyectos:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Error fetching proyectos" }, { status: 500 });
  }
}

// POST: crear un nuevo proyecto
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const nuevoProyecto = await prisma.proyecto.create({
      data: {
        nombreProyecto: data.nombreProyecto,
        codigoProyecto: data.codigoProyecto,
        consulta: data.consulta,
        estatusProyecto: data.estatusProyecto,
        circuito: data.circuito,
        categoria: data.categoria,
        observacion: data.observacion,
        consejoComunalId: data.consejoComunalId,
      },
    });
    console.log("Nuevo Proyecto creado:", nuevoProyecto);
    return NextResponse.json(nuevoProyecto, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creando Proyecto:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Error creando Proyecto" }, { status: 500 });
  }
}
