"use client";
import { useParams } from "next/navigation";
import useVehiculos from "@/hooks/useVehiculos";
import { FieldDisplay } from "@/components/FieldDisplay";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import { notFound } from "next/navigation";
import { FaRegTrashAlt } from "react-icons/fa";

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
    <div className="mx-auto max-w-[95%] px-8 py-6 border border-sky-200 rounded-xl bg-[#f8f8f8]">
      <h1 className="text-3xl font-bold mb-4 text-sky-950 text-center">
        Detalles del Vehículo
      </h1>
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-sky-800 mb-2 border-b border-sky-200 pb-1">
          Información General
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <FieldDisplay label="Clase" value={vehiculo.clase} />
          <FieldDisplay label="Marca" value={vehiculo.marca} />
          <FieldDisplay label="Modelo" value={vehiculo.modelo} />
          <FieldDisplay label="Color" value={vehiculo.color} />
          <FieldDisplay label="Año" value={vehiculo.ano.toString()} />
          <FieldDisplay label="Serial de la Carrocería" value={vehiculo.serialCarroceria} />
          <FieldDisplay label="Placa" value={vehiculo.placa} />
        </div>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-sky-800 mb-2 border-b border-sky-200 pb-1">
          Ubicación
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <FieldDisplay label="Municipio" value={vehiculo.municipio} />
          <FieldDisplay label="Comuna" value={vehiculo.comuna} />
          <FieldDisplay label="Consejo comunal" value={vehiculo.cc} />
          <FieldDisplay label="Persona responsable" value={vehiculo.voceroAsignado} />
          <FieldDisplay label="Fecha de Entrega" value={new Date(vehiculo.fechaDeEntrega).toLocaleDateString()} />
        </div>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-sky-800 mb-2 border-b border-sky-200 pb-1">
          Estado del vehiculo
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <FieldDisplay label="Estatus" value={vehiculo.estatus} />
          <FieldDisplay label="Observación" value={vehiculo.observacion || "N/A"} />
          <div>
            <label className="block font-medium text-sky-950 mb-1">Observación Archivo</label>
            {vehiculo.observacionArchivo ? (
              <a
                href={vehiculo.observacionArchivo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
                download
              >
                Descargar archivo
              </a>
            ) : (
              <span>N/A</span>
            )}
          </div>
        </div>
      </section>
      <div className="flex justify-center pt-6 gap-4">
        <Button title="Editar vehiculo" href={`/vehiculos/${vehiculo.id}/edit`} />
        <Button title="Reasignar vehiculo" href={`/vehiculos/${vehiculo.id}/edit`} />
        <button                         
          className="bg-red-700 flex gap-2 items-center text-white text-sm px-3 py-2 rounded-lg hover:bg-red-800"
        >
          <FaRegTrashAlt />
          Eliminar vehiculo
        </button>
      </div>
    </div>
  );
};

export default ViewVehiculosPage;
