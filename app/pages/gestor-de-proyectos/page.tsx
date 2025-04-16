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
import Buttonadd from "@/components/Buttonadd";

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
  const tdClassName = "border-b border-r border-sky-950";
  // Renderiza cada fila
  const renderRow = (proyecto: Proyecto) => {
    return (
      <>
        <td className={tdClassName}>{proyecto.id}</td>
        <td className={tdClassName}>{proyecto.nombre}</td>
        <td className={tdClassName}>{proyecto.estatus}</td>
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
      <Tittle title={"Gestor de Proyectos"}/>
      <Divider />
      <div className="flex justify-between px-6 py-4">
        <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Buttonadd onClick={() => router.push("/register-comuna")} title={"Registrar nuevo proyecto"}></Buttonadd>
      </div>
      <Table
        headers={headers}
        data={filteredData}
        renderRow={renderRow}
        thClassName="text-center border-b border-sky-600"
        tdClassName="text-left border-r border-sky-600"
      />
    </>
  );
};

export default GestorProyectos;
