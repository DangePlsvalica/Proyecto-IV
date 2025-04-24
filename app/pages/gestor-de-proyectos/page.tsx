"use client";
import React, { useState } from "react";
import Divider from "../../../components/Divider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SearchForm from "../../../components/SearchForm";
import Table from "../../../components/Table";
import Button from "@/components/Button";
import useProyectos from "@/hooks/useProyectos";
import { Proyecto } from "@/hooks/interfaces/proyecto.interface";
import Loading from "@/components/Loading";
import Tittle from '@/components/Tittle'

const GestorProyectos: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Usamos el hook para obtener proyectos
  const { data: proyectosData, isLoading } = useProyectos();

  // Filtra datos según el término de búsqueda
  const filteredData = proyectosData
    ? proyectosData.filter((proyecto) =>
      Object.values(proyecto)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    : [];

  const headers = [
    "Id",
    "Nombre",
    "Estado",
    "Fecha de Creacion",
    "Ultima Actividad",
    "Categoria",
    "Comuna",
  ];
  const tdClassName = "border-b border-r py-2 border-sky-950";
  // Renderiza cada fila
  const renderRow = (proyecto: Proyecto) => {
    return (
      <>
        <td className={tdClassName}>{proyecto.id}</td>
        <td className={tdClassName}>{proyecto.nombre}</td>
        <td className={tdClassName}>{proyecto.status}</td>
        <td className={tdClassName}>
          {new Date(proyecto.fechaCreacion).toLocaleDateString()}
        </td>
        <td className={tdClassName}>
          {new Date(proyecto.ultimaActividad).toLocaleDateString()}
        </td>
        <td className={tdClassName}>{proyecto.comuna}</td>
        <td className={tdClassName}>{proyecto.categoria}</td>
      </>
    );
  };

  if (status === "loading") {
    return ( <Loading /> );
  }
  if (!session) {
    router.push("/pages/login");
    return null;
  }
  if (isLoading) {
    return ( <Loading /> );
  }

  return (
    <>
      <Tittle title={"Proyectos"}/>
      <Divider />
      <div className="animate-fade-in opacity-0 flex justify-between px-6 py-4">
        <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {session.user.role === "Admin" && (
          <Button
            onClick={() =>
              router.push("/pages/gestor-de-proyectos/register-proyecto")
            }
            title={"Registrar nuevo proyecto"}
          />)}
      </div>
      <Table
        headers={headers}
        data={filteredData}
        renderRow={renderRow}
        thClassName="text-center border-b py-2 border-sky-600"
        tdClassName="text-left border-r border-sky-600"
      />
    </>
  );
};

export default GestorProyectos;
