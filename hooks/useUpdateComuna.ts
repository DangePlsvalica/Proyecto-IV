import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ComunaFormData } from "./interfaces/comuna.interface";

// Definimos los tipos que SÍ enviaremos (excluyendo relaciones/cálculos)
type ComunaUpdatePayload = Omit<ComunaFormData, 'consejosComunales' | 'bancoDeLaComuna' | 'poblacionVotante' | 'cantidadConsejosComunales'>;

const updateComuna = async (id: string, data: ComunaUpdatePayload) => {
    const response = await fetch(`/api/comunas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar la Comuna.");
    }
    return response.json();
};

export const useUpdateComuna = (comunaId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        // El mutationFn ahora acepta solo el payload limpio
        mutationFn: (data: ComunaUpdatePayload) => updateComuna(comunaId, data), 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comunas'] }); 
            queryClient.invalidateQueries({ queryKey: ['comunas', comunaId] }); 
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
};