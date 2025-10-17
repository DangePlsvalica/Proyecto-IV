import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ConsejoComunal } from "./interfaces/consejo.comunal.interface";
import { get } from '@/lib/request/api'
import toast from "react-hot-toast";

// Función que obtiene los consejos comunales
const fetchConsejoComunal = async (): Promise<ConsejoComunal[]> => {
    return get<ConsejoComunal[]>({
      path: '/api/consejos',
    });
  };

const useConsejos = () => {
  return useQuery<ConsejoComunal[], Error>({
    queryKey: ["consejoscomunal"],
    queryFn: fetchConsejoComunal, 
    staleTime: 1000 * 60 * 5, // 5 minutos de datos frescos
    gcTime: 1000 * 60 * 10, // 10 minutos en caché
    refetchOnWindowFocus: false,
    refetchOnMount: false, 
    retry: false, 
  });
};

export default useConsejos;

// Función para eliminar consejo comunal

const deleteConsejo = async (id: string): Promise<boolean> => {
    const response = await fetch(`/api/consejos/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar el Consejo Comunal.");
    }
    return true; 
};

export const useDeleteConsejoComunal = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: string) => deleteConsejo(id),
        onSuccess: (_, deletedId) => {
            queryClient.invalidateQueries({ queryKey: ["consejoscomunal"] }); 
            queryClient.invalidateQueries({ queryKey: ["consejoscomunal", deletedId] });
            toast.success("Consejo Comunal eliminado exitosamente.");
        },
        
        onError: (error) => {
            toast.error(error.message);
        }
    });
};