"use client";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { post } from "@/lib/request/api";

export const useChangePassword = () => {
const mutation = useMutation<{ message: string }, Error, { currentPassword: string; newPassword: string }>(
  {
    mutationFn: async ({ currentPassword, newPassword }) => {
      if (newPassword.length < 8) {
        throw new Error("La nueva contraseña debe tener al menos 8 caracteres");
      }

      return await post({
        path: "/api/change-password",
        body: { currentPassword, newPassword },
      });
    },
    onSuccess: (data) => {
      toast.success(data.message || "Contraseña actualizada correctamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al cambiar la contraseña");
    },
  }
);


  return {
    changePassword: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error?.message,
  };
};

