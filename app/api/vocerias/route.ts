import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tiposVoceria = await prisma.tipoVoceria.findMany();
    return NextResponse.json(tiposVoceria);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching vocerias:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Error fetching vocerias:", error);
      return NextResponse.json({ error: "Error fetching vocerias" }, { status: 500 });
    }
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, categoriaId } = body;

    if (!nombre || !categoriaId) {
      return NextResponse.json(
        { error: "El nombre y la categoría son obligatorios" },
        { status: 400 }
      );
    }

    const nuevaVoceria = await prisma.tipoVoceria.create({
      data: {
        nombre,
        categoriaId,
        esObligatoria: false,
      },
    });

    return NextResponse.json(nuevaVoceria, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating voceria:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Error creating voceria:", error);
      return NextResponse.json({ error: "Error creating voceria" }, { status: 500 });
    }
  }
}
