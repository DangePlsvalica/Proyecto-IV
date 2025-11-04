"use client";
import React, { useState } from "react";
import Divider from "../../components/Divider";
import Loading from "@/components/Loading";
import Tittle from "@/components/Tittle";
import { useTiposVoceria } from "@/hooks/useTiposVoceria";
import { useDeleteComite } from "@/hooks/useDeleteComite"; 
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import EditVoceriaForm from "@/components/EditVoceriaForm"; 
import Modal from "@/components/Modal";

const nombresCategorias: Record<number, string> = {
    1: "Economía Productiva",
    2: "Ciudades Humanas y Servicios",
    3: "Seguridad y Paz",
    4: "Suprema Felicidad Social",
    5: "Organización y Planificación Popular",
    6: "Ecosocialismo, Ciencia y Tecnología",
};

const colorCategorias: Record<number, string> = {
    1: "bg-[#0B1535]", // Azul oscuro
    2: "bg-[#2765AE]", // Azul medio
    3: "bg-[#2B8CC5]", // Azul claro
    4: "bg-[#7E3EB0]", // Morado
    5: "bg-[#C1498E]", // Rosado fuerte
    6: "bg-[#6B7280]", // Gris
};

interface TipoVoceria {
    id: number;
    nombre: string;
    categoriaId: number;
}

const Vocerias: React.FC = () => {
    const { data: voceriasData, isLoading } = useTiposVoceria();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [voceriaToEdit, setVoceriaToEdit] = useState<TipoVoceria | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [voceriaToDelete, setVoceriaToDelete] = useState<{ id: number; nombre: string } | null>(null);
    const { mutate: deleteVoceria, isPending } = useDeleteComite();

    if (isLoading || !voceriasData) return <Loading />;

    const categorias = Array.from({ length: 6 }, (_, i) => i + 1);

    const voceriasPorCategoria = categorias.map((catId) => ({
        categoriaId: catId,
        vocerias: voceriasData.filter((v) => v.categoriaId === catId),
    }));

    const handleEdit = (voceria: TipoVoceria) => {
        setVoceriaToEdit(voceria);
        setIsEditModalOpen(true);
    };

    const handleEditSuccess = (updatedVoceria: TipoVoceria) => {
        // La invalidación del caché ya la hace el hook useUpdateTipoVoceria
        setVoceriaToEdit(null);
        setIsEditModalOpen(false);
    };
    
    // Función que se llama al hacer click en el botón "Eliminar" del ítem
    const handleOpenModal = (id: number, nombre: string) => {
        setVoceriaToDelete({ id, nombre });
        setIsModalOpen(true);
    };

    // Función que se llama al confirmar la eliminación en el modal
    const handleConfirmDelete = () => {
        if (voceriaToDelete) {
            deleteVoceria(voceriaToDelete.id, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setVoceriaToDelete(null);
                },
                onError: () => {
                    setIsModalOpen(false);
                }
            });
        }
    };

    return (
        <>
            <Tittle title="Comites" />
            <Divider />   
            <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-x-0 gap-y-6 pl-5 mt-2">
                {voceriasPorCategoria.map(({ categoriaId, vocerias }) => (
                    <div
                        key={categoriaId}
                        className="flex flex-col min-h-[300px] max-w-[480px] rounded-lg overflow-hidden shadow-md"
                    >
                        {/* Columna izquierda: título */}
                        <div
                            className={`w-full flex items-center justify-center p-4 text-white font-bold text-lg ${colorCategorias[categoriaId]}`}
                        >
                            <span className="text-center leading-snug">
                                {nombresCategorias[categoriaId] ?? `Categoría ${categoriaId}`}
                            </span>
                        </div>

                        {/* Columna derecha: lista */}
                        <div className="flex-1 bg-gray-100 p-4 flex ">
                            <ul className="space-y-3 text-sm text-gray-700 w-full">
                                {vocerias.map((voceria) => (
                                    <li
                                        key={voceria.id}
                                        className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full before:bg-gray-500 flex justify-between items-center pr-2"
                                    >
                                        <span>{voceria.nombre}</span>
                                        <div className="flex items-center space-x-2">
                                          <button
                                              onClick={() => handleEdit(voceria)}
                                              className="text-xs underline text-sky-600 hover:text-sky-800 transition duration-150"
                                              disabled={isPending}
                                          >
                                              Editar
                                          </button>
                                          <button
                                              onClick={() => handleOpenModal(voceria.id, voceria.nombre)}
                                              className={`text-xs underline text-red-500 hover:text-red-700 transition duration-150 ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                              disabled={isPending}
                                          >
                                              Eliminar
                                          </button>
                                      </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
            <Modal
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                width="w-[460px]" 
                title={`Editar Comité: ${voceriaToEdit?.nombre ?? ''}`}
            >
                {voceriaToEdit && (
                    <EditVoceriaForm
                        initialData={voceriaToEdit}
                        onSuccess={handleEditSuccess}
                        onCancel={() => setIsEditModalOpen(false)}
                    />
                )}
            </Modal>
            <DeleteConfirmationModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemToDelete={`eliminar el Comite "${voceriaToDelete?.nombre}"`}
                isPending={isPending}
            />
        </>
    );
};

export default Vocerias;
