"use client";
import React, { useState } from "react";
import Select, { SingleValue } from "react-select";
import Button from "@/components/Button";
import FormInput from '@/components/FormInput'
import { useQueryClient } from '@tanstack/react-query';
import { ConsejoComunal } from '@/hooks/interfaces/consejo.comunal.interface';
import { useRegisterVehiculo } from '@/hooks/useRegisterVehiculo';
import toast from "react-hot-toast";
import Tittle from "@/components/Tittle";

const RegisterVehiculoPage = () => {
  type OptionType = {
    value: string;
    label: string;
  };
  const queryClient = useQueryClient();
  
  const { mutate: registerVehiculo } = useRegisterVehiculo();
  const [formData, setFormData] = useState({
    placa: "",
    clase: "",
    cc: "",
    comuna: "",
    marca: "",
    modelo: "",
    color: "",
    ano: 0,
    municipio: "",
    serialCarroceria: "",
    voceroAsignado: "",
    fechaDeEntrega: "",
    estatus: "",
    observacionArchivo: "",
    observacion: "",
  });

  // Obtener datos de la cache y transformar a formato para react-select
  const consejosData = queryClient.getQueryData<ConsejoComunal[]>(["consejoscomunal"]);
  const consejosOptions = consejosData?.map(consejo => ({
    value: consejo.cc,
    label: consejo.cc, 
  })) || [];

  // Manejar el cambio en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value, // Convierte a número si el campo es tipo "number"
    });
  };  

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  if (!formData.placa || !formData.clase || !formData.cc) {
    toast.error("Por favor completa todos los campos antes de registrar el vehículo.");
    return;
  }
  registerVehiculo(formData);
  };

  return (
    <div className="animate-fade-in opacity-0 mx-auto my-7 max-w-[95%] p-12 border border-sky-200 rounded-xl bg-[#f8f8f8]">
      <Tittle title={"Registrar Nuevo Vehiculo"}></Tittle>
      <form onSubmit={handleSubmit} className="pt-6 px-6 grid grid-cols-4 gap-4">
        <FormInput 
          label={"Placa"} 
          id={"placa"} 
          value={formData.placa} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          label={"Clase"} 
          id={"clase"} 
          value={formData.clase} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <div>
          <label htmlFor="consejoComunal" className="block pb-[10px] text-sm text-sky-950 font-medium">
            Consejo Comunal
          </label>
          <Select
            id="consejoComunal"
            name="consejoComunal"
            options={consejosOptions} // Opciones formateadas desde el backend
            placeholder="Seleccionar"
            onChange={(selectedOption: SingleValue<OptionType>) =>
              setFormData({
                ...formData,
                cc: selectedOption?.value || "",
              })
            }
            value={consejosOptions.find(option => option.value === formData.cc)}// Mantener la selección
            styles={{
              control: (provided) => ({
                ...provided,
                border: "1px solid black", // Similar al input
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
              }),
              menu: (provided) => ({
                ...provided,
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
              }),
              multiValue: (provided) => ({
                ...provided,
                backgroundColor: "white",
                color: "white",
                borderRadius: "0.375rem",
              }),
              multiValueRemove: (provided) => ({
                ...provided,
                color: "#0c4a6e",
                ":hover": {
                  backgroundColor: "#ef4444",
                  color: "white",
                },
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected
                  ? "#2563eb"
                  : state.isFocused
                  ? "#e0f2fe"
                  : "white",
                color: state.isSelected ? "white" : "#1f2937", 
                padding: "0.5rem",
              }),
            }}
          />
        </div>
        <FormInput 
          label={"Comuna"} 
          id={"comuna"} 
          value={formData.comuna} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          label={"Marca"} 
          id={"marca"} 
          value={formData.marca} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          label={"Modelo"} 
          id={"modelo"} 
          value={formData.modelo} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          label={"Color"} 
          id={"color"} 
          value={formData.color} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          type={"number"}
          label={"Anio"} 
          id={"ano"} 
          value={formData.ano} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          label={"Municipio"} 
          id={"municipio"} 
          value={formData.municipio} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          label={"Serial de carroceria"} 
          id={"serialCarroceria"} 
          value={formData.serialCarroceria} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          label={"Persona asignada"} 
          id={"voceroAsignado"} 
          value={formData.voceroAsignado} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          type="date"
          label={"Fecha de entrega"} 
          id={"fechaDeEntrega"} 
          value={formData.fechaDeEntrega} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          label={"Estado del vehiculo"} 
          id={"estatus"} 
          value={formData.estatus} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          textarea={true}
          label={"Observacion"} 
          id={"observacion"} 
          value={formData.observacion} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <div className="pt-8">
          <Button href="" title={"Subir archivo"}></Button>   
        </div>
          </form>
          <div className="flex justify-center pt-6">
            <Button onClick={handleSubmit} title="Registrar Vehiculo"></Button>
          </div>
        </div>
      );
    };
    
    export default RegisterVehiculoPage;