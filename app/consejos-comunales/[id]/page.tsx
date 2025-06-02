"use client";
import { useParams } from "next/navigation";
import useConsejos from "@/hooks/useConsejos";
import { FieldDisplay } from "@/components/FieldDisplay";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import { notFound } from "next/navigation";

const ViewConsejoPage = () => {
  const { id } = useParams();
  const { data: consejosData, isLoading } = useConsejos();

  if (isLoading) {
    return <Loading />;
  }

  const consejo = consejosData?.find((c) => c.id === id);

  if (!consejo) {
    notFound(); // Muestra la página 404 si no existe en la cache
  }

  return (
    <div className="mx-auto my-1 max-w-[95%] px-14 py-8 border border-sky-200 rounded-xl bg-[#f8f8f8]">
      <h1 className="text-2xl font-bold mb-6 text-sky-950">
        Detalles del Consejo Comunal
      </h1>
      <div className="grid grid-cols-4 gap-4">
        <FieldDisplay label="Estado" value={consejo.estado} />
        <FieldDisplay
          label="Municipio"
          value={consejo.municipio}
        />
        <FieldDisplay
          label="Parroquia"
          value={consejo.parroquia}
        />
        <FieldDisplay label="Nombre" value={consejo.cc} />
        <FieldDisplay label="RIF" value={consejo.rif} />
        <FieldDisplay label="Nro de cuenta" value={consejo.numeroCuenta} />
        <FieldDisplay
          label="Fecha de constitución"
          value={
            consejo.fechaConstitucion
              ? new Date(consejo.fechaConstitucion).toLocaleDateString()
              : ""
          }
        />
        <FieldDisplay
          label="Fecha de vencimiento"
          value={
            consejo.fechaVencimiento
              ? new Date(consejo.fechaVencimiento).toLocaleDateString()
              : ""
          }
        />
        <FieldDisplay label="Vocero" value={consejo.vocero} />
        <FieldDisplay label="Teléfono Vocero" value={consejo.tlfVocero} />
                <FieldDisplay label="Poblacion votante" value={consejo.poblacionVotante} />
      </div>
      <div className="flex justify-center pt-6 gap-4">
        <Button title="Editar" href={`/consejos/${id}/edit`} />
      </div>
    </div>
  );
};

export default ViewConsejoPage;