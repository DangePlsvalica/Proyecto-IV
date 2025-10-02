import { useQuery } from "@tanstack/react-query";
import { Consulta } from "./interfaces/consulta.interface";
import { get } from '@/lib/request/api';

// Función que obtiene las consultas desde la API
const fetchConsultas = async (): Promise<Consulta[]> => {
  return get<Consulta[]>({
    path: '/api/consultas',
  });
};

const useConsultas = () => {
  return useQuery<Consulta[], Error>({
    queryKey: ["consultas"],
    queryFn: fetchConsultas,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });
};

export default useConsultas;