import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'; 
import { ConsejoComunalFormDataEdit } from '@/hooks/interfaces/consejo.comunal.interface'; 

const prisma = new PrismaClient();

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id: consejoId } = params;

    try {
        const body: Partial<ConsejoComunalFormDataEdit> = await request.json();

        const {
            titularesComisionElectoralIds,
            suplentesComisionElectoralIds,
            titularesContraloriaIds,
            suplentesContraloriaIds,
            titularesFinanzasIds,
            suplentesFinanzasIds,
            voceriasEjecutivas,
        } = body;

        // Aumentar el timeout a 10 segundos para mitigar P2028
        const result = await prisma.$transaction(async (tx) => {

            const promises: Promise<any>[] = [];

            // --- A) ACTUALIZACIÓN DE VOCERÍAS PRINCIPALES (M-N) ---
            const updateData: any = {};
            
            if (titularesComisionElectoralIds !== undefined) {
                updateData.titularesComisionElectoral = { set: titularesComisionElectoralIds.map(id => ({ id })) };
            }
            if (suplentesComisionElectoralIds !== undefined) {
                updateData.suplentesComisionElectoral = { set: suplentesComisionElectoralIds.map(id => ({ id })) };
            }
            if (titularesContraloriaIds !== undefined) {
                updateData.titularesContraloria = { set: titularesContraloriaIds.map(id => ({ id })) };
            }
            if (suplentesContraloriaIds !== undefined) {
                updateData.suplentesContraloria = { set: suplentesContraloriaIds.map(id => ({ id })) };
            }
            if (titularesFinanzasIds !== undefined) {
                updateData.titularesFinanzas = { set: titularesFinanzasIds.map(id => ({ id })) };
            }
            if (suplentesFinanzasIds !== undefined) {
                updateData.suplentesFinanzas = { set: suplentesFinanzasIds.map(id => ({ id })) };
            }

            if (Object.keys(updateData).length > 0) {
                 promises.push(tx.consejoComunal.update({
                     where: { id: consejoId },
                     data: updateData,
                 }));
            }

            // --- B) ACTUALIZACIÓN/CREACIÓN DE VOCERÍAS EJECUTIVAS ---

            if (Array.isArray(voceriasEjecutivas)) {
                
                const currentVocerias = await tx.voceria.findMany({
                    where: { ccId: consejoId },
                    select: { id: true, tipoVoceriaId: true },
                });
                
                const voceriasToKeepTypeIds = new Set(voceriasEjecutivas.map(v => v.tipoVoceriaId));
                
                // 3. Eliminación: Borramos las que ya no se enviaron
                const voceriasToDelete = currentVocerias.filter(v => !voceriasToKeepTypeIds.has(v.tipoVoceriaId));
                
                if (voceriasToDelete.length > 0) {

                    promises.push(tx.voceria.deleteMany({
                        where: { id: { in: voceriasToDelete.map(v => v.id) } },
                    }));
                }

                // 4. Upsert
                for (const voceria of voceriasEjecutivas) {
                    const existingVoceria = currentVocerias.find(v => v.tipoVoceriaId === voceria.tipoVoceriaId);

                    const directData = {
                        titularId: voceria.titularId || null,
                        suplenteId: voceria.suplenteId || null,
                    };
                    
                    if (existingVoceria) {
                        // ACTUALIZAR
                        promises.push(tx.voceria.update({ 
                            where: { id: existingVoceria.id },
                            data: directData as any, 
                        }));
                    } else {
                        // CREAR
                        if (directData.titularId === null) {
                            continue; 
                        }
                        
                        promises.push(tx.voceria.create({ 
                            data: {
                                ccId: consejoId,
                                tipoVoceriaId: voceria.tipoVoceriaId,
                                titularId: directData.titularId, 
                                suplenteId: directData.suplenteId,
                            },
                        }));
                    }
                }
            } 

            await Promise.all(promises);

            return { message: "Vocerías actualizadas exitosamente." };
        }, {
            // Aumenta el timeout para el error P2028
            timeout: 10000 
        });

        return NextResponse.json(result);
        
    } catch (error) {
        console.error("Error updating voceros:", error);

        let status = 500;
        let message = 'Error al actualizar las vocerías (Error interno del servidor).';

        // Manejo de errores de Prisma
        if (error instanceof PrismaClientKnownRequestError) {
            status = 400;
            if (error.code === 'P2028') {
                 message = `Timeout de transacción excedido. La operación es demasiado lenta.`;
            } else if (error.code === 'P2003') {
                message = `Error de Clave Foránea: Un vocero asignado no existe o hay un conflicto de datos.`;
            } else if (error.code === 'P2002') {
                 message = `Error de Unicidad: Conflicto de datos. Revisa las asignaciones.`;
            }
             message = `[Código: ${error.code}] ${message}`;

        } else if (error instanceof Error) {
             message = error.message;
        }
        
        return NextResponse.json(
            { error: message },
            { status: status }
        );
    }
}