"use client";
import React, { useState } from "react";
import Select, { SingleValue } from "react-select";
import Button from "@/components/Button";
import FormInput from '@/components/FormInput'
import { useQueryClient } from '@tanstack/react-query';
import { ConsejoComunal } from '@/hooks/interfaces/consejo.comunal.interface';
import { useRegisterProyecto } from '@/hooks/useRegisterProyecto';
import toast from "react-hot-toast";
import Tittle from "@/components/Tittle";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const RegisterProyectoPage = () => {
  type OptionType = {
    value: string;
    label: string;
  };
  const router = useRouter();
  const { data: session, } = useSession();
  const queryClient = useQueryClient();
  
  const { mutate: registerProyecto } = useRegisterProyecto();
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    status: "",
    fechaCreacion: "",
    ultimaActividad: "",
    categoria: "",
    comuna: "",
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
  if (!formData.categoria || !formData.comuna || !formData.status) {
    toast.error("Por favor completa todos los campos antes de registrar el Proyecto.");
    return;
  }
  registerProyecto(formData);
  };

  if (!session) {
    router.push("/pages/login");
    return null;
  }

  if (session.user.role !== "Admin") {
    router.push("/");
    return null;
  }

  return (
    <div className="animate-fade-in opacity-0 mx-auto my-7 max-w-[95%] p-12 border border-sky-200 rounded-xl bg-[#f8f8f8]">
      <Tittle title={"Registrar nuevo Proyecto"}></Tittle>
      <form onSubmit={handleSubmit} className="pt-6 px-6 grid grid-cols-4 gap-4">
        <FormInput 
          label={"Id"} 
          id={"id"} 
          value={formData.id} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          label={"Nombre"} 
          id={"nombre"} 
          value={formData.nombre} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          label={"Estado"} 
          id={"status"} 
          value={formData.status} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          type="date"
          label={"Fecha de creacion"} 
          id={"fechaCreacion"} 
          value={formData.fechaCreacion} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          type="date"
          label={"Ultima actividad"} 
          id={"ultimaActividad"} 
          value={formData.ultimaActividad} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          label={"Categoria"} 
          id={"categoria"} 
          value={formData.categoria} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <div>
          <label htmlFor="consejoComunal" className="block pb-[11px] text-sm text-sky-950 font-medium">
            Comuna
          </label>
          <Select
            id="comuna"
            name="comuna"
            options={consejosOptions} // Opciones formateadas desde el backend
            placeholder="Selecciona a que comuna pertenece"
            onChange={(selectedOption: SingleValue<OptionType>) =>
              setFormData({
                ...formData,
                comuna: selectedOption?.value || "",
              })
            }
            value={consejosOptions.find(option => option.value === formData.comuna)}// Mantener la selección
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
          </form>
          <div className="flex justify-center pt-6">
            <Button onClick={handleSubmit} title="Registrar Proyecto"></Button>
          </div>
        </div>
      );
    };
    
    export default RegisterProyectoPage;