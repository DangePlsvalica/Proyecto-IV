"use client";
import React, { useState, useEffect } from "react";
import Divider from "../../components/Divider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaRegTrashAlt } from "react-icons/fa";
import { useUsersQuery } from '@/hooks/useUsers'
import Loading from "@/components/Loading";
import Tittle from '@/components/Tittle'

const AdminUser: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    users,
    isLoading,
    deleteUser,
    updateUserRole
  } = useUsersQuery();


  if (status === "loading") {
    return (<Loading />);
  }
  if (!session) {
    router.push("/login");
    return null;
  }
  if (session.user.role !== "Admin") {
    router.push("/");
    return null;
  }
  if (isLoading) {
    return (<Loading />);
  }

  return (
    <>
      <Tittle title={"Administrar Usuarios"} />
      <Divider />
      <div className="animate-fade-in opacity-0">
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
              {users.map((user) => (
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
                    <div className="flex justify-center items-center">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="bg-red-700 flex gap-2 items-center text-white text-sm px-3 py-2 rounded-lg hover:bg-red-800"
                      >
                        <FaRegTrashAlt />
                        Eliminar
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
          href="/register"
          className="rounded-md bg-sky-950 px-3 py-2 border border-gray-500 text-sm font-semibold text-white shadow-sm hover:bg-sky-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Registrar nuevo usuario
        </Link>
      </div>
    </>
  );
};

export default AdminUser;

