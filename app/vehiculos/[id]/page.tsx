"use client";
import { useParams } from "next/navigation";
import useVehiculos from "@/hooks/useVehiculos";
import { FieldDisplay } from "@/components/FieldDisplay";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import { notFound } from "next/navigation";

const ViewVehiculosPage = () => {
  const { id } = useParams();
  const { data: vehiculosData, isLoading } = useVehiculos();

  if (isLoading) {
    return <Loading />;
  }

  const vehiculo = vehiculosData?.find((v) => v.id === parseInt(id as string));

  if (!vehiculo) {
    notFound(); // Muestra la página 404 si no existe en la caché
  }

  return (
    <div className="mx-auto my-1 max-w-[95%] px-14 py-8 border border-sky-200 rounded-xl bg-[#f8f8f8]">
      <h1 className="text-2xl font-bold mb-6 text-sky-950">
        Detalles del Vehículo
      </h1>
      <div className="grid grid-cols-4 gap-4">
        <FieldDisplay label="Placa" value={vehiculo.placa} />
        <FieldDisplay label="Clase" value={vehiculo.clase} />
        <FieldDisplay label="CC" value={vehiculo.cc} />
        <FieldDisplay label="Comuna" value={vehiculo.comuna} />
        <FieldDisplay label="Marca" value={vehiculo.marca} />
        <FieldDisplay label="Modelo" value={vehiculo.modelo} />
        <FieldDisplay label="Color" value={vehiculo.color} />
        <FieldDisplay label="Año" value={vehiculo.ano.toString()} />
        <FieldDisplay label="Municipio" value={vehiculo.municipio} />
        <FieldDisplay
          label="Serial Carrocería"
          value={vehiculo.serialCarroceria}
        />
        <FieldDisplay label="Vocero Asignado" value={vehiculo.voceroAsignado} />
        <FieldDisplay
          label="Fecha de Entrega"
          value={new Date(vehiculo.fechaDeEntrega).toLocaleDateString()}
        />
        <FieldDisplay label="Estatus" value={vehiculo.estatus} />
        <FieldDisplay
          label="Observación Archivo"
          value={vehiculo.observacionArchivo || "N/A"}
        />
        <FieldDisplay
          label="Observación"
          value={vehiculo.observacion || "N/A"}
        />
      </div>

      <div className="flex justify-center pt-6 gap-4">
        <Button title="Editar" href={`/vehiculos/${vehiculo.id}/edit`} />
      </div>
    </div>
  );
};

export default ViewVehiculosPage;
