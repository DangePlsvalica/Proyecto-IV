"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Select from "react-select";
import Button from "@/components/Button";
import FormInput from '@/components/FormInput'

const RegisterComunaPage = () => {
  type OptionType = {
    value: string;
    label: string;
  };
  
  const router = useRouter();
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
    consejoComunal: [] as OptionType[],
    fechaUltimaEleccion: "",
    municipio: "",
    parroquia: "",
    nombreVocero: "",
    ciVocero: "",
    telefono: "",
    cantidadConsejosComunales: "",
    poblacionVotante: "",
  });

  const [consejos, setConsejos] = useState<OptionType[]>([]);

  useEffect(() => {
  const fetchConsejos = async () => {
    try {
      const response = await fetch("/api/consejos");
      const data = await response.json();

      // Formatea los datos al formato esperado por react-select
      const formattedOptions = data.map((consejo: { id: string; cc: string }) => ({
        value: consejo.cc,
        label: consejo.cc, 
      }));

      setConsejos(formattedOptions);
    } catch (error) {
      console.error("Error al cargar los consejos comunales:", error);
      toast.error("No se pudieron cargar los consejos comunales");
    }
  };

  fetchConsejos();
}, []);

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
    try {
      const res = await fetch("/api/comunas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          cantidadConsejosComunales: parseInt(formData.cantidadConsejosComunales),
          poblacionVotante: parseInt(formData.poblacionVotante),
          fechaComisionPromotora: new Date(formData.fechaComisionPromotora).toISOString(),
          fechaRegistro: new Date(formData.fechaComisionPromotora).toISOString(),
          fechaUltimaEleccion: new Date(formData.fechaComisionPromotora).toISOString(),
          consejoComunal: formData.consejoComunal.map((option) => option.value), // Enviar solo los valores seleccionados
        }),
      });

      if (res.ok) {
        toast.success("Comuna registrada exitosamente");
        router.push("/pages/comunas");
      } else {
        toast.error("Error al registrar la comuna");
      }
    } catch (error) {
      console.error("Error al registrar comuna:", error);
      toast.error("Hubo un problema al registrar la comuna");
    }
  };

  return (
    <div className="mx-auto my-7 max-w-[95%] p-16 border border-sky-200 rounded-xl bg-[#f8f8f8]">
      <h1 className="text-2xl font-bold mb-6 text-sky-950">Registrar Nueva Comuna</h1>
      <form onSubmit={handleSubmit} className=" grid grid-cols-4 gap-4">
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
        <div>
          <label htmlFor="consejoComunal" className="block text-sm font-medium">
            Consejo Comunal que integra la Comuna
          </label>
          <Select
            id="consejoComunal"
            name="consejoComunal"
            options={consejos} // Opciones formateadas desde el backend
            isMulti
            placeholder="Selecciona los consejos comunales"
            onChange={(selectedOptions) =>
              setFormData({
                ...formData,
                consejoComunal: [...selectedOptions], // Convierte a un array mutable
              })
            }
            value={formData.consejoComunal} // Mantener la selección
            styles={{
              control: (provided) => ({
                ...provided,
                border: "1px solid black", // Similar al input
                borderRadius: "0.375rem", // rounded-md
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
                backgroundColor: "white", // bg-blue-600
                color: "white",
                borderRadius: "0.375rem",
              }),
              multiValueRemove: (provided) => ({
                ...provided,
                color: "#0c4a6e",
                ":hover": {
                  backgroundColor: "#ef4444", // bg-red-500
                  color: "white",
                },
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected
                  ? "#2563eb" // bg-blue-600
                  : state.isFocused
                  ? "#e0f2fe" // bg-blue-100
                  : "white",
                color: state.isSelected ? "white" : "#1f2937", // text-gray-800
                padding: "0.5rem", // Similar a px-4 py-2
              }),
            }}
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
        <FormInput 
          label={"Municipio"} 
          id={"municipio"} 
          value={formData.municipio} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          label={"Parroquia"} 
          id={"parroquia"} 
          value={formData.parroquia} 
          onChange={handleChange}
          required={true}>
        </FormInput>
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
          label={"Cantidad de C.C que Integran la Comuna"} 
          id={"cantidadConsejosComunales"} 
          value={formData.cantidadConsejosComunales} 
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