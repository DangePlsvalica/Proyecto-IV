import { useQuery } from "@tanstack/react-query";
import { Categoria } from "./interfaces/categoria.interface";
import { get } from '@/lib/request/api';

// Función que obtiene las categorías desde la API
const fetchCategorias = async (): Promise<Categoria[]> => {
  return get<Categoria[]>({
    path: '/api/categorias',
  });
};

const useCategorias = () => {
  return useQuery<Categoria[], Error>({
    queryKey: ["categorias"],
    queryFn: fetchCategorias,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });
};

export default useCategorias;