"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { post } from "@/lib/request/api";
import { RegisterData, RegisterOptions, RegisterResponse } from './interfaces/register.interface';

export const useRegister = () => {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const registerUser = async (
    values: RegisterOptions
  ): Promise<RegisterResponse> => {
    const { isValid, errors } = validateInputs(values);
    
    if (!isValid) {
      const firstError = Object.values(errors).find(Boolean);
      setError(firstError || "");
      toast.error(firstError || "Datos inválidos");
      return { success: false, error: firstError };
    }

    setIsLoading(true);
    
    try {
      await post<RegisterData>({
        path: "/api/register",
        body: {
          email: values.email,
          password: values.password,
          role: values.role
        }
      });

      toast.success("Registro exitoso");
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Error al registrar usuario";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerUser,
    error,
    isLoading,
    resetError: () => setError(""),
  };
};