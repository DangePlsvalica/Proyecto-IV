"use client";
import { useParams, useRouter } from "next/navigation"; // <-- AGREGAR useRouter aquí
import useConsejos, { useDeleteConsejoComunal } from "@/hooks/useConsejos"; // <-- IMPORTAR useDeleteConsejoComunal
import { FieldDisplay } from "@/components/FieldDisplay";
import Button from "@/components/Button";
import DeleteButton from "@/components/DeleteButton";
import Loading from "@/components/Loading";
import { notFound } from "next/navigation";
import VoceroCard from "@/components/VoceroCard";
import { useCurrentUser } from "@/hooks/useCurrentUser"; 
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { useState } from "react";

const ViewConsejoPage = () => {
  const router = useRouter(); // <-- Obtener la instancia de router
  const { id } = useParams();
  const { data: consejosData, isLoading: isConsejosLoading } = useConsejos();

  // 1. Llamar al hook de eliminación
  const { mutate: deleteConsejo, isPending: isDeleting } = useDeleteConsejoComunal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 1. Abre el modal al hacer clic en el botón Eliminar
    const handleOpenDeleteModal = () => {
        setIsModalOpen(true);
    };

    // 2. Función que se ejecuta al CONFIRMAR la eliminación
    const handleConfirmDelete = () => {
        // Asume que 'id' es el ID del Consejo Comunal que quieres eliminar
        deleteConsejo(id as string, {
            onSuccess: () => {
                // Navegación (si el hook no la maneja)
                router.push('/consejos-comunales');
                setIsModalOpen(false); // Cierra el modal al tener éxito
            },
            // onError no es necesario si el hook ya lo maneja
        });
    };

  const { isAdmin, isLoading: isAuthLoading } = useCurrentUser(); 

  if (isConsejosLoading || isAuthLoading) return <Loading />;

  const consejo = consejosData?.find((c) => c.id === id);
  if (!consejo) notFound();

  // Función para obtener los primeros 5 titulares o suplentes (útil si la relación trae más)
  const getFirstFive = (data?: any[]) => {
    return data?.slice(0, 5) ?? [];
  };

  // 2. Función de manejo de eliminación
  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `¿Está seguro de que desea eliminar el Consejo Comunal "${consejo.cc}"? Esta acción no se puede deshacer.`
    );

    if (confirmDelete) {
      // Ejecutar la mutación con el ID del consejo
      deleteConsejo(id as string, {
        onSuccess: () => {
          // El hook ya maneja el toast y la invalidación.
          // Aquí forzamos la navegación al listado, ya que el recurso actual no existirá.
          router.push('/consejos-comunales');
        },
        // El hook ya tiene un onError global, pero se puede añadir uno local si es necesario.
      });
    }
  };


  return (
    <div className="mx-auto my-1 max-w-[95%] px-7 py-8 border border-sky-200 rounded-xl bg-[#f8f8f8]">
      <h1 className="text-2xl font-bold mb-6 text-sky-950">
        Detalles del Consejo Comunal
      </h1>

      {/* Sección: Información básica */}
      {/* ... (el resto del código de visualización se mantiene igual) */}
      
      {/* Sección: Información básica */}
      <div>
        <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">Información Básica</h3>
        <div className="grid grid-cols-4 gap-4">
          <FieldDisplay label="Estado" value={consejo.parroquiaRelation?.estado} />
          <FieldDisplay label="Codigo Situr" value={consejo.situr} /> 
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
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
          <VoceroCard
            titulo="Comisión Electoral"
            titular={getFirstFive(consejo.titularesComisionElectoral)}
            suplente={getFirstFive(consejo.suplentesComisionElectoral)}
          />
          <VoceroCard
            titulo="Unidad de Contraloría Social"
            titular={getFirstFive(consejo.titularesContraloria)}
            suplente={getFirstFive(consejo.suplentesContraloria)}
          />
          <VoceroCard
            titulo="Unidad Administrativa y Financiera Comunitaria"
            titular={getFirstFive(consejo.titularesFinanzas)}
            suplente={getFirstFive(consejo.suplentesFinanzas)}
          />
        </div>
      </div>

      {/* Sección: Vocerías Ejecutivas */}
      {consejo.vocerias && consejo.vocerias.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">Vocerías Ejecutivas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            {consejo.vocerias.map((voceria: any) => (
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

      
      {/* Sección: Botones de Acción */}
      <div className="flex justify-center pt-6 gap-4">
        {isAdmin && (
          <>
            <Button title="Editar" href={`/consejos-comunales/${id}/edit`} />
            {/* 3. Ligar la función handleDelete y el estado isDeleting al DeleteButton */}
            <DeleteButton
                // Clic para ABRIR el modal (ya no elimina directamente)
                onClick={handleOpenDeleteModal} 
                isPending={false} // No está pendiente, solo abre el modal
                label="Eliminar consejo comunal" 
            />
          </>
        )}
        <Button title="Cambiar voceros" href={`/consejos-comunales/${id}/edit`} />
      </div>
      <DeleteConfirmationModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)} // Función para cerrar el modal
          onConfirm={handleConfirmDelete}       // Función para confirmar la eliminación
          itemToDelete={`el Consejo Comunal "${consejo.cc}"`} // Mensaje personalizado
          isPending={isDeleting}               // Estado de carga de la mutación
      />
    </div>
    
  );
};

export default ViewConsejoPage;