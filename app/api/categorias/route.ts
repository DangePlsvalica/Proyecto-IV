import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: obtener la lista de todas las categorías
export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany();
    return NextResponse.json(categorias);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching categorias:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Error fetching categorias" }, { status: 500 });
  }
}

// POST: crear una nueva categoría
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const nuevaCategoria = await prisma.categoria.create({
      data: {
        nombre: data.nombre,
      },
    });
    return NextResponse.json(nuevaCategoria, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creando nueva categoría:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Error creando nueva categoría" }, { status: 500 });
  }
}