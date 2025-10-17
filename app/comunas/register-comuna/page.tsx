"use client";
import React, { useState, useEffect } from "react";
import Select, { MultiValue } from "react-select";
import Button from "@/components/Button";
import FormInput from '@/components/FormInput';
import { useQueryClient } from '@tanstack/react-query';
import { ConsejoComunal } from '@/hooks/interfaces/consejo.comunal.interface';
import { Parroquia } from '@/hooks/interfaces/parroquia.interface';
import { Persona } from '@/hooks/interfaces/comuna.interface';
import { useRegisterComuna } from '@/hooks/useRegisterComuna';
import Tittle from "@/components/Tittle";

const RegisterComunaPage = () => {
  const queryClient = useQueryClient();
  const { mutate: registerComuna } = useRegisterComuna();

  const [formData, setFormData] = useState({
    codigo: "",
    numComisionPromotora: "",
    fechaComisionPromotora: "",
    rif: "",
    cuentaBancaria: "",
    fechaRegistro: "",
    nombre: "",
    direccion: "",
    linderoNorte: "",
    linderoSur: "",
    linderoEste: "",
    linderoOeste: "",
    consejosComunales: [] as { value: string; label: string }[],
    titularesFinanzas: [] as { value: string; label: string }[],
    fechaUltimaEleccion: "",
    parroquiaId: 0,
    cantidadConsejosComunales: 0,
    poblacionVotante: 0,
  });

  const [titularesFinanzasOptions, setTitularesFinanzasOptions] = useState<{ value: string; label: string }[]>([]);

  const parroquiasData = queryClient.getQueryData<Parroquia[]>(["parroquias"]);
  const consejosComunalesData = queryClient.getQueryData<ConsejoComunal[]>(["consejoscomunal"]);

  const parroquiasOptions = parroquiasData?.map((parroquia) => ({
    value: Number(parroquia.id),
    label: parroquia.nombre,
  })) || [];

  const consejosComunalesOptions = consejosComunalesData?.map((cc) => ({
    value: cc.id,
    label: cc.cc,
  })) || [];

  useEffect(() => {
    if (!consejosComunalesData || formData.consejosComunales.length === 0) {
      setTitularesFinanzasOptions([]);
      setFormData(prev => ({ ...prev, titularesFinanzas: [] }));
      return;
    }

    const selectedCcIds = formData.consejosComunales.map(cc => cc.value);
    const uniqueVoceros = new Map();

    consejosComunalesData
      .filter(cc => selectedCcIds.includes(cc.id))
      .forEach(cc => {
        cc.titularesFinanzas?.forEach((persona: Persona) => {
          if (!uniqueVoceros.has(persona.id)) {
            uniqueVoceros.set(persona.id, {
              value: persona.id,
              label: `${persona.nombres} ${persona.apellidos} - CI: ${persona.ci}`,
            });
          }
        });
      });

    setTitularesFinanzasOptions(Array.from(uniqueVoceros.values()));
    setFormData(prev => {
      const currentSelection = prev.titularesFinanzas.filter(banco => uniqueVoceros.has(banco.value));
      return { ...prev, titularesFinanzas: currentSelection };
    });
  }, [formData.consejosComunales, consejosComunalesData]);

  const handleParroquiaChange = (selectedOption: any) => {
    setFormData({ ...formData, parroquiaId: selectedOption ? Number(selectedOption.value) : 0 });
  };

  const handleConsejosChange = (newValue: MultiValue<{ value: string; label: string }>) => {
    setFormData({ ...formData, consejosComunales: [...newValue] });
  };

  const handleTitularesFinanzasChange = (newValue: MultiValue<{ value: string; label: string }>) => {
    if (newValue.length <= 11) {
      setFormData({ ...formData, titularesFinanzas: [...newValue] });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }; 
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const consejosMapeados = formData.consejosComunales.map((cc) => cc.value);
    const titularesMapeados = formData.titularesFinanzas.map((titular) => titular.value);

    const formDataWithNumbers = {
      ...formData,
      cantidadConsejosComunales: consejosMapeados.length,
      poblacionVotante: Number(formData.poblacionVotante),
      consejosComunales: consejosMapeados,
      titularesFinanzas: titularesMapeados,
    };
    
    registerComuna(formDataWithNumbers);
  };

  return (
    <div className="animate-fade-in opacity-0 mx-auto my-1 max-w-[95%] px-6 py-8 border border-sky-200 rounded-xl bg-[#f8f8f8]">
      <Tittle title={"Registrar Nueva Comuna"} />
      <form onSubmit={handleSubmit} className="pt-6 px-6">
        {/* Sección: Información Básica */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-sky-800 mb-2 border-b border-sky-200 pb-1">
            Información Básica
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <FormInput label="Código Situr" id="codigo" value={formData.codigo} onChange={handleChange} required />
            <FormInput label="N° comisión promotora" id="numComisionPromotora" value={formData.numComisionPromotora} onChange={handleChange} required />
            <FormInput label="RIF" id="rif" value={formData.rif} onChange={handleChange} required />
            <FormInput label="Nombre de la Comuna" id="nombre" value={formData.nombre} onChange={handleChange} required />
            <FormInput label="Cuenta Bancaria" id="cuentaBancaria" value={formData.cuentaBancaria} onChange={handleChange} required />
          </div>
        </section>

        {/* Sección: Fechas Legales */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-sky-800 mb-2 border-b border-sky-200 pb-1">
            Fechas Legales
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput type="date" label="Fecha de Comisión Promotora" id="fechaComisionPromotora" value={formData.fechaComisionPromotora} onChange={handleChange} required />
            <FormInput type="date" label="Fecha de Registro" id="fechaRegistro" value={formData.fechaRegistro} onChange={handleChange} required />
            <FormInput type="date" label="Fecha de Última Elección" id="fechaUltimaEleccion" value={formData.fechaUltimaEleccion} onChange={handleChange} required />
          </div>
        </section>

        {/* Sección: Ubicación y Linderos */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-sky-800 mb-2 border-b border-sky-200 pb-1">
            Ubicación Geográfica y Linderos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label htmlFor="parroquia" className="block pb-[9px] text-sm text-sky-950 font-medium">Parroquia</label>
              <Select
                id="parroquia"
                name="parroquiaId"
                options={parroquiasOptions}
                placeholder="Parroquia"
                onChange={handleParroquiaChange}
                value={parroquiasOptions.find(option => option.value === formData.parroquiaId) || null}
              />
            </div>
            <FormInput textarea label="Dirección" id="direccion" value={formData.direccion} onChange={handleChange} required />
            <FormInput label="Lindero Norte" id="linderoNorte" value={formData.linderoNorte} onChange={handleChange} required />
            <FormInput label="Lindero Sur" id="linderoSur" value={formData.linderoSur} onChange={handleChange} required />
            <FormInput label="Lindero Este" id="linderoEste" value={formData.linderoEste} onChange={handleChange} required />
            <FormInput label="Lindero Oeste" id="linderoOeste" value={formData.linderoOeste} onChange={handleChange} required />
          </div>
        </section>

        {/* Sección: Integrantes y Demografía */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-sky-800 mb-2 border-b border-sky-200 pb-1">
            Integrantes y Demografía
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="consejosComunales" className="block pb-[11px] text-sm text-sky-950 font-medium">C.C que integran la comuna</label>
              <Select
                id="consejosComunales"
                name="consejosComunales"
                options={consejosComunalesOptions}
                isMulti
                placeholder="Selecciona los c.c"
                onChange={handleConsejosChange}
                value={formData.consejosComunales}
              />
            </div>
            <div>
              <label htmlFor="titularesFinanzas" className="block pb-[11px] text-sm text-sky-950 font-medium">Miembros de la Unidad de Gestión Financiera</label>
              <Select
                id="titularesFinanzas"
                name="titularesFinanzas"
                options={titularesFinanzasOptions}
                isMulti
                placeholder="Selecciona los miembros"
                onChange={handleTitularesFinanzasChange}
                value={formData.titularesFinanzas}
                isDisabled={formData.consejosComunales.length === 0}
              />
            </div>
            <FormInput type="number" label="Población Votante" id="poblacionVotante" value={formData.poblacionVotante} onChange={handleChange} required />
          </div>
        </section>
      </form>
      <div className="flex justify-center pt-6">
        <Button onClick={handleSubmit} title="Registrar Comuna" />
      </div>
    </div>
  );
};
    
export default RegisterComunaPage;