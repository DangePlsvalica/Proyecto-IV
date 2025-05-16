import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ComunaFormData } from './interfaces/comuna.interface';
import { post } from '@/lib/request/api';

export const useRegisterComuna = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (formData: ComunaFormData) => {
      return post<{ message: string }>({
        path: '/api/comunas',
        body: {
          ...formData,
          fechaComisionPromotora: new Date(formData.fechaComisionPromotora).toISOString(),
          fechaRegistro: new Date(formData.fechaRegistro).toISOString(),
          fechaUltimaEleccion: new Date(formData.fechaUltimaEleccion).toISOString(),
        }
      });
    },
    onSuccess: () => {
      // Invalida la caché de comunas para refrescar los datos
      toast.success('Comuna registrada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['comunas'] });
      router.push('/pages/comunas');
    },
    onError: (error: Error) => {
      console.error('Error al registrar comuna:', error);
      toast.error(error.message || 'Hubo un problema al registrar la comuna');
    },
  });

  return mutation;
};