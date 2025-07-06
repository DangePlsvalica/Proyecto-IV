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
import Modal from "@/components/Modal";
import RegisterPersonaForm from "@/components/RegisterPersonaForm";

const RegisterConsejoPage = () => {
  type OptionType = { value: string | number; label: string };

  const queryClient = useQueryClient();
  const { mutate: registerConsejo } = useRegisterConsejoComunal();
  const { data: parroquias = [] } = useParroquias();
  const voceros = queryClient.getQueryData<Persona[]>(["personas"]) || [];

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

  const parroquiaOptions: OptionType[] = parroquias.map(p => ({
    value: p.id,
    label: p.nombre,
  }));

  const initialVoceroOptions: OptionType[] = voceros
    .filter(v => v.id !== undefined)
    .map(v => ({
      value: v.id as number,
      label: `${v.nombres} ${v.apellidos}`,
    }));

  const [voceroOptionsState, setVoceroOptionsState] = useState<OptionType[]>(initialVoceroOptions);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

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

  const handleNuevaPersona = (nuevaPersona: Persona) => {
    const nuevaOpcion: OptionType = {
      value: nuevaPersona.id!, // usamos ! si tienes certeza de que existe
      label: `${nuevaPersona.nombres} ${nuevaPersona.apellidos}`,
    };

    setVoceroOptionsState(prev => [nuevaOpcion, ...prev]);
    setFormData(prev => ({
      ...prev,
      voceroId: nuevaPersona.id,
    }));
    setModalOpen(false);
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
        <FormInput id="cc" label="Nombre" value={formData.cc} onChange={handleChange} required />
        <FormInput id="rif" label="RIF" value={formData.rif} onChange={handleChange} required />
        <FormInput id="numeroCuenta" label="N° de cuenta" value={formData.numeroCuenta} onChange={handleChange} />
        <FormInput
          type="date"
          id="fechaConstitucion"
          label="Fecha de constitución"
          value={formData.fechaConstitucion?.toString().slice(0, 10) || ""}
          onChange={handleChange}
        />
        <FormInput
          type="date"
          id="fechaVencimiento"
          label="Fecha de vencimiento"
          value={formData.fechaVencimiento?.toString().slice(0, 10) || ""}
          onChange={handleChange}
        />
        <FormInput
          type="number"
          id="poblacionVotante"
          label="Población votante"
          value={formData.poblacionVotante}
          onChange={handleChange}
        />

        {/* Parroquia */}
        <div>
          <label className="block text-sm font-medium text-sky-950 mb-1 pt-1">Parroquia</label>
          <Select
            options={parroquiaOptions}
            placeholder="Selecciona una parroquia"
            onChange={selected => handleSelectChange("parroquiaId", selected)}
            value={parroquiaOptions.find(p => p.value === formData.parroquiaId)}
          />
        </div>

        {/* Vocero */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-sky-950 mb-1 pt-1">Vocero</label>
          <Select
            options={voceroOptionsState}
            placeholder="Selecciona un vocero"
            onChange={selected => handleSelectChange("voceroId", selected)}
            value={voceroOptionsState.find(v => v.value === formData.voceroId)}
          />
          <div className="mt-2">
            <Button title="Registrar nuevo vocero" onClick={() => setModalOpen(true)} type="button" />
          </div>
        </div>
      </form>

      <div className="flex justify-center pt-6">
        <Button onClick={handleSubmit} title="Registrar Consejo Comunal" />
      </div>

      <Modal open={isModalOpen} onClose={() => setModalOpen(false)} title="Registrar nueva Persona">
        <RegisterPersonaForm onSuccess={handleNuevaPersona} />
      </Modal>
    </div>
  );
};

export default RegisterConsejoPage;
