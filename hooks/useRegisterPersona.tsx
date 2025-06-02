import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PersonaFormData } from './interfaces/persona.interface';
import { post } from '@/lib/request/api';

export const useRegisterPersona = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (formData: PersonaFormData) => {
      return post<{ message: string }>({
        path: '/api/personas',
        body: {
          ...formData,
        }
      });
    },
    onSuccess: () => {
      // Invalida la caché de proyectos para refrescar los datos
      toast.success('Persona registrada exitosamente');
      queryClient.invalidateQueries({ queryKey: ["personas"] });
      router.push('/personas');
    },
    onError: (error: Error) => {
      console.error('Error al registrar Persona:', error);
      toast.error(error.message || 'Hubo un problema al registrar la persona');
    },
  });

  return mutation;
};