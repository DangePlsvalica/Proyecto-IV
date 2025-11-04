import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Endpoint PUT: Actualiza una Comuna existente (SOLO DATOS BASE)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const body = await request.json();
        
        const {
            codigo,
            numComisionPromotora,
            fechaComisionPromotora,
            rif,
            cuentaBancaria,
            fechaRegistro,
            nombre,
            direccion,
            linderoNorte,
            linderoSur,
            linderoEste,
            linderoOeste,
            fechaUltimaEleccion,
            parroquiaId,
            // Las propiedades de relación y cálculo se ignoran si llegan, 
            // pero el frontend ya las filtra.
        } = body;
        
        if (!nombre || !rif || !direccion || !parroquiaId) {
            return NextResponse.json({ error: "Faltan campos obligatorios para la actualización de la Comuna." }, { status: 400 });
        }
        
        const comunaActualizada = await prisma.comuna.update({
            where: { id },
            data: {
                codigo,
                numComisionPromotora,
                fechaComisionPromotora: new Date(fechaComisionPromotora),
                rif,
                cuentaBancaria,
                fechaRegistro: new Date(fechaRegistro),
                nombre,
                direccion,
                linderoNorte,
                linderoSur,
                linderoEste,
                linderoOeste,
                fechaUltimaEleccion: new Date(fechaUltimaEleccion),
                // 💡 CLAVE: Actualizamos la relación 1:1 de la Parroquia
                parroquiaRelation: {
                    connect: { id: parroquiaId } 
                },
            },
        });

        return NextResponse.json(comunaActualizada, { status: 200 });
        
    } catch (error: any) {
        if (error.code === "P2002" && error.meta?.target?.includes("rif")) {
            return NextResponse.json({ error: "El RIF ya está registrado en otra Comuna." }, { status: 409 });
        }
        
        console.error(`Error actualizando Comuna con ID ${id}:`, error);
        return NextResponse.json({ error: "Error actualizando Comuna" }, { status: 500 });
    }
}
