"use client";
import { useParams } from "next/navigation";
import useComunas from "@/hooks/useComunas";
import { FieldDisplay } from "@/components/FieldDisplay";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import { notFound } from "next/navigation";

const ViewComunaPage = () => {
  const { id } = useParams();
  const { data: comunasData, isLoading } = useComunas();

  if (isLoading) {
    return <Loading />;
  }

  const comuna = comunasData?.find((c) => c.id === id);

  if (!comuna) {
    notFound(); // Muestra la página 404 si no existe en la cache
  }

  return (
    <div className="mx-auto my-1 max-w-[95%] px-14 py-8 border border-sky-200 rounded-xl bg-[#f8f8f8]">
      <h1 className="text-2xl font-bold mb-6 text-sky-950">
        Detalles de la Comuna
      </h1>
      <div className="grid grid-cols-4 gap-4">
        <FieldDisplay label="Código" value={comuna.codigo} />
        <FieldDisplay
          label="N° comisión promotora"
          value={comuna.numComisionPromotora}
        />
        <FieldDisplay
          label="Fecha de Comisión Promotora"
          value={
            comuna.fechaComisionPromotora
              ? new Date(comuna.fechaComisionPromotora).toLocaleDateString()
              : ""
          }
        />
        <FieldDisplay label="RIF" value={comuna.rif} />
        <FieldDisplay label="Cuenta Bancaria" value={comuna.cuentaBancaria} />
        <FieldDisplay
          label="Fecha de Registro"
          value={
            comuna.fechaRegistro
              ? new Date(comuna.fechaRegistro).toLocaleDateString()
              : ""
          }
        />
        <FieldDisplay label="Nombre de la Comuna" value={comuna.nombre} />
        <FieldDisplay label="Dirección" value={comuna.direccion} />
        <FieldDisplay label="Lindero Norte" value={comuna.linderoNorte} />
        <FieldDisplay label="Lindero Sur" value={comuna.linderoSur} />
        <FieldDisplay label="Lindero Este" value={comuna.linderoEste} />
        <FieldDisplay label="Lindero Oeste" value={comuna.linderoOeste} />

        <div className="col-span-1">
          <label className="block pb-[11px] text-sm text-sky-950 font-medium">
            C.C que integra la comuna ({comuna.cantidadConsejosComunales})
          </label>
          <div className="p-2 bg-gray-100 rounded min-h-[38px]">
            {comuna.consejosComunales?.length > 0 ? (
              comuna.consejosComunales.map((cc: { id: string; cc: string; rif: string }) => (
                <div
                  key={cc.id}
                  className="inline-block bg-white rounded px-1 py-1 mr-2 mb-2"
                >
                  {cc.cc}
                </div>
              ))
            ) : (
              <p>No hay</p>
            )}
          </div>
        </div>

        <FieldDisplay
          label="Fecha de Última Elección"
          value={
            comuna.fechaUltimaEleccion
              ? new Date(comuna.fechaUltimaEleccion).toLocaleDateString()
              : ""
          }
        />
        <FieldDisplay
          label="Municipio"
          value={comuna.parroquiaRelation?.municipio}
        />
        <FieldDisplay
          label="Parroquia"
          value={comuna.parroquiaRelation?.nombre}
        />
        <FieldDisplay label="Vocero Principal" value={comuna.nombreVocero} />
        <FieldDisplay label="C.I. Vocero" value={comuna.ciVocero} />
        <FieldDisplay label="Teléfono Vocero" value={comuna.telefono} />
        <FieldDisplay
          label="Población Votante"
          value={comuna.poblacionVotante?.toLocaleString()}
        />
      </div>

      <div className="flex justify-center pt-6 gap-4">
        <Button title="Editar" href={`/comunas/${id}/edit`} />
        <Button title="Imprimir acta de nacimiento" href={`/comunas/${id}/edit`}/>
      </div>
    </div>
  );
};

export default ViewComunaPage;