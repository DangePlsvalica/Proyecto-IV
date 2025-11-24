import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server'; // Importar NextResponse para respuestas

// Usar una instancia global o singleton de PrismaClient (buena práctica en App Router)
const prisma = new PrismaClient();

// Definimos la función PATCH que manejará la solicitud de actualización masiva
export async function PATCH(request: Request) {
  try {
    // 1. Obtener el cuerpo de la solicitud JSON
    const body = await request.json();
    const { ids, habilitado } = body;

    // 2. Validaciones básicas
    if (!Array.isArray(ids) || ids.length === 0 || typeof habilitado !== 'boolean') {
      // Usamos NextResponse.json con el código de estado
      return NextResponse.json(
        { message: 'Datos de entrada inválidos. Se requiere un array de IDs (números) y el estado de habilitación (booleano).' },
        { status: 400 } // Bad Request
      );
    }

    // 3. Ejecutar la actualización masiva con Prisma
    const result = await prisma.persona.updateMany({
      where: {
        id: {
          in: ids as number[], // Filtrar por los IDs recibidos
        },
      },
      data: {
        habilitado: habilitado, // Establecer el estado a 'false'
      },
    });

    // 4. Responder con éxito
    return NextResponse.json({
      message: `Se deshabilitaron ${result.count} personas con éxito.`,
      count: result.count,
    }, { status: 200 });

  } catch (error) {
    // 5. Manejo de errores
    console.error("Error en la actualización masiva de personas (App Router):", error);
    
    // Devolver un error 500
    return NextResponse.json(
      { message: 'Error interno del servidor al procesar la solicitud de base de datos.' },
      { status: 500 }
    );
  }
}