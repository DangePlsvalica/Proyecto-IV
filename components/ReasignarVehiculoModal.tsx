"use client";
import { useState } from "react";
import Modal from "@/components/Modal";
import { useUpdateVehiculo } from "@/hooks/useVehiculos";
import useConsejos from "@/hooks/useConsejos";
import usePersonas from "@/hooks/usePersonas"; 
import Select from "react-select";
import { Vehiculo } from "@/hooks/interfaces/vehiculo.interface";
import Button from "@/components/Button";

type OptionType = { value: string | number; label: string };

type Props = {
  open: boolean;
  onClose: () => void;
  vehiculo: Vehiculo;
};

const ReasignarVehiculoModal = ({ open, onClose, vehiculo }: Props) => {
  const updateMutation = useUpdateVehiculo();

  const { data: consejosData = [], isLoading: loadingConsejos } = useConsejos();
  const { data: personasData = [], isLoading: loadingPersonas } = usePersonas();

  const consejosOptions: OptionType[] = consejosData.map((c) => ({
    value: c.cc,
    label: c.cc,
  }));

  const personasOptions: OptionType[] = personasData
    .filter((p) => p.id !== undefined)
    .map((p) => ({
        value: p.id!,
        label: `${p.nombres} ${p.apellidos}`,
    }));

  const [nuevoCC, setNuevoCC] = useState<OptionType | null>(
    consejosOptions.find((c) => c.value === vehiculo.cc) || null
  );
  const [nuevoVocero, setNuevoVocero] = useState<OptionType | null>(
    personasOptions.find((p) => p.value === vehiculo.voceroAsignado?.id) || null
  );

  const handleSubmit = () => {
    if (!nuevoCC || !nuevoVocero) return;

    updateMutation.mutate({
      id: vehiculo.id,
      cc: String(nuevoCC.value),
      voceroAsignadoId: Number(nuevoVocero.value),
    });

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Reasignar Vehículo">
      <div className="space-y-6 p-4">
        <div >
          <label className="block mb-1 text-sky-950 text-sm font-medium">Consejo Comunal</label>
          <Select
            options={consejosOptions}
            value={nuevoCC}
            onChange={(opt) => setNuevoCC(opt)}
            placeholder={
              loadingConsejos ? "Cargando consejos..." : "Selecciona un Consejo Comunal"
            }
            isDisabled={loadingConsejos}
            styles={{
              control: (base) => ({ ...base, borderColor: "#000", borderRadius: 6 }),
              menu: (base) => ({ ...base, borderRadius: 6 }),
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
            menuPortalTarget={document.body} 
          />
        </div>
        <div>
          <label className="block mb-1 text-sky-950 text-sm font-medium">Persona Responsable</label>
          <Select
            options={personasOptions}
            value={nuevoVocero}
            onChange={(opt) => setNuevoVocero(opt)}
            placeholder={
              loadingPersonas ? "Cargando personas..." : "Selecciona una persona"
            }
            isDisabled={loadingPersonas}
            styles={{
              control: (base) => ({ ...base, borderColor: "#000", borderRadius: 6 }),
              menu: (base) => ({ ...base, borderRadius: 6 }),
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
            menuPortalTarget={document.body} 
          />
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
          <Button 
            onClick={handleSubmit} 
            disabled={updateMutation.isPending}
            title={updateMutation.isPending ? "Guardando..." : "Guardar cambios"} 
          />
        </div>
      </div>
    </Modal>
  );
};

export default ReasignarVehiculoModal;
