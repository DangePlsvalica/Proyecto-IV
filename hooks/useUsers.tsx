"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, del, put } from "@/lib/request/api";
import toast from "react-hot-toast";
import { AdminUser, UsersQueryResult } from './interfaces/users.interface';

export const useUsersQuery = (): UsersQueryResult => {
  const queryClient = useQueryClient();

  // Consulta para obtener usuarios
  const { data: users = [], isLoading, error, refetch } = useQuery<AdminUser[], Error>({
    queryKey: ["users"],
    queryFn: () => get<AdminUser[]>({ path: "/api/users" }),
    staleTime: 1000 * 60 * 5, // 5 minutos de datos frescos
    gcTime: 1000 * 60 * 10, // 10 minutos en caché
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false, // No recargar al montar el componente
  });

  // Mutación para eliminar usuario
  const deleteMutation = useMutation({
    mutationFn: (id: string) => del({ path: "/api/users", body: { id } }),
    onSuccess: (_, id) => {
      queryClient.setQueryData<AdminUser[]>(["users"], (old) => 
        old?.filter(user => user.id !== id) || []
      );
      toast.success("Usuario eliminado exitosamente");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Error al eliminar usuario");
    }
  });

  // Mutación para actualizar rol
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => 
      put({ path: "/api/users", body: { id, role } }),
    onSuccess: (_, variables) => {
      queryClient.setQueryData<AdminUser[]>(["users"], (old) =>
        old?.map(user => user.id === variables.id ? { ...user, role: variables.role } : user) || []
      );
      toast.success("Rol actualizado exitosamente");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Error al actualizar rol");
    }
  });

  return {
    users,
    isLoading,
    error: error?.message || null,
    deleteUser: deleteMutation.mutate,
    updateUserRole: (id: string, newRole: string) => updateRoleMutation.mutate({ id, role: newRole }),
    refetch,
  };
};