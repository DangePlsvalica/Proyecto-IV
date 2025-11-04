"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import toast from "react-hot-toast";
import { useUpdateComite } from "@/hooks/useUpdateComite"; 
import { TipoVoceria, TipoVoceriaFormData } from "@/hooks/useRegisterVoceria"; 

interface EditVoceriaFormProps {
    initialData: TipoVoceria; 
    onSuccess?: (voceriaActualizada: TipoVoceria) => void;
    onCancel?: () => void;
}

interface EditVoceriaFormData {
    id: number;
    nombre: string;
    categoriaId: number;
}

const EditVoceriaForm: React.FC<EditVoceriaFormProps> = ({ initialData, onSuccess, onCancel }) => {
    const { mutate: updateVoceria, isPending } = useUpdateComite();

    const [formData, setFormData] = useState<EditVoceriaFormData>({
        id: initialData.id ?? 0,
        nombre: initialData.nombre,
        categoriaId: initialData.categoriaId,
    });
    useEffect(() => {
        setFormData({
            id: initialData.id ?? 0,
            nombre: initialData.nombre,
            categoriaId: initialData.categoriaId,
        });
    }, [initialData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "categoriaId" ? Number(value) : value, 
        }));
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const { id, nombre, categoriaId } = formData;

        if (!nombre || !categoriaId) {
            toast.error("Por favor completa todos los campos requeridos.");
            return;
        }

        const dataToUpdate: TipoVoceriaUpdatePayload = {
            nombre,
            categoriaId: Number(categoriaId),
        };

        updateVoceria({ id, data: dataToUpdate }, {
            onSuccess: (updatedVoceria) => {
                toast.success("Comite actualizada con éxito");
                onSuccess?.(updatedVoceria);
            },
            onError: (error) => {
                toast.error(`Fallo al actualizar: ${error.message}`);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3 px-6 py-4 max-w-[450px]">
            <FormInput
                label="Nombre del Comité"
                id="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
            />

            <div className="flex flex-col">
                <label htmlFor="categoriaId" className="text-sm font-medium text-gray-700">
                    Categoría
                </label>
                <select
                    id="categoriaId"
                    name="categoriaId"
                    value={formData.categoriaId}
                    onChange={handleChange}
                    className="border rounded-md p-2 mt-1 text-sm"
                >
                    <option value={1}>Economía Productiva</option>
                    <option value={2}>Ciudades Humanas y Servicios</option>
                    <option value={3}>Seguridad y Paz</option>
                    <option value={4}>Suprema Felicidad Social</option>
                    <option value={5}>Organización y Planificación Popular</option>
                    <option value={6}>Ecosocialismo, Ciencia y Tecnología</option>
                </select>
            </div>

            <div className="flex justify-center space-x-3 pt-4">
                {onCancel && (
                    <Button 
                        onClick={onCancel}
                        title="Cancelar"
                        disabled={isPending}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                    />
                )}
                <Button
                    onClick={handleSubmit}
                    title={isPending ? "Actualizando..." : "Guardar Cambios"}
                    disabled={isPending}
                />
            </div>
        </form>
    );
};

export default EditVoceriaForm;

interface TipoVoceriaUpdatePayload {
    nombre?: string;
    categoriaId?: number;
}