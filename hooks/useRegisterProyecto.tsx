import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ProyectoFormData } from './interfaces/proyecto.interface';
import { post } from '@/lib/request/api';

export const useRegisterProyecto = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (formData: ProyectoFormData) => {
      return post<{ message: string }>({
        path: '/api/proyectos',
        body: {
          ...formData,
          fechaCreacion: new Date(formData.fechaCreacion).toISOString(),
          ultimaActividad: new Date(formData.ultimaActividad).toISOString(),
        }
      });
    },
    onSuccess: () => {
      // Invalida la caché de proyectos para refrescar los datos
      toast.success('Proyecto registrado exitosamente');
      queryClient.invalidateQueries({ queryKey: ["proyectos"] });
      router.push('/gestor-de-proyectos');
    },
    onError: (error: Error) => {
      console.error('Error al registrar Proyecto:', error);
      toast.error(error.message || 'Hubo un problema al registrar el Proyecto');
    },
  });

  return mutation;
};