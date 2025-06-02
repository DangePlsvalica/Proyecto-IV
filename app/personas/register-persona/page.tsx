"use client";
import React, { useState } from "react";
import Button from "@/components/Button";
import FormInput from '@/components/FormInput'
import { useRegisterPersona } from '@/hooks/useRegisterPersona';
import toast from "react-hot-toast";
import Tittle from "@/components/Tittle";
import { PersonaFormData } from "@/hooks/interfaces/persona.interface";

const RegisterPersonaPage = () => {
  
  const { mutate: registerPersona, isPending } = useRegisterPersona();
  const [formData, setFormData] = useState<PersonaFormData>({
    nombres: "",
    apellidos: "",
    juridica: false,
    ci: "", 
    rif: "",
    telefono: "",
  });

  // Manejar el cambio en los campos del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      setFormData({
        ...formData,
        [name]: e.target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones condicionales
    if (!formData.nombres || !formData.apellidos || !formData.telefono) {
      toast.error("Por favor completa todos los campos requeridos.");
      return;
    }

    if (formData.juridica) {
      // juridica true -> rif requerido
      if (!formData.rif) {
        toast.error("Por favor ingresa el RIF.");
        return;
      }
    } else {
      // juridica false -> ci requerido
      if (!formData.ci) {
        toast.error("Por favor ingresa la cédula.");
        return;
      }
    }

    try {
       await registerPersona(formData);
      toast.success("Persona registrada con éxito");
    } catch (err) {
      console.error(err);
      toast.error("Error al registrar la persona.");
    }
  };


  return (
    <div className="animate-fade-in opacity-0 mx-auto my-1 w-[450px] px-8 py-6 border border-sky-200 rounded-xl bg-[#f8f8f8]">
      <Tittle title={"Registrar una nueva Persona"}></Tittle>
      <form onSubmit={handleSubmit} className="pt-6 px-10 space-y-2">
        <FormInput 
          label={"Nombres"} 
          id={"nombres"} 
          value={formData.nombres} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <FormInput 
          label={"Apellidos"} 
          id={"apellidos"} 
          value={formData.apellidos} 
          onChange={handleChange}
          required={true}>
        </FormInput>
        <div className="flex items-center space-x-2">
          <label htmlFor="juridica">¿Es persona jurídica?</label>
          <input
            type="checkbox"
            id="juridica"
            name="juridica"
            checked={formData.juridica}
            onChange={handleChange}
          />
        </div>
        {formData.juridica ? (
          <FormInput
            label="RIF"
            id="rif"
            value={formData.rif ?? ""}
            onChange={handleChange}
            required
          />
        ) : (
          <FormInput
            label="Cédula"
            id="ci"
            value={formData.ci ?? ""}
            onChange={handleChange}
            required
          />
        )}
        <FormInput 
          label={"Nro de Telefono"} 
          id={"telefono"} 
          value={formData.telefono} 
          onChange={handleChange}
          required={true}>
        </FormInput>
          </form>
          <div className="flex justify-center pt-6">
            <Button 
              onClick={handleSubmit} 
              title={isPending ? "Registrando..." : "Registrar Persona"}>
            </Button>
          </div>
        </div>
      );
    };
    
    export default RegisterPersonaPage;