"use client";
import { useState, useEffect } from "react";
import { get, post, del, put } from "@/lib/request/api";
import toast from "react-hot-toast";
import { AdminUser, UsersQueryResult } from './interfaces/users.interface'

export const useUsersQuery = (): UsersQueryResult => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await get<AdminUser[]>({ path: "/api/users" });
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar usuarios");
      toast.error(err.message || "Error al cargar usuarios");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await del({ path: "/api/users", body: { id } });
      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success("Usuario eliminado exitosamente");
    } catch (err: any) {
      toast.error(err.message || "Error al eliminar usuario");
      throw err;
    }
  };

  const updateUserRole = async (id: string, newRole: string) => {
    try {
      await put({ path: "/api/users", body: { id, role: newRole } });
      setUsers(prev => 
        prev.map(user => user.id === id ? { ...user, role: newRole } : user)
      );
      toast.success("Rol actualizado exitosamente");
    } catch (err: any) {
      toast.error(err.message || "Error al actualizar rol");
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
    deleteUser,
    updateUserRole,
    refetch: fetchUsers,
  };
};