"use client";
import { useParams } from "next/navigation";
import useComunas from "@/hooks/useComunas";
import { FieldDisplay } from "@/components/FieldDisplay";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import { notFound } from "next/navigation";
import DeleteButton from "@/components/DeleteButton";
import useGenerarActaPDF from "@/hooks/useGenerarActaPDF";

const ViewComunaPage = () => {
  const { id } = useParams();
  const { data: comunasData, isLoading } = useComunas();
  const generarPDF = useGenerarActaPDF();

  if (isLoading) {
    return <Loading />;
  }

  const comuna = comunasData?.find((c) => c.id === id);

  if (!comuna) {
    notFound(); // Muestra la página 404 si no existe en la cache
  }

   return (
    <div className="mx-auto max-w-[95%] px-8 py-6 border border-sky-200 rounded-xl bg-[#f8f8f8]">
      <h1 className="text-3xl font-bold mb-4 text-sky-950 text-center">
        Detalles de la Comuna
      </h1>

      {/* Sección: Información Básica */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-sky-800 mb-2 border-b border-sky-200 pb-1">
          Información Básica
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <FieldDisplay label="Nombre" value={comuna.nombre} />
          <FieldDisplay label="Código" value={comuna.codigo} />
          <FieldDisplay label="RIF" value={comuna.rif} />
          <FieldDisplay label="Cuenta Bancaria" value={comuna.cuentaBancaria} />
        </div>
      </section>

      {/* Sección: Ubicación y Linderos */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-sky-800 mb-2 border-b border-sky-200 pb-1">
          Ubicación Geográfica
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <FieldDisplay 
            label="Municipio" 
            value={comuna.parroquiaRelation?.municipio} 
          />
          <FieldDisplay 
            label="Parroquia" 
            value={comuna.parroquiaRelation?.nombre} 
          />
          <FieldDisplay label="Dirección" value={comuna.direccion} />
          <FieldDisplay label="Lindero Norte" value={comuna.linderoNorte} />
          <FieldDisplay label="Lindero Sur" value={comuna.linderoSur} />
          <FieldDisplay label="Lindero Este" value={comuna.linderoEste} />
          <FieldDisplay label="Lindero Oeste" value={comuna.linderoOeste} />
        </div>
      </section>

      {/* Sección: Datos Legales y Registro */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-sky-800 mb-2 border-b border-sky-200 pb-1">
          Datos Legales y Registro
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <FieldDisplay 
            label="Fecha de Registro" 
            value={comuna.fechaRegistro 
              ? new Date(comuna.fechaRegistro).toLocaleDateString() 
              : ""} 
          />
          <FieldDisplay 
            label="N° Comisión Promotora" 
            value={comuna.numComisionPromotora} 
          />
          <FieldDisplay 
            label="Fecha Comisión Promotora" 
            value={comuna.fechaComisionPromotora 
              ? new Date(comuna.fechaComisionPromotora).toLocaleDateString() 
              : ""} 
          />
          <FieldDisplay 
            label="Fecha Última Elección" 
            value={comuna.fechaUltimaEleccion 
              ? new Date(comuna.fechaUltimaEleccion).toLocaleDateString() 
              : ""} 
          />
        </div>
      </section>

      {/* Sección: Consejos Comunales */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-sky-800 mb-2 border-b border-sky-200 pb-1">
          Consejos Comunales
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm text-sky-950 font-medium mb-2">
              Consejos Comunales que integran la comuna ({comuna.cantidadConsejosComunales})
            </label>
            <div className="p-3 bg-gray-100 rounded">
              {comuna.consejosComunales?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {comuna.consejosComunales.map((cc: { id: string; cc: string; rif: string }) => (
                    <div
                      key={cc.id}
                      className="bg-white rounded px-3 py-2 shadow-sm border border-gray-200"
                    >
                      <div className="font-medium text-sky-950">{cc.cc}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No hay consejos comunales registrados</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sección: Datos del Vocero */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-sky-800 mb-2 border-b border-sky-200 pb-1">
          Información del Vocero Principal
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <FieldDisplay label="Nombre" value={comuna.nombreVocero} />
          <FieldDisplay label="Cédula" value={comuna.ciVocero} />
          <FieldDisplay label="Teléfono" value={comuna.telefono} />
        </div>
      </section>

      {/* Sección: Datos Demográficos */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-sky-800 mb-2 border-b border-sky-200 pb-1">
          Datos Demográficos
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <FieldDisplay 
            label="Población Votante" 
            value={comuna.poblacionVotante?.toLocaleString()} 
          />
        </div>
      </section>

      {/* Botones de Acción */}
      <div className="flex justify-center pt-6 gap-4">
        <Button title="Editar Comuna" href={`/comunas/${id}/edit`} />
        <Button 
          title="Imprimir Acta de Nacimiento"
          onClick={() => generarPDF(comuna)}
        />
        <DeleteButton
          onClick={()=>{}}
          isPending={false}
          label="Eliminar Comuna"
        />
      </div>
    </div>
  );
};

export default ViewComunaPage;