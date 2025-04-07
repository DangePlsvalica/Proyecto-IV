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
    retry: false, // No reintenta en caso de fallo, puedes ajustarlo según tus necesidades
  });
};

export default useVehiculos;