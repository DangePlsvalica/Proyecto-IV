import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Manejo del método GET (obtener comunas)
export async function GET() {
  try {
    const comunas = await prisma.comuna.findMany({
      include: {
        parroquiaRelation: { 
          select: {
            nombre: true,
            municipio: true,
            estado: true
          }
        },
        // Mantenemos la inclusión del banco de la comuna aquí
        bancoDeLaComuna: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            ci: true,
            telefono: true
          }
        },
        // Consulta anidada: Incluir los consejos comunales y, dentro de ellos, sus comisiones
        consejosComunales: {
          select: {
            id: true,
            cc: true,
            // Aquí se incluyen las relaciones de personas que pertenecen a los CONSEJOS COMUNALES
            titularesComisionElectoral: {
              select: {
                id: true,
                nombres: true,
                apellidos: true,
                ci: true,
                telefono: true
              }
            },
            suplentesComisionElectoral: {
              select: {
                id: true,
                nombres: true,
                apellidos: true,
                ci: true,
                telefono: true
              }
            },
            titularesContraloria: {
              select: {
                id: true,
                nombres: true,
                apellidos: true,
                ci: true,
                telefono: true
              }
            },
            suplentesContraloria: {
              select: {
                id: true,
                nombres: true,
                apellidos: true,
                ci: true,
                telefono: true
              }
            },
            vocerias: {
              select: {
                  titular: {
                      select: {
                          id: true,
                          nombres: true,
                          apellidos: true,
                          ci: true,
                          telefono: true
                      }
                  },
                  suplente: {
                      select: {
                          id: true,
                          nombres: true,
                          apellidos: true,
                          ci: true,
                          telefono: true
                      }
                  },
                  tipoVoceria: { // Esto es para acceder al modelo 'TipoVoceria'
                      select: {
                          nombre: true, // El nombre del tipo de vocería
                          categoria: { // Esto es para acceder al modelo 'Categoria' anidado
                              select: {
                                  nombre: true // El nombre de la categoría
                              }
                          }
                      }
                  }
              }
          }
          }
        }
      },
    });
    return NextResponse.json(comunas);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching comunas:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Error fetching comunas:", error);
      return NextResponse.json({ error: "Error fetching comunas" }, { status: 500 });
    }
  }
}

// Manejo del método POST (crear una nueva comuna)
export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Data received in server:', data);

    if (!data.consejosComunales || data.consejosComunales.length === 0) {
      return NextResponse.json({ error: 'Consejos Comunales son requeridos' }, { status: 400 });
    }

    if (!data.parroquiaId) {
      return NextResponse.json({ error: 'El ID de la parroquia es requerido' }, { status: 400 });
    }

    const comunaData = {
      ...data,
      fechaComisionPromotora: new Date(data.fechaComisionPromotora),
      fechaRegistro: new Date(data.fechaRegistro),
      fechaUltimaEleccion: new Date(data.fechaUltimaEleccion),
      cantidadConsejosComunales: Number(data.cantidadConsejosComunales),
      poblacionVotante: Number(data.poblacionVotante),
      consejosComunales: {
        connect: data.consejosComunales.map((id: string) => ({ id })),
      },
    };

    // CORRECCIÓN: Usar el nombre de campo correcto del modelo de Prisma
    if (data.titularesFinanzas && Array.isArray(data.titularesFinanzas)) {
      comunaData.bancoDeLaComuna = {
        connect: data.titularesFinanzas.map((id: string) => ({ id })),
      };
    }

    delete comunaData.titularesFinanzas; // Eliminar el campo incorrecto para evitar errores de Prisma
    delete comunaData.nombreVocero;
    delete comunaData.ciVocero;
    delete comunaData.telefono;

    const nuevaComuna = await prisma.comuna.create({
      data: comunaData,
    });

    return NextResponse.json(nuevaComuna, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creando comuna:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Error creando comuna:", error);
      return NextResponse.json({ error: "Error creating comuna" }, { status: 500 });
    }
  }
}