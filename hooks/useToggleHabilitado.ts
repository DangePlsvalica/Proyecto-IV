// src/hooks/useToggleHabilitado.ts (si lo renombras)
import { useMutation, useQueryClient } from "@tanstack/react-query";

// 1. Definimos la estructura del payload
interface TogglePayload {
  ids: number[];
  habilitado: boolean; // Puede ser true (habilitar) o false (deshabilitar)
}

// 2. Función para la llamada a la API
const toggleHabilitadoBulk = async ({ ids, habilitado }: TogglePayload): Promise<any> => {
  const response = await fetch('/api/personas/bulk-update', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    // Enviamos el objeto completo (ids y el estado booleano)
    body: JSON.stringify({ ids, habilitado }), 
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error desconocido al actualizar el estado de habilitación.');
  }
  return response.json();
};

interface UseToggleHabilitadoOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

// 3. Modificamos el hook para usar la nueva firma (useMutation<Resultado, Error, Payload>)
const useToggleHabilitado = (options?: UseToggleHabilitadoOptions) => {
  const queryClient = useQueryClient();
  
  // El tipo del argumento de mutate ahora es TogglePayload
  return useMutation<any, unknown, TogglePayload>({
    mutationFn: toggleHabilitadoBulk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas'] }); 
      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Error al hacer el toggle de habilitado:", error);
      options?.onError?.(error);
    },
  });
};

export default useToggleHabilitado;