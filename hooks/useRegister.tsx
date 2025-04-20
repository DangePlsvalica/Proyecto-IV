"use client";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { post } from "@/lib/request/api";
import { RegisterOptions, RegisterResponse } from './interfaces/register.interface';
import { useQueryClient } from "@tanstack/react-query";

export const useRegister = () => {
  const validateInputs = ({ email, password, confirmPassword }: Omit<RegisterOptions, 'role'>) => {
    const errors = {
      email: !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) 
        ? "El correo es inválido" 
        : undefined,
      password: !password || password.length < 8 
        ? "La contraseña debe tener al menos 8 caracteres" 
        : undefined,
      confirmPassword: confirmPassword !== password 
        ? "Las contraseñas no coinciden" 
        : undefined
    };

    return {
      isValid: !errors.email && !errors.password && !errors.confirmPassword,
      errors
    };
  };
  const queryClient = useQueryClient();
  const mutation = useMutation<RegisterResponse, Error, RegisterOptions>({
    mutationFn: async (values) => {
      const { isValid, errors } = validateInputs(values);
      
      if (!isValid) {
        const firstError = Object.values(errors).find(Boolean);
        throw new Error(firstError || "Datos inválidos");
      }

      const response = await post<RegisterResponse>({
        path: "/api/register",
        body: {
          email: values.email,
          password: values.password,
          role: values.role
        }
      });

      return {
        ...response,
        success: true, // Asegurar que se incluya este campo siempre
      };
    },
    onSuccess: () => {
      toast.success("Registro exitoso");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return {
    registerUser: mutation.mutateAsync,
    error: mutation.error?.message || "",
    isLoading: mutation.isPending,
    resetError: () => mutation.reset(),
  };
};