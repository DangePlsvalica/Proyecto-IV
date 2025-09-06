import { NextResponse } from 'next/server'; 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
        comisionElectoral: true,
        suplenteComisionElectoral: true,
        contraloria: true,
        suplenteContraloria: true,
        finanzas: true,
        suplenteFinanzas: true,
      },
    });

    return NextResponse.json(consejos);
  } catch (error: unknown) {
    console.error("Error fetching consejos comunales:", error);
    return NextResponse.json({ error: (error instanceof Error ? error.message : "Error fetching") }, { status: 500 });
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
      comunaId,
      comisionElectoralId,
      suplenteComisionElectoralId,
      contraloriaId,
      suplenteContraloriaId,
      finanzasId,
      suplenteFinanzasId,
      voceriasEjecutivas,
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
        comunaId,
        comisionElectoralId,
        suplenteComisionElectoralId,
        contraloriaId,
        suplenteContraloriaId,
        finanzasId,
        suplenteFinanzasId,
      },
    });

        // Crear vocerías asociadas
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