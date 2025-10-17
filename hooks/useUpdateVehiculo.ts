import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { VehiculoFormData } from "./interfaces/vehiculo.interface"; // Asegúrate de que la ruta sea correcta

// La función de actualización usará FormData para manejar la subida de archivos
const updateVehiculo = async (id: number, data: VehiculoFormData) => {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
        const value = data[key as keyof VehiculoFormData];
        
        if (key !== 'observacionArchivo' && key !== 'fechaDeEntrega') {
            formData.append(key, String(value));
        }
    });

    if (data.fechaDeEntrega) {
        formData.append('fechaDeEntrega', String(data.fechaDeEntrega));
    }
    
    if (data.observacionArchivo instanceof File) {
        formData.append('observacionArchivo', data.observacionArchivo);
    } else if (data.observacionArchivo === 'DELETE_FILE_SIGNAL') { 
        formData.append('observacionArchivo', 'DELETE_FILE_SIGNAL');
    }
    
    const response = await fetch(`/api/vehiculos/${id}`, {
        method: "PUT",
        body: formData, 
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el Vehículo.");
    }
    return response.json();
};

export const useUpdateVehiculo = (vehiculoId: number) => {
    const queryClient = useQueryClient();
    const queryKey = ["vehiculos"]; 
    
    return useMutation({
        mutationFn: (data: VehiculoFormData) => updateVehiculo(vehiculoId, data),
        
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKey }); 
            queryClient.invalidateQueries({ queryKey: [...queryKey, vehiculoId] }); 
        },
        
        onError: (error) => {
            toast.error(error.message);
        }
    });
};