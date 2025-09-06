import { useQuery } from "@tanstack/react-query";
import { get } from '@/lib/request/api';

export interface TipoVoceria {
  id: number;
  nombre: string;
  esObligatoria: boolean;
  categoriaId: number;
}

const fetchTiposVoceria = async (): Promise<TipoVoceria[]> => {
  return get<TipoVoceria[]>({
    path: '/api/vocerias',
  });
};

export const useTiposVoceria = () => {
  return useQuery<TipoVoceria[], Error>({
    queryKey: ["tiposVoceria"],
    queryFn: fetchTiposVoceria,
    staleTime: 1000 * 60 * 60, // 1 hora
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });
};
