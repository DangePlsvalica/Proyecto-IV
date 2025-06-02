"use client";
import React, { useState } from "react";
import Select, { MultiValue } from "react-select";
import Button from "@/components/Button";
import FormInput from '@/components/FormInput'
import { useQueryClient } from '@tanstack/react-query';
import { ConsejoComunal } from '@/hooks/interfaces/consejo.comunal.interface';
import { Parroquia } from '@/hooks/interfaces/parroquia.interface';
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
    fechaUltimaEleccion: "",
    parroquiaId: 0,
    nombreVocero: "",
    ciVocero: "",
    telefono: "",
    cantidadConsejosComunales: 0,
    poblacionVotante: 0,
  });

  const parroquiasData = queryClient.getQueryData<Parroquia[]>(["parroquias"]);
  const parroquiasOptions = parroquiasData?.map((parroquia) => ({
    value: Number(parroquia.id),
    label: parroquia.nombre,
  })) || [];

  const consejosComunalesData = queryClient.getQueryData<ConsejoComunal[]>(["consejoscomunal"]);
  const consejosComunalesOptions = consejosComunalesData?.map((cc) => ({
    value: cc.id,
    label: cc.cc,
  })) || [];

    // Manejar el cambio de la parroquia seleccionada
  const handleParroquiaChange = (selectedOption: any) => {
    setFormData({
      ...formData,
      parroquiaId: selectedOption ? Number(selectedOption.value) : 0, // Guarda solo el ID
    });
  };

    const handleConsejosChange = (newValue: MultiValue<{ value: string; label: string }>) => {
      setFormData({
        ...formData,
        consejosComunales: [...newValue],
      });
    };

  // Manejar el cambio en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, options } = e.target as HTMLSelectElement; // Asegura que es un select
  
    if (e.target instanceof HTMLSelectElement && e.target.multiple) {
      // Obtiene todas las opciones seleccionadas
      const selectedOptions = Array.from(options)
        .filter((option) => option.selected) // Filtra las opciones seleccionadas
        .map((option) => option.value); // Obtiene los valores seleccionados
  
      // Actualiza el estado para que consejoComunal sea un array de strings
      setFormData({ ...formData, [name]: selectedOptions });
    } else {
      // Para otros tipos de campos
      setFormData({ ...formData, [name]: e.target.value });
    }
  };  
  
  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const consejosMapeados = formData.consejosComunales.map((cc) => cc.value);

    const formDataWithNumbers = {
      ...formData,
      cantidadConsejosComunales: consejosMapeados.length,
      poblacionVotante: Number(formData.poblacionVotante),
      consejosComunales: consejosMapeados,
    };
    registerComuna(formDataWithNumbers);
  };

  return (
    <div className="animate-fade-in opacity-0 mx-auto my-1 max-w-[95%] px-6 py-8 border border-sky-200 rounded-xl bg-[#f8f8f8]">
      <Tittle title={"Registrar Nueva Comuna"}></Tittle>
      <form onSubmit={handleSubmit} className="pt-6 px-6 grid grid-cols-4 gap-4">
        <FormInput 
          label={"Código"} 
          id={"codigo"} 
          value={formData.codigo} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          label={"N° comisión promotora"} 
          id={"numComisionPromotora"} 
          value={formData.numComisionPromotora} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          type={"date"}
          label={"Fecha de Comisión Promotora"} 
          id={"fechaComisionPromotora"} 
          value={formData.fechaComisionPromotora} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          label={"RIF"} 
          id={"rif"} 
          value={formData.rif} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          label={"Cuenta Bancaria"} 
          id={"cuentaBancaria"} 
          value={formData.cuentaBancaria} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          type={"date"}
          label={"Fecha de Registro"} 
          id={"fechaRegistro"} 
          value={formData.fechaRegistro} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          label={"Nombre de la Comuna"} 
          id={"nombre"} 
          value={formData.nombre} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          textarea={true}
          label={"Dirección"} 
          id={"direccion"} 
          value={formData.direccion} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          label={"Lindero Norte"} 
          id={"linderoNorte"} 
          value={formData.linderoNorte} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          label={"Lindero Sur"} 
          id={"linderoSur"} 
          value={formData.linderoSur} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          label={"Lindero Este"} 
          id={"linderoEste"} 
          value={formData.linderoEste} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          label={"Lindero Oeste"} 
          id={"linderoOeste"} 
          value={formData.linderoOeste} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <div >
          <label htmlFor="consejosComunales" className="block pb-[11px] text-sm text-sky-950 font-medium">
            C.C que integran la comuna
          </label>
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
        <FormInput 
          type={"date"}
          label={"Fecha de Última Elección"} 
          id={"fechaUltimaEleccion"} 
          value={formData.fechaUltimaEleccion} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <div>
          <label htmlFor="parroquia" className="block pb-[9px] text-sm text-sky-950 font-medium">
            Parroquia
          </label>
          <Select
            id="parroquia"
            name="parroquiaId"
            options={parroquiasOptions} // Opciones formateadas desde el cache
            placeholder="Parroquia"
            onChange={handleParroquiaChange} // Actualiza parroquia y municipio
            value={parroquiasOptions.find(option => option.value === formData.parroquiaId) || null} // Mantener la selección
          />
        </div>
        <FormInput 
          label={"Nombres y Apellidos del Vocero"} 
          id={"nombreVocero"} 
          value={formData.nombreVocero} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          label={"Cédula de Identidad del Vocero"} 
          id={"ciVocero"} 
          value={formData.ciVocero} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          label={"Teléfono del Vocero"} 
          id={"telefono"} 
          value={formData.telefono} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          type={"number"}
          label={"Población Votante"} 
          id={"poblacionVotante"} 
          value={formData.poblacionVotante} 
          onChange={handleChange}
          required={true}>
        </FormInput>    
          </form>
          <div className="flex justify-center pt-6">
            <Button onClick={handleSubmit} title="Registrar Comuna"></Button>
          </div>
        </div>
      );
    };
    
    export default RegisterComunaPage;