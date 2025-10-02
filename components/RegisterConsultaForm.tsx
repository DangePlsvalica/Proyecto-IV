"use client";
import React, { useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import toast from "react-hot-toast";
import { useRegisterConsulta } from "@/hooks/useRegisterConsulta";

interface Props {
  onSuccess?: (nuevaConsulta: { id: string; nombre: string }) => void;
}

const RegisterConsultaForm: React.FC<Props> = ({ onSuccess }) => {
  const { mutateAsync: registerConsulta, isPending } = useRegisterConsulta();

  const [nombre, setNombre] = useState("");

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!nombre) {
      toast.error("Por favor completa el campo de nombre.");
      return;
    }

    try {
      const nuevaConsulta = await registerConsulta({ nombre });
      toast.success("Consulta registrada con éxito");
      onSuccess?.(nuevaConsulta);
      setNombre(""); // Limpiar el formulario
    } catch (err) {
      toast.error("Error al registrar la consulta.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 px-6 py-4 max-w-[450px]">
      <FormInput
        label="Nombre de la Consulta"
        id="nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <div className="flex justify-center pt-4">
        <Button
          onClick={handleSubmit}
          title={isPending ? "Registrando..." : "Registrar Consulta"}
        />
      </div>
    </form>
  );
};

export default RegisterConsultaForm;

