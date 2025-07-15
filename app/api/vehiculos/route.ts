import { NextResponse } from 'next/server'; 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const vehiculos = await prisma.vehiculo.findMany({
      include: {
        voceroAsignado: true,
        consejoComunal: {
          include: {
            comuna: true,
            parroquiaRelation: true,  // <-- solo esto, sin incluir municipio
          }
        }
      }
    });
    return NextResponse.json(vehiculos);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching vehiculos:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Error fetching vehiculos:", error);
      return NextResponse.json({ error: "Error fetching vehiculos" }, { status: 500 });
    }
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json(); // Captura los datos enviados en el cuerpo de la solicitud
    const nuevoVehiculo = await prisma.vehiculo.create({
      data: {
        placa: data.placa,
        clase: data.clase,
        marca: data.marca,
        modelo: data.modelo,
        color: data.color,
        ano: data.ano,
        serialCarroceria: data.serialCarroceria,
        fechaDeEntrega: new Date(data.fechaDeEntrega),
        estatus: data.estatus,
        observacionArchivo: data.observacionArchivo || null,
        observacion: data.observacion || null,

        // Relaciones
        voceroAsignado: data.voceroId ? { connect: { id: data.voceroId } } : undefined,

        consejoComunal: data.cc ? { connect: { cc: data.cc } } : undefined,
      }
    });
    console.log("Nuevo vehiculo creado:", nuevoVehiculo);
    return NextResponse.json(nuevoVehiculo, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creando vehiculo:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Error creando vehiculo:", error);
      return NextResponse.json({ error: "Error creating vehiculo" }, { status: 500 });
    }
  }
}

// DELETE: Eliminar un vehículo por ID
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID del vehículo no proporcionado." }, { status: 400 });
    }

    const vehiculo = await prisma.vehiculo.findUnique({
      where: { id: Number(id) },
    });

    if (!vehiculo) {
      return NextResponse.json({ error: "Vehículo no encontrado." }, { status: 404 });
    }

    await prisma.vehiculo.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Vehículo eliminado correctamente." }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error eliminando vehiculo:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Error eliminando vehiculo:", error);
      return NextResponse.json({ error: "Error eliminando vehiculo" }, { status: 500 });
    }
  }
}

// PATCH: Actualizar un vehículo parcialmente (reasignar)
export async function PATCH(req: Request) {
  try {
    const data = await req.json();

    const { id, cc, voceroAsignadoId } = data;

    if (!id || !cc || !voceroAsignadoId) {
      return NextResponse.json(
        { error: "Faltan datos necesarios: id, cc, voceroAsignadoId" },
        { status: 400 }
      );
    }

    const vehiculo = await prisma.vehiculo.findUnique({
      where: { id: Number(id) },
    });

    if (!vehiculo) {
      return NextResponse.json(
        { error: "Vehículo no encontrado." },
        { status: 404 }
      );
    }

    const vehiculoExistente = await prisma.vehiculo.findFirst({
      where: {
        voceroAsignadoId: Number(voceroAsignadoId),
        NOT: { id: Number(id) },
      },
    });

    if (vehiculoExistente) {
      return NextResponse.json(
        { error: "El vocero asignado ya tiene otro vehículo asignado." },
        { status: 400 }
      );
    }

    const actualizado = await prisma.vehiculo.update({
      where: { id: Number(id) },
      data: {
        cc,
        voceroAsignadoId: Number(voceroAsignadoId),
        estatus: "reasignado",
      },
    });

    return NextResponse.json(actualizado, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error reasignando vehículo:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Error reasignando vehículo:", error);
      return NextResponse.json({ error: "Error reasignando vehículo" }, { status: 500 });
    }
  }
}

