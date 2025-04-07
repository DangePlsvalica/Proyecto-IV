import { useQuery } from "@tanstack/react-query";
import { Comuna } from "@/hooks/interfaces/comuna.interface";
import { get } from '@/lib/request/api'

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
    retry: false, // No reintenta en caso de fallo, puedes ajustarlo según tus necesidades
  });
};

export default useComunas;