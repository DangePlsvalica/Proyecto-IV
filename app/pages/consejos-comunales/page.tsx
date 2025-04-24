"use client";
import React, { useState } from "react";
import Divider from "../../../components/Divider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Table from "../../../components/Table";
import SearchForm from "../../../components/SearchForm";
import useConsejos from "@/hooks/useConsejos";
import { ConsejoComunal } from "@/hooks/interfaces/consejo.comunal.interface";
import Loading from "@/components/Loading";
import Tittle from '@/components/Tittle'

const ConsejosComunales: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Usamos el hook para obtener proyectos
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
    "Estado",
    "Municipio",
    "Parrroquia",
    "CC",
    "RIF",
    "Nro de cuenta",
    "Fecha de constitucion",
    "Fecha de vencimiento",
    "Vocero",
    "Telefono del vocero",
    "Poblacion votante",
  ];
  const tdClassName = "border-b border-r py-2 border-sky-950";
  // Función para renderizar cada fila
  const renderRow = (consejo: ConsejoComunal) => (
    <>
      <td className={tdClassName}>{consejo.estado}</td>
      <td className={tdClassName}>{consejo.municipio}</td>
      <td className={tdClassName}>{consejo.parroquia}</td>
      <td className={tdClassName}>{consejo.cc}</td>
      <td className={tdClassName}>{consejo.rif}</td>
      <td className={tdClassName}>{consejo.numeroCuenta}</td>
      <td className={tdClassName}>
        {new Date(consejo.fechaConstitucion).toLocaleDateString()}
      </td>
      <td className={tdClassName}>
        {new Date(consejo.fechaVencimiento).toLocaleDateString()}
      </td>
      <td className={tdClassName}>{consejo.vocero}</td>
      <td className={tdClassName}>{consejo.tlfVocero}</td>
      <td className={tdClassName}>{consejo.poblacionVotante}</td>
    </>
  );

  if (status === "loading") {
    return (<Loading />);
  }
  if (!session) {
    router.push("/pages/login");
    return null;
  }
  if (isLoading) {
    return (<Loading />);
  }

  return (
    <>
      <Tittle title={"Consejos Comunales"} />
      <Divider />
      <div className="animate-fade-in opacity-0 flex justify-between px-6 py-4">
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
