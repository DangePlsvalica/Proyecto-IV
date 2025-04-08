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
          consejoComunal: formData.consejoComunal.map((option) => option.value),
        }
      });
    },
    onSuccess: () => {
      // Invalida la caché de comunas para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['comunas'] });
      toast.success('Comuna registrada exitosamente');
      router.push('/pages/comunas');
    },
    onError: (error: Error) => {
      console.error('Error al registrar comuna:', error);
      toast.error(error.message || 'Hubo un problema al registrar la comuna');
    },
  });

  return mutation;
};