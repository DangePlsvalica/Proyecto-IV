"use client"; 
import React, { useState, useEffect } from "react";
import Divider from "../../../components/Divider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SearchForm from "../../../components/SearchForm";
import Table from "../../../components/Table";
import Button from "@/components/Button";

interface Vehiculo {
  id: number;
  placa: string;
  clase: string;
  cc: string;
  comuna: string;
  marca: string;
  modelo: string;
  color: string;
  ano: number;
  municipio: string;
  serialCarroceria: string;
  voceroAsignado: string;
  fechaDeEntrega: Date;
  estatus: string;
  observacionArchivo: string;
  observacion: string;
}

const Vehiculos: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

 // Estado para almacenar datos
 const [vehiculosData, setVehiculosData] = useState<Vehiculo[]>([]);
 const [searchTerm, setSearchTerm] = useState<string>("");

 // Hook para obtener datos desde la API
 useEffect(() => {
   const fetchVehiculos = async () => {
     try {
       const response = await fetch("/api/vehiculos", { method: "GET" });
       const data: Vehiculo[] = await response.json();
       setVehiculosData(data);
     } catch (error) {
       console.error("Error fetching vehiculos:", error);
     }
   };
   fetchVehiculos();
 }, []);

 // Filtra datos según el término de búsqueda
 const filteredData = vehiculosData.filter((vehiculo) =>
   Object.values(vehiculo)
     .join(" ")
     .toLowerCase()
     .includes(searchTerm.toLowerCase())
 );

 // Encabezados de la tabla
 const headers = [
   "Placa",
   "Clase",
   "Consejo Comunal",
   "Comuna",
   "Marca",
   "Modelo",
   "Color",
   "Anio",
   "Municipio",
   "Serial de la Carroceria",
   "Vocero Asignado",
   "Fecha de Entrega",
   "Estatus",
 ];
const tdClassName = "border-b border-r border-sky-950";
 // Renderiza cada fila
 const renderRow = (vehiculo: Vehiculo) => {
   return (
     <>
       <td className={tdClassName}>{vehiculo.placa}</td>
       <td className={tdClassName}>{vehiculo.clase}</td>
       <td className={tdClassName}>{vehiculo.cc}</td>
       <td className={tdClassName}>{vehiculo.comuna}</td>
       <td className={tdClassName}>{vehiculo.marca}</td>
       <td className={tdClassName}>{vehiculo.modelo}</td>
       <td className={tdClassName}>{vehiculo.color}</td>
       <td className={tdClassName}>{vehiculo.ano}</td>
       <td className={tdClassName}>{vehiculo.municipio}</td>
       <td className={tdClassName}>{vehiculo.serialCarroceria}</td>
       <td className={tdClassName}>{vehiculo.voceroAsignado}</td>
       <td className={tdClassName}>
         {new Date(vehiculo.fechaDeEntrega).toLocaleDateString()}
       </td>
       <td className={tdClassName}>{vehiculo.estatus}</td>
     </>
   );
 };
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
       <h1 className="text-xl max-[500px]:text-xl">Vehiculos</h1>
     </div>
     <Divider />
     <div className="flex justify-between px-6 py-4">
       <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
       <Button onClick={() => router.push("/register-comuna")} title={"Registrar nuevo vehiculo"}></Button>
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

export default Vehiculos;
