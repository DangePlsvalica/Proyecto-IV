"use client";

import React, { useState, useEffect } from "react";
import Divider from "../../components/Divider";
import { MdOutlineSearch } from "react-icons/md";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Table from "../../components/Table";
import SearchForm from "../../components/SearchForm";

interface ConsejoComunal {
  id: string;
  estado: string;
  municipio: string;
  parroquia: string;
  cc: string; // Nombre del Consejo Comunal
  rif: string;
  numeroCuenta: string;
  fechaConstitucion: string;
  fechaVencimiento: string;
  vocero: string;
  tlfVocero: string;
  poblacionVotante: number;
}

const ConsejosComunales: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Estado para almacenar los datos de la base de datos
  const [consejosData, setConsejosData] = useState<ConsejoComunal[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Hook para obtener los datos desde la API
  useEffect(() => {
    const fetchConsejos = async () => {
      try {
        const response = await fetch("/api/consejos");
        const data: ConsejoComunal[] = await response.json();
        console.log("Datos de consejos:", data);
        setConsejosData(data); // Almacena los datos obtenidos
      } catch (error) {
        console.error("Error fetching consejos comunales:", error);
      }
    };
    fetchConsejos();
  }, []);

  // Filtra los datos según el término de búsqueda
  const filteredData = consejosData.filter(
    (consejo) =>
      Object.values(consejo)
        .join(" ") // Combina todos los valores de un objeto en una cadena
        .toLowerCase() // Convierte todo a minúsculas para comparación insensible a mayúsculas
        .includes(searchTerm.toLowerCase()) // Compara con el término de búsqueda
  );
  const headers = [
    "Estado",
    "MUNICIPIO",
    "PARROQUIA",
    "CC",
    "RIF",
    "Nro DE CUENTA",
    "FECHA DE CONSTITUCIÓN",
    "FECHA DE VENCIMIENTO",
    "VOCERO",
    "TELEFONO DEL VOCERO",
    "POBLACION VOTANTE",
  ];
  const tdClassName = "border-b border-r border-sky-950";
  // Función para renderizar cada fila
  const renderRow = (consejo: ConsejoComunal) => (
    <>
      <td className={tdClassName}>{consejo.estado}</td>
      <td className={tdClassName}>{consejo.municipio}</td>
      <td className={tdClassName}>{consejo.parroquia}</td>
      <td className={tdClassName}>{consejo.cc}</td>
      <td className={tdClassName}>{consejo.rif}</td>
      <td className={tdClassName}>{consejo.numeroCuenta}</td>
      <td className={tdClassName}>{consejo.fechaConstitucion}</td>
      <td className={tdClassName}>{consejo.fechaVencimiento}</td>
      <td className={tdClassName}>{consejo.vocero}</td>
      <td className={tdClassName}>{consejo.tlfVocero}</td>
      <td className={tdClassName}>{consejo.poblacionVotante}</td>
    </>
  );
  // Redirige al login si no hay sesión y la autenticación está cargada
  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  if (!session) {
    router.push("/login"); // Redirige al login si no hay sesión
    return null; // Asegura que la página no se renderice
  }

  return (
    <>
      <div className="flex flex-col items-start justify-between pl-6 py-3">
        <h1 className="text-xl max-[500px]:text-xl">Consejos Comunales</h1>
      </div>
      <Divider />
      <div className="flex justify-between px-6 py-4">
        <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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

export default ConsejosComunales;
