import { useQuery } from "@tanstack/react-query";
import { Persona } from "./interfaces/persona.interface";
import { get } from '@/lib/request/api'

// Función que obtiene los proyectos desde la API
const fetchProyectos = async (): Promise<Persona[]> => {
    return get<Persona[]>({
      path: '/api/personas',
    });
  };

const usePersonas = () => {
  return useQuery<Persona[], Error>({
    queryKey: ["personas"],
    queryFn: fetchProyectos, 
    staleTime: 1000 * 60 * 5, // 5 minutos de datos frescos
    gcTime: 1000 * 60 * 60, // 10 minutos en caché
    refetchOnWindowFocus: false, // No recargar al cambiar de pestaña
    retry: false,
  });
};

export default usePersonas;