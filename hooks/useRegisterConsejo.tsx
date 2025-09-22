import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { post } from '@/lib/request/api';
import { ConsejoComunal } from './interfaces/consejo.comunal.interface';
import { ConsejoComunalFormData } from './interfaces/consejo.comunal.interface';

export const useRegisterConsejoComunal = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (formData: ConsejoComunalFormData) => {
      // Modifica la estructura del body para coincidir con el endpoint POST
      return post<ConsejoComunal>({
        path: '/api/consejos',
        body: {
          ...formData,
          fechaConstitucion: new Date(formData.fechaConstitucion).toISOString(),
          fechaVencimiento: new Date(formData.fechaVencimiento).toISOString(),
        },
      });
    },
    onSuccess: async () => {
      toast.success('Consejo Comunal registrado exitosamente');
      await queryClient.invalidateQueries({ queryKey: ['consejoscomunal'] });
      await queryClient.refetchQueries({ queryKey: ['consejoscomunal'] });
      router.push('/consejos-comunales');
    },
    onError: (error: Error) => {
      console.error('Error al registrar consejo comunal:', error);
      toast.error(error.message || 'Hubo un problema al registrar el consejo comunal');
    },
  });

  return mutation;
};