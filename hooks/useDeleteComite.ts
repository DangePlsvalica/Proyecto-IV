import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const deleteComite = async (id: number): Promise<boolean> => {
    // 💡 El ID se pasa como query parameter: /api/tipos-voceria?id=123
    const response = await fetch(`/api/vocerias?id=${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar el Comite.");
    }
    return true; 
};

export const useDeleteComite = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: number) => deleteComite(id),
        
        onSuccess: () => {
            // 💡 Invalidar la caché para que la lista de Tipos de Vocería se recargue
            queryClient.invalidateQueries({ queryKey: ["tiposVoceria"] }); 
            toast.success("Comite eliminado exitosamente.");
        },
        
        onError: (error) => {
            // Esto mostrará los errores de 404 (No encontrado) o 409 (Conflict/Dependencia)
            toast.error(error.message);
        }
    });
};