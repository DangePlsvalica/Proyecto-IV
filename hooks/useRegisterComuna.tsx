import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ComunaFormData } from './interfaces/comuna.interface';
import { post } from '@/lib/request/api';

interface ApiResponse {
  id: string;
  [key: string]: any;
}

interface ErrorResponse {
  message?: string;
  [key: string]: any;
}

export const useRegisterComuna = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ApiResponse, Error, ComunaFormData>({
    mutationFn: async (formData) => {
      try {
        // Preparamos el payload según tu interfaz ComunaFormData
        const payload = {
          ...formData,
          consejoComunal: formData.consejoComunal.map(option => option.value),
          // Los campos numéricos ya deben venir como number según tu interfaz
        };

        // Usamos tu función post con tipado explícito
        return await post<ApiResponse>({
          path: '/api/comunas',
          body: payload,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
      } catch (error) {
        console.error('Error en la solicitud:', error);
        
        // Manejo de errores específico
        if (error instanceof Error) {
          throw error; // Ya es un Error
        }
        
        // Para casos donde el error no es una instancia de Error
        throw new Error(
          typeof error === 'object' && error !== null && 'message' in error 
            ? (error as { message: string }).message 
            : 'Error desconocido al registrar la comuna'
        );
      }
    },
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['comunas'] });
      
      // Mostrar notificación con el ID de la comuna creada
      toast.success(`Comuna ${data.id} registrada exitosamente`);
      
      // Redireccionar
      router.push('/pages/comunas');
    },
    onError: (error) => {
      console.error('Error al registrar comuna:', error);
      toast.error(error.message || 'Hubo un problema al registrar la comuna');
    },
    onMutate: async (newComuna) => {
      // Cancelar queries actuales
      await queryClient.cancelQueries({ queryKey: ['comunas'] });
      
      // Snapshot del valor anterior
      const previousComunas = queryClient.getQueryData<ComunaFormData[]>(['comunas']);
      
      // Actualización optimista
      queryClient.setQueryData<ComunaFormData[]>(['comunas'], (old = []) => [...old, newComuna]);
      
      return { previousComunas };
    },
    onSettled: () => {
      // Invalidar queries para asegurar datos frescos
      queryClient.invalidateQueries({ queryKey: ['comunas'] });
    },
  });
};