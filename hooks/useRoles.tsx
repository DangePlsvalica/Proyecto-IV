import { useEffect, useState } from "react";
import { get } from "@/lib/request/api";

interface Role {
  id: string;
  name: string;
}

export const useRolesQuery = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get<Role[]>({ path: "/api/roles" })
      .then(setRoles)
      .finally(() => setLoading(false));
  }, []);

  return { roles, loading };
};

