import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Comuna } from "@/hooks/interfaces/comuna.interface";
import { get } from '@/lib/request/api'
import toast from "react-hot-toast";

// Función que obtiene los Comunas desde la API
const fetchComunas = async (): Promise<Comuna[]> => {
    return get<Comuna[]>({
      path: '/api/comunas',
    });
  };

const useComunas = () => {
  return useQuery<Comuna[], Error>({
    queryKey: ["comunas"],
    queryFn: fetchComunas, 
    staleTime: 1000 * 60 * 5, // 5 minutos de datos frescos
    gcTime: 1000 * 60 * 10, // 10 minutos en caché
    refetchOnWindowFocus: false, // No recargar al cambiar de pestaña
    retry: false,
  });
};

export default useComunas;

// Función para eliminar una Comuna

const deleteComuna = async (id: string): Promise<boolean> => {
    const response = await fetch(`/api/comunas/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar la Comuna.");
    }
    return true; 
};

export const useDeleteComuna = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: string) => deleteComuna(id),
        
        onSuccess: (_, deletedId) => {
            queryClient.invalidateQueries({ queryKey: ["comunas"] }); 
            queryClient.invalidateQueries({ queryKey: ["comunas", deletedId] });
            toast.success("Comuna eliminada exitosamente.");
        },
        
        onError: (error) => {
            toast.error(error.message);
        }
    });
};