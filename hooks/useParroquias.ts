import { useQuery } from "@tanstack/react-query";
import { Parroquia } from "./interfaces/parroquia.interface";
import { get } from '@/lib/request/api';

// Función que obtiene las parroquias desde la API
const fetchParroquias = async (): Promise<Parroquia[]> => {
  return get<Parroquia[]>({
    path: '/api/parroquias',
  });
};

const useParroquias = () => {
  return useQuery<Parroquia[], Error>({
    queryKey: ["parroquias"],
    queryFn: fetchParroquias,
    staleTime: 1000 * 60 * 60, // 5 minutos de datos frescos
    gcTime: 1000 * 60 * 60,   // 10 minutos en caché
    refetchOnWindowFocus: false, 
    refetchOnMount: false, 
    retry: false, 
  });
};

export default useParroquias;
