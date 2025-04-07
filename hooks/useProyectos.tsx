import { useQuery } from "@tanstack/react-query";
import { Proyecto } from "./interfaces/proyecto.interface";
import { get } from '@/lib/request/api'

// Función que obtiene los proyectos desde la API
const fetchProyectos = async (): Promise<Proyecto[]> => {
  console.log("🔴 HACIENDO PETICIÓN REAL A /api/proyectos");
    return get<Proyecto[]>({
      path: '/api/proyectos',
    });
  };

const useProyectos = () => {
  return useQuery<Proyecto[], Error>({
    queryKey: ["proyectos"],
    queryFn: fetchProyectos, 
    staleTime: 1000 * 60 * 5, // 5 minutos de datos frescos
    gcTime: 1000 * 60 * 10, // 10 minutos en caché
    refetchOnWindowFocus: false, // No recargar al cambiar de pestaña
    refetchOnMount: false, // No recargar al montar el componente
    retry: false, // No reintenta en caso de fallo, puedes ajustarlo según tus necesidades
  });
};

export default useProyectos;