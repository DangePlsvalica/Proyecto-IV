"use client";

import React, { useState } from "react";
import Select, { SingleValue } from "react-select";
import { useQueryClient } from "@tanstack/react-query";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import Tittle from "@/components/Tittle";
import toast from "react-hot-toast";
import { useRegisterVehiculo } from "@/hooks/useRegisterVehiculo";
import { VehiculoFormData } from "@/hooks/interfaces/vehiculo.interface";

type OptionType = { value: string | number; label: string };
type Vocero = { id: number; nombres: string; apellidos: string };
type ConsejoComunal = { cc: string; rif?: string };

const VEHICULO_STATUS_OPTIONS: OptionType[] = [
  { value: "asignado", label: "Asignado" },
  { value: "reasignado", label: "Reasignado" },
  { value: "extraviado", label: "Extraviado" },
  { value: "devuelto_a_caracas", label: "Devuelto a Caracas" },
  { value: "inactivo", label: "Inactivo" },
];

const RegisterVehiculoPage = () => {
  const queryClient = useQueryClient();
  const { mutate: registerVehiculo } = useRegisterVehiculo();

  // Obtener consejos comunales cacheados
  const consejosData = queryClient.getQueryData<ConsejoComunal[]>(["consejoscomunal"]) || [];
  const consejosOptions: OptionType[] = consejosData.map((c) => ({
    value: c.cc,
    label: c.rif ? `${c.cc} - ${c.rif}` : c.cc,
  }));

  // Obtener voceros cacheados (personas)
  const vocerosData = queryClient.getQueryData<Vocero[]>(["personas"]) || [];
  const vocerosOptions: OptionType[] = vocerosData.map((v) => ({
    value: v.id,
    label: `${v.nombres} ${v.apellidos}`,
  }));

  const [formData, setFormData] = useState<VehiculoFormData>({
    placa: "",
    clase: "",
    cc: "",
    marca: "",
    modelo: "",
    color: "",
    ano: 0,
    voceroId: null,
    serialCarroceria: "",
    fechaDeEntrega: "",
    estatus: "asignado",
    observacionArchivo: "" as string | File,
    observacion: "",
  });

  // Manejo cambios en inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, type } = e.target;

    if (type === "file" && e.target instanceof HTMLInputElement) {
      const file = e.target.files?.[0];
      if (file) {
        setFormData(prev => ({ ...prev, observacionArchivo: file }));
      }
      return; // Importante para no continuar con el setFormData normal
    }

    setFormData(prev => ({
      ...prev,
      [id]: type === "number" ? Number(value) : value,
    }));
  };

  // Manejo cambios en selects
  const handleSelectChange = (
    field: keyof VehiculoFormData,
    selectedOption: SingleValue<OptionType>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selectedOption ? selectedOption.value : "",
    }));
  };

  // Submit del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (
      !formData.placa ||
      !formData.clase ||
      !formData.cc ||
      !formData.marca ||
      !formData.modelo ||
      !formData.color ||
      !formData.ano ||
      !formData.serialCarroceria ||
      !formData.fechaDeEntrega ||
      !formData.estatus
    ) {
      toast.error("Por favor completa todos los campos obligatorios.");
      return;
    }

    // Subir archivo si hay
    let uploadedFileUrl = "";
    if (formData.observacionArchivo && formData.observacionArchivo instanceof File) {
      const formDataArchivo = new FormData();
      formDataArchivo.append("file", formData.observacionArchivo);
      formDataArchivo.append("upload_preset", "comunas_default");

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/ddsygfjzv/auto/upload",
          {
            method: "POST",
            body: formDataArchivo,
          }
        );
        const data = await res.json();
        uploadedFileUrl = data.secure_url;
      } catch (error) {
        toast.error("Error subiendo el archivo.");
        return;
      }
    }

    // Construir objeto final a enviar
    const vehiculoParaRegistrar: VehiculoFormData = {
      ...formData,
      observacionArchivo: uploadedFileUrl,
    };

    registerVehiculo(vehiculoParaRegistrar);
  };

  return (
    <div className="animate-fade-in opacity-0 mx-auto my-1 max-w-[95%] px-10 py-6 border border-sky-200 rounded-xl bg-[#f8f8f8]">
      <Tittle title={"Registrar Nuevo Vehiculo"} />
      <form onSubmit={handleSubmit} className="pt-6 px-6 grid grid-cols-4 gap-4">
        <FormInput
          label="Placa"
          id="placa"
          value={formData.placa}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Clase"
          id="clase"
          value={formData.clase}
          onChange={handleChange}
          required
        />
        <div>
          <label htmlFor="cc" className="block pb-[10px] text-sm text-sky-950 font-medium">
            Consejo Comunal
          </label>
          <Select
            id="cc"
            options={consejosOptions}
            placeholder="Seleccionar"
            onChange={(opt) => handleSelectChange("cc", opt)}
            value={consejosOptions.find((o) => o.value === formData.cc) || null}
            styles={{
              control: (base) => ({ ...base, borderColor: "black", borderRadius: 6 }),
              menu: (base) => ({ ...base, borderRadius: 6 }),
            }}
          />
        </div>
        <FormInput
          label="Marca"
          id="marca"
          value={formData.marca}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Modelo"
          id="modelo"
          value={formData.modelo}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Color"
          id="color"
          value={formData.color}
          onChange={handleChange}
          required
        />
        <FormInput
          type="number"
          label="Año"
          id="ano"
          value={formData.ano}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Serial de carrocería"
          id="serialCarroceria"
          value={formData.serialCarroceria}
          onChange={handleChange}
          required
        />
        <div>
          <label htmlFor="voceroAsignadoId" className="block pb-[10px] text-sm text-sky-950 font-medium">
            Persona asignada
          </label>
          <Select
            id="voceroAsignadoId"
            options={vocerosOptions}
            placeholder="Seleccionar"
            onChange={(opt) => handleSelectChange("voceroId", opt)}
            value={vocerosOptions.find((o) => o.value === formData.voceroId) || null}
            styles={{
              control: (base) => ({ ...base, borderColor: "black", borderRadius: 6 }),
              menu: (base) => ({ ...base, borderRadius: 6 }),
            }}
          />
        </div>
        <FormInput
          type="date"
          label="Fecha de entrega"
          id="fechaDeEntrega"
          value={formData.fechaDeEntrega}
          onChange={handleChange}
          required
        />
        <div className="col-span-1">
          <label htmlFor="estatus" className="block pb-[10px] text-sm text-sky-950 font-medium">
            Estado del vehículo
          </label>
          <Select
            id="estatus"
            options={VEHICULO_STATUS_OPTIONS}
            placeholder="Seleccionar"
            onChange={(opt) => handleSelectChange("estatus", opt)}
            value={VEHICULO_STATUS_OPTIONS.find((o) => o.value === formData.estatus) || null}
            styles={{
              control: (base) => ({ ...base, borderColor: "black", borderRadius: 6 }),
              menu: (base) => ({ ...base, borderRadius: 6 }),
            }}
          />
        </div>
        <FormInput
          textarea
          label="Observación"
          id="observacion"
          value={formData.observacion}
          onChange={handleChange}
        />
        <FormInput
          type="file"
          label="Subir archivo (PDF o Word)"
          id="observacionArchivo"
          onChange={handleChange}
          accept=".pdf,.doc,.docx"
        />
        <div className="col-span-4 flex justify-center pt-6">
          <Button type="submit" title="Registrar Vehiculo" />
        </div>
      </form>
    </div>
  );
};

export default RegisterVehiculoPage;
