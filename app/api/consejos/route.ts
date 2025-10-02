import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Endpoint GET: Obtiene todos los consejos comunales con sus relaciones
export async function GET() {
  try {
    const consejos = await prisma.consejoComunal.findMany({
      include: {
        parroquiaRelation: true,
        comuna: true,
        vocerias: {
          include: {
            tipoVoceria: true,
            titular: true,
            suplente: true,
          },
        },
        titularesComisionElectoral: true,
        suplentesComisionElectoral: true,
        titularesContraloria: true,
        suplentesContraloria: true,
        titularesFinanzas: true,
        suplentesFinanzas: true,
      },
    });

    return NextResponse.json(consejos);
  } catch (error: unknown) {
    console.error("Error fetching consejos comunales:", error);
    return NextResponse.json({ error: (error instanceof Error ? error.message : "Error fetching") }, { status: 500 });
  }
}

// Endpoint POST: Crea un nuevo consejo comunal con sus relaciones
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
      comunaId,
      titularesComisionElectoralIds,
      suplentesComisionElectoralIds,
      titularesContraloriaIds,
      suplentesContraloriaIds,
      titularesFinanzasIds,
      suplentesFinanzasIds,
      voceriasEjecutivas,
    } = body;

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

    const nuevoConsejo = await prisma.consejoComunal.create({
      data: {
        cc,
        rif,
        numeroCuenta,
        fechaConstitucion: new Date(fechaConstitucion),
        fechaVencimiento: new Date(fechaVencimiento),
        poblacionVotante: Number(poblacionVotante),
        parroquiaId,
        comunaId,
      },
    });

    await prisma.consejoComunal.update({
      where: { id: nuevoConsejo.id },
      data: {
        titularesComisionElectoral: {
          connect: titularesComisionElectoralIds.map((id: number) => ({ id })),
        },
        suplentesComisionElectoral: {
          connect: suplentesComisionElectoralIds.map((id: number) => ({ id })),
        },
        titularesContraloria: {
          connect: titularesContraloriaIds.map((id: number) => ({ id })),
        },
        suplentesContraloria: {
          connect: suplentesContraloriaIds.map((id: number) => ({ id })),
        },
        titularesFinanzas: {
          connect: titularesFinanzasIds.map((id: number) => ({ id })),
        },
        suplentesFinanzas: {
          connect: suplentesFinanzasIds.map((id: number) => ({ id })),
        },
      },
    });
    
    if (Array.isArray(voceriasEjecutivas)) {
      for (const voc of voceriasEjecutivas) {
        await prisma.voceria.create({
          data: {
            ccId: nuevoConsejo.id,
            tipoVoceriaId: voc.tipoVoceriaId,
            titularId: voc.titularId,
            suplenteId: voc.suplenteId || null,
          },
        });
      }
    }

    return NextResponse.json(nuevoConsejo, { status: 201 });
  } catch (error: any) {
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