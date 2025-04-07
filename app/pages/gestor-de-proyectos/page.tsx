"use client";
import React, { useState, useEffect } from "react";
import Divider from "../../../components/Divider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SearchForm from "../../../components/SearchForm";
import Table from "../../../components/Table";
import Button from "@/components/Button";

interface Proyecto {
  id: number;
  nombre: string;
  estatus: string;
  fechaCreacion: Date;
  ultimaActividad: Date;
  categoria: string;
  comuna: string;
}

const GestorProyectos: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Estado para almacenar datos
 const [proyectosData, setProyectosData] = useState<Proyecto[]>([]);
 const [searchTerm, setSearchTerm] = useState<string>("");

 // Hook para obtener datos desde la API
 useEffect(() => {
   const fetchProyectos = async () => {
     try {
       const response = await fetch("/api/proyectos", { method: "GET" });
       const data: Proyecto[] = await response.json();
       setProyectosData(data);
     } catch (error) {
       console.error("Error fetching proyectos:", error);
     }
   };
   fetchProyectos();
 }, []);

 // Filtra datos según el término de búsqueda
 const filteredData = proyectosData.filter((proyecto) =>
   Object.values(proyecto)
     .join(" ")
     .toLowerCase()
     .includes(searchTerm.toLowerCase())
 );

 // Encabezados de la tabla
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
 // Manejo de sesión y redirección
 if (status === "loading") {
   return <p>Cargando...</p>;
 }

 if (!session) {
   router.push("/pages/login");
   return null;
 }
 return (
   <>
     <div className="flex flex-col items-start justify-between pl-6 py-3">
       <h1 className="text-xl max-[500px]:text-xl">Gestor de Proyectos</h1>
     </div>
     <Divider />
     <div className="flex justify-between px-6 py-4">
       <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
       <Button onClick={() => router.push("/register-comuna")} title={"Registrar nuevo proyecto"}></Button>
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
