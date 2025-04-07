import { useQuery } from "@tanstack/react-query";
import { Proyecto } from "./interfaces/proyecto.interface";
import { get } from '@/lib/request/api'

// Función que obtiene los proyectos desde la API
const fetchProyectos = async (): Promise<Proyecto[]> => {
    return get<Proyecto[]>({
      path: '/api/proyectos',
    });
  };

const useProyectos = () => {
  return useQuery<Proyecto[], Error>({
    queryKey: ["proyectos"],
    queryFn: fetchProyectos, 
    retry: false, // No reintenta en caso de fallo, puedes ajustarlo según tus necesidades
  });
};

export default useProyectos;