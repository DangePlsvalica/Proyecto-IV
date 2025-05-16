import { FieldDisplay } from '@/components/FieldDisplay';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Button  from '@/components/Button'

const prisma = new PrismaClient();

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ViewComunaPage({ params }: PageProps) {
  const { id } = params;
  
const comuna = await prisma.comuna.findUnique({
    where: { id },
    include: {
      consejosComunales: {
        select: { id: true, cc: true, rif: true },
      },
      parroquiaRelation: {
        select: {
          nombre: true,
          municipio: true,
          estado: true,
        }
      }
    }
  });

  if (!comuna) return notFound();

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
            {comuna.consejosComunales?.length > 0 ? (
              comuna.consejosComunales.map((cc: { id: string; cc: string; rif: string }) => (
                <div key={cc.id} className="inline-block bg-white rounded px-2 py-1 mr-2 mb-2">
                  {cc.cc}
                </div>
              ))
            ) : (
              <p>No hay consejos comunales asignados</p>
            )}
          </div>
        </div>

        <FieldDisplay 
          label="Fecha de Última Elección" 
          value={new Date(comuna.fechaUltimaEleccion).toLocaleDateString()} 
        />
        <FieldDisplay label="Municipio" value={comuna.parroquiaRelation?.municipio} />
        <FieldDisplay label="Parroquia" value={comuna.parroquiaRelation?.nombre} />
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
        <Button title="Editar" href={`/comunas/${id}/edit`}
        />
          
        
      </div>
    </div>
  );
};