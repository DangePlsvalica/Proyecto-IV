"use client";

import React, { useState } from "react";
import Select, { SingleValue } from "react-select";
import { useQueryClient } from "@tanstack/react-query";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import Tittle from "@/components/Tittle";
import toast from "react-hot-toast";
import { useRegisterConsejoComunal } from "@/hooks/useRegisterConsejo";
import useParroquias from "@/hooks/useParroquias";
import { Persona } from "@/hooks/interfaces/persona.interface";
import { ConsejoComunalFormData } from "@/hooks/interfaces/consejo.comunal.interface";

const RegisterConsejoPage = () => {
  type OptionType = { value: string | number; label: string };

  const queryClient = useQueryClient();
  const { mutate: registerConsejo } = useRegisterConsejoComunal();

  const { data: parroquias = [], isLoading: parroquiasLoading } = useParroquias();
  const voceros = queryClient.getQueryData<Persona[]>(["personas"]) || [];

  // Estado inicial usando la interfaz ConsejoComunalFormData
  const [formData, setFormData] = useState<ConsejoComunalFormData>({
    cc: "",
    rif: "",
    numeroCuenta: "",
    fechaConstitucion: "",
    fechaVencimiento: "",
    poblacionVotante: 0,
    parroquiaId: undefined,
    voceroId: undefined,
  });

  // Opciones para selects con valores del tipo esperado (number o string según interfaz)
  const parroquiaOptions: OptionType[] = parroquias.map(p => ({
    value: p.id,  // number
    label: p.nombre,
  }));

  const voceroOptions: OptionType[] = voceros
    .filter(v => v.id !== undefined)
    .map(v => ({
      value: v.id as number,  // number
      label: `${v.nombres} ${v.apellidos}`,
    }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "file" && e.target instanceof HTMLInputElement) {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setFormData((prev) => ({
          ...prev,
          [name]: file,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  // handleSelectChange que asigna los tipos correctos y undefined si no hay selección
  const handleSelectChange = (
    field: keyof ConsejoComunalFormData,
    selected: SingleValue<OptionType>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: selected
        ? (typeof selected.value === "string" && !isNaN(Number(selected.value))
            ? Number(selected.value)
            : selected.value)
        : undefined,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cc || !formData.rif || formData.parroquiaId === undefined) {
      toast.error("Por favor completa los campos requeridos.");
      return;
    }

    registerConsejo(formData);
  };

  return (
    <div className="animate-fade-in opacity-0 mx-auto my-1 max-w-[95%] px-10 py-6 border border-sky-200 rounded-xl bg-[#f8f8f8]">
      <Tittle title="Registrar Consejo Comunal" />
      <form onSubmit={handleSubmit} className="pt-6 px-6 grid grid-cols-4 gap-4">
        <FormInput
          label="Nombre del Consejo Comunal"
          id="cc"
          value={formData.cc}
          onChange={handleChange}
          required
        />
        <FormInput
          label="RIF"
          id="rif"
          value={formData.rif}
          onChange={handleChange}
          required
        />
        <FormInput
          label="N° de cuenta"
          id="numeroCuenta"
          value={formData.numeroCuenta}
          onChange={handleChange}
        />
        <FormInput
          type="date"
          label="Fecha de constitución"
          id="fechaConstitucion"
          value={
            typeof formData.fechaConstitucion === "string"
              ? formData.fechaConstitucion
              : formData.fechaConstitucion?.toISOString().substring(0, 10) || ""
          }
          onChange={handleChange}
        />
        <FormInput
          type="date"
          label="Fecha de vencimiento"
          id="fechaVencimiento"
          value={
            typeof formData.fechaVencimiento === "string"
              ? formData.fechaVencimiento
              : formData.fechaVencimiento?.toISOString().substring(0, 10) || ""
          }
          onChange={handleChange}
        />
        <FormInput
          type="number"
          label="Población votante"
          id="poblacionVotante"
          value={formData.poblacionVotante}
          onChange={handleChange}
        />

        {/* Parroquia */}
        <div>
          <label className="block text-sm font-medium text-sky-950 mb-1">Parroquia</label>
          <Select
            options={parroquiaOptions}
            placeholder="Selecciona una parroquia"
            onChange={(selected) => handleSelectChange("parroquiaId", selected)}
            value={parroquiaOptions.find(p => p.value === formData.parroquiaId)}
          />
        </div>

        {/* Vocero */}
        <div>
          <label className="block text-sm font-medium text-sky-950 mb-1">Vocero</label>
          <Select
            options={voceroOptions}
            placeholder="Selecciona un vocero"
            onChange={(selected) => handleSelectChange("voceroId", selected)}
            value={voceroOptions.find(v => v.value === formData.voceroId)}
          />
        </div>
      </form>

      <div className="flex justify-center pt-6">
        <Button onClick={handleSubmit} title="Registrar Consejo Comunal" />
      </div>
    </div>
  );
};

export default RegisterConsejoPage;