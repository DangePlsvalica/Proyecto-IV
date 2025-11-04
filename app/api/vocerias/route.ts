import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getIdFromUrl = (url: string | null): string | null => {
    if (!url) return null;
    try {
        const { searchParams } = new URL(url);
        return searchParams.get('id');
    } catch (e) {
        console.error("Error parsing URL:", e);
        return null;
    }
};

export async function GET() {
  try {
    const tiposVoceria = await prisma.tipoVoceria.findMany();
    return NextResponse.json(tiposVoceria);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching vocerias:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Error fetching vocerias:", error);
      return NextResponse.json({ error: "Error fetching vocerias" }, { status: 500 });
    }
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, categoriaId } = body;

    if (!nombre || !categoriaId) {
      return NextResponse.json(
        { error: "El nombre y la categoría son obligatorios" },
        { status: 400 }
      );
    }

    const nuevaVoceria = await prisma.tipoVoceria.create({
      data: {
        nombre,
        categoriaId,
        esObligatoria: false,
      },
    });

    return NextResponse.json(nuevaVoceria, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating voceria:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Error creating voceria:", error);
      return NextResponse.json({ error: "Error creating voceria" }, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
    const id = getIdFromUrl(req.url);

    if (!id) {
        return NextResponse.json(
            { error: "El ID del Tipo de Vocería es obligatorio en la URL (ej: ?id=XYZ)" },
            { status: 400 }
        );
    }

    try {
        const voceriasDependientes = await prisma.voceria.count({
            where: { tipoVoceriaId: Number(id) }, 
        });

        if (voceriasDependientes > 0) {
            return NextResponse.json(
                { error: `No se puede eliminar. Este Comite está siendo utilizado por ${voceriasDependientes} vocerías activas.` },
                { status: 409 }
            );
        }

        await prisma.tipoVoceria.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ message: "Comite eliminado exitosamente." }, { status: 200 });

    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json({ error: "Comite no encontrado." }, { status: 404 });
        }
        
        console.error(`Error eliminando Comite con ID ${id}:`, error);
        return NextResponse.json({ error: "Error al eliminar el Comite." }, { status: 500 });
    }
}
