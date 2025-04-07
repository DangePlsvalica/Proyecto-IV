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
 // Estado para almacenar los consejos comunales

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
        router.push("/pages/comunas"); // Redirige a la lista de comunas
      } else {
        toast.error("Error al registrar la comuna");
      }
    } catch (error) {
      console.error("Error al registrar comuna:", error);
      toast.error("Hubo un problema al registrar la comuna");
    }
  };

  return (
    <div className="mx-auto my-7 max-w-[95%] p-20 border border-sky-200 rounded-xl bg-[#f8f8f8]">
      <h1 className="text-2xl font-bold mb-6">Registrar Nueva Comuna</h1>
      <form onSubmit={handleSubmit} className=" grid grid-cols-4 gap-4">
        <FormInput 
          label={"Código"} 
          id={"codigo"} 
          value={formData.codigo} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <div>
          <label htmlFor="numComisionPromotora" className="block text-sm font-medium">
            N° comisión promotora
          </label>
          <input
            type="text"
            id="numComisionPromotora"
            name="numComisionPromotora"
            value={formData.numComisionPromotora}
            onChange={handleChange}
            required
            className="block w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="fechaComisionPromotora" className="block text-sm font-medium">
            Fecha de Comisión Promotora
          </label>
          <input
            type="date"
            id="fechaComisionPromotora"
            name="fechaComisionPromotora"
            value={formData.fechaComisionPromotora}
            onChange={handleChange}
            required
            className="block w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="rif" className="block text-sm font-medium">
            RIF
          </label>
          <input
            type="text"
            id="rif"
            name="rif"
            value={formData.rif}
            onChange={handleChange}
            required
            className="block w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="cuentaBancaria" className="block text-sm font-medium">
            Cuenta Bancaria
          </label>
          <input
            type="text"
            id="cuentaBancaria"
            name="cuentaBancaria"
            value={formData.cuentaBancaria}
            onChange={handleChange}
            required
            className="block w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="fechaRegistro" className="block text-sm font-medium">
            Fecha de Registro
          </label>
          <input
            type="date"
            id="fechaRegistro"
            name="fechaRegistro"
            value={formData.fechaRegistro}
            onChange={handleChange}
            required
            className="block w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium">
            Nombre de la Comuna
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="block w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="direccion" className="block text-sm font-medium">
            Dirección
          </label>
          <textarea
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
            className="block w-full border px-4 py-2 rounded-md"
          ></textarea>
        </div>
        <div>
          <label htmlFor="linderoNorte" className="block text-sm font-medium">
            Lindero Norte
          </label>
          <input
            type="text"
            id="linderoNorte"
            name="linderoNorte"
            value={formData.linderoNorte}
            onChange={handleChange}
            required
            className="block w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="linderoSur" className="block text-sm font-medium">
            Lindero Sur
          </label>
          <input
            type="text"
            id="linderoSur"
            name="linderoSur"
            value={formData.linderoSur}
            onChange={handleChange}
            required
            className="block w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="linderoEste" className="block text-sm font-medium">
            Lindero Este
          </label>
          <input
            type="text"
            id="linderoEste"
            name="linderoEste"
            value={formData.linderoEste}
            onChange={handleChange}
            required
            className="block w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="linderoOeste" className="block text-sm font-medium">
            Lindero Oeste
          </label>
          <input
            type="text"
            id="linderoOeste"
            name="linderoOeste"
            value={formData.linderoOeste}
            onChange={handleChange}
            required
            className="block w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="consejoComunal" className="block text-sm font-medium">
            Consejo Comunal que integra la Comuna
          </label>
          <Select
            id="consejoComunal"
            name="consejoComunal"
            options={consejos} // Opciones formateadas desde el backend
            isMulti // Permitir múltiples selecciones
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
        <div>
          <label htmlFor="fechaUltimaEleccion" className="block text-sm font-medium">
            Fecha de Última Elección
          </label>
          <input
            type="date"
            id="fechaUltimaEleccion"
            name="fechaUltimaEleccion"
            value={formData.fechaUltimaEleccion}
            onChange={handleChange}
            required
            className="block w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="municipio" className="block text-sm font-medium">
            Municipio
          </label>
          <input
            type="text"
            id="municipio"
            name="municipio"
            value={formData.municipio}
            onChange={handleChange}  
            className="block w-full border px-4 py-2 rounded-md"       
            />
            </div>
            <div>
              <label htmlFor="parroquia" className="block text-sm font-medium">
                Parroquia
              </label>
              <input
                type="text"
                id="parroquia"
                name="parroquia"
                value={formData.parroquia}
                onChange={handleChange}
                required
                className="block w-full border px-4 py-2 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="nombreVocero" className="block text-sm font-medium">
                Nombre y Apellidos del Vocero
              </label>
              <input
                type="text"
                id="nombreVocero"
                name="nombreVocero"
                value={formData.nombreVocero}
                onChange={handleChange}
                required
                className="block w-full border px-4 py-2 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="ciVocero" className="block text-sm font-medium">
                Cédula de Identidad del Vocero
              </label>
              <input
                type="text"
                id="ciVocero"
                name="ciVocero"
                value={formData.ciVocero}
                onChange={handleChange}
                required
                className="block w-full border px-4 py-2 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium">
                Teléfono del Vocero
              </label>
              <input
                type="text"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                className="block w-full border px-4 py-2 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="cantidadConsejosComunales" className="block text-sm font-medium">
                Cantidad de C.C que Integran la Comuna
              </label>
              <input
                type="number"
                id="cantidadConsejosComunales"
                name="cantidadConsejosComunales"
                value={formData.cantidadConsejosComunales}
                onChange={handleChange}
                required
                className="block w-full border px-4 py-2 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="poblacionVotante" className="block text-sm font-medium">
                Población Votante
              </label>
              <input
                type="number"
                id="poblacionVotante"
                name="poblacionVotante"
                value={formData.poblacionVotante}
                onChange={handleChange}
                required
                className="block w-full border px-4 py-2 rounded-md"
              />
            </div>      
          </form>
          <div className="flex justify-center pt-6">
            <Button onClick={handleSubmit} title="Registrar Comuna"></Button>
          </div>
        </div>
      );
    };
    
    export default RegisterComunaPage;
    
