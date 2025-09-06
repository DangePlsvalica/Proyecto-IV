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

const RegisterProyectoPage = () => {
  type OptionType = {
    value: string;
    label: string;
  };

  const queryClient = useQueryClient();
  const { mutate: registerProyecto } = useRegisterProyecto();

  const [formData, setFormData] = useState({
    nombreProyecto: "",
    codigoProyecto: "",
    consulta: 1,
    estatusProyecto: "",
    circuito: "",
    categoria: "",
    observacion: "",
    consejoComunalId: "",
  });

  // Datos en caché (consejos comunales)
  const consejosData = queryClient.getQueryData<ConsejoComunal[]>(["consejoscomunal"]);
  const consejosOptions = consejosData?.map(consejo => ({
    value: consejo.id,  // 👈 importante: guardamos el ID
    label: consejo.cc, 
  })) || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombreProyecto || !formData.codigoProyecto || !formData.estatusProyecto || !formData.consejoComunalId) {
      toast.error("Por favor completa todos los campos obligatorios.");
      return;
    }
    registerProyecto(formData);
  };

  return (
    <div className="animate-fade-in opacity-0 mx-auto my-7 max-w-[95%] p-12 border border-sky-200 rounded-xl bg-[#f8f8f8]">
      <Tittle title={"Registrar nuevo Proyecto"} />
      <form onSubmit={handleSubmit} className="pt-6 px-6">
        <div>
          <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">Información Básica</h3>
          <div className="grid grid-cols-4 gap-4">
            <FormInput 
              label="Nombre del Proyecto" 
              id="nombreProyecto" 
              value={formData.nombreProyecto} 
              onChange={handleChange}
              required
            />
            <FormInput 
              label="Código del Proyecto" 
              id="codigoProyecto" 
              value={formData.codigoProyecto} 
              onChange={handleChange}
              required
            />
            <FormInput 
              label="Consulta" 
              id="consulta" 
              type="number"
              value={formData.consulta} 
              onChange={handleChange}
              required
            />
            <FormInput 
              label="Estatus del Proyecto" 
              id="estatusProyecto" 
              value={formData.estatusProyecto} 
              onChange={handleChange}
              required
            />
            <FormInput 
              label="Circuito" 
              id="circuito" 
              value={formData.circuito} 
              onChange={handleChange}
            />
            <FormInput 
              label="Categoría" 
              id="categoria" 
              value={formData.categoria} 
              onChange={handleChange}
              required
            />
            <FormInput 
              label="Observación" 
              id="observacion" 
              value={formData.observacion} 
              onChange={handleChange}
            />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pt-4 pb-2">Consejo Comunal</h3>
        <div>
          <label htmlFor="consejoComunalId" className="block pb-[10px] text-sm text-sky-950 font-medium">
            Consejo Comunal
          </label>
          <Select
            id="consejoComunalId"
            name="consejoComunalId"
            options={consejosOptions}
            placeholder="Seleccione un consejo comunal"
            onChange={(selectedOption: SingleValue<OptionType>) =>
              setFormData({
                ...formData,
                consejoComunalId: selectedOption?.value || "",
              })
            }
            value={consejosOptions.find(option => option.value === formData.consejoComunalId)}
          />
        </div>
      </form>
      <div className="flex justify-center pt-6">
        <Button onClick={handleSubmit} title="Registrar Proyecto" />
      </div>
    </div>
  );
};

export default RegisterProyectoPage;
