"use client";
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { FieldDisplay } from '@/components/FieldDisplay';
import { Comuna } from '@/hooks/interfaces/comuna.interface';
import useComunas from "@/hooks/useComunas";

const ViewComunaPage: React.FC = () => {
  const  id  = "044ceb0e-cf63-4309-ad2c-311de67eec30";
  const { data: comunasData, isLoading } = useComunas();

  if (isLoading) return <div>Cargando...</div>;
  const comuna = comunasData?.find((c: Comuna) => c.id === id);
  if (!comuna) return <div>Comuna no encontrada</div>;
  return (
    <div className="mx-auto my-7 max-w-[95%] p-16 border border-sky-200 rounded-xl bg-[#f8f8f8]">
      <h1 className="text-2xl font-bold mb-6 text-sky-950">Detalles de la Comuna</h1>
      
      <div className="grid grid-cols-4 gap-4">
        <FieldDisplay label="Código" value={comuna.codigo} />
        <FieldDisplay label="N° comisión promotora" value={comuna.numComisionPromotora} />
        <FieldDisplay 
          label="Fecha de Comisión Promotora" 
          value={new Date(comuna.fechaComisionPromotora).toLocaleDateString()} 
        />
        <FieldDisplay label="RIF" value={comuna.rif} />
        <FieldDisplay label="Cuenta Bancaria" value={comuna.cuentaBancaria} />
        <FieldDisplay 
          label="Fecha de Registro" 
          value={new Date(comuna.fechaRegistro).toLocaleDateString()} 
        />
        <FieldDisplay label="Nombre de la Comuna" value={comuna.nombre} />
        <FieldDisplay label="Dirección" value={comuna.direccion} />
        <FieldDisplay label="Lindero Norte" value={comuna.linderoNorte} />
        <FieldDisplay label="Lindero Sur" value={comuna.linderoSur} />
        <FieldDisplay label="Lindero Este" value={comuna.linderoEste} />
        <FieldDisplay label="Lindero Oeste" value={comuna.linderoOeste} />
        
        <div className="col-span-1">
          <label className="block pb-[11px] text-sm text-sky-950 font-medium">
            Consejos Comunales Integrantes
          </label>
          <div className="p-2 bg-gray-100 rounded min-h-[38px]">
            {Array.isArray(JSON.parse(comuna.consejoComunal)) ? (
                JSON.parse(comuna.consejoComunal).map((cc: string, index: number) => (
                <div key={index} className="inline-block bg-white rounded px-2 py-1 mr-2 mb-2">
                    {cc} {/* Muestra el nombre directamente */}
                </div>
                ))
            ) : (
                <p>No hay consejos comunales disponibles.</p>
            )}
            </div>
        </div>

        <FieldDisplay 
          label="Fecha de Última Elección" 
          value={new Date(comuna.fechaUltimaEleccion).toLocaleDateString()} 
        />
        <FieldDisplay label="Municipio" value={comuna.municipio} />
        <FieldDisplay label="Parroquia" value={comuna.parroquia} />
        <FieldDisplay label="Vocero Principal" value={comuna.nombreVocero} />
        <FieldDisplay label="C.I. Vocero" value={comuna.ciVocero} />
        <FieldDisplay label="Teléfono Vocero" value={comuna.telefono} />
        <FieldDisplay 
          label="Cantidad de C.C que integra la Comuna" 
          value={comuna.cantidadConsejosComunales} 
        />
        <FieldDisplay 
          label="Población Votante" 
          value={comuna.poblacionVotante.toLocaleString()} 
        />
      </div>
      
      <div className="flex justify-center pt-6 gap-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Editar
        </button>
      </div>
    </div>
  );
};

export default ViewComunaPage;