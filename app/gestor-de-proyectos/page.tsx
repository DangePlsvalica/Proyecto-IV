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
import Tittle from '@/components/Tittle'
import exportToPDF from "@/utils/exportToPdf";

const GestorProyectos: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [consultaFilter, setConsultaFilter] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<Proyecto[]>([]);

  const { data: proyectosData, isLoading } = useProyectos();

  // Filtro por búsqueda y por consulta
  const filteredData = proyectosData
    ? proyectosData.filter((proyecto) => {
        const matchesSearch = Object.values(proyecto)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        const matchesConsulta =
          consultaFilter === null || proyecto.consulta === consultaFilter;

        return matchesSearch && matchesConsulta;
      })
    : [];

  const headers = [
    "Estado",
    "Municipio",
    "Parroquia",
    "Consulta",
    "Nombre del Proyecto",
    "Código del Proyecto",
    "Estatus",
    "Comuna",
    "Código Situr de la comuna",
    "Categoría",
    "Consejo Comunal",
  ];

  const tdClassName = "border-b border-r py-2 border-sky-950";

  const renderRow = (proyecto: Proyecto) => (
    <>
      <td className={tdClassName}>{proyecto.consejoComunal?.parroquiaRelation?.estado}</td>
      <td className={tdClassName}>{proyecto.consejoComunal?.parroquiaRelation?.municipio}</td>
      <td className={tdClassName}>{proyecto.consejoComunal?.parroquiaRelation?.nombre}</td>
      <td className={tdClassName}>{proyecto.consulta}</td>
      <td className={tdClassName}>{proyecto.nombreProyecto}</td>
      <td className={tdClassName}>{proyecto.codigoProyecto}</td>
      <td className={tdClassName}>{proyecto.estatusProyecto}</td>
      <td className={tdClassName}>{proyecto.circuito}</td>
      <td className={tdClassName}>{proyecto.consejoComunal?.comuna?.codigo}</td>
      <td className={tdClassName}>{proyecto.categoria}</td>
      <td className={tdClassName}>{proyecto.consejoComunal?.cc}</td>
    </>
  );

  // Exportación a PDF
  const handleExportPDF = () => {
    const exportData = selectedRows.length > 0 ? selectedRows : filteredData;

    const formattedData = exportData.map((proyecto) => [
      proyecto.consejoComunal?.parroquiaRelation?.estado || "",
      proyecto.consejoComunal?.parroquiaRelation?.municipio || "",
      proyecto.consejoComunal?.parroquiaRelation?.nombre || "",
      proyecto.consulta || "",
      proyecto.nombreProyecto || "",
      proyecto.codigoProyecto || "",
      proyecto.estatusProyecto || "",
      proyecto.circuito || "",
      proyecto.consejoComunal?.comuna?.codigo || "",
      proyecto.categoria || "",
      proyecto.consejoComunal?.cc || "",
    ]);

    exportToPDF({
      headers,
      data: formattedData,
      filename: "proyectos.pdf",
      title: "Listado de Proyectos",
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Tittle title={"Proyectos"} />
      <Divider />
      <div className="animate-fade-in opacity-0 flex justify-between px-6 py-4">
        <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex gap-4">
          <Button
            onClick={handleExportPDF}
            title="Exportar a PDF"
            disabled={filteredData.length === 0}
          />
          <Button
            onClick={handleExportPDF}
            title="Exportar a Excel"
            disabled={true}
          />
          <Button
            onClick={() => router.push("/gestor-de-proyectos/register-proyecto")}
            title={"Registrar nuevo proyecto"}
          />
        </div>
      </div>
      <div className="px-6 pb-4 flex gap-4">
        {["Primera", "Segunda", "Tercera", "Cuarta", "Quinta"].map((nombre, index) => {
          const num = index + 1;
          return (
            <Button
              key={num}
              className={`text-gray-950  hover:bg-sky-950 ${
                consultaFilter === num ? "bg-slate-800 text-slate-100" : ""
              }`}
              onClick={() => setConsultaFilter(consultaFilter === num ? null : num)}
              title={`${nombre} Consulta`}
            />
          );
        })}
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
    </>
  );
};

export default GestorProyectos;
