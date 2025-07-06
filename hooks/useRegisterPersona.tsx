import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Persona, PersonaFormData } from './interfaces/persona.interface';
import { post } from '@/lib/request/api';

export const useRegisterPersona = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<Persona, Error, PersonaFormData>({
    mutationFn: async (formData: PersonaFormData) => {
      return post<Persona>({
        path: '/api/personas',
        body: { ...formData },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personas"] });
      // Puedes dejar este redirect solo si estás haciendo el registro desde /personas
      // router.push('/personas');
    },
    onError: (error: Error) => {
      console.error('Error al registrar Persona:', error);
      toast.error(error.message || 'Hubo un problema al registrar la persona');
    },
  });

  return mutation;
};
