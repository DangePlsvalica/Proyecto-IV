import { useQuery } from "@tanstack/react-query";
import { ConsejoComunal } from "./interfaces/consejo.comunal.interface";
import { get } from '@/lib/request/api'

// Función que obtiene los proyectos desde la API
const fetchConsejoComunal = async (): Promise<ConsejoComunal[]> => {
    return get<ConsejoComunal[]>({
      path: '/api/consejos',
    });
  };

const useConsejos = () => {
  return useQuery<ConsejoComunal[], Error>({
    queryKey: ["consejoscomunal"],
    queryFn: fetchConsejoComunal, 
    retry: false, // No reintenta en caso de fallo, puedes ajustarlo según tus necesidades
  });
};

export default useConsejos;