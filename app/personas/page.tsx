"use client";
import React, { useState } from "react";
import Divider from "../../components/Divider";
import { useRouter } from "next/navigation";
import SearchForm from "../../components/SearchForm";
import Loading from "@/components/Loading";
import usePersonas from "@/hooks/usePersonas";
import Tittle from '@/components/Tittle'
import Button from "@/components/Button";
import { Persona } from "@/hooks/interfaces/persona.interface";
import Table from "@/components/Table";

const Personas: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data: personasData, isLoading } = usePersonas();

    // Filtra datos según el término de búsqueda
  const filteredData = personasData
    ? personasData.filter((persona) =>
      Object.values(persona)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    : [];

  const juridicas = filteredData.filter(persona => persona.juridica === true);
  const noJuridicas = filteredData.filter(persona => persona.juridica === false);

  const headers1 = [
    "Nombres",
    "Apellidos",
    "Rif",
    "Nro de telefono",
  ];

  const headers2 = [
    "Nombres",
    "Apellidos",
    "C.I",
    "Nro de telefono",
  ];

  const tdClassName = "border-b border-r py-2 border-sky-950";
  const renderRow1 = (persona: Persona) => {
    return (
      <>
        <td className={tdClassName}>{persona.nombres}</td>
        <td className={tdClassName}>{persona.apellidos}</td>
        <td className={tdClassName}>{persona.rif}</td>
        <td className={tdClassName}>{persona.telefono}</td>
      </>
    );
  };
    const renderRow2 = (persona: Persona) => {
    return (
      <>
        <td className={tdClassName}>{persona.nombres}</td>
        <td className={tdClassName}>{persona.apellidos}</td>
        <td className={tdClassName}>{persona.ci}</td>
        <td className={tdClassName}>{persona.telefono}</td>
      </>
    );
  };

  return (
    <>
      <Tittle title={"Personas"} />
      <Divider />
      <div className="animate-fade-in opacity-0 flex justify-between px-6 py-4">
        <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Button
            onClick={() =>
              router.push("/personas/register-persona")
            }
            title={"Registrar una nueva persona"}
          />
      </div>
      <div className="flex flex-col items-center">
        <Tittle title={"Juridicas"} />
        <Table
          headers={headers1}
          data={juridicas}
          renderRow={renderRow1}
          thClassName="text-center border-b py-2 border-sky-600"
          tdClassName="text-left border-r border-sky-600"
        />
      </div>
      <div className="flex flex-col items-center mt-5">
        <Tittle title={"No Juridicas"} />
        <Table
          headers={headers2}
          data={noJuridicas}
          renderRow={renderRow2}
          thClassName="text-center border-b py-2 border-sky-600"
          tdClassName="text-left border-r border-sky-600"
        />
      </div>
    </>
  );
};

export default Personas;

