import { useMutation, useQueryClient } from "@tanstack/react-query";

// 1. Función para la llamada a la API
const disablePersonasBulk = async (personaIds: number[]): Promise<any> => {
  const response = await fetch('/api/personas/bulk-update', {
    method: 'PATCH', // Usamos PATCH para una actualización parcial (solo el campo 'habilitado')
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids: personaIds, habilitado: false }),
  });

  if (!response.ok) {
    // Aquí puedes manejar errores específicos del backend
    // Intentar leer el error del cuerpo si está disponible
    const errorData = await response.json();
    throw new Error(errorData.message || 'No se pudo deshabilitar las personas seleccionadas');
  }

  return response.json();
};

interface UseDisablePersonasOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

const useDisablePersonas = (options?: UseDisablePersonasOptions) => {
  const queryClient = useQueryClient();
  
  // 2. Uso del hook useMutation
  return useMutation({
    mutationFn: disablePersonasBulk, // Usamos 'mutationFn' en lugar de pasar la función como primer argumento
    onSuccess: () => {
      // 💡 CORRECCIÓN IMPORTANTE: La sintaxis de invalidateQueries en Tanstack Query usa un array como primer argumento
      queryClient.invalidateQueries({ queryKey: ['personas'] }); 
      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Error al deshabilitar:", error);
      options?.onError?.(error);
    },
  });
};

export default useDisablePersonas;