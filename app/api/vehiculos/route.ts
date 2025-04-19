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

export async function POST(req: Request) {
  try {
    const data = await req.json(); // Captura los datos enviados en el cuerpo de la solicitud
    const nuevoVehiculo = await prisma.vehiculo.create({
      data: {
        ...data,
        observacionArchivo: data.observacionArchivo || null,
        observacion: data.observacion || null,
      },
    });
    console.log("Nuevo vehiculo creado:", nuevoVehiculo);
    return NextResponse.json(nuevoVehiculo, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creando vehiculo:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Error creando vehiculo:", error);
      return NextResponse.json({ error: "Error creating vehiculo" }, { status: 500 });
    }
  }
}






