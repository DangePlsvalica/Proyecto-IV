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
            poblacionVotante: true,
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

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // --- Validaciones ---
    if (!data.consejosComunales || data.consejosComunales.length === 0) {
      return NextResponse.json({ error: 'Consejos Comunales son requeridos' }, { status: 400 });
    }
    if (!data.parroquiaId) {
      return NextResponse.json({ error: 'El ID de la parroquia es requerido' }, { status: 400 });
    }
    
    // 1. Obtener IDs
    const parroquiaId = data.parroquiaId;
    const consejosComunalesIds = data.consejosComunales;
    const titularesFinanzasIds = data.titularesFinanzas; 

    // 2. Crear el objeto de datos inicial con campos planos y conversiones
    const comunaData: any = {
      ...data,
      
      // Conversión de Fechas y Números
      fechaComisionPromotora: new Date(data.fechaComisionPromotora),
      fechaRegistro: new Date(data.fechaRegistro),
      fechaUltimaEleccion: new Date(data.fechaUltimaEleccion),
      cantidadConsejosComunales: Number(data.cantidadConsejosComunales),
    };
    
    // --- 3. Limpiar/Eliminar todos los campos que NO son parte del modelo Comuna ---

    delete comunaData.poblacionVotante; // Eliminado (no existe en el modelo)
    delete comunaData.parroquiaId;
    delete comunaData.consejosComunales;
    delete comunaData.titularesFinanzas; 
    
    delete comunaData.nombreVocero;
    delete comunaData.ciVocero;
    delete comunaData.telefono;
    
    // --- 4. Agregar las Relaciones usando la sintaxis 'connect' de Prisma ---
    
    // Relación Parroquia (Parroquia.id es Int, el frontend envía Int)
    comunaData.parroquiaRelation = {
        connect: { id: parroquiaId } 
    };
    
    // Relación Consejos Comunales (ConsejoComunal.id es String/UUID)
    comunaData.consejosComunales = {
        connect: consejosComunalesIds.map((id: string) => ({ id })) 
    };

    // Relación Banco de la Comuna (Persona.id **DEBE** ser Int, aunque se envíe String)
    if (titularesFinanzasIds && Array.isArray(titularesFinanzasIds)) {
      comunaData.bancoDeLaComuna = {
        connect: titularesFinanzasIds.map((id: string) => ({ 
          // 💡 CORRECCIÓN: Convertir el ID a Int
          id: Number(id) 
        })),
      };
    }
    
    // --- 5. Ejecutar la creación ---
    const nuevaComuna = await prisma.comuna.create({
      data: comunaData,
    });

    return NextResponse.json(nuevaComuna, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creando comuna:", error.message);
      return NextResponse.json({ error: "Error creando comuna: " + error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Error interno del servidor al crear comuna" }, { status: 500 });
  }
}

