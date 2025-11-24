"use client";
import React, { useState } from "react";
import Divider from "../../components/Divider";
import SearchForm from "../../components/SearchForm";
import Loading from "@/components/Loading";
import usePersonas from "@/hooks/usePersonas";
import Tittle from "@/components/Tittle";
import Button from "@/components/Button";
import DeleteButton from "@/components/DeleteButton"; // Asumo que es el botón de acción roja/peligrosa
import { Persona } from "@/hooks/interfaces/persona.interface";
import Table from "@/components/Table"; 
import Modal from "@/components/Modal";
import RegisterPersonaForm from "@/components/RegisterPersonaForm";
import { toast } from "react-hot-toast";
// Usamos este hook, asumiendo que ya soporta el payload { ids: number[], habilitado: boolean }
import useToggleHabilitado from "@/hooks/useToggleHabilitado"; 
import { useCurrentUser } from "@/hooks/useCurrentUser";

const Personas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data: personasData, isLoading } = usePersonas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAdmin, isLoading: isAuthLoading } = useCurrentUser(); 
  const [showDisabled, setShowDisabled] = useState<boolean>(false);
  const [selectedPersonasIds, setSelectedPersonasIds] = useState<number[]>([]);

  const { mutate: toggleHabilitadoMutate } = useToggleHabilitado({
    onSuccess: () => {
      // Mensaje dinámico según la vista actual
      const action = showDisabled ? "habilitadas" : "deshabilitadas";
      toast.success(`Personas ${action} con éxito.`);
      setSelectedPersonasIds([]); // Limpiar la selección después del éxito
    },
    onError: () => {
      toast.error("Error al actualizar el estado de las personas.");
    }
  });

  if (isLoading) {
    return <Loading />;
  }

  const dataToDisplay = personasData
    ? personasData.filter((persona) => {
        // Si showDisabled es TRUE, muestra SOLO las deshabilitadas (habilitado === false)
        if (showDisabled) {
          return persona.habilitado === false;
        }
        // Si showDisabled es FALSE, muestra SOLO las habilitadas (habilitado !== false)
        return persona.habilitado !== false;
      })
    : [];

  const filteredData = dataToDisplay.filter((persona) => {
    const searchableText = `${persona.nombres} ${persona.apellidos} ${persona.ci} ${persona.telefono}`.toLowerCase();
    return searchableText.includes(searchTerm.toLowerCase());
  });

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

  // Función para manejar la selección de filas de la tabla
  const handleSelectionChange = (selectedItems: Persona[]) => {
    // Extraer solo los IDs del array de objetos Persona
    const ids = selectedItems.map(item => item.id);
    setSelectedPersonasIds(ids);
  };

  // --- Handlers de Mutación ---

  // Handler para Deshabilitar personas (enviar habilitado: false)
  const handleDisableSelected = () => {
    if (selectedPersonasIds.length === 0) {
      toast.error("Selecciona al menos una persona para deshabilitar.");
      return;
    }
    toggleHabilitadoMutate({ ids: selectedPersonasIds, habilitado: false });
  };
  
  // Handler para Habilitar personas (enviar habilitado: true)
  const handleEnableSelected = () => {
    if (selectedPersonasIds.length === 0) {
      toast.error("Selecciona al menos una persona para habilitar.");
      return;
    }
    toggleHabilitadoMutate({ ids: selectedPersonasIds, habilitado: true });
  };


  // --- Funciones auxiliares para la tabla (sin cambios) ---

  const getConsejoComunalNombre = (persona: Persona): string => {
      const ccAssignments = [
          ...persona.consejoTitularFinanzas,
          ...persona.consejoSuplenteFinanzas,
          ...persona.consejoTitularContraloria,
          ...persona.consejoSuplenteContraloria,
          ...persona.consejoTitularComisionElectoral,
          ...persona.consejoSuplenteComisionElectoral,
      ].filter(Boolean);
      return ccAssignments.length > 0 ? ccAssignments[0].cc : "No asignado";
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
  const renderRow = (persona: Persona, className: string) => (
      <>
        <td className={tdClassName}>{persona.nombres}</td>
        <td className={tdClassName}>{persona.apellidos}</td>
        <td className={tdClassName}>{persona.ci || "—"}</td>
        <td className={tdClassName}>{persona.telefono}</td>
        <td className={tdClassName}>
          {getConsejoComunalNombre(persona)}
        </td>
        <td className="border-b border-r max-w-[240px] px-2 py-2 border-sky-950">
          {getVoceriaRol(persona)}
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
        <div className="flex gap-2">
          {isAdmin && (
            <>
              <Button
                onClick={() => {
                  setShowDisabled(prev => !prev);
                  setSelectedPersonasIds([]); // Limpia la selección al cambiar de vista
                }}
                title={showDisabled ? "Mostrar Personas Habilitadas" : "Mostrar Personas Deshabilitadas"}
              />
              
              {showDisabled && (
                <Button
                  onClick={handleEnableSelected}
                  title={`Habilitar (${selectedPersonasIds.length})`}
                  className="bg-green-700"
                />
              )}

              {!showDisabled && (
                <Button
                  onClick={handleDisableSelected}
                  title={`Deshabilitar (${selectedPersonasIds.length})`}
                  className="bg-red-600"
                />
              )}
            </>
          )}

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
          onSelectionChange={handleSelectionChange} // Pasamos el manejador de selección
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