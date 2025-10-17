import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ConsejoComunalFormData } from "./interfaces/consejo.comunal.interface";

const updateConsejo = async (id: string, data: ConsejoComunalFormData) => {
    const response = await fetch(`/api/consejos/${id}`, {
        method: "PUT", // o PATCH
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el Consejo Comunal.");
    }
    return response.json();
};

export const useUpdateConsejoComunal = (consejoId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ConsejoComunalFormData) => updateConsejo(consejoId, data),
        onError: (error) => {
            toast.error(error.message);
        }
    });
};