"use client";
import React, { useState, useEffect } from "react";
import Divider from "../../../components/Divider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SearchForm from "../../../components/SearchForm";
import Table from "../../../components/Table";
import Button from "@/components/Button";
import { Comuna } from "@/hooks/interfaces/comuna.interface";
import useComunas from "@/hooks/useComunas";
import Loading from "@/components/Loading";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Tittle from '@/components/Tittle'
import  exportToPDF from "@/utils/exportToPdf";

const Comunas: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<Comuna[]>([]);
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
const tdClassName = "border-b border-r py-2 border-sky-950";
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

  const handleExportPDF = () => {
    const exportData = selectedRows.length > 0 ? selectedRows : filteredData;
  
    // Aquí transformamos los datos para que queden planos:
    const formattedData = exportData.map((comuna) => [
      comuna.codigo || "",
      comuna.numComisionPromotora || "",
      comuna.fechaComisionPromotora ? new Date(comuna.fechaComisionPromotora).toLocaleDateString() : "",
      comuna.rif || "",
      comuna.cuentaBancaria || "",
      comuna.fechaRegistro ? new Date(comuna.fechaRegistro).toLocaleDateString() : "",
      comuna.nombre || "",
      comuna.direccion || "",
      comuna.linderoNorte || "",
      comuna.linderoSur || "",
      comuna.linderoEste || "",
      comuna.linderoOeste || "",
      // Consejo comunal (array convertido en string separado por comas)
      comuna.consejoComunal ? JSON.parse(comuna.consejoComunal).join(", ") : "",
      comuna.fechaUltimaEleccion ? new Date(comuna.fechaUltimaEleccion).toLocaleDateString() : "",
      comuna.municipio || "",
      comuna.parroquia || "",
      comuna.nombreVocero || "",
      comuna.ciVocero || "",
      comuna.telefono || "",
    ]);

    exportToPDF({
      headers: headers,
      data: formattedData,
      filename: "comunas.pdf",
      title: "Listado de Comunas",
    });
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
      <div className="animate-fade-in opacity-0 flex justify-between px-6 py-4">
        <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex gap-4">
          <Button
            onClick={handleExportPDF}
            title={"Exportar a PDF"}
            disabled={selectedRows.length === 0}
          />
          {session.user.role === "Admin" && (
            <Button
              onClick={() =>
                router.push("/pages/comunas/register-comuna")
              }
              title={"Registrar nueva comuna"}
            />)}
        </div>
      </div>
        <Table
          headers={headers}
          data={filteredData}
          renderRow={renderRow}
          thClassName="text-center border-b border-sky-600"
          tdClassName="text-left border-r border-sky-600"
          onSelectionChange={(rows) => setSelectedRows(rows)}
        />
    </>
  );
};

export default Comunas;
