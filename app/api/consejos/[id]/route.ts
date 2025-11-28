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

// En /app/api/consejos/[id]/route.ts
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        await prisma.$transaction(async (tx) => {
            
            // 🔎 PASO 0: OBTENER EL CONSEJO COMUNAL (Necesitamos su campo 'cc' y verificar que existe)
            const consejoComunalToDelete = await tx.consejoComunal.findUnique({
                where: { id },
                select: { cc: true, id: true } // Solo necesitamos 'cc' e 'id'
            });

            if (!consejoComunalToDelete || !consejoComunalToDelete.cc) {
                throw new Error("ConsejoComunalNotFound");
            }
            
            // El valor a usar en el filtro de Vehiculo es:
            const ccValue = consejoComunalToDelete.cc; 


            // 1. ELIMINAR RELACIONES UNO-A-MUCHOS (O:M)
            
            // 1a. Eliminar Vocerías Ejecutivas
            await tx.voceria.deleteMany({
                where: { ccId: id },
            });
            
            // 1b. ELIMINAR VEHÍCULOS ASOCIADOS 👈 CORRECCIÓN APLICADA AQUÍ
            await tx.vehiculo.deleteMany({
                where: { 
                    // Usamos el campo 'cc' del modelo Vehiculo que referencia el 'cc' del Consejo Comunal
                    cc: ccValue 
                },
            });

            // 1c. ELIMINAR PROYECTOS ASOCIADOS (Asumimos que sigue la estructura estándar)
            await tx.proyecto.deleteMany({
                where: { consejoComunal: { id: id } }, 
            });

            // 2. DESVINCULAR RELACIONES MUCHOS-A-MUCHOS (M:M)
            await tx.consejoComunal.update({
                where: { id: id },
                data: {
                    titularesComisionElectoral: { set: [] },
                    suplentesComisionElectoral: { set: [] },
                    titularesContraloria: { set: [] },
                    suplentesContraloria: { set: [] },
                    titularesFinanzas: { set: [] },
                    suplentesFinanzas: { set: [] },
                },
            });
            
            // 3. Eliminar el Consejo Comunal
            await tx.consejoComunal.delete({
                where: { id: id },
            });
            
        });
        
        return NextResponse.json({ message: "Consejo Comunal eliminado exitosamente." }, { status: 200 });

    } catch (error: any) {
        if (error.message === 'ConsejoComunalNotFound' || error.code === 'P2025') {
            return NextResponse.json({ error: "No se pudo encontrar el Consejo Comunal a eliminar." }, { status: 404 });
        }
        
        console.error(`Error eliminando consejo comunal con ID ${id}:`, error);
        return NextResponse.json({ error: "Error interno al eliminar el Consejo Comunal.", detail: error.message }, { status: 500 });
    }
}