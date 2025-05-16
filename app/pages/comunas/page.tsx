"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Divider from "../../../components/Divider";
import SearchForm from "../../../components/SearchForm";
import Table from "../../../components/Table";
import Button from "@/components/Button";
import Tittle from "@/components/Tittle";
import Loading from "@/components/Loading";

import useComunas from "@/hooks/useComunas";
import { Comuna } from "@/hooks/interfaces/comuna.interface";

import exportToPDF from "@/utils/exportToPdf";

const Comunas: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<Comuna[]>([]);
  
  const { data: comunasData, isLoading } = useComunas();

  const headers = [
    "Código",
    "N° Comisión Promotora",
    "Fecha Comisión Promotora",
    "RIF",
    "Cuenta Bancaria",
    "Fecha Registro Comuna",
    "Nombre Comuna",
    "Dirección Comuna",
    "Lindero Norte",
    "Lindero Sur",
    "Lindero Este",
    "Lindero Oeste",
    "C.C que Integra la Comuna",
    "Fecha Última Elección",
    "Municipio",
    "Parroquia",
    "Nombre y Apellidos Vocero",
    "C.I",
    "Teléfono",
  ];

  const tdClassName = "border-b border-r py-2 border-sky-950";

  const filteredData = comunasData?.filter((comuna) =>
    Object.values(comuna)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  ) || [];

  const renderRow = (comuna: Comuna) => {
    return (
      <>
        <td className={tdClassName} onClick={() => router.push("/pages/comunas/view-comuna")}>{comuna.codigo}</td>
        <td className={tdClassName}>{comuna.numComisionPromotora}</td>
        <td className={tdClassName}>
          {comuna.fechaComisionPromotora && new Date(comuna.fechaComisionPromotora).toLocaleDateString()}
        </td>
        <td className={tdClassName}>{comuna.rif}</td>
        <td className={tdClassName}>{comuna.cuentaBancaria}</td>
        <td className={tdClassName}>
          {comuna.fechaRegistro && new Date(comuna.fechaRegistro).toLocaleDateString()}
        </td>
        <td className={tdClassName}>{comuna.nombre}</td>
        <td className={tdClassName}>{comuna.direccion}</td>
        <td className={tdClassName}>{comuna.linderoNorte}</td>
        <td className={tdClassName}>{comuna.linderoSur}</td>
        <td className={tdClassName}>{comuna.linderoEste}</td>
        <td className={tdClassName}>{comuna.linderoOeste}</td>
        <td className={tdClassName}>
        {/* Generar lista numerada como texto */}
        {comuna.consejosComunales?.map((cc: any, index: number) => (
          <div className="py-1 border-b-2" key={cc.id}>{index + 1}. {cc.cc}</div>
        ))}
      </td>
        <td className={tdClassName}>
          {comuna.fechaUltimaEleccion && new Date(comuna.fechaUltimaEleccion).toLocaleDateString()}
        </td>
        <td className={tdClassName}>{comuna.parroquiaRelation?.municipio}</td>
        <td className={tdClassName}>{comuna.parroquiaRelation?.nombre}</td>
        <td className={tdClassName}>{comuna.nombreVocero}</td>
        <td className={tdClassName}>{comuna.ciVocero}</td>
        <td className={tdClassName}>{comuna.telefono}</td>
      </>
    );
  };

  const handleExportPDF = () => {
    const exportData = selectedRows.length > 0 ? selectedRows : filteredData;

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
      comuna.consejosComunales 
      ? comuna.consejosComunales.map((cc: { cc: any; }, index: number) => `${index + 1}. ${cc.cc}`).join('\n')
      : "",
      comuna.fechaUltimaEleccion ? new Date(comuna.fechaUltimaEleccion).toLocaleDateString() : "",
      comuna.parroquiaRelation?.municipio || "",
      comuna.parroquiaRelation?.nombre || "", 
      comuna.nombreVocero || "",
      comuna.ciVocero || "",
      comuna.telefono || "",
    ]);

    exportToPDF({
      headers,
      data: formattedData,
      filename: "comunas.pdf",
      title: "Listado de Comunas",
    });
  };

  if (status === "loading" || isLoading) {
    return <Loading />;
  }

  if (!session) {
    router.push("/pages/login");
    return null;
  }

  return (
    <>
      <Tittle title="Comunas" />
      <Divider />
      <div className="animate-fade-in max-w-[1670px] opacity-0 flex justify-between px-6 py-4">
        <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex gap-4">
          <Button
            onClick={handleExportPDF}
            title="Exportar a PDF"
            disabled={selectedRows.length === 0}
          />
          {session.user.role === "Admin" && (
            <Button
              onClick={() => router.push("/pages/comunas/register-comuna")}
              title="Registrar nueva comuna"
            />
          )}
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

