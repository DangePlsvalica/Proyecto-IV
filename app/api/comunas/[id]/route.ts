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

// ✅ API Endpoint DELETE Corregido para Desvincular CCs
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params; 

    try {
        await prisma.$transaction(async (tx) => {
            
            // 1. DESVINCULAR: Quitar el vínculo de todos los Consejos Comunales asociados a esta Comuna.
            // Asumiendo que 'comunaId' en ConsejoComunal permite NULL.
            const desvinculadosCount = await tx.consejoComunal.updateMany({
                where: { comunaId: id }, 
                data: { comunaId: null }, // 👈 Esto desvincula los CCs de la Comuna
            });
            
            // Opcional: Si quieres un mensaje en la consola sobre cuántos CCs se desvincularon
            console.log(`Se desvincularon ${desvinculadosCount.count} Consejos Comunales de la Comuna ${id}.`);
            
            // 2. ENCONTRAR Y LIMPIAR OTRAS RELACIONES M:N (Persona[])
            const comuna = await tx.comuna.findUnique({ where: { id } });
            
            if (!comuna) {
                // Lanzamos error para que caiga en el catch 404
                throw new Error("Comuna no encontrada");
            }
            
            // Limpiamos explícitamente las relaciones M:N del modelo Comuna (Vocerías)
            await tx.comuna.update({
                where: { id },
                data: {
                    bancoDeLaComuna: { set: [] },

                } as any,
            });
            
            // 3. ELIMINAR LA COMUNA
            await tx.comuna.delete({
                where: { id },
            });
            
            return true; // No es el valor que se devuelve, solo cumple con el tipado de la transacción
        });
        
        return NextResponse.json({ message: "Comuna y Consejos Comunales desvinculados eliminados exitosamente." }, { status: 200 });

    } catch (error: any) {
        if (error.code === 'P2025' || error.message === "Comuna no encontrada") {
            return NextResponse.json({ error: "No se pudo encontrar la Comuna a eliminar." }, { status: 404 });
        }
        console.error("Error detallado al eliminar Comuna:", error);
        // Eliminamos el manejo de error 409, ya que la dependencia se maneja ahora con desvinculación
        
        console.error(`Error eliminando Comuna con ID ${id}:`, error);
        return NextResponse.json({ error: "Error al eliminar la Comuna." }, { status: 500 });
    }
}
