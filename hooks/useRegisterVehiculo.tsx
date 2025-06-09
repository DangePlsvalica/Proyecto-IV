import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { VehiculoFormData } from './interfaces/vehiculo.interface';
import { post } from '@/lib/request/api';

export const useRegisterVehiculo = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (formData: VehiculoFormData) => {
      return post<{ message: string }>({
        path: '/api/vehiculos',
        body: {
          ...formData,
          fechaDeEntrega: new Date(formData.fechaDeEntrega).toISOString(),
        }
      });
    },
    onSuccess: () => {
      // Invalida la caché de vehiculos para refrescar los datos
      toast.success('Vehiculo registrado exitosamente');
      queryClient.invalidateQueries({ queryKey: ["vehiculos"] });
      router.push('/vehiculos');
    },
    onError: (error: Error) => {
      console.error('Error al registrar vehiculo:', error);
      toast.error(error.message || 'Hubo un problema al registrar el vehiculo');
    },
  });

  return mutation;
};