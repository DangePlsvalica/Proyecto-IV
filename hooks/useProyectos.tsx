import { useQuery } from "@tanstack/react-query";
import { Proyecto } from "./interfaces/proyecto.interface";
import { get } from '@/lib/request/api';

const fetchProyectos = async (): Promise<Proyecto[]> => {
  return get<Proyecto[]>({
    path: '/api/proyectos',
  });
};

const useProyectos = () => {
  return useQuery<Proyecto[], Error>({
    queryKey: ["proyectos"],
    queryFn: fetchProyectos, 
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export default useProyectos;
