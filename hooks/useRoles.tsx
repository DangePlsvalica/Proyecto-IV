import { useMutation, useQuery, useQueryClient  } from "@tanstack/react-query";
import { del, get } from "@/lib/request/api";
import toast from "react-hot-toast";

interface Role {
  id: string;
  name: string;
  routes: string[];
}

export const useRolesQuery = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["roles"],
    queryFn: () => get<Role[]>({ path: "/api/roles" }),
    staleTime: 1000 * 60 * 5, // 5 minutos de datos frescos
    gcTime: 1000 * 60 * 10, // 10 minutos en caché
    retry: false,
    refetchOnWindowFocus: false,
  });
};

  // Mutación para eliminar usuario
export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => del({ path: "/api/roles", body: { id } }),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Role[]>(["roles"], (oldRoles) => 
        oldRoles?.filter(role => role.id !== id) || []
      );
      toast.success("Rol eliminado exitosamente");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Error al eliminar el rol");
    }
  });
};
