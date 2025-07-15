import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Vehiculo } from "./interfaces/vehiculo.interface";
import { get } from '@/lib/request/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Obtener todos los vehículos
const fetchVehiculos = async (): Promise<Vehiculo[]> => {
    return get<Vehiculo[]>({ path: '/api/vehiculos' });
};

export const useVehiculos = () => {
  return useQuery<Vehiculo[], Error>({
    queryKey: ["vehiculos"],
    queryFn: fetchVehiculos,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

// Eliminar un vehículo
export const useDeleteVehiculo = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch('/api/vehiculos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error eliminando vehículo');
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success('Vehículo eliminado correctamente');
      queryClient.invalidateQueries({ queryKey: ['vehiculos'] });
      router.replace('/vehiculos');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al eliminar vehículo');
    },
  });
};

// Reasignar vehículo
export const useUpdateVehiculo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: number;
      cc: string;
      voceroAsignadoId: number;
      estatus?: string;
    }) => {
      const res = await fetch('/api/vehiculos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || 'Error actualizando vehículo');
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success('Vehículo reasignado correctamente');
      queryClient.invalidateQueries({ queryKey: ['vehiculos'] });
    },
    onError: (error: Error) => {
      if (error.message.includes('ya tiene otro vehículo asignado')) {
        toast.error('Esa persona ya tiene un vehículo asignado.');
      } else {
        toast.error(error.message || 'Error al reasignar vehículo');
      }
    },
  });
};
