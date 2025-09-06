"use client";
import React, { useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { useRegisterPersona } from "@/hooks/useRegisterPersona";
import toast from "react-hot-toast";
import { PersonaFormData, Persona } from "@/hooks/interfaces/persona.interface";

interface Props {
  onSuccess?: (nuevaPersona: Persona) => void;
}

const RegisterPersonaForm: React.FC<Props> = ({ onSuccess }) => {
  const { mutateAsync: registerPersona, isPending } = useRegisterPersona();
  const [formData, setFormData] = useState<PersonaFormData>({
    nombres: "",
    apellidos: "",
    ci: "",
    telefono: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formData.nombres || !formData.apellidos || !formData.telefono) {
      toast.error("Por favor completa todos los campos requeridos.");
      return;
    }

    try {
      const nuevaPersona = await registerPersona(formData);
      toast.success("Persona registrada con éxito");
      onSuccess?.(nuevaPersona);
    } catch (err) {
      toast.error("Error al registrar la persona.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 px-6 py-4 max-w-[450px]">
      <FormInput label="Nombres" id="nombres" value={formData.nombres} onChange={handleChange} required />
      <FormInput label="Apellidos" id="apellidos" value={formData.apellidos} onChange={handleChange} required />
      <FormInput label="Cédula" id="ci" value={formData.ci ?? ""} onChange={handleChange} required />
      <FormInput label="Nro de Teléfono" id="telefono" value={formData.telefono} onChange={handleChange} required />
      <div className="flex justify-center pt-4">
        <Button onClick={handleSubmit} title={isPending ? "Registrando..." : "Registrar Persona"} />
      </div>
    </form>
  );
};

export default RegisterPersonaForm;
