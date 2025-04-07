import { QueryObserverResult } from "@tanstack/react-query";

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

export interface UsersQueryResult {
  users: AdminUser[];
  isLoading: boolean;
  error: string | null;
  deleteUser: (id: string) => void; // Cambiado de Promise<void> a void
  updateUserRole: (id: string, newRole: string) => void; // Igual aquí
  refetch: () => Promise<QueryObserverResult<AdminUser[], Error>>; // Tipo más preciso
}
  