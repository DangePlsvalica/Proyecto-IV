import { NextResponse } from 'next/server'; 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const consejos = await prisma.consejoComunal.findMany({
      include: {
        parroquiaRelation: true,
        vocero: true,
        comuna: true,
      },
    });
    return NextResponse.json(consejos);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching consejos comunales:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Error fetching consejos comunales:", error);
      return NextResponse.json({ error: "Error fetching consejos comunales" }, { status: 500 });
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      cc,
      rif,
      numeroCuenta,
      fechaConstitucion,
      fechaVencimiento,
      poblacionVotante,
      parroquiaId,
      voceroId,
      comunaId,
    } = body;

    /* Validaciones básicas */
    if (
      !cc ||
      !rif ||
      !numeroCuenta ||
      !fechaConstitucion ||
      !fechaVencimiento ||
      poblacionVotante == null
    ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    /* Creación en Prisma */
    const nuevoConsejo = await prisma.consejoComunal.create({
      data: {
        cc,
        rif,
        numeroCuenta,
        fechaConstitucion: new Date(fechaConstitucion),
        fechaVencimiento: new Date(fechaVencimiento),
        poblacionVotante: Number(poblacionVotante),
        parroquiaId,
        voceroId,
        comunaId,
      },
      include: {
        parroquiaRelation: true,
        vocero: true,
        comuna: true,
      },
    });

    return NextResponse.json(nuevoConsejo, { status: 201 });
  } catch (error: any) {
    /* Manejo específico de duplicado de RIF (código P2002) */
    if (error.code === "P2002" && error.meta?.target?.includes("rif")) {
      return NextResponse.json(
        { error: "El RIF ya existe" },
        { status: 409 }
      );
    }

    console.error("Error creando consejo comunal:", error);
    return NextResponse.json(
      { error: "Error creando consejo comunal" },
      { status: 500 }
    );
  }
}