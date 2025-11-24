"use client";
import React, { useState } from "react";
import Divider from "../../components/Divider";
import { useRouter } from "next/navigation";
import SearchForm from "../../components/SearchForm";
import Table from "../../components/Table";
import Button from "@/components/Button";
import useProyectos from "@/hooks/useProyectos";
import { Proyecto } from "@/hooks/interfaces/proyecto.interface";
import Loading from "@/components/Loading";
import Tittle from '@/components/Tittle';
import exportToPDF from "@/utils/exportToPdf";
import exportToExcel from "@/utils/exportToExcel";
import Modal from "@/components/Modal";
import RegisterConsultaForm from "@/components/RegisterConsultaForm";
import useConsultas from "@/hooks/useConsultas";
import { useQueryClient } from "@tanstack/react-query";

const GestorProyectos: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [consultaFilter, setConsultaFilter] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Proyecto[]>([]);
  const [isConsultaModalOpen, setIsConsultaModalOpen] = useState(false);

  const { data: proyectosData, isLoading } = useProyectos();
  const { data: consultasData } = useConsultas();

  const handleConsultaSuccess = () => {
    setIsConsultaModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["consultas"] });
  };

  const filteredData = proyectosData
    ? proyectosData.filter((proyecto) => {
        const matchesSearch = Object.values(proyecto)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        const matchesConsulta =
          consultaFilter === null || proyecto.consultaId === consultaFilter;

        return matchesSearch && matchesConsulta;
      })
    : [];

  const headers = [
    "Municipio",
    "Parroquia",
    "Consejo Comunal",
    "Comuna",
    "Consulta",
    "Nombre del Proyecto",
    "Código del Proyecto",
    "Estatus",
    "Categoría",
  ];

  const tdClassName = "border-b border-r py-2 border-sky-950";

  const renderRow = (proyecto: Proyecto) => (
    <>
      <td className={tdClassName}>{proyecto.consejoComunal?.parroquiaRelation?.municipio}</td>
      <td className={tdClassName}>{proyecto.consejoComunal?.parroquiaRelation?.nombre}</td>
      <td className={tdClassName}>{proyecto.consejoComunal?.cc}</td>
      <td className={tdClassName}>{proyecto.consejoComunal?.comuna?.nombre}</td>
      <td className={tdClassName}>{proyecto.consulta?.nombre}</td>
      <td className={tdClassName}>{proyecto.nombreProyecto}</td>
      <td className={tdClassName}>{proyecto.codigoProyecto}</td>
      <td className={tdClassName}>{proyecto.estatusProyecto}</td>     
      <td className={tdClassName}>{proyecto.categoria?.nombre}</td>
    </>
  );

  const formatProyectoDataForExport = (data: Proyecto[]) => {
    return data.map((proyecto) => [
      proyecto.consejoComunal?.parroquiaRelation?.municipio || "",
      proyecto.consejoComunal?.parroquiaRelation?.nombre || "",
      proyecto.consejoComunal?.cc || "",
      proyecto.consejoComunal?.comuna?.nombre || "",
      proyecto.consulta?.nombre || "",
      proyecto.nombreProyecto || "",
      proyecto.codigoProyecto || "",
      proyecto.estatusProyecto || "",
      proyecto.categoria?.nombre || "",
    ]);
  };

  const handleExportPDF = () => {
    const exportData = selectedRows.length > 0 ? selectedRows : filteredData;
    const formattedData = formatProyectoDataForExport(exportData);

    exportToPDF({
      headers,
      data: formattedData,
      filename: "proyectos.pdf",
      title: "Listado de Proyectos",
    });
  };

  const handleExportExcel = () => {
    const exportData = selectedRows.length > 0 ? selectedRows : filteredData;
    const formattedData = formatProyectoDataForExport(exportData);

    exportToExcel({
      headers,
      data: formattedData,
      filename: "proyectos.xlsx",
      sheetName: "Proyectos",
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Tittle title={"Proyectos"} />
      <Divider />
      <div className="animate-fade-in opacity-0 flex justify-between px-4 py-4">
        <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex gap-2">
          <Button
            onClick={handleExportPDF}
            title="Exportar a PDF"
            disabled={selectedRows.length === 0}
            className="px-0"
          />
          <Button
            onClick={handleExportExcel}
            title="Exportar a Excel"
            disabled={selectedRows.length === 0}
            className="px-0"
          />
          <Button
            onClick={() => setIsConsultaModalOpen(true)}
            title={"Crear consulta"}
            className="px-0"
          />
          <Button
            onClick={() => router.push("/gestor-de-proyectos/register-proyecto")}
            title={"Registrar proyecto"}
            className="px-0"
          />
        </div>
      </div>
      <div className="px-6 pb-4 flex gap-4">
        {consultasData?.map((consulta) => (
          <Button
            key={consulta.id}
            className={`text-gray-950 hover:bg-sky-950 ${
              consultaFilter === consulta.id ? "bg-slate-800 text-slate-100" : ""
            }`}
            onClick={() => setConsultaFilter(consultaFilter === consulta.id ? null : consulta.id)}
            title={consulta.nombre}
          />
        ))}
      </div>
      <Table
        headers={headers}
        data={filteredData}
        renderRow={renderRow}
        thClassName="text-center border-b border-sky-600"
        tdClassName="text-left border-r border-sky-600"
        onSelectionChange={(rows) => setSelectedRows(rows)}
        onRowClick={(proyecto) => router.push(`/gestor-de-proyectos/${proyecto.id}`)}
      />
      <Modal
        open={isConsultaModalOpen}
        onClose={() => setIsConsultaModalOpen(false)}
        title="Registrar nueva Consulta"
      >
        <RegisterConsultaForm onSuccess={handleConsultaSuccess} />
      </Modal>
    </>
  );
};

export default GestorProyectos;
