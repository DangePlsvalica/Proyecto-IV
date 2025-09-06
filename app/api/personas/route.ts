import { NextResponse } from 'next/server'; 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const personas = await prisma.persona.findMany({
      include: {
        vehiculo: true,   // Vehículo asignado
      },
    });

    return NextResponse.json(personas);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching personas:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Error fetching personas:", error);
      return NextResponse.json({ error: "Error fetching personas" }, { status: 500 });
    }
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json(); 
    const nuevaPersona = await prisma.persona.create({
      data: {
        ...data,
      },
    });
    console.log("Nueva persona registrada:", nuevaPersona);
    return NextResponse.json(nuevaPersona, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error registrando persona:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Error registrando persona:", error);
      return NextResponse.json({ error: "Error creating persona" }, { status: 500 });
    }
  }
}
