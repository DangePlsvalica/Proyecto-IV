"use client";
import React, { useState } from "react";
import Divider from "../../components/Divider";
import SearchForm from "../../components/SearchForm";
import Loading from "@/components/Loading";
import usePersonas from "@/hooks/usePersonas";
import Tittle from "@/components/Tittle";
import Button from "@/components/Button";
import DeleteButton from "@/components/DeleteButton";
import { Persona } from "@/hooks/interfaces/persona.interface";
import Table from "@/components/Table";
import Modal from "@/components/Modal";
import RegisterPersonaForm from "@/components/RegisterPersonaForm";

const Personas: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const { data: personasData, isLoading } = usePersonas();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading) {
        return <Loading />;
    }
console.log(personasData)
    const filteredData = personasData
      ? personasData.filter((persona) => {
            const searchableText = `${persona.nombres} ${persona.apellidos} ${persona.ci} ${persona.telefono}`.toLowerCase();
            return searchableText.includes(searchTerm.toLowerCase());
        })
      : [];

    const headers = [
        "Nombres",
        "Apellidos",
        "C.I",
        "Teléfono",
        "Consejo Comunal",
        "Rol / Vocería",
        "Vehículo Asignado",
    ];

    const tdClassName = "border-b border-r py-2 border-sky-950";

    const getConsejoComunalNombre = (persona: Persona): string => {
      
      const ccAssignments = [
          ...persona.consejoTitularFinanzas,
          ...persona.consejoSuplenteFinanzas,
          ...persona.consejoTitularContraloria,
          ...persona.consejoSuplenteContraloria,
          ...persona.consejoTitularComisionElectoral,
          ...persona.consejoSuplenteComisionElectoral,
      ].filter(Boolean); 
      
      if (ccAssignments.length > 0) {
          return ccAssignments[0].cc; 
      }

      return "No asignado";
  };

    const getVoceriaRol = (persona: Persona): string => {
        const roles: string[] = [];

        if (persona.consejoTitularFinanzas?.length) roles.push("Titular Unidad Administrativa y Financiera Comunitaria ");
        if (persona.consejoSuplenteFinanzas?.length) roles.push("Suplente Unidad Administrativa y Financiera Comunitaria");
        
        if (persona.consejoTitularContraloria?.length) roles.push("Titular Unidad de Contraloría Social");
        if (persona.consejoSuplenteContraloria?.length) roles.push("Suplente Unidad de Contraloría Social");
        
        if (persona.consejoTitularComisionElectoral?.length) roles.push("Titular Comisión Electoral");
        if (persona.consejoSuplenteComisionElectoral?.length) roles.push("Suplente Comisión Electoral");

        if (persona.voceriaTitular) roles.push("Titular en Unidad Ejecutiva ");
        if (persona.voceriaSuplente) roles.push("Suplente en Unidad Ejecutiva");

        return roles.length > 0 ? roles.join(', ') : "Ninguno";
    };

    // --- Función para Renderizar la Fila ---
    const renderRow = (persona: Persona) => (
        <>
            <td className={tdClassName}>{persona.nombres}</td>
            <td className={tdClassName}>{persona.apellidos}</td>
            <td className={tdClassName}>{persona.ci || "—"}</td>
            <td className={tdClassName}>{persona.telefono}</td>
            
            {/* Columna de Consejo Comunal (Nombre del CC) */}
            <td className={tdClassName}>
                {getConsejoComunalNombre(persona)}
            </td>
            
            {/* Columna de Rol CC / Vocería (Detalle del Rol) */}
            <td className="border-b border-r max-w-[240px] px-2 py-2 border-sky-950">
                {getVoceriaRol(persona)}
            </td>
            
            {/* Columna de Vehículo Asignado */}
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
                <div className="flex gap-2">
                  <DeleteButton 
                    onClick={()=>{}}
                    isPending={false}
                  />
                  <Button
                      onClick={() => setIsModalOpen(true)}
                      title={"Registrar una nueva persona"}
                  />
                </div>
            </div>
            <div className="flex flex-col items-center ">
                <Table
                    headers={headers}
                    data={filteredData}
                    renderRow={renderRow}
                    thClassName="text-center border-b py-2 border-sky-600"
                    tdClassName="text-center border-r border-sky-600"
                />
            </div>
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Persona">
                <RegisterPersonaForm onSuccess={() => setIsModalOpen(false)} />
            </Modal>
        </>
    );
};

export default Personas;