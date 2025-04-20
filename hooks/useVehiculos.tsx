import { useQuery } from "@tanstack/react-query";
import { Vehiculo } from "./interfaces/vehiculo.interface";
import { get } from '@/lib/request/api'

const fetchVehiculos = async (): Promise<Vehiculo[]> => {
    return get<Vehiculo[]>({
      path: '/api/vehiculos',
    });
  };

const useVehiculos = () => {
  return useQuery<Vehiculo[], Error>({
    queryKey: ["vehiculos"],
    queryFn: fetchVehiculos, 
    staleTime: 1000 * 60 * 5, // 5 minutos de datos frescos
    gcTime: 1000 * 60 * 10, // 10 minutos en caché
    refetchOnWindowFocus: false, // No recargar al cambiar de pestaña
    retry: false,
  });
};

export default useVehiculos;