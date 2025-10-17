import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const consejo = await prisma.consejoComunal.findUnique({
            where: { id },
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

        if (!consejo) {
            return NextResponse.json({ error: "Consejo Comunal no encontrado" }, { status: 404 });
        }

        return NextResponse.json(consejo);
    } catch (error: unknown) {
        console.error(`Error fetching consejo comunal con ID ${id}:`, error);
        return NextResponse.json({ error: "Error al buscar consejo comunal" }, { status: 500 });
    }
}

// Endpoint PUT: Actualiza un consejo comunal existente (SOLO DATOS BASE)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
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
        } = body;
        
        // Validación de campos obligatorios
        if (!cc || !rif || !numeroCuenta || !fechaConstitucion || !fechaVencimiento || poblacionVotante == null) {
            return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
        }
        const consejoActualizado = await prisma.consejoComunal.update({
            where: { id },
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

        return NextResponse.json(consejoActualizado, { status: 200 });
        
    } catch (error: any) {
        if (error.code === "P2002" && error.meta?.target?.includes("rif")) {
            return NextResponse.json({ error: "El RIF ya existe" }, { status: 409 });
        }
        
        console.error(`Error actualizando consejo comunal con ID ${id}:`, error);
        return NextResponse.json({ error: "Error actualizando consejo comunal" }, { status: 500 });
    }
}