"use client";
import React from "react";
import Divider from "../../components/Divider";
import Link from "next/link";
import { FaRegTrashAlt } from "react-icons/fa";
import { useRolesQuery, useDeleteRoleMutation } from "@/hooks/useRoles";
import Loading from "@/components/Loading";
import Tittle from '@/components/Tittle'

const ROUTE_LABELS: Record<string, string> = {
  "/admin-user": "Usuarios",
  "/admin-role": "Roles",
  "/personas": "Personas",
  "/comunas": "Comunas",
  "/consejos-comunales": "Consejos Comunales",
  "/gestor-de-proyectos": "Gestor de Proyectos",
  "/register": "Registro",
  "/vehiculos": "Vehículos",
};

const ADMIN_ROLE_ID = "de3d5894-af53-4061-8dbf-97dcfcbaed9e";

const AdminRole: React.FC = () => {

  const { data: roles = [], isLoading } = useRolesQuery();
  const { mutate: deleteRole, isPending } = useDeleteRoleMutation();

  if (isLoading) return <Loading />;

  return (
    <>
      <Tittle title={"Administrar Roles"} />
      <Divider />
      <div className="animate-fade-in opacity-0">
        <div className="overflow-x-auto pt-5">
          <table className="table-auto w-[45%] m-auto border-separate border-spacing-0 border border-sky-950 rounded-lg overflow-hidden">
            <thead>
              <tr className="text-base text-white">
                <th className="py-1 text-center border-b bg-sky-950 border-sky-950">Nombre</th>
                <th className="text-center border-b bg-sky-950 border-sky-950">Permisos</th>
                <th className="text-center border-b bg-sky-950 border-sky-950">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles
                .filter((role) => role.id !== ADMIN_ROLE_ID)
                .map((role) => (
                  <tr key={role.id}>
                    <td className="text-center text-base border-b border-sky-950">
                      {role.name}
                    </td>
                    <td className="text-center text-md border-b border-sky-950 py-2">
                      <ul className="list-none">
                        {role.routes.map((route) => (
                          <li key={route}>{ROUTE_LABELS[route] || route}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="text-center border-b border-sky-950">
                      <div className="flex justify-center items-center">
                        <button
                          onClick={() => deleteRole(role.id)}
                          disabled={isPending}
                          className="bg-red-700 flex gap-2 items-center text-white text-sm px-3 py-2 rounded-lg hover:bg-red-800"
                        >
                          <FaRegTrashAlt />
                          {isPending ? "Eliminando..." : "Eliminar"}
                        </button>
                      </div>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center pt-6">
        <Link
          href="/admin-role/new-role"
          className="rounded-md bg-sky-950 px-3 py-2 border border-gray-500 text-sm font-semibold text-white shadow-sm hover:bg-sky-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Crear nuevo rol
        </Link>
      </div>
    </>
  );
};

export default AdminRole;