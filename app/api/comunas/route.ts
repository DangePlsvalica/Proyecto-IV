import { NextResponse } from 'next/server'; 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Manejo del método GET (obtener comunas)
export async function GET() {
  try {
    const comunas = await prisma.comuna.findMany();
    console.log('Datos de la base de datos:', comunas); // Verifica qué devuelve Prisma
    return NextResponse.json(comunas);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching comunas:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Error fetching comunas:", error);
      return NextResponse.json({ error: "Error fetching comunas" }, { status: 500 });
    }
  }
}

// Manejo del método POST (crear una nueva comuna)
export async function POST(req: Request) {
  try {
    const data = await req.json(); // Captura los datos enviados en el cuerpo de la solicitud
    const consejoComunal = Array.isArray(data.consejoComunal)
      ? data.consejoComunal
      : [data.consejoComunal]; // Esto asegura que siempre sea un array
    const nuevaComuna = await prisma.comuna.create({
      data: {
        ...data,
        consejoComunal: JSON.stringify(consejoComunal),
      },
    });
    console.log("Nueva comuna creada:", nuevaComuna);
    return NextResponse.json(nuevaComuna, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creando comuna:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Error creando comuna:", error);
      return NextResponse.json({ error: "Error creating comuna" }, { status: 500 });
    }
  }
}






