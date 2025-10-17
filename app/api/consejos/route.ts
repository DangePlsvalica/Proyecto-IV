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

// Endpoint POST: Crea un nuevo consejo comunal con sus relaciones (¡ROBUSTO con Transacción!)
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {
            cc,
            rif,
            situr,
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

        // Usamos una transacción para asegurar que todas las operaciones se completen o se reviertan
        const [nuevoConsejo] = await prisma.$transaction(async (tx) => {
            const consejo = await tx.consejoComunal.create({
                data: {
                    cc,
                    rif,
                    situr,
                    numeroCuenta,
                    fechaConstitucion: new Date(fechaConstitucion),
                    fechaVencimiento: new Date(fechaVencimiento),
                    poblacionVotante: Number(poblacionVotante),
                    parroquiaId,
                    comunaId,
                },
            });

            await tx.consejoComunal.update({
                where: { id: consejo.id },
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
                    await tx.voceria.create({
                        data: {
                            ccId: consejo.id,
                            tipoVoceriaId: voc.tipoVoceriaId,
                            titularId: voc.titularId,
                            suplenteId: voc.suplenteId || null,
                        },
                    });
                }
            }
            
            return [consejo];
        });


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

// Endpoint DELETE: Elimina un consejo comunal y sus vocerías asociadas
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        await prisma.$transaction(async (tx) => {
            const voceriasCount = await tx.voceria.deleteMany({
                where: { ccId: id },
            });
            const consejo = await tx.consejoComunal.findUnique({ where: { id } });
            
            if (consejo) {
                await tx.consejoComunal.update({
                    where: { id },
                    data: {
                        titularesComisionElectoral: { set: [] },
                        suplentesComisionElectoral: { set: [] },
                        titularesContraloria: { set: [] },
                        suplentesContraloria: { set: [] },
                        titularesFinanzas: { set: [] },
                        suplentesFinanzas: { set: [] },
                    },
                });
            } else {
                 return NextResponse.json({ error: "Consejo Comunal no encontrado" }, { status: 404 });
            }

            const result = await tx.consejoComunal.delete({
                where: { id },
            });
            return result; 
        });
        return NextResponse.json({ message: "Consejo Comunal y sus vocerías eliminados exitosamente." }, { status: 200 });

    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json({ error: "No se pudo encontrar el Consejo Comunal a eliminar." }, { status: 404 });
        }
        console.error(`Error eliminando consejo comunal con ID ${id}:`, error);
        return NextResponse.json({ error: "Error al eliminar el Consejo Comunal." }, { status: 500 });
    }
}