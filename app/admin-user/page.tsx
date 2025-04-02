"use client";
import React, { useState, useEffect } from "react";
import Divider from "../../components/Divider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AdminUser {
  id: string;
  email: string;
  role: string;
}

const AdminUser: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Estado para almacenar los datos de la base de datos
  const [usersData, setUsersData] = useState<AdminUser[]>([]);

  // Hook para obtener los datos desde la API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data: AdminUser[] = await response.json();
        console.log("Datos de users:", data);
        setUsersData(data); // Almacena los datos obtenidos
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Función para eliminar usuario
  const deleteUser = async (id: string) => {
    try {
      const response = await fetch('/api/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }), // Envía el `id` en el cuerpo
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al eliminar usuario:", errorData.error);
        toast.error("No se pudo eliminar el usuario");
        return;
      }
  
      setUsersData((prev) => prev.filter((user) => user.id !== id));
      toast.success("Usuario eliminado exitosamente");
    } catch (error) {
      console.error("Error en el servidor:", error);
    }
  };

  // Función para cambiar el rol del usuario
  const updateUserRole = async (id: string, newRole: string) => {
    try { 
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, role: newRole }), // Envía el id y el nuevo rol en el cuerpo
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al actualizar el rol del usuario:", errorData.error);
        toast.error("No se pudo actualizar los permisos del usuario");
        return;
      }
      // Actualiza los datos locales para reflejar los cambios
      setUsersData((prev) =>
        prev.map((user) => (user.id === id ? { ...user, role: newRole } : user))
      );
      toast.success("Permisos del usuario actualizado exitosamente");
    } catch (error) {
      console.error("Error en el servidor:", error);
    }
  };
  
  // Redirige al login si no hay sesión y la autenticación está cargada
  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  if (!session) {
    router.push("/login"); // Redirige al login si no hay sesión
    return null; // Asegura que la página no se renderice
  }

  if (session.user.role !== "Admin") {
    router.push("/"); // Redirige al home si no es admin
    return null; // Asegura que no se renderice la página
  }

  return (
    <>
      <div className="flex flex-col items-start justify-between pl-6 py-3">
        <h1 className="text-xl max-[500px]:text-xl">Administrar Usuarios</h1>
      </div>
      <Divider />
      <div className="overflow-x-auto pt-5">
        <table className="table-auto w-[50%] m-auto border-separate border-spacing-0 border border-sky-950 rounded-lg overflow-hidden">
          <thead>
            <tr className="text-base text-white">
              <th className="py-1 text-center border-b bg-sky-950 border-sky-950">Email</th>
              <th className="text-center border-b bg-sky-950 border-sky-950">Permisos</th>
              <th className="text-center border-b bg-sky-950 border-sky-950">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usersData.map((user) => (
              <tr key={user.id}>
                <td className="text-center text-base border-b border-sky-950">
                  {user.email}
                </td>
                <td className="text-center text-sm border-b border-sky-950 py-2">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                    className="border text-sm appearance-none pr-8 border-gray-300 rounded-lg text-gray-700 bg-white shadow-sm focus:outline-none transition duration-150 ease-in-out hover:bg-gray-100"
                  >
                    <option value="user" className="text-gray-700 text-sm">Usuario</option>
                    <option value="Admin" className="text-gray-700 text-sm">Administrador</option>
                  </select>
                </td>
                <td className="text-center border-b border-sky-950">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-700 text-white text-sm px-3 py-2 rounded-lg hover:bg-red-800"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminUser;

