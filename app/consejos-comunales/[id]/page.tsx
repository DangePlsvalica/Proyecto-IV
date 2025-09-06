"use client";
import { useParams } from "next/navigation";
import useConsejos from "@/hooks/useConsejos";
import { FieldDisplay } from "@/components/FieldDisplay";
import Button from "@/components/Button";
import DeleteButton from "@/components/DeleteButton";
import Loading from "@/components/Loading";
import { notFound } from "next/navigation";
import VoceroCard from "@/components/VoceroCard";

const ViewConsejoPage = () => {
  const { id } = useParams();
  const { data: consejosData, isLoading } = useConsejos();

  if (isLoading) return <Loading />;

  const consejo = consejosData?.find((c) => c.id === id);
  if (!consejo) notFound();
console.log("first", consejo)
  return (
    <div className="mx-auto my-1 max-w-[95%] px-14 py-8 border border-sky-200 rounded-xl bg-[#f8f8f8]">
      <h1 className="text-2xl font-bold mb-6 text-sky-950">
        Detalles del Consejo Comunal
      </h1>

      {/* Sección: Información básica */}
      <div>
        <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">Información Básica</h3>
        <div className="grid grid-cols-4 gap-4">
          <FieldDisplay label="Estado" value={consejo.parroquiaRelation?.estado} />
          <FieldDisplay label="Municipio" value={consejo.parroquiaRelation?.municipio} />
          <FieldDisplay label="Parroquia" value={consejo.parroquiaRelation?.nombre} />
          <FieldDisplay label="Nombre" value={consejo.cc} />
          <FieldDisplay label="RIF" value={consejo.rif} />
          <FieldDisplay label="Nro de Cuenta" value={consejo.numeroCuenta} />
          <FieldDisplay label="Fecha de Constitución" value={new Date(consejo.fechaConstitucion).toLocaleDateString()} />
          <FieldDisplay label="Fecha de Vencimiento" value={new Date(consejo.fechaVencimiento).toLocaleDateString()} />
          <FieldDisplay label="Población Votante" value={consejo.poblacionVotante} />
        </div>
      </div>

      {/* Sección: Vocerías Principales */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">Vocerías Principales</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <VoceroCard
            titulo="Comisión Electoral"
            titular={consejo.comisionElectoral}
            suplente={consejo.suplenteComisionElectoral}
          />
          <VoceroCard
            titulo="Unidad de Contraloría Social"
            titular={consejo.contraloria}
            suplente={consejo.suplenteContraloria}
          />
          <VoceroCard
            titulo="Unidad Administrativa y Financiera Comunitaria"
            titular={consejo.finanzas}
            suplente={consejo.suplenteFinanzas}
          />
        </div>
      </div>

      {/* Sección: Vocerías Ejecutivas */}
      {consejo.vocerias && consejo.vocerias.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">Vocerías Ejecutivas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {consejo.vocerias.map((voceria) => (
              <VoceroCard
                key={voceria.tipoVoceria.id}
                titulo={voceria.tipoVoceria.nombre}
                titular={voceria.titular}
                suplente={voceria.suplente}
              />
            ))}
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="flex justify-center pt-6 gap-4">
        <Button title="Editar" href={`/consejos/${id}/edit`} />
        <DeleteButton
          onClick={() => {}}
          isPending={false}
          label="Eliminar consejo comunal"
        />
      </div>
    </div>
  );
};

export default ViewConsejoPage;
