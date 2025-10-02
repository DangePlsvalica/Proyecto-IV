"use client";
import React, { useState } from "react";
import Select, { SingleValue } from "react-select";
import Button from "@/components/Button";
import FormInput from '@/components/FormInput';
import { useQueryClient } from '@tanstack/react-query';
import { ConsejoComunal } from '@/hooks/interfaces/consejo.comunal.interface';
import { useRegisterProyecto } from '@/hooks/useRegisterProyecto';
import toast from "react-hot-toast";
import Tittle from "@/components/Tittle";
import { ProyectoFormData } from "@/hooks/interfaces/proyecto.interface";
import useConsultas from "@/hooks/useConsultas";
import useCategorias from "@/hooks/useCategorias";

const RegisterProyectoPage = () => {
  type OptionType = {
    value: string;
    label: string;
  };

  const queryClient = useQueryClient();
  const { mutate: registerProyecto } = useRegisterProyecto();
  
  // Usar los nuevos hooks para obtener datos de la API
  const { data: consultasData, isLoading: isLoadingConsultas } = useConsultas();
  const { data: categoriasData, isLoading: isLoadingCategorias } = useCategorias();

  const [formData, setFormData] = useState<ProyectoFormData>({
    nombreProyecto: "",
    codigoProyecto: "",
    consultaId: "",
    estatusProyecto: "",
    categoriaId: "",
    observacion: "",
    familiasBeneficiadas: 0,
    personasBeneficiadas: 0,
    comunidadesBeneficiadas: 0,
    consejoComunalId: "",
  });

  const estatusOpciones: OptionType[] = [
    { value: "APROBADO", label: "APROBADO" },
    { value: "EN EJECUCIÓN", label: "EN EJECUCIÓN" },
    { value: "FINALIZADO", label: "FINALIZADO" },
    { value: "PARALIZADO", label: "PARALIZADO" },
    { value: "INCONCLUSO", label: "INCONCLUSO" },
  ];

  // Mapear los datos de las APIs al formato de react-select
  const consultasOptions = consultasData?.map(consulta => ({
    value: consulta.id,
    label: consulta.nombre,
  })) || [];

  const categoriasOptions = categoriasData?.map(categoria => ({
    value: categoria.id,
    label: categoria.nombre,
  })) || [];

  const consejosData = queryClient.getQueryData<ConsejoComunal[]>(["consejoscomunal"]);
  const consejosOptions = consejosData?.map(consejo => ({
    value: consejo.id,
    label: consejo.cc,
  })) || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSelectChange = (
    selectedOption: SingleValue<OptionType>,
    name: keyof ProyectoFormData
  ) => {
    setFormData({
      ...formData,
      [name]: selectedOption?.value || "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombreProyecto || !formData.codigoProyecto || !formData.estatusProyecto || !formData.consejoComunalId || !formData.categoriaId || !formData.consultaId) {
      toast.error("Por favor completa todos los campos obligatorios.");
      return;
    }
    registerProyecto(formData);
  };
  
  // Mostrar mensaje de carga mientras se obtienen los datos de las APIs
  if (isLoadingConsultas || isLoadingCategorias) {
    return <div>Cargando opciones...</div>;
  }

  return (
    <div className="animate-fade-in opacity-0 mx-auto my-7 max-w-[95%] p-12 border border-sky-200 rounded-xl bg-[#f8f8f8]">
      <Tittle title={"Registrar nuevo Proyecto"} />
      <form onSubmit={handleSubmit} className="pt-6 px-6">
        <div>
          <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">Información Básica</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div>
              <label htmlFor="consultaId" className="block pb-[10px] text-sm text-sky-950 font-medium">
                Consulta
              </label>
              <Select
                id="consultaId"
                name="consultaId"
                options={consultasOptions}
                placeholder="Seleccione la consulta"
                onChange={(selectedOption) => handleSelectChange(selectedOption, 'consultaId')}
                value={consultasOptions.find(option => option.value === formData.consultaId)}
              />
            </div>
            <div>
              <label htmlFor="estatusProyecto" className="block pb-[10px] text-sm text-sky-950 font-medium">
                Estatus del Proyecto
              </label>
              <Select
                id="estatusProyecto"
                name="estatusProyecto"
                options={estatusOpciones}
                placeholder="Seleccione el estatus"
                onChange={(selectedOption) => handleSelectChange(selectedOption, 'estatusProyecto')}
                value={estatusOpciones.find(option => option.value === formData.estatusProyecto)}
              />
            </div>
            <div>
              <label htmlFor="categoriaId" className="block pb-[10px] text-sm text-sky-950 font-medium">
                Categoría
              </label>
              <Select
                id="categoriaId"
                name="categoriaId"
                options={categoriasOptions}
                placeholder="Seleccione la categoría"
                onChange={(selectedOption) => handleSelectChange(selectedOption, 'categoriaId')}
                value={categoriasOptions.find(option => option.value === formData.categoriaId)}
              />
            </div>
            <FormInput
              label="Observación"
              id="observacion"
              value={formData.observacion}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pt-4 pb-2">Beneficiarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
                label="Familias Beneficiadas"
                id="familiasBeneficiadas"
                type="number"
                value={formData.familiasBeneficiadas}
                onChange={handleChange}
                required
            />
            <FormInput
                label="Personas Beneficiadas"
                id="personasBeneficiadas"
                type="number"
                value={formData.personasBeneficiadas}
                onChange={handleChange}
                required
            />
            <FormInput
                label="Comunidades Beneficiadas"
                id="comunidadesBeneficiadas"
                type="number"
                value={formData.comunidadesBeneficiadas}
                onChange={handleChange}
                required
            />
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
            onChange={(selectedOption) => handleSelectChange(selectedOption, 'consejoComunalId')}
            value={consejosOptions.find(option => option.value === formData.consejoComunalId)}
            required
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
