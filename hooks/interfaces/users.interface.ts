import { QueryObserverResult } from "@tanstack/react-query";

export interface AdminUser {
  id: string;
  email: string;
  roleId: string;
}

export interface UsersQueryResult {
  users: AdminUser[];
  isLoading: boolean;
  error: string | null;
  deleteUser: (id: string) => void; // Cambiado de Promise<void> a void
  updateUserRole: (id: string, newRoleId: string) => void; // Igual aquí
  refetch: () => Promise<QueryObserverResult<AdminUser[], Error>>; // Tipo más preciso
}
  