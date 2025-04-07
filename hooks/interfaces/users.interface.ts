export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

export interface UsersQueryResult {
  users: AdminUser[];
  isLoading: boolean;
  error: string | null;
  deleteUser: (id: string) => Promise<void>;
  updateUserRole: (id: string, newRole: string) => Promise<void>;
  refetch: () => Promise<void>;
}
  