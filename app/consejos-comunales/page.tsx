"use client";
import React, { useState } from "react";
import Divider from "../../components/Divider";
import Table from "../../components/Table";
import SearchForm from "../../components/SearchForm";
import useConsejos from "@/hooks/useConsejos";
import { ConsejoComunal } from "@/hooks/interfaces/consejo.comunal.interface";
import Loading from "@/components/Loading";
import Tittle from '@/components/Tittle'
import { useRouter } from "next/navigation";
import exportToPDF from "@/utils/exportToPdf";
import Button from "@/components/Button";

const ConsejosComunales: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<ConsejoComunal[]>([]);
  const { data: consejosData, isLoading } = useConsejos();

  // Filtra datos según el término de búsqueda
  const filteredData = consejosData
    ? consejosData.filter((consejo) =>
      Object.values(consejo)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    : [];

  const headers = [
    "Municipio",
    "Parrroquia",
    "Nombre",
    "RIF",
    "Nro de cuenta",
    "Fecha de constitucion",
    "Fecha de vencimiento",
    "Vocero",
    "Telefono del vocero",
    "Poblacion votante",
    "Comuna",
  ];
  const tdClassName = "border-b border-r py-2 border-sky-950";
  // Función para renderizar cada fila
  const renderRow = (consejo: ConsejoComunal) => (
    <>
      <td className={tdClassName}>{consejo.parroquiaRelation?.municipio || "—"}</td>
      <td className={tdClassName}>{consejo.parroquiaRelation?.nombre || "—"}</td>
      <td className={tdClassName}>{consejo.cc}</td>
      <td className={tdClassName}>{consejo.rif}</td>
      <td className={tdClassName}>{consejo.numeroCuenta}</td>
      <td className={tdClassName}>
        {new Date(consejo.fechaConstitucion).toLocaleDateString()}
      </td>
      <td className={tdClassName}>
        {new Date(consejo.fechaVencimiento).toLocaleDateString()}
      </td>
      <td className={tdClassName}>
        {consejo.vocero ? `${consejo.vocero.nombres} ${consejo.vocero.apellidos}` : "—"}
      </td>
      <td className={tdClassName}>{consejo.vocero?.telefono || "—"}</td>
      <td className={tdClassName}>{consejo.poblacionVotante}</td>
      <td className={tdClassName}>{consejo.comuna?.nombre || "—"}</td>
    </>
  );

    const handleExportPDF = () => {
    const exportData = selectedRows.length > 0 ? selectedRows : filteredData;
    const formattedData = exportData.map((consejo) => [
      consejo.parroquiaRelation?.estado || "",
      consejo.parroquiaRelation?.municipio || "",
      consejo.parroquiaRelation?.nombre || "",
      consejo.cc || "",
      consejo.rif || "",
      consejo.numeroCuenta || "",
      consejo.fechaConstitucion ? new Date(consejo.fechaConstitucion).toLocaleDateString() : "",
      consejo.fechaVencimiento ? new Date(consejo.fechaVencimiento).toLocaleDateString() : "",  
      consejo.vocero? `${consejo.vocero.nombres} ${consejo.vocero.apellidos}`: "",
      consejo.vocero?.telefono || "",
      consejo.poblacionVotante || "",
      consejo.comuna?.nombre || "",
    ]);

    exportToPDF({
      headers,
      data: formattedData,
      filename: "consejos.pdf",
      title: "Listado de Consejos comunales",
    });
  };

  if (isLoading) {
    return (<Loading />);
  }

  return (
    <>
      <Tittle title={"Consejos Comunales"} />
      <Divider />
      <div className="animate-fade-in opacity-0 flex justify-between px-6 py-4">
        <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex gap-4">
          <Button
            onClick={handleExportPDF}
            title="Exportar a PDF"
            disabled={selectedRows.length === 0}
          />
            <Button
              onClick={() => router.push("/consejos-comunales/register-consejo")}
              title="Registrar nuevo consejo comunal"
            />
        </div>
      </div>
      <Table
        headers={headers}
        data={filteredData}
        renderRow={renderRow}
        thClassName="text-center border-b border-sky-600"
        tdClassName="text-left border-r border-sky-600"
        onSelectionChange={(rows) => setSelectedRows(rows)}
        onRowClick={(consejo) => router.push(`/consejos-comunales/${consejo.id}`)}
      />
    </>
  );
};

export default ConsejosComunales;
