"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { post } from "@/lib/request/api";

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ name, routes }: { name: string; routes: string[] }) => {
      if (!name.trim()) throw new Error("El nombre del rol es obligatorio");
      if (routes.length === 0) throw new Error("Selecciona al menos una ruta");

      const response = await post({
        path: "/api/roles",
        body: { name, routes },
      });

      return response;
    },
    onSuccess: () => {
      toast.success("Rol creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Error al crear rol");
    }
  });

  return {
    createRole: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error?.message || "",
    resetError: mutation.reset
  };
};
