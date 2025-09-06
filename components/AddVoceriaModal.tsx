import React, { useState } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";

interface Voceria {
  id: number;
  nombre: string;
  categoriaId: number;
}

interface AddVoceriaModalProps {
  open: boolean;
  onClose: () => void;
  onAddVoceria: (voceriaIds: number[]) => void;
  voceriasOpcionales: Voceria[];
  voceriasOpcionalesSeleccionadas: number[];
}

const nombresCategorias: Record<number, string> = {
  1: "Economía Productiva",
  2: "Ciudades Humanas y Servicios",
  3: "Seguridad y Paz",
  4: "Suprema Felicidad Social",
  5: "Organización y Planificación Popular",
  6: "Ecosocialismo, Ciencia y Tecnología",
};

const AddVoceriaModal: React.FC<AddVoceriaModalProps> = ({
  open,
  onClose,
  onAddVoceria,
  voceriasOpcionales,
  voceriasOpcionalesSeleccionadas,
}) => {
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);

  // Filtra vocerías no seleccionadas
  const voceriasDisponibles = voceriasOpcionales.filter(
    (v) => !voceriasOpcionalesSeleccionadas.includes(v.id)
  );

  const categorias = Object.keys(nombresCategorias).map(Number);

  const handleCheckboxChange = (id: number) => {
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAgregar = () => {
    onAddVoceria(seleccionadas);
    setSeleccionadas([]);
    onClose();
  };

  // Agrupa vocerías por categoría
  const voceriasPorCategoria: Record<number, Voceria[]> = {};
  categorias.forEach((catId) => {
    voceriasPorCategoria[catId] = voceriasDisponibles.filter(
      (v) => v.categoriaId === catId
    );
  });

  const maxFilas = Math.max(...categorias.map((catId) => voceriasPorCategoria[catId].length));

  return (
    <Modal
      open={open}
      onClose={onClose}
      width="w-[1500px]"
      title="Agregar Vocerías Opcionales"
    >
      <div className="space-y-2 px-4 py-2 max-h-[700px] overflow-y-auto">
        {/* Encabezados */}
        <div className="grid grid-cols-6 gap-4 font-semibold text-center bg-slate-100 p-2 rounded-t-lg border-b">
          {categorias.map((catId) => (
            <div key={catId}>{nombresCategorias[catId]}</div>
          ))}
        </div>

        {/* Filas de vocerías */}
        {Array.from({ length: maxFilas }).map((_, filaIndex) => (
          <div
            key={filaIndex}
            className={`grid grid-cols-6 gap-2 p-2 items-center ${
              filaIndex % 2 === 0 ? "bg-slate-50" : ""
            } hover:bg-gray-100 rounded`}
          >
            {categorias.map((catId) => {
              const voceria = voceriasPorCategoria[catId][filaIndex];
              return (
                <div key={catId} className="flex items-center justify-start space-x-2">
                  {voceria && (
                    <>
                      <input
                        type="checkbox"
                        checked={seleccionadas.includes(voceria.id)}
                        onChange={() => handleCheckboxChange(voceria.id)}
                        className="accent-blue-500"
                      />
                      <span className="text-gray-700">{voceria.nombre}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Botones */}
        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
          <Button onClick={onClose} title="Cerrar" />
          <Button
            onClick={handleAgregar}
            title="Agregar Seleccionadas"
            disabled={seleccionadas.length === 0}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddVoceriaModal;
