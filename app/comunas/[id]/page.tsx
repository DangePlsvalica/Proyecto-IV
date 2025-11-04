"use client";
import { useParams, useRouter } from "next/navigation";
import useComunas, { useDeleteComuna } from "@/hooks/useComunas";
import { FieldDisplay } from "@/components/FieldDisplay";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import { notFound } from "next/navigation";
import DeleteButton from "@/components/DeleteButton";
import useGenerarActaPDF from "@/hooks/useGenerarActaPDF";
import { Persona } from '@/hooks/interfaces/comuna.interface';
import { useMemo } from "react";
import { ConsejoComunal } from "@/hooks/interfaces/consejo.comunal.interface";
import VoceroCard from "@/components/VoceroCard";
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { useState } from "react";

const ViewComunaPage = () => {
  const router = useRouter(); 
  const { id } = useParams();
  const { data: comunasData, isLoading } = useComunas();
  const generarPDF = useGenerarActaPDF();
  const { mutate: deleteComuna, isPending: isDeleting } = useDeleteComuna();
  const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenDeleteModal = () => {
      setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
      // Asume que 'id' es el ID del Consejo Comunal que quieres eliminar
      deleteComuna(id as string, {
          onSuccess: () => {
              router.push('/comunas');
              setIsModalOpen(false);
          },
      });
  };

  const comuna = comunasData?.find((c) => c.id === id);

  const organizedMembers = useMemo(() => {
    if (!comuna) {
      return {
        electoralTitulares: [],
        electoralSuplentes: [],
        contraloriaTitulares: [],
        contraloriaSuplentes: [],
        finanzasTitulares: [],
        finanzasSuplentes: [],
        bancoDeLaComuna: [],
        parlamentoTitulares: [],
        parlamentoSuplentes: [],
        justiciaPazTitulares: [],
        justiciaPazSuplentes: [],
        planificacionTitulares: [],
        planificacionSuplentes: [],
        economiaTitulares: [],
        economiaSuplentes: [],
        felicidadSocialTitulares: [],
        felicidadSocialSuplentes: [],
        serviciosPublicosTitulares: [],
        serviciosPublicosSuplentes: [],
        seguridadPazTitulares: [],
        seguridadPazSuplentes: [],
        juventudTitulares: [],
        juventudSuplentes: [],
        poblacionVotanteTotal: 0,
      };
    }

    // --- Lógica de organización de miembros original (dentro del useMemo) ---
    let totalPoblacionVotante = 0;
    const electoralTitulares: Persona[] = [];
    const electoralSuplentes: Persona[] = [];
    const contraloriaTitulares: Persona[] = [];
    const contraloriaSuplentes: Persona[] = [];
    const finanzasTitulares: Persona[] = [];
    const finanzasSuplentes: Persona[] = [];
    
    const planificacionTitulares: Persona[] = [];
    const planificacionSuplentes: Persona[] = [];
    const economiaTitulares: Persona[] = [];
    const economiaSuplentes: Persona[] = [];
    const felicidadSocialTitulares: Persona[] = [];
    const felicidadSocialSuplentes: Persona[] = [];
    const serviciosPublicosTitulares: Persona[] = [];
    const serviciosPublicosSuplentes: Persona[] = [];
    const seguridadPazTitulares: Persona[] = [];
    const seguridadPazSuplentes: Persona[] = [];
    const juventudTitulares: Persona[] = [];
    const juventudSuplentes: Persona[] = [];
    
    const parlamentoTitulares: Persona[] = [];
    const parlamentoSuplentes: Persona[] = [];
    const justiciaPazTitulares: Persona[] = [];
    const justiciaPazSuplentes: Persona[] = [];

    const addUniquePersona = (list: Persona[], persona?: Persona | null) => {
      if (persona && persona.ci && !list.some(p => p.ci === persona.ci)) {
        list.push(persona);
      }
    };

    // Itera sobre cada consejo comunal para obtener los miembros de las comisiones
    comuna.consejosComunales.forEach((cc: {
      poblacionVotante: number; titularesComisionElectoral: any; suplentesComisionElectoral: any; titularesContraloria: any; suplentesContraloria: any; titularesFinanzas: any; suplentesFinanzas: any; vocerias: any[]; 
}) => {
      totalPoblacionVotante += cc.poblacionVotante || 0;
      electoralTitulares.push(...(cc.titularesComisionElectoral || []));
      electoralSuplentes.push(...(cc.suplentesComisionElectoral || []));
      contraloriaTitulares.push(...(cc.titularesContraloria || []));
      contraloriaSuplentes.push(...(cc.suplentesContraloria || []));
      finanzasTitulares.push(...(cc.titularesFinanzas || []));
      finanzasSuplentes.push(...(cc.suplentesFinanzas || []));

      // Iteramos sobre las vocerías de cada consejo comunal para las comisiones de gestión
      cc.vocerias?.forEach((voceria: { tipoVoceria: { nombre: any; categoria: { nombre: any; }; }; titular: Persona | null | undefined; suplente: Persona | null | undefined; }) => {
        // Usamos switch para organizar por el nombre del tipo de vocería o su categoría
        switch (voceria.tipoVoceria?.nombre) {
          case "Comité de Legislación":
            addUniquePersona(parlamentoTitulares, voceria.titular);
            addUniquePersona(parlamentoSuplentes, voceria.suplente);
            break;
          case "Comité de Justicia de Paz Comunal":
            addUniquePersona(justiciaPazTitulares, voceria.titular);
            addUniquePersona(justiciaPazSuplentes, voceria.suplente);
            break;
          case "Comité de Juventud":
            addUniquePersona(juventudTitulares, voceria.titular);
            addUniquePersona(juventudSuplentes, voceria.suplente);
            break;
          default:
            const categoria = voceria.tipoVoceria?.categoria?.nombre;
            if (categoria) {
              switch (categoria) {
                case "Organización y Planificación Popular":
                  addUniquePersona(planificacionTitulares, voceria.titular);
                  addUniquePersona(planificacionSuplentes, voceria.suplente);
                  break;
                case "Economía Productiva":
                  addUniquePersona(economiaTitulares, voceria.titular);
                  addUniquePersona(economiaSuplentes, voceria.suplente);
                  break;
                case "Ciudades Humanas y Servicios":
                  addUniquePersona(serviciosPublicosTitulares, voceria.titular);
                  addUniquePersona(serviciosPublicosSuplentes, voceria.suplente);
                  break;
                case "Seguridad y Paz":
                  addUniquePersona(seguridadPazTitulares, voceria.titular);
                  addUniquePersona(seguridadPazSuplentes, voceria.suplente);
                  break;
                case "Suprema Felicidad Social":
                  addUniquePersona(felicidadSocialTitulares, voceria.titular);
                  addUniquePersona(felicidadSocialSuplentes, voceria.suplente);
                  break;
                default:
                  break;
              }
            }
            break;
        }
      });
    });

    return {
      electoralTitulares,
      electoralSuplentes,
      contraloriaTitulares,
      contraloriaSuplentes,
      finanzasTitulares,
      finanzasSuplentes,
      bancoDeLaComuna: comuna.bancoDeLaComuna || [],
      parlamentoTitulares,
      parlamentoSuplentes,
      justiciaPazTitulares,
      justiciaPazSuplentes,
      planificacionTitulares,
      planificacionSuplentes,
      economiaTitulares,
      economiaSuplentes,
      felicidadSocialTitulares,
      felicidadSocialSuplentes,
      serviciosPublicosTitulares,
      serviciosPublicosSuplentes,
      seguridadPazTitulares,
      seguridadPazSuplentes,
      juventudTitulares,
      juventudSuplentes,
      poblacionVotanteTotal: totalPoblacionVotante,
    };
  }, [comuna]);

  if (isLoading) {
    return <Loading />;
  }

  if (!comuna) {
    notFound();
  }

  return (
    <div className="mx-auto my-1 max-w-[95%] px-7 py-8 border border-sky-200 rounded-xl bg-[#f8f8f8]">
      <h1 className="text-2xl font-bold mb-6 text-sky-950">
        Detalles de la Comuna
      </h1>
      
      {/* Sección: Información Básica */}
      <div>
        <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">
          Información Básica
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Aquí comuna ya está garantizado que existe */}
          <FieldDisplay label="Nombre" value={comuna!.nombre} /> 
          <FieldDisplay label="Código Situr" value={comuna!.codigo} />
          <FieldDisplay label="RIF" value={comuna!.rif} />
          <FieldDisplay label="Cuenta Bancaria" value={comuna!.cuentaBancaria} />
          <FieldDisplay 
                label="Población Votante" 
                value={organizedMembers.poblacionVotanteTotal?.toLocaleString() || '0'} 
            />
        </div>
      </div>
      
      {/* Sección: Ubicación y Linderos */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">
          Ubicación Geográfica
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <FieldDisplay label="Municipio" value={comuna!.parroquiaRelation?.municipio} />
          <FieldDisplay label="Parroquia" value={comuna!.parroquiaRelation?.nombre} />
          <FieldDisplay label="Dirección" value={comuna!.direccion} />
          <FieldDisplay label="Lindero Norte" value={comuna!.linderoNorte} />
          <FieldDisplay label="Lindero Sur" value={comuna!.linderoSur} />
          <FieldDisplay label="Lindero Este" value={comuna!.linderoEste} />
          <FieldDisplay label="Lindero Oeste" value={comuna!.linderoOeste} />
        </div>
      </div>

      {/* Sección: Datos Legales y Registro */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">
          Datos Legales y Registro
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <FieldDisplay label="Fecha de Registro" value={comuna!.fechaRegistro ? new Date(comuna!.fechaRegistro).toLocaleDateString() : ""} />
          <FieldDisplay label="N° Comisión Promotora" value={comuna!.numComisionPromotora} />
          <FieldDisplay label="Fecha Comisión Promotora" value={comuna!.fechaComisionPromotora ? new Date(comuna!.fechaComisionPromotora).toLocaleDateString() : ""} />
          <FieldDisplay label="Fecha Última Elección" value={comuna!.fechaUltimaEleccion ? new Date(comuna!.fechaUltimaEleccion).toLocaleDateString() : ""} />
        </div>
      </div>

      {/* Sección: Consejos Comunales */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">
          Consejos Comunales
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm text-sky-950 font-medium mb-2">
              Consejos Comunales que integran la comuna ({comuna!.cantidadConsejosComunales})
            </label>
            <div className="p-3 bg-gray-100 rounded">
              {comuna!.consejosComunales?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {comuna!.consejosComunales.map((cc: ConsejoComunal) => (
                    <div key={cc.id} className="bg-white rounded px-3 py-2 shadow-sm border border-gray-200">
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
      </div>
      
      <h2 className="mt-10 text-lg font-semibold text-sky-900 mb-4 border-b pb-2">
          Instancia de Gobierno
      </h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
        <VoceroCard
          titulo="Consejo de Contraloría de la Comuna"
          titular={organizedMembers.contraloriaTitulares}
          suplente={organizedMembers.contraloriaSuplentes}
        />
        <VoceroCard
          titulo="Comisión Electoral de la Comuna"
          titular={organizedMembers.electoralTitulares}
          suplente={organizedMembers.electoralSuplentes}
        />
        <div className="border p-4 rounded bg-white shadow-sm">
          <p className="mb-4 font-bold text-sky-800">Banco de la Comuna</p>
          <div>
            {organizedMembers.bancoDeLaComuna && organizedMembers.bancoDeLaComuna.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {organizedMembers.bancoDeLaComuna.map((persona: Persona) => (
                  <div key={persona.ci}>
                    <p className="text-sm font-semibold">{persona.nombres} {persona.apellidos}</p>
                    {persona.ci && <p className="text-sm text-gray-600">Cédula: {persona.ci}</p>}
                    {persona.telefono && <p className="text-sm text-gray-600">Teléfono: {persona.telefono}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay miembros registrados.</p>
            )}
          </div>
        </div>
        <VoceroCard
            titulo="Parlamento de la Comuna"
            titular={organizedMembers.parlamentoTitulares}
            suplente={organizedMembers.parlamentoSuplentes}
        />
        <VoceroCard
          titulo="Consejo de Justicia de Paz de la Comuna"
          titular={organizedMembers.justiciaPazTitulares}
          suplente={organizedMembers.justiciaPazSuplentes}
        />
        
      </div>
      <div className="border flex flex-col p-4 rounded bg-white shadow-sm mt-6">
        <h2 className="font-bold mx-auto text-sky-900 mb-4">
          Consejo Ejecutivo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
        <VoceroCard
          titulo="Comisión de Planificación de la Comuna"
          titular={organizedMembers.planificacionTitulares}
          suplente={organizedMembers.planificacionSuplentes}
        />
        <VoceroCard
          titulo="Comisión de Economía de la Comuna"
          titular={organizedMembers.economiaTitulares}
          suplente={organizedMembers.economiaSuplentes}
        />
        <VoceroCard
          titulo="Comisión de Suprema Felicidad Social de la Comuna"
          titular={organizedMembers.felicidadSocialTitulares}
          suplente={organizedMembers.felicidadSocialSuplentes}
        />
        <VoceroCard
          titulo="Comisión de los Servicios Públicos de la Comuna"
          titular={organizedMembers.serviciosPublicosTitulares}
          suplente={organizedMembers.serviciosPublicosSuplentes}
        />
        <VoceroCard
          titulo="Comisión de Seguridad y Paz de la Comuna"
          titular={organizedMembers.seguridadPazTitulares}
          suplente={organizedMembers.seguridadPazSuplentes}
        />
        <VoceroCard
          titulo="Comisión de la Juventud de la Comuna"
          titular={organizedMembers.juventudTitulares}
          suplente={organizedMembers.juventudSuplentes}
        /></div>
      </div>
      {/* Botones de Acción */}
      <div className="flex justify-center pt-6 gap-4">
        <Button title="Editar Comuna" href={`/comunas/${id}/edit`} />
        <Button title="Imprimir Carta Fundacional" onClick={() => generarPDF(comuna!)} />
        <Button title="Acta De Instalacion De Gobierno" href={`/comunas/${id}/edit`} />
        <DeleteButton 
          onClick={handleOpenDeleteModal} 
          isPending={false} 
          label="Eliminar Comuna" />
      </div>
      <DeleteConfirmationModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)} 
          onConfirm={handleConfirmDelete}
          itemToDelete={`La Comuna "${comuna.nombre}"`}
          isPending={isDeleting}
      />
    </div>
  );
};

export default ViewComunaPage;