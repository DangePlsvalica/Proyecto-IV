"use client";
import React from "react";
import Divider from "../../components/Divider";
import Link from "next/link";
import { FaRegTrashAlt } from "react-icons/fa";
import { useUsersQuery } from '@/hooks/useUsers'
import Loading from "@/components/Loading";
import Tittle from '@/components/Tittle'

const Personas: React.FC = () => {
  const {
    users,
    isLoading,
    deleteUser,
    updateUserRole
  } = useUsersQuery();


  if (isLoading) {
    return (<Loading />);
  }

  return (
    <>
      <Tittle title={"Personas"} />
      <Divider />
      <div className="animate-fade-in opacity-0">
        <div className="overflow-x-auto pt-5">
          <table className="table-auto w-[50%] m-auto border-separate border-spacing-0 border border-sky-950 rounded-lg overflow-hidden">
            <thead>
              <tr className="text-base text-white">
                <th className="py-1 text-center border-b bg-sky-950 border-sky-950">Nombre</th>
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
          Crear nuevo role
        </Link>
      </div>
    </>
  );
};

export default Personas;

