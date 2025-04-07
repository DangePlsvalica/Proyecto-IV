import { NextResponse } from 'next/server'; 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const vehiculos = await prisma.vehiculo.findMany();
    return NextResponse.json(vehiculos);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching vehiculos:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Error fetching vehiculos:", error);
      return NextResponse.json({ error: "Error fetching vehiculos" }, { status: 500 });
    }
  }
}

/* export async function POST(req: Request) {
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
} */






