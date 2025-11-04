import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface TipoVoceriaUpdatePayload {
    nombre?: string;
    categoriaId?: number;
}

// Función que realiza la llamada a la API
const updateComite = async (id: number, data: TipoVoceriaUpdatePayload) => {
    const response = await fetch(`/api/vocerias/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el Comite.");
    }
    return response.json();
};

export const useUpdateComite = () => {
    const queryClient = useQueryClient();
    // El mutateFn recibirá un objeto que contiene el ID y los datos a actualizar
    return useMutation({
        mutationFn: ({ id, data }: { id: number, data: TipoVoceriaUpdatePayload }) => 
            updateComite(id, data),
            
        onSuccess: (updatedVoceria) => {
            queryClient.invalidateQueries({ queryKey: ["tiposVoceria"] }); 
            queryClient.invalidateQueries({ queryKey: ["tiposVoceria", updatedVoceria.id] });
            toast.success("Comite actualizado exitosamente.");
        },
        
        onError: (error) => {
            toast.error(error.message);
        }
    });
};