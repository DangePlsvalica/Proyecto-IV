import { NextResponse } from 'next/server'; 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Manejo del método GET (obtener comunas)
export async function GET() {
  try {
    const comunas = await prisma.comuna.findMany({
      include: {
        consejosComunales: {
          select: {
            cc: true,
          }
        },
        parroquiaRelation: { 
          select: {
            nombre: true,
            municipio: true,
            estado: true
          }
        }
      },
    });
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
    const data = await req.json();
    console.log('Data received in server:', data);

    // Verifica los campos requeridos
    if (!data.consejosComunales || data.consejosComunales.length === 0) {
      return NextResponse.json({ error: 'Consejos Comunales son requeridos' }, { status: 400 });
    }

    if (!data.parroquiaId) {
      return NextResponse.json({ error: 'El ID de la parroquia es requerido' }, { status: 400 });
    }

    // Transformación de datos
    const comunaData = {
      ...data,
      fechaComisionPromotora: new Date(data.fechaComisionPromotora),
      fechaRegistro: new Date(data.fechaRegistro),
      fechaUltimaEleccion: new Date(data.fechaUltimaEleccion),
      cantidadConsejosComunales: Number(data.cantidadConsejosComunales),
      poblacionVotante: Number(data.poblacionVotante),
      consejosComunales: {
        connect: data.consejosComunales.map((id: string) => ({ id })),
      },
    };

   // Creación en la base de datos
    const nuevaComuna = await prisma.comuna.create({
      data: comunaData
    });

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