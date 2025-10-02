import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: obtener la lista de todas las consultas
export async function GET() {
  try {
    const consultas = await prisma.consulta.findMany();
    return NextResponse.json(consultas);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching consultas:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Error fetching consultas" }, { status: 500 });
  }
}

// POST: crear una nueva consulta
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const nuevaConsulta = await prisma.consulta.create({
      data: {
        nombre: data.nombre,
      },
    });
    return NextResponse.json(nuevaConsulta, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creando nueva consulta:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Error creando nueva consulta" }, { status: 500 });
  }
}