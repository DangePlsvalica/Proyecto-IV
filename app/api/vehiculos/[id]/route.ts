import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path'; // ¡Asegúrate de tener esta importación!

const prisma = new PrismaClient();
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'vehiculos'); 

// ... (handleFormData function remains the same)
async function handleFormData(request: Request) {
    const formData = await request.formData();
    const data: Record<string, any> = {};
    let fileToUpload: File | undefined = undefined;

    for (const [key, value] of Array.from(formData.entries())) { 
        if (key === 'observacionArchivo' && value instanceof File) {
            fileToUpload = value;
        } else {
            data[key] = value;
        }
    }
    return { data, fileToUpload };
}
// ...

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const vehiculoId = parseInt(params.id);
    if (isNaN(vehiculoId)) {
        return NextResponse.json({ error: "ID de vehículo inválido" }, { status: 400 });
    }
    
    try {
        const { data: body, fileToUpload } = await handleFormData(request);
        const {
            placa, clase, marca, modelo, color, ano, serialCarroceria, estatus, observacion,
            observacionArchivo: observacionArchivoSignal,
        } = body;

        let newObservacionArchivoPath: string | null = null; 
        
        const oldVehiculo = await prisma.vehiculo.findUnique({ where: { id: vehiculoId } });

        if (!oldVehiculo) {
            return NextResponse.json({ error: "Vehículo no encontrado" }, { status: 404 });
        }
        
        // 1. Gestión de Archivos
        if (fileToUpload) {
            const fileName = `${Date.now()}-${fileToUpload.name.replace(/[^a-z0-9.]/gi, '_')}`;
            const filePath = path.join(UPLOADS_DIR, fileName);
            
            await fs.mkdir(UPLOADS_DIR, { recursive: true });
            
            // SOLUCIÓN AL ERROR DE BUFFER: Convertir el ArrayBuffer a Uint8Array
            const buffer = new Uint8Array(await fileToUpload.arrayBuffer());
            await fs.writeFile(filePath, buffer); 
            
            newObservacionArchivoPath = `/uploads/vehiculos/${fileName}`; 
            
            // Eliminar el archivo antiguo
            if (oldVehiculo.observacionArchivo) {
                const oldFilePath = path.join(process.cwd(), 'public', oldVehiculo.observacionArchivo);
                try {
                    await fs.unlink(oldFilePath);
                } catch (e) {
                    console.warn(`No se pudo eliminar el archivo antiguo: ${oldVehiculo.observacionArchivo}`);
                }
            }
        } 
        
        // 2. Si se recibe la señal de eliminación
        else if (observacionArchivoSignal === 'DELETE_FILE_SIGNAL') {
            if (oldVehiculo.observacionArchivo) {
                const oldFilePath = path.join(process.cwd(), 'public', oldVehiculo.observacionArchivo);
                try {
                    await fs.unlink(oldFilePath);
                } catch (e) {
                    console.warn(`No se pudo eliminar el archivo marcado: ${oldVehiculo.observacionArchivo}`);
                }
            }
            newObservacionArchivoPath = null;
        } 
        
        // 3. Si no se toca el archivo, mantenemos el path antiguo.
        else {
            newObservacionArchivoPath = oldVehiculo.observacionArchivo;
        }
        
        // ... (El resto del código de actualización de Prisma se mantiene igual)

        const updateData: any = {
            placa,
            clase,
            marca,
            modelo,
            color,
            ano: Number(ano),
            serialCarroceria,
            estatus,
            observacion,
            observacionArchivo: newObservacionArchivoPath, 
        };
        
        const vehiculoActualizado = await prisma.vehiculo.update({
            where: { id: vehiculoId },
            data: updateData,
            include: { voceroAsignado: true, consejoComunal: true },
        });

        return NextResponse.json(vehiculoActualizado, { status: 200 });
        
    } catch (error: any) {
         if (error.code === 'P2002' && error.meta?.target?.includes('placa')) {
             return NextResponse.json({ error: 'La placa ya está registrada.' }, { status: 409 });
        }
        
        console.error(`Error actualizando vehículo con ID ${vehiculoId}:`, error);
        return NextResponse.json({ error: "Error al actualizar el vehículo." }, { status: 500 });
    }
}