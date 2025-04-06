"use client";
import React, { useState } from "react";
import Divider from "../../components/Divider";
import { MdOutlineSearch } from "react-icons/md";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const GestorProyectos = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Array con los datos de los proyectos
  const proyectosData = [
    {
      id: 1,
      nombre: "Agua",
      estado: "NO EMPEZADO",
      creadoEn: "10/03/2025",
      ultimaActividad: "11/03/2025",
      descripcion: "Este es un proyecto de agua",
    },
    {
      id: 2,
      nombre: "Luz",
      estado: "TERMINADO",
      creadoEn: "25/02/2025",
      ultimaActividad: "07/03/2025",
      descripcion: "Este es un proyecto de luz",
    },
    {
      id: 3,
      nombre: "Carretera",
      estado: "NO EMPEZADO",
      creadoEn: "08/01/2025",
      ultimaActividad: "28/02/2025",
      descripcion: "Este es un proyecto de carretera",
    },
    {
      id: 4,
      nombre: "Casas",
      estado: "TERMINADO",
      creadoEn: "15/01/2025",
      ultimaActividad: "03/03/2025",
      descripcion: "Este es un proyecto de casas",
    },
  ];

  // Estado para manejar el texto del buscador
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar los proyectos según el término de búsqueda
  const filteredProyectos = proyectosData.filter(
    (proyecto) =>
      Object.values(proyecto)
        .join(" ") // Convierte los valores del objeto en una sola cadena
        .toLowerCase() // Convierte todo a minúsculas para búsqueda insensible a mayúsculas
        .includes(searchTerm.toLowerCase()) // Compara con el término de búsqueda
  );
  // Redirige al login si no hay sesión y la autenticación está cargada
  if (status === "loading") {
    return <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-12">
              <div className="flex flex-col md:flex-row items-center gap-8 w-24 max-w-6xl mx-auto justify-center">
                    <Image
                      src="/espera.gif"
                      width={100}
                      height={100}
                      alt="espera gif"
                      className="rounded-3xl"
                    />
          </div>
          </main>; // Muestra un indicador de carga mientras se verifica la sesión
  }

  if (!session) {
    router.push("/login"); // Redirige al login si no hay sesión
    return null; // Asegura que la página no se renderice
  }

  // Redirige a "/" si el usuario no es "Admin"
  if (session.user.role !== "Admin") {
    router.push("/"); // Redirige al home si no es admin
    return null; // Asegura que no se renderice la página
  }
  return (
    <>
      <div className="flex flex-col items-start justify-between pl-6 py-3">
        <h1 className="text-xl max-[500px]:text-xl">Proyectos</h1>
      </div>
      <Divider />
      <div className="flex justify-between px-6 py-4">
        <form
          className="flex items-center gap-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <MdOutlineSearch />
          <input
            type="text"
            placeholder="Buscar por nombre de proyecto"
            value={searchTerm} // Vincula el input con el estado
            onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el estado
            className="w-[320px] h-[32px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <button
            type="submit"
            className="border px-3 h-[32px] text-[15px] font-semibold bg-gray-200 text-black rounded-md hover:bg-gray-300 focus:outline-none"
          >
            Buscar
          </button>
        </form>
        <button
          type="button"
          className="border h-[32px] text-[15px] px-3 font-medium bg-green-700 text-white rounded-md hover:bg-green-800 focus:outline-none"
        >
          + Proyecto
        </button>
      </div>
      <div className="px-6">
        <table className="w-full">
          <thead className="text-[14px] text-left border-b">
            <tr>
              <th>ID</th>
              <th>NOMBRE</th>
              <th>ESTADO</th>
              <th>CREADO EN</th>
              <th>ULTIMA ACTIVIDAD EN</th>
              <th>DESCRIPCION</th>
            </tr>
          </thead>
          <tbody className="text-[14px]">
            {filteredProyectos.map((proyecto) => (
              <tr key={proyecto.id} className="border-b">
                <td>{proyecto.id}</td>
                <td>{proyecto.nombre}</td>
                <td>{proyecto.estado}</td>
                <td>{proyecto.creadoEn}</td>
                <td>{proyecto.ultimaActividad}</td>
                <td>{proyecto.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default GestorProyectos;
