"use client";
import React, { useState, useEffect } from "react";
import Divider from "../../../components/Divider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SearchForm from "../../../components/SearchForm";
import Table from "../../../components/Table";
import Buttonadd from "@/components/Buttonadd";
import { Comuna } from "@/hooks/interfaces/comuna.interface";
import useComunas from "@/hooks/useComunas";
import Loading from "@/components/Loading";
import Tittle from '@/components/Tittle'

const Comunas: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data: comunasData, isLoading } = useComunas();

  // Filtra datos según el término de búsqueda
  const filteredData = comunasData
    ? comunasData.filter((comuna) =>
      Object.values(comuna)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    : [];

  const headers = [
    "Codigo",
    "N° comisión promotora",
    "Fecha de comisión promotora",
    "RIF",
    "Cuenta Bancaria",
    "Fecha de Registro de la Comuna",
    "Nombre de la Comuna",
    "Dirección de la Comuna",
    "Lindero Norte",
    "Lindero Sur",
    "Lindero Este",
    "Lindero Oeste",
    "C.C que integra la Comuna",
    "Fecha de Última Elección",
    "Municipio",
    "Parroquia",
    "Nombre y Apellidos del Vocero",
    "C.I",
    "Telefono",
  ];
const tdClassName = "border-b border-r border-sky-950";
  // Renderiza cada fila
  const renderRow = (comuna: Comuna) => {
    let consejosArray: string[] = []; // Inicializa como array vacío

    try {
      // Procesa consejoComunal como array si es válido
      consejosArray = JSON.parse(comuna.consejoComunal);
    } catch (error) {
      console.error("Error parsing consejoComunal:", error);
    }

    return (
      <>
        <td className={tdClassName} onClick={() => router.push("/pages/comunas/view-comuna")}>{comuna.codigo}</td>
        <td className={tdClassName}>{comuna.numComisionPromotora}</td>
        <td className={tdClassName}>
          {new Date(comuna.fechaComisionPromotora).toLocaleDateString()}
        </td>
        <td className={tdClassName}>{comuna.rif}</td>
        <td className={tdClassName}>{comuna.cuentaBancaria}</td>
        <td className={tdClassName}>
          {new Date(comuna.fechaRegistro).toLocaleDateString()}
        </td>
        <td className={tdClassName}>{comuna.nombre}</td>
        <td className={tdClassName}>{comuna.direccion}</td>
        <td className={tdClassName}>{comuna.linderoNorte}</td>
        <td className={tdClassName}>{comuna.linderoSur}</td>
        <td className={tdClassName}>{comuna.linderoEste}</td>
        <td className={tdClassName}>{comuna.linderoOeste}</td>
        <td className={tdClassName}>
          {/* Renderiza cada consejo comunal como lista */}
          <ol className="list-decimal list-inside">
            {consejosArray.map((consejo, index) => (
              <li key={index}>{consejo}</li>
            ))}
          </ol>
        </td>
        <td className={tdClassName}>
          {new Date(comuna.fechaUltimaEleccion).toLocaleDateString()}
        </td>
        <td className={tdClassName}>{comuna.municipio}</td>
        <td className={tdClassName}>{comuna.parroquia}</td>
        <td className={tdClassName}>{comuna.nombreVocero}</td>
        <td className={tdClassName}>{comuna.ciVocero}</td>
        <td className={tdClassName}>{comuna.telefono}</td>
        {/* <td className={tdClassName}>{comuna.cantidadConsejosComunales}</td>
        <td className={tdClassName}>{comuna.poblacionVotante}</td> */}
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
      <Tittle title={"Comunas"}/>
      <Divider />
      <div className="flex justify-between px-6 py-4">
        <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Buttonadd onClick={() => router.push("/pages/comunas/register-comuna")} title={"Registrar nueva comuna"}></Buttonadd>
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

export default Comunas;
