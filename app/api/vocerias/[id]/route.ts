import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const id = Number(params.id);

    if (isNaN(id)) {
        return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    try {
        const body = await request.json();
        const { nombre, categoriaId } = body;

        if (!nombre && !categoriaId) {
            return NextResponse.json(
                { error: "Se requiere el 'nombre' o 'categoriaId' para la actualización." },
                { status: 400 }
            );
        }

        const dataToUpdate: { nombre?: string; categoriaId?: number } = {};

        if (nombre) {
            dataToUpdate.nombre = nombre;
        }

        if (categoriaId !== undefined) {
            dataToUpdate.categoriaId = Number(categoriaId);
        }

        const tipoVoceriaActualizado = await prisma.tipoVoceria.update({
            where: { id },
            data: dataToUpdate,
        });

        return NextResponse.json(tipoVoceriaActualizado, { status: 200 });
        
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json({ error: "Tipo de Vocería no encontrado para actualizar." }, { status: 404 });
        }
        
        console.error(`Error actualizando Tipo Vocería con ID ${id}:`, error);
        return NextResponse.json({ error: "Error al actualizar el Tipo de Vocería." }, { status: 500 });
    }
}
