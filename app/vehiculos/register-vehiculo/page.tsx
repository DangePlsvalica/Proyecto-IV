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
import { VehiculoFormData } from "@/hooks/interfaces/vehiculo.interface";

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
    observacionArchivo: "" as string | File,
    observacion: "",
  });

  // Obtener datos de la cache y transformar a formato para react-select
  const consejosData = queryClient.getQueryData<ConsejoComunal[]>(["consejoscomunal"]);
  const consejosOptions = consejosData?.map(consejo => ({
    value: consejo.cc,
    label: consejo.cc, 
  })) || [];

  // Manejar el cambio en los campos del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "file" && e.target instanceof HTMLInputElement) {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setFormData({
          ...formData,
          observacionArchivo: file,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === "number" ? Number(value) : value,
      });
    }
  };
  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.placa || !formData.clase || !formData.cc) {
      toast.error("Por favor completa todos los campos antes de registrar el vehículo.");
      return;
    }

    let uploadedFileUrl = "";
    if (formData.observacionArchivo && formData.observacionArchivo instanceof File) {
      const fileData = new FormData();
      fileData.append("file", formData.observacionArchivo);
      fileData.append("upload_preset", "comunas_default"); // 👈 tu upload_preset de Cloudinary

      try {
        const response = await fetch("https://api.cloudinary.com/v1_1/ddsygfjzv/auto/upload", {
          method: "POST",
          body: fileData,
        });

        const data = await response.json();
        uploadedFileUrl = data.secure_url;
      } catch (error) {
        console.error("Error subiendo archivo:", error);
        toast.error("Error al subir el archivo.");
        return;
      }
    }

    // Construir el objeto final para la API
    const vehiculoData: VehiculoFormData = {
      ...formData,
      observacionArchivo: uploadedFileUrl || "", // 👈 solo string aquí
    };

    registerVehiculo(vehiculoData);
  };


  return (
    <div className="animate-fade-in opacity-0 mx-auto my-1 max-w-[95%] px-10 py-6 border border-sky-200 rounded-xl bg-[#f8f8f8]">
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
        <FormInput 
          type="file"
          label="Subir archivo (PDF o Word)" 
          id="observacionArchivo" 
          onChange={handleChange}
          accept=".pdf,.doc,.docx"
        />
      </form>
          <div className="flex justify-center pt-6">
            <Button onClick={handleSubmit} title="Registrar Vehiculo"></Button>
          </div>
        </div>
      );
    };
    
    export default RegisterVehiculoPage;