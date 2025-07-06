"use client";
import React, { useState } from "react";
import Divider from "../../components/Divider";
import { useRouter } from "next/navigation";
import SearchForm from "../../components/SearchForm";
import Loading from "@/components/Loading";
import usePersonas from "@/hooks/usePersonas";
import Tittle from "@/components/Tittle";
import Button from "@/components/Button";
import { Persona } from "@/hooks/interfaces/persona.interface";
import Table from "@/components/Table";
import Modal from "@/components/Modal";
import RegisterPersonaForm from "@/components/RegisterPersonaForm";

const Personas: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data: personasData, isLoading } = usePersonas();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtra datos según el término de búsqueda
  const filteredData = personasData
    ? personasData.filter((persona) =>
        Object.values(persona)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : [];

const headers = ["Nombres", "Apellidos", "C.I", "Teléfono", "Consejo Comunal", "Vehículo Asignado"
];

  const tdClassName = "border-b border-r py-2 border-sky-950";

const renderRow = (persona: Persona) => (
  <>
    <td className={tdClassName}>{persona.nombres}</td>
    <td className={tdClassName}>{persona.apellidos}</td>
    <td className={tdClassName}>{persona.ci || "—"}</td>
    <td className={tdClassName}>{persona.telefono}</td>
    <td className={tdClassName}>
      {persona.cc?.cc || "No asignado"}
    </td>
    <td className={tdClassName}>
      {persona.vehiculo?.placa || "No asignado"}
    </td>
  </>
);

  return (
    <>
      <Tittle title={"Personas"} />
      <Divider />
      <div className="animate-fade-in opacity-0 flex justify-between px-6 py-4">
        <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Button
          onClick={() => setIsModalOpen(true)}
          title={"Registrar una nueva persona"}
        />
      </div>
      <div className="flex flex-col items-center mt-5">
        <Table
          headers={headers}
          data={filteredData}
          renderRow={renderRow}
          thClassName="text-center border-b py-2 border-sky-600"
          tdClassName="text-left border-r border-sky-600"
        />
      </div>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Persona">
        <RegisterPersonaForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
};

export default Personas;