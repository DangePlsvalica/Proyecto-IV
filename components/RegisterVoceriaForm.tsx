"use client";
import React, { useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import toast from "react-hot-toast";
import { useRegisterVoceria, TipoVoceria, TipoVoceriaFormData } from "@/hooks/useRegisterVoceria";

interface Props {
  onSuccess?: (nuevaVoceria: TipoVoceria) => void;
}

const RegisterVoceriaForm: React.FC<Props> = ({ onSuccess }) => {
  const { mutateAsync: registerVoceria, isPending } = useRegisterVoceria();

  const [formData, setFormData] = useState<TipoVoceriaFormData>({
    nombre: "",
    categoriaId: 1, // por defecto la primera categoría
  });

    const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
        ...prev,
        [name]: name === "categoriaId" ? Number(value) : value,
    }));
    };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formData.nombre || !formData.categoriaId) {
      toast.error("Por favor completa todos los campos requeridos.");
      return;
    }

    try {
      const nuevaVoceria = await registerVoceria(formData);
      toast.success("Vocería registrada con éxito");
      onSuccess?.(nuevaVoceria);
      setFormData({ nombre: "", categoriaId: 1 }); // reset form
    } catch (err) {
      toast.error("Error al registrar la vocería.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 px-6 py-4 max-w-[450px]">
      <FormInput
        label="Nombre del Comité"
        id="nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
      />

      <div className="flex flex-col">
        <label htmlFor="categoriaId" className="text-sm font-medium text-gray-700">
          Categoría
        </label>
        <select
          id="categoriaId"
          name="categoriaId"
          value={formData.categoriaId}
          onChange={handleChange}
          className="border rounded-md p-2 mt-1 text-sm"
        >
          <option value={1}>Economía Productiva</option>
          <option value={2}>Ciudades Humanas y Servicios</option>
          <option value={3}>Seguridad y Paz</option>
          <option value={4}>Suprema Felicidad Social</option>
          <option value={5}>Organización y Planificación Popular</option>
          <option value={6}>Ecosocialismo, Ciencia y Tecnología</option>
        </select>
      </div>

      <div className="flex justify-center pt-4">
        <Button
          onClick={handleSubmit}
          title={isPending ? "Registrando..." : "Registrar Comité"}
        />
      </div>
    </form>
  );
};

export default RegisterVoceriaForm;

